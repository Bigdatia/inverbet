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

  const profileRef = useRef(profile);
  const userRef = useRef(user);
  
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
      console.log("Auth: Initializing...");
      setLoading(true);
      
      // Failsafe: Force stop loading after 5s no matter what and clear potentially corrupted storage
      const failsafeTimer = setTimeout(() => {
          console.warn("Auth: Failsafe triggered, forcing loading=false and clearing local storage to recover from potential corruption");
          
          // Clear Supabase specific local storage keys
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('sb-')) {
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            console.error("Auth: Failed to clear local storage", e);
          }
          
          setLoading(false);
      }, 5000);

      try {
        console.log("Auth: Getting session...");
        // 1. Get session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Auth: Session found:", session.user.id);
          setSession(session);
          setUser(session.user);
          
          // 2. Fetch profile
          try {
             console.log("Auth: Fetching profile...");
             const profilePromise = fetchProfile(session.user.id);
             const timeoutPromise = new Promise<Profile | null>((resolve) => 
               setTimeout(() => resolve(null), 5000) 
             );
             
             const userProfile = await Promise.race([profilePromise, timeoutPromise]);
             console.log("Auth: Profile result:", userProfile ? "Found" : "Null (or timed out)");
             setProfile(userProfile);
          } catch (profileError) {
             console.error("Auth: Profile error:", profileError);
          }
        } else {
          console.log("Auth: No session found");
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth: Critical error:", error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        console.log("Auth: Initialization done, setting loading=false");
        clearTimeout(failsafeTimer);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
         // Fetch profile if we don't have it or if the user changed
         if (!profileRef.current || session.user.id !== userRef.current?.id) {
            console.log("Auth: Fetching profile due to missing reference or user change in onAuthStateChange");
            const userProfile = await fetchProfile(session.user.id);
            
            if (!userProfile) {
                console.error("User authenticated but fetching profile failed in background. Keeping existing state if any.");
                // IF it failed due to network, do not violently sign them out here.
                // Just fallback to current or null.
                if (!profileRef.current) {
                  setProfile(null);
                }
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

  // Inactivity Timeout (30 minutes)
  useEffect(() => {
    if (!user) return; // Only track inactivity when logged in

    let timeoutId: NodeJS.Timeout;
    const TIME_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds

    const handleInactivity = async () => {
      console.log("Session expired due to inactivity.");
      toast.info("Sesión cerrada por inactividad de 30 minutos.", {
         duration: 5000,
      });
      await signOut();
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleInactivity, TIME_LIMIT);
    };

    // Events that reset the timer
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    // Initial timer setup
    resetTimer();

    // Attach listeners
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

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

  // Fallback: Re-validate profile on window focus to ensure data is fresh
  useEffect(() => {
    const handleFocus = async () => {
       if (user && !loading) {
          // console.log("Window focused, re-validating profile...");
          const freshProfile = await fetchProfile(user.id);
          if (freshProfile) {
              const currentProfile = profileRef.current;
              // Also check for plan change here as a backup to Realtime
              if (currentProfile && freshProfile.subscription_tier !== currentProfile.subscription_tier) {
                 toast.info("Tu plan ha sido actualizado. Por favor inicia sesión nuevamente.");
                 setTimeout(() => signOut(), 2000);
              } else if (JSON.stringify(currentProfile) !== JSON.stringify(freshProfile)) {
                 // Only update state if the profile data actually changed to prevent infinite re-renders on every window focus
                 setProfile(freshProfile);
              }
          }
       }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, loading]);

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
