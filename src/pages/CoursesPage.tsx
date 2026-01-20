import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Monitor, 
  Palette, 
  Video, 
  Camera, 
  TrendingUp, 
  Code, 
  Sparkles, 
  Bot, 
  Globe,
  CheckCircle2,
  User,
  Phone,
  Mail,
  BookOpen,
  CreditCard,
  Send,
  Star,
  Zap,
  Target,
  Award,
  Clock,
  Wrench,
  Lock,
  Loader2,
  LucideIcon
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { Course } from "@/types/lms";

// Trainers based on existing team members with images
const trainers = {
  sofiullah: {
    name: "Sofiullah Ahammad",
    qualificationEn: "Graphics Designer, Vibe Coding Expert, Google Knowledge Expert, Freelance Photographer",
    qualificationBn: "গ্রাফিক্স ডিজাইনার, ভাইব কোডিং এক্সপার্ট, গুগল নলেজ এক্সপার্ট, ফ্রিল্যান্স ফটোগ্রাফার",
    image: "https://github.com/Atik119120/Sofiullah-Ahammad/blob/main/537405745_1227380375810727_5014246075421698846_n.jpg?raw=true"
  },
  adib: {
    name: "Adib Sarkar",
    qualificationEn: "Lead Designer, Entrepreneur",
    qualificationBn: "লিড ডিজাইনার, উদ্যোক্তা",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/20260114_092617.jpg?raw=true"
  },
  kamrul: {
    name: "Md. Kamrul Hasan",
    qualificationEn: "Microsoft Office Expert, Graphics Designer",
    qualificationBn: "মাইক্রোসফট অফিস এক্সপার্ট, গ্রাফিক্স ডিজাইনার",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/527331453_2607182776321491_4396943466664849166_n.jpg?raw=true"
  },
  shafiul: {
    name: "Md. Shafiul Haque",
    qualificationEn: "Web Designer, Video Editor, Cinematographer",
    qualificationBn: "ওয়েব ডিজাইনার, ভিডিও এডিটর, সিনেমাটোগ্রাফার",
    image: "https://github.com/Atik119120/alphazero-blueprint/blob/main/FB_IMG_1749736012792.jpg?raw=true"
  },
  prantik: {
    name: "Prantik Saha",
    qualificationEn: "Graphics Designer, Microsoft Office Expert, IT Support",
    qualificationBn: "গ্রাফিক্স ডিজাইনার, মাইক্রোসফট অফিস এক্সপার্ট, আইটি সাপোর্ট",
    image: "https://github.com/Atik119120/sfdvgvsdfzgvz/blob/main/bac0fdd4-96e3-44d6-b020-416e0fee72b3.jpg?raw=true"
  }
};

// Hardcoded fallback courses with all original information
interface FallbackCourse {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  price: number;
}

