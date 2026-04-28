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

function toDynamicTemplate(template: ApiTemplate): DynamicTemplate {
  const layout = toRecord(parseJSON(template.layout_json, {}));
  const meta = toRecord(layout.meta);
  const defaults = toRecord(layout.defaults);
  const fields = Array.isArray(layout.fields)
    ? layout.fields.filter((field): field is string => typeof field === "string")
    : [];

  const rawPrice = meta.price ?? layout.price;
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : typeof rawPrice === "string"
        ? Number(rawPrice) || 0
        : 0;

  return {
    id: template.slug,
    backendId: template.id,
    categorySlug: template.category,
    name: template.name,
    description: template.description || "Customizable greeting card template.",
    image:
      template.thumbnail_url ||
      (typeof meta.image === "string" ? meta.image : undefined),
    component: TEMPLATE_COMPONENTS[template.slug],
    layout,
    price,
    fields,
    defaults: defaults as Record<string, string | number>,
    isNew: Boolean(meta.isNew),
    isBestseller: Boolean(meta.isBestseller),
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
        const mapped = (response.data.templates || []).map(toDynamicTemplate);
        if (mapped.length > 0) {
          setTemplates(mapped);
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
