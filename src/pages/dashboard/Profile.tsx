import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User as UserIcon, Mail, CreditCard, Shield, Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [user, setUser] = useState<any>(null);

  const { toast } = useToast();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, subscription_tier, subscription_status, subscription_start_date')
          .eq('id', user.id)
          .single();
        
        setUser({ 
            ...user, 
            full_name: profile?.full_name,
            subscription_tier: profile?.subscription_tier,
            subscription_status: profile?.subscription_status,
            subscription_start_date: profile?.subscription_start_date
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
        toast({
            title: "Error",
            description: "Por favor completa todos los campos",
            variant: "destructive"
        });
        return;
    }

    if (passwords.new !== passwords.confirm) {
        toast({
            title: "Error",
            description: "Las contraseñas nuevas no coinciden",
            variant: "destructive"
        });
        return;
    }

    if (passwords.new.length < 6) {
        toast({
            title: "Error",
            description: "La contraseña debe tener al menos 6 caracteres",
            variant: "destructive"
        });
        return;
    }

    setLoading(true);

    try {
        // 1. Verify current password by signing in (re-auth)
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: passwords.current
        });

        if (signInError) {
            throw new Error("La contraseña actual es incorrecta");
        }

        // 2. Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: passwords.new
        });

        if (updateError) throw updateError;

        toast({
            title: "Éxito",
            description: "Contraseña actualizada correctamente",
        });

        setPasswords({ current: "", new: "", confirm: "" });
        setShowPasswordForm(false);

    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Error al actualizar la contraseña",
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      })
    : "";

  const getNextBillingDate = (startDateStr: string | null) => {
    if (!startDateStr) return null;
    const date = new Date(startDateStr);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleSignOutAll = async () => {
    try {
        setLoading(true);
        // Deslogea en todos los dispositivos si `scope: global` es soportado.
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw error;
        toast({
            title: "Sesiones cerradas",
            description: "Se han cerrado todas las sesiones.",
        });
        window.location.href = '/auth';
    } catch (error: any) {
        console.error(error);
        // Fallback preventivo
        await supabase.auth.signOut();
        window.location.href = '/auth';
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold">Perfil y Pagos</h1>
        <p className="text-muted-foreground">Gestiona tu cuenta y suscripción</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold capitalize">
              {user?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario"}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Miembro desde {memberSince}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subscription Card */}
      {user?.subscription_tier === 'premium' && user?.subscription_status === 'active' ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-glow-animated p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold">Membresía PRO</h3>
            <p className="text-sm text-muted-foreground">Plan activo</p>
          </div>
          <span className="ml-auto px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
            Activa
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {[
            "Acceso ilimitado al Scanner 24/7",
            "Inverbet Academy incluido",
            "Alertas en tiempo real",
            "Soporte prioritario",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-muted-foreground text-sm">Próximo cobro:</span>
            <p className="font-mono font-bold">$20 USD - {getNextBillingDate(user?.subscription_start_date) || "No disponible"}</p>
          </div>
        </div>
      </motion.div>
      ) : (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Crown className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold">Plan Gratuito</h3>
            <p className="text-sm text-muted-foreground">Acceso limitado</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
            <p className="text-sm text-muted-foreground">Mejora tu plan para acceder a todas las funciones.</p>
            <Button 
                onClick={() => {
                  window.location.href = '/';
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
            >
                Hazte Pro
            </Button>
        </div>
      </motion.div>
      )}

      {/* Payment Methods (Hidden) */}

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold">Seguridad</h3>
        </div>
        <div className="space-y-3">
        <div className="space-y-4">
          {!showPasswordForm ? (
              <Button 
                variant="outline" 
                className="w-full justify-start border-border"
                onClick={() => setShowPasswordForm(true)}
              >
                Cambiar contraseña
              </Button>
          ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 pt-2"
              >
                  <div className="space-y-2">
                      <Label htmlFor="current">Contraseña actual</Label>
                      <Input 
                        id="current" 
                        type="password" 
                        placeholder="••••••••"
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="new">Nueva contraseña</Label>
                      <Input 
                        id="new" 
                        type="password" 
                        placeholder="••••••••"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="confirm">Confirmar nueva contraseña</Label>
                      <Input 
                        id="confirm" 
                        type="password" 
                        placeholder="••••••••"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      />
                  </div>
                  <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={handlePasswordChange} 
                        disabled={loading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                          {loading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                            setShowPasswordForm(false);
                            setPasswords({ current: "", new: "", confirm: "" });
                        }}
                        disabled={loading}
                      >
                          Cancelar
                      </Button>
                  </div>
              </motion.div>
          )}

          <Button
            variant="outline"
            onClick={handleSignOutAll}
            disabled={loading}
            className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {loading ? "Cerrando sesiones..." : "Cerrar todas las sesiones"}
          </Button>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;