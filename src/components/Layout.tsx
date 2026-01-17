import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "@/assets/logo.png";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background Logo Watermark */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <img 
          src={logo} 
          alt="" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-auto opacity-[0.04] brightness-0 dark:invert rotate-[-12deg]"
        />
      </div>
      
      <Navbar />
      <main className="flex-1 pt-20 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
