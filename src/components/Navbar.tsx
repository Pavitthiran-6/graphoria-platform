import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import graphoriaLogo from "@/assets/graphoria-logo.png";
import { Menu, X, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Work", path: "/our-work" },
    { name: "Our Expertise", path: "/our-approach" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? "py-3 backdrop-blur-xl bg-background/80 border-b border-border shadow-lg shadow-black/20" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-[110]" onClick={() => setMenuOpen(false)}>
          <img src={graphoriaLogo} alt="Graphoria" className="h-8 md:h-10 transition-transform hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            to="/contact"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105"
          >
            Contact
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative z-[110] text-foreground p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[105] bg-background/98 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-bold uppercase tracking-widest transition-all duration-500 transform ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } ${isActive(link.path) ? "text-primary" : "text-foreground"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}
          
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={`mt-4 flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg uppercase tracking-widest shadow-lg shadow-primary/20 transition-all duration-500 transform ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
          >
            Contact
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
