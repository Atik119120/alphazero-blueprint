import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CoursesNavbar from "./CoursesNavbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isLearnSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("learn.");
  const isCoursesArea = isLearnSubdomain || location.pathname === "/courses" || location.pathname.startsWith("/courses/");


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isCoursesArea ? <CoursesNavbar /> : <Navbar />}
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
