import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Scanner from "./pages/dashboard/Scanner";
import Academy from "./pages/dashboard/Academy";
import Stats from "./pages/dashboard/Stats";
import Profile from "./pages/dashboard/Profile";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Registrations from "./pages/admin/Registrations";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ScrollToTop from "./components/ScrollToTop";
import { CheckoutProvider } from "./context/CheckoutContext";

import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <CheckoutProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
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
            <CookieConsentBanner />
          </BrowserRouter>
        </CheckoutProvider>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;