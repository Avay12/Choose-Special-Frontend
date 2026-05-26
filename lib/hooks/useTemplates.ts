"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { TEMPLATES, TemplateMetadata } from "@/lib/data/template";

type ApiTemplate = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  layout_json?: string;
  features_json?: string;
  is_active: boolean;
  version: number;
  price?: number;
};

type DynamicTemplate = TemplateMetadata & {
  backendId?: number;
  categorySlug: string;
  layout: Record<string, unknown>;
};

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseJSON(value: string | undefined, fallback: unknown): unknown {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toDynamicTemplate(template: ApiTemplate, fallback?: DynamicTemplate): DynamicTemplate {
  const layout = toRecord(parseJSON(template.layout_json, {}));
  const meta = toRecord(layout.meta);
  
  // Use DB layout fields if they exist, otherwise use fallback
  const defaults = Object.keys(layout.defaults || {}).length > 0 
    ? toRecord(layout.defaults) 
    : (fallback?.defaults || {});
    
  const fields = Array.isArray(layout.fields) && layout.fields.length > 0
    ? layout.fields.filter((field): field is string => typeof field === "string")
    : (fallback?.fields || []);

  const price = template.price ?? fallback?.price ?? 0;

  return {
    id: template.slug,
    backendId: template.id,
    categorySlug: template.category,
    name: fallback?.name || template.name,
    description: template.description || fallback?.description || "Customizable greeting card template.",
    image:
      template.thumbnail_url ||
      (typeof meta.image === "string" ? meta.image : undefined) ||
      fallback?.image,
    component: TEMPLATE_COMPONENTS[template.slug] || fallback?.component,
    layout: Object.keys(layout).length > 0 ? layout : (fallback?.layout || {}),
    price,
    fields,
    defaults: defaults as Record<string, string | number>,
    isNew: Boolean(meta.isNew) || fallback?.isNew,
    isBestseller: Boolean(meta.isBestseller) || fallback?.isBestseller,
  };
}

function getFallbackTemplates(): DynamicTemplate[] {
  const items: DynamicTemplate[] = [];
  for (const category in TEMPLATES) {
    const categoryTemplates = TEMPLATES[category as keyof typeof TEMPLATES];
    for (const key in categoryTemplates) {
      const template = categoryTemplates[key];
      items.push({
        ...template,
        categorySlug: category,
        layout: {},
      });
    }
  }
  return items;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<DynamicTemplate[]>(
    getFallbackTemplates(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await api.get<{ templates: ApiTemplate[] }>("/templates", {
          params: { limit: 200 },
        });
        if (!mounted) return;
        
        const fallbacks = getFallbackTemplates();
        const fallbackMap = new Map(fallbacks.map(f => [f.id, f]));
        
        const mapped = (response.data.templates || []).map(t => 
          toDynamicTemplate(t, fallbackMap.get(t.slug))
        );
        
        // Include any fallbacks that aren't in the database yet
        const backendSlugs = new Set(mapped.map(t => t.id));
        const unmappedFallbacks = fallbacks.filter(f => !backendSlugs.has(f.id));
        
        const allTemplates = [...mapped, ...unmappedFallbacks];
        
        if (allTemplates.length > 0) {
          setTemplates(allTemplates);
        }
      } catch (error) {
        console.error("Failed to fetch templates from server:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const groupedByCategory = useMemo(() => {
    return templates.reduce(
      (acc, template) => {
        if (!acc[template.categorySlug]) {
          acc[template.categorySlug] = {};
        }
        acc[template.categorySlug][template.id] = template;
        return acc;
      },
      {} as Record<string, Record<string, DynamicTemplate>>,
    );
  }, [templates]);

  return { templates, groupedByCategory, loading };
}

