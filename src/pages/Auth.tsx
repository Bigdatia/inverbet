import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { useLanguage } from "@/context/LanguageContext";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (profile?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validate = () => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};
    
    // Custom validation messages are handled by translating the error keys or setting defaults here.
    // Zod is schema validation but message can be custom.
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = t.auth.errors.invalid_email;
    }
    
    if (!isResetMode) {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = t.auth.errors.invalid_password;
      }
    }

    if (!isLogin && !isResetMode && !fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isResetMode, setIsResetMode] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Validate terms acceptance for signup
    if (!isLogin && !acceptedTerms && !isResetMode) {
      setTermsError(true);
      setTimeout(() => setTermsError(false), 2000);
      return;
    }
    
    setLoading(true);

    try {
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        
        if (error) throw error;

        toast({
          title: "Correo enviado",
          description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        });
        setIsResetMode(false);
        setIsLogin(true);
      } else if (isLogin) {
        // Timeout wrapper for sign in
        const signInPromise = supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        const timeoutPromise = new Promise<{ data: { user: null; session: null }; error: any }>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout: El servidor no responde")), 10000)
        );

        const { error } = await Promise.race([signInPromise, timeoutPromise]);
        
        if (error) throw error;

        // Manually navigate on success
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data: profile } = await supabase
             .from('profiles')
             .select('role')
             .eq('id', user.id)
             .single();
             
           if (profile?.role === 'admin') {
             navigate("/admin");
           } else {
             navigate("/dashboard");
           }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
            }
          },
        });
        
        if (error) throw error;

        toast({
          title: t.auth.errors.success_created,
          description: t.auth.errors.check_email,
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = error.message;
      
      if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = t.auth.errors.auth_error_desc;
      } else if (errorMessage.includes("already registered")) {
        errorMessage = t.auth.errors.existing_user_desc;
      }

      toast({
        title: t.auth.errors.error_title,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">{t.auth.back_btn}</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/logotipo.png" alt="Inverbet Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">
              {isResetMode 
                ? "Recuperar Contraseña" 
                : isLogin 
                  ? t.auth.welcome_back 
                  : t.auth.create_account}
            </h1>
            <p className="text-muted-foreground">
              {isResetMode
                ? "Ingresa tu email para recibir un enlace de recuperación."
                : isLogin
                  ? t.auth.login_subtitle
                  : t.auth.register_subtitle}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && !isResetMode && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="h-12 bg-secondary border-border focus:border-primary"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-destructive text-sm">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t.auth.email_label}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.email_label}
                  className="pl-10 h-12 bg-secondary border-border focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            {!isResetMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t.auth.password_label}
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 bg-secondary border-border focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
              </div>
            )}

            {/* Terms checkbox - only show on signup */}
            {!isLogin && (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    setAcceptedTerms(checked === true);
                    setTermsError(false);
                  }}
                  className="mt-0.5 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="terms"
                  className={`text-xs leading-relaxed transition-colors duration-300 ${
                    termsError 
                      ? "text-destructive animate-pulse" 
                      : "text-muted-foreground"
                  }`}
                >
                  {t.auth.terms_accept}{" "}
                  <Link 
                    to="/terms" 
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.auth.terms_link}
                  </Link>{" "}
                  y la{" "}
                  <Link 
                    to="/privacy" 
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.auth.privacy_link}
                  </Link>
                  .
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold glow-green"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isResetMode ? (
                "Enviar correo de recuperación"
              ) : isLogin ? (
                t.auth.login_btn
              ) : (
                t.auth.register_btn
              )}
            </Button>

            {/* Forgot Password Link - Below Login Button */}
            {isLogin && !isResetMode && (
              <div className="text-center">
                 <button
                   type="button"
                   onClick={() => {
                     setIsResetMode(true);
                     setErrors({});
                   }}
                   className="text-sm text-muted-foreground hover:text-primary transition-colors"
                 >
                   ¿Olvidaste tu contraseña?
                 </button>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isResetMode ? (
                <>
                  ¿Ya recordaste tu contraseña?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false);
                      setIsLogin(true);
                      setErrors({});
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Volver al login
                  </button>
                </>
              ) : (
                <>
                  {isLogin ? t.auth.no_account : t.auth.yes_account}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setAcceptedTerms(false);
                      setTermsError(false);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? t.auth.register_link : t.auth.login_link}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          {t.auth.terms_continue}{" "}
          <a href="#" className="underline hover:text-foreground">
            {t.auth.terms_link}
          </a>{" "}
          y{" "}
          <a href="#" className="underline hover:text-foreground">
            {t.auth.privacy_link}
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;