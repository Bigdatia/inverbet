import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-transparent px-2",
        className
      )}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium text-xs sm:text-sm">{language.toUpperCase()}</span>
    </Button>
  );
};

export default LanguageToggle;