const fallbackCourses: FallbackCourse[] = [
  {
    id: "google-knowledge",
    title: "Google Knowledge Panel Creation",
    titleBn: "গুগল নলেজ প্যানেল ক্রিয়েশন",
    description: "Learn how to create verified Google Knowledge Panels for brands and individuals. Build your digital presence on Google.",
    descriptionBn: "গুগলে ব্র্যান্ড/ব্যক্তিগত প্রোফাইলের নলেজ প্যানেল তৈরি শিখুন। আপনার ডিজিটাল উপস্থিতি গড়ে তুলুন।",
    price: 3000
  },
  {
    id: "microsoft-office",
    title: "Microsoft Office (Word, Excel, PowerPoint)",
    titleBn: "মাইক্রোসফট অফিস (Word, Excel, PowerPoint)",
    description: "Master complete MS Office skills for office work. Become proficient in Word, Excel, and PowerPoint.",
    descriptionBn: "অফিস কাজের জন্য সম্পূর্ণ MS Office দক্ষতা অর্জন করুন। Word, Excel, PowerPoint-এ পারদর্শী হন।",
    price: 2000
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    titleBn: "গ্রাফিক ডিজাইন",
    description: "Learn professional graphic design with Adobe Photoshop and Illustrator. Create logos, branding, and social media designs.",
    descriptionBn: "Adobe Photoshop ও Illustrator দিয়ে প্রফেশনাল গ্রাফিক ডিজাইন শিখুন। লোগো, ব্র্যান্ডিং ও সোশ্যাল মিডিয়া ডিজাইন তৈরি করুন।",
    price: 4000
  },
  {
    id: "video-editing",
    title: "Video Editing",
    titleBn: "ভিডিও এডিটিং",
    description: "Master video editing with Adobe Premiere Pro. Learn color grading, sound design, and create social media videos.",
    descriptionBn: "Adobe Premiere Pro দিয়ে ভিডিও এডিটিং মাস্টার করুন। কালার গ্রেডিং, সাউন্ড ডিজাইন ও সোশ্যাল মিডিয়া ভিডিও তৈরি করুন।",
    price: 4500
  },
  {
    id: "photography",
    title: "Photography",
    titleBn: "ফটোগ্রাফি",
    description: "Learn camera basics, lighting techniques, photo editing and build your professional portfolio.",
    descriptionBn: "ক্যামেরা বেসিক, লাইটিং টেকনিক, ফটো এডিটিং শিখুন এবং প্রফেশনাল পোর্টফোলিও তৈরি করুন।",
    price: 2500
  },
  {
    id: "seo-marketing",
    title: "SEO & Digital Marketing",
    titleBn: "SEO ও ডিজিটাল মার্কেটিং",
    description: "Learn on-page & off-page SEO, Google Ads, Facebook & Instagram marketing, analytics and reporting.",
    descriptionBn: "অন-পেজ ও অফ-পেজ SEO, গুগল অ্যাডস, ফেসবুক ও ইনস্টাগ্রাম মার্কেটিং, এনালিটিক্স ও রিপোর্টিং শিখুন।",
    price: 4000
  },
  {
    id: "web-coding",
    title: "Web Coding (HTML, CSS, JavaScript)",
    titleBn: "ওয়েব কোডিং (HTML, CSS, JavaScript)",
    description: "Learn HTML5 fundamentals, CSS3 & Flexbox, JavaScript basics and responsive web design.",
    descriptionBn: "HTML5 ফান্ডামেন্টালস, CSS3 ও Flexbox, JavaScript বেসিক এবং রেস্পন্সিভ ওয়েব ডিজাইন শিখুন।",
    price: 5000
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics (After Effects)",
    titleBn: "মোশন গ্রাফিক্স (After Effects)",
    description: "Learn After Effects basics, keyframe animation, text animation and visual effects.",
    descriptionBn: "After Effects বেসিক, কীফ্রেম অ্যানিমেশন, টেক্সট অ্যানিমেশন এবং ভিজ্যুয়াল ইফেক্টস শিখুন।",
    price: 5500
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding (AI Website Builder)",
    titleBn: "ভাইব কোডিং (AI দিয়ে ওয়েবসাইট তৈরি)",
    description: "Create complete websites without coding using AI tools. Learn prompt to design workflow.",
    descriptionBn: "কোডিং না জেনে AI টুলস দিয়ে সম্পূর্ণ ওয়েবসাইট তৈরি করুন। প্রম্পট থেকে ডিজাইন ওয়ার্কফ্লো শিখুন।",
    price: 4500
  },
  {
    id: "ai-prompt",
    title: "AI Prompt Engineering",
    titleBn: "AI প্রম্পট ইঞ্জিনিয়ারিং",
    description: "Learn to write effective prompts for AI tools. Master ChatGPT, Claude, Midjourney and more.",
    descriptionBn: "AI টুলসের জন্য ইফেক্টিভ প্রম্পট লেখা শিখুন। ChatGPT, Claude, Midjourney মাস্টার করুন।",
    price: 3500
  },
  {
    id: "it-support",
    title: "IT Support",
    titleBn: "আইটি সাপোর্ট",
    description: "Learn computer troubleshooting, network setup, hardware maintenance and software installation.",
    descriptionBn: "কম্পিউটার ট্রাবলশুটিং, নেটওয়ার্ক সেটআপ, হার্ডওয়্যার মেইনটেন্যান্স এবং সফটওয়্যার ইনস্টলেশন শিখুন।",
    price: 3000
  }
];

// Course metadata mapping (for rich UI display)
interface CourseMetadata {
  icon: LucideIcon;
  color: string;
  trainer: typeof trainers.sofiullah | null;
  featuresBn: string[];
  featuresEn: string[];
  isSpecial?: boolean;
  isUpcoming?: boolean;
  specialContentBn?: { title: string; points: string[] };
  specialContentEn?: { title: string; points: string[] };
}

