import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const [loadingMethod, setLoadingMethod] = useState<"stripe" | "binance" | null>(null);

  const handlePayment = (method: "stripe" | "binance") => {
    setLoadingMethod(method);
    // Simulate redirect delay
    setTimeout(() => {
      // Here you would redirect to Stripe or Binance
      console.log(`Redirecting to ${method}...`);
      setLoadingMethod(null);
    }, 2000);
  };

  const handleClose = () => {
    if (!loadingMethod) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0a0a0a] border border-border/50 shadow-[0_0_60px_hsl(76_96%_70%/0.15)] max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/30">
          <DialogTitle className="font-display text-xl text-foreground text-center">
            Selecciona Método de Pago Seguro
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm mt-2 font-mono">
            Suscripción PRO — <span className="text-primary font-semibold">$29 USD</span> / mes
          </p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Stripe Option */}
          <motion.button
            onClick={() => handlePayment("stripe")}
            disabled={loadingMethod !== null}
            whileHover={{ scale: loadingMethod ? 1 : 1.02 }}
            whileTap={{ scale: loadingMethod ? 1 : 0.98 }}
            className="w-full p-5 bg-secondary/50 rounded-lg border border-border/50 
                       hover:border-primary/70 hover:shadow-[0_0_20px_hsl(76_96%_70%/0.2)]
                       transition-all duration-300 text-left group disabled:opacity-70"
          >
            <div className="flex items-center gap-4">
              {/* Card Icons */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {loadingMethod === "stripe" ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : (
                  <>
                    {/* Visa Icon */}
                    <svg className="h-8 w-auto text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 48 32" fill="currentColor">
                      <rect x="1" y="1" width="46" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19.5 20.5l2-10h3l-2 10h-3zm12.5-10l-2.5 6.8-.3-1.5-.9-4.5c-.2-.6-.6-.8-1.2-.8h-4.6l-.1.3c1 .3 2 .6 2.8 1l2.3 8.7h3.2l4.8-10h-3.5zm-6.5 10h-3l1.8-10h3l-1.8 10zm-10-10h-5l-.1.3c3.8 1 6.3 3.3 7.3 6.2l-1.1-5.3c-.2-.8-.7-1.1-1.4-1.2h-.7z"/>
                    </svg>
                    {/* Mastercard Icon */}
                    <svg className="h-8 w-auto text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 48 32" fill="currentColor">
                      <rect x="1" y="1" width="46" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="19" cy="16" r="7" fillOpacity="0.5"/>
                      <circle cx="29" cy="16" r="7" fillOpacity="0.5"/>
                    </svg>
                  </>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {loadingMethod === "stripe" ? "Redirigiendo..." : "Tarjeta de Crédito / Débito"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Procesado seguramente por Stripe. Activación inmediata.
                </p>
              </div>

              <CreditCard className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </motion.button>

          {/* Binance Pay Option */}
          <motion.button
            onClick={() => handlePayment("binance")}
            disabled={loadingMethod !== null}
            whileHover={{ scale: loadingMethod ? 1 : 1.02 }}
            whileTap={{ scale: loadingMethod ? 1 : 0.98 }}
            className="w-full p-5 bg-secondary/50 rounded-lg border border-border/50 
                       hover:border-[#F0B90B]/70 hover:shadow-[0_0_20px_rgba(240,185,11,0.2)]
                       transition-all duration-300 text-left group disabled:opacity-70"
          >
            <div className="flex items-center gap-4">
              {/* Binance Icon */}
              <div className="flex-shrink-0">
                {loadingMethod === "binance" ? (
                  <Loader2 className="h-8 w-8 text-[#F0B90B] animate-spin" />
                ) : (
                  <svg className="h-8 w-8 text-[#F0B90B]" viewBox="0 0 126 126" fill="currentColor">
                    <path d="M38.5 53.5l24.5-24.5 24.6 24.5 14.3-14.3L63 0 24.2 38.8l14.3 14.7zm-24.5 10L0 77.5l14 14 14-14-14-14zm24.5 10L63 98l24.6-24.5 14.3 14.2-.1.1L63 126 24.2 87.2l-.1-.1 14.4-13.6zm48.5-10l14 14 14-14-14-14-14 14zM77.8 63L63 48.2 51.6 59.5l-1.3 1.3L63 73.5l14.9-14.9-.1-.1V63h-0.1z"/>
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-[#F0B90B] transition-colors">
                  {loadingMethod === "binance" ? "Redirigiendo..." : "Binance Pay (Crypto)"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Paga con USDT. Rápido y sin fronteras.
                </p>
              </div>

              {/* Crypto Icon */}
              <svg className="h-5 w-5 text-muted-foreground group-hover:text-[#F0B90B] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M9 9h6M9 15h6"/>
              </svg>
            </div>
          </motion.button>
        </div>

        {/* Security Footer */}
        <div className="px-6 py-4 bg-secondary/30 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-xs font-mono">
              Transacción encriptada SSL de extremo a extremo. Tus datos están seguros.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
