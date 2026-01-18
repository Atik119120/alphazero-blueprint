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
    keywords: ["home", "main", "হোম", "প্রধান"]
  },
  {
    title: "About Us",
    titleBn: "আমাদের সম্পর্কে",
    description: "Learn about AlphaZero's journey and values",
    descriptionBn: "AlphaZero-এর যাত্রা এবং মূল্যবোধ সম্পর্কে জানুন",
    path: "/about",
    icon: Info,
    keywords: ["about", "story", "values", "আমাদের", "সম্পর্কে", "গল্প"]
  },
  {
    title: "Our Services",
    titleBn: "আমাদের সেবাসমূহ",
    description: "Graphic Design, Web Development, Video Editing, Digital Marketing",
    descriptionBn: "গ্রাফিক ডিজাইন, ওয়েব ডেভেলপমেন্ট, ভিডিও এডিটিং, ডিজিটাল মার্কেটিং",
    path: "/services",
    icon: Briefcase,
    keywords: ["services", "design", "web", "seo", "marketing", "সেবা", "ডিজাইন", "ওয়েব", "মার্কেটিং", "লোগো", "logo", "branding", "ব্র্যান্ডিং"]
  },
  {
    title: "Our Work",
    titleBn: "আমাদের কাজ",
    description: "View our portfolio and completed projects",
    descriptionBn: "আমাদের পোর্টফোলিও এবং সম্পন্ন প্রজেক্ট দেখুন",
    path: "/work",
    icon: Layout,
    keywords: ["work", "portfolio", "projects", "কাজ", "পোর্টফোলিও", "প্রজেক্ট"]
  },
  {
    title: "Our Team",
    titleBn: "আমাদের টিম",
    description: "Meet the creative minds behind AlphaZero",
    descriptionBn: "AlphaZero-এর পেছনের ক্রিয়েটিভ মানুষদের সাথে পরিচিত হন",
    path: "/team",
    icon: Users,
    keywords: ["team", "members", "people", "টিম", "সদস্য", "মানুষ"]
  },
  {
    title: "Courses",
    titleBn: "কোর্সসমূহ",
    description: "Learn design and development skills with us",
    descriptionBn: "আমাদের সাথে ডিজাইন এবং ডেভেলপমেন্ট শিখুন",
    path: "/courses",
    icon: BookOpen,
    keywords: ["courses", "training", "learn", "কোর্স", "ট্রেনিং", "শিখুন"]
  },
  {
    title: "Contact Us",
    titleBn: "যোগাযোগ করুন",
    description: "Get in touch with us for your project",
    descriptionBn: "আপনার প্রজেক্টের জন্য আমাদের সাথে যোগাযোগ করুন",
    path: "/contact",
    icon: Phone,
    keywords: ["contact", "email", "phone", "whatsapp", "যোগাযোগ", "ইমেইল", "ফোন", "হোয়াটসঅ্যাপ"]
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
          >
            <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden mx-4">
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
