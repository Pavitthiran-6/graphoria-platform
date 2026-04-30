import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green-glow/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Glassmorphic Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-2xl w-full px-6 text-center">
        {/* Animated Icon */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-card border border-border rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden group transition-transform hover:scale-105 duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <Search className="w-10 h-10 md:w-14 md:h-14 text-primary group-hover:rotate-12 transition-transform duration-500" />
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter mb-4 leading-none select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20">
            404
          </span>
        </h1>
        
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            Lost in the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Digital Void?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            The page you're looking for has drifted into the unknown. Let's get you back to the studio.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            to="/our-work"
            className="flex items-center gap-2 px-8 py-4 bg-card border border-border text-foreground rounded-full font-bold text-sm uppercase tracking-widest hover:border-primary/50 transition-all hover:scale-105"
          >
            Browse Work
          </Link>
        </div>

        {/* Path Indicator */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
            Current Path: <span className="text-muted-foreground/80 lowercase">{location.pathname}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
