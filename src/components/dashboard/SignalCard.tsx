import { motion } from "framer-motion";
import { Copy, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  time: string;
  league: string;
  teamA: string;
  teamB: string;
  odds: number;
  probability: number;
  betType: string;
  analysis: string;
  confidence: "high" | "medium" | "low";
}

interface SignalCardProps {
  signal: Signal;
  index: number;
}

const SignalCard = ({ signal, index }: SignalCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const copyBet = () => {
    const betText = `${signal.teamA} vs ${signal.teamB} - ${signal.betType} @ ${signal.odds}`;
    navigator.clipboard.writeText(betText);
    toast({
      title: "¡Copiado!",
      description: "Apuesta copiada al portapapeles",
    });
  };

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

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "Alta Confianza";
      case "medium":
        return "Confianza Media";
      case "low":
        return "Baja Confianza";
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
        "bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300",
        "hover:border-primary/40 hover:shadow-[0_0_30px_rgba(213,252,107,0.1)]",
        expanded && "border-primary/50"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">{signal.time}</span>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium text-foreground">{signal.league}</span>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full border",
            getConfidenceColor(signal.confidence)
          )}
        >
          {getConfidenceLabel(signal.confidence)}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Match */}
        <div className="text-center mb-5">
          <h3 className="font-display text-lg md:text-xl font-bold">
            {signal.teamA}{" "}
            <span className="text-muted-foreground mx-2">vs</span>{" "}
            {signal.teamB}
          </h3>
        </div>

        {/* Key Data */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <span className="text-sm text-muted-foreground block mb-1">CUOTA</span>
            <span className="font-mono text-3xl font-bold text-primary">{signal.odds.toFixed(2)}</span>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <span className="text-sm text-muted-foreground block mb-1">PROBABILIDAD</span>
            <span className="font-mono text-3xl font-bold text-primary">{signal.probability}%</span>
          </div>
        </div>

        {/* AI Tag */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-accent/5 border border-accent/20 rounded-xl">
          <Zap className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="text-sm text-muted-foreground">
            <span className="text-accent font-medium">Detectado por Scanner:</span> {signal.betType}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="flex-1 border-border hover:bg-secondary"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Ocultar
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Ver Análisis
              </>
            )}
          </Button>
          <Button
            onClick={copyBet}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Apuesta
          </Button>
        </div>

        {/* Expanded Analysis */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 pt-5 border-t border-border"
          >
            <h4 className="font-display text-sm font-bold mb-3 text-primary">
              ANÁLISIS DEL ALGORITMO
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {signal.analysis}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SignalCard;