// Default metadata for courses based on keywords
const getCourseMetadata = (title: string): CourseMetadata => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('google') || lowerTitle.includes('knowledge')) {
    return {
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      trainer: trainers.sofiullah,
      featuresBn: ["গুগল সার্চ অপ্টিমাইজেশন", "ব্র্যান্ড ভেরিফিকেশন", "উইকিপিডিয়া এন্ট্রি গাইড", "সোশ্যাল প্রোফাইল সেটআপ"],
      featuresEn: ["Google Search Optimization", "Brand Verification", "Wikipedia Entry Guide", "Social Profile Setup"]
    };
  }
  
  if (lowerTitle.includes('microsoft') || lowerTitle.includes('office')) {
    return {
      icon: Monitor,
      color: "from-orange-500 to-red-500",
      trainer: trainers.kamrul,
      featuresBn: ["MS Word মাস্টারি", "Excel ফর্মুলা ও ডাটা এনালাইসিস", "PowerPoint প্রেজেন্টেশন", "অফিস অটোমেশন"],
      featuresEn: ["MS Word Mastery", "Excel Formulas & Data Analysis", "PowerPoint Presentations", "Office Automation"]
    };
  }
  
  if (lowerTitle.includes('graphic') || lowerTitle.includes('গ্রাফিক')) {
    return {
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      trainer: trainers.adib,
      featuresBn: ["Adobe Photoshop", "Adobe Illustrator", "লোগো ও ব্র্যান্ডিং", "সোশ্যাল মিডিয়া ডিজাইন"],
      featuresEn: ["Adobe Photoshop", "Adobe Illustrator", "Logo & Branding", "Social Media Design"]
    };
  }
  
  if (lowerTitle.includes('video') || lowerTitle.includes('ভিডিও')) {
    return {
      icon: Video,
      color: "from-red-500 to-orange-500",
      trainer: trainers.shafiul,
      featuresBn: ["Adobe Premiere Pro", "কালার গ্রেডিং", "সাউন্ড ডিজাইন", "সোশ্যাল মিডিয়া ভিডিও"],
      featuresEn: ["Adobe Premiere Pro", "Color Grading", "Sound Design", "Social Media Videos"]
    };
  }
  
  if (lowerTitle.includes('photo') || lowerTitle.includes('ফটো')) {
    return {
      icon: Camera,
      color: "from-amber-500 to-yellow-500",
      trainer: trainers.sofiullah,
      featuresBn: ["ক্যামেরা বেসিক", "লাইটিং টেকনিক", "ফটো এডিটিং", "পোর্টফোলিও বিল্ডিং"],
      featuresEn: ["Camera Basics", "Lighting Techniques", "Photo Editing", "Portfolio Building"]
    };
  }
  
  if (lowerTitle.includes('seo') || lowerTitle.includes('marketing')) {
    return {
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      trainer: trainers.sofiullah,
      featuresBn: ["অন-পেজ ও অফ-পেজ SEO", "গুগল অ্যাডস", "ফেসবুক ও ইনস্টাগ্রাম মার্কেটিং", "এনালিটিক্স ও রিপোর্টিং"],
      featuresEn: ["On-Page & Off-Page SEO", "Google Ads", "Facebook & Instagram Marketing", "Analytics & Reporting"],
      isUpcoming: true
    };
  }
  
  if (lowerTitle.includes('web') && (lowerTitle.includes('coding') || lowerTitle.includes('html'))) {
    return {
      icon: Code,
      color: "from-cyan-500 to-blue-500",
      trainer: null,
      featuresBn: ["HTML5 ফান্ডামেন্টালস", "CSS3 ও Flexbox", "JavaScript বেসিক", "রেস্পন্সিভ ডিজাইন"],
      featuresEn: ["HTML5 Fundamentals", "CSS3 & Flexbox", "JavaScript Basics", "Responsive Design"],
      isUpcoming: true,
      isSpecial: true,
      specialContentBn: {
        title: "ওয়েব কোডিং কেন শিখবেন?",
        points: ["নিজের হাতে প্রফেশনাল ওয়েবসাইট বানান", "ফ্রিল্যান্সিং ও জব মার্কেটে সবচেয়ে চাহিদাসম্পন্ন স্কিল", "ওয়েব ডেভেলপার হিসেবে ক্যারিয়ার শুরু করুন"]
      },
      specialContentEn: {
        title: "Why Learn Web Coding?",
        points: ["Build professional websites with your own hands", "Most in-demand skill in freelancing & job market", "Start your career as a web developer"]
      }
    };
  }
  
  if (lowerTitle.includes('motion') || lowerTitle.includes('after effects')) {
    return {
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
      trainer: trainers.shafiul,
      featuresBn: ["After Effects বেসিক", "কীফ্রেম অ্যানিমেশন", "টেক্সট অ্যানিমেশন", "ভিজ্যুয়াল ইফেক্টস"],
      featuresEn: ["After Effects Basics", "Keyframe Animation", "Text Animation", "Visual Effects"],
      isSpecial: true,
      specialContentBn: {
        title: "মোশন গ্রাফিক্স কেন শিখবেন?",
        points: ["YouTube, Facebook, TikTok-এর জন্য প্রো-লেভেল ভিডিও বানান", "ব্র্যান্ডের জন্য লোগো অ্যানিমেশন ও ইন্ট্রো তৈরি করুন", "ফ্রিল্যান্সিং ও জব মার্কেটে হাই-ডিমান্ড স্কিল"]
      },
      specialContentEn: {
        title: "Why Learn Motion Graphics?",
        points: ["Create pro-level videos for YouTube, Facebook, TikTok", "Make logo animations & intros for brands", "High-demand skill in freelancing & job market"]
      }
    };
  }
  
  if (lowerTitle.includes('vibe') || lowerTitle.includes('ভাইব')) {
    return {
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      trainer: trainers.sofiullah,
      featuresBn: ["AI ওয়েবসাইট বিল্ডার", "প্রম্পট টু ডিজাইন", "নো-কোড ডেভেলপমেন্ট", "হোস্টিং ও পাবলিশিং"],
      featuresEn: ["AI Website Builder", "Prompt to Design", "No-Code Development", "Hosting & Publishing"],
      isSpecial: true,
      specialContentBn: {
        title: "ভাইব কোডিং কি?",
        points: ["কোডিং না জেনেও সম্পূর্ণ ওয়েবসাইট তৈরি করুন", "AI টুলস ব্যবহার করে HTML, CSS, ডিজাইন জেনারেট করুন", "আইডিয়া → প্রম্পট → ওয়েবসাইট - এই সিম্পল ওয়ার্কফ্লো শিখুন"]
      },
      specialContentEn: {
        title: "What is Vibe Coding?",
        points: ["Create complete websites without knowing coding", "Generate HTML, CSS, design using AI tools", "Learn the simple workflow: Idea → Prompt → Website"]
      }
    };
  }
  
  if (lowerTitle.includes('ai') || lowerTitle.includes('prompt')) {
    return {
      icon: Bot,
      color: "from-indigo-500 to-blue-500",
      trainer: trainers.sofiullah,
      featuresBn: ["প্রম্পট স্ট্রাকচার", "রোল প্রম্পটিং", "টাস্ক-বেজড প্রম্পট", "AI অটোমেশন"],
      featuresEn: ["Prompt Structure", "Role Prompting", "Task-Based Prompts", "AI Automation"],
      isSpecial: true,
      specialContentBn: {
        title: "AI প্রম্পট ইঞ্জিনিয়ারিং কি শেখায়?",
        points: ["AI টুলসের জন্য ইফেক্টিভ প্রম্পট লেখা শিখুন", "ডিজাইন, কোডিং, মার্কেটিং, কন্টেন্টে AI ব্যবহার", "ChatGPT, Claude, Midjourney সব AI মাস্টার করুন"]
      },
      specialContentEn: {
        title: "What does AI Prompt Engineering teach?",
        points: ["Learn to write effective prompts for AI tools", "Use AI for design, coding, marketing, content", "Master all AI tools: ChatGPT, Claude, Midjourney"]
      }
    };
  }
  
  if (lowerTitle.includes('it') || lowerTitle.includes('support') || lowerTitle.includes('সাপোর্ট')) {
    return {
      icon: Wrench,
      color: "from-slate-500 to-zinc-600",
      trainer: trainers.prantik,
      featuresBn: ["কম্পিউটার ট্রাবলশুটিং", "নেটওয়ার্ক সেটআপ", "হার্ডওয়্যার মেইনটেন্যান্স", "সফটওয়্যার ইনস্টলেশন"],
      featuresEn: ["Computer Troubleshooting", "Network Setup", "Hardware Maintenance", "Software Installation"],
      isSpecial: true,
      specialContentBn: {
        title: "আইটি সাপোর্ট কেন শিখবেন?",
        points: ["যেকোনো অফিস বা প্রতিষ্ঠানে IT সাপোর্ট জব পান", "নিজের কম্পিউটার ও নেটওয়ার্ক সমস্যা সমাধান করুন", "ফ্রিল্যান্স টেক সাপোর্ট সার্ভিস দিন"]
      },
      specialContentEn: {
        title: "Why Learn IT Support?",
        points: ["Get IT support jobs in any office or organization", "Solve your own computer & network problems", "Provide freelance tech support services"]
      }
    };
  }
  
  // Default metadata
  return {
    icon: BookOpen,
    color: "from-primary to-purple-500",
    trainer: null,
    featuresBn: ["অনলাইন ক্লাস", "সার্টিফিকেট", "লাইফটাইম অ্যাক্সেস", "সাপোর্ট"],
    featuresEn: ["Online Classes", "Certificate", "Lifetime Access", "Support"]
  };
};

