import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut,
  Radar,
  GraduationCap,
  BarChart3,
  User as UserIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const platformItems = [
  { icon: Radar, label: "Scanner", path: "/admin/scanner" },
  { icon: GraduationCap, label: "Academy", path: "/admin/academy" },
  { icon: BarChart3, label: "Estadísticas", path: "/admin/stats" },
  { icon: UserIcon, label: "Perfil", path: "/admin/profile" },
];

const adminItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Usuarios", path: "/admin/users" },
  { icon: FileText, label: "Registros", path: "/admin/registrations" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name;
        const firstName = fullName ? fullName.split(" ")[0] : (user.email?.split("@")[0] || "Admin");
        setUserName(firstName);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logotipo.png" alt="Inverbet" className="h-8 w-auto" />
            <span className="font-display font-bold text-lg">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Platform Section */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Plataforma
            </h3>
            <div className="space-y-1">
              {platformItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>

          {/* Administration Section */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administración
            </h3>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-black flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-border/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-white">
                Bienvenido, <span className="capitalize">{userName}</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
               <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Admin Mode</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
