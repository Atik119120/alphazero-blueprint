import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Preloader from "@/components/Preloader";
import ScrollToTop from "@/components/ScrollToTop";
import AIChatbot from "@/components/AIChatbot";

// Main site pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import WorkPage from "./pages/WorkPage";
import TeamPage from "./pages/TeamPage";
import JoinTeamPage from "./pages/JoinTeamPage";
import ContactPage from "./pages/ContactPage";
import CoursesPage from "./pages/CoursesPage";
import NotFound from "./pages/NotFound";

// LMS pages
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import PassCodePage from "./pages/PassCodePage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CertificatePage from "./pages/CertificatePage";
import MyCertificatesPage from "./pages/MyCertificatesPage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
              <BrowserRouter>
                <ScrollToTop />
                <AIChatbot />
                
                <Routes>
                  {/* Main site routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/join-team" element={<JoinTeamPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  
                  {/* LMS routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/passcode" element={<PassCodePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/my-certificates" element={<MyCertificatesPage />} />
                  <Route path="/certificate/:certificateId" element={<CertificatePage />} />
                  <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
