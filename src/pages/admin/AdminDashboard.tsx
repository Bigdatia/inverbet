import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePro: 0,
    expiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data: users, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("role", "admin");

        if (error) throw error;

        let activePro = 0;
        let expiringSoon = 0;
        const now = new Date().getTime();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

        users?.forEach(user => {
          const tier = user.subscription_tier as any;
          if (user.subscription_status === 'active' && (tier === 'premium' || tier === 'pro')) {
            activePro++;
            
            if (user.subscription_end_date) {
               const endDate = new Date(user.subscription_end_date).getTime();
               const diff = endDate - now;
               
               if (diff >= 0 && diff <= threeDaysMs) {
                 expiringSoon++;
               }
            }
          }
        });

        setStats({
          totalUsers: users?.length || 0,
          activePro,
          expiringSoon
        });
        
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">{t.dashboard.admin.dashboard.title}</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.admin.dashboard.total_users}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.admin.dashboard.total_users_desc}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.admin.dashboard.active_subs}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
               {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : stats.activePro}
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.admin.dashboard.active_subs_desc}</p>
          </CardContent>
        </Card>
        
        <Card className={stats.expiringSoon > 0 ? "border-red-500/50 bg-red-500/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${stats.expiringSoon > 0 ? 'text-red-500' : ''}`}>{t.dashboard.admin.dashboard.expiring_subs}</CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats.expiringSoon > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.expiringSoon > 0 ? 'text-red-500' : ''}`}>
               {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : stats.expiringSoon}
            </div>
            <p className="text-xs text-muted-foreground">{t.dashboard.admin.dashboard.expiring_subs_desc}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
