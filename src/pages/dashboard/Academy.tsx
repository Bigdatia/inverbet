import { motion } from "framer-motion";
import { Play, Lock, CheckCircle, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PaymentFormContent } from "@/components/checkout/ManualPaymentForm";

const modules = [
  {
    id: 1,
    title: "Módulo 1: La Regla del 1%",
    description: "Aprende por qué nunca debes apostar más del 1% de tu bankroll en una sola apuesta.",
    duration: "12 min",
    status: "available",
    progress: 0,
  },
  {
    id: 2,
    title: "Módulo 2: Gestión del Bankroll",
    description: "Estrategias profesionales para proteger y hacer crecer tu capital.",
    duration: "18 min",
    status: "locked",
    progress: 0,
  },
  {
    id: 3,
    title: "Módulo 3: Entendiendo las Cuotas",
    description: "Cómo funcionan las cuotas y cómo el algoritmo detecta errores de mercado.",
    duration: "15 min",
    status: "locked",
    progress: 0,
  },
  {
    id: 4,
    title: "Módulo 4: Value Betting",
    description: "La estrategia matemática detrás de las apuestas de valor.",
    duration: "22 min",
    status: "locked",
    progress: 0,
  },
  {
    id: 5,
    title: "Módulo 5: Psicología del Apostador",
    description: "Controla tus emociones y evita las trampas mentales más comunes.",
    duration: "14 min",
    status: "locked",
    progress: 0,
  },
];

const Academy = () => {
  const { isPro } = useAuth();
  const completedModules = modules.filter((m) => m.status === "completed").length;
  const totalProgress = Math.round((completedModules / modules.length) * 100);

  if (!isPro) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-primary/20 bg-secondary/10 rounded-2xl overflow-hidden relative min-h-[600px] flex items-center justify-center"
      >
        {/* Blurred Background Effect */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden filter blur-sm">
           <div className="space-y-4 p-8">
              {modules.slice(0, 3).map((module) => (
                  <div key={module.id} className="h-24 bg-card rounded-xl border border-border" />
              ))}
           </div>
        </div>
        
        <div className="relative z-10 p-6 md:p-8 w-full max-w-2xl">
           <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">
                Inverbet Academy Pro
              </h2>
              <p className="text-muted-foreground">
                Desbloquea el curso completo de estrategia y gestión de capital.
              </p>
           </div>

           <div className="bg-black/60 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden">
              <PaymentFormContent embedded />
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Inverbet Academy
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">
              Estrategia Maestra de Gestión de Capital
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Antes de usar las señales, domina los fundamentos. Este curso te enseñará a proteger tu dinero como un profesional.
            </p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 min-w-[160px]">
            <div className="text-sm text-muted-foreground mb-2">Tu Progreso</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <span className="font-mono text-xl font-bold text-primary">{totalProgress}%</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {completedModules} de {modules.length} módulos
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module, index) => {
          const isLocked = module.status === "locked";
          const isCompleted = module.status === "completed";
          const isAvailable = module.status === "available";

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-card border rounded-xl p-5 transition-all duration-300",
                isLocked
                  ? "border-border/50 opacity-60"
                  : "border-border hover:border-primary/40 cursor-pointer hover:shadow-[0_0_20px_rgba(213,252,107,0.08)]"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Module Number / Status */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    isCompleted
                      ? "bg-primary/20"
                      : isAvailable
                      ? "bg-accent/20"
                      : "bg-secondary"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Play className="h-5 w-5 text-accent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold truncate">{module.title}</h3>
                    {isAvailable && !isCompleted && (
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full font-medium">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {module.description}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-mono">{module.duration}</span>
                </div>
              </div>

              {/* Progress Bar (if in progress) */}
              {module.progress > 0 && module.progress < 100 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {module.progress}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-6"
      >
        <p className="text-muted-foreground text-sm">
          Completa todos los módulos para desbloquear el{" "}
          <span className="text-primary font-medium">Certificado Inverbet Pro</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Academy;