import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden p-6">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center text-center">
        {/* ICON (TOP) */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-card border border-border rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
            <Search className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </div>
        </div>

        {/* 404 TEXT */}
        <h1 className="text-[80px] md:text-[100px] font-bold tracking-tighter leading-none mb-4 select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/10 opacity-90">
            404
          </span>
        </h1>
        
        {/* TITLE */}
        <h2 className="text-2xl md:text-[28px] font-medium text-foreground mb-3 leading-tight">
          Lost in the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow font-bold">
            Digital Void?
          </span>
        </h2>

        {/* DESCRIPTION */}
        <p className="text-muted-foreground/70 text-base md:text-lg leading-[1.6] mb-8">
          The page you're looking for has drifted into the unknown. Let's get you back to the studio.
        </p>

        {/* PRIMARY CTA (ONLY ONE BUTTON) */}
        <Link
          to="/"
          className="group relative flex items-center justify-center px-10 py-3.5 bg-gradient-to-r from-primary to-brand-green-glow text-primary-foreground rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
        >
          <span className="relative z-10">← Back to Home</span>
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
