import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  Copy, 
  Mail, 
  Link as LinkIcon, 
  CheckCircle2, 
  IndianRupee, 
  User, 
  Briefcase, 
  Hash, 
  Percent,
  ExternalLink,
  Zap,
  Loader2,
  Lock,
  Clock
} from "lucide-react";

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    projectName: "",
    serviceName: "",
    totalAmount: "",
    advancePercentage: "50",
  });

  const [generatedLink, setGeneratedLink] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Generate initial IDs on mount
  useEffect(() => {
    resetGenerator();
  }, []);

  const resetGenerator = () => {
    const invId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const token = Math.random().toString(36).substring(2, 10); // 8 chars
    setInvoiceId(invId);
    setAccessToken(token);
    setGeneratedLink("");
  };

  // Recalculate advance amount whenever total or percentage changes
  useEffect(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    const percentage = parseFloat(formData.advancePercentage) || 0;
    setAdvanceAmount(Math.round(total * (percentage / 100)));
  }, [formData.totalAmount, formData.advancePercentage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.projectName || !formData.totalAmount || !formData.serviceName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      // Set expiry to 24 hours from now
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('payments')
        .insert([
          {
            invoice_id: invoiceId,
            access_token: accessToken,
            client_name: formData.clientName,
            client_email: formData.clientEmail,
            project_name: formData.projectName,
            service: formData.serviceName,
            total_amount: parseFloat(formData.totalAmount),
            advance_amount: advanceAmount,
            status: 'pending',
            expires_at: expiresAt
          }
        ]);

      if (error) throw error;

      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/payment/${invoiceId}-${accessToken}`;
      setGeneratedLink(fullUrl);
      toast.success("Secure link generated successfully!");
    } catch (error: any) {
      console.error("Error saving payment:", error);
      toast.error(error.message || "Failed to save payment to database");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Secure link copied to clipboard");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create Payment</h1>
          <Badge className="bg-brand-green/20 text-brand-green border-brand-green/20 tracking-widest text-[10px] py-1 w-fit">Secure v2</Badge>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">Generate token-protected, time-limited payment links.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Card */}
        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-white">
              <Plus className="w-5 h-5 text-brand-green" /> Payment Details
            </CardTitle>
            <CardDescription className="text-slate-400">Fill in the project and client information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateLink} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="flex items-center gap-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Client Name
                  </Label>
                  <Input 
                    id="clientName" 
                    name="clientName"
                    placeholder="e.g. John Doe"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="bg-black/40 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> Client Email
                  </Label>
                  <Input 
                    id="clientEmail" 
                    name="clientEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName" className="flex items-center gap-2 text-slate-300">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Project Name
                </Label>
                <Input 
                  id="projectName" 
                  name="projectName"
                  placeholder="e.g. Website Rebrand"
                  value={formData.projectName}
                  onChange={handleChange}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceName" className="flex items-center gap-2 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-slate-500" /> Service Description
                </Label>
                <Input 
                  id="serviceName" 
                  name="serviceName"
                  placeholder="e.g. Standard Branding + Custom React Site"
                  value={formData.serviceName}
                  onChange={handleChange}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="flex items-center gap-2 text-slate-300">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> Total Amount
                  </Label>
                  <Input 
                    id="totalAmount" 
                    name="totalAmount"
                    type="number"
                    placeholder="0.00"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="bg-black/40 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advancePercentage" className="flex items-center gap-2 text-slate-300">
                    <Percent className="w-3.5 h-3.5 text-slate-500" /> Advance Percentage
                  </Label>
                  <Input 
                    id="advancePercentage" 
                    name="advancePercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.advancePercentage}
                    onChange={handleChange}
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-green/5 border border-brand-green/10 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-semibold tracking-widest mb-1">Due Now</span>
                  <span className="text-2xl font-bold text-brand-green tracking-tight">₹{advanceAmount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-semibold tracking-widest mb-1 block">Expiry</span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-end">
                    <Clock className="w-3 h-3" /> 24 Hours
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full h-12 text-base font-semibold bg-brand-green text-black hover:bg-brand-green/90 shadow-lg shadow-brand-green/10 transition-all hover:scale-[1.01]"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Securing...</> : <><Lock className="w-4 h-4 mr-2" /> Generate Secure Link</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Link Result Card */}
        <div className="space-y-8">
          <Card className={`border-white/10 bg-slate-900/40 backdrop-blur-sm transition-all duration-700 ${generatedLink ? 'opacity-100' : 'opacity-40'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-brand-green" /> Payment Link
              </CardTitle>
              <CardDescription className="text-slate-400">Ready to share with your client.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-300 text-[10px] font-semibold">
                    <Hash className="w-3.5 h-3.5 text-slate-500" /> Invoice
                  </Label>
                  <div className="h-10 px-3 sm:px-4 bg-black/40 rounded-lg flex items-center font-mono font-bold border border-white/10 text-white text-xs sm:text-sm truncate">
                    {invoiceId || "INV-000000"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-300 text-[10px] font-semibold">
                    <Lock className="w-3.5 h-3.5 text-slate-500" /> Token
                  </Label>
                  <div className="h-10 px-3 sm:px-4 bg-black/40 rounded-lg flex items-center font-mono font-bold border border-white/10 text-white text-xs sm:text-sm truncate">
                    {accessToken || "00000000"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-300 text-[10px] font-semibold">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500" /> Secure Payment URL
                </Label>
                <div className="relative">
                  <Input 
                    value={generatedLink} 
                    placeholder="Link will appear here..."
                    readOnly 
                    className="pr-20 sm:pr-24 font-mono text-[11px] sm:text-xs bg-black/40 h-12 border-white/10 text-brand-green/80 placeholder:text-slate-700"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    disabled={!generatedLink}
                    onClick={copyToClipboard}
                    className="absolute right-1 top-1 h-10 text-slate-400 hover:text-brand-green hover:bg-brand-green/10 transition-all px-3 sm:px-4"
                  >
                    <Copy className="w-3.5 h-3.5 sm:mr-2" /> <span className="hidden sm:inline">Copy</span>
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  disabled={!generatedLink}
                  className="flex-1 h-12 border-white/10 text-white hover:bg-white/5 active:scale-95 transition-transform"
                  onClick={() => generatedLink && window.open(generatedLink, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2 text-brand-green" /> Preview Link
                </Button>
                <Button 
                  variant="outline" 
                  disabled={!generatedLink}
                  className="flex-1 h-12 border-white/10 text-white hover:bg-white/5 active:scale-95 transition-transform"
                  onClick={() => {
                    if (!generatedLink) return;
                    const subject = encodeURIComponent(`Secure Invoice: ${invoiceId} - Graphoria Creativity Design`);
                    const body = encodeURIComponent(`Hi ${formData.clientName},\n\nYour secure payment link for the project "${formData.projectName}" is now active.\n\nPlease note: This link is protected and will expire in 24 hours.\n\nPayment Link:\n${generatedLink}\n\nTotal: ₹${formData.totalAmount}\nAdvance Due: ₹${advanceAmount}\n\nThank you for choosing Graphoria!`);
                    window.location.href = `mailto:${formData.clientEmail}?subject=${subject}&body=${body}`;
                  }}
                >
                  <Mail className="w-4 h-4 mr-2 text-brand-green" /> Send Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="ghost" 
            className="w-full text-slate-500 hover:text-white transition-colors"
            onClick={() => {
              setFormData({
                clientName: "",
                clientEmail: "",
                projectName: "",
                serviceName: "",
                totalAmount: "",
                advancePercentage: "50",
              });
              resetGenerator();
            }}
          >
            Clear and Create New
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
