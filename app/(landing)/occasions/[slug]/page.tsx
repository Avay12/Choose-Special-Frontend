"use client";

import { motion } from "framer-motion";
import ProductCard, { Product } from "@/components/ProductCard";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import CustomSelect from "@/components/common/CustomSelect";
import { useTemplates } from "@/lib/hooks/useTemplates";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const { groupedByCategory } = useTemplates();

  const sortOptions = [
    { value: "featured", label: "Sort by: Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  const categoryName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Category";

  // Get templates for this category
  const categoryTemplates = groupedByCategory[slug] || {};
  const templatesArray: Product[] = Object.values(categoryTemplates).map((template) => ({
    id: template.id,
    title: template.name,
    price: template.price,
    image: template.image,
    component: template.component,
    defaults: template.defaults,
    category: categoryName,
    isNew: template.isNew,
    isBestseller: template.isBestseller,
  }));

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs & Header */}
      <div className="mb-12">
        <Link
          href="/occasions"
          className="inline-flex items-center text-sm text-[#e26b58] hover:underline mb-8 font-bold tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Occasions
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-5xl md:text-6xl font-black mb-4 text-foreground tracking-tight">
              {categoryName} <span className="text-[#e26b58]">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose from our curated collection of premium{" "}
              {categoryName.toLowerCase()} designs. Each template is fully
              customizable for your special moment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* View Toggle */}
            <div className="flex bg-muted p-1 rounded-2xl border border-black/5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-2xl text-sm font-bold hover:bg-muted transition-all shadow-sm">
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>

            <CustomSelect
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="w-56"
            />
          </motion.div>
        </div>
      </div>

      {/* Grid / List View */}
      {templatesArray.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
              : "flex flex-col gap-6"
          }
        >
          {templatesArray.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              className={viewMode === "list" ? "flex-row h-48" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-muted/30 rounded-[3rem] border-2 border-dashed border-muted">
          <h3 className="text-2xl font-bold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            We're currently working on new designs for this occasion. Check back
            soon!
          </p>
          <Link
            href="/occasions"
            className="inline-block mt-8 text-[#e26b58] font-bold hover:underline"
          >
            Explore other occasions
          </Link>
        </div>
      )}

      {/* Stats / Info Footer */}
      <div className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-12">
          <div>
            <p className="text-3xl font-black text-foreground">
              {templatesArray.length}
            </p>
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Designs Available
            </p>
          </div>
          <div className="w-[1px] h-12 bg-black/5" />
          <div>
            <p className="text-3xl font-black text-foreground">Premium</p>
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Quality Level
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-medium text-center md:text-right">
          All templates include high-resolution export <br /> and full
          responsiveness.
        </p>
      </div>
    </div>
  );
}
