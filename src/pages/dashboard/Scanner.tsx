import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SignalCard from "@/components/dashboard/SignalCard";
import SignalCardSkeleton from "@/components/dashboard/SignalCardSkeleton";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Todos" },
  { id: "football", label: "Fútbol" },
  { id: "tennis", label: "Tenis" },
  { id: "basketball", label: "Baloncesto" },
  { id: "high", label: "Alta Probabilidad" },
];

// Mock signals data
const mockSignals = [
  {
    id: "1",
    time: "14:30",
    league: "Premier League",
    teamA: "Manchester City",
    teamB: "Liverpool",
    odds: 2.1,
    probability: 85,
    betType: "Valor en Over 2.5 Goles",
    analysis: "El algoritmo ha detectado una discrepancia entre las cuotas del mercado y la probabilidad real basada en datos históricos. Ambos equipos han marcado en el 87% de sus últimos enfrentamientos, y el promedio de goles es de 3.2 por partido.",
    confidence: "high" as const,
  },
  {
    id: "2",
    time: "16:00",
    league: "La Liga",
    teamA: "Real Madrid",
    teamB: "Barcelona",
    odds: 1.95,
    probability: 78,
    betType: "Ambos Equipos Marcan: Sí",
    analysis: "En los últimos 10 clásicos, ambos equipos han marcado en 8 ocasiones. Las cuotas actuales sugieren una oportunidad de valor dado el rendimiento ofensivo de ambos equipos esta temporada.",
    confidence: "high" as const,
  },
  {
    id: "3",
    time: "18:45",
    league: "Serie A",
    teamA: "Juventus",
    teamB: "AC Milan",
    odds: 2.45,
    probability: 72,
    betType: "Más de 1.5 Goles Primera Parte",
    analysis: "Ambos equipos tienen un inicio de partido agresivo. El 65% de los goles de Juventus y el 58% de los goles de Milan se producen en la primera mitad.",
    confidence: "medium" as const,
  },
  {
    id: "4",
    time: "20:00",
    league: "Bundesliga",
    teamA: "Bayern Munich",
    teamB: "Borussia Dortmund",
    odds: 1.75,
    probability: 82,
    betType: "Victoria Local",
    analysis: "Bayern Munich tiene un 78% de victorias en casa esta temporada. Contra rivales directos, su rendimiento sube al 85%. Las cuotas actuales ofrecen valor.",
    confidence: "high" as const,
  },
];

const Scanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [signals, setSignals] = useState(mockSignals);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredSignals = signals.filter((signal) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "high") return signal.confidence === "high";
    // Add more filters as needed
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
            <SignalCard key={signal.id} signal={signal} index={index} />
          ))
        )}
      </div>

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