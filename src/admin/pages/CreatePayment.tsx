import React, { useState } from "react";
import {
  CreditCard,
  User,
  Mail,
  Briefcase,
  IndianRupee,
  Percent,
  Lock,
  Hash,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Clock,
  Loader2,
  CheckCircle2,
  Download,
  FileText,
  Smartphone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Button from "../components/Button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    projectName: "",
    serviceDescription: "",
    totalAmount: "",
    advancePercentage: "50",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "totalAmount" || name === "advancePercentage") {
      const total = name === "totalAmount" ? parseFloat(value) : parseFloat(formData.totalAmount);
      const percent = name === "advancePercentage" ? parseFloat(value) : parseFloat(formData.advancePercentage);

      if (!isNaN(total) && !isNaN(percent)) {
        setAdvanceAmount((total * percent) / 100);
      }
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Generate Invoice ID
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const newInvoiceId = `INV-${randomId}`;
      setInvoiceId(newInvoiceId);

      // 2. Generate Access Token
      const token = Math.random().toString(36).substring(2, 10).toUpperCase();
      setAccessToken(token);

      // 3. Calculate Expiry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // 4. Save to Supabase
      const { error } = await supabase
        .from("payments")
        .insert({
          invoice_id: newInvoiceId,
          access_token: token,
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          project_name: formData.projectName,
          service: formData.serviceDescription,
          total_amount: parseFloat(formData.totalAmount),
          advance_amount: advanceAmount,
          expires_at: expiresAt.toISOString(),
          status: "pending"
        });

      if (error) throw error;

      // 5. Generate Link
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/payment/${newInvoiceId}-${token}`;
      setGeneratedLink(fullUrl);

      toast.success("Payment link generated successfully!");
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast.error(error.message || "Failed to create payment link");
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
              <CreditCard className="w-5 h-5 text-brand-green" /> Payment Details
            </CardTitle>
            <CardDescription className="text-slate-400">Fill in the client and project information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-slate-300">Client Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      id="clientName"
                      name="clientName"
                      placeholder="e.g. John Doe"
                      required
                      value={formData.clientName}
                      onChange={handleChange}
                      className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-slate-300">Client Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      id="clientEmail"
                      name="clientEmail"
                      type="email"
                      placeholder="e.g. john@example.com"
                      required
                      value={formData.clientEmail}
                      onChange={handleChange}
                      className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-slate-300">Project Name</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input
                    id="projectName"
                    name="projectName"
                    placeholder="e.g. Website Redesign"
                    required
                    value={formData.projectName}
                    onChange={handleChange}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDescription" className="text-slate-300">Service Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input
                    id="serviceDescription"
                    name="serviceDescription"
                    placeholder="e.g. Full Stack Development + SEO"
                    required
                    value={formData.serviceDescription}
                    onChange={handleChange}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="text-slate-300">Total Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      placeholder="e.g. 50000"
                      required
                      value={formData.totalAmount}
                      onChange={handleChange}
                      className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advancePercentage" className="text-slate-300">Advance %</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      id="advancePercentage"
                      name="advancePercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.advancePercentage}
                      onChange={handleChange}
                      className="pl-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>
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

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setGeneratedLink("");
                setFormData({
                  clientName: "",
                  clientEmail: "",
                  projectName: "",
                  serviceDescription: "",
                  totalAmount: "",
                  advancePercentage: "50",
                });
              }}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Clear and Create New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
