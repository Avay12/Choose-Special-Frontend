"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useMemo } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";
import { useTemplates } from "@/lib/hooks/useTemplates";

export default function FavoritesPage() {
  const { favorites } = useStore();
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

  const favoritedProducts = useMemo(() => {
    return allTemplates.filter((p) => favorites.includes(p.id));
  }, [favorites, allTemplates]);

  if (favoritedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">
            No favorites yet
          </h1>
          <p className="text-muted-foreground mb-12">
            Save the items you love by tapping the heart icon.
          </p>
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            Browse Occasions <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Your Favorites
          </h1>
          <p className="text-lg text-muted-foreground">
            All the cards and invitations you've loved.
          </p>
        </div>
        <div className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
          {favoritedProducts.length}{" "}
          {favoritedProducts.length === 1 ? "Item" : "Items"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {favoritedProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
