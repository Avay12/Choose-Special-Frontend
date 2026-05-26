"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Share2,
  Edit3,
  Eye,
  Loader2,
  Heart,
  Gift,
  Smile,
  Gem,
  PartyPopper,
  Snowflake,
  Sparkles,
  Baby,
  GraduationCap,
  Flower2,
  Bell,
  Stars,
  Leaf,
  Flame,
  Sword,
  ArrowRight,
  ShoppingCart,
  X,
  PlayCircle,
  Wallet,
  Music,
  Mic,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import AudioPicker, { AudioPlayerBar } from "@/components/templates/AudioPicker";
import BackgroundPicker from "@/components/templates/BackgroundPicker";
import { BACKGROUND_SCENES } from "@/lib/data/backgrounds";
import { SceneBackground } from "@/components/templates/SceneBackground";
import { useTemplates } from "@/lib/hooks/useTemplates";
import DynamicTemplateRenderer from "@/components/templates/DynamicTemplateRenderer";
import AnimationPicker, { ANIMATION_OPTIONS } from "@/components/templates/AnimationPicker";

// ─── Pricing add-ons (mirrors backend GetCardPricing) ───────────────────────
const MUSIC_TRACK_ADDON = 1.0;    // preset music track
const VOICE_RECORDING_ADDON = 2.0; // user-uploaded voice recording

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
  const scene = BACKGROUND_SCENES.find((s) => s.id === sceneId) ?? BACKGROUND_SCENES[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{ ...scene.style, zIndex: 100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />
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
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Label */}
        <div className="text-center z-50">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest shadow-lg">
            <Eye className="w-3 h-3" /> Recipient Demo
          </span>
        </div>

        {/* Template */}
        <div className="rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative z-50">
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="z-50">
            <AudioPlayerBar src={audioUrl} label={trackName || "Audio Message"} autoPlay />
          </motion.div>
        )}

        <p className="text-center text-white/70 text-xs drop-shadow z-50 shadow-black">
          This is exactly how your recipient will see the card
        </p>
      </motion.div>
    </motion.div>
  );
}

const CATEGORIES = [
  {
    name: "Valentine",
    slug: "valentine",
    description:
      "Express your love with romantic cards and invitations for your special someone.",
    icon: Heart,
    image: "/images/products/valentine.png",
    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-500",
    hoverColor: "group-hover:text-rose-500",
  },
  {
    name: "Birthday",
    slug: "birthday",
    description:
      "Celebrate another trip around the sun with our beautiful birthday cards.",
    icon: Gift,
    image: "/images/products/birthday.png",
    bgColor: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-500",
    hoverColor: "group-hover:text-red-500",
  },
  {
    name: "Wedding",
    slug: "wedding",
    description: "Elegant invitations and cards for the most beautiful unions.",
    icon: Gem,
    image: "/images/products/wedding.png",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500",
    hoverColor: "group-hover:text-amber-500",
  },
  {
    name: "Thank You",
    slug: "thank-you",
    description: "Express gratitude with elegance. Cards that say it all.",
    icon: Smile,
    image: "/images/products/thankyou.png",
    bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500",
    hoverColor: "group-hover:text-indigo-500",
  },
  {
    name: "Congratulations",
    slug: "congratulations",
    description: "Mark achievements and milestones in style.",
    icon: PartyPopper,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500",
    hoverColor: "group-hover:text-teal-500",
  },
  {
    name: "Seasonal",
    slug: "seasonal",
    description: "Holiday and seasonal greetings for every time of year.",
    icon: Snowflake,
    image:
      "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
    hoverColor: "group-hover:text-blue-500",
  },
  {
    name: "Anniversary",
    slug: "anniversary",
    description:
      "Celebrate years of love and partnership with our elegant cards.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    hoverColor: "group-hover:text-yellow-600",
  },
  {
    name: "Baby Shower",
    slug: "baby-shower",
    description: "Welcome the little ones with adorable cards and invitations.",
    icon: Baby,
    image:
      "https://images.unsplash.com/photo-1594300907312-c6603f83b2c6?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    hoverColor: "group-hover:text-emerald-500",
  },
  {
    name: "Graduation",
    slug: "graduation",
    description: "Honoring achievements and bright futures ahead.",
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-blue-600/10 dark:bg-blue-600/20",
    iconColor: "text-blue-600",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    name: "Sympathy",
    slug: "sympathy",
    description: "Thoughtful messages of support during difficult times.",
    icon: Flower2,
    image:
      "https://images.unsplash.com/photo-1547098842-dcdd773e3390?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-slate-500/10 dark:bg-slate-500/20",
    iconColor: "text-slate-500",
    hoverColor: "group-hover:text-slate-500",
  },
  {
    name: "Christmas",
    slug: "christmas",
    description:
      "Spread festive cheer with our magical holiday card collection.",
    icon: Bell,
    image:
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-red-600/10 dark:bg-red-600/20",
    iconColor: "text-red-600",
    hoverColor: "group-hover:text-red-600",
  },
  {
    name: "New Year",
    slug: "new-year",
    description:
      "Ring in a fresh start with sparkling resolutions and greetings.",
    icon: Stars,
    image:
      "https://images.unsplash.com/photo-1573690706484-86f444f0b940?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-violet-600/10 dark:bg-violet-600/20",
    iconColor: "text-violet-600",
    hoverColor: "group-hover:text-violet-600",
  },
  {
    name: "Thanksgiving",
    slug: "thanksgiving",
    description: "Share your blessings and gratitude with family and friends.",
    icon: Leaf,
    image:
      "https://images.unsplash.com/photo-1510194638421-92f54ce46444?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-orange-600/10 dark:bg-orange-600/20",
    iconColor: "text-orange-600",
    hoverColor: "group-hover:text-orange-600",
  },
  {
    name: "Diwali",
    slug: "diwali",
    description:
      "Light up the lives of your loved ones with festive Diwali cards.",
    icon: Flame,
    image:
      "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    hoverColor: "group-hover:text-orange-500",
  },
  {
    name: "Dussehra",
    slug: "dussehra",
    description:
      "Celebrate the victory of good over evil with our special cards.",
    icon: Sword,
    image:
      "https://images.unsplash.com/photo-1698205352833-a4c25ef0a4f0?auto=format&fit=crop&q=80&w=400&h=400",
    bgColor: "bg-rose-600/10 dark:bg-rose-600/20",
    iconColor: "text-rose-600",
    hoverColor: "group-hover:text-rose-600",
  },
];

