import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Send, GraduationCap, HelpCircle, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";
import CoursesNavbar from "@/components/CoursesNavbar";
import CoursesFooter from "@/components/CoursesFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFooterContent } from "@/hooks/useFooterData";
import { usePageContent } from "@/hooks/usePageContent";

const LearnContactPage = () => {
  const { language } = useLanguage();
  const { data: footerContents } = useFooterContent();
  const { getContent: getPageContent } = usePageContent("learn-contact", "learn");
  const [formData, setFormData] = useState({ name: "", email: "", topic: "general", message: "" });
  const isBn = language === "bn";
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const cms = (bnKey: string, enKey: string, bnFb: string, enFb: string) =>
    isBn ? (getPageContent(bnKey) || bnFb) : (getPageContent(enKey) || enFb);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Learn contact form:", formData);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getFooterContent = (key: string) => {
    const c = footerContents?.find((i) => i.content_key === key);
    if (!c) return null;
    return c.content_en;
  };
  const phone = getPageContent("learn.phone") || getFooterContent("phone") || "+880 1344-497808";
  const email = (getPageContent("learn.email") || "support@learn.alphazero.online").trim();
  const address = cms("learn.address", "learn.address.en", "ঢাকা, বাংলাদেশ", "Dhaka, Bangladesh");
  const waNumber = phone.replace(/\D/g, "");

  const topics = [
    { value: "general", label: t("সাধারণ প্রশ্ন", "General Question") },
    { value: "enrollment", label: t("কোর্স এনরোলমেন্ট", "Course Enrollment") },
    { value: "payment", label: t("পেমেন্ট সহায়তা", "Payment Help") },
    { value: "technical", label: t("টেকনিক্যাল ইস্যু", "Technical Issue") },
    { value: "certificate", label: t("সার্টিফিকেট", "Certificate") },
  ];

  const quickHelp = [
    { icon: BookOpen, title: t("কোর্স ব্রাউজ", "Browse Courses"), desc: t("আমাদের সমস্ত কোর্স দেখুন", "Explore all our courses"), href: "/courses" },
    { icon: HelpCircle, title: t("সাধারণ প্রশ্ন", "FAQ"), desc: t("দ্রুত উত্তর পান", "Get quick answers"), href: "/learn-about" },
    { icon: GraduationCap, title: t("স্টুডেন্ট লগইন", "Student Login"), desc: t("আপনার ড্যাশবোর্ডে প্রবেশ করুন", "Access your dashboard"), href: "/student/login" },
  ];

  return (
    <>
      <CoursesNavbar />
      <main className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-primary/[0.04]" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <GraduationCap size={14} className="text-primary" />
              <span className="text-xs font-bold tracking-wider uppercase text-primary">
                {cms("hero.badge.bn", "hero.badge.en", "লার্ন সাপোর্ট", "Learn Support")}
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-5 leading-tight">
              {cms("hero.title.bn", "hero.title.en", "শিখতে চান? ", "Learning? ")}
              <span className="gradient-text">{cms("hero.title2.bn", "hero.title2.en", "আমরা সাহায্য করব", "We're here to help")}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {cms("hero.description.bn", "hero.description.en",
                "কোর্স, এনরোলমেন্ট বা পেমেন্ট সংক্রান্ত যেকোনো প্রশ্ন — আমাদের একাডেমী টিম ২৪ ঘন্টার মধ্যে উত্তর দেবে।",
                "Any question about courses, enrollment or payment — our academy team responds within 24 hours."
              )}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick help cards */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
            {quickHelp.map((item, i) => (
              <motion.a key={i} href={item.href}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-2xl glass-card hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                  <item.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form + Info */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-1 gap-8">
            {/* Info sidebar */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="space-y-4">

              <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/25">
                <h3 className="font-display font-bold text-lg mb-4">{t("দ্রুত যোগাযোগ", "Quick Contact")}</h3>
                <div className="space-y-3">
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/70 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <MessageCircle size={18} className="text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">WhatsApp</div>
                      <div className="text-sm font-medium truncate">{phone}</div>
                    </div>
                  </a>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/70 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">{t("কল করুন", "Call")}</div>
                      <div className="text-sm font-medium truncate">{phone}</div>
                    </div>
                  </a>
                  <a href={`mailto:${email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/70 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="text-sm font-medium truncate">{email}</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{t("সাপোর্ট সময়", "Support Hours")}</div>
                    <div className="text-sm font-medium">{cms("info.hours.bn", "info.hours.en", "শনি — বৃহস্পতি, ১০টা — ১০টা", "Sat — Thu, 10am — 10pm")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{t("ঠিকানা", "Location")}</div>
                    <div className="text-sm font-medium">{address}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </main>
      <CoursesFooter />
    </>
  );
};

export default LearnContactPage;
