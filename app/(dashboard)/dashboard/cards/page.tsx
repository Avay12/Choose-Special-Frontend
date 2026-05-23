"use client";

import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Search,
  Link as LinkIcon,
  Plus,
  ShoppingCart,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { Card } from "@/types/api";
import BackgroundPicker from "@/components/templates/BackgroundPicker";

export default function CardLinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/cards");
      setCards(Array.isArray(response.data) ? response.data : (response.data.cards || []));
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) return;
    try {
      await api.delete(`/cards/${id}`);
      fetchCards();
    } catch (error) {
      console.error("Failed to delete card:", error);
      alert("Failed to delete card.");
    }
  };

  const handleEditClick = (card: Card) => {
    setEditingCard(card);
    let parsed = {};
    if (card.custom_data) {
      try {
        parsed = JSON.parse(card.custom_data);
      } catch (e) {
        console.error("Failed to parse custom data", e);
      }
    }
    setEditData(parsed);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;
    setIsSaving(true);
    try {
      const payload = { ...editingCard, custom_data: JSON.stringify(editData) };
      await api.put(`/cards/${editingCard.id}`, payload);
      setIsEditModalOpen(false);
      fetchCards();
    } catch (error) {
      console.error("Failed to update card:", error);
      alert("Failed to update card.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.occasion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Extract text fields, excluding audio/background fields
  const textFields = Object.keys(editData).filter(
    (k) => k !== "audioUrl" && k !== "audioTrackName" && k !== "bgSceneId"
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Top Section: Browse Cards Banner */}
      <div className="rounded-[2rem] bg-card border border-border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between transition-all hover:shadow-md">
        {/* Left: Icon & Text Bundle */}
        <div className="flex items-center gap-6 w-full md:w-auto text-center md:text-left">
          {/* Prominent Plus Icon Box */}
          <div className="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-primary to-secondary items-center justify-center shadow-lg shadow-primary/25 text-white transform transition-transform hover:scale-105">
            <Plus className="h-8 w-8" strokeWidth={3} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Browse Cards
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Explore occasions and design your perfect customized card to
              generate a unique link.
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-row items-center w-full md:w-auto gap-4">
          <Link href="/dashboard/generate-link" className="flex-1 md:flex-none">
            <button className="w-full flex justify-center items-center gap-2 rounded-[1rem] bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5 whitespace-nowrap">
              <LinkIcon className="h-4 w-4" /> Generate Link
            </button>
          </Link>
          <Link href="/dashboard/cart" className="flex-1 md:flex-none">
            <button className="w-full flex justify-center items-center gap-2 rounded-[1rem] bg-muted border border-border px-6 py-3.5 text-sm font-bold text-primary shadow-sm hover:bg-muted/80 transition-colors whitespace-nowrap">
              <ShoppingCart className="h-4 w-4" /> View Cart
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Your Generated Links
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track performance.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full sm:w-72 rounded-[1.25rem] border-2 border-transparent bg-muted/60 py-3.5 pl-10 pr-4 text-sm font-bold text-foreground focus:bg-card focus:border-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground placeholder:font-semibold"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Link Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Performance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Date Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                          Loading links...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[1rem] border border-border shadow-sm bg-muted flex items-center justify-center">
                            {card.image_url ? (
                              <img
                                src={card.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <LinkIcon className="h-5 w-5 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-foreground">
                              {card.title}
                            </div>
                            <Link
                              href={`/preview/${card.id}`}
                              className="flex items-center mt-1 text-xs font-semibold text-primary hover:text-primary/80 cursor-pointer"
                            >
                              <LinkIcon className="mr-1 h-3 w-3" />
                              choosespecial.com/preview/{card.id}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className="inline-flex rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {card.occasion}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          0{" "}
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            clicks
                          </span>
                        </div>
                        <div className="text-xs mt-1">
                          <span className="text-green-500 font-bold flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
                            Active
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-muted-foreground">
                        {new Date(card.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(card)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm font-semibold text-muted-foreground"
                    >
                      No card links found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-[2rem] border border-border shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black mb-6">Edit Link Information</h2>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {textFields.map((field) => (
                <div key={field} className="space-y-2 group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="text"
                    value={editData[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full rounded-[1rem] border-2 border-transparent bg-muted/60 px-4 py-3 text-sm font-bold focus:border-primary/20 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <BackgroundPicker
                  value={editData.bgSceneId || "none"}
                  onChange={(sceneId) => handleInputChange("bgSceneId", sceneId)}
                />
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs text-muted-foreground italic space-y-1">
                <p><strong>Note:</strong> Audio recordings cannot be modified after checkout.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
