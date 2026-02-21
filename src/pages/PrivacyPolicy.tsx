import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-primary uppercase">
            {t.privacy.title}
          </h1>
          
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
            <p className="text-foreground italic">
              {t.privacy.preamble}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s1_title}</h2>
              <ul className="list-none space-y-2 pl-0">
                <li><strong className="text-foreground">{t.privacy.s1_name_label}</strong> {t.privacy.s1_name_value}</li>
                <li><strong className="text-foreground">{t.privacy.s1_address_label}</strong> {t.privacy.s1_address_value}</li>
                <li><strong className="text-foreground">{t.privacy.s1_email_label}</strong> legal@inverbet.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s2_title}</h2>
              <p className="mb-4">{t.privacy.s2_intro}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">{t.privacy.s2_id_title}</strong> {t.privacy.s2_id_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.privacy.s2_trans_title}</strong> {t.privacy.s2_trans_content}
                </li>
                <li>
                  <strong className="text-foreground">{t.privacy.s2_usage_title}</strong> {t.privacy.s2_usage_content}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s3_title}</h2>
              <p className="mb-4">{t.privacy.s3_intro}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t.privacy.s3_item_a}</li>
                <li>{t.privacy.s3_item_b}</li>
                <li>{t.privacy.s3_item_c}</li>
                <li>{t.privacy.s3_item_d}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s4_title}</h2>
              <p className="mb-4">{t.privacy.s4_intro}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">{t.privacy.s4_know_title}</strong> {t.privacy.s4_know_content}</li>
                <li><strong className="text-foreground">{t.privacy.s4_update_title}</strong> {t.privacy.s4_update_content}</li>
                <li><strong className="text-foreground">{t.privacy.s4_rectify_title}</strong> {t.privacy.s4_rectify_content}</li>
                <li><strong className="text-foreground">{t.privacy.s4_suppress_title}</strong> {t.privacy.s4_suppress_content}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s5_title}</h2>
              <p>{t.privacy.s5_content}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s6_title}</h2>
              <p>{t.privacy.s6_content}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.s7_title}</h2>
              <p>{t.privacy.s7_content}</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

