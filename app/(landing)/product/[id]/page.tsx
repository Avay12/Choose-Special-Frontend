"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  Share2,
  ShieldQuestion,
  Truck,
  Edit3,
  Eye,
  ShoppingCart,
  Loader2,
  PlayCircle,
  X,
} from "lucide-react";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AudioPicker, {
  AudioPlayerBar,
} from "@/components/templates/AudioPicker";
import BackgroundPicker from "@/components/templates/BackgroundPicker";
import { BACKGROUND_SCENES } from "@/lib/data/backgrounds";
import { SceneBackground } from "@/components/templates/SceneBackground";
import { cn } from "@/lib/utils";
import { useTemplates } from "@/lib/hooks/useTemplates";
import DynamicTemplateRenderer from "@/components/templates/DynamicTemplateRenderer";

// ─── Demo Preview Modal ───────────────────────────────────────────────────────
function DemoModal({
  templateId,
  templateName,
  layout,
  customData,
  audioUrl,
  trackName,
  sceneId,
  onClose,
}: {
  templateId: string;
  templateName: string;
  layout?: Record<string, unknown>;
  customData: Record<string, any>;
  audioUrl: string | null;
  trackName?: string;
  sceneId: string;
  onClose: () => void;
}) {
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];
  const scene =
    BACKGROUND_SCENES.find((s) => s.id === sceneId) ?? BACKGROUND_SCENES[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-hidden"
      style={scene.style}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Animated particle scene */}
      <SceneBackground type={scene.sceneType} />
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 22 }}
        className="relative w-full max-w-sm flex flex-col gap-4"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Label */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest">
            <Eye className="w-3 h-3" /> Recipient Demo
          </span>
        </div>

        {/* Template */}
        <div className="rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          {TemplateComponent ? (
            <TemplateComponent {...(customData as any)} />
          ) : (
            <DynamicTemplateRenderer
              templateName={templateName}
              layout={layout}
              data={customData}
            />
          )}
        </div>

        {/* Audio player — auto-plays when demo opens */}
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AudioPlayerBar
              src={audioUrl}
              label={trackName || "Audio Message"}
              autoPlay
            />
          </motion.div>
        )}

        <p className="text-center text-white/70 text-xs drop-shadow">
          This is exactly how your recipient will see the card
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToCart } = useStore();
  const { templates } = useTemplates();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "customize">(
    "preview",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState("none");

  const handleShareClick = () => {
    if (!user) {
      router.push("/login?redirect=" + window.location.pathname);
      return;
    }
    setShowConfirmSave(true);
  };

  const saveAndGenerateLink = async () => {
    setIsSaving(true);
    try {
      const response = await api.post("/cards", {
        template_id: id,
        title: productData?.name || "Custom Card",
        description: productData?.description || "",
        image_url: productData?.image || "",
        occasion: productData?.category || "",
        price: productData?.price || 0,
        custom_data: JSON.stringify(customData),
      });

      const cardId = response.data.id;
      const url = `${window.location.protocol}//${window.location.host}/preview/${cardId}`;
      setShareUrl(url);
      setShowConfirmSave(false);
    } catch (error) {
      console.error("Failed to save and share card:", error);
      const shareData = { id: id, fields: customData };
      const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
      const url = `${window.location.protocol}//${window.location.host}/preview/${encoded}`;
      setShareUrl(url);
      setShowConfirmSave(false);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const productData = useMemo(() => {
    const matched = templates.find((template) => template.id === id);
    if (!matched) return null;
    return {
      ...matched,
      category: matched.categorySlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    };
  }, [templates, id]);

  const [customData, setCustomData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (productData?.defaults) {
      setCustomData(productData.defaults);
    }
  }, [productData]);

  const TemplateComponent = TEMPLATE_COMPONENTS[id];

  const handleAddToCart = () => {
    if (!productData) return;
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image || "",
      category: productData.category,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudioChange = (audioUrl: string | null, trackName?: string) => {
    setCustomData((prev) => ({
      ...prev,
      audioUrl: audioUrl || undefined,
      audioTrackName: trackName || undefined,
    }));
  };

  const handleBgChange = (sceneId: string) => {
    setSelectedSceneId(sceneId);
    setCustomData((prev) => ({ ...prev, bgSceneId: sceneId }));
  };

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link
          href="/occasions"
          className="text-primary hover:underline font-bold"
        >
          Return to Occasions
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          href={`/occasions/${productData.category.toLowerCase().replace(/ /g, "-")}`}
          className="inline-flex items-center text-sm text-[#e26b58] hover:underline mb-8 font-bold tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to {productData.category}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Left Col - Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Tab bar + Demo button */}
            <div className="flex items-center gap-3 self-center lg:self-start flex-wrap">
              <div className="flex bg-muted p-1 rounded-2xl border border-black/5 shadow-inner">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "preview" ? "bg-white shadow-md text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Eye className="w-4 h-4" /> Live Preview
                </button>
                <button
                  onClick={() => setActiveTab("customize")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "customize" ? "bg-white shadow-md text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Edit3 className="w-4 h-4" /> Customize
                </button>
              </div>

              {/* Demo button */}
              <button
                onClick={() => setShowDemo(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                <PlayCircle className="w-4 h-4" /> Demo
              </button>
            </div>

            <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto perspective-1000">
              <AnimatePresence mode="wait">
                {activeTab === "preview" ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="w-full h-full"
                  >
                    {TemplateComponent ? (
                      <TemplateComponent {...(customData as any)} />
                    ) : (
                      <DynamicTemplateRenderer
                        templateName={productData.name}
                        layout={productData.layout}
                        data={customData}
                      />
                    )}

                    {/* Audio badge on preview */}
                    {customData.audioUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-4 left-4 right-4"
                      >
                        <AudioPlayerBar
                          src={customData.audioUrl}
                          label={customData.audioTrackName}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="customize"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full h-full bg-card rounded-[3rem] p-8 shadow-2xl border border-border overflow-y-auto custom-scrollbar"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black tracking-tight">
                        Personalize Card
                      </h3>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Edit3 className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Text fields */}
                      {productData.fields.map((field) => (
                        <div key={field} className="group">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">
                            {field.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <input
                            type="text"
                            value={customData[field] || ""}
                            onChange={(e) =>
                              handleInputChange(field, e.target.value)
                            }
                            placeholder={`Enter ${field}...`}
                            className="w-full bg-muted/50 border-2 border-transparent rounded-[1.25rem] p-5 text-sm font-bold focus:bg-card focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                          />
                        </div>
                      ))}

                      {/* Background scene */}
                      <div className="pt-4 border-t border-border">
                        <BackgroundPicker
                          value={selectedSceneId}
                          onChange={handleBgChange}
                        />
                      </div>

                      {/* Audio section */}
                      <div className="pt-4 border-t border-border">
                        <AudioPicker
                          value={customData.audioUrl || null}
                          trackName={customData.audioTrackName}
                          onChange={handleAudioChange}
                        />
                      </div>
                    </div>

                    <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-950/20 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-400 leading-relaxed italic">
                        * Your changes update in real-time in the "Live Preview"
                        tab. Click <strong>Demo</strong> to see the full
                        experience as your recipient will.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Col - Details & Purchase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="px-5 py-2 bg-[#e3c18b]/20 text-[#5e4b2d] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#e3c18b]/30">
                {productData.category} • Designer Exclusive
              </div>
              <div className="flex gap-3">
                <button className="p-3.5 border border-black/5 bg-white rounded-full hover:bg-muted/50 hover:shadow-md transition-all text-muted-foreground">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3.5 border border-black/5 bg-white rounded-full hover:bg-muted/50 hover:shadow-md transition-all text-muted-foreground">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-[0.95]">
              {productData.name}
            </h1>

            <div className="flex items-center gap-6 mb-10">
              <p className="text-5xl font-black text-primary tracking-tight">
                ${productData.price.toFixed(2)}
              </p>
              <div className="flex flex-col">
                <p className="text-muted-foreground line-through font-bold text-sm">
                  ${(productData.price + 5).toFixed(2)}
                </p>
                <p className="text-green-600 text-[10px] font-black uppercase tracking-widest">
                  Save 15% Today
                </p>
              </div>
            </div>

            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl font-medium">
              {productData.description}
            </p>

            <div className="grid grid-cols-2 gap-10 mb-14">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-6">
                  Specifications
                </h4>
                <ul className="space-y-4">
                  {[
                    "Double-sided Print",
                    "Premium Cardstock",
                    "Matching Envelope",
                    'A2 Size (4.25 x 5.5")',
                  ].map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-muted-foreground font-bold"
                    >
                      <Check className="w-4 h-4 text-primary bg-primary/10 rounded-full p-0.5" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-6">
                  Service Area
                </h4>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-sm text-foreground font-bold group">
                    <Truck className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    <span className="underline decoration-primary/20 underline-offset-8 decoration-2">
                      Ship in 24 hours
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground font-bold group">
                    <ShieldQuestion className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                    <span className="underline decoration-primary/20 underline-offset-8 decoration-2">
                      Quality Assured
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <div
                className={cn(
                  "flex flex-col gap-4",
                  !shareUrl ? "sm:flex-row sm:items-stretch" : "",
                )}
              >
                <div className="flex items-center border-2 border-black/5 rounded-[1.5rem] overflow-hidden bg-muted/30 p-1 h-[72px] sm:h-auto sm:aspect-square md:aspect-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-muted transition-all text-xl font-black"
                  >
                    -
                  </button>
                  <div className="flex-1 sm:w-16 text-center font-black text-xl">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-muted transition-all text-xl font-black"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={cn(
                    "flex-1 py-5 rounded-[1.5rem] font-black text-xl flex justify-center items-center gap-4 transition-all shadow-xl group relative overflow-hidden",
                    isAdded
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:shadow-primary/40 hover:-translate-y-1",
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-6 h-6 animate-bounce" /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />{" "}
                      Add to Cart
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                </button>

                {!shareUrl && (
                  <button
                    onClick={handleShareClick}
                    disabled={isSaving}
                    className="flex-1 py-5 rounded-[1.5rem] bg-white border-2 border-primary/20 text-primary font-black text-lg flex justify-center items-center gap-3 hover:bg-primary/5 hover:border-primary/40 transition-all shadow-sm hover:-translate-y-1"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                    Generate Link
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showConfirmSave && !shareUrl && (
                  <motion.div
                    key="confirm-save"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="p-8 bg-primary/5 rounded-[2.5rem] border-2 border-primary/10 shadow-xl"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-foreground">
                        Save to your collection?
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium max-w-[280px]">
                        Generating a link will save this customized card to your
                        account settings for later access.
                      </p>
                      <div className="flex gap-3 w-full mt-4">
                        <button
                          onClick={() => setShowConfirmSave(false)}
                          className="flex-1 py-4 px-6 rounded-2xl bg-card border border-border font-bold text-sm hover:bg-muted transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveAndGenerateLink}
                          disabled={isSaving}
                          className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                          Save & Generate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {shareUrl && (
                  <motion.div
                    key="share-url"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-muted/50 rounded-3xl p-6 border border-border overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="w-5 h-5 text-green-500" />
                      <p className="text-sm font-bold text-foreground uppercase tracking-widest">
                        Link Generated Successfully
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary min-w-0"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-6 py-3 sm:py-0 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {copying ? (
                          <>
                            <Check className="w-4 h-4" /> Copied
                          </>
                        ) : (
                          "Copy Link"
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-3 font-medium italic">
                      * Anyone with this link can view your customized card
                      preview.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <DemoModal
            templateId={id}
            templateName={productData.name}
            layout={productData.layout}
            customData={customData}
            audioUrl={customData.audioUrl || null}
            trackName={customData.audioTrackName}
            sceneId={selectedSceneId}
            onClose={() => setShowDemo(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
