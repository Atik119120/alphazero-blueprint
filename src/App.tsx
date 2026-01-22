import { useCallback, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import AdminLoginPage from "./pages/AdminLoginPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import DashboardPage from "./pages/DashboardPage";
import PassCodePage from "./pages/PassCodePage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import MyCertificatesPage from "./pages/MyCertificatesPage";
import CertificatePage from "./pages/CertificatePage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

// LMS routes where preloader should be skipped
const LMS_ROUTES = [
  '/admin/login',
  '/student/login',
  '/teacher/login',
  '/auth',
  '/dashboard',
  '/passcode',
  '/admin',
  '/student',
  '/teacher',
  '/my-certificates',
  '/certificate',
  '/verify-certificate',
  '/forgot-password',
  '/reset-password'
];

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [preloaderShown, setPreloaderShown] = useState(false);
  
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    setPreloaderShown(true);
  }, []);

  // Check if current route is an LMS route
  const isLmsRoute = LMS_ROUTES.some(route => location.pathname.startsWith(route));

  // Skip preloader for LMS routes or if already shown
  useEffect(() => {
    if (isLmsRoute || preloaderShown) {
      setIsLoading(false);
    }
  }, [isLmsRoute, preloaderShown]);

  const showPreloader = isLoading && !isLmsRoute && !preloaderShown;

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
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
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/teacher/login" element={<TeacherLoginPage />} />
        <Route path="/auth" element={<StudentLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/passcode" element={<PassCodePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/my-certificates" element={<MyCertificatesPage />} />
        <Route path="/certificate/:certificateId" element={<CertificatePage />} />
        <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
