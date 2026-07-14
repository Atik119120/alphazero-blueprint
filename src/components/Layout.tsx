import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CoursesNavbar from "./CoursesNavbar";
import Footer from "./Footer";
import CoursesFooter from "./CoursesFooter";

interface LayoutProps {
  children: ReactNode;
}

const LEARN_ROUTES = ["/courses", "/instructors", "/learn-about", "/learn-contact"];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
  const isLearnContext = isLearnSubdomain || LEARN_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isLearnContext ? <CoursesNavbar /> : <Navbar />}
      <main className="flex-1 pt-20">
        {children}
      </main>
      {isLearnContext ? <CoursesFooter /> : <Footer />}
    </div>
  );
};

export default Layout;

