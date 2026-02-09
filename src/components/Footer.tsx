import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

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
              <img src="/logotipo.png" alt="Inverbet Logo" className="h-6 w-auto object-contain" />
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.terms}
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.privacy}
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.contact}
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.faq}
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-6" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 Inverbet. {t.footer.rights}</p>
            <p className="text-center md:text-right max-w-md">
              {t.footer.disclaimer}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};


export default Footer;