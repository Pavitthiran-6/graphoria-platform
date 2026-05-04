import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";
import {
  Copy,
  CheckCircle2,
  CreditCard,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Info,
  Loader2,
  Mail,
  CheckCircle,
  Clock,
  Zap,
  AlertTriangle,
  Home,
  Lock,
  Timer
} from 'lucide-react';
import graphoriaLogo from "@/assets/graphoria-logo.png";

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<{ title: string, message: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const [closeCountdown, setCloseCountdown] = useState(5);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setInterval(() => {
        setCloseCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.close();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSubmitted]);

  useEffect(() => {
    fetchPaymentData();
  }, [invoiceId]);

  useEffect(() => {
    if (!paymentData?.expires_at || isSubmitted) return;

    const timer = setInterval(() => {
      const expiry = new Date(paymentData.expires_at).getTime();
      const now = new Date().getTime();
      const distance = expiry - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRED');
        setError({
          title: "Payment Link Expired",
          message: "This secure link was only valid for 24 hours. Please contact Graphoria Creativity Design to generate a new payment link."
        });
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData, isSubmitted]);

  const fetchPaymentData = async () => {
    if (!invoiceId) return;

    setLoading(true);
    try {
      // Split invoiceId-token (format: INV-123456-abcdefgh)
      const parts = invoiceId.split('-');
      if (parts.length < 3) {
        throw new Error("Invalid link structure");
      }

      const tokenFromUrl = parts.pop();
      const invIdOnly = parts.join('-');

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('invoice_id', invIdOnly)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Invoice not found");

      // Security Validation
      if (data.access_token !== tokenFromUrl) {
        setError({
          title: "Access Denied",
          message: "The security token for this payment link is invalid. Please ensure you are using the original link provided."
        });
        setLoading(false);
        return;
      }

      // Expiry Check
      if (new Date() > new Date(data.expires_at)) {
        setError({
          title: "Link Expired",
          message: "This secure payment link has expired. For security reasons, links are only valid for 24 hours."
        });
        setLoading(false);
        return;
      }

      setPaymentData(data);
      if (data.status === 'paid' || data.status === 'completed') {
        setIsSubmitted(true);
        setTransactionId(data.transaction_id || '');
      }
    } catch (err: any) {
      console.error("Error fetching payment:", err);
      setError({
        title: "Invalid Link",
        message: "We couldn't find a valid payment record for this link. It may have been expired or deleted."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpi = () => {
    const upiId = "graphoria.design@upi";
    navigator.clipboard.writeText(upiId);
    setIsCopying(true);
    toast.success("UPI ID copied to clipboard");
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!transactionId.trim() || transactionId.length < 8) {
      toast.error("Please enter a valid Transaction ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          transaction_id: transactionId
        })
        .eq('invoice_id', paymentData.invoice_id);

      if (error) throw error;

      // Trigger email notification to admin
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            table: 'payments',
            record: {
              ...paymentData,
              transaction_id: transactionId,
              status: 'paid'
            }
          }
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
        // Don't block the UI success for email failures
      }

      setIsSubmitted(true);
      toast.success("Payment details submitted for verification");
    } catch (err: any) {
      console.error("Error submitting payment:", err);
      toast.error(err.message || "Failed to submit payment details");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest text-xs uppercase">Establishing Secure Connection...</p>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full border border-red-500/20 bg-slate-900/60 backdrop-blur-xl p-8 text-center space-y-6 rounded-3xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{error?.title || "Secure Link Error"}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {error?.message || "🔒 This payment link is invalid or has expired. Please contact Graphoria Creativity Design."}
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full h-12 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Website
          </Button>
        </Card>
      </div>
    );
  }

  const upiPayUrl = `upi://pay?pa=graphoria.design@upi&pn=Graphoria%20Design&am=${paymentData.advance_amount}&cu=INR&tn=${encodeURIComponent(paymentData.invoice_id)}`;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />

        <Card className="max-w-md w-full border border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-2xl animate-in zoom-in fade-in duration-500 rounded-3xl relative z-10">
          <CardContent className="pt-16 pb-12 px-10 text-center space-y-6">
            <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(151,255,0,0.15)]">
              <CheckCircle2 className="w-12 h-12 text-brand-green" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Payment Received</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                We've received your transaction details.
              </p>
              <div className="flex flex-col items-center gap-1.5 pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Transaction ID</span>
                <div className="font-mono font-bold text-white bg-white/5 px-4 py-2 rounded-xl border border-white/10 break-all max-w-full">
                  {transactionId}
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Amount Secured</p>
              <p className="text-xl font-bold text-brand-green">₹{paymentData.advance_amount.toLocaleString()}</p>
            </div>

            <div className="flex flex-col items-center gap-2 pt-4">
              <p className="text-slate-500 text-xs">
                Your project kickoff process is now underway.
              </p>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">Closing in {closeCountdown}s</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => window.close()}
                className="w-full h-12 bg-white hover:bg-slate-100 text-black rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Close Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isInvalid = touched && (!transactionId.trim() || transactionId.length < 8);
  const isValid = transactionId.trim().length >= 8;

  return (
    <div className="min-h-screen bg-black py-8 sm:py-12 px-4 font-sans flex flex-col items-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-[700px] w-full mb-6 sm:mb-8 text-center space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex justify-center mb-4 sm:mb-6">
          <img src={graphoriaLogo} alt="Graphoria Logo" className="h-8 sm:h-12 hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase break-words px-2">Graphoria Creativity Design</h1>
          <div className="flex items-center justify-center gap-3">
            <p className="text-slate-400 font-medium text-[12px] sm:text-sm flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-brand-green" /> Token Secured Link
            </p>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <p className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" /> {timeLeft}
            </p>
          </div>
        </div>
      </div>

      {/* Main Payment Card */}
      <Card className="max-w-[700px] w-full border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-2xl sm:rounded-[24px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Invoice Summary Section */}
        <div className="bg-slate-900/80 p-6 sm:p-10 text-white relative overflow-hidden border-b border-white/10">
          <div className="absolute top-[-10%] right-[-5%] w-60 h-60 bg-brand-green/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="space-y-3 w-full sm:w-auto">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Invoice For</span>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight break-words">{paymentData.client_name}</h2>
                </div>
                <div className="flex flex-col">
                  <Badge variant="outline" className="w-fit text-brand-green/70 border-brand-green/20 uppercase tracking-widest text-[9px] px-2 py-0.5 mb-2 font-black">Project Details</Badge>
                  <h3 className="text-base sm:text-lg font-semibold text-white/90 leading-tight break-words">{paymentData.project_name}</h3>
                </div>
              </div>
              <div className="sm:text-right flex flex-col sm:items-end w-full sm:w-auto">
                <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Advance Amount</span>
                <p className="text-3xl sm:text-4xl font-black text-brand-green leading-tight drop-shadow-[0_0_15px_rgba(151,255,0,0.3)]">₹{paymentData.advance_amount.toLocaleString()}</p>
                <div className="mt-2 flex items-center sm:justify-end gap-2 text-slate-500 font-mono text-[11px] bg-white/5 px-2 py-1 rounded w-fit">
                  {paymentData.invoice_id}
                </div>
                <p className="text-[9px] text-slate-600 mt-2 font-medium flex items-center gap-1.5 sm:justify-end">
                  Protected by Token <ShieldCheck className="w-3 h-3 text-brand-green" />
                </p>
              </div>
            </div>

            <Separator className="bg-white/5 mb-6 sm:mb-8" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Service Breakdown</p>
                <p className="text-sm font-medium text-white/80 flex items-center gap-2 break-words">
                  <Zap className="w-3.5 h-3.5 text-brand-green shrink-0" /> {paymentData.service}
                </p>
              </div>
              <div className="space-y-2 sm:text-right">
                <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Total Valuation</p>
                <p className="text-base sm:text-lg font-bold text-white">₹{paymentData.total_amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-10">
          {/* Payment Methods Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-brand-green/10 rounded-xl border border-brand-green/20">
                <QrCode className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">UPI Payment</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Fast & Secure via UPI</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start bg-white/[0.02] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-inner">
              {/* QR Block */}
              <div className="flex flex-col items-center space-y-4 sm:space-y-5 w-full lg:w-auto">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Scan to Pay</p>
                <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[24px] shadow-[0_0_40px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-500">
                  <div className="w-36 h-36 sm:w-40 sm:h-40 bg-white flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiPayUrl)}`}
                      alt="Payment QR Code"
                      className="w-full h-full p-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                  <ShieldCheck className="w-3 h-3 text-brand-green" /> Secure payment via UPI
                </div>
              </div>

              {/* UPI Details Block */}
              <div className="space-y-6 w-full flex-1">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Direct UPI ID</Label>
                  <div className="group relative">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 bg-black/60 border border-white/10 h-12 px-4 rounded-xl flex items-center font-mono text-sm text-slate-300 group-hover:border-white/20 transition-colors overflow-hidden truncate">
                        graphoria.design@upi
                      </div>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={handleCopyUpi}
                        className={`h-12 rounded-xl transition-all border-white/10 shrink-0 flex items-center justify-center gap-2 sm:w-auto w-full ${isCopying ? 'bg-brand-green/10 border-brand-green/50 text-brand-green' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20'}`}
                      >
                        {isCopying ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="sm:hidden text-xs font-bold uppercase tracking-wider">Copy UPI ID</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-brand-green/60 font-medium text-center sm:text-left">Ensure the name shows as <span className="font-bold underline">Graphoria Design</span></p>
                </div>

                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex gap-3 shadow-sm">
                  <div className="shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Scan the QR or use the UPI ID above to complete the advance payment for your project.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Transaction Input Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-brand-green/10 rounded-xl border border-brand-green/20">
                <CreditCard className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">Payment Confirmation</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Verify your transaction</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="transactionId" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction / Reference ID</Label>
                <div className="relative">
                  <Input
                    id="transactionId"
                    placeholder="Enter Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    onBlur={() => setTouched(true)}
                    className={`h-12 sm:h-14 bg-black/60 rounded-xl sm:rounded-[16px] transition-all duration-300 text-sm text-white placeholder:text-slate-700 px-5 shadow-inner ${isInvalid ? 'border-red-500/50 focus:ring-red-500/10' :
                        isValid ? 'border-brand-green/50 focus:ring-brand-green/10 shadow-[0_0_15px_rgba(151,255,0,0.05)]' :
                          'border-white/10 focus:border-white/30 focus:ring-white/5'
                      }`}
                  />
                  {isValid && <CheckCircle className="w-4 h-4 text-brand-green absolute right-5 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in" />}
                </div>
                <p className={`text-[10px] font-medium transition-colors ${isInvalid ? 'text-red-400' : 'text-slate-600'}`}>
                  {isInvalid ? 'Please enter a valid transaction ID' : 'Required after completing payment'}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!transactionId.trim() || isSubmitting}
                  className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-[18px] font-black uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-xs shadow-xl transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 ${isValid ? 'bg-brand-green text-black hover:scale-[1.01] hover:shadow-brand-green/20' : 'bg-white/5 text-slate-600 border border-white/5'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Payment <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>

        {/* Next Steps & Support Section */}
        <div className="bg-black/60 p-6 sm:p-10 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            <div className="space-y-5">
              <p className="font-black text-white text-[10px] uppercase tracking-[0.2em]">What Happens Next</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 group">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-green/10 group-hover:border-brand-green/20 transition-colors"><CheckCircle size={12} className="text-brand-green" /></div>
                  <p>Payment will be verified by our finance team</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 group">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-green/10 group-hover:border-brand-green/20 transition-colors"><Mail size={12} className="text-brand-green" /></div>
                  <p>A formal confirmation email will be sent</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 group">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-green/10 group-hover:border-brand-green/20 transition-colors"><Clock size={12} className="text-brand-green" /></div>
                  <p>Project work will begin within 24 hours</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-5 md:text-right flex flex-col items-start md:items-end">
              <p className="font-black text-white text-[10px] uppercase tracking-[0.2em]">Support Line</p>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[240px]">Need help with your payment? Reach out to our design lead.</p>
              <a href="mailto:graphoriacreativitydesign@gmail.com" className="text-[11px] sm:text-[12px] font-bold text-white hover:text-brand-green transition-colors underline decoration-brand-green/30 underline-offset-4 break-all">
                graphoriacreativitydesign@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8 sm:mt-10 text-center text-slate-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 relative z-10 animate-pulse px-4">
        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-green" /> 256-bit Secure Token Protected
      </div>
    </div>
  );
};

export default PaymentPage;
