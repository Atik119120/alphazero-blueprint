import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.work": "Work",
    "nav.team": "Team",
    "nav.contact": "Contact",
    "nav.startProject": "Start a Project",
    
    // Home Page
    "home.badge": "Creative Design & IT Agency",
    "home.title1": "Starting every idea from",
    "home.title2": "zero",
    "home.tagline": "From zero to impact",
    "home.description": "A creative IT agency focused on graphic design, web solutions, and visual identity. We help brands start from scratch and grow with clean, modern, and impactful design solutions.",
    "home.cta1": "Start Your Project",
    "home.cta2": "View Our Work",
    "home.stats.projects": "Projects Delivered",
    "home.stats.clients": "Happy Clients",
    "home.stats.years": "Years Experience",
    "home.stats.satisfaction": "Client Satisfaction",
    "home.expertise": "Our Expertise",
    "home.whatWeDo": "What we",
    "home.do": "do",
    "home.expertiseDesc": "Full-stack creative services to build and grow your digital presence",
    "home.whyChoose": "Why Choose AlphaZero",
    "home.builtFor": "Built for",
    "home.yourSuccess": "your success",
    "home.testimonials": "Testimonials",
    "home.whatClientsSay": "What our clients",
    "home.say": "say",
    "home.trustedBy": "Trusted by innovative brands",
    "home.letsBuild": "Let's build your",
    "home.brand": "brand",
    "home.readyTo": "Ready to transform your ideas into powerful visual experiences?",
    "home.freeConsultation": "Get a Free Consultation",
    "home.whatsappUs": "WhatsApp Us",
    "home.viewAllServices": "View All Services",
    
    // Services
    "home.service.uiux": "UI/UX Design",
    "home.service.uiuxDesc": "Intuitive interfaces that users love",
    "home.service.seo": "SEO Optimization",
    "home.service.seoDesc": "Get found by your target audience",
    "home.service.web": "Website Design & Development",
    "home.service.webDesc": "Fast, responsive, modern websites",
    "home.service.ecommerce": "E-commerce Solutions",
    "home.service.ecommerceDesc": "Sell online with powerful stores",
    "home.service.social": "Social Media Design",
    "home.service.socialDesc": "Engaging content that converts",
    "home.service.branding": "Branding & Creative Design",
    "home.service.brandingDesc": "Build memorable brand identity",
    
    // Why Choose Us
    "home.why.clean": "Clean & Modern Design",
    "home.why.cleanDesc": "Fresh, contemporary aesthetics that stand out",
    "home.why.brand": "Brand-Focused Strategy",
    "home.why.brandDesc": "Every design serves your brand's unique vision",
    "home.why.detail": "Detail-Oriented",
    "home.why.detailDesc": "Pixel-perfect execution on every project",
    "home.why.client": "Client-First Communication",
    "home.why.clientDesc": "Clear, responsive, and collaborative process",
    "home.why.zero": "Zero to Full Identity",
    "home.why.zeroDesc": "Complete brand solutions from scratch",
    
    // About Page
    "about.subtitle": "About Us",
    "about.title": "We are",
    "about.description": "A creative agency focused on graphic design, branding, and visual identity. We help brands start from scratch and grow with clean, modern, and impactful design solutions.",
    "about.story.badge": "Our Journey",
    "about.story.title": "The",
    "about.story.title2": "Story",
    "about.story.card1.title": "From Zero to Hero",
    "about.story.card1.desc": "AlphaZero is a creative agency focused on graphic design, branding, and visual identity. We believe every great brand starts from zero — and with the right vision and execution, it can make a lasting impact.",
    "about.story.card2.title": "Evolving Digital Excellence",
    "about.story.card2.desc": "Currently, AlphaZero delivers professional design services while evolving toward IT and AI-driven digital services. Our goal is to turn ideas into strong visual experiences that actually work.",
    "about.story.card3.title": "Client-First Approach",
    "about.story.card3.desc": "We prioritize understanding your vision and delivering solutions that exceed expectations. Your success is our success.",
    "about.tagline": "From Zero to Impact",
    "about.badge.agency": "Creative Agency",
    "about.whyChoose": "Why Choose AlphaZero?",
    "about.why1": "Clean and modern design approach",
    "about.why2": "Brand-focused visual strategy",
    "about.why3": "Detail-oriented workflow",
    "about.why4": "Client-first communication",
    "about.why5": "From zero to full identity support",
    "about.values.title": "Our Values",
    "about.values.subtitle": "The principles that guide everything we do",
    "about.values.brandFocused": "Brand-Focused",
    "about.values.brandFocusedDesc": "Every design decision serves your brand's unique identity and goals.",
    "about.values.zeroToImpact": "Zero to Impact",
    "about.values.zeroToImpactDesc": "We start from scratch and build powerful, impactful visual identities.",
    "about.values.globalReach": "Global Reach",
    "about.values.globalReachDesc": "Based in Bangladesh, delivering design solutions worldwide.",
    "about.location.title": "Based in Bangladesh",
    "about.location.address": "Bornali, Rajshahi, Bangladesh – 6000",
    "about.location.desc": "Working with clients worldwide, delivering impactful design solutions remotely.",
    "about.location.cta1": "Let's Connect",
    "about.location.cta2": "WhatsApp Us",
    
    // Team Page
    "team.subtitle": "Our Team",
    "team.title": "Meet the",
    "team.title2": "Creators",
    "team.description": "A passionate team of designers and developers dedicated to bringing your vision to life.",
    "team.join.title": "Want to join our team?",
    "team.join.desc": "We're always looking for talented individuals to join our creative family.",
    "team.join.cta1": "Apply Now",
    "team.join.cta2": "Contact Us",
    
    // Footer
    "footer.description": "AlphaZero is a creative design agency crafting modern visual identities and brand experiences. From zero to impact.",
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    
    // Common
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",
  },
  bn: {
    // Navbar
    "nav.home": "হোম",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.services": "সেবাসমূহ",
    "nav.work": "আমাদের কাজ",
    "nav.team": "টিম",
    "nav.contact": "যোগাযোগ",
    "nav.startProject": "প্রজেক্ট শুরু করুন",
    
    // Home Page
    "home.badge": "ক্রিয়েটিভ ডিজাইন ও আইটি এজেন্সি",
    "home.title1": "প্রতিটি আইডিয়া শুরু হয়",
    "home.title2": "শূন্য থেকে",
    "home.tagline": "শূন্য থেকে প্রভাব",
    "home.description": "গ্রাফিক ডিজাইন, ওয়েব সলিউশন এবং ভিজ্যুয়াল আইডেন্টিটিতে বিশেষজ্ঞ একটি ক্রিয়েটিভ আইটি এজেন্সি। আমরা ব্র্যান্ডগুলিকে শূন্য থেকে শুরু করে পরিষ্কার, আধুনিক এবং প্রভাবশালী ডিজাইন সলিউশন দিয়ে বৃদ্ধি করতে সাহায্য করি।",
    "home.cta1": "আপনার প্রজেক্ট শুরু করুন",
    "home.cta2": "আমাদের কাজ দেখুন",
    "home.stats.projects": "প্রজেক্ট সম্পন্ন",
    "home.stats.clients": "সন্তুষ্ট ক্লায়েন্ট",
    "home.stats.years": "বছরের অভিজ্ঞতা",
    "home.stats.satisfaction": "ক্লায়েন্ট সন্তুষ্টি",
    "home.expertise": "আমাদের দক্ষতা",
    "home.whatWeDo": "আমরা যা",
    "home.do": "করি",
    "home.expertiseDesc": "আপনার ডিজিটাল উপস্থিতি তৈরি এবং বৃদ্ধি করতে সম্পূর্ণ ক্রিয়েটিভ সেবা",
    "home.whyChoose": "কেন আলফাজিরো বেছে নেবেন",
    "home.builtFor": "তৈরি হয়েছে",
    "home.yourSuccess": "আপনার সাফল্যের জন্য",
    "home.testimonials": "প্রশংসাপত্র",
    "home.whatClientsSay": "আমাদের ক্লায়েন্টরা কি",
    "home.say": "বলেন",
    "home.trustedBy": "উদ্ভাবনী ব্র্যান্ডদের বিশ্বস্ত",
    "home.letsBuild": "চলুন তৈরি করি আপনার",
    "home.brand": "ব্র্যান্ড",
    "home.readyTo": "আপনার ধারণাগুলিকে শক্তিশালী ভিজ্যুয়াল অভিজ্ঞতায় রূপান্তর করতে প্রস্তুত?",
    "home.freeConsultation": "বিনামূল্যে পরামর্শ নিন",
    "home.whatsappUs": "হোয়াটসঅ্যাপ করুন",
    "home.viewAllServices": "সব সেবা দেখুন",
    
    // Services
    "home.service.uiux": "UI/UX ডিজাইন",
    "home.service.uiuxDesc": "ব্যবহারকারীদের পছন্দের স্বজ্ঞাত ইন্টারফেস",
    "home.service.seo": "SEO অপ্টিমাইজেশন",
    "home.service.seoDesc": "আপনার টার্গেট অডিয়েন্স দ্বারা খুঁজে পান",
    "home.service.web": "ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট",
    "home.service.webDesc": "দ্রুত, রেসপন্সিভ, আধুনিক ওয়েবসাইট",
    "home.service.ecommerce": "ই-কমার্স সলিউশন",
    "home.service.ecommerceDesc": "শক্তিশালী স্টোর দিয়ে অনলাইনে বিক্রি করুন",
    "home.service.social": "সোশ্যাল মিডিয়া ডিজাইন",
    "home.service.socialDesc": "আকর্ষণীয় কন্টেন্ট যা রূপান্তর করে",
    "home.service.branding": "ব্র্যান্ডিং ও ক্রিয়েটিভ ডিজাইন",
    "home.service.brandingDesc": "স্মরণীয় ব্র্যান্ড আইডেন্টিটি তৈরি করুন",
    
    // Why Choose Us
    "home.why.clean": "পরিষ্কার ও আধুনিক ডিজাইন",
    "home.why.cleanDesc": "তাজা, সমসাময়িক নান্দনিকতা যা আলাদা",
    "home.why.brand": "ব্র্যান্ড-কেন্দ্রিক কৌশল",
    "home.why.brandDesc": "প্রতিটি ডিজাইন আপনার ব্র্যান্ডের অনন্য দৃষ্টিভঙ্গি পরিবেশন করে",
    "home.why.detail": "বিস্তারিত-ভিত্তিক",
    "home.why.detailDesc": "প্রতিটি প্রজেক্টে পিক্সেল-পারফেক্ট বাস্তবায়ন",
    "home.why.client": "ক্লায়েন্ট-প্রথম যোগাযোগ",
    "home.why.clientDesc": "পরিষ্কার, প্রতিক্রিয়াশীল এবং সহযোগিতামূলক প্রক্রিয়া",
    "home.why.zero": "শূন্য থেকে সম্পূর্ণ আইডেন্টিটি",
    "home.why.zeroDesc": "শূন্য থেকে সম্পূর্ণ ব্র্যান্ড সলিউশন",
    
    // About Page
    "about.subtitle": "আমাদের সম্পর্কে",
    "about.title": "আমরা",
    "about.description": "গ্রাফিক ডিজাইন, ব্র্যান্ডিং এবং ভিজ্যুয়াল আইডেন্টিটিতে বিশেষজ্ঞ একটি ক্রিয়েটিভ এজেন্সি। আমরা ব্র্যান্ডগুলিকে শূন্য থেকে শুরু করে পরিষ্কার, আধুনিক এবং প্রভাবশালী ডিজাইন সলিউশন দিয়ে বৃদ্ধি করতে সাহায্য করি।",
    "about.story.badge": "আমাদের যাত্রা",
    "about.story.title": "আলফাজিরোর",
    "about.story.title2": "গল্প",
    "about.story.card1.title": "শূন্য থেকে হিরো",
    "about.story.card1.desc": "আলফাজিরো একটি ক্রিয়েটিভ এজেন্সি যা গ্রাফিক ডিজাইন, ব্র্যান্ডিং এবং ভিজ্যুয়াল আইডেন্টিটিতে বিশেষজ্ঞ। আমরা বিশ্বাস করি প্রতিটি দুর্দান্ত ব্র্যান্ড শূন্য থেকে শুরু হয় — এবং সঠিক দৃষ্টিভঙ্গি এবং বাস্তবায়নের সাথে, এটি স্থায়ী প্রভাব ফেলতে পারে।",
    "about.story.card2.title": "ডিজিটাল উৎকর্ষতার বিকাশ",
    "about.story.card2.desc": "বর্তমানে, আলফাজিরো পেশাদার ডিজাইন সেবা প্রদান করে এবং আইটি ও এআই-চালিত ডিজিটাল সেবার দিকে এগিয়ে যাচ্ছে। আমাদের লক্ষ্য হল ধারণাগুলিকে শক্তিশালী ভিজ্যুয়াল অভিজ্ঞতায় রূপান্তরিত করা যা সত্যিই কাজ করে।",
    "about.story.card3.title": "ক্লায়েন্ট-প্রথম পদ্ধতি",
    "about.story.card3.desc": "আমরা আপনার দৃষ্টিভঙ্গি বোঝা এবং প্রত্যাশা ছাড়িয়ে যাওয়া সমাধান প্রদানকে অগ্রাধিকার দিই। আপনার সাফল্যই আমাদের সাফল্য।",
    "about.tagline": "শূন্য থেকে প্রভাব",
    "about.badge.agency": "ক্রিয়েটিভ এজেন্সি",
    "about.whyChoose": "কেন আলফাজিরো বেছে নেবেন?",
    "about.why1": "পরিষ্কার এবং আধুনিক ডিজাইন পদ্ধতি",
    "about.why2": "ব্র্যান্ড-কেন্দ্রিক ভিজ্যুয়াল কৌশল",
    "about.why3": "বিস্তারিত-ভিত্তিক কর্মপ্রবাহ",
    "about.why4": "ক্লায়েন্ট-প্রথম যোগাযোগ",
    "about.why5": "শূন্য থেকে সম্পূর্ণ আইডেন্টিটি সাপোর্ট",
    "about.values.title": "আমাদের মূল্যবোধ",
    "about.values.subtitle": "যে নীতিগুলি আমাদের সমস্ত কাজকে গাইড করে",
    "about.values.brandFocused": "ব্র্যান্ড-কেন্দ্রিক",
    "about.values.brandFocusedDesc": "প্রতিটি ডিজাইন সিদ্ধান্ত আপনার ব্র্যান্ডের অনন্য পরিচয় এবং লক্ষ্যগুলিকে পরিবেশন করে।",
    "about.values.zeroToImpact": "শূন্য থেকে প্রভাব",
    "about.values.zeroToImpactDesc": "আমরা শূন্য থেকে শুরু করি এবং শক্তিশালী, প্রভাবশালী ভিজ্যুয়াল আইডেন্টিটি তৈরি করি।",
    "about.values.globalReach": "বৈশ্বিক পরিধি",
    "about.values.globalReachDesc": "বাংলাদেশে অবস্থিত, বিশ্বব্যাপী ডিজাইন সমাধান প্রদান করছি।",
    "about.location.title": "বাংলাদেশে অবস্থিত",
    "about.location.address": "বর্ণালী, রাজশাহী, বাংলাদেশ – ৬০০০",
    "about.location.desc": "বিশ্বব্যাপী ক্লায়েন্টদের সাথে কাজ করছি, দূর থেকে প্রভাবশালী ডিজাইন সমাধান প্রদান করছি।",
    "about.location.cta1": "যোগাযোগ করুন",
    "about.location.cta2": "হোয়াটসঅ্যাপ করুন",
    
    // Team Page
    "team.subtitle": "আমাদের টিম",
    "team.title": "পরিচয় হোক",
    "team.title2": "নির্মাতাদের",
    "team.description": "ডিজাইনার এবং ডেভেলপারদের একটি উৎসাহী দল আপনার দৃষ্টিভঙ্গিকে জীবন্ত করতে নিবেদিত।",
    "team.join.title": "আমাদের টিমে যোগ দিতে চান?",
    "team.join.desc": "আমরা সবসময় প্রতিভাবান ব্যক্তিদের খুঁজছি আমাদের ক্রিয়েটিভ পরিবারে যোগ দিতে।",
    "team.join.cta1": "আবেদন করুন",
    "team.join.cta2": "যোগাযোগ করুন",
    
    // Footer
    "footer.description": "আলফাজিরো একটি ক্রিয়েটিভ ডিজাইন এজেন্সি যা আধুনিক ভিজ্যুয়াল আইডেন্টিটি এবং ব্র্যান্ড অভিজ্ঞতা তৈরি করে। শূন্য থেকে প্রভাব।",
    "footer.quickLinks": "দ্রুত লিংক",
    "footer.contact": "যোগাযোগ",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    
    // Common
    "common.learnMore": "আরও জানুন",
    "common.viewAll": "সব দেখুন",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
