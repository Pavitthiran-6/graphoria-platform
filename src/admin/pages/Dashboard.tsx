import React, { useState, useEffect } from "react";
import { Package, Layers, Eye, Users, Clock, TrendingUp, Star, Plus, List, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

interface RecentActivity {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

interface TopProduct {
  id: number;
  title: string;
  views: number;
}

interface RecentProduct {
  id: number;
  title: string;
  created_at: string;
}

interface CategoryCount {
  name: string;
  count: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: "Total Products", value: "0", icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Categories", value: "0", icon: Layers, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Views", value: "0", icon: Eye, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Active Inquiries", value: "0", icon: Users, color: "text-orange-400", bg: "bg-orange-400/10" },
  ]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryCount[]>([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Basic Stats
      const { count: productsCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
      const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
      const { data: viewsData } = await supabase.from("projects").select("views");
      const totalViews = viewsData?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
      
      const { count: unreadInquiriesCount } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("is_read", false);
      const { count: totalInquiriesCount } = await supabase.from("inquiries").select("*", { count: "exact", head: true });

      // 2. Conversion Rate (Inquiries / Views * 100)
      const rate = totalViews > 0 ? ((totalInquiriesCount || 0) / totalViews) * 100 : 0;
      setConversionRate(rate);

      // 3. Top Products by Views
      const { data: topData } = await supabase
        .from("projects")
        .select("id, title, views")
        .order("views", { ascending: false })
        .limit(5);
      setTopProducts(topData || []);

      // 4. Recent Products
      const { data: recentPData } = await supabase
        .from("projects")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentProducts(recentPData || []);

      // 5. Category Distribution
      const { data: catData } = await supabase.from("categories").select("name");
      const { data: projCats } = await supabase.from("projects").select("category");
      
      const dist = (catData || []).map(cat => ({
        name: cat.name,
        count: (projCats || []).filter(p => p.category === cat.name).length
      })).sort((a, b) => b.count - a.count);
      setCategoryDistribution(dist);

      // 6. Recent Activity
      const { data: recentData } = await supabase
        .from("inquiries")
        .select("id, full_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats([
        { label: "Total Products", value: (productsCount || 0).toString(), icon: Package, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Categories", value: (categoriesCount || 0).toString(), icon: Layers, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Active Inquiries", value: (unreadInquiriesCount || 0).toString(), icon: Users, color: "text-orange-400", bg: "bg-orange-400/10" },
      ]);

      setRecentActivity(recentData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
        <div className="col-span-2 lg:contents">
          <Button 
            onClick={() => navigate("/admin/products")} 
            className="w-full lg:w-auto gap-2 py-3.5 sm:py-2.5 h-auto lg:h-10 text-sm sm:text-base lg:px-6"
          >
            <Plus size={20} /> Add Product
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/categories")} 
          className="col-span-1 lg:w-auto gap-2 py-3.5 sm:py-2.5 h-auto lg:h-10 text-sm sm:text-base lg:px-6"
        >
          <List size={20} /> Categories
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/notifications")} 
          className="col-span-1 lg:w-auto gap-2 py-3.5 sm:py-2.5 h-auto lg:h-10 text-sm sm:text-base lg:px-6"
        >
          <MessageSquare size={20} /> Inquiries
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">Live</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{loading ? "..." : stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Inquiries</h3>
              <button onClick={fetchDashboardData} className="text-xs text-primary hover:underline font-medium">Refresh</button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground italic">Loading...</p>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Users size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{activity.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-6">No recent inquiries.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Performing */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Star size={20} className="text-yellow-400" /> Top Performing</h3>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
                    <span className="text-sm font-medium truncate max-w-[150px]">{i+1}. {p.title}</span>
                    <span className="text-xs font-bold text-primary flex items-center gap-1"><Eye size={12}/> {p.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock size={20} className="text-blue-400" /> Recently Added</h3>
              <div className="space-y-3">
                {recentProducts.map((p) => (
                  <div key={p.id} className="flex flex-col p-3 rounded-xl bg-secondary/20 border border-border/30">
                    <span className="text-sm font-medium truncate">{p.title}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Dist */}
        <div className="space-y-8">
          {/* Conversion Insight */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Conversion Insight</h3>
            <div className="text-center py-6 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
              <h4 className="text-4xl font-black text-primary">{conversionRate.toFixed(1)}%</h4>
              <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold mt-1 text-primary/70">Conversion Rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Inquiry per View</span>
                <span className="text-foreground font-bold">1:{(100/conversionRate).toFixed(0)}</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(conversionRate * 5, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Layers size={20} className="text-blue-400" /> Category Usage</h3>
            <div className="space-y-3">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 group hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs bg-background px-2.5 py-1 rounded-full border border-border font-bold group-hover:border-primary/30 group-hover:text-primary">{cat.count} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
