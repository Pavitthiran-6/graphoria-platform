import React, { useState, useEffect } from "react";
import { Menu, User, Bell } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread inquiries count
  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    
    if (!error && count !== null) {
      setUnreadCount(count);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Also listen for real-time changes
    const subscription = supabase
      .channel('inquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);

  // Get title from current path
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "dashboard") return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-sm font-medium text-foreground leading-tight">Admin User</p>
            <p className="text-[10px] text-muted-foreground">graphoriacreativitydesign@gmail.com</p>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 bg-secondary/50 p-1 pr-2 rounded-full border border-border">
            <Link to="/admin/dashboard" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-primary overflow-hidden shadow-inner hover:bg-primary/10 transition-all">
              <User size={18} />
            </Link>
            
            <Link to="/admin/notifications" className="relative p-2 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5 rounded-full group">
              <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[9px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
