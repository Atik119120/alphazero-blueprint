import { useCallback, useState, useEffect, lazy, Suspense } from "react";
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

// Critical pages - loaded immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages for better performance
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const JoinTeamPage = lazy(() => import("./pages/JoinTeamPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));

// LMS pages - lazy loaded
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const StudentLoginPage = lazy(() => import("./pages/StudentLoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PassCodePage = lazy(() => import("./pages/PassCodePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const TeacherLoginPage = lazy(() => import("./pages/TeacherLoginPage"));
const MyCertificatesPage = lazy(() => import("./pages/MyCertificatesPage"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));
const VerifyCertificatePage = lazy(() => import("./pages/VerifyCertificatePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

// Lazy load AI Chatbot (not critical for initial render)
const AIChatbot = lazy(() => import("./components/AIChatbot"));

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

// Minimal loading fallback for lazy components
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
  </div>
);

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
      
      {/* Lazy load chatbot */}
      <Suspense fallback={null}>
        <AIChatbot />
      </Suspense>
      
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
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
