import React, { useState, useEffect } from "react";
import { Bell, Check, Clock, Trash2, Mail, Phone, MessageSquare, Briefcase, IndianRupee, AlertTriangle, Terminal, Info, Globe, ShieldAlert, FileText, User, Smartphone, Download } from "lucide-react";
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

interface Contract {
  id: number;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  project_name: string;
  budget: string;
  client_signature: string;
  pdf_url?: string;
  is_read: boolean;
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"inquiries" | "contracts" | "errors">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
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

  const fetchContracts = async () => {
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contracts:", error);
      // Don't toast if table doesn't exist yet, just log
    } else {
      setContracts(data || []);
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
    } else {
      setErrorLogs(data || []);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    if (activeTab === "inquiries") {
      await fetchInquiries();
    } else if (activeTab === "contracts") {
      await fetchContracts();
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
    } else if (activeTab === "contracts") {
      const markAllReadOnVisit = async () => {
        await supabase
          .from("contracts")
          .update({ is_read: true })
          .eq("is_read", false);
      };
      markAllReadOnVisit();
    }
  }, [activeTab]);

  const markAsRead = async (id: number, table: "inquiries" | "contracts") => {
    const { error } = await supabase
      .from(table)
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast.error("Error updating status");
    } else {
      if (table === "inquiries") {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
      } else {
        setContracts(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
      }
    }
  };

  const markAllAsRead = async () => {
    const table = activeTab === "inquiries" ? "inquiries" : "contracts";
    const { error } = await supabase
      .from(table)
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      toast.error("Error updating status");
    } else {
      toast.success("All marked as read");
      if (activeTab === "inquiries") fetchInquiries();
      else fetchContracts();
    }
  };

  const deleteItem = async (id: number, table: "inquiries" | "contracts") => {
    if (!confirm(`Are you sure you want to delete this ${table === "inquiries" ? "inquiry" : "contract"}?`)) return;

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(`Error deleting ${table === "inquiries" ? "inquiry" : "contract"}`);
    } else {
      toast.success(`${table === "inquiries" ? "Inquiry" : "Contract"} deleted`);
      if (table === "inquiries") {
        setInquiries(prev => prev.filter(item => item.id !== id));
      } else {
        setContracts(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  const clearLogs = async () => {
    if (!confirm("Are you sure you want to clear all error logs?")) return;
    const { error } = await supabase
      .from("error_logs")
      .delete()
      .not("id", "is", null);

    if (error) {
      toast.error("Error clearing logs");
    } else {
      toast.success("All logs cleared");
      setErrorLogs([]);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "error":
        return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", icon: <ShieldAlert size={20} /> };
      case "warning":
        return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", icon: <AlertTriangle size={20} /> };
      case "db":
        return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", icon: <Terminal size={20} /> };
      default:
        return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", icon: <Info size={20} /> };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 w-full max-w-full overflow-x-hidden">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-card border border-border rounded-2xl w-fit overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "inquiries" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare size={18} />
          Inquiries
          {inquiries.some(i => !i.is_read) && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
        </button>
        <button
          onClick={() => setActiveTab("contracts")}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "contracts" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText size={18} />
          Contracts
          {contracts.some(c => !c.is_read) && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "errors" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal size={18} />
          Errors
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <h2 className="text-2xl font-bold">
            {activeTab === "inquiries" ? "Project Inquiries" : activeTab === "contracts" ? "Project Contracts" : "System Monitoring"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {activeTab === "inquiries" ? "Manage new client leads." : activeTab === "contracts" ? "Track project agreements and signatures." : "Application stability logs."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {activeTab !== "errors" ? (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2 text-xs flex-1 sm:flex-initial">
              <Check size={16} /> Mark all read
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={clearLogs} className="gap-2 text-xs flex-1 sm:flex-initial text-destructive">
              <Trash2 size={16} /> Clear Logs
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={refreshData} className="gap-2 text-xs flex-1 sm:flex-initial">
            <Clock size={16} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 w-full">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading...</div>
        ) : activeTab === "inquiries" ? (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 group ${!inquiry.is_read ? "border-primary/20 bg-primary/5" : "bg-card border-border"}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!inquiry.is_read ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}><MessageSquare size={28} /></div>
              <div className="flex-1 min-w-0 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-3 truncate">{inquiry.full_name} {!inquiry.is_read && <span className="px-2 py-0.5 rounded-full bg-primary text-[9px] text-black font-black uppercase">New</span>}</h4>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Mail size={14} />{inquiry.email}</span><span className="flex items-center gap-1.5"><Phone size={14} />{inquiry.phone}</span></div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg h-fit border border-white/5"><Clock size={14} />{formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border">Type: {inquiry.project_type}</span>
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border font-bold flex items-center gap-1.5"><IndianRupee size={12}/>{inquiry.budget}</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 italic text-sm">"{inquiry.message}"</div>
                <div className="pt-2 flex gap-4">{!inquiry.is_read && <button onClick={() => markAsRead(inquiry.id, "inquiries")} className="text-xs font-bold text-primary flex items-center gap-1.5"><Check size={14}/>Mark Read</button>}<button onClick={() => deleteItem(inquiry.id, "inquiries")} className="text-xs font-bold text-muted-foreground hover:text-destructive flex items-center gap-1.5"><Trash2 size={14}/>Delete</button></div>
              </div>
            </div>
          ))
        ) : activeTab === "contracts" ? (
          (contracts || []).map((contract) => (
            <div key={contract.id} className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 group ${!contract.is_read ? "border-brand-green/20 bg-brand-green/5" : "bg-card border-border"}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!contract.is_read ? "bg-brand-green/20 text-brand-green" : "bg-secondary text-muted-foreground"}`}><FileText size={28} /></div>
              <div className="flex-1 min-w-0 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-3 truncate">{contract.project_name} {!contract.is_read && <span className="px-2 py-0.5 rounded-full bg-brand-green text-[9px] text-black font-black uppercase">Signed</span>}</h4>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><User size={14} />{contract.client_name}</span><span className="flex items-center gap-1.5"><Smartphone size={14} />{contract.client_phone}</span></div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg h-fit border border-white/5"><Clock size={14} />{formatDistanceToNow(new Date(contract.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border font-bold flex items-center gap-1.5"><IndianRupee size={12}/>Budget: {contract.budget}</span>
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border flex items-center gap-1.5"><Check size={12}/>Signed: <span className="italic font-serif font-bold text-brand-green">{contract.client_signature}</span></span>
                </div>
                <div className="pt-2 flex flex-wrap gap-4">
                  {!contract.is_read && <button onClick={() => markAsRead(contract.id, "contracts")} className="text-xs font-bold text-brand-green flex items-center gap-1.5 transition-colors hover:bg-brand-green/10 px-2 py-1 rounded"><Check size={14}/>Mark Read</button>}
                  {contract.pdf_url && (
                    <a 
                      href={contract.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-400 flex items-center gap-1.5 transition-colors hover:bg-blue-400/10 px-2 py-1 rounded"
                    >
                      <Download size={14}/> View Signed PDF
                    </a>
                  )}
                  <button onClick={() => deleteItem(contract.id, "contracts")} className="text-xs font-bold text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors px-2 py-1 rounded"><Trash2 size={14}/>Delete</button>
                  <a href={`mailto:${contract.client_email}`} className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors px-2 py-1 rounded"><Mail size={14}/>Email Client</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          (errorLogs || []).map((log) => {
            const styles = getSeverityStyles(log.severity);
            return (
              <div key={log.id} className="p-5 sm:p-7 rounded-3xl bg-card border border-border flex flex-col md:flex-row gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${styles.bg} ${styles.text} border ${styles.border}`}>{styles.icon}</div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <h4 className="text-lg font-bold truncate flex-1">{log.message}</h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap"><Clock size={14} />{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="font-mono text-[10px] bg-secondary/50 px-2 py-1 rounded w-fit">{log.path}</div>
                  {log.stack && <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-muted-foreground/80 overflow-x-auto">{log.stack}</div>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && ((activeTab === "inquiries" && inquiries.length === 0) || (activeTab === "contracts" && contracts.length === 0) || (activeTab === "errors" && errorLogs.length === 0)) && (
        <div className="py-20 text-center space-y-4 bg-card border border-dashed border-border rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground/30">{activeTab === "inquiries" ? <MessageSquare size={40} /> : activeTab === "contracts" ? <FileText size={40} /> : <Terminal size={40} />}</div>
          <h3 className="font-bold text-foreground">No {activeTab} yet</h3>
        </div>
      )}
    </div>
  );
};

export default Notifications;

