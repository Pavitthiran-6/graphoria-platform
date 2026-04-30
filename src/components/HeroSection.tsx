import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "@/config/brand";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    const navbarHeight = 64;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

const HeroSection = () => {
  return (
    <section className="pt-24 pb-4 md:pt-48 md:pb-20 lg:pb-10 px-6 md:px-12 max-w-7xl mx-auto" id="home">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20 mb-4 md:mb-32 lg:mb-10">
        {/* Left content */}
        <div className="lg:w-1/2 space-y-6 md:space-y-8 z-10 w-full text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {BRAND.full}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] text-foreground">
            Designing the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Impossible.
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-[95%] md:max-w-xl leading-relaxed border-l-4 border-primary pl-4 md:pl-6">
            Welcome to <span className="text-foreground font-semibold">{BRAND.full}</span>. We merge art with strategy to build brand experiences that define the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4 w-full sm:w-auto">
            <Link to="/our-work" className="glass-button text-center w-full sm:w-auto">View Our Work</Link>
            <Link to="/about" className="outline-button text-center w-full sm:w-auto">About Us</Link>
          </div>
        </div>

        {/* Right - UI Card mockup */}
        <div className="lg:w-1/2 relative h-[500px] w-full hidden md:block">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />

          {/* Background card */}
          <div className="absolute top-10 right-10 w-80 h-96 glass-panel rounded-3xl rotate-6 z-0 border-primary/20 opacity-60" />

          {/* Main card */}
          <div className="absolute top-0 right-20 w-80 h-96 glass-panel rounded-3xl z-10 flex flex-col p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-8 border-b border-foreground/10 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(45, 100%, 50%, 0.8)" }} />
                <div className="w-3 h-3 rounded-full bg-primary/80" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{BRAND.short} UI</span>
            </div>
            <div className="space-y-4">
              <div className="h-32 w-full rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-1/3 bg-foreground/10 rounded-full" />
                <div className="h-2 w-1/4 bg-primary/40 rounded-full" />
              </div>
              <div className="h-2 w-full bg-foreground/5 rounded-full" />
              <div className="h-2 w-5/6 bg-foreground/5 rounded-full" />
            </div>
            <div className="mt-auto pt-6 flex justify-between items-center text-xs text-muted-foreground">
              <span>Creativity Index</span>
              <span className="text-primary font-bold">98.5%</span>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute bottom-20 right-0 glass-panel px-6 py-3 rounded-xl z-20 animate-bounce flex items-center gap-3 border-primary/30">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-foreground text-sm font-bold">Design Approved</div>
              <div className="text-[10px] text-muted-foreground">Just now</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
