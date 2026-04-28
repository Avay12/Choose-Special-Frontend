"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductCard";
import { useTemplates } from "@/lib/hooks/useTemplates";

export default function Home() {
  const [activeTab, setActiveTab] = useState("All");
  const { templates } = useTemplates();

  const allTemplates = useMemo(() => {
    return templates.map(
      (t): Product => ({
        id: t.id,
        title: t.name,
        price: t.price,
        image: t.image,
        component: t.component,
        defaults: t.defaults,
        category: t.categorySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        isNew: t.isNew,
        isBestseller: t.isBestseller,
      }),
    );
  }, [templates]);

  const CATEGORY_TABS = useMemo(() => {
    const categories = [
      "All",
      ...Array.from(new Set(templates.map((t) => t.categorySlug))).map((c) =>
        c.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      ),
    ];
    return categories;
  }, [templates]);

  const filteredProducts = useMemo(() => {
    return activeTab === "All"
      ? allTemplates
      : allTemplates.filter((p) => p.category === activeTab);
  }, [activeTab, allTemplates]);

  return (
    <div className="flex flex-col gap-24 mb-24">
      {/* 1. Hero Section */}
      <section className="relative px-4 container mx-auto">
        <div className="glass-card mt-8 md:mt-12 overflow-hidden relative min-h-[60vh] md:min-h-[70vh] flex items-center">
          {/* Abstract background blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="grid md:grid-cols-2 gap-8 items-center z-10 p-8 md:p-16 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-primary" /> 10,000+ Happy
                Customers
              </div>
              <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
                Say It With <br />
                <span className="text-gradient">Feeling.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Handcrafted greeting cards for every special moment. Premium
                paper, thoughtful designs, delivered with love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#collection"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 hover:gap-4 shadow-lg shadow-primary/30"
                >
                  Shop Collection <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden md:block h-[500px]"
            >
              {/* Stacked Cards Animation */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [5, 7, 5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 w-64 h-80 bg-card rounded-2xl shadow-xl border border-border p-4 z-10"
              >
                <div className="w-full h-full bg-secondary/10 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">🎂</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [-10, -12, -10] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-20 left-10 w-64 h-80 bg-card rounded-2xl shadow-xl border border-border p-4 z-20"
              >
                <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-center">
                  <h1 className="font-heading font-black text-3xl leading-none text-primary">
                    THANK YOU
                  </h1>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Our Collection Section */}
      <section id="collection" className="container mx-auto px-4 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-primary font-bold tracking-widest text-sm uppercase mb-3">
            CURATED SELECTION
          </p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-4 tracking-tighter">
            Our Collection
          </h2>
          <p className="text-muted-foreground text-xl">
            Find the perfect card or invitation for every moment
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition-all duration-300 whitespace-nowrap
                ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-xl shadow-primary/25 -translate-y-0.5"
                    : "bg-muted text-foreground/70 hover:bg-muted/80 hover:text-primary border border-border"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid with Animation */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State / No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-32 text-muted-foreground bg-muted/30 rounded-[3rem] border-2 border-dashed">
            <p className="text-2xl font-bold">Check back soon!</p>
            <p className="mt-2">
              We're currently designing new cards for this collection.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
