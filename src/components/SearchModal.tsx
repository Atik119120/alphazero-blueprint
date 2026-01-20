import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Layout, Users, Briefcase, Phone, BookOpen, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  path: string;
  icon: React.ElementType;
  keywords: string[];
}

const searchData: SearchItem[] = [
  {
    title: "Home",
    titleBn: "হোম",
    description: "Welcome to AlphaZero - Creative Design Agency",
    descriptionBn: "AlphaZero-এ স্বাগতম - ক্রিয়েটিভ ডিজাইন এজেন্সি",
    path: "/",
    icon: Layout,
    keywords: ["home", "main", "landing", "welcome", "alphazero", "alpha", "zero", "agency", "এজেন্সি", "হোম", "প্রধান", "স্বাগতম", "আলফাজিরো", "আলফা"]
  },
  {
    title: "About Us",
    titleBn: "আমাদের সম্পর্কে",
    description: "Learn about AlphaZero's journey, mission, vision and values",
    descriptionBn: "AlphaZero-এর যাত্রা, মিশন, ভিশন এবং মূল্যবোধ সম্পর্কে জানুন",
    path: "/about",
    icon: Info,
    keywords: ["about", "story", "values", "mission", "vision", "history", "company", "who", "we", "are", "journey", "আমাদের", "সম্পর্কে", "গল্প", "মিশন", "ভিশন", "কোম্পানি", "যাত্রা", "ইতিহাস"]
  },
  {
    title: "Our Services",
    titleBn: "আমাদের সেবাসমূহ",
    description: "Graphic Design, Web Development, Video Editing, Digital Marketing, Logo, Branding",
    descriptionBn: "গ্রাফিক ডিজাইন, ওয়েব ডেভেলপমেন্ট, ভিডিও এডিটিং, ডিজিটাল মার্কেটিং, লোগো, ব্র্যান্ডিং",
    path: "/services",
    icon: Briefcase,
    keywords: ["services", "service", "design", "web", "website", "seo", "marketing", "digital", "graphic", "video", "editing", "development", "developer", "logo", "branding", "brand", "poster", "banner", "flyer", "social", "media", "thumbnail", "youtube", "facebook", "instagram", "সেবা", "ডিজাইন", "ওয়েব", "ওয়েবসাইট", "মার্কেটিং", "লোগো", "ব্র্যান্ডিং", "গ্রাফিক", "ভিডিও", "এডিটিং", "ডেভেলপমেন্ট", "পোস্টার", "ব্যানার", "থাম্বনেইল", "ফেসবুক", "ইউটিউব"]
  },
  {
    title: "Our Work",
    titleBn: "আমাদের কাজ",
    description: "View our portfolio, completed projects and case studies",
    descriptionBn: "আমাদের পোর্টফোলিও, সম্পন্ন প্রজেক্ট এবং কেস স্টাডি দেখুন",
    path: "/work",
    icon: Layout,
    keywords: ["work", "portfolio", "projects", "project", "case", "study", "gallery", "showcase", "examples", "sample", "কাজ", "পোর্টফোলিও", "প্রজেক্ট", "গ্যালারি", "নমুনা", "উদাহরণ"]
  },
  {
    title: "Our Team",
    titleBn: "আমাদের টিম",
    description: "Meet the creative minds behind AlphaZero",
    descriptionBn: "AlphaZero-এর পেছনের ক্রিয়েটিভ মানুষদের সাথে পরিচিত হন",
    path: "/team",
    icon: Users,
    keywords: ["team", "members", "people", "staff", "founder", "ceo", "designer", "developer", "employee", "crew", "join", "career", "টিম", "সদস্য", "মানুষ", "ফাউন্ডার", "ডিজাইনার", "ডেভেলপার", "কর্মী"]
  },
  {
    title: "Courses",
    titleBn: "কোর্সসমূহ",
    description: "Learn design and development skills - Graphic Design, Web Development courses",
    descriptionBn: "ডিজাইন এবং ডেভেলপমেন্ট শিখুন - গ্রাফিক ডিজাইন, ওয়েব ডেভেলপমেন্ট কোর্স",
    path: "/courses",
    icon: BookOpen,
    keywords: ["courses", "course", "training", "learn", "learning", "class", "tutorial", "education", "skill", "study", "enroll", "admission", "certificate", "কোর্স", "ট্রেনিং", "শিখুন", "শেখা", "ক্লাস", "টিউটোরিয়াল", "শিক্ষা", "ভর্তি", "সার্টিফিকেট"]
  },
  {
    title: "Contact Us",
    titleBn: "যোগাযোগ করুন",
    description: "Get in touch with us - Email, Phone, WhatsApp, Location",
    descriptionBn: "আমাদের সাথে যোগাযোগ করুন - ইমেইল, ফোন, হোয়াটসঅ্যাপ, লোকেশন",
    path: "/contact",
    icon: Phone,
    keywords: ["contact", "email", "phone", "whatsapp", "message", "call", "reach", "location", "address", "help", "support", "inquiry", "quote", "price", "যোগাযোগ", "ইমেইল", "ফোন", "হোয়াটসঅ্যাপ", "মেসেজ", "কল", "ঠিকানা", "লোকেশন", "সাহায্য", "দাম"]
  },
  {
    title: "Join Our Team",
    titleBn: "টিমে যোগ দিন",
    description: "Career opportunities at AlphaZero - Apply now",
    descriptionBn: "AlphaZero-তে ক্যারিয়ারের সুযোগ - এখনই আবেদন করুন",
    path: "/join-team",
    icon: Users,
    keywords: ["join", "career", "job", "jobs", "apply", "hiring", "work", "opportunity", "vacancy", "recruitment", "যোগ", "চাকরি", "আবেদন", "নিয়োগ", "ক্যারিয়ার", "সুযোগ"]
  },
  {
    title: "Student Login",
    titleBn: "স্টুডেন্ট লগইন",
    description: "Login to access your courses and dashboard",
    descriptionBn: "আপনার কোর্স এবং ড্যাশবোর্ড অ্যাক্সেস করতে লগইন করুন",
    path: "/student-login",
    icon: BookOpen,
    keywords: ["student", "login", "signin", "sign", "account", "dashboard", "my", "courses", "স্টুডেন্ট", "লগইন", "একাউন্ট", "ড্যাশবোর্ড", "আমার"]
  },
  {
    title: "Verify Certificate",
    titleBn: "সার্টিফিকেট যাচাই",
    description: "Verify your AlphaZero certificate authenticity",
    descriptionBn: "আপনার AlphaZero সার্টিফিকেটের সত্যতা যাচাই করুন",
    path: "/verify-certificate",
    icon: BookOpen,
    keywords: ["verify", "certificate", "check", "validate", "authenticity", "সার্টিফিকেট", "যাচাই", "চেক", "ভেরিফাই"]
  },
];

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  const filteredResults = useMemo(() => {
    if (!query.trim()) return searchData;
    
    const searchTerm = query.toLowerCase();
    return searchData.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.titleBn.includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.descriptionBn.includes(searchTerm) ||
      item.keywords.some(k => k.toLowerCase().includes(searchTerm))
    );
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />

          {/* Modal - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[15%] md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:inset-x-auto z-[101] w-auto md:w-full md:max-w-lg"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === "bn" ? "পেজ বা সার্ভিস খুঁজুন..." : "Search pages or services..."}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/70 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {language === "bn" ? item.titleBn : item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {language === "bn" ? item.descriptionBn : item.description}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search size={40} className="mx-auto mb-3 opacity-30" />
                    <p>{language === "bn" ? "কোনো ফলাফল পাওয়া যায়নি" : "No results found"}</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="p-3 border-t border-border bg-secondary/30">
                <p className="text-xs text-muted-foreground text-center">
                  {language === "bn" ? "Enter চাপুন নির্বাচন করতে • Esc বন্ধ করতে" : "Press Enter to select • Esc to close"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
