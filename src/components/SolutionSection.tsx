import { motion } from "framer-motion";
import { Scan, GraduationCap, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SolutionSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Scan,
      title: t.solution.cards[0].title,
      description: t.solution.cards[0].description,
      color: "primary",
    },
    {
      icon: GraduationCap,
      title: t.solution.cards[1].title,
      description: t.solution.cards[1].description,
      color: "accent",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">{t.solution.badge}</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t.solution.title_prefix}{" "}
              <span className="text-gradient-neon">{t.solution.title_highlight}</span>{" "}
              {t.solution.title_suffix}
            </h2>

            <p className="text-muted-foreground text-lg mb-10">
              {t.solution.subtitle}
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-4"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      feature.color === "primary"
                        ? "bg-primary/10"
                        : "bg-accent/10"
                    }`}
                  >
                    <feature.icon
                      className={`h-6 w-6 ${
                        feature.color === "primary" ? "text-primary" : "text-accent"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Stats/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Stats Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-muted-foreground text-sm">{t.solution.stats.header_subtitle}</span>
                    <h3 className="font-display text-2xl font-bold">{t.solution.stats.header_title}</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-primary text-sm font-medium">{t.solution.stats.verified}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-secondary rounded-2xl p-6 text-center">
                    <span className="text-4xl font-display font-bold text-primary">78%</span>
                    <p className="text-muted-foreground text-sm mt-2">{t.solution.stats.success_rate}</p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-6 text-center">
                    <span className="text-4xl font-display font-bold text-foreground">156</span>
                    <p className="text-muted-foreground text-sm mt-2">{t.solution.stats.signals_issued}</p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-6 text-center">
                    <span className="text-4xl font-display font-bold text-foreground">+23%</span>
                    <p className="text-muted-foreground text-sm mt-2">{t.solution.stats.roi_avg}</p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-6 text-center">
                    <span className="text-4xl font-display font-bold text-accent">24/7</span>
                    <p className="text-muted-foreground text-sm mt-2">{t.solution.stats.monitoring}</p>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="flex items-center justify-center gap-3 py-4 bg-secondary/50 rounded-xl">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t.solution.stats.live_indicator}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;