// Translations
const translations = {
  en: {
    badge: "100% Online-Based Courses",
    title: "Alpha Academy",
    subtitle: "Learn practical, job-ready and AI-powered skills. Build websites, brands and digital careers without deep technical knowledge.",
    beginnerFriendly: "Beginner-Friendly",
    certificate: "Certificate Provided",
    expertTrainer: "Expert Trainers",
    aboutTitle: "About",
    aboutDesc: "Alpha Academy teaches practical, job-ready and AI-powered skills so students can build websites, brands, and digital careers without needing deep technical knowledge. All courses are 100% online-based, designed for beginners and affordable for Bangladesh market.",
    ourCourses: "Our",
    coursesTitle: "Courses",
    coursesSubtitle: "Professional Online Courses - Start Your Career Today",
    special: "Special",
    upcoming: "Coming Soon",
    trainer: "Trainer",
    courseFee: "Course Fee",
    enrollNow: "Enroll Now",
    admissionForm: "Online",
    admissionTitle: "Admission Form",
    admissionDesc: "Enroll in your preferred course now - Easy online process",
    fullName: "Student Full Name",
    namePlaceholder: "Enter your name",
    mobileNumber: "Mobile Number",
    email: "Email",
    selectCourse: "Select Course",
    coursePlaceholder: "Select a course",
    paymentOption: "Payment Option",
    paymentPlaceholder: "Select payment option",
    fullPayment: "Full Payment (One-time)",
    installment: "Installment (2 payments)",
    submitButton: "Enroll Online – Alpha Academy",
    processing: "Processing...",
    startCareer: "Start Your Digital Career",
    startToday: "Today",
    ctaSubtitle: "100% Online Courses • Beginner-Friendly • Certificate Provided • Expert Trainers",
    enrollButton: "Enroll Now",
    whatsappContact: "WhatsApp Contact",
    fillAll: "Please fill all fields",
    success: "Your enrollment has been submitted successfully! We will contact you soon.",
    noCourses: "No courses available yet",
    noCoursesDesc: "Please check back later for new courses.",
    loading: "Loading courses..."
  },
  bn: {
    badge: "১০০% অনলাইন-ভিত্তিক কোর্স",
    title: "Alpha Academy",
    subtitle: "প্র্যাক্টিক্যাল, জব-রেডি ও AI-পাওয়ার্ড স্কিল শিখুন। কোনো টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড ও ডিজিটাল ক্যারিয়ার গড়ুন।",
    beginnerFriendly: "বিগিনার-ফ্রেন্ডলি",
    certificate: "সার্টিফিকেট প্রদান",
    expertTrainer: "এক্সপার্ট ট্রেইনার",
    aboutTitle: "সম্পর্কে",
    aboutDesc: "Alpha Academy প্র্যাক্টিক্যাল, জব-রেডি এবং AI-পাওয়ার্ড স্কিল শেখায় যাতে শিক্ষার্থীরা গভীর টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড এবং ডিজিটাল ক্যারিয়ার গড়ে তুলতে পারে। আমাদের সব কোর্স ১০০% অনলাইন-ভিত্তিক, বিগিনার ও আধুনিক শিক্ষার্থীদের জন্য ডিজাইন করা এবং বাংলাদেশের বাজারের জন্য সাশ্রয়ী মূল্যে।",
    ourCourses: "আমাদের",
    coursesTitle: "কোর্সসমূহ",
    coursesSubtitle: "প্রফেশনাল অনলাইন কোর্স - আপনার ক্যারিয়ার শুরু করুন আজই",
    special: "স্পেশাল",
    upcoming: "আসছে শীঘ্রই",
    trainer: "ট্রেইনার",
    courseFee: "কোর্স ফি",
    enrollNow: "এখনই ভর্তি হন",
    admissionForm: "অনলাইন",
    admissionTitle: "ভর্তি ফর্ম",
    admissionDesc: "আপনার পছন্দের কোর্সে এখনই ভর্তি হন - সহজ অনলাইন প্রক্রিয়া",
    fullName: "শিক্ষার্থীর পূর্ণ নাম",
    namePlaceholder: "আপনার নাম লিখুন",
    mobileNumber: "মোবাইল নম্বর",
    email: "ইমেইল",
    selectCourse: "কোর্স নির্বাচন করুন",
    coursePlaceholder: "কোর্স সিলেক্ট করুন",
    paymentOption: "পেমেন্ট অপশন",
    paymentPlaceholder: "পেমেন্ট অপশন সিলেক্ট করুন",
    fullPayment: "সম্পূর্ণ পেমেন্ট (একবারে)",
    installment: "কিস্তিতে পেমেন্ট (২ কিস্তি)",
    submitButton: "Enroll Online – Alpha Academy",
    processing: "প্রসেস হচ্ছে...",
    startCareer: "আপনার ডিজিটাল ক্যারিয়ার",
    startToday: "শুরু করুন আজই",
    ctaSubtitle: "১০০% অনলাইন কোর্স • বিগিনার-ফ্রেন্ডলি • সার্টিফিকেট প্রদান • এক্সপার্ট ট্রেইনার",
    enrollButton: "এখনই ভর্তি হন",
    whatsappContact: "WhatsApp-এ যোগাযোগ",
    fillAll: "সব ফিল্ড পূরণ করুন",
    success: "আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।",
    noCourses: "এখনো কোনো কোর্স নেই",
    noCoursesDesc: "নতুন কোর্সের জন্য পরে আবার দেখুন।",
    loading: "কোর্স লোড হচ্ছে..."
  }
};

const CoursesPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isBn = language === "bn";

  // Fetch published courses from database
  const { courses: dbCourses, isLoading: coursesLoading } = usePublicCourses();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    course: "",
    paymentType: "",
    paymentMethod: "",
    transactionId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use database courses - all courses are now in the database
  const displayCourses = useMemo(() => {
    return dbCourses.map(course => ({
      id: course.id,
      title: course.title,
      titleBn: course.title,
      description: course.description || '',
      descriptionBn: course.description || '',
      price: course.price || 0
    }));
  }, [dbCourses]);

  const selectedCourse = useMemo(() => {
    return displayCourses.find(c => c.id === formData.course);
  }, [formData.course, displayCourses]);

  const selectedCourseMetadata = useMemo(() => {
    if (!selectedCourse) return null;
    return getCourseMetadata(selectedCourse.title);
  }, [selectedCourse]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.email || !formData.password || !formData.course || !formData.paymentType || !formData.paymentMethod || !formData.transactionId) {
      toast.error(t.fillAll);
      return;
    }

    if (formData.password.length < 6) {
      toast.error(isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: studentData, error: studentError } = await supabase.functions.invoke('create-student', {
        body: {
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
        }
      });

      if (studentError) {
        console.error('Student creation error:', studentError);
        toast.error(isBn ? "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" : "Failed to create account");
        setIsSubmitting(false);
        return;
      }

      if (studentData?.user?.id && selectedCourse) {
        const { error: enrollmentError } = await supabase.from('enrollment_requests').insert({
          user_id: studentData.user.id,
          course_id: selectedCourse.id,
          student_name: formData.name,
          student_email: formData.email,
          phone_number: formData.mobile,
          payment_method: formData.paymentMethod,
          transaction_id: formData.transactionId,
          message: `Payment Type: ${formData.paymentType}`,
          status: 'pending',
        });

        if (enrollmentError) {
          console.error('Enrollment request error:', enrollmentError);
          // Still show success since account was created, admin will see the student
        }
      }
      
      toast.success(t.success);
      setFormData({ name: "", mobile: "", email: "", password: "", course: "", paymentType: "", paymentMethod: "", transactionId: "" });
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(isBn ? "কিছু সমস্যা হয়েছে" : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">{t.badge}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-7xl font-display font-bold mb-6"
            >
              <span className="gradient-text">{t.title}</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              {t.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm">{t.beginnerFriendly}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm">{t.certificate}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm">{t.expertTrainer}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Alpha Academy */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              Alpha Academy <span className="gradient-text">{t.aboutTitle}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.aboutDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20" id="courses">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {t.ourCourses} <span className="gradient-text">{t.coursesTitle}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.coursesSubtitle}
            </p>
          </motion.div>

          {/* Loading State */}
          {coursesLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">{t.loading}</p>
            </div>
          )}

          {/* Courses Grid - Always show with fallback */}
          {!coursesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
              {displayCourses.map((course, index) => {
                const metadata = getCourseMetadata(course.title);
                const CourseIcon = metadata.icon;
                
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group h-full"
                  >
                    <div className={`relative h-full flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden ${metadata.isSpecial ? 'ring-2 ring-primary/50' : ''} ${metadata.isUpcoming ? 'ring-2 ring-amber-500/50' : ''}`}>
                      {/* Gradient Background Header */}
                      <div className={`relative h-28 sm:h-36 bg-gradient-to-br ${metadata.color} p-4 sm:p-6`}>
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/30 rounded-full" />
                          <div className="absolute bottom-2 left-4 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-2 border-white/20 rounded-lg rotate-12" />
                        </div>
                        
                        {/* Special Badge */}
                        {metadata.isSpecial && (
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {t.special}
                          </div>
                        )}

                        {/* Upcoming Badge */}
                        {metadata.isUpcoming && (
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t.upcoming}
                          </div>
                        )}
                        
                        {/* Icon */}
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <CourseIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex-1 flex flex-col bg-card border border-border border-t-0 rounded-b-2xl sm:rounded-b-3xl p-4 sm:p-6">
                        {/* Course Name & Price Row */}
                        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                          <h3 className="text-base sm:text-lg font-display font-bold leading-tight">
                            {isBn ? course.titleBn : course.title}
                          </h3>
                          {course.price > 0 && (
                            <div className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                              <span className="text-sm sm:text-base font-bold text-primary">৳{course.price.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                          {isBn ? course.descriptionBn : course.description}
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {(isBn ? metadata.featuresBn : metadata.featuresEn).slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs bg-secondary/50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5">
                              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground truncate">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Special Content */}
                        {metadata.isSpecial && metadata.specialContentBn && metadata.specialContentEn && (
                          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
                            <h4 className="font-semibold text-primary text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1">
                              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                              {isBn ? metadata.specialContentBn.title : metadata.specialContentEn.title}
                            </h4>
                            <ul className="space-y-0.5 sm:space-y-1">
                              {(isBn ? metadata.specialContentBn.points : metadata.specialContentEn.points).slice(0, 3).map((point, idx) => (
                                <li key={idx} className="text-[10px] sm:text-xs text-muted-foreground flex items-start gap-1 sm:gap-1.5">
                                  <span className="text-primary mt-0.5">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Trainer with Photo */}
                        {metadata.trainer && (
                          <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-secondary/30 border border-border mb-3 sm:mb-4 mt-auto">
                            <img
                              src={metadata.trainer.image}
                              alt={metadata.trainer.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary/30"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs text-muted-foreground">{t.trainer}</p>
                              <p className="text-xs sm:text-sm font-semibold truncate">{metadata.trainer.name}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {isBn ? metadata.trainer.qualificationBn : metadata.trainer.qualificationEn}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Spacer if no trainer */}
                        {!metadata.trainer && <div className="flex-1" />}

                        {/* Enroll Button */}
                        <a
                          href="#admission"
                          onClick={() => handleInputChange("course", course.id)}
                          className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
                            metadata.isUpcoming 
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-not-allowed'
                              : metadata.isSpecial 
                                ? 'bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]' 
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
                          }`}
                        >
                          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {metadata.isUpcoming ? t.upcoming : t.enrollNow}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Online Admission Form */}
      <section className="py-20 bg-secondary/30" id="admission">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                {t.admissionForm} <span className="gradient-text">{t.admissionTitle}</span>
              </h2>
              <p className="text-muted-foreground">
                {t.admissionDesc}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {t.fullName}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t.mobileNumber}
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    {isBn ? "পাসওয়ার্ড" : "Password"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isBn ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Course Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {t.selectCourse}
                  </Label>
                  <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.coursePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {displayCourses.filter(c => !getCourseMetadata(c.title).isUpcoming).map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {isBn ? course.titleBn : course.title} {course.price ? `- ৳${course.price.toLocaleString()}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trainer Info (Auto-filled) */}
                {selectedCourse && selectedCourseMetadata?.trainer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedCourseMetadata.trainer.image}
                        alt={selectedCourseMetadata.trainer.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.trainer}</p>
                        <p className="text-sm font-semibold">{selectedCourseMetadata.trainer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isBn ? selectedCourseMetadata.trainer.qualificationBn : selectedCourseMetadata.trainer.qualificationEn}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Payment Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    {t.paymentOption}
                  </Label>
                  <Select value={formData.paymentType} onValueChange={(value) => handleInputChange("paymentType", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.paymentPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">{t.fullPayment}</SelectItem>
                      <SelectItem value="installment">{t.installment}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method (bKash/Nagad) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    {isBn ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={isBn ? "পেমেন্ট মাধ্যম সিলেক্ট করুন" : "Select payment method"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bkash">বিকাশ (bKash)</SelectItem>
                      <SelectItem value="nagad">নগদ (Nagad)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Instructions */}
                {formData.paymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                  >
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      {isBn ? "পেমেন্ট নির্দেশনা:" : "Payment Instructions:"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.paymentMethod === 'bkash' 
                        ? (isBn ? "বিকাশ নাম্বার: 01776965533 - এই নাম্বারে টাকা পাঠান" : "bKash Number: 01776965533 - Send money to this number")
                        : (isBn ? "নগদ নাম্বার: 01776965533 - এই নাম্বারে টাকা পাঠান" : "Nagad Number: 01776965533 - Send money to this number")
                      }
                    </p>
                    {selectedCourse && (
                      <p className="text-sm font-bold text-primary mt-2">
                        {isBn ? `পাঠাতে হবে: ৳${selectedCourse.price.toLocaleString()}` : `Amount: ৳${selectedCourse.price.toLocaleString()}`}
                        {formData.paymentType === 'installment' && (
                          <span className="text-muted-foreground font-normal">
                            {isBn ? ` (প্রথম কিস্তি: ৳${Math.ceil(selectedCourse.price / 2).toLocaleString()})` : ` (First installment: ৳${Math.ceil(selectedCourse.price / 2).toLocaleString()})`}
                          </span>
                        )}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Transaction ID */}
                {formData.paymentMethod && (
                  <div className="space-y-2">
                    <Label htmlFor="transactionId" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      {isBn ? "ট্রানজেকশন আইডি" : "Transaction ID"}
                    </Label>
                    <Input
                      id="transactionId"
                      placeholder={isBn ? "যেমন: 8N7X9K2M5P" : "e.g., 8N7X9K2M5P"}
                      value={formData.transactionId}
                      onChange={(e) => handleInputChange("transactionId", e.target.value)}
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">
                      {isBn ? "টাকা পাঠানোর পর যে ট্রানজেকশন আইডি পাবেন সেটি এখানে দিন" : "Enter the transaction ID you received after sending money"}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                  disabled={isSubmitting || coursesLoading}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t.processing}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {t.submitButton}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              {t.startCareer} <span className="gradient-text">{t.startToday}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#admission"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                <GraduationCap className="w-5 h-5" />
                {t.enrollButton}
              </a>
              <a
                href="https://wa.me/+8801776965533"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                {t.whatsappContact}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;
