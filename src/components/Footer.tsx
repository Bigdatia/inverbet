import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-display text-primary-foreground text-sm font-bold">I</span>
              </div>
              <span className="font-display text-xl font-bold tracking-wider">
                INVERBET
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-6" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 Inverbet. Todos los derechos reservados.</p>
            <p className="text-center md:text-right max-w-md">
              Juega responsablemente. Tecnología desarrollada para mayores de 18 años. 
              El juego puede ser adictivo, juegue con moderación.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;