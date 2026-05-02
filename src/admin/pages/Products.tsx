import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Modal from "../components/Modal";
import CustomDropdown from "../../components/ui/CustomDropdown";
import { supabase } from "@/lib/supabase";
import { Project } from "@/data/projects";
import { toast } from "sonner";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);

  // Load projects from Supabase
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      toast.error("Failed to load projects from database.");
    } else {
      setDbProjects(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
    } else if (data) {
      const options = data.map(cat => ({ label: cat.name, value: cat.name }));
      setCategories(options);
      if (options.length > 0) {
        setSelectedCategory(options[0].value);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setCoverImage(null);
    setGalleryImages([]);
    if (categories.length > 0) {
      setSelectedCategory(categories[0].value);
    }
    setIsAddModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setSelectedCategory(project.category || (categories.length > 0 ? categories[0].value : ""));
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProject(null);
    setErrors({});
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Max 10MB allowed.");
        return;
      }
      setCoverImage(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 10MB allowed.`);
        return false;
      }
      return true;
    });
    setGalleryImages(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validation
    const coverTitle = formData.get("Cover Title") as string;
    const coverDesc = formData.get("Short Description (Cover Preview)") as string;
    const detailTitle = formData.get("Detail Page Title") as string;
    const slug = formData.get("URL Slug") as string;
    const fullDesc = formData.get("Full Detailed Description") as string;
    const client = formData.get("Client Name") as string;
    const problem = formData.get("The Challenge / Problem") as string;

    const newErrors: Record<string, string> = {};

    if (!editingProject && !coverImage) {
      newErrors.cover = "Cover image is required";
    }

    if (!coverTitle?.trim()) newErrors.coverTitle = "Cover title is required";
    if (!coverDesc?.trim()) newErrors.coverDesc = "Short description is required";
    if (!detailTitle?.trim()) newErrors.detailTitle = "Detail title is required";
    if (!slug?.trim()) newErrors.slug = "URL slug is required";
    if (!fullDesc?.trim()) newErrors.fullDesc = "Full description is required";
    if (!client?.trim()) newErrors.client = "Client name is required";
    if (!problem?.trim()) newErrors.problem = "The challenge/problem description is required";
    if (!selectedCategory) newErrors.category = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    setErrors({});
    setIsSaving(true);
    let coverImageUrl = editingProject?.cover_image || editingProject?.image || "";
    let galleryUrls = editingProject?.gallery || [];

    try {
      // 1. Upload Cover Image if a new one is selected
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        coverImageUrl = publicUrl;
      }

      // 2. Upload Gallery Images if any new ones are selected
      if (galleryImages.length > 0) {
        const newGalleryUrls = await Promise.all(
          galleryImages.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/gallery/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(filePath);

            return publicUrl;
          })
        );
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }

      // 3. Construct project data
      const projectData: any = {
        cover_title: formData.get('Cover Title') as string,
        cover_description: formData.get('Short Description (Cover Preview)') as string,
        cover_tags: (formData.get('Cover Tags (Comma separated)') as string)?.split(',').map(t => t.trim()) || [],
        category: selectedCategory,
        title: formData.get('Detail Page Title') as string,
        slug: formData.get('URL Slug') as string,
        description: formData.get('Full Detailed Description') as string,
        client: formData.get('Client Name') as string,
        problem: formData.get('The Challenge / Problem') as string,
        goals: (formData.get('Project Goals (One per line)') as string)?.split('\n').filter(g => g.trim()) || [],
        approach: {
          research: formData.get('Research & Strategy') as string,
          direction: formData.get('Creative Direction') as string,
          execution: formData.get('Design Execution') as string,
        },
        results: {
          impact: formData.get('Project Impact') as string,
          brand_improvement: formData.get('Brand Improvement') as string,
          positioning: formData.get('Market Positioning') as string,
        },
        testimonial: {
          quote: formData.get('Quote') as string,
          author: formData.get('Author Name') as string,
          role: formData.get('Author Role') as string,
        },
        cover_image: coverImageUrl,
        image: coverImageUrl,
        gallery: galleryUrls
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success("Project updated successfully!");
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success("Project added successfully!");
      }

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Error deleting project: " + error.message);
    } else {
      toast.success("Project deleted successfully!");
      fetchProjects();
    }
  };

  const filteredProjects = dbProjects.filter(p => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cover_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "All" || p.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <CustomDropdown
              options={[{ label: "All Categories", value: "All" }, ...categories]}
              value={filterCategory}
              onChange={setFilterCategory}
              placeholder="Filter by Category"
            />
          </div>
          <Button className="w-full sm:w-auto gap-2 whitespace-nowrap" onClick={openAddModal}>
            <Plus size={18} />
            Add Project
          </Button>
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Edit Project" : "Add New Project"}
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Product Cover Content - MANDATORY FIRST LAYER */}
          <div className="space-y-4 p-4 sm:p-6 bg-primary/5 rounded-2xl border border-primary/20">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              1. Product Cover Content (Mandatory)
            </h4>

            <div className="space-y-2">
              <label className="text-[11px] sm:text-sm font-medium text-muted-foreground ml-1">Cover Image (Required - Max 10MB) *</label>
              <div className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-4 p-3 sm:p-4 rounded-xl bg-secondary border transition-all",
                errors.cover ? "border-destructive" : "border-border"
              )}>
                <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground overflow-hidden">
                  {coverImage ? (
                    <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-contain" alt="Preview" />
                  ) : editingProject?.cover_image ? (
                    <img src={editingProject.cover_image} className="w-full h-full object-contain" alt="Current" />
                  ) : (
                    <ImageIcon size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    name="cover-upload"
                    id="cover-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="flex sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <Upload size={16} />
                    {coverImage || editingProject?.cover_image ? "Change Cover Image" : "Upload Cover Image"}
                  </label>
                </div>
              </div>
              {errors.cover && <p className="text-xs text-destructive ml-1">{errors.cover}</p>}
            </div>

            <Input
              name="Cover Title"
              label="Cover Title *"
              placeholder="e.g. ARK Architectural Vision"
              defaultValue={editingProject?.cover_title || ""}
              error={errors.coverTitle}
              required
            />

            <Textarea
              name="Short Description (Cover Preview)"
              label="Short Description (Cover Preview) *"
              placeholder="A brief one-liner for the product card..."
              defaultValue={editingProject?.cover_description || ""}
              error={errors.coverDesc}
              required
              rows={3}
            />

            <Input
              name="Cover Tags (Comma separated)"
              label="Cover Tags (Comma separated) *"
              placeholder="Branding, 3D Rendering, Luxury"
              defaultValue={editingProject?.cover_tags?.join(", ") || ""}
              required
            />

            <CustomDropdown
              label="Category *"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              error={errors.category}
            />
          </div>

          {/* Product Full Details - SECOND LAYER */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
              2. Product Full Details
            </h4>

            <Input
              name="Detail Page Title"
              label="Detail Page Title *"
              placeholder="The main heading for the project page"
              defaultValue={editingProject?.title || ""}
              error={errors.detailTitle}
            />

            <Input
              name="URL Slug"
              label="URL Slug *"
              placeholder="e.g. ark-architectural"
              defaultValue={editingProject?.slug || ""}
              error={errors.slug}
            />

            <Textarea
              name="Full Detailed Description"
              label="Full Detailed Description *"
              placeholder="The full project story..."
              defaultValue={editingProject?.description || ""}
              error={errors.fullDesc}
              rows={4}
            />
          </div>

          {/* Project Overview */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Project Overview</h4>
            <Input
              name="Client Name"
              label="Client Name *"
              placeholder="Who was this for?"
              defaultValue={editingProject?.client || ""}
              error={errors.client}
            />
            <Textarea
              name="The Challenge / Problem"
              label="The Challenge / Problem *"
              placeholder="What problem were we solving?"
              defaultValue={editingProject?.problem || ""}
              error={errors.problem}
              rows={3}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Project Goals (One per line)</label>
              <textarea
                name="Project Goals (One per line)"
                className="w-full h-24 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="Goal 1&#10;Goal 2"
                defaultValue={editingProject?.goals?.join("\n") || ""}
              />
            </div>
          </div>

          {/* Our Approach */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Our Approach</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Research & Strategy</label>
              <textarea
                name="Research & Strategy"
                className="w-full h-24 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="How did we start?"
                defaultValue={editingProject?.approach?.research || ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Creative Direction</label>
              <textarea
                name="Creative Direction"
                className="w-full h-24 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="What was the visual path?"
                defaultValue={editingProject?.approach?.direction || ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Design Execution</label>
              <textarea
                name="Design Execution"
                className="w-full h-24 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="How did we build it?"
                defaultValue={editingProject?.approach?.execution || ""}
              />
            </div>
          </div>

          {/* Results & Media */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Results & Showcase</h4>
            <Input
              name="Project Impact"
              label="Project Impact"
              placeholder="e.g. 50% increase in sales"
              defaultValue={editingProject?.results?.impact || ""}
            />
            <Input
              name="Brand Improvement"
              label="Brand Improvement"
              placeholder="e.g. Unified visual identity"
              defaultValue={editingProject?.results?.brand_improvement || ""}
            />
            <Input
              name="Market Positioning"
              label="Market Positioning"
              placeholder="e.g. Leader in luxury niche"
              defaultValue={editingProject?.results?.positioning || ""}
            />

            {/* Gallery Multiple Upload */}
            <div className="space-y-2">
              <label className="text-[11px] sm:text-sm font-medium text-muted-foreground ml-1">Visual Showcase (Gallery - Max 10MB per image)</label>
              <div className="p-3 sm:p-4 rounded-xl bg-secondary border border-border space-y-4">
                <input
                  type="file"
                  name="gallery-upload"
                  id="gallery-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                />
                <label
                  htmlFor="gallery-upload"
                  className="w-full h-24 sm:h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <Upload size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">Upload Multiple Images</span>
                </label>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-lg bg-background border border-border overflow-hidden group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Gallery preview" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1.5 bg-destructive text-white rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Client Testimonial (Optional)</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Quote</label>
              <textarea
                name="Quote"
                className="w-full h-24 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="What the client said..."
                defaultValue={editingProject?.testimonial?.quote || ""}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="Author Name"
                label="Author Name"
                placeholder="John Doe"
                defaultValue={editingProject?.testimonial?.author || ""}
              />
              <Input
                name="Author Role"
                label="Author Role"
                placeholder="CEO at Acme"
                defaultValue={editingProject?.testimonial?.role || ""}
              />
            </div>
          </div>

          <div className="relative sm:sticky sm:bottom-[-24px] sm:-mx-6 sm:-mb-6 bg-card px-0 sm:px-6 py-6 sm:py-4 border-t border-border mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 z-20 sm:shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
            <Button variant="outline" type="button" onClick={handleCloseModal} className="w-full sm:w-auto" disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto" isLoading={isSaving}>{editingProject ? "Update Project" : "Publish Project"}</Button>
          </div>
        </form>
      </Modal>

      {/* Table/Card Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* MOBILE VIEW: Card List (hidden on sm+) */}
        <div className="block sm:hidden divide-y divide-border">
          {loading ? (
            <div className="px-6 py-12 text-center text-muted-foreground animate-pulse">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              No projects found.
            </div>
          ) : (
            filteredProjects.map((product) => (
              <div key={product.id} className="p-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary border border-border flex-shrink-0 shadow-sm">
                    <img
                      src={product.cover_image || product.image}
                      alt={product.cover_title || product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-1">
                        {product.cover_title || product.title}
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary text-xs font-medium text-foreground hover:text-primary transition-all border border-border"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-destructive transition-colors border border-border"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW: Standard Table (hidden on mobile) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">Loading projects...</td>
                </tr>
              ) : (
                <>
                  {filteredProjects.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0">
                            <img src={product.cover_image || product.image} alt={product.cover_title || product.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium text-foreground line-clamp-2">{product.cover_title || product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium whitespace-nowrap">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No projects found.</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
