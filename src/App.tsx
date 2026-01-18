import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Preloader from "@/components/Preloader";
import ScrollToTop from "@/components/ScrollToTop";
import AIChatbot from "@/components/AIChatbot";

import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import WorkPage from "./pages/WorkPage";
import TeamPage from "./pages/TeamPage";
import JoinTeamPage from "./pages/JoinTeamPage";
import ContactPage from "./pages/ContactPage";
import CoursesPage from "./pages/CoursesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            <BrowserRouter>
              <ScrollToTop />
              <AIChatbot />
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/join-team" element={<JoinTeamPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
