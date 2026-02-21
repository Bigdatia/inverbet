import { useState } from "react";
import { Download, Share, Plus, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface InstallAppButtonProps {
  /** "sidebar" for dashboard sidebar, "navbar" for the landing navbar */
  variant?: "sidebar" | "navbar";
}

const InstallAppButton = ({ variant = "sidebar" }: InstallAppButtonProps) => {
  const { isInstallable, isIOS, isInstalled, promptInstall } = usePWAInstall();
  const { t } = useLanguage();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Don't render if already installed or neither installable nor iOS
  if (isInstalled || (!isInstallable && !isIOS)) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await promptInstall();
    }
  };

  // Sidebar variant — full button matching menu styling
  if (variant === "sidebar") {
    return (
      <>
        <button
          onClick={handleClick}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <Download className="h-5 w-5" />
          <span className="font-medium">{t.install.button}</span>
        </button>

        <IOSInstructionsModal
          open={showIOSModal}
          onClose={() => setShowIOSModal(false)}
        />
      </>
    );
  }

  // Navbar variant — compact, icon-focused
  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/15 transition-all duration-200"
        title={t.install.button}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">{t.install.button}</span>
      </button>

      <IOSInstructionsModal
        open={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
};

/* ─── iOS Instructions Modal ─────────────────────────────────── */

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const IOSInstructionsModal = ({ open, onClose }: ModalProps) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-[#1a1b1e] border border-border/50 rounded-2xl p-6 z-[101] shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {t.install.ios_title}
              </h3>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  1
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm text-muted-foreground">
                    {t.install.ios_step1}
                  </span>
                  <Share className="h-4 w-4 text-blue-400 shrink-0" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  2
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm text-muted-foreground">
                    {t.install.ios_step2}
                  </span>
                  <Plus className="h-4 w-4 text-blue-400 shrink-0" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  3
                </div>
                <p className="text-sm text-muted-foreground pt-1">
                  {t.install.ios_step3}
                </p>
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.install.ios_close}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InstallAppButton;
