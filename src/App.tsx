import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ScrollToTop from "./components/ScrollToTop";
import { CheckoutProvider } from "./context/CheckoutContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Loader2 } from "lucide-react";
import AdminRoute from "./components/admin/AdminRoute";

// Lazy loading pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const Scanner = lazy(() => import("./pages/dashboard/Scanner"));
const Academy = lazy(() => import("./pages/dashboard/Academy"));
const Stats = lazy(() => import("./pages/dashboard/Stats"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Registrations = lazy(() => import("./pages/admin/Registrations"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="h-10 w-10 text-primary animate-spin" />
  </div>
);

import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <CheckoutProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Scanner />} />
                    <Route path="academy" element={<Academy />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="registrations" element={<Registrations />} />
                      
                      {/* Unified Platform Routes for Admin */}
                      <Route path="scanner" element={<Scanner />} />
                      <Route path="academy" element={<Academy />} />
                      <Route path="stats" element={<Stats />} />
                      <Route path="profile" element={<Profile />} />
                    </Route>
                  </Route>
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <CookieConsentBanner />
            </AuthProvider>
          </CheckoutProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;