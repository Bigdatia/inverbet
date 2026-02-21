import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TermsOfService = () => {
  const { t, language } = useLanguage();
  const currentDate = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.auth.back_btn}
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-primary uppercase">
            {t.terms.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t.terms.updated}{currentDate}
          </p>
          
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s1_title}</h2>
              <p>{t.terms.s1_content}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s2_title}</h2>
              <p>{t.terms.s2_content1}</p>
              <p className="font-bold text-foreground mt-2">
                {t.terms.s2_important}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s3_title}</h2>
              <ul className="list-none space-y-4 pl-0">
                <li>
                  <strong className="text-foreground">{t.terms.s3_1_title}</strong> {t.terms.s3_1_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.terms.s3_2_title}</strong> {t.terms.s3_2_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.terms.s3_3_title}</strong> {t.terms.s3_3_content}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s4_title}</h2>
              <p>{t.terms.s4_content}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s5_title}</h2>
              <ul className="list-none space-y-4 pl-0">
                <li>
                  <strong className="text-foreground">{t.terms.s5_1_title}</strong> {t.terms.s5_1_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.terms.s5_2_title}</strong> {t.terms.s5_2_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.terms.s5_3_title}</strong> {t.terms.s5_3_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.terms.s5_4_title}</strong> {t.terms.s5_4_content}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s6_title}</h2>
              <p>{t.terms.s6_content}</p>
              <p className="mt-2">
                <strong className="text-foreground">{t.faq.a5.split('.')[0] === 'EXCEPCIÓN' ? 'EXCEPCIÓN' : 'EXCEPTION'}:</strong> {t.terms.s6_exception}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s7_title}</h2>
              <p>{t.terms.s7_content}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.terms.s8_title}</h2>
              <p>{t.terms.s8_content}</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;

