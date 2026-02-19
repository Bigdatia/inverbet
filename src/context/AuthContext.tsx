import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  role: "admin" | "user" | null;
  full_name: string | null;
  subscription_tier: "free" | "premium" | null;
  subscription_status: "active" | "inactive" | "canceled" | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPro: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data as Profile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // Safety timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Auth timeout")), 5000)
      );

      try {
        await Promise.race([
          (async () => {
              const { data: { session } } = await supabase.auth.getSession();
              
              if (session) {
                setSession(session);
                setUser(session.user);
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
              } else {
                setSession(null);
                setUser(null);
                setProfile(null);
              }
          })(),
          timeoutPromise
        ]);
      } catch (error) {
        console.error("Auth initialization error or timeout:", error);
        // Fallback to "no user" state to avoid stuck loading
        if (session) {
           console.log("Session exists but profile fetch failed/timed out. Forcing logout to clear state.");
           await supabase.auth.signOut();
        }
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
         // Fetch profile if we don't have it or if the user changed
         if (!profile || session.user.id !== user?.id) {
            const userProfile = await fetchProfile(session.user.id);
            
            if (!userProfile) {
                console.error("User authenticated but profile not found. Signing out.");
                await supabase.auth.signOut();
                setSession(null);
                setUser(null);
                setProfile(null);
            } else {
                setProfile(userProfile);
            }
         }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Keep a ref to the profile to access it inside the subscription callback without re-subscribing
  const profileRef = useRef(profile);
  
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Realtime subscription for profile changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newProfile = payload.new as Profile;
          const currentProfile = profileRef.current;
          
          // Check if subscription tier changed and force logout if it did
          if (currentProfile && newProfile.subscription_tier !== currentProfile.subscription_tier) {
             console.log("Subscription tier changed, forcing logout to ensure clean state");
             toast.info("Tu plan ha sido actualizado. Por favor inicia sesión nuevamente.");
             
             // Wait a moment for the toast to be seen, then logout
             setTimeout(() => {
                signOut();
             }, 2000);
          } else {
             // Just update the profile in place
             setProfile(newProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      signOut,
      isAdmin: profile?.role === 'admin',
      isPro: profile?.subscription_tier === 'premium' || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
