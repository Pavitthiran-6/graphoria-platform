import { useState } from "react";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MessageCircle, Mail, MapPin } from "lucide-react";

const projectTypes = [
// ... (rest of the file follows)
  "Brand Identity",
  "Poster Design",
  "Packaging Design",
  "Website Development",
  "Other"
];

const budgetRanges = [
  "Under ₹15,000",
  "₹15,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹80,000",
  "₹1,00,000+"
];

const projectOptions = projectTypes.map(type => ({ label: type, value: type }));
const budgetOptions = budgetRanges.map(range => ({ label: range, value: range }));

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.projectType) {
      newErrors.projectType = "Project Type is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");
    setStatusMessage("");
    
    // Step 3: Validate input before insert
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim() || !formData.projectType) {
      toast.error("All required fields (*) must be filled");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Step 6: Prevent multiple submissions
    setIsLoading(true);

    try {
      // Step 2: Match database schema exactly
      const { data, error } = await supabase.from("inquiries").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.projectType,
          budget: formData.budget,
          message: formData.message,
        },
      ]);

      // Step 4 & 5: Handle Supabase response properly and check RLS
      if (error) {
        // Step 1: Show real error (mandatory)
        console.error("CONTACT ERROR:", {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
          full: error
        });

        if (error.message.includes("permission") || error.code === "42501") {
          console.error("RLS BLOCKING INSERT: Please check your 'inquiries' table policies.");
        }

        throw error;
      }

      console.log("INSERT SUCCESS:", data);

      // Step 7: Success feedback
      setSubmitStatus("success");
      setStatusMessage("Thank you! Your inquiry has been sent successfully. We'll be in touch soon!");
      toast.success("Message sent!");
      
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        message: ""
      });

    } catch (error: any) {
      setSubmitStatus("error");
      setStatusMessage(error.message || "Failed to send message. Please check your connection or try again later.");
      toast.error("Submission failed.");
    } finally {
      setIsLoading(false);
      
      // Clear status after 10 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
        setStatusMessage("");
      }, 10000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground animate-fade-in">
            Let's Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
              Powerful
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? We'd love to hear about it. Share your vision with us and let's create something extraordinary together.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Status Alert Box */}
          {submitStatus !== "idle" && (
            <div className={`mb-8 p-5 rounded-2xl border animate-in fade-in slide-in-from-top-4 duration-500 ${
              submitStatus === "success" 
                ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(0,255,136,0.1)]" 
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  submitStatus === "success" ? "bg-primary/20" : "bg-destructive/20"
                }`}>
                  {submitStatus === "success" ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">{submitStatus === "success" ? "Success!" : "Error"}</p>
                  <p className="text-sm opacity-90">{statusMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-8 md:p-10 shadow-xl shadow-black/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2 ml-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                        errors.fullName 
                          ? "border-red-500 focus:ring-1 focus:ring-red-500" 
                          : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium ml-1">⚠️ {errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 ml-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                        errors.email 
                          ? "border-red-500 focus:ring-1 focus:ring-red-500" 
                          : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium ml-1">⚠️ {errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2 ml-1">
                      Phone <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  <div className="relative">
                    <CustomDropdown 
                      label="Project Type"
                      options={projectOptions}
                      value={formData.projectType}
                      onChange={(val) => handleDropdownChange("projectType", val)}
                      placeholder="Select Project Type"
                    />
                    {errors.projectType && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium ml-1">⚠️ {errors.projectType}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6 w-full md:w-1/2">
                  <CustomDropdown 
                    label="Project Budget (optional)"
                    options={budgetOptions}
                    value={formData.budget}
                    onChange={(val) => handleDropdownChange("budget", val)}
                    placeholder="Select Budget"
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 ml-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all resize-none ${
                      errors.message 
                        ? "border-red-500 focus:ring-1 focus:ring-red-500" 
                        : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                    }`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium ml-1">⚠️ {errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-10 py-4 rounded-full font-bold text-lg transition-all duration-500 shadow-lg ${
                    isLoading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-primary/30"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : "Start Your Project"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl border border-border p-8 md:p-10 space-y-8 sticky top-24 shadow-lg shadow-black/10">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Get in Touch</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We're here to help bring your creative vision to life. Reach out to us through any of the channels below.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:brightness-110 group-hover:border-primary/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
                      <MessageCircle className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                      <a href="https://wa.me/919360073899" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold hover:text-primary transition-colors">
                        +91 93600 73899
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:brightness-110 group-hover:border-primary/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
                      <Mail className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <a href="mailto:hello@graphoria.com" className="text-foreground font-semibold hover:text-primary transition-colors">
                        hello@graphoria.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:brightness-110 group-hover:border-primary/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
                      <MapPin className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="text-foreground font-semibold">Chennai, Tamil Nadu</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-bold">We respond within 24 hours.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
