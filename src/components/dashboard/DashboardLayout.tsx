import { useState } from "react";
import { useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Radar,
  GraduationCap,
  BarChart3,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Radar, label: "Scanner en Vivo", path: "/dashboard" },
  { icon: GraduationCap, label: "Academy", path: "/dashboard/academy" },
  { icon: BarChart3, label: "Estadísticas", path: "/dashboard/stats" },
  { icon: UserIcon, label: "Perfil / Pagos", path: "/dashboard/profile" },
];

const DashboardLayout = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !loading) {
     return <Navigate to="/auth" replace />;
  }

  // Effect for redirect
  // useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);
  // But we can't use hooks inside if(loading). Redo structure.

  const fullName = profile?.full_name || user?.user_metadata?.full_name;
  const userName = fullName ? fullName.split(" ")[0] : (user?.email?.split("@")[0] || "Usuario");

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-black border-r border-border/50 p-4 h-full shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src="/logotipo.png" alt="Inverbet Logo" className="h-8 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 mt-auto"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-black border-r border-border/50 p-4 z-50 h-full overflow-y-auto"
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

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => signOut()}
          className="mt-auto flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-border/50 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-xl font-bold">
                  Bienvenido, <span className="capitalize">{userName}</span>
                </h1>
              </div>
            </div>

            {/* Algorithm Status */}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary hidden sm:inline">
                Algoritmo: CONECTADO
              </span>
              <span className="text-sm font-medium text-primary sm:hidden">LIVE</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-border/50 px-2 py-2 z-30">
          <div className="flex items-center justify-around">
            {menuItems.map((item) => {
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
      </div>
    </div>
  );
};

export default DashboardLayout;