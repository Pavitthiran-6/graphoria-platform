import React, { useState, useEffect } from "react";
import { 
  Check, 
  Clock, 
  Trash2, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Terminal, 
  Info, 
  ShieldAlert, 
  FileText, 
  User, 
  Smartphone, 
  Download,
  CreditCard,
  Hash,
  ArrowRight,
  RefreshCw,
  XCircle,
  FileCheck
} from "lucide-react";
import Button from "../components/Button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

interface PaymentRecord {
  id: string;
  invoice_id: string;
  client_name: string;
  client_email?: string;
  project_name: string;
  service?: string;
  total_amount: number;
  advance_amount: number;
  transaction_id: string;
  status: string;
  created_at: string;
  is_read?: boolean;
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"inquiries" | "contracts" | "payments" | "invoices" | "errors">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [invoices, setInvoices] = useState<PaymentRecord[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
      // Filter for invoices tab
      setInvoices(data?.filter(p => p.status === "paid") || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchErrorLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setErrorLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    if (activeTab === "inquiries") await fetchInquiries();
    else if (activeTab === "contracts") await fetchContracts();
    else if (activeTab === "payments" || activeTab === "invoices") await fetchPayments();
    else await fetchErrorLogs();
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    const markAsReadEffect = async () => {
      const table = activeTab === "inquiries" ? "inquiries" : activeTab === "contracts" ? "contracts" : (activeTab === "payments" || activeTab === "invoices") ? "payments" : null;
      if (!table) return;

      try {
        await supabase
          .from(table)
          .update({ is_read: true })
          .eq("is_read", false);
      } catch (e) {
        // Table might not have is_read column yet
      }
    };

    markAsReadEffect();
  }, [activeTab]);

