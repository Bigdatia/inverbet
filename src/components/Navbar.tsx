import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/context/CheckoutContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { openCheckout } = useCheckout();

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
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className="hidden sm:flex border-foreground/20 text-foreground hover:bg-foreground/10 hover:text-foreground font-medium"
          >
            Iniciar Sesión
          </Button>
          <Button
            onClick={openCheckout}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-green"
          >
            Suscríbete
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;