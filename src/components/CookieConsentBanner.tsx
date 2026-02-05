import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const COOKIE_CONSENT_KEY = "inverbet_cookie_consent";
const COOKIE_PREFERENCES_KEY = "inverbet_cookie_preferences";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(cookiePrefs));
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Cannot disable necessary cookies
    setCookiePrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieOptions = [
    {
      key: "necessary" as const,
      title: "Cookies Necesarias",
      description: "Esenciales para el funcionamiento del sitio. No se pueden desactivar.",
      required: true,
    },
    {
      key: "analytics" as const,
      title: "Cookies de Análisis",
      description: "Nos ayudan a entender cómo usas la plataforma para mejorarla.",
      required: false,
    },
    {
      key: "marketing" as const,
      title: "Cookies de Marketing",
      description: "Utilizadas para mostrarte anuncios relevantes.",
      required: false,
    },
    {
      key: "preferences" as const,
      title: "Cookies de Preferencias",
      description: "Guardan tus preferencias personalizadas.",
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-primary/20"
        >
          <div className="container mx-auto px-4 py-4">
            <AnimatePresence mode="wait">
              {!showConfig ? (
                <motion.div
                  key="banner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
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

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowConfig(true)}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      Configurar
                    </button>
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
                    >
                      ACEPTAR
                    </Button>
                  </div>

                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 md:static md:ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="config"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Configurar Cookies</h3>
                    <button
                      onClick={handleClose}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {cookieOptions.map((option) => (
                      <div
                        key={option.key}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="flex-1 pr-4">
                          <h4 className="text-sm font-medium text-foreground">{option.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                        </div>
                        <Switch
                          checked={cookiePrefs[option.key]}
                          onCheckedChange={() => togglePreference(option.key)}
                          disabled={option.required}
                          className={option.required ? "opacity-50" : ""}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
                    <button
                      onClick={() => setShowConfig(false)}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      Volver
                    </button>
                    <Button
                      onClick={handleSavePreferences}
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      Guardar Preferencias
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                    >
                      ACEPTAR TODO
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
