import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Footer from "@/components/Footer";
import { Project } from "@/data/projects";
import { supabase } from "@/lib/supabase";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      setProject(undefined);
      setNextProject(null);
      try {
        // Fetch current project
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching project from Supabase:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setProject(data);

          // Fetch next project (one with id greater than current, or first one if none)
          const { data: nextData } = await supabase
            .from('projects')
            .select('slug, title')
            .gt('id', data.id)
            .order('id', { ascending: true })
            .limit(1)
            .single();

          if (nextData) {
            setNextProject(nextData as any);
          } else {
            // Fallback to first project if no "next" exists
            const { data: firstData } = await supabase
              .from('projects')
              .select('slug, title')
              .order('id', { ascending: true })
              .limit(1)
              .single();

            if (firstData) setNextProject(firstData as any);
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching project data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for might have been moved or deleted.
          </p>
          <Link to="/our-work" className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-full font-medium hover:bg-card/80 hover:border-primary/50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            Back to Our Work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Project Content (Order 2 on mobile, 1 on desktop) */}
            <div className="flex flex-col items-start order-2 lg:order-1">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3.5">
                {(Array.isArray(project.cover_tags) ? project.cover_tags : Array.isArray(project.tags) ? project.tags : []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 text-[12px] md:text-sm font-bold tracking-wider uppercase bg-primary/10 text-primary rounded-full border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-3 text-foreground leading-[1.2] md:leading-tight max-w-[90%] md:max-w-full">
                {project.title}
              </h1>

              {/* Description */}
              <p className="text-[17px] md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-[95%] md:max-w-full">
                {project.description}
              </p>

              {/* CTA Button */}
              <div className="w-full md:w-auto mt-2">
                <Link
                  to="/contact"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm md:text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
                >
                  Start a Project
                  <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Project Image (Order 1 on mobile, 2 on desktop) */}
            <div className="relative order-1 lg:order-2 mb-2 lg:mb-0">
              <div className="aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                <img
                  src={project.cover_image || project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-50" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-green-glow/20 rounded-full blur-3xl opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 px-6 md:px-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Project{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Overview
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">The Client</h3>
              <p className="text-muted-foreground">{project.client}</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">The Challenge</h3>
              <p className="text-muted-foreground">{project.problem}</p>
            </div>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <h3 className="text-xl font-bold mb-6 text-foreground">Project Goals</h3>
            <ul className="space-y-4">
              {(Array.isArray(project.goals) ? project.goals : []).map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Approach
            </span>
          </h2>

          <div className="space-y-8">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Research & Strategy</h3>
              </div>
              <p className="text-muted-foreground ml-16">{project.approach?.research}</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Creative Direction</h3>
              </div>
              <p className="text-muted-foreground ml-16">{project.approach?.direction}</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Design Execution</h3>
              </div>
              <p className="text-muted-foreground ml-16">{project.approach?.execution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-20 px-6 md:px-12 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Visual{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Showcase
            </span>
          </h2>

          <div className="space-y-6 md:space-y-12">
            {(() => {
              const imgs = Array.isArray(project.images) ? project.images : [];
              const count = imgs.length;

              if (count === 0) {
                return (
                  <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-border">
                    <p className="text-muted-foreground">No visuals available for this project.</p>
                  </div>
                );
              }

              // --- CASE 1: Single Image ---
              if (count === 1) {
                return (
                  <div
                    className="max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-border/50 group"
                    onClick={() => setSelectedImageIndex(0)}
                  >
                    <img src={imgs[0]} alt="Showcase" className="w-full h-auto md:max-h-[650px] object-cover group-hover:scale-[1.01] transition-all duration-700" />
                  </div>
                );
              }

              // --- CASE 2: Two Images (Side by Side) ---
              if (count === 2) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {imgs.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-border/30 group"
                        onClick={() => setSelectedImageIndex(i)}
                      >
                        <img src={img} alt={`Showcase ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                      </div>
                    ))}
                  </div>
                );
              }

              // --- CASE 3: Three Images (1 Top, 2 Bottom) ---
              if (count === 3) {
                return (
                  <div className="space-y-4 md:space-y-8">
                    <div
                      className="max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-border/50 group"
                      onClick={() => setSelectedImageIndex(0)}
                    >
                      <img src={imgs[0]} alt="Showcase 1" className="w-full h-[300px] md:h-[500px] object-cover group-hover:scale-[1.01] transition-all duration-700" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      {imgs.slice(1).map((img, i) => (
                        <div
                          key={i}
                          className="aspect-square md:aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-border/30 group"
                          onClick={() => setSelectedImageIndex(i + 1)}
                        >
                          <img src={img} alt={`Showcase ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- CASE 4+: Complex Showcase (Top + Grid + Bottom) ---
              return (
                <div className="space-y-6 md:space-y-12">
                  <div
                    className="max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-border/50 group"
                    onClick={() => setSelectedImageIndex(0)}
                  >
                    <img src={imgs[0]} alt="Featured" className="w-full h-[300px] md:h-[550px] object-cover group-hover:scale-[1.01] transition-all duration-700" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {imgs.slice(1, -1).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-border/30 group hover:scale-[1.03] transition-all duration-500"
                        onClick={() => setSelectedImageIndex(i + 1)}
                      >
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700" />
                      </div>
                    ))}
                  </div>

                  <div
                    className="max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-border/50 group"
                    onClick={() => setSelectedImageIndex(imgs.length - 1)}
                  >
                    <img src={imgs[imgs.length - 1]} alt="Highlight" className="w-full h-[300px] md:h-[550px] object-cover group-hover:scale-[1.01] transition-all duration-700" />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white/70 hover:text-primary transition-all z-[130] bg-white/5 hover:bg-white/10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {project.images && project.images.length > 1 && (
            <button
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white/50 hover:text-primary transition-all bg-white/5 hover:bg-white/10 rounded-full z-[130]"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedImageIndex !== null && project.images) {
                  setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : project.images.length - 1);
                }
              }}
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {project.images && project.images.length > 1 && (
            <button
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white/50 hover:text-primary transition-all bg-white/5 hover:bg-white/10 rounded-full z-[130]"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedImageIndex !== null && project.images) {
                  setSelectedImageIndex(selectedImageIndex < project.images.length - 1 ? selectedImageIndex + 1 : 0);
                }
              }}
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Full Screen Image */}
          {selectedImageIndex !== null && project.images && (
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={project.images[selectedImageIndex]}
                alt="Full screen view"
                className="max-w-full max-h-[75vh] md:max-h-[85vh] w-auto h-auto object-contain select-none animate-in zoom-in-95 duration-300"
              />

              {/* Image Counter */}
              <div className="absolute -bottom-12 md:bottom-0 left-1/2 -translate-x-1/2 text-white/60 text-xs md:text-sm font-medium tracking-widest uppercase bg-white/5 px-6 py-2 rounded-full border border-white/10">
                {selectedImageIndex + 1} <span className="mx-2 text-white/20">/</span> {project.images.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Project{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Results
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-2xl border border-primary/20">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Impact</h3>
              <p className="text-muted-foreground">{project?.results?.impact}</p>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-2xl border border-primary/20">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Brand Improvement</h3>
              <p className="text-muted-foreground">{project?.results?.brand_improvement}</p>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-2xl border border-primary/20">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">Market Positioning</h3>
              <p className="text-muted-foreground">{project?.results?.positioning}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-20 px-6 md:px-12 bg-card/30">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-12 rounded-3xl border border-border relative overflow-hidden">
              <div className="absolute top-8 left-8 text-8xl text-primary/10 font-serif">"</div>
              <blockquote className="relative z-10">
                <p className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
                  {project.testimonial.quote}
                </p>
                <footer>
                  <cite className="not-italic">
                    <div className="font-bold text-foreground text-lg">{project.testimonial.author}</div>
                    <div className="text-muted-foreground">{project.testimonial.role}</div>
                  </cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Navigation */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-3 px-8 py-4 bg-card border border-border text-foreground rounded-full font-medium hover:bg-card/80 hover:border-primary/50 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Work
            </Link>
            {nextProject && (
              <Link
                to={`/project/${nextProject.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all group"
              >
                Next Project
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Only */}
      <section className="px-6 py-12 mt-10 md:hidden">
        <div className="max-w-[360px] mx-auto text-center">
          <h2 className="text-[26px] font-bold text-foreground leading-[1.2] mb-3">
            Let's Build Your Brand
          </h2>
          <p className="text-[14px] leading-[1.6] text-muted-foreground/75 mb-6 max-w-[320px] mx-auto">
            Ready to transform your brand? Let's create something extraordinary together.
            Our team is here to bring your vision to life.
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact"
              className="w-full max-w-[260px] flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
