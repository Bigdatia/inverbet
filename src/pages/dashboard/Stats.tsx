import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Percent, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "ROI Total",
    value: "+23.5%",
    change: "+5.2%",
    positive: true,
    icon: Percent,
  },
  {
    label: "Apuestas Ganadas",
    value: "127",
    subvalue: "de 163",
    icon: Target,
  },
  {
    label: "Tasa de Acierto",
    value: "77.9%",
    change: "+2.1%",
    positive: true,
    icon: TrendingUp,
  },
  {
    label: "Profit Neto",
    value: "$1,847",
    change: "+$320",
    positive: true,
    icon: DollarSign,
  },
];

const recentBets = [
  { match: "Man City vs Liverpool", bet: "Over 2.5", odds: 2.1, result: "won", profit: "+$42" },
  { match: "Real Madrid vs Barcelona", bet: "BTTS", odds: 1.95, result: "won", profit: "+$38" },
  { match: "Juventus vs AC Milan", bet: "Over 1.5 1H", odds: 2.45, result: "lost", profit: "-$20" },
  { match: "Bayern vs Dortmund", bet: "Home Win", odds: 1.75, result: "won", profit: "+$15" },
  { match: "PSG vs Marseille", bet: "Over 2.5", odds: 1.85, result: "won", profit: "+$17" },
];

const Stats = () => {
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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
            {stat.change && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  stat.positive ? "text-primary" : "text-destructive"
                )}
              >
                {stat.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{stat.change} vs mes anterior</span>
              </div>
            )}
            {stat.subvalue && (
              <div className="text-sm text-muted-foreground">{stat.subvalue}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="font-display text-lg font-bold mb-4">Evolución del Bankroll</h2>
        <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary/30" />
            <p className="text-sm">Gráfico de rendimiento</p>
            <p className="text-xs text-muted-foreground/60">Próximamente</p>
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
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg font-bold">Historial Reciente</h2>
        </div>
        <div className="divide-y divide-border">
          {recentBets.map((bet, index) => (
            <div
              key={index}
              className="px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{bet.match}</p>
                <p className="text-sm text-muted-foreground">
                  {bet.bet} @ <span className="font-mono">{bet.odds}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    bet.result === "won"
                      ? "bg-primary/20 text-primary"
                      : "bg-destructive/20 text-destructive"
                  )}
                >
                  {bet.result === "won" ? "GANADA" : "PERDIDA"}
                </span>
                <span
                  className={cn(
                    "font-mono font-bold",
                    bet.result === "won" ? "text-primary" : "text-destructive"
                  )}
                >
                  {bet.profit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;