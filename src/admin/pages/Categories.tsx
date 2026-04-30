import React, { useState, useEffect } from "react";
import { Plus, Trash2, Folder, Link as LinkIcon, FileText } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleNameChange = (name: string) => {
    setNewCategory({
      ...newCategory,
      name,
      slug: generateSlug(name)
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.slug.trim()) {
      toast.error("Name and Slug are required");
      return;
    }

    const { error } = await supabase
      .from('categories')
      .insert([{ 
        name: newCategory.name.trim(),
        slug: newCategory.slug.trim(),
        description: newCategory.description.trim() || null
      }]);

    if (error) {
      toast.error("Error adding category: " + error.message);
    } else {
      toast.success("Category added successfully!");
      setNewCategory({ name: "", slug: "", description: "" });
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure? This might affect projects assigned to this category.")) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Error deleting category: " + error.message);
    } else {
      toast.success("Category deleted!");
      fetchCategories();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {/* Add Category Form */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-2xl p-6 sticky top-28 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Add New Category</h3>
          <form className="space-y-4" onSubmit={handleAddCategory}>
            <Input 
              label="Category Name" 
              placeholder="e.g. Graphic Design" 
              value={newCategory.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
            <Input 
              label="URL Slug" 
              placeholder="e.g. graphic-design" 
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              rightIcon={<LinkIcon size={14} className="text-muted-foreground" />}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Description (Optional)</label>
              <textarea 
                className="w-full h-24 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none text-sm" 
                placeholder="Brief description of the category..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full gap-2 shadow-primary/10">
                <Plus size={18} />
                Create Category
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories List */}
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary/30">
            <h3 className="text-lg font-bold">Manage Categories</h3>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="px-6 py-12 text-center text-muted-foreground">Loading categories...</div>
            ) : categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/20 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Folder size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{cat.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <LinkIcon size={10} /> /{cat.slug}
                      </p>
                      {cat.description && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <FileText size={10} /> {cat.description.substring(0, 30)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!loading && categories.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground">No categories found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
