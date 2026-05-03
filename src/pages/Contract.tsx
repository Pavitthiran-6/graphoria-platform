import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Download, Send, FileText, CheckCircle, Briefcase, User, Mail, IndianRupee, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import graphoriaLogo from "@/assets/graphoria-logo.png";
import { Link } from 'react-router-dom';
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from 'lucide-react';

const ContractPage = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectName: '',
    budget: '',
    clientPhone: '',
    clientSignature: '',
    agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [submittedPdfUrl, setSubmittedPdfUrl] = useState<string | null>(null);
  const contractPreviewRef = useRef<HTMLDivElement>(null);
  const contractPDFRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSubmitted && countdown === 0) {
      if (submittedPdfUrl) {
        window.location.href = `https://docs.google.com/forms/d/e/1FAIpQLSfXn-f0I2HwBt883YYnM5l3l950IkdK8YMIsxKsaMDzAkEqIA/viewform?entry.524931158=${encodeURIComponent(submittedPdfUrl)}`;
      } else {
        // Fallback if URL is missing
        window.location.href = "about:blank";
      }
    }
    return () => clearInterval(timer);
  }, [isSubmitted, countdown, submittedPdfUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreed: checked }));
    if (errors.agreed) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.agreed;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail) newErrors.clientEmail = 'Email is required';
    if (!formData.clientPhone) newErrors.clientPhone = 'Phone number is required';
    if (!formData.projectName) newErrors.projectName = 'Project name is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.clientSignature) newErrors.clientSignature = 'Signature is required';
    if (!formData.agreed) newErrors.agreed = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const downloadPDF = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields before downloading');
      return;
    }
    const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.clientName) newErrors.clientName = 'Client name is required';
      if (!formData.clientEmail) newErrors.clientEmail = 'Email is required';
      if (!formData.projectName) newErrors.projectName = 'Project name is required';
      if (!formData.budget) newErrors.budget = 'Budget is required';
      if (!formData.clientPhone) newErrors.clientPhone = 'Phone is required';
      if (!formData.clientSignature) newErrors.clientSignature = 'Digital signature is required';
      if (!formData.agreed) newErrors.agreed = 'You must agree to the terms';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (!validate()) return;
    if (!contractPDFRef.current) return;

    setIsGeneratingPDF(true);
    toast.info('Generating high-quality PDF...');

    try {
      const canvas = await html2canvas(contractPDFRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: contractPreviewRef.current.scrollWidth,
        windowHeight: contractPreviewRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Force single page and scale to fit if necessary
      let finalImgHeight = imgHeight;
      let finalImgWidth = imgWidth;
      
      if (imgHeight > pdfHeight) {
        const ratio = pdfHeight / imgHeight;
        finalImgHeight = pdfHeight;
        finalImgWidth = imgWidth * ratio;
      }
      
      // Center horizontally if scaled down
      const xOffset = (pdfWidth - finalImgWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, 0, finalImgWidth, finalImgHeight);
      pdf.save(`Graphoria_Contract_${formData.clientName.replace(/\s+/g, '_') || 'Draft'}.pdf`);
      toast.success('Contract downloaded as PDF');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!contractPDFRef.current) return;

    setIsSubmitting(true);
    toast.info('Finalizing and uploading contract...');

    try {
      // 1. Generate PDF Blob
      const canvas = await html2canvas(contractPDFRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      const fileName = `contract_${Date.now()}_${formData.clientName.replace(/\s+/g, '_')}.pdf`;

      // 2. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('contracts')
        .getPublicUrl(fileName);

      // 4. Save to Database
      const { error: dbError } = await supabase
        .from('contracts')
        .insert([{
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone,
          project_name: formData.projectName,
          budget: formData.budget,
          client_signature: formData.clientSignature,
          pdf_url: publicUrl,
          is_read: false
        }]);

      if (dbError) throw dbError;

      setIsSubmitted(true);
      setSubmittedPdfUrl(publicUrl);
      toast.success('Contract signed and submitted successfully!');
    } catch (error: any) {
      console.error('Submission Error:', error);
      toast.error(error.message || 'Failed to submit contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
        <Card className="max-w-md w-full bg-slate-900 border-white/10 text-center p-10 shadow-2xl">
          <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(151,255,0,0.2)]">
            <CheckCircle className="w-12 h-12 text-brand-green" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Contract Signed!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thank you, <span className="text-white font-semibold">{formData.clientName}</span>. Your agreement for <span className="text-white font-semibold">"{formData.projectName}"</span> has been securely recorded. 
          </p>
          
          <div className="pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Closing securely in</p>
            <div className="text-5xl font-black text-brand-green">
              {countdown}
            </div>
            <p className="text-[10px] text-slate-600 mt-4 italic">
              Redirecting to secure exit...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[800px] mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <img src={graphoriaLogo} alt="Graphoria Logo" className="h-10 md:h-12" />
          </div>
          <p className="text-brand-green font-medium tracking-wide uppercase text-xs">Project Agreement & Service Contract</p>
          <p className="text-slate-400 text-[10px] mt-1">graphoriacreativitydesign@gmail.com</p>
          <div className="h-px w-24 bg-brand-green/30 mx-auto mt-4"></div>
          <h1 className="text-3xl font-bold pt-2 tracking-tight text-white">Graphoria Creativity Design</h1>
        </div>

        {/* Form Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 overflow-hidden rounded-2xl shadow-2xl">
          <CardHeader className="bg-white/5 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <FileEdit className="w-5 h-5 text-brand-green" />
              <CardTitle className="text-lg text-white">Contract Details</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Fill in the information below to generate your project contract.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center text-slate-300">
                  <User className="w-4 h-4 mr-2 text-brand-green/70" /> Client Name
                </label>
                <Input 
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all h-11 ${
                    errors.clientName ? 'border-red-500 focus:ring-red-500/20' : 'focus:border-brand-green/50 focus:ring-brand-green/20'
                  }`}
                />
                {errors.clientName && <p className="text-[10px] text-red-500 mt-1">{errors.clientName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-brand-green/70" /> Email Address
                </label>
                <Input 
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. john@company.com"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all h-11 ${
                    errors.clientEmail ? 'border-red-500 focus:ring-red-500/20' : 'focus:border-brand-green/50 focus:ring-brand-green/20'
                  }`}
                />
                {errors.clientEmail && <p className="text-[10px] text-red-500 mt-1">{errors.clientEmail}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center text-slate-300">
                  <Briefcase className="w-4 h-4 mr-2 text-brand-green/70" /> Project Name
                </label>
                <Input 
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g. Brand Identity System"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all h-11 ${
                    errors.projectName ? 'border-red-500 focus:ring-red-500/20' : 'focus:border-brand-green/50 focus:ring-brand-green/20'
                  }`}
                />
                {errors.projectName && <p className="text-[10px] text-red-500 mt-1">{errors.projectName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center text-slate-300">
                  <IndianRupee className="w-4 h-4 mr-2 text-brand-green/70" /> Budget (INR)
                </label>
                <Input 
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g. 50000"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all h-11 ${
                    errors.budget ? 'border-red-500 focus:ring-red-500/20' : 'focus:border-brand-green/50 focus:ring-brand-green/20'
                  }`}
                />
                {errors.budget && <p className="text-[10px] text-red-500 mt-1">{errors.budget}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-brand-green/70" /> Client Phone
                </label>
                <Input 
                  name="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 00000 00000"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all h-11 ${
                    errors.clientPhone ? 'border-red-500 focus:ring-red-500/20' : 'focus:border-brand-green/50 focus:ring-brand-green/20'
                  }`}
                />
                {errors.clientPhone && <p className="text-[10px] text-red-500 mt-1">{errors.clientPhone}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center text-slate-300">
                  <FileEdit className="w-4 h-4 mr-2 text-brand-green/70" /> Digital Signature
                </label>
                <Input 
                  name="clientSignature"
                  value={formData.clientSignature}
                  onChange={handleInputChange}
                  placeholder="Type your name as signature"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all h-11 font-serif italic ${
                    errors.clientSignature ? 'border-red-500 focus:ring-red-500/20' : 'focus:border-brand-green/50 focus:ring-brand-green/20'
                  }`}
                />
                {errors.clientSignature && <p className="text-[10px] text-red-500 mt-1">{errors.clientSignature}</p>}
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col pt-2">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreed} 
                    onCheckedChange={handleCheckboxChange}
                    className={`w-5 h-5 border-white/20 data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green ${
                      errors.agreed ? 'border-red-500' : ''
                    }`}
                  />
                  <label htmlFor="terms" className={`text-sm font-medium leading-none cursor-pointer ${
                    errors.agreed ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    I agree to the terms and conditions outlined in the contract below.
                  </label>
                </div>
                {errors.agreed && <p className="text-[10px] text-red-500 mt-2 ml-8">{errors.agreed}</p>}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contract Preview Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center text-white">
              <FileText className="w-5 h-5 mr-2 text-brand-green" /> Live Preview
            </h3>
            <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest bg-brand-green/10 px-2 py-1 rounded">Draft View</span>
          </div>
          
          {/* Hidden Desktop-only Preview for PDF Generation (Forces desktop layout even on mobile) */}
          <div className="fixed -left-[9999px] top-0">
            <div ref={contractPDFRef} className="p-16 pb-24 bg-white w-[1000px]">
              {/* Header */}
              <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Graphoria</h4>
                  <p className="text-sm text-slate-500">Creativity Design Studio</p>
                  <p className="text-sm text-slate-500 mt-1">graphoriacreativitydesign@gmail.com</p>
                </div>
                <div className="text-right">
                  <h4 className="text-base font-bold text-slate-900">SERVICE CONTRACT</h4>
                  <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-sm text-slate-500 mt-1 uppercase">Ref: GR-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="space-y-1">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Service Provider</h5>
                  <p className="text-base font-bold text-slate-900">Graphoria Creativity Design</p>
                  <p className="text-sm text-slate-600">Chennai, India</p>
                </div>
                <div className="space-y-1 text-right">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Client</h5>
                  <p className="text-base font-bold text-slate-900">{formData.clientName || '[Client Name]'}</p>
                  <p className="text-sm text-slate-600">{formData.clientEmail || '[Client Email]'}</p>
                  <p className="text-sm text-slate-600">{formData.clientPhone || '[Client Phone]'}</p>
                </div>
              </div>

              {/* Project Intro */}
              <div className="mb-10 bg-slate-50 p-8 rounded-xl border border-slate-100">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Project Overview</h5>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{formData.projectName || '[Project Name]'}</h4>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-base font-semibold text-slate-700">Total Budget:</span>
                  <span className="text-base font-bold text-slate-900">₹{formData.budget || '0'}</span>
                </div>
              </div>

              {/* Clauses */}
              <div className="space-y-8">
                <section>
                  <h5 className="text-sm font-bold text-slate-900 mb-2">1. Project Scope & Deliverables</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Graphoria will provide the creative services as described in the project overview. Deliverables will be provided in industry-standard formats. Any additions to the scope will be treated as a separate project or billed at an hourly rate.
                  </p>
                </section>
                <section>
                  <h5 className="text-sm font-bold text-slate-900 mb-2">2. Timeline & Milestones</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    The project will commence upon receipt of the initial deposit and signed agreement. Estimated completion time will be discussed and agreed upon following the project kickoff meeting.
                  </p>
                </section>
                <section>
                  <h5 className="text-sm font-bold text-slate-900 mb-2">3. Payment Terms</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    A non-refundable deposit is required to initiate the project. Full payment is due upon final approval of the deliverables and before final files are handed over.
                  </p>
                </section>
                <section>
                  <h5 className="text-sm font-bold text-slate-900 mb-2">4. Revisions</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    The project includes up to two (2) rounds of major revisions. Additional revisions beyond this scope will be billed at an hourly rate of ₹1,500/hr.
                  </p>
                </section>
                <section>
                  <h5 className="text-sm font-bold text-slate-900 mb-2">5. Cancellation Policy</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Either party may terminate this agreement with 7 days written notice. In the event of cancellation, the client will be billed for all work completed up to the termination date.
                  </p>
                </section>
              </div>

              {/* Signatures */}
              <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 gap-10">
                <div className="flex flex-col justify-end">
                  <div className="mb-2 min-h-[35px] flex items-end">
                    <span className="font-serif italic font-bold text-2xl text-black tracking-wider">Deepak M.</span>
                  </div>
                  <div className="h-px bg-slate-300 w-full mb-2"></div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Authorized</p>
                </div>
                <div className="flex flex-col justify-end text-right">
                  <div className="mb-2 min-h-[35px] flex items-end justify-end">
                    {formData.clientSignature && (
                      <span className="font-serif italic font-bold text-2xl text-black tracking-wider">
                        {formData.clientSignature}
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-slate-300 w-full mb-2"></div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Client Sign</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] border-none overflow-hidden rounded-2xl">
            <div ref={contractPreviewRef} data-contract-preview className="p-5 sm:p-10 md:p-16 pb-24 bg-white w-full">
              {/* Internal PDF Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-10 border-b border-slate-100 pb-8 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Graphoria</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">Creativity Design Studio</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1">graphoriacreativitydesign@gmail.com</p>
                </div>
                <div className="text-left sm:text-right">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">SERVICE CONTRACT</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 uppercase">Ref: GR-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
              </div>

              {/* Parties Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service Provider</h5>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Graphoria Creativity Design</p>
                  <p className="text-[11px] text-slate-600">Chennai, India</p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Client</h5>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.clientName || '[Client Name]'}</p>
                  <p className="text-[11px] text-slate-600">{formData.clientEmail || '[Client Email]'}</p>
                  <p className="text-[11px] text-slate-600">{formData.clientPhone || '[Client Phone]'}</p>
                </div>
              </div>

              {/* Project Intro */}
              <div className="mb-10 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100">
                <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project Overview</h5>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{formData.projectName || '[Project Name]'}</h4>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Total Budget:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">₹{formData.budget || '0'}</span>
                </div>
              </div>

              {/* Clauses */}
              <div className="space-y-8">
                <section>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">1. Project Scope & Deliverables</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Graphoria will provide the creative services as described in the project overview. Deliverables will be provided in industry-standard formats. Any additions to the scope will be treated as a separate project or billed at an hourly rate.
                  </p>
                </section>

                <section>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">2. Timeline & Milestones</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    The project will commence upon receipt of the initial deposit and signed agreement. Estimated completion time will be discussed and agreed upon following the project kickoff meeting.
                  </p>
                </section>

                <section>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">3. Payment Terms</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    A non-refundable deposit is required to initiate the project. Full payment is due upon final approval of the deliverables and before final files are handed over.
                  </p>
                </section>

                <section>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">4. Revisions</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    The project includes up to two (2) rounds of major revisions. Additional revisions beyond this scope will be billed at an hourly rate of ₹1,500/hr.
                  </p>
                </section>

                <section>
                  <h5 className="text-xs font-bold text-slate-900 mb-2">5. Cancellation Policy</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Either party may terminate this agreement with 7 days written notice. In the event of cancellation, the client will be billed for all work completed up to the termination date.
                  </p>
                </section>
              </div>

              {/* Signature Section */}
              <div className="mt-16 pt-10 border-t border-slate-100 grid grid-cols-2 gap-4 sm:gap-10">
                <div className="flex flex-col justify-end">
                  <div className="mb-2 min-h-[28px] flex items-end">
                    <span className="font-serif italic font-bold text-sm sm:text-lg text-black tracking-wider">Deepak M.</span>
                  </div>
                  <div className="h-px bg-slate-300 w-full mb-2"></div>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authorized</p>
                </div>
                <div className="flex flex-col justify-end text-right">
                  <div className="mb-2 min-h-[28px] flex items-end justify-end">
                    {formData.clientSignature && (
                      <span className="font-serif italic font-bold text-sm sm:text-lg text-black tracking-wider">
                        {formData.clientSignature}
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-slate-300 w-full mb-2"></div>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client Sign</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <CardContent className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                onClick={downloadPDF}
                disabled={isGeneratingPDF || isSubmitting}
                className="flex-1 bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 rounded-lg h-12 shadow-sm font-semibold transition-all disabled:opacity-70"
              >
                {isGeneratingPDF ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center"><Download className="w-4 h-4 mr-2" /> Download PDF</span>
                )}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.agreed || isSubmitting || isGeneratingPDF}
                className="flex-1 bg-brand-green hover:bg-brand-green/90 disabled:bg-slate-200 disabled:text-slate-400 text-black font-bold rounded-lg h-12 shadow-[0_0_20px_rgba(151,255,0,0.2)] transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center"><Send className="w-4 h-4 mr-2" /> Submit & Finalize</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ContractPage;
