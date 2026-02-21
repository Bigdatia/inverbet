import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Wallet, DollarSign, Calendar, Calculator, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/LanguageContext";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'decimal', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  }).format(val);
};

const Stats = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [signals, setSignals] = useState<any[]>([]);
  const [bankroll, setBankroll] = useState<string>("10,000");

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

        const chronologicalSignals = [...(signalsData || [])].reverse();

        const enrichedSignals = chronologicalSignals.map((s) => {
          let realProfit = 0;
          let stakeUsed = 1;
          totalStakedUnits += 1;
          
          if (s.status === "won") {
            won++;
            realProfit = (s.odds - 1);
            profitUnits += realProfit;
          } else if (s.status === "lost") {
            lost++;
            realProfit = -1;
            profitUnits += realProfit;
          } else if (s.status === "void") {
            voided++;
          }
          
          return {
            ...s,
            realProfit,
            stakeUsed
          };
        });

        const totalResolved = won + lost;
        const winRate = totalResolved > 0 ? (won / totalResolved) * 100 : 0;
        const roi = profitUnits * 10;

        setMetrics({
          totalResolved: totalResolved + voided,
          won,
          lost,
          voided,
          winRate,
          profitUnits,
          roi,
        });
        
        setSignals(enrichedSignals.reverse());
      } catch (err) {
        console.error("Error fetching signal stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const handleBankrollChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setBankroll("0");
      return;
    }
    const numValue = parseInt(rawValue, 10);
    setBankroll(formatCurrency(numValue));
  };

  const numBankroll = parseFloat(bankroll.replace(/,/g, '')) || 0;
  const unitValue = numBankroll / 10;
  const simulatedProfit = metrics.profitUnits * unitValue;

  const dateLocale = language === 'es' ? es : enUS;

  const chartData = useMemo(() => {
    if (!signals.length) return [];
    
    const sortedSignals = [...signals].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    const dailyData: Record<string, number> = {};
    
    sortedSignals.forEach(s => {
      const date = new Date(s.created_at);
      const dateStr = format(date, "d MMM", { locale: dateLocale });
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = 0;
      }
      
      dailyData[dateStr] += (s.realProfit || 0);
    });

    let currentProfit = 10;
    
    const chart = Object.keys(dailyData).map((date, index) => {
      const dayProfit = dailyData[date];
      currentProfit += dayProfit;
      return {
        name: `${t.dashboard.stats.day} ${index + 1}`,
        date,
        profit: Number(currentProfit.toFixed(2)),
        dayProfit: Number(dayProfit.toFixed(2))
      };
    });

    return [
      { name: t.dashboard.stats.start, date: '10 feb', profit: 10, dayProfit: 0 },
      ...chart
    ];
  }, [signals, dateLocale, t]);



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold">{t.dashboard.stats.title}</h1>
          <p className="text-muted-foreground">{t.dashboard.stats.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t.dashboard.stats.last_30}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Net Profit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t.dashboard.stats.net_profit}</span>
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
          <div className="text-sm text-muted-foreground">{t.dashboard.stats.historical}</div>
        </motion.div>

        {/* Bets Won */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t.dashboard.stats.bets_won}</span>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold mb-1">
             {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : metrics.won}
          </div>
          <div className="text-sm text-muted-foreground">{t.dashboard.stats.of_total.replace('{total}', String(metrics.totalResolved))}</div>
        </motion.div>

        {/* Win Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t.dashboard.stats.win_rate}</span>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold mb-1">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${metrics.winRate.toFixed(1)}%`}
          </div>
          <div className="flex items-center gap-1 text-sm text-primary">
             <span>{t.dashboard.stats.closed_results}</span>
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
            <span className="text-sm text-muted-foreground">{t.dashboard.stats.total_roi}</span>
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
          <div className="text-sm text-muted-foreground">{t.dashboard.stats.roi_label}</div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-xl p-6 lg:col-span-2"
        >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold">{t.dashboard.stats.chart_title}</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">{t.dashboard.stats.accumulated}</span>
        </div>
        
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : signals.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {t.dashboard.stats.no_chart_data}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#ffffff' }} 
                  dy={10} 
                  minTickGap={30}
                />
                <YAxis 
                  domain={[0, 20]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#ffffff' }} 
                  tickFormatter={(val) => `${val}U`}
                  width={55}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                  formatter={(value: number) => [`${value} U`, t.dashboard.stats.tooltip_units]}
                />
                <Area 
                  type="linear" 
                  dataKey="profit" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Earnings Simulator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col justify-center lg:col-span-1"
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-bold text-primary font-display">{t.dashboard.stats.simulate}</span>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm text-foreground/80 font-medium ml-1">{t.dashboard.stats.your_bankroll}</label>
                <div className="flex items-center gap-2 relative">
                  <span className="absolute left-3 text-muted-foreground font-medium">$</span>
                  <Input 
                    type="text" 
                    value={bankroll} 
                    onChange={handleBankrollChange}
                    className="h-12 text-lg font-mono font-bold bg-background/50 pl-8"
                  />
                </div>
             </div>
             
             <div className="bg-background/50 rounded-lg p-3 border border-border flex justify-between items-center outline outline-1 outline-transparent hover:outline-primary/20 transition-all">
                <span className="text-sm text-muted-foreground">{t.dashboard.stats.unit_value}</span>
                <span className="font-mono text-sm font-bold text-foreground/90">${formatCurrency(numBankroll / 10)}</span>
             </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-primary/10">
          <div className="text-sm text-muted-foreground mb-2 font-medium">{t.dashboard.stats.projected_profit}</div>
          <div className={cn(
            "font-mono text-4xl w-full text-center overflow-x-auto custom-scrollbar font-black drop-shadow-sm pb-2",
            simulatedProfit > 0 ? "text-green-500" : simulatedProfit < 0 ? "text-red-500" : ""
          )}>
            {simulatedProfit > 0 ? "+" : ""}${formatCurrency(simulatedProfit)}
          </div>
        </div>
      </motion.div>
    </div>

      {/* Recent Bets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-display text-lg font-bold">{t.dashboard.stats.history_title}</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">{t.dashboard.stats.history_sorted}</span>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : signals.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t.dashboard.stats.no_history}
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto custom-scrollbar">
            {signals.map((signal) => {
               const dateStr = new Date(signal.created_at).toLocaleDateString(language === 'es' ? "es-ES" : "en-US", { month: "short", day: "numeric" });
               const isWon = signal.status === "won";
               const isLost = signal.status === "lost";
               const isVoid = signal.status === "void";
               
                let profitStr = "";
                if (isWon || isLost) profitStr = `${signal.realProfit > 0 ? "+" : ""}${signal.realProfit?.toFixed(2)} U`;
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
                      {isWon ? t.dashboard.stats.won : isLost ? t.dashboard.stats.lost : t.dashboard.stats.void}
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