import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut,
  Radar,
  GraduationCap,
  BarChart3,
  User as UserIcon,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const platformItems = [
  { icon: Radar, label: "Scanner", path: "/admin/scanner" },
  { icon: GraduationCap, label: "Academy", path: "/admin/academy" },
  { icon: BarChart3, label: "Estadísticas", path: "/admin/stats" },
  { icon: UserIcon, label: "Perfil", path: "/admin/profile" },
];

const adminItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Radar, label: "Gestión Scanner", path: "/admin/scanner-management" },
  { icon: Users, label: "Usuarios", path: "/admin/users" },
  { icon: FileText, label: "Registros", path: "/admin/registrations" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fullName = profile?.full_name || user?.user_metadata?.full_name;
  const userName = fullName ? fullName.split(" ")[0] : (user?.email?.split("@")[0] || "Admin");

  const handleLogout = async () => {
    await signOut();
  };

  const NavItem = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          if (isMobile) setSidebarOpen(false);
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
      </button>
    );
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logotipo.png" alt="Inverbet" className="h-8 w-auto" />
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-black border-r border-border/50 p-4 z-50 h-full overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img src="/logotipo.png" alt="Inverbet Logo" className="h-8 w-auto object-contain" />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6">
          {/* Platform Section */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Plataforma
            </h3>
            <div className="space-y-1">
              {platformItems.map((item) => (
                <NavItem key={item.path} item={item} isMobile={true} />
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
                <NavItem key={item.path} item={item} isMobile={true} />
              ))}
            </div>
          </div>
        </nav>

        <button
          onClick={() => signOut()}
          className="mt-8 flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-black flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-border/50 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="font-display text-lg md:text-xl font-bold text-white">
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

        <div className="p-4 md:p-8 pb-24 md:pb-8 flex-1">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation (Admin Quick Links) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-border/50 px-2 py-2 z-30">
          <div className="flex items-center justify-around">
            {adminItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
};

export default AdminLayout;
