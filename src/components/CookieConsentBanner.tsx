import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "inverbet_cookie_consent";

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505] border-t border-primary/20"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Text content */}
              <p className="text-sm text-muted-foreground flex-1 pr-8 md:pr-4">
                Usamos cookies para mejorar tu experiencia en nuestra plataforma de inteligencia deportiva. 
                Al continuar, aceptas nuestra{" "}
                <Link 
                  to="/privacy" 
                  className="text-primary hover:underline font-medium"
                >
                  Política de Datos
                </Link>
                .
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Configurar
                </button>
                <Button
                  onClick={handleAccept}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
                >
                  ACEPTAR
                </Button>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 md:static md:ml-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
