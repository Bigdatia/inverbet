import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutModal from "./CheckoutModal";

const benefits = [
  "Acceso ilimitado al Scanner de Señales 24/7",
  "Inverbet Academy (Curso de Estrategia) INCLUIDO",
  "Alertas en tiempo real vía app y email",
  "Soporte prioritario por WhatsApp",
  "Historial completo de señales y estadísticas",
];

const PricingSection = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Un precio.{" "}
            <span className="text-gradient-neon">Todo incluido.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sin costos ocultos. Sin compromisos a largo plazo. Cancela cuando quieras.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="border-glow-animated p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-primary text-sm font-bold uppercase tracking-wider">
                  Membresía PRO
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl md:text-6xl font-display font-bold">$29</span>
                <span className="text-muted-foreground text-lg">USD / mes</span>
              </div>

              <p className="text-muted-foreground mt-3">
                Comienza con 7 días de prueba gratis
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg py-6 glow-green-strong"
            >
              DESBLOQUEAR ACCESO TOTAL
            </Button>

            <CheckoutModal 
              isOpen={isCheckoutOpen} 
              onClose={() => setIsCheckoutOpen(false)} 
            />

            {/* Payment Methods */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Métodos de pago aceptados</span>
              </div>
              <div className="flex items-center justify-center gap-6">
                {/* Payment icons - simplified monochromatic style */}
                <div className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-xs mt-1 block">Binance</span>
                </div>
                <div className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                  </svg>
                  <span className="text-xs mt-1 block">Stripe</span>
                </div>
                <div className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.441c2.136 0 3.616.507 4.397 1.509.76.974.97 2.231.606 3.719l-.003.013v.006c-.385 1.764-1.25 3.17-2.572 4.18-1.282.977-2.926 1.474-4.887 1.474H7.576a.641.641 0 0 0-.633.54l-.867 5.665a.641.641 0 0 1-.633.54h-2.47l.103-.64z" />
                  </svg>
                  <span className="text-xs mt-1 block">PayPal</span>
                </div>
                <div className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4v8h16V8H4zm2 2h4v4H6v-4z" />
                  </svg>
                  <span className="text-xs mt-1 block">PSE</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;