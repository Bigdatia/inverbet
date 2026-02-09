import { motion } from "framer-motion";
import { Check, Zap, CreditCard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/context/CheckoutContext";
import { useTRM, formatCurrencyCOP } from "@/hooks/useTRM";
import { useLanguage } from "@/context/LanguageContext";

const PricingSection = () => {
  const { openCheckout } = useCheckout();
  const { data: trm, isLoading } = useTRM();
  const { t } = useLanguage();
  const priceUSD = 20;
  const priceCOP = trm ? priceUSD * trm : 0;

  const benefits = t.pricing.benefits;

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t.pricing.title}{" "}
            <span className="text-gradient-neon">{t.pricing.title_highlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="border-glow-animated p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-primary text-sm font-bold uppercase tracking-wider">
                  {t.pricing.badge}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-display font-bold">${priceUSD}</span>
                    <span className="text-muted-foreground text-lg">{t.pricing.per_month}</span>
                </div>
                <div className="text-lg font-medium text-primary/80">
                    {isLoading ? t.pricing.loading_trm : `≈ ${formatCurrencyCOP(priceCOP)} COP`}
                </div>
              </div>

              <p className="text-muted-foreground mt-3 text-sm">
                {t.pricing.access_text}
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={openCheckout}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg py-6 glow-green-strong uppercase"
            >
              {t.pricing.subscribe_btn}
            </Button>

            {/* Payment Methods */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t.pricing.payment_methods}</span>
              </div>
              <div className="flex items-center justify-center gap-6">
                {/* Payment icons - simplified monochromatic style */}
                <div className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-xs mt-1 block">Binance</span>
                </div>
                
                <div className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.441c2.136 0 3.616.507 4.397 1.509.76.974.97 2.231.606 3.719l-.003.013v.006c-.385 1.764-1.25 3.17-2.572 4.18-1.282.977-2.926 1.474-4.887 1.474H7.576a.641.641 0 0 0-.633.54l-.867 5.665a.641.641 0 0 1-.633.54h-2.47l.103-.64z" />
                  </svg>
                  <span className="text-xs mt-1 block">PayPal</span>
                </div>

                <div className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center">
                  <QrCode className="h-6 w-6" />
                  <span className="text-xs mt-1 block">Bancolombia QR</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;