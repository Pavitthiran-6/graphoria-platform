import React, { useState, useEffect } from "react";
import { Bell, Check, Clock, Trash2, Mail, Phone, MessageSquare, Briefcase, IndianRupee, AlertTriangle, Terminal, Info, Globe, ShieldAlert } from "lucide-react";
import Button from "../components/Button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Inquiry {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  project_type: string;
  budget: string;
  message: string;
  is_read: boolean;
}

interface ErrorLog {
  id: number;
  created_at: string;
  message: string;
  stack?: string;
  path: string;
  user_agent: string;
  severity: "error" | "warning" | "db" | "info";
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"inquiries" | "errors">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } else {
      setInquiries(data || []);
    }
  };

  const fetchErrorLogs = async () => {
    const { data, error } = await supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching logs:", error);
      // Don't toast here as error_logs table might not exist yet
    } else {
      setErrorLogs(data || []);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    if (activeTab === "inquiries") {
      await fetchInquiries();
    } else {
      await fetchErrorLogs();
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    if (activeTab === "inquiries") {
      const markAllReadOnVisit = async () => {
        await supabase
          .from("inquiries")
          .update({ is_read: true })
          .eq("is_read", false);
      };
      markAllReadOnVisit();
    }
  }, [activeTab]);

  const markAsRead = async (id: number) => {
    const { error } = await supabase
      .from("inquiries")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast.error("Error updating status");
    } else {
      setInquiries(prev => 
        prev.map(item => item.id === id ? { ...item, is_read: true } : item)
      );
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("inquiries")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      toast.error("Error updating status");
    } else {
      toast.success("All marked as read");
      fetchInquiries();
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting inquiry");
    } else {
      toast.success("Inquiry deleted");
      setInquiries(prev => prev.filter(item => item.id !== id));
    }
  };

  const clearLogs = async () => {
    if (!confirm("Are you sure you want to clear all error logs?")) return;
    
    // Deleting all requires a filter that matches all rows
    const { error } = await supabase
      .from("error_logs")
      .delete()
      .not("id", "is", null);

    if (error) {
      console.error("Clear logs error:", error);
      toast.error("Error clearing logs: " + error.message);
    } else {
      toast.success("All logs cleared");
      setErrorLogs([]);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "error":
        return { 
          bg: "bg-destructive/10", 
          text: "text-destructive", 
          border: "border-destructive/20",
          icon: <ShieldAlert size={20} />
        };
      case "warning":
        return { 
          bg: "bg-amber-500/10", 
          text: "text-amber-500", 
          border: "border-amber-500/20",
          icon: <AlertTriangle size={20} />
        };
      case "db":
        return { 
          bg: "bg-blue-500/10", 
          text: "text-blue-500", 
          border: "border-blue-500/20",
          icon: <Terminal size={20} />
        };
      default:
        return { 
          bg: "bg-primary/10", 
          text: "text-primary", 
          border: "border-primary/20",
          icon: <Info size={20} />
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 w-full max-w-full overflow-x-hidden">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-card border border-border rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === "inquiries" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare size={18} />
          Inquiries
          {inquiries.some(i => !i.is_read) && (
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === "errors" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal size={18} />
          System Errors
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <h2 className="text-2xl font-bold">
            {activeTab === "inquiries" ? "Project Inquiries" : "System Monitoring"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {activeTab === "inquiries" 
              ? "Manage new client leads and messages." 
              : "Track application stability and catch runtime failures."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {activeTab === "inquiries" ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="gap-2 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial justify-center"
            >
              <Check size={16} />
              <span className="whitespace-nowrap">Mark all as read</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearLogs}
              className="gap-2 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial justify-center text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={16} />
              <span className="whitespace-nowrap">Clear Logs</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            className="gap-2 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial justify-center"
          >
            <Clock size={16} />
            <span className="whitespace-nowrap">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 w-full max-w-full">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading...</div>
        ) : activeTab === "inquiries" ? (
          inquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              style={{ 
                background: !inquiry.is_read ? 'linear-gradient(135deg, #031a0f, #02120a)' : undefined 
              }}
              className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 sm:gap-7 w-full max-w-full group ${
                !inquiry.is_read 
                  ? "border-[#00ff88]/20 shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.25)]" 
                  : "bg-card border-border hover:border-primary/10"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                !inquiry.is_read ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                <MessageSquare size={28} />
              </div>
              
              <div className="flex-1 min-w-0 space-y-5 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xl font-bold text-foreground flex items-center gap-3 truncate">
                      {inquiry.full_name}
                      {!inquiry.is_read && (
                        <span className="px-3 py-1 rounded-full bg-primary text-[10px] text-primary-foreground font-black uppercase tracking-widest flex-shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.5)]">New</span>
                      )}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                      <span className="text-sm text-primary/80 flex items-center gap-2 break-all font-medium">
                        <Mail size={16} className="shrink-0" />
                        {inquiry.email}
                      </span>
                      {inquiry.phone && (
                        <span className="text-sm text-primary/80 flex items-center gap-2 font-medium">
                          <Phone size={16} className="shrink-0" />
                          {inquiry.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl whitespace-nowrap self-start sm:self-center border border-white/5 font-medium">
                    <Clock size={14} />
                    {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-background border border-border text-[10px] sm:text-xs font-medium">
                    <Briefcase size={12} className="text-primary shrink-0" />
                    <span className="text-muted-foreground">Type:</span> {inquiry.project_type}
                  </div>
                  {inquiry.budget && (
                    <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-background border border-border text-[10px] sm:text-xs font-medium">
                      <IndianRupee size={12} className="text-primary shrink-0" />
                      <span className="text-muted-foreground">Budget:</span> {inquiry.budget}
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-secondary/30 border border-border/50 text-[13px] sm:text-sm text-foreground/90 italic leading-relaxed break-words">
                  "{inquiry.message}"
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 border-t border-border/30 mt-2">
                  {!inquiry.is_read && (
                    <button 
                      onClick={() => markAsRead(inquiry.id)}
                      className="text-[10px] sm:text-xs font-bold text-primary hover:bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5"
                    >
                      <Check size={12} />
                      Mark as Read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-destructive px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                  <a 
                    href={`mailto:${inquiry.email}`}
                    className="text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-primary px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Mail size={12} />
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          errorLogs.map((log) => {
            const styles = getSeverityStyles(log.severity);
            return (
              <div 
                key={log.id} 
                className="p-5 sm:p-7 rounded-3xl bg-card border border-border hover:border-primary/10 transition-all duration-500 flex flex-col md:flex-row gap-5 sm:gap-7 w-full max-w-full"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${styles.bg} ${styles.text} border ${styles.border}`}>
                  {styles.icon}
                </div>
                
                <div className="flex-1 min-w-0 space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-bold text-foreground flex items-center gap-3">
                        {log.message}
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${styles.border} ${styles.bg} ${styles.text}`}>
                          {log.severity}
                        </span>
                      </h4>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl whitespace-nowrap self-start sm:self-center border border-white/5">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe size={14} className="text-primary/60" />
                      <span className="font-mono bg-secondary/50 px-2 py-1 rounded-md">{log.path}</span>
                    </div>
                  </div>

                  {log.stack && (
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-[11px] text-muted-foreground/80 overflow-x-auto whitespace-pre">
                      {log.stack}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {!loading && ((activeTab === "inquiries" && inquiries.length === 0) || (activeTab === "errors" && errorLogs.length === 0)) && (
        <div className="py-20 text-center space-y-4 bg-card border border-dashed border-border rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground/30">
            {activeTab === "inquiries" ? <Bell size={40} /> : <Terminal size={40} />}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground">
              {activeTab === "inquiries" ? "No inquiries yet" : "No errors detected"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === "inquiries" 
                ? "When clients fill out the contact form, they'll appear here." 
                : "Your application is currently stable."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
