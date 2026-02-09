import { motion } from "framer-motion";
import { Heart, Target, Calculator } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ProblemSection = () => {
  const { t } = useLanguage();

  const problems = [
    {
      icon: Heart,
      title: t.problem.cards[0].title,
      description: t.problem.cards[0].description,
    },
    {
      icon: Target,
      title: t.problem.cards[1].title,
      description: t.problem.cards[1].description,
    },
    {
      icon: Calculator,
      title: t.problem.cards[2].title,
      description: t.problem.cards[2].description,
    },
  ];

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
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
            {t.problem.title_prefix}{" "}
            <span className="text-destructive">{t.problem.title_highlight}</span>{" "}
            {t.problem.title_suffix}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.problem.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="h-full bg-card border border-border rounded-2xl p-8 hover:border-destructive/50 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <problem.icon className="h-7 w-7 text-destructive" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;