import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "@/components/Footer";

import { Project, Category } from "@/data/projects";
import { supabase } from "@/lib/supabase";

import { logError } from "@/lib/errorLogger";

const OurWork = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchParams] = useSearchParams();
  const [dynamicProjects, setDynamicProjects] = useState<Project[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (projectsError) {
          logError(projectsError.message, undefined, "db", "projects fetch");
          console.error('Error fetching projects:', projectsError);
        } else if (projectsData) {
          setDynamicProjects(projectsData);
        }

        // Fetch Categories
        const { data: catsData, error: catsError } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });

        if (catsError) {
          logError(catsError.message, undefined, "db", "categories fetch");
          console.error('Error fetching categories:', catsError);
        }

        if (catsData && catsData.length > 0) {
          setDbCategories(["All", ...catsData.map(c => c.name)]);
        } else if (projectsData) {
          // Fallback: Extract unique categories from projects if categories table is empty
          const uniqueCategories = Array.from(new Set(projectsData.map(p => p.category))).filter(Boolean) as string[];
          setDbCategories(["All", ...uniqueCategories.sort()]);
        }
      } catch (err: any) {
        logError(err.message, err.stack, "error", "OurWork fetchData");
        console.error('Unexpected error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && dbCategories.includes(category)) {
      setActiveCategory(category);
    }
  }, [searchParams, dbCategories]);

  const filteredProjects = activeCategory === "All"
    ? dynamicProjects
    : dynamicProjects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-28 pb-8 md:pt-[120px] md:pb-[48px] px-5">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-[40px] md:text-[64px] font-bold text-foreground leading-tight mb-4 animate-fade-in">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">Work</span>
          </h1>
          <div className="w-10 h-[3px] bg-primary mx-auto mb-5 rounded-full" />
          <p className="text-sm md:text-base text-muted-foreground/75 max-w-[600px] mx-auto leading-relaxed mb-6">
            We deliver impactful design solutions that transform brands and captivate audiences.
            From bold identities to stunning digital experiences, every project is crafted with precision and passion.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-0 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 md:px-0">
            {loading ? (
              // Category Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[28%] h-10 bg-card/50 rounded-full animate-pulse border border-border/50"
                />
              ))
            ) : (
              dbCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-1 md:flex-initial min-w-[28%] max-w-[48%] md:min-w-0 md:max-w-none px-2 py-2.5 md:px-6 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer text-center
                    ${activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-card/60 md:bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground border border-border"
                    }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {loading ? (
              // Loading Skeleton Grid
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full aspect-[4/3] bg-card/50 rounded-2xl animate-pulse border border-border" />
              ))
            ) : (
              filteredProjects.map((project, index) => (
                <Link
                  to={`/project/${project.slug}`}
                  key={project.id}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 cursor-pointer animate-fade-in w-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.cover_image || project.image}
                      alt={project.cover_title || project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* View Project Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Project
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.cover_title || project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.cover_description || project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.cover_tags) && project.cover_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[10px] font-semibold bg-primary/10 border border-primary/20 rounded-full text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Mobile Only */}
      <section id="contact" className="px-6 py-12 mt-10 md:hidden">
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

export default OurWork;
