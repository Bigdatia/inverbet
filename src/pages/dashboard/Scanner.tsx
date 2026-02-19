import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SignalCard from "@/components/dashboard/SignalCard";
import SignalCardSkeleton from "@/components/dashboard/SignalCardSkeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PaymentFormContent } from "@/components/checkout/ManualPaymentForm";
import ManualPaymentForm from "@/components/checkout/ManualPaymentForm";
import { Lock } from "lucide-react";

const filters = [
  { id: "all", label: "Todos" },
  { id: "football", label: "Fútbol" },
  { id: "tennis", label: "Tenis" },
  { id: "basketball", label: "Baloncesto" },
  { id: "high", label: "Alta Probabilidad" },
];

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ... (keep filters array)

const Scanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPro } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch signals from Supabase
  const { data: signals = [], isLoading: loading } = useQuery({
    queryKey: ["signals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching signals", error);
        return [];
      }
      return data;
    },
  });

  const filteredSignals = signals.filter((signal) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "high") return signal.confidence === "high";
    if (activeFilter === "football") return signal.sport === "futbol";
    if (activeFilter === "tennis") return signal.sport === "tenis";
    if (activeFilter === "basketball") return signal.sport === "basket";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 bg-secondary/30 border border-border rounded-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Señales activas:</span>
          <span className="font-mono text-lg font-bold text-primary">{signals.length}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Alta confianza:</span>
          <span className="font-mono text-lg font-bold text-primary">
            {signals.filter((s) => s.confidence === "high").length}
          </span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Analizando:</span>
          <span className="font-mono text-sm text-accent">1,847 partidos</span>
        </div>
      </motion.div>

      {/* Signals Grid */}
      {/* Signals Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <>
            <SignalCardSkeleton />
            <SignalCardSkeleton />
            <SignalCardSkeleton />
            <SignalCardSkeleton />
          </>
        ) : (
          filteredSignals.map((signal, index) => (
            <SignalCard 
              key={signal.id} 
              signal={signal} 
              index={index} 
              isLocked={!isPro}
              onUnlock={() => setShowPaymentModal(true)}
            />
          ))
        )}
      </div>

      <ManualPaymentForm 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />

      {/* Academy Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider mb-1 block">
              ¿Nuevo aquí?
            </span>
            <h3 className="font-display text-lg font-bold mb-1">
              Empieza por la Academy
            </h3>
            <p className="text-sm text-muted-foreground">
              Aprende la estrategia del 1% antes de empezar a usar las señales.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-secondary rounded-xl p-3 min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1">Progreso</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-primary rounded-full" />
                </div>
                <span className="font-mono text-sm">0%</span>
              </div>
            </div>
            <button 
              onClick={() => {
                const prefix = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
                navigate(`${prefix}/academy`);
              }}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              Ir a Academy
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Scanner;