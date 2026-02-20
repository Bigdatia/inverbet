import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Wallet, DollarSign, Calendar, Calculator, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [signals, setSignals] = useState<any[]>([]);
  const [bankroll, setBankroll] = useState<string>("1000");

  const [metrics, setMetrics] = useState({
    totalResolved: 0,
    won: 0,
    lost: 0,
    voided: 0,
    winRate: 0,
    profitUnits: 0,
    roi: 0,
  });

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("signals")
          .select("*")
          .in("status", ["won", "lost", "void"])
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        const signalsData = data as any[] | null;

        let won = 0, lost = 0, voided = 0, profitUnits = 0;
        let totalStakedUnits = 0;

        // Calculate based on flat 1 Unit staked per bet
        signalsData?.forEach((s) => {
          totalStakedUnits += 1;
          
          if (s.status === "won") {
            won++;
            profitUnits += (s.odds - 1);
          } else if (s.status === "lost") {
            lost++;
            profitUnits -= 1;
          } else if (s.status === "void") {
            voided++;
            // Profit delta is 0 for void
          }
        });

        const totalResolved = won + lost; // exclude voided from win rate math usually, or include them as just 0. Here we exclude voided from win rate.
        const winRate = totalResolved > 0 ? (won / totalResolved) * 100 : 0;
        const roi = totalStakedUnits > 0 ? (profitUnits / totalStakedUnits) * 100 : 0;

        setMetrics({
          totalResolved: totalResolved + voided, // true total
          won,
          lost,
          voided,
          winRate,
          profitUnits,
          roi,
        });
        
        setSignals(signalsData || []);
      } catch (err) {
        console.error("Error fetching signal stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const numBankroll = parseFloat(bankroll) || 0;
  const unitValue = numBankroll / 100;
  const simulatedProfit = metrics.profitUnits * unitValue;
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold">Estadísticas</h1>
          <p className="text-muted-foreground">Rendimiento basado en señales seguidas</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Últimos 30 días</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unidades Ganadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Profit Neto (Unidades)</span>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold mb-1">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 
              <span className={metrics.profitUnits > 0 ? "text-green-500" : metrics.profitUnits < 0 ? "text-red-500" : ""}>
                 {metrics.profitUnits > 0 ? "+" : ""}{metrics.profitUnits.toFixed(2)} U
              </span>
            }
          </div>
          <div className="text-sm text-muted-foreground">Utilidad histórica</div>
        </motion.div>

        {/* Apuestas Ganadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Apuestas Ganadas</span>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold mb-1">
             {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : metrics.won}
          </div>
          <div className="text-sm text-muted-foreground">de {metrics.totalResolved} totales</div>
        </motion.div>

        {/* Tasa de Acierto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Tasa de Acierto</span>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold mb-1">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${metrics.winRate.toFixed(1)}%`}
          </div>
          <div className="flex items-center gap-1 text-sm text-primary">
             <span>Resultados cerrados</span>
          </div>
        </motion.div>

        {/* ROI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">ROI Total</span>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold mb-1">
             {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                <span className={metrics.roi > 0 ? "text-green-500" : metrics.roi < 0 ? "text-red-500" : ""}>
                   {metrics.roi > 0 ? "+" : ""}{metrics.roi.toFixed(2)}%
                </span>
             }
          </div>
          <div className="text-sm text-muted-foreground">Retorno de Inversión</div>
        </motion.div>
      </div>

      {/* Earnings Simulator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <Calculator className="h-6 w-6 text-primary" />
             <h2 className="font-display text-xl font-bold">Simulador de Ganancias</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
             <div className="space-y-3">
               <label className="text-sm font-medium text-muted-foreground block">Tu Capital Total (Bankroll)</label>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                 <Input 
                   type="number" 
                   value={bankroll} 
                   onChange={(e) => setBankroll(e.target.value)}
                   className="pl-8 font-mono text-lg font-bold"
                 />
               </div>
               <p className="text-xs text-muted-foreground">Tu capital se divide siempre en 100 unidades (% stake plano).</p>
             </div>
             
             <div className="bg-secondary/30 p-4 rounded-xl text-center space-y-1">
                <div className="text-sm text-muted-foreground">Valor por Unidad (1%)</div>
                <div className="text-2xl font-mono font-bold">${unitValue.toFixed(2)}</div>
             </div>
             
             <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center space-y-1">
                <div className="text-sm font-bold text-primary">Ganancia Estimada Histórica</div>
                <div className={cn(
                  "text-3xl font-mono font-black",
                  simulatedProfit >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {simulatedProfit >= 0 ? "+" : ""}${simulatedProfit.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                   Resultado aplicando {metrics.profitUnits.toFixed(2)} unidades históricas a tu capital.
                </p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Bets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-display text-lg font-bold">Historial de Señales Cerradas</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">Ordenadas por fecha reciente</span>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : signals.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Aún no hay señales finalizadas en el historial.
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto custom-scrollbar">
            {signals.map((signal) => {
               const dateStr = new Date(signal.created_at).toLocaleDateString("es-ES", { month: "short", day: "numeric" });
               const isWon = signal.status === "won";
               const isLost = signal.status === "lost";
               const isVoid = signal.status === "void";
               
               let profitStr = "";
               if (isWon) profitStr = `+${(signal.odds - 1).toFixed(2)} U`;
               if (isLost) profitStr = `-1.00 U`;
               if (isVoid) profitStr = `0.00 U`;

               return (
                <div
                  key={signal.id}
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="min-w-0 md:w-3/12">
                     <span className="text-xs text-muted-foreground block mb-1">{dateStr}</span>
                    <p className="font-medium truncate">{signal.match}</p>
                  </div>
                  <div className="md:w-5/12 text-sm text-foreground/80">
                    {signal.market} <br className="md:hidden" />
                    <span className="text-xs text-muted-foreground md:ml-2">({signal.sport} / {signal.league})</span>
                  </div>
                  <div className="md:w-1/12 text-sm">
                    @ <span className="font-mono">{signal.odds}</span>
                  </div>
                  
                  <div className="md:w-3/12 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full border",
                        isWon ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                        isLost ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      )}
                    >
                      {isWon ? "GANADA" : isLost ? "PERDIDA" : "NULA"}
                    </span>
                    <span
                      className={cn(
                        "font-mono font-bold w-16 text-right",
                        isWon ? "text-green-500" : isLost ? "text-red-500" : "text-yellow-500"
                      )}
                    >
                      {profitStr}
                    </span>
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Stats;