"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, Save, Tag, DollarSign, ChevronRight, Layout, Info, FolderCheck } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { CategoryPrice } from "@/types/api";
import { discoverFileSystemTemplates } from "./actions";

type AdminTemplate = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
};

type DiscoveredCategory = {
  name: string;
  templates: string[];
};

export default function CategoryPricesPage() {
  const [prices, setPrices] = useState<CategoryPrice[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [discovered, setDiscovered] = useState<DiscoveredCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryDefaultPrice, setCategoryDefaultPrice] = useState<number>(0);
  
  // Single source of truth for component prices (key is slug)
  const [localPrices, setLocalPrices] = useState<Record<string, number>>({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pricesRes, templatesRes, discoveredFs] = await Promise.all([
        api.get<{ category_prices: CategoryPrice[] }>("/admin/category-prices"),
        api.get<{ templates: AdminTemplate[] }>("/admin/templates"),
        discoverFileSystemTemplates()
      ]);

      setPrices(pricesRes.data.category_prices || []);
      setTemplates(templatesRes.data.templates || []);
      setDiscovered(discoveredFs || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combined list of categories
  const allCategories = useMemo(() => {
    const catsMap: Record<string, { dbCount: number; fsCount: number }> = {};
    discovered.forEach(d => {
      const name = d.name.toLowerCase();
      catsMap[name] = { dbCount: 0, fsCount: d.templates.length };
    });
    templates.forEach(t => {
      const name = t.category.toLowerCase();
      if (!catsMap[name]) catsMap[name] = { dbCount: 1, fsCount: 0 };
      else catsMap[name].dbCount += 1;
    });
    return Object.entries(catsMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [templates, discovered]);

  // When selected category changes, initialize local prices
  useEffect(() => {
    if (!selectedCategory) return;

    // 1. Set Category Default
    const existingPrice = prices.find(p => p.category === selectedCategory);
    setCategoryDefaultPrice(existingPrice?.price || 0);

    // 2. Initialize Local Prices from DB + FS
    const newLocalPrices: Record<string, number> = {};
    
    // Start with FS templates (default 0)
    const fsDisc = discovered.find(d => d.name.toLowerCase() === selectedCategory);
    fsDisc?.templates.forEach(slug => {
      newLocalPrices[slug.toLowerCase()] = 0;
    });

    // Override with DB values
    templates
      .filter(t => t.category.toLowerCase() === selectedCategory)
      .forEach(t => {
        newLocalPrices[t.slug.toLowerCase()] = t.price || 0;
      });

    setLocalPrices(newLocalPrices);
  }, [selectedCategory, prices, templates, discovered]);

  const handleSave = async () => {
    if (!selectedCategory) return;

    setIsSaving(true);
    try {
      // 1. Update Category Default
      await api.post("/admin/category-prices", {
        category: selectedCategory,
        price: Number(categoryDefaultPrice),
      });

      // 2. Prepare Updates
      const updates = Object.entries(localPrices).map(([slug, price]) => {
        const dbTemplate = templates.find(t => t.slug.toLowerCase() === slug && t.category.toLowerCase() === selectedCategory);
        return {
          id: dbTemplate?.id || 0,
          slug: slug,
          category: selectedCategory,
          price: Number(price)
        };
      });

      if (updates.length > 0) {
        await api.put("/admin/templates/bulk/prices", { updates });
      }

      toast.success(`All prices saved for ${selectedCategory}`);
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save prices");
    } finally {
      setIsSaving(false);
    }
  };

  const currentCategoryTemplates = useMemo(() => {
    if (!selectedCategory) return [];
    
    // Get all unique slugs for this category
    const slugs = new Set<string>();
    const fsDisc = discovered.find(d => d.name.toLowerCase() === selectedCategory);
    fsDisc?.templates.forEach(s => slugs.add(s.toLowerCase()));
    templates
      .filter(t => t.category.toLowerCase() === selectedCategory)
      .forEach(t => slugs.add(t.slug.toLowerCase()));

    return Array.from(slugs).map(slug => {
      const dbTemplate = templates.find(t => t.slug.toLowerCase() === slug && t.category.toLowerCase() === selectedCategory);
      return {
        slug,
        name: dbTemplate?.name || slug,
        isNew: !dbTemplate,
        id: dbTemplate?.id || 0
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, templates, discovered]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Full Pricing Setup
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage category-wide defaults and individual component overrides.
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save All Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm uppercase tracking-wider">Categories</h2>
            </div>
            <div className="p-2 space-y-1">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </div>
              ) : (
                allCategories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat.name
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="capitalize">{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      selectedCategory === cat.name ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {cat.fsCount || cat.dbCount}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedCategory ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-card rounded-3xl border border-dashed border-border text-muted-foreground p-12 text-center">
              <h3 className="text-lg font-bold text-foreground">Select a Category</h3>
              <p className="text-sm mt-2">Pick a folder from the left to configure pricing.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Default */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 relative">
                <h2 className="text-lg font-bold text-foreground mb-4">Category Default Price</h2>
                <div className="max-w-xs relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={categoryDefaultPrice}
                    onChange={(e) => setCategoryDefaultPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary bg-background text-lg font-black"
                  />
                </div>
              </div>

              {/* Component List */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <h2 className="font-bold text-sm uppercase tracking-wider">Component Overrides</h2>
                </div>
                <div className="divide-y divide-border">
                  {currentCategoryTemplates.map(t => (
                    <div key={t.slug} className={`p-4 flex items-center justify-between hover:bg-muted/10 transition-colors ${t.isNew ? 'bg-primary/5' : ''}`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground capitalize">{t.name}</p>
                          {t.isNew && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-md font-black uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">{t.slug}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-32">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={localPrices[t.slug.toLowerCase()] ?? 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setLocalPrices(prev => ({ ...prev, [t.slug.toLowerCase()]: val }));
                            }}
                            className="w-full pl-6 pr-3 py-1.5 rounded-lg border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
