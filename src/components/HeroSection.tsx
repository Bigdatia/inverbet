import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Bell } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
              <span className="text-sm text-muted-foreground font-medium">
                Algoritmo en tiempo real
              </span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Deja de Apostar.{" "}
              <span className="text-gradient-neon">Empieza a Invertir.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 font-body">
              La primera plataforma que combina{" "}
              <span className="text-foreground font-medium">Inteligencia de Datos</span> y{" "}
              <span className="text-foreground font-medium">Gestión de Riesgo Profesional</span>.
              No es suerte, es matemática.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 glow-green-strong group"
              >
                ACCEDER AL SCANNER AHORA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm">+5,000 usuarios activos</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">Tasa de acierto: 78%</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative animate-float">
              {/* Phone Frame */}
              <div className="relative w-72 md:w-80 h-[580px] md:h-[640px] bg-gradient-to-b from-muted to-card rounded-[3rem] p-3 glow-purple">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Screen Content */}
                  <div className="absolute inset-0 p-6 flex flex-col">
                    {/* Status bar */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs text-muted-foreground">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-primary rounded-sm" />
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <span className="font-display text-lg font-bold">INVERBET</span>
                        <p className="text-xs text-muted-foreground">Scanner Pro</p>
                      </div>
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    {/* Signal Card */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="bg-secondary border border-primary/30 rounded-2xl p-5 mb-4 glow-green"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          🔥 Señal Detectada
                        </span>
                        <span className="text-xs text-muted-foreground">Ahora</span>
                      </div>
                      <div className="space-y-2">
                        <p className="font-display font-bold text-lg">Real Madrid vs Barcelona</p>
                        <p className="text-sm text-muted-foreground">La Liga • Over 2.5 Goles</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-primary rounded-full" />
                          </div>
                          <span className="text-primary font-bold text-lg">85%</span>
                        </div>
                        <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-medium">
                          Alta Confianza
                        </span>
                      </div>
                    </motion.div>

                    {/* Secondary Signal */}
                    <div className="bg-secondary/50 border border-border rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Señal Pendiente</span>
                        <span className="text-xs text-muted-foreground">hace 5 min</span>
                      </div>
                      <p className="font-medium text-sm">Man City vs Liverpool</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-[72%] bg-accent rounded-full" />
                        </div>
                        <span className="text-accent text-sm font-medium">72%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;