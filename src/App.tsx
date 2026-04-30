import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import OurWork from "./pages/OurWork";
import OurApproach from "./pages/OurApproach";
import Contact from "./pages/Contact";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

import AdminRoutes from "./admin/AdminRoutes";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  // Define all valid paths (excluding dynamic project paths for now)
  const staticPaths = ['/', '/about', '/our-work', '/our-approach', '/contact'];
  const isStaticPath = staticPaths.includes(location.pathname);
  const isProjectDetailPath = location.pathname.startsWith('/project/');
  
  const isKnownPath = isStaticPath || isProjectDetailPath || isAdminPath;
  const showNavbar = isKnownPath && !isAdminPath;

  return (
    <>
      {showNavbar && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/our-work" element={<OurWork />} />
        <Route path="/our-approach" element={<OurApproach />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
