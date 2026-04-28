"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Tag } from "lucide-react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTemplates } from "@/lib/hooks/useTemplates";

// ─── Build a flat, searchable list of occasions + templates ──────────────────

interface SearchItem {
  type: "occasion" | "template";
  occasionSlug: string;
  occasionLabel: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  href: string;
  emoji: string;
}

type TemplateIndexItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const OCCASION_EMOJIS: Record<string, string> = {
  anniversary: "💍",
  valentine: "❤️",
  wedding: "💒",
  birthday: "🎂",
  "thank-you": "🙏",
  congratulations: "🎉",
  seasonal: "🍂",
  "baby-shower": "🍼",
  graduation: "🎓",
  sympathy: "🕊️",
  christmas: "🎄",
  "new-year": "🎆",
  thanksgiving: "🦃",
  diwali: "🪔",
  dussehra: "🏹",
};

const OCCASION_LABELS: Record<string, string> = {
  anniversary: "Anniversary",
  valentine: "Valentine's Day",
  wedding: "Wedding",
  birthday: "Birthday",
  "thank-you": "Thank You",
  congratulations: "Congratulations",
  seasonal: "Seasonal",
  "baby-shower": "Baby Shower",
  graduation: "Graduation",
  sympathy: "Sympathy",
  christmas: "Christmas",
  "new-year": "New Year",
  thanksgiving: "Thanksgiving",
  diwali: "Diwali",
  dussehra: "Dussehra",
};

const buildSearchIndex = (
  groupedByCategory: Record<string, Record<string, TemplateIndexItem>>,
): SearchItem[] => {
  const items: SearchItem[] = [];

  Object.entries(groupedByCategory).forEach(([slug, templates]) => {
    const label = OCCASION_LABELS[slug] ?? slug;
    const emoji = OCCASION_EMOJIS[slug] ?? "🎴";

    // Add the occasion itself
    items.push({
      type: "occasion",
      occasionSlug: slug,
      occasionLabel: label,
      href: `/occasions/${slug}`,
      emoji,
    });

    // Add each template under that occasion
    Object.values(templates).forEach((template) => {
      items.push({
        type: "template",
        occasionSlug: slug,
        occasionLabel: label,
        id: template.id,
        name: template.name,
        description: template.description,
        price: template.price,
        href: `/occasions/${slug}?template=${template.id}`,
        emoji,
      });
    });
  });

  return items;
};

// Popular occasions to show when query is empty
const POPULAR_OCCASIONS = [
  { slug: "birthday", label: "Birthday", emoji: "🎂" },
  { slug: "anniversary", label: "Anniversary", emoji: "💍" },
  { slug: "wedding", label: "Wedding", emoji: "💒" },
  { slug: "valentine", label: "Valentine's Day", emoji: "❤️" },
  { slug: "graduation", label: "Graduation", emoji: "🎓" },
  { slug: "thank-you", label: "Thank You", emoji: "🙏" },
  { slug: "baby-shower", label: "Baby Shower", emoji: "🍼" },
  { slug: "congratulations", label: "Congratulations", emoji: "🎉" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useStore();
  const { groupedByCategory } = useTemplates();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, [setSearchOpen]);

  const searchIndex = useMemo(
    () => buildSearchIndex(groupedByCategory),
    [groupedByCategory],
  );

  // Filter results based on query
  const results =
    query.trim().length >= 1
      ? searchIndex.filter((item) => {
          const q = query.toLowerCase();
          return (
            item.occasionLabel.toLowerCase().includes(q) ||
            item.occasionSlug.toLowerCase().includes(q) ||
            item.name?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
          );
        }).slice(0, 8) // Cap at 8 results
      : [];

  const occasionResults = results.filter((r) => r.type === "occasion");
  const templateResults = results.filter((r) => r.type === "template");

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
      handleClose();
    },
    [router, handleClose],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleNavigate(results[0].href);
    } else if (query.trim()) {
      handleNavigate(`/occasions?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex flex-col items-center glass bg-background/90"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-muted hover:bg-primary/10 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-foreground/70" />
          </button>

          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-2xl px-4 mt-20 flex flex-col"
          >
            {/* Search label */}
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Find the perfect card
            </p>

            {/* Search box */}
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search occasions, templates..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-card border-2 border-border rounded-full py-4 pl-14 pr-14 text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-all shadow-xl shadow-black/5"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Results dropdown */}
            <AnimatePresence mode="wait">
              {query.trim().length >= 1 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="mt-3 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
                >
                  {results.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-lg font-semibold text-foreground/60">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try searching for &ldquo;birthday&rdquo; or
                        &ldquo;anniversary&rdquo;
                      </p>
                      <Link
                        href="/occasions"
                        onClick={handleClose}
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:underline"
                      >
                        Browse all occasions{" "}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div>
                      {/* Occasion hits */}
                      {occasionResults.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-5 pt-4 pb-2">
                            Occasions
                          </p>
                          {occasionResults.map((item) => (
                            <button
                              key={item.occasionSlug}
                              onClick={() => handleNavigate(item.href)}
                              className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-primary/5 transition-colors text-left group"
                            >
                              <span className="text-2xl w-9 h-9 flex items-center justify-center bg-primary/10 rounded-xl shrink-0">
                                {item.emoji}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {item.occasionLabel}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Browse all templates
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Template hits */}
                      {templateResults.length > 0 && (
                        <div
                          className={
                            occasionResults.length > 0
                              ? "border-t border-border/60"
                              : ""
                          }
                        >
                          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-5 pt-4 pb-2">
                            Templates
                          </p>
                          {templateResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate(item.href)}
                              className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-primary/5 transition-colors text-left group"
                            >
                              <span className="text-xl w-9 h-9 flex items-center justify-center bg-muted rounded-xl shrink-0">
                                {item.emoji}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                                    <Tag className="w-2.5 h-2.5" />
                                    {item.occasionLabel}
                                  </span>
                                  {item.price !== undefined && (
                                    <span className="text-xs text-muted-foreground">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* View all link */}
                      <div className="border-t border-border/60 px-5 py-3">
                        <Link
                          href={`/occasions?q=${encodeURIComponent(query)}`}
                          onClick={handleClose}
                          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        >
                          <Search className="w-3.5 h-3.5" />
                          See all results for &ldquo;{query}&rdquo;
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* Empty state: popular occasions */
                <motion.div
                  key="popular"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mt-8"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    Popular Occasions
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {POPULAR_OCCASIONS.map((occasion) => (
                      <Link
                        key={occasion.slug}
                        href={`/occasions/${occasion.slug}`}
                        onClick={handleClose}
                        className="flex flex-col items-center gap-2.5 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all group cursor-pointer"
                      >
                        <span className="text-3xl">{occasion.emoji}</span>
                        <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors text-center leading-tight">
                          {occasion.label}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/occasions"
                    onClick={handleClose}
                    className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    Browse all occasions <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
