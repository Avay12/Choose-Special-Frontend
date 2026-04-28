"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Loader2, ArrowRight } from "lucide-react";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import api from "@/lib/api";
import { AudioPlayerBar } from "@/components/templates/AudioPicker";
import { BACKGROUND_SCENES } from "@/lib/data/backgrounds";
import { SceneBackground } from "@/components/templates/SceneBackground";
import { useTemplates } from "@/lib/hooks/useTemplates";
import DynamicTemplateRenderer from "@/components/templates/DynamicTemplateRenderer";

export default function PreviewPage() {
  const params = useParams();
  const code = params.code as string;
  const { templates } = useTemplates();

  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (code.length > 20) {
          try {
            const jsonStr = decodeURIComponent(atob(code));
            const parsed = JSON.parse(jsonStr);
            setDbData(parsed);
            setLoading(false);
            return;
          } catch (e) {
            // Not base64, continue to DB fetch
          }
        }
        
        const response = await api.get(`/cards/${code}`);
        const card = response.data;

        setDbData({
          id: card.template_id,
          fields: JSON.parse(card.custom_data || "{}"),
          isFromDb: true,
          dbCard: card,
        });
      } catch (err) {
        console.error("Failed to fetch card:", err);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      if (typeof window !== "undefined") {
        fetchData();
      }
    }
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">
          Loading your special greeting...
        </p>
      </div>
    );
  }

  if (!dbData) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Card Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg text-center">
          The greeting card link might be broken or expired.
        </p>
        <Link
          href="/occasions"
          className="bg-primary text-white font-bold px-8 py-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          Browse All Cards
        </Link>
      </div>
    );
  }

  const TemplateComponent = (TEMPLATE_COMPONENTS as any)[dbData.id];
  const matchedTemplate = templates.find((template) => template.id === dbData.id);
  const audioUrl = dbData.fields?.audioUrl;
  const trackName = dbData.fields?.audioTrackName;
  const sceneId = dbData.fields?.bgSceneId || "none";
  const scene = BACKGROUND_SCENES.find((s) => s.id === sceneId) ?? BACKGROUND_SCENES[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] relative w-full flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{ ...scene.style }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />
      {/* Animated particle scene */}
      <SceneBackground type={scene.sceneType} />
      
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22 }}
        className="relative w-full max-w-sm flex flex-col gap-4 z-10 mx-auto"
      >
        {/* Template */}
        <div className="rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative z-50">
          {TemplateComponent ? (
            <TemplateComponent {...dbData.fields} />
          ) : (
            <DynamicTemplateRenderer
              templateName={matchedTemplate?.name || "Dynamic Template"}
              layout={matchedTemplate?.layout}
              data={dbData.fields || {}}
            />
          )}
        </div>

        {/* Audio player — auto-plays */}
        {audioUrl && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="z-50">
            <AudioPlayerBar src={audioUrl} label={trackName || "Audio Message"} autoPlay />
          </motion.div>
        )}
      </motion.div>

      {/* CTA at the bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center z-50"
      >
        <Link
          href="/occasions"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-xl shadow-black/20 border border-white/20"
        >
          <Gift className="w-4 h-4" />
          Create your own greeting card
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
