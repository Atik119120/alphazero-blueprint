import { ArrowUp, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { name: "Instagram", url: "https://www.instagram.com/alphazero.online" },
    { name: "Facebook", url: "https://www.facebook.com/AlphaZero" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/alpha-zero-2248923a5" },
  ];

  return (
    <footer className="py-16 border-t border-border relative bg-card/50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <img 
                  src={logo} 
                  alt="AlphaZero Logo" 
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
              <p className="text-muted-foreground max-w-sm mb-4">
                AlphaZero is a creative design agency crafting modern visual identities 
                and brand experiences. From zero to impact.
              </p>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-xs"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["About", "Services", "Work", "Team", "Contact"].map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={14} className="text-primary" />
                  <a href="tel:+8801410190019" className="hover:text-primary transition-colors">
                    +880 1410-190019
                  </a>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={14} className="text-primary" />
                  <a href="mailto:agency.alphazero@gmail.com" className="hover:text-primary transition-colors">
                    agency.alphazero@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>Bornali, Rajshahi, Bangladesh – 6000</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} AlphaZero. All rights reserved.
            </p>

            {/* Website & Back to Top */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.alphazero.online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                alphazero.online
              </a>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
