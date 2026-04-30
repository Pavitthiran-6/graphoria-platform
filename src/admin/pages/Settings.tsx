import React, { useState, useEffect } from "react";
import { Shield, Key, Save, Loader2, LogOut, Info } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Settings = () => {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    match: ""
  });

  // Fetch user info to show last update
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setLastUpdated(user.updated_at || null);
      }
    };
    getUserInfo();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ match: "Passwords do not match" });
      toast.error("New passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrors({ match: "" });

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No active session found.");

      // 2. Re-authenticate to verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect.");
        setLoading(false);
        return;
      }

      // 3. Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) throw updateError;

      toast.success("Password updated! Logging out for security...");
      
      // 4. Logout from all sessions and redirect
      await new Promise(resolve => setTimeout(resolve, 2000)); // Brief delay for the toast
      await supabase.auth.signOut();
      navigate("/admin/login");

    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-500 pb-10">
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-6 py-5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={20} />
            <h3 className="text-lg font-bold">Security Settings</h3>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border">
              <Clock size={12} />
              Last Updated: {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </div>
          )}
        </div>
        
        <div className="p-6 sm:p-10">
          <div className="flex items-start gap-4 mb-10 p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
              <Key size={24} />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">Change Password</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose a strong password. For security, you will be automatically logged out after changing it.
              </p>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <Input 
                type="password" 
                label="Current Password" 
                placeholder="••••••••" 
                value={formData.currentPassword}
                disabled={loading}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <Input 
                  type="password" 
                  label="New Password" 
                  placeholder="New password" 
                  value={formData.newPassword}
                  disabled={loading}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
                <Input 
                  type="password" 
                  label="Confirm New Password" 
                  placeholder="Repeat password" 
                  value={formData.confirmPassword}
                  disabled={loading}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  error={errors.match}
                />
              </div>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/50">
              <p className="text-[11px] text-muted-foreground flex items-center gap-2 italic">
                <Info size={14} className="text-primary" />
                Changing your password will sign you out of all devices.
              </p>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2 px-10 h-12 rounded-xl">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Clock icon missing from imports earlier, adding local helper
const Clock = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Settings;
