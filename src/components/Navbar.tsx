import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-display text-primary-foreground text-sm font-bold">I</span>
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-foreground">
            INVERBET
          </span>
        </div>

        {/* Center Link */}
        <div className="hidden md:flex items-center">
          <a
            href="#academy"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Academy
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:flex border-foreground/20 text-foreground hover:bg-foreground/10 hover:text-foreground font-medium"
          >
            Iniciar Sesión
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-green">
            Comenzar Prueba
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;