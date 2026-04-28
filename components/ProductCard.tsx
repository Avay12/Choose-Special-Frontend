"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  component?: React.ComponentType<Record<string, unknown>>;
  defaults?: Record<string, unknown>;
  category: string;
  isBestseller?: boolean;
  isNew?: boolean;
  isInvitation?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export default function ProductCard({
  product,
  className,
  index = 0,
}: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const favorited = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image || "",
      category: product.category,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group flex flex-col bg-card rounded-[2rem] overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300",
        className,
      )}
    >
      <Link
        href={`/product/${product.id}`}
        className={cn(
          "block relative overflow-hidden bg-muted",
          className?.includes("flex-row") ? "w-1/3 h-full" : "aspect-[4/5]",
        )}
      >
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isBestseller && (
            <div className="bg-[#e3c18b] text-[#5e4b2d] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              Bestseller
            </div>
          )}
          {product.isNew && (
            <div className="bg-[#e26b58] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              New
            </div>
          )}
          {product.isInvitation && (
            <div className="bg-[#5c6bc0] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              Invitation
            </div>
          )}
        </div>

        {product.component ? (
          <div className="absolute inset-0 bg-muted/30 overflow-hidden flex items-center justify-center group-hover:bg-card transition-colors duration-700">
            <div className="w-[480px] pointer-events-none transform scale-[0.4] sm:scale-[0.45] lg:scale-[0.5] origin-center transition-transform duration-700 group-hover:scale-[0.45] sm:group-hover:scale-[0.5] lg:group-hover:scale-[0.55]">
              <product.component {...(product.defaults || {})} />
            </div>
            {/* Subtle overlay to soften the preview */}
            <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
          </div>
        ) : product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Preview</span>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300",
              favorited
                ? "bg-primary text-white"
                : "bg-card/80 text-foreground hover:bg-primary hover:text-white",
            )}
          >
            <Heart className={cn("w-5 h-5", favorited && "fill-current")} />
          </button>
          <button
            onClick={handleAddToCart}
            className={cn(
              "p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300",
              isAdded
                ? "bg-green-500 text-white"
                : "bg-card/80 text-foreground hover:bg-primary hover:text-white",
            )}
          >
            {isAdded ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </Link>

      <div
        className={cn(
          "p-6 flex flex-col gap-1.5 bg-card",
          className?.includes("flex-row") ? "justify-center flex-1" : "",
        )}
      >
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-foreground font-bold mt-1 text-lg">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}