  const markAsRead = async (id: any, table: "inquiries" | "contracts" | "payments") => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      if (table === "inquiries") {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
      } else if (table === "contracts") {
        setContracts(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
      } else {
        setPayments(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
        setInvoices(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const deleteItem = async (id: any, table: "inquiries" | "contracts" | "payments") => {
    if (!confirm(`Are you sure you want to delete this ${table.slice(0, -1)}?`)) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success(`${table.charAt(0).toUpperCase() + table.slice(1, -1)} deleted`);
      if (table === "inquiries") setInquiries(prev => prev.filter(item => item.id !== id));
      else if (table === "contracts") setContracts(prev => prev.filter(item => item.id !== id));
      else {
        setPayments(prev => prev.filter(item => item.id !== id));
        setInvoices(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const clearAll = async () => {
    const currentTable = activeTab === "inquiries" ? "inquiries" : activeTab === "contracts" ? "contracts" : (activeTab === "payments" || activeTab === "invoices") ? "payments" : "error_logs";
    
    if (!confirm(`Are you sure you want to clear ALL ${activeTab}? This action cannot be undone.`)) return;

    setLoading(true);
    try {
      let query = supabase.from(currentTable).delete();
      
      if (activeTab === "invoices") {
        query = query.eq("status", "paid");
      } else {
        // Universal match for all IDs (works for both Integer and UUID)
        query = query.not("id", "is", null);
      }

      const { error } = await query;

      if (error) throw error;

      toast.success(`All ${activeTab} cleared successfully`);
      
      if (activeTab === "inquiries") setInquiries([]);
      else if (activeTab === "contracts") setContracts([]);
      else if (activeTab === "payments") setPayments([]);
      else if (activeTab === "invoices") setInvoices([]);
      else setErrorLogs([]);
      
    } catch (error: any) {
      console.error("Error clearing data:", error);
      toast.error("Failed to clear data");
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = (payment: PaymentRecord) => {
    const doc = new jsPDF();
    const dateStr = new Date(payment.created_at).toLocaleDateString('en-GB');

    // --- Header ---
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("GRAPHORIA", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("CREATIVITY DESIGN", 20, 26);
    doc.text("Creative Digital Agency", 20, 31);

    doc.setFontSize(9);
    doc.text("graphoriacreativitydesign@gmail.com", 140, 22);
    doc.text("+91 93600 73899", 140, 28);

    // --- Invoice Meta ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PAID RECEIPT", 140, 60);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice ID: ${payment.invoice_id}`, 140, 68);
    doc.text(`Date: ${dateStr}`, 140, 73);
    doc.setTextColor(0, 180, 80);
    doc.setFont("helvetica", "bold");
    doc.text(`Transaction ID: ${payment.transaction_id}`, 140, 78);

    // --- Bill To ---
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(payment.client_name, 20, 68);
    if (payment.client_email) doc.text(payment.client_email, 20, 73);

    // --- Project Info ---
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT DETAILS:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Project: ${payment.project_name}`, 20, 98);
    if (payment.service) doc.text(`Service: ${payment.service}`, 20, 103);

    // --- Table ---
    autoTable(doc, {
      startY: 115,
      head: [['Description', 'Amount']],
      body: [
        [payment.service || payment.project_name, `INR ${payment.total_amount.toLocaleString()}`],
      ],
      headStyles: { fillColor: [0, 255, 136], textColor: [0, 0, 0], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 }
    });

    // --- Summary ---
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.text("Total Project Amount:", 120, finalY);
    doc.text(`INR ${payment.total_amount.toLocaleString()}`, 190, finalY, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 180, 80);
    doc.text(`Paid Advance:`, 120, finalY + 8);
    doc.text(`INR ${payment.advance_amount.toLocaleString()}`, 190, finalY + 8, { align: "right" });

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    const remaining = payment.total_amount - payment.advance_amount;
    doc.text("Remaining Balance Due:", 120, finalY + 16);
    doc.text(`INR ${remaining.toLocaleString()}`, 190, finalY + 16, { align: "right" });

    // --- Footer ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing Graphoria Creativity Design!", 105, 280, { align: "center" });

    doc.save(`Graphoria_Receipt_${payment.invoice_id}.pdf`);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "error": return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", icon: <ShieldAlert size={20} /> };
      case "warning": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", icon: <AlertTriangle size={20} /> };
      case "db": return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", icon: <Terminal size={20} /> };
      default: return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", icon: <Info size={20} /> };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 w-full max-w-full overflow-x-hidden">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-card border border-border rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar touch-pan-x">
        <div className="flex min-w-full sm:min-w-0">
          {[
            { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={18} />, unread: inquiries?.some(i => !i.is_read) },
            { id: "contracts", label: "Contracts", icon: <FileText size={18} />, unread: contracts?.some(c => !c.is_read) },
            { id: "payments", label: "Links", icon: <CreditCard size={18} />, unread: payments?.some(p => p.status === "pending" && !p.is_read) },
            { id: "invoices", label: "Invoices", icon: <FileCheck size={18} />, unread: invoices?.some(p => !p.is_read) },
            { id: "errors", label: "Errors", icon: <Terminal size={18} />, unread: false },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className={`sm:inline ${activeTab === tab.id ? "inline" : "hidden"}`}>{tab.label}</span>
              {tab.unread && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {activeTab === "inquiries" ? "Project Inquiries" : activeTab === "contracts" ? "Project Contracts" : activeTab === "payments" ? "Payment Links" : activeTab === "invoices" ? "Client Invoices" : "System Monitoring"}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {activeTab === "inquiries" ? "Manage new client leads." : activeTab === "contracts" ? "Track project agreements." : activeTab === "payments" ? "Track all generated payment URLs." : activeTab === "invoices" ? "Download receipts for paid clients." : "Application stability logs."}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={refreshData} className="gap-2 text-xs flex-1 sm:flex-none h-10">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="gap-2 text-xs flex-1 sm:flex-none h-10 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Trash2 size={16} /> Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 w-full px-1">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
            <Clock className="animate-spin text-primary" /> Loading notifications...
          </div>
        ) : activeTab === "inquiries" ? (
          (inquiries || []).map((inquiry) => (
            <div key={inquiry.id} className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 group ${!inquiry.is_read ? "border-primary/20 bg-primary/5" : "bg-card border-border"}`}>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!inquiry.is_read ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}><MessageSquare size={28} /></div>
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold flex items-center gap-3 truncate">{inquiry.full_name} {!inquiry.is_read && <span className="px-2 py-0.5 rounded-full bg-primary text-[9px] text-black font-black uppercase">New</span>}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground min-w-0">
                      <span className="truncate">{inquiry.email}</span>
                      <span>{inquiry.phone}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-black/20 px-3 py-1.5 rounded-lg h-fit border border-white/5 whitespace-nowrap self-start sm:self-center">{inquiry.created_at ? formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true }) : 'unknown'}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border">{inquiry.project_type}</span>
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border font-bold">₹ {inquiry.budget}</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 italic text-sm">"{inquiry.message}"</div>
                <div className="pt-2 flex flex-wrap gap-4">
                  {!inquiry.is_read && <button onClick={() => markAsRead(inquiry.id, "inquiries")} className="text-xs font-bold text-primary flex items-center gap-1.5"><Check size={14}/>Mark Read</button>}
                  <button onClick={() => deleteItem(inquiry.id, "inquiries")} className="text-xs font-bold text-muted-foreground hover:text-destructive flex items-center gap-1.5"><Trash2 size={14}/>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === "contracts" ? (
          (contracts || []).map((contract) => (
            <div key={contract.id} className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 group ${!contract.is_read ? "border-brand-green/20 bg-brand-green/5" : "bg-card border-border"}`}>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!contract.is_read ? "bg-brand-green/20 text-brand-green" : "bg-secondary text-muted-foreground"}`}><FileText size={28} /></div>
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold flex items-center gap-3 truncate">{contract.project_name} {!contract.is_read && <span className="px-2 py-0.5 rounded-full bg-brand-green text-[9px] text-black font-black uppercase">Signed</span>}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground min-w-0">
                      <span className="truncate">{contract.client_name}</span>
                      <span>{contract.client_phone}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-black/20 px-3 py-1.5 rounded-lg h-fit border border-white/5 whitespace-nowrap self-start sm:self-center">{contract.created_at ? formatDistanceToNow(new Date(contract.created_at), { addSuffix: true }) : 'unknown'}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border font-bold">₹ {contract.budget}</span>
                  <span className="bg-secondary px-3 py-1 rounded-lg border border-border">Signed: <span className="italic font-serif font-bold text-brand-green">{contract.client_signature}</span></span>
                </div>
                <div className="pt-2 flex flex-wrap gap-4">
                  {!contract.is_read && <button onClick={() => markAsRead(contract.id, "contracts")} className="text-xs font-bold text-brand-green flex items-center gap-1.5"><Check size={14}/>Mark Read</button>}
                  {contract.pdf_url && <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 flex items-center gap-1.5"><Download size={14}/>View PDF</a>}
                  <button onClick={() => deleteItem(contract.id, "contracts")} className="text-xs font-bold text-muted-foreground hover:text-destructive flex items-center gap-1.5"><Trash2 size={14}/>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === "payments" ? (
          (payments || []).map((payment) => (
            <div key={payment.id} className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 group ${!payment.is_read ? "border-primary/20 bg-primary/5" : "bg-card border-border"}`}>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!payment.is_read ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                <CreditCard size={28} />
              </div>
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold flex items-center gap-3 truncate">
                      {payment.client_name} 
                      {payment.status === "paid" ? (
                        <span className="px-2 py-0.5 rounded-full bg-brand-green text-[9px] text-black font-black uppercase ml-2">Paid</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[9px] text-black font-black uppercase ml-2">Pending</span>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1 truncate"><Hash size={14} className="shrink-0" /> {payment.invoice_id} • {payment.project_name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-black/40 px-3 py-1.5 rounded-lg h-fit border border-white/5 whitespace-nowrap self-start sm:self-center">{payment.created_at ? formatDistanceToNow(new Date(payment.created_at), { addSuffix: true }) : 'unknown'}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Transaction ID</p>
                    <p className="text-sm font-mono font-bold text-white break-all">{payment.transaction_id || "None yet"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Advance Amount</p>
                    <p className="text-xl font-bold text-foreground">₹{payment.advance_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  {!payment.is_read && <button onClick={() => markAsRead(payment.id, "payments")} className="text-xs font-bold text-primary flex items-center gap-1.5"><Check size={14}/>Mark Read</button>}
                  <button onClick={() => deleteItem(payment.id, "payments")} className="text-xs font-bold text-muted-foreground hover:text-destructive flex items-center gap-1.5"><Trash2 size={14}/>Delete Record</button>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === "invoices" ? (
          (invoices || []).map((invoice) => (
            <div key={invoice.id} className={`p-5 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row gap-5 group ${!invoice.is_read ? "border-brand-green/20 bg-brand-green/5" : "bg-card border-border"}`}>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!invoice.is_read ? "bg-brand-green/20 text-brand-green shadow-[0_0_20px_rgba(0,255,136,0.1)]" : "bg-secondary text-muted-foreground"}`}>
                <FileCheck size={28} />
              </div>
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold flex items-center gap-3 truncate">{invoice.client_name} <span className="px-2 py-0.5 rounded-full bg-brand-green text-[9px] text-black font-black uppercase">Paid</span></h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1 truncate"><Hash size={14} className="shrink-0" /> {invoice.invoice_id} • {invoice.project_name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-black/40 px-3 py-1.5 rounded-lg h-fit border border-white/5 whitespace-nowrap self-start sm:self-center">{invoice.created_at ? formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true }) : 'unknown'}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Receipt ID</p>
                    <p className="text-sm font-mono font-bold text-white break-all">{invoice.transaction_id}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-brand-green/5 border border-brand-green/10">
                    <p className="text-[10px] text-brand-green/50 uppercase font-bold tracking-widest mb-1">Verified Amount</p>
                    <p className="text-xl font-bold text-brand-green">₹{invoice.advance_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <button onClick={() => generateInvoicePDF(invoice)} className="text-xs font-bold text-brand-green flex items-center gap-1.5 uppercase tracking-widest hover:brightness-125 transition-all">
                    <Download size={14}/>Download Invoice
                  </button>
                  {!invoice.is_read && <button onClick={() => markAsRead(invoice.id, "payments")} className="text-xs font-bold text-primary flex items-center gap-1.5"><Check size={14}/>Mark Viewed</button>}
                </div>
              </div>
            </div>
          ))
        ) : (
          (errorLogs || []).map((log) => {
            const styles = getSeverityStyles(log.severity);
            return (
              <div key={log.id} className="p-5 sm:p-7 rounded-3xl bg-card border border-border flex flex-col md:flex-row gap-5">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${styles.bg} ${styles.text} border ${styles.border}`}>{styles.icon}</div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <h4 className="text-base sm:text-lg font-bold flex-1 break-words">{log.message}</h4>
                    <span className="text-xs text-muted-foreground bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap self-start sm:self-center">{log.created_at ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true }) : 'unknown'}</span>
                  </div>
                  <div className="font-mono text-[10px] bg-secondary/50 px-2 py-1 rounded w-fit max-w-full break-all">{log.path}</div>
                  {log.stack && <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-muted-foreground/80 overflow-x-auto whitespace-pre-wrap break-all no-scrollbar">{log.stack}</div>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && (
        ((activeTab === "inquiries" && inquiries.length === 0) || 
         (activeTab === "contracts" && contracts.length === 0) || 
         (activeTab === "payments" && payments.length === 0) ||
         (activeTab === "invoices" && invoices.length === 0) ||
         (activeTab === "errors" && errorLogs.length === 0)) && (
          <div className="py-20 text-center space-y-4 bg-card border border-dashed border-border rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground/30">
              {activeTab === "inquiries" ? <MessageSquare size={40} /> : activeTab === "contracts" ? <FileText size={40} /> : activeTab === "payments" ? <CreditCard size={40} /> : activeTab === "invoices" ? <FileCheck size={40} /> : <Terminal size={40} />}
            </div>
            <h3 className="font-bold text-foreground">No {activeTab} yet</h3>
          </div>
        )
      )}
    </div>
  );
};

export default Notifications;
