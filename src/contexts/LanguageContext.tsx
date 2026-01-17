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
    
    // Home Hero
    "home.hero.subtitle": "Creative Agency",
    "home.hero.title1": "We Design",
    "home.hero.title2": "Brands That",
    "home.hero.title3": "Stand Out",
    "home.hero.description": "AlphaZero is a creative agency focused on graphic design, branding, and visual identity. We help brands start from scratch and grow with clean, modern, and impactful design solutions.",
    "home.hero.cta1": "Start a Project",
    "home.hero.cta2": "View Our Work",
    
    // About
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
    
    // Team
    "team.subtitle": "Our Team",
    "team.title": "Meet the",
    "team.title2": "Creators",
    "team.description": "A passionate team of designers and developers dedicated to bringing your vision to life.",
    "team.join.title": "Want to join our team?",
    "team.join.desc": "We're always looking for talented individuals to join our creative family.",
    "team.join.cta1": "Apply Now",
    "team.join.cta2": "Contact Us",
    
    // Services
    "services.subtitle": "What We Do",
    "services.title": "Our",
    "services.title2": "Services",
    "services.description": "From stunning graphics to complete brand identities, we offer comprehensive design solutions that help your business stand out.",
    
    // Contact
    "contact.subtitle": "Get In Touch",
    "contact.title": "Let's Create Something",
    "contact.title2": "Amazing",
    "contact.description": "Ready to bring your vision to life? We're here to help you create something truly special.",
    
    // Footer
    "footer.description": "Creative agency focused on graphic design, branding, and visual identity. We help brands start from scratch and grow.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Services",
    "footer.connect": "Connect",
    "footer.rights": "All rights reserved.",
    
    // Common
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",
    "common.submit": "Submit",
    "common.loading": "Loading...",
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
    
    // Home Hero
    "home.hero.subtitle": "ক্রিয়েটিভ এজেন্সি",
    "home.hero.title1": "আমরা ডিজাইন করি",
    "home.hero.title2": "এমন ব্র্যান্ড যা",
    "home.hero.title3": "আলাদা",
    "home.hero.description": "আলফাজিরো একটি ক্রিয়েটিভ এজেন্সি যা গ্রাফিক ডিজাইন, ব্র্যান্ডিং এবং ভিজ্যুয়াল আইডেন্টিটিতে বিশেষজ্ঞ। আমরা ব্র্যান্ডগুলিকে শূন্য থেকে শুরু করে পরিষ্কার, আধুনিক এবং প্রভাবশালী ডিজাইন সলিউশন দিয়ে বৃদ্ধি করতে সাহায্য করি।",
    "home.hero.cta1": "প্রজেক্ট শুরু করুন",
    "home.hero.cta2": "আমাদের কাজ দেখুন",
    
    // About
    "about.subtitle": "আমাদের সম্পর্কে",
    "about.title": "আমরা",
    "about.description": "গ্রাফিক ডিজাইন, ব্র্যান্ডিং এবং ভিজ্যুয়াল আইডেন্টিটিতে বিশেষজ্ঞ একটি ক্রিয়েটিভ এজেন্সি। আমরা ব্র্যান্ডগুলিকে শূন্য থেকে শুরু করে পরিষ্কার, আধুনিক এবং প্রভাবশালী ডিজাইন সলিউশন দিয়ে বৃদ্ধি করতে সাহায্য করি।",
    "about.story.badge": "আমাদের যাত্রা",
    "about.story.title": "দি",
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
    
    // Team
    "team.subtitle": "আমাদের টিম",
    "team.title": "পরিচয় হোক",
    "team.title2": "নির্মাতাদের",
    "team.description": "ডিজাইনার এবং ডেভেলপারদের একটি উৎসাহী দল আপনার দৃষ্টিভঙ্গিকে জীবন্ত করতে নিবেদিত।",
    "team.join.title": "আমাদের টিমে যোগ দিতে চান?",
    "team.join.desc": "আমরা সবসময় প্রতিভাবান ব্যক্তিদের খুঁজছি আমাদের ক্রিয়েটিভ পরিবারে যোগ দিতে।",
    "team.join.cta1": "আবেদন করুন",
    "team.join.cta2": "যোগাযোগ করুন",
    
    // Services
    "services.subtitle": "আমরা যা করি",
    "services.title": "আমাদের",
    "services.title2": "সেবাসমূহ",
    "services.description": "অসাধারণ গ্রাফিক্স থেকে সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি পর্যন্ত, আমরা ব্যাপক ডিজাইন সমাধান অফার করি যা আপনার ব্যবসাকে আলাদা করে তোলে।",
    
    // Contact
    "contact.subtitle": "যোগাযোগ করুন",
    "contact.title": "চলুন তৈরি করি কিছু",
    "contact.title2": "অসাধারণ",
    "contact.description": "আপনার দৃষ্টিভঙ্গিকে জীবন্ত করতে প্রস্তুত? আমরা আপনাকে সত্যিই বিশেষ কিছু তৈরি করতে সাহায্য করতে এখানে আছি।",
    
    // Footer
    "footer.description": "গ্রাফিক ডিজাইন, ব্র্যান্ডিং এবং ভিজ্যুয়াল আইডেন্টিটিতে বিশেষজ্ঞ ক্রিয়েটিভ এজেন্সি। আমরা ব্র্যান্ডগুলিকে শূন্য থেকে শুরু করে বৃদ্ধি করতে সাহায্য করি।",
    "footer.quickLinks": "দ্রুত লিংক",
    "footer.services": "সেবাসমূহ",
    "footer.connect": "যোগাযোগ",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    
    // Common
    "common.learnMore": "আরও জানুন",
    "common.viewAll": "সব দেখুন",
    "common.submit": "জমা দিন",
    "common.loading": "লোড হচ্ছে...",
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