type ViewState = "categories" | "products" | "details";

export default function GenerateLinkPage() {
  const { user, checkAuth } = useAuthStore();
  const { addToCart, cart } = useStore();
  const { templates } = useTemplates();

  // State
  const [currentView, setCurrentView] = useState<ViewState>("categories");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Detail View State
  const [activeTab, setActiveTab] = useState<"preview" | "customize">(
    "preview",
  );
  const [customData, setCustomData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState("none");

  const isInCart = selectedProduct
    ? cart.some((item) => item.id === selectedProduct.id)
    : false;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price || 0,
      image: selectedProduct.image || "",
      category: selectedProduct.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Computed data
  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return templates
      .filter((template) => template.categorySlug === selectedCategory.slug)
      .map((template) => ({
        ...template,
        category: selectedCategory.name,
      }));
  }, [selectedCategory, templates]);

  useEffect(() => {
    if (selectedProduct?.defaults) {
      setCustomData(selectedProduct.defaults);
    }
    // Reset share URL when changing products
    setShareUrl(null);
    setActiveTab("preview");
  }, [selectedProduct]);

  // Handlers
  const handleCategorySelect = (category: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(category);
    setCurrentView("products");
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setCurrentView("details");
  };

  const handleBack = () => {
    if (currentView === "details") {
      setCurrentView("products");
    } else if (currentView === "products") {
      setCurrentView("categories");
      setSelectedCategory(null);
    }
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

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  // ── Computed price (base + audio add-ons) ──────────────────────────────────
  const computedPrice = useMemo(() => {
    let price = selectedProduct?.price || 0;
    
    // Add Animation Price
    const animObj = ANIMATION_OPTIONS.find(a => a.id === (customData.animationType || "envelope"));
    if (animObj) {
      price += animObj.price;
    }

    if (customData.audioUrl) {
      // audioTrackName is set for preset tracks; absent for user-uploaded recordings
      if (customData.audioTrackName) {
        price += MUSIC_TRACK_ADDON;
      } else {
        price += VOICE_RECORDING_ADDON;
      }
    }
    return price;
  }, [selectedProduct, customData.audioUrl, customData.audioTrackName, customData.animationType]);

  const canAfford = !!user && user.credit >= computedPrice;
  const shortfall = Math.max(0, computedPrice - (user?.credit || 0));

  const saveAndGenerateLink = async () => {
    if (!user) {
      alert("Please login first.");
      return;
    }
    if (!canAfford) return; // button is hidden, safety guard

    setIsSaving(true);
    try {
      const response = await api.post("/cards", {
        template_id: selectedProduct.id,
        title: selectedProduct.name,
        description: selectedProduct.description,
        image_url: selectedProduct.image,
        occasion: selectedProduct.category,
        price: computedPrice,          // send computed total (includes add-ons)
        custom_data: JSON.stringify(customData),
      });

      // Backend now returns { card, order }
      const cardId = response.data.card?.id ?? response.data.id;
      const url = `${window.location.protocol}//${window.location.host}/preview/${cardId}`;
      setShareUrl(url);

      // Refresh balance so UI reflects the deduction immediately
      await checkAuth();
    } catch (error: any) {
      console.error("Failed to save and share card:", error);
      alert(error.response?.data?.error || "Failed to generate link.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Dynamic Header/Breadcrumb */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Generate Link</h1>
        {currentView === "categories" ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Select an occasion to browse available templates.
          </p>
        ) : (
          <button
            onClick={handleBack}
            className="mt-4 flex items-center text-sm font-bold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to{" "}
            {currentView === "details" ? selectedCategory?.name : "Occasions"}
          </button>
        )}
      </div>

      {/* VIEW 1: Categories (Occasions) */}
      {currentView === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
                onClick={() => handleCategorySelect(category)}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "group relative overflow-hidden rounded-[2rem] p-8 transition-all hover:shadow-xl hover:-translate-y-1 border border-border/50 min-h-[250px] flex flex-col",
                    category.bgColor,
                  )}
                >
                  <div className="absolute top-0 right-0 w-32 h-40 opacity-80 mix-blend-multiply pointer-events-none overflow-hidden rounded-bl-3xl z-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-card/50 z-10" />
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      className="object-cover object-right-top opacity-50 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="relative z-20 flex flex-col flex-1">
                    <div className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-2xl shadow-sm border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={cn("w-5 h-5", category.iconColor)} />
                    </div>
                    <div className="mt-auto">
                      <h2
                        className={cn(
                          "font-heading text-xl font-bold text-foreground mb-2 transition-colors",
                          category.hoverColor,
                        )}
                      >
                        {category.name}
                      </h2>
                      <p className="text-muted-foreground/90 text-sm md:text-xs pr-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div
                        className={cn(
                          "mt-4 flex items-center text-xs font-bold tracking-widest uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300",
                          category.iconColor,
                        )}
                      >
                        Select <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Products List */}
      {currentView === "products" && categoryProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product, i) => {
            const TemplateComponent = TEMPLATE_COMPONENTS[product.id];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleProductSelect(product)}
                className="group flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary transition-all duration-300 cursor-pointer"
              >
                <div className="block relative overflow-hidden bg-muted aspect-[4/5]">
                  {TemplateComponent ? (
                    <div className="absolute inset-0 bg-muted/30 overflow-hidden flex items-center justify-center group-hover:bg-card transition-colors duration-700">
                      <div className="w-[480px] pointer-events-none transform scale-[0.4] sm:scale-[0.45] origin-center transition-transform duration-700 group-hover:scale-[0.48]">
                        <TemplateComponent {...(product.defaults || {})} />
                      </div>
                      <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
                    </div>
                  ) : product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                      Preview
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-1.5 bg-card">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    {product.category}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-foreground font-bold mt-1 text-lg">
                    ${product.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {currentView === "products" && categoryProducts.length === 0 && (
        <div className="py-20 text-center text-muted-foreground rounded-2xl border border-dashed border-border">
          No templates available for this category yet.
        </div>
      )}

      {/* VIEW 3: Detail & Generation (Refactored from ProductPage) */}
      {currentView === "details" && selectedProduct && (
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Col - Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 self-center lg:self-start flex-wrap">
              <div className="flex bg-muted p-1 rounded-2xl w-fit border border-border shadow-inner">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "preview" ? "bg-card shadow-md text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Eye className="w-4 h-4" /> Live Preview
                </button>
                <button
                  onClick={() => setActiveTab("customize")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "customize" ? "bg-card shadow-md text-primary" : "text-muted-foreground hover:text-foreground"}`}
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
                    {TEMPLATE_COMPONENTS[selectedProduct.id] ? (
                      (() => {
                        const Component =
                          TEMPLATE_COMPONENTS[selectedProduct.id];
                        return <Component {...(customData as any)} />;
                      })()
                    ) : (
                      <DynamicTemplateRenderer
                        templateName={selectedProduct.name}
                        layout={selectedProduct.layout}
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
                    className="w-full h-full bg-card rounded-[3rem] p-10 shadow-xl border border-border overflow-y-auto custom-scrollbar"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black tracking-tight text-foreground">
                        Personalize Card
                      </h3>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Edit3 className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {selectedProduct.fields?.map((field: string) => (
                        <div key={field} className="group">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
                            {field.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <input
                            type="text"
                            value={customData[field] || ""}
                            onChange={(e) =>
                              handleInputChange(field, e.target.value)
                            }
                            placeholder={`Enter ${field}...`}
                            className="w-full bg-muted/60 border-2 border-transparent rounded-[1.25rem] p-4 text-sm font-bold text-foreground focus:bg-card focus:border-primary/20 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
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

                      {/* Animation section */}
                      <div className="pt-4 border-t border-border">
                        <AnimationPicker
                          value={customData.animationType || "envelope"}
                          onChange={(val) => handleInputChange("animationType", val)}
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
                        * Your changes update in real-time in the "Live Preview" tab. Click <strong>Demo</strong> to see the full experience as your recipient will.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Col - Details & Generation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center py-6"
          >
            <div className="px-4 py-1.5 bg-primary/10 text-primary w-fit rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 mb-6">
              {selectedProduct.category}
            </div>

            <h1 className="font-heading text-4xl md:text-5xl font-black mb-6 text-foreground leading-tight">
              {selectedProduct.name}
            </h1>

            {/* ── Dynamic price display ─────────────────────────────────── */}
            <div className="flex items-start gap-4 mb-6 flex-wrap">
              <div>
                <p className="text-4xl font-black text-primary tracking-tight">
                  ${computedPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Base: ${(selectedProduct.price || 0).toFixed(2)}
                </p>
              </div>
              {/* Add-on badges */}
              <div className="flex flex-col gap-1.5 mt-1">
                {customData.animationType && customData.animationType !== "envelope" && (() => {
                  const anim = ANIMATION_OPTIONS.find(a => a.id === customData.animationType);
                  if (anim && anim.price > 0) {
                     return (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold border border-blue-500/20">
                         {anim.icon} {anim.name} +${anim.price.toFixed(2)}
                       </span>
                     );
                  }
                  return null;
                })()}
                {customData.audioUrl && (
                  customData.audioTrackName ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-bold border border-violet-500/20">
                      <Music className="w-3 h-3" /> Music +${MUSIC_TRACK_ADDON.toFixed(2)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold border border-orange-500/20">
                      <Mic className="w-3 h-3" /> Voice +${VOICE_RECORDING_ADDON.toFixed(2)}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* ── Wallet balance indicator ──────────────────────────────── */}
            {user && (
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold mb-6 border",
                canAfford
                  ? "bg-green-500/8 border-green-500/20 text-green-700 dark:text-green-400"
                  : "bg-red-500/8 border-red-500/20 text-red-700 dark:text-red-400"
              )}>
                <Wallet className="w-4 h-4 flex-shrink-0" />
                <span>Your balance: <strong>${user.credit.toFixed(2)}</strong></span>
                {!canAfford && (
                  <span className="ml-auto flex items-center gap-1 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Need ${shortfall.toFixed(2)} more
                  </span>
                )}
              </div>
            )}

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
              {selectedProduct.description}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-4">
                  Specifications
                </h4>
                <ul className="space-y-3">
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
            </div>

            {/* Generate & Share Section */}
            <div className="mt-auto border-t border-border pt-8">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full mb-4 py-4 rounded-[1.5rem] font-black text-lg flex justify-center items-center gap-3 transition-all border-2 ${
                  isInCart || addedToCart
                    ? "border-green-500 bg-green-500/10 text-green-500"
                    : "border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : isInCart ? (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Already in Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              {!shareUrl ? (
                canAfford ? (
                  <button
                    onClick={saveAndGenerateLink}
                    disabled={isSaving}
                    className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-primary to-secondary text-white font-black text-xl flex justify-center items-center gap-3 hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all shadow-md group disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {isSaving ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    )}
                    Generate & Share Preview Link
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                  </button>
                ) : (
                  <Link href="/dashboard/payment" className="block">
                    <button className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xl flex justify-center items-center gap-3 hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/25 transition-all shadow-md group relative overflow-hidden">
                      <Wallet className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Load Wallet — need ${shortfall.toFixed(2)} more
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                    </button>
                  </Link>
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-muted rounded-[1.5rem] p-6 border border-border"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-bold text-foreground uppercase tracking-widest">
                      Link Generated Successfully
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-6 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      {copying ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <DemoModal
            templateId={selectedProduct?.id}
            templateName={selectedProduct?.name || "Dynamic Template"}
            layout={selectedProduct?.layout}
            customData={customData}
            audioUrl={customData.audioUrl || null}
            trackName={customData.audioTrackName}
            sceneId={selectedSceneId}
            onClose={() => setShowDemo(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
