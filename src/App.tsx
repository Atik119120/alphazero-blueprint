import { useCallback, useState, useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Preloader from "@/components/Preloader";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollReveal from "@/components/ScrollReveal";

// Preload logos immediately
import logoSrc from "@/assets/logo.png";
import logoFullSrc from "@/assets/logo-full.png";
const preloadImg = (src: string) => { const img = new Image(); img.src = src; };
preloadImg(logoSrc);
preloadImg(logoFullSrc);

// Main site pages - loaded immediately for instant navigation
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import LearnAboutPage from "./pages/LearnAboutPage";
import ServicesPage from "./pages/ServicesPage";
import WorkPage from "./pages/WorkPage";
import TeamPage from "./pages/TeamPage";
import JoinTeamPage from "./pages/JoinTeamPage";
import ContactPage from "./pages/ContactPage";
import CoursesPage from "./pages/CoursesPage";


// LMS pages - loaded immediately for fast access
import AdminLoginPage from "./pages/AdminLoginPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import DashboardPage from "./pages/DashboardPage";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import MyCertificatesPage from "./pages/MyCertificatesPage";
import CourseViewerPage from "./pages/CourseViewerPage";
import CertificatePage from "./pages/CertificatePage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import CustomCheckoutPage from "./pages/CustomCheckoutPage";
import CourseLandingPage from "./pages/CourseLandingPage";
import LearnContactPage from "./pages/LearnContactPage";


import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

// LMS routes where preloader should be skipped
const LMS_ROUTES = [
  '/admin/login',
  '/student/login',
  '/teacher/login',
  '/auth',
  '/dashboard',
  
  '/admin',
  '/student',
  '/teacher',
  '/my-certificates',
  '/certificate',
  '/verify-certificate',
  '/forgot-password',
  '/reset-password',
  '/payment',
  '/pay'
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
      {!isLmsRoute && <SmoothScroll />}
      {!isLmsRoute && <ScrollReveal />}
      <ScrollToTop />
      
      <AIChatbot />
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            {/* Main site routes */}
            <Route path="/" element={typeof window !== "undefined" && window.location.hostname.startsWith("learn.") ? <CoursesPage /> : <Index />} />

            <Route path="/about" element={typeof window !== "undefined" && window.location.hostname.startsWith("learn.") ? <LearnAboutPage /> : <AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/join-team" element={<JoinTeamPage />} />
            <Route path="/contact" element={typeof window !== "undefined" && window.location.hostname.startsWith("learn.") ? <CoursesPage /> : <ContactPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/instructors" element={<CoursesPage />} />
            

            {/* LMS routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/student/login" element={<StudentLoginPage />} />
            <Route path="/teacher/login" element={<TeacherLoginPage />} />
            <Route path="/auth" element={<StudentLoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/course/:courseId" element={<CourseViewerPage />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/my-certificates" element={<MyCertificatesPage />} />
            <Route path="/certificate/:certificateId" element={<CertificatePage />} />
            <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
            <Route path="/pay/:invoiceId" element={<CustomCheckoutPage />} />
            <Route path="/vibe-coding" element={<CourseLandingPage />} />
            <Route path="/courses/vibe-coding" element={<CourseLandingPage />} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
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
