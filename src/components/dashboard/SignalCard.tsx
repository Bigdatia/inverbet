import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Signal {
  id: string;
  created_at: string;
  league: string;
  match: string; // "Team A vs Team B"
  market: string; // The bet type
  odds: number;
  stake: number;
  status: string;
  analysis: string;
  confidence: "high" | "medium" | "low";
  is_premium: boolean;
  // Optional computed props if needed
  teamA?: string;
  teamB?: string;
}

interface SignalCardProps {
  signal: Signal;
  index: number;
}

const SignalCard = ({ signal, index, isLocked = false, onUnlock }: SignalCardProps & { isLocked?: boolean; onUnlock?: () => void }) => {
  const [expanded, setExpanded] = useState(false);

  // Parse teams robustly using regex to catch "vs", "vs.", "VS", "v.s." etc.
  const teams = signal.match.split(/\s+v\.?s\.?\s+/i);
  const teamA = teams[0] || signal.match;
  const teamB = teams.length > 1 ? teams[1] : "";

  // Format time (just show time part or relative)
  const timeDisplay = new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "text-primary bg-primary/10 border-primary/30";
      case "medium":
        return "text-accent bg-accent/10 border-accent/30";
      case "low":
        return "text-destructive bg-destructive/10 border-destructive/30";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const isResolved = signal.status === 'won' || signal.status === 'lost' || signal.status === 'void';
  const isWon = signal.status === 'won';
  const isLost = signal.status === 'lost';
  const isVoid = signal.status === 'void';

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "";
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 relative group",
        "hover:border-primary/40 hover:shadow-[0_0_30px_rgba(213,252,107,0.1)]",
        expanded && "border-primary/50"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{timeDisplay}</span>
          <div className="h-3 w-px bg-border" />
          <span className="text-xs font-medium text-foreground">{signal.league}</span>
        </div>
        <div className="flex items-center gap-2">
          {isResolved && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
              isWon && "bg-green-500/20 text-green-500 border border-green-500/30",
              isLost && "bg-red-500/20 text-red-500 border border-red-500/30",
              isVoid && "bg-neutral-500/20 text-neutral-400 border border-neutral-500/30"
            )}>
              {isWon ? "Ganada" : isLost ? "Perdida" : "Anulada"}
            </span>
          )}
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full border",
              getConfidenceColor(signal.confidence)
            )}
          >
            {getConfidenceLabel(signal.confidence)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("p-4 relative transition-all duration-300", isResolved && "opacity-50 grayscale")}>
        {/* Match */}
        <div className="flex items-center justify-center gap-2 mb-3 w-full">
          <h3 className="flex-1 text-right font-display text-base md:text-lg font-bold truncate" title={teamA}>
            {teamA}
          </h3>
          <span className="text-muted-foreground text-xs font-semibold px-2 shrink-0">VS</span>
          <h3 className="flex-1 text-left font-display text-base md:text-lg font-bold truncate" title={teamB}>
            {teamB}
          </h3>
        </div>

        {/* Compact Info Row */}
        {isLocked ? (
          <div className="space-y-3">
             <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-xl p-3 filter blur-sm select-none opacity-50">
               <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                 <Zap className="h-4 w-4 text-accent shrink-0" />
                 <span className="text-sm font-medium truncate">Gana Local</span>
               </div>
               <div className="flex gap-3 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground block">CUOTA</span>
                    <span className="font-mono text-sm font-bold text-primary">1.85</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground block">PROB</span>
                    <span className="font-mono text-sm font-bold text-primary">85%</span>
                  </div>
               </div>
             </div>

             <Button 
               onClick={onUnlock}
               className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 text-sm shadow-[0_0_20px_rgba(37,211,102,0.2)]"
             >
               Hazte PRO
             </Button>
          </div>
        ) : (
          <>
            <div className={cn(
              "flex gap-2 bg-secondary/30 rounded-xl p-2.5 mb-4",
              isResolved && "opacity-50 pointer-events-none"
            )}>
              {/* Left half: Market Pill */}
              <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-lg border border-accent/20 w-1/2 min-w-0">
                <Zap className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">{signal.market}</span>
              </div>
              
              {/* Right half: Odds & Prob */}
              <div className="flex items-center justify-around gap-2 w-1/2 pl-1">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-medium text-muted-foreground mb-0.5 tracking-wider">CUOTA</span>
                  <span className="font-mono text-sm font-bold text-primary leading-none">
                    {signal.odds.toFixed(2)}
                  </span>
                </div>
                <div className="w-px h-6 bg-border/50 shrink-0" />
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-medium text-muted-foreground mb-0.5 tracking-wider">PROB</span>
                  <span className="font-mono text-sm font-bold text-primary leading-none">{signal.stake}%</span>
                </div>
              </div>
            </div>

            {!isResolved && (
              <Button
                variant={expanded ? "ghost" : "default"}
                onClick={() => setExpanded(!expanded)}
                className={cn(
                  "w-full text-xs h-8 flex justify-center items-center transition-colors",
                  expanded 
                    ? "border border-border/50 hover:bg-secondary text-foreground" 
                    : "bg-primary text-[#0d150b] hover:bg-primary/90 font-bold border-none"
                )}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                    Ocultar Análisis
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                    Ver Análisis
                  </>
                )}
              </Button>
            )}
          </>
        )}

        {/* Expanded Analysis */}
        {expanded && !isLocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border overflow-hidden"
          >
            <h4 className="font-display text-xs font-bold mb-2 text-primary">
              ANÁLISIS DEL ALGORITMO
            </h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {signal.analysis}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SignalCard;