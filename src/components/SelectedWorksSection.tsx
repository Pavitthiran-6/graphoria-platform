import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "@/data/projects";
import { supabase } from "@/lib/supabase";

const SelectedWorksSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  // Load items from Supabase on mount
  useEffect(() => {
    const fetchSwiperItems = async () => {
      const { data, error } = await supabase
        .from('home_swiper')
        .select('*');
      
      if (error) {
        console.error('Error fetching swiper items from Supabase:', error);
        return;
      }

      if (data && data.length > 0) {
        setProjects(data);
      }
    };

    fetchSwiperItems();
  }, []);

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c === projects.length - 1 ? 0 : c + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const prev = () => setCurrent((c) => (c === 0 ? projects.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === projects.length - 1 ? 0 : c + 1));

  if (projects.length === 0) {
    return (
      <section className="py-10 md:py-20 px-6" id="work">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="section-heading">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Work
            </span>
          </h2>
          <div className="green-underline mt-4" />
        </div>
        <div className="max-w-5xl mx-auto text-center py-20 bg-card rounded-3xl border border-border">
          <p className="text-muted-foreground">No projects available at the moment.</p>
        </div>
      </section>
    );
  }

  const project = projects[current];

  return (
    <section className="py-10 md:py-20 px-6" id="work">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="section-heading">
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
            Work
          </span>
        </h2>
        <div className="green-underline mt-4" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div 
          className="relative h-[520px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-foreground/10 carousel-content cursor-pointer" 
          onClick={() => {
            if (project.slug) {
              navigate(`/project/${project.slug}`);
            } else {
              navigate("/our-work");
            }
          }}
        >
          {/* Image */}
          <img
            alt={project.title}
            className="w-full h-full object-cover"
            src={project.image}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ willChange: 'opacity' }}
          />
          {/* Overlay - Darker gradient for better text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-12 left-0 right-0 px-6 pb-6 md:p-12 md:left-8 md:right-auto md:max-w-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 text-white leading-tight">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-6 max-w-xl line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {(project.tags || []).map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-[10px] md:text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/30 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Nav buttons - Reduced size and better positioning for mobile */}
          <button 
            onClick={(e) => { e.stopPropagation(); prev(); }} 
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-black/30 hover:bg-primary text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 group z-10"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); next(); }} 
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-black/30 hover:bg-primary text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 group z-10"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots - Positioned below content */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-4 md:w-6" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedWorksSection;
