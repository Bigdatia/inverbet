import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, User } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import InstallAppButton from "@/components/InstallAppButton";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { user, isPro } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img src="/logotipo.png" alt="Inverbet Logo" className="h-10 w-auto object-contain" />
        </Link>



        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {/* Install App Button */}
          <InstallAppButton variant="navbar" />

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-transparent px-2 sm:px-4"
          >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{language.toUpperCase()}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="flex border-foreground/20 text-foreground hover:bg-foreground/10 hover:text-foreground font-medium px-3 sm:px-4"
          >
            <User className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">{t.navbar.login}</span>
          </Button>
          <Button
            onClick={() => {
              if (!user) {
                navigate("/auth?mode=signup");
                return;
              }
              
              if (isPro) {
                navigate("/dashboard");
                return;
              }

              const pricingSection = document.getElementById("pricing");
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/");
                setTimeout(() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }}
            className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-green"
          >
            {isPro ? "Ir al Dashboard" : t.navbar.subscribe}
          </Button>
          
        </div>
      </div>
    </motion.nav>
  );
};



export default Navbar;