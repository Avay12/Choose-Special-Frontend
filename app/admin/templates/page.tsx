"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2, Pencil, Plus, Save, Shapes, Trash2, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import DynamicTemplateRenderer from "@/components/templates/DynamicTemplateRenderer";

type AdminTemplate = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  layout_json: string;
  features_json: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
};

type TemplateFormState = {
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnail_url: string;
  layout_json: string;
  features_json: string;
  is_active: boolean;
};

const INITIAL_FORM: TemplateFormState = {
  name: "",
  slug: "",
  category: "",
  description: "",
  thumbnail_url: "",
  layout_json: JSON.stringify(
    {
      price: 10,
      fields: ["name", "message"],
      defaults: {
        name: "Friend",
        message: "Wishing you joy and happiness.",
      },
      meta: {
        isNew: true,
        isBestseller: false,
      },
    },
    null,
    2,
  ),
  features_json: JSON.stringify(["custom_message"], null, 2),
  is_active: true,
};

function isValidJSON(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<AdminTemplate | null>(null);
  const [form, setForm] = useState<TemplateFormState>(INITIAL_FORM);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ templates: AdminTemplate[] }>("/admin/templates");
      const data = response.data.templates || [];
      setTemplates(data);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { error?: string } } }).response?.data
              ?.error ?? "Failed to fetch templates")
          : "Failed to fetch templates";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTemplateId(null);
    setForm(INITIAL_FORM);
  };

  const openCreateModal = () => {
    setEditingTemplateId(null);
    setForm(INITIAL_FORM);
    setIsFormModalOpen(true);
  };

  const openEditModal = (template: AdminTemplate) => {
    setEditingTemplateId(template.id);
    setForm({
      name: template.name,
      slug: template.slug,
      category: template.category,
      description: template.description || "",
      thumbnail_url: template.thumbnail_url || "",
      layout_json: template.layout_json || "{}",
      features_json: template.features_json || "[]",
      is_active: template.is_active,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim() || !form.category.trim()) {
      toast.error("Name, slug, and category are required.");
      return;
    }

    if (!isValidJSON(form.layout_json)) {
      toast.error("layout_json must be valid JSON.");
      return;
    }

    if (!isValidJSON(form.features_json)) {
      toast.error("features_json must be valid JSON.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        category: form.category.trim().toLowerCase(),
        description: form.description.trim(),
        thumbnail_url: form.thumbnail_url.trim(),
        layout_json: JSON.parse(form.layout_json),
        features_json: JSON.parse(form.features_json),
        is_active: form.is_active,
      };

      if (editingTemplateId) {
        await api.put(`/admin/templates/${editingTemplateId}`, payload);
        toast.success("Template updated successfully.");
      } else {
        await api.post("/admin/templates", payload);
        toast.success("Template created successfully.");
      }

      await fetchTemplates();
      closeFormModal();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { error?: string } } }).response?.data
              ?.error ?? "Failed to save template")
          : "Failed to save template";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (template: AdminTemplate) => {
    const confirmDelete = confirm(
      `Delete template "${template.name}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    setDeletingId(template.id);
    try {
      await api.delete(`/admin/templates/${template.id}`);
      toast.success("Template deleted successfully.");
      if (editingTemplateId === template.id) {
        closeFormModal();
      }
      await fetchTemplates();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { error?: string } } }).response?.data
              ?.error ?? "Failed to delete template")
          : "Failed to delete template";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const getPreviewData = (template: AdminTemplate): Record<string, unknown> => {
    try {
      const parsed = JSON.parse(template.layout_json) as {
        defaults?: Record<string, unknown>;
      };
      return parsed.defaults || {};
    } catch {
      return {};
    }
  };

  const getPreviewLayout = (template: AdminTemplate): Record<string, unknown> => {
    try {
      return JSON.parse(template.layout_json) as Record<string, unknown>;
    } catch {
      return {};
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Manage Templates
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create and maintain dynamic template definitions for the public site.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Shapes className="w-4 h-4 text-primary" />
            Templates
          </p>
          <span className="text-xs font-medium text-muted-foreground">
            {templates.length} total
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No templates yet. Create your first template.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{template.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {template.slug}
                    </td>
                    <td className="px-4 py-3 capitalize">{template.category}</td>
                    <td className="px-4 py-3">
                      {template.is_active ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">v{template.version}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(template.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Preview template"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(template)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit template"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          disabled={deletingId === template.id}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Delete template"
                        >
                          {deletingId === template.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close template form modal"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeFormModal}
          />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground font-heading">
                  {editingTemplateId ? "Edit Template" : "Add Template"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill metadata and provide JSON for layout/features.
                </p>
              </div>
              <button
                onClick={closeFormModal}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="template-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>
                <input
                  id="template-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  placeholder="Dynamic Birthday Card"
                />
              </div>
              <div>
                <label
                  htmlFor="template-slug"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Slug
                </label>
                <input
                  id="template-slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-mono"
                  placeholder="dynamic-bday-001"
                />
              </div>
              <div>
                <label
                  htmlFor="template-category"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Category
                </label>
                <input
                  id="template-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  placeholder="birthday"
                />
              </div>
              <div>
                <label
                  htmlFor="template-thumbnail"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Thumbnail URL
                </label>
                <input
                  id="template-thumbnail"
                  value={form.thumbnail_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="template-description"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Description
              </label>
              <textarea
                id="template-description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full min-h-[80px] rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                placeholder="Template description..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="template-layout-json"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  layout_json
                </label>
                <textarea
                  id="template-layout-json"
                  value={form.layout_json}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, layout_json: e.target.value }))
                  }
                  className="w-full min-h-[180px] rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-mono"
                />
              </div>
              <div>
                <label
                  htmlFor="template-features-json"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  features_json
                </label>
                <textarea
                  id="template-features-json"
                  value={form.features_json}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, features_json: e.target.value }))
                  }
                  className="w-full min-h-[100px] rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="rounded border-border"
              />
              Active template
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={closeFormModal}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingTemplateId ? "Update Template" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close template preview"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPreviewTemplate(null)}
          />
          <div className="relative z-10 w-full max-w-md bg-card rounded-2xl border border-border shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Template Preview</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {previewTemplate.slug}
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border bg-muted/30">
              {TEMPLATE_COMPONENTS[previewTemplate.slug] ? (
                (() => {
                  const Component = TEMPLATE_COMPONENTS[previewTemplate.slug];
                  return <Component {...getPreviewData(previewTemplate)} />;
                })()
              ) : (
                <DynamicTemplateRenderer
                  templateName={previewTemplate.name}
                  layout={getPreviewLayout(previewTemplate)}
                  data={getPreviewData(previewTemplate)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
