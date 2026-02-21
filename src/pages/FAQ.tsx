import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();

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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 text-primary uppercase">
            {t.faq.title}
          </h1>
          
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.faq.q1}</h2>
              <p>{t.faq.a1}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.faq.q2}</h2>
              <p>{t.faq.a2}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.faq.q3}</h2>
              <p>{t.faq.a3}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.faq.q4}</h2>
              <p>{t.faq.a4}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.faq.q5}</h2>
              <p>{t.faq.a5}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.faq.q6}</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <p className="m-0">{t.faq.a6_item1}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <p className="m-0">{t.faq.a6_item2}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <p className="m-0">{t.faq.a6_item3}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <p className="m-0">{t.faq.a6_item4}</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;

