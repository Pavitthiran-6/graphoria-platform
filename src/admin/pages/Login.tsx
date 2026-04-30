import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Input from "../components/Input";
import Button from "../components/Button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email?.trim().toLowerCase() === "graphoriacreativitydesign@gmail.com") {
        navigate("/admin/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setAuthError(null);

    // Basic validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("USER:", data?.user);
      console.log("ERROR:", error);

      if (error) {
        setAuthError(error.message);
        toast.error("Invalid login credentials");
        setIsLoading(false);
        return;
      }

      // Extra safety: allow only specific admin email
      if (data.user?.email?.trim().toLowerCase() !== "graphoriacreativitydesign@gmail.com") {
        await supabase.auth.signOut();
        setAuthError("Access denied. Authorized personnel only.");
        toast.error("Access denied");
        setIsLoading(false);
        return;
      }

      toast.success("Login successful! Welcome back.");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-primary mb-2">Graphoria</h1>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Admin Login</h2>
            <p className="text-muted-foreground text-sm mt-1">Access your dashboard</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-destructive font-medium text-center">{authError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@graphoria.studio"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              className="bg-secondary/50 border-white/10 focus:border-primary/50"
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              className="bg-secondary/50 border-white/10 focus:border-primary/50"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                isLoading={isLoading}
              >
                Login to Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Graphoria Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
