import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isToday, isTomorrow, parseISO, startOfDay, isBefore } from "date-fns";
import { es } from "date-fns/locale";
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
  { id: "today", label: "Hoy" },
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
    const isResolved = signal.status === 'won' || signal.status === 'lost' || signal.status === 'void';
    const signalDate = new Date(signal.created_at);
    const isTodaySignal = isToday(signalDate);
    const isPast = isBefore(signalDate, startOfDay(new Date()));
    
    // Always hide signals that are already resolved ('won', 'lost', 'void') AND are not from today
    if (isResolved && !isTodaySignal) {
       return false;
    }

    if (activeFilter === "today") {
      return isTodaySignal;
    }

    if (activeFilter === "high") {
      return signal.confidence === "high";
    }

    // Default "all" behavior (also fallback): return matches from today onwards
    return !isPast;
  })?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Group signals by Date string (e.g., "2024-10-25")
  const groupedSignals = filteredSignals?.reduce((groups, signal) => {
    const date = format(new Date(signal.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(signal);
    return groups;
  }, {} as Record<string, typeof signals>);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "HOY";
    if (isTomorrow(date)) return "MAÑANA";
    return format(date, "EEEE, d 'de' MMMM", { locale: es }).toUpperCase();
  };

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
        className="flex items-center gap-4 p-4 bg-secondary/30 border border-border rounded-xl flex-wrap"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Señales activas/hoy:</span>
          <span className="font-mono text-lg font-bold text-primary">{filteredSignals.length}</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Alta confianza:</span>
          <span className="font-mono text-lg font-bold text-primary">
            {filteredSignals.filter((s) => s.confidence === "high").length}
          </span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Analizando:</span>
          <span className="font-mono text-sm text-accent">1,847 partidos</span>
        </div>
      </motion.div>

      {/* Signals Grid */}
      <div className="space-y-8">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <SignalCardSkeleton />
            <SignalCardSkeleton />
            <SignalCardSkeleton />
            <SignalCardSkeleton />
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No hay señales para mostrar en este filtro.</p>
          </div>
        ) : (
          Object.entries(groupedSignals || {}).map(([dateStr, daySignals]) => (
            <div key={dateStr} className="space-y-4">
              {/* Date Section Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-primary tracking-wider">
                  {getDateLabel(dateStr)}
                </h3>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              {/* Day Signals Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {daySignals.map((signal, index) => (
                  <SignalCard 
                    key={signal.id} 
                    signal={signal as any} 
                    index={index} 
                    isLocked={!isPro}
                    onUnlock={() => setShowPaymentModal(true)}
                  />
                ))}
              </div>
            </div>
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