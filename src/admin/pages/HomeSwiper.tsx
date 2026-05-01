import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Save, Trash2, Plus, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface SwiperItem {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  slug?: string;
  order_index?: number;
}

const HomeSwiper = () => {
  const [items, setItems] = useState<SwiperItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState<Partial<SwiperItem>>({
    id: "",
    image: "",
    title: "",
    description: "",
    tags: [],
    slug: "",
    order_index: 0
  });
  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load items from Supabase on mount
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('home_swiper')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching swiper items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async () => {
    const hasImage = currentItem.image || selectedFile;
    const title = currentItem.title?.trim();
    const description = currentItem.description?.trim();
    const slug = currentItem.slug?.trim();

    const newErrors: Record<string, string> = {};

    if (!hasImage) {
      newErrors.image = "Image is required";
    }

    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!slug) newErrors.slug = "URL slug is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setErrors({});
    setLoading(true);
    let imageUrl = currentItem.image || "";

    try {
      // 1. Upload new image if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `swiper/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const itemData = {
        image: imageUrl,
        title: currentItem.title,
        description: currentItem.description,
        tags: currentItem.tags,
        slug: currentItem.slug || "",
        order_index: currentItem.order_index || 0
      };

      if (currentItem.id) {
        // Edit existing
        const { error } = await supabase
          .from('home_swiper')
          .update(itemData)
          .eq('id', currentItem.id);
        
        if (error) throw error;
        toast.success("Swiper item updated successfully!");
      } else {
        // Add new
        const { error } = await supabase
          .from('home_swiper')
          .insert([itemData]);
        
        if (error) throw error;
        toast.success("New swiper item added!");
      }

      fetchItems();
      resetForm();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Error saving swiper item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this swiper item?")) return;
    
    const { error } = await supabase
      .from('home_swiper')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error("Error deleting swiper item: " + error.message);
    } else {
      toast.success("Item removed from swiper");
      fetchItems();
    }
  };

  const handleEdit = (item: SwiperItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setCurrentItem({
      id: "",
      image: "",
      title: "",
      description: "",
      tags: [],
      order_index: 0
    });
    setSelectedFile(null);
    setIsEditing(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !currentItem.tags?.includes(tagInput.trim())) {
      setCurrentItem({
        ...currentItem,
        tags: [...(currentItem.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentItem({
      ...currentItem,
      tags: currentItem.tags?.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
    
    // For preview only
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentItem({
        ...currentItem,
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Home Swiper</h2>
          <p className="text-muted-foreground text-sm">Manage the images and content for the homepage carousel.</p>
        </div>
      </div>

      {/* Editor Form */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <h3 className="text-lg font-bold">{isEditing ? "Edit Swiper Item" : "Add New Swiper Item"}</h3>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Project Image (Max 10MB)</label>
                <div className="flex flex-col gap-4">
                  {currentItem.image && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-secondary">
                      <img src={currentItem.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setCurrentItem({ ...currentItem, image: "" })}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-lg hover:bg-destructive/90 shadow-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer group",
                        errors.image ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className={cn("w-8 h-8 mb-2 transition-colors", errors.image ? "text-destructive" : "text-muted-foreground group-hover:text-primary")} />
                        <p className={cn("text-sm", errors.image ? "text-destructive" : "text-muted-foreground")}>
                          <span className="font-semibold">{errors.image || "Click to upload"}</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG or WEBP (Max. 10MB)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <Input
                label="Title (Required) *"
                placeholder="Enter swiper title"
                value={currentItem.title}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                error={errors.title}
              />
              <Input
                label="Order Index"
                type="number"
                placeholder="0"
                value={currentItem.order_index}
                onChange={(e) => setCurrentItem({ ...currentItem, order_index: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Project Slug (Required for linking) *"
                placeholder="e.g. ark-architectural"
                value={currentItem.slug || ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, slug: e.target.value });
                  if (errors.slug) setErrors({ ...errors, slug: "" });
                }}
                error={errors.slug}
              />
            </div>
            <Textarea
              label="Description (Required) *"
              className="h-[376px]"
              placeholder="Enter swiper description..."
              value={currentItem.description}
              onChange={(e) => {
                setCurrentItem({ ...currentItem, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              error={errors.description}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground ml-1">Tags (Pills)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentItem.tags?.map((tag) => (
                <span key={tag} className="tag-badge flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-start gap-3">
              <div className="w-full md:flex-1">
                <Input
                  placeholder="Add a tag (e.g. 3D Rendering)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="bg-secondary/50 w-full"
                />
              </div>
              <Button 
                variant="primary" 
                onClick={addTag} 
                type="button"
                className="w-full md:w-auto h-11 px-8 gap-2 whitespace-nowrap shadow-primary/10"
              >
                <Plus size={18} />
                Add Tag
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button onClick={handleSave} className="gap-2 px-8" isLoading={loading}>
              <Save size={18} />
              {isEditing ? "Update Item" : "Add to Swiper"}
            </Button>
          </div>
        </div>
      </div>

      {/* List of Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ImageIcon size={20} className="text-primary" />
          Active Swiper Items ({items.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">Loading swiper items...</div>
          ) : items.map((item) => (
            <div key={item.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all shadow-sm">
              <div className="aspect-video relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white text-background rounded-full hover:bg-primary hover:text-white transition-all shadow-lg"
                    title="Edit Item"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white text-destructive rounded-full hover:bg-destructive hover:text-white transition-all shadow-lg"
                    title="Delete Item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold truncate">{item.title}</h4>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">#{item.order_index}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && (
            <div className="col-span-full py-12 text-center bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
              <p className="text-muted-foreground">No swiper items found. Add your first slide above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSwiper;
