import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import learnOgImage from "@/assets/learn-og-image.jpg.asset.json";
import coursesHeroBgAssetJson from "@/assets/courses-hero-bg.png.asset.json";
const coursesHeroBg = coursesHeroBgAssetJson.url;
import instructorHH from "@/assets/instructors/hh.png.asset.json";
import instructorNayeem from "@/assets/instructors/nayeem.png.asset.json";
import instructorAtik from "@/assets/instructors/Atik.png.asset.json";
import instructorShafiul from "@/assets/instructors/shafiul.png.asset.json";
import instructorPapiya from "@/assets/instructors/papiya.png.asset.json";
import instructorPrantik from "@/assets/instructors/prantik.png.asset.json";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  GraduationCap, Monitor, Palette, Video, Camera, TrendingUp, Code, Sparkles, Bot, Globe,
  CheckCircle2, BookOpen, Star, Zap, Target, Award, Clock, Wrench, Lock, Loader2, LucideIcon,
  ArrowRight, ArrowLeft, Users, Play
} from "lucide-react";
import Layout from "@/components/Layout";
import learnLogoAssetJson from "@/assets/learn-with-alphazero-logo.png.asset.json";
const learnLogo = learnLogoAssetJson.url;
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { usePageContent } from "@/hooks/usePageContent";
import CourseEnrollmentModal from "@/components/student/CourseEnrollmentModal";
import { Course } from "@/types/lms";

// Trainers based on existing team members with images
const trainers = {
  sofiullah: {
    name: "Sofiullah Ahammad",
    qualificationEn: "Graphics Designer, Vibe Coding Expert",
    qualificationBn: "গ্রাফিক্স ডিজাইনার, ভাইব কোডিং এক্সপার্ট",
    image: instructorAtik.url
  },
  adib: {
    name: "Adib Sarkar",
    qualificationEn: "Lead Designer, Entrepreneur",
    qualificationBn: "লিড ডিজাইনার, উদ্যোক্তা",
    image: instructorHH.url
  },
  nayeem: {
    name: "Md Nayeem Ahmed",
    qualificationEn: "Digital Marketer",
    qualificationBn: "ডিজিটাল মার্কেটার",
    image: instructorNayeem.url
  },
  shafiul: {
    name: "Md. Shafiul Haque",
    qualificationEn: "Video Editor, Cinematographer",
    qualificationBn: "ভিডিও এডিটর, সিনেমাটোগ্রাফার",
    image: instructorShafiul.url
  },
  prantik: {
    name: "Prantik Saha",
    qualificationEn: "Microsoft Office Expert, IT Support",
    qualificationBn: "মাইক্রোসফট অফিস এক্সপার্ট, আইটি সাপোর্ট",
    image: instructorPrantik.url
  },
  papiya: {
    name: "Papiya Rahman",
    qualificationEn: "Graphic Designer",
    qualificationBn: "গ্রাফিক ডিজাইনার",
    image: instructorPapiya.url
  }
};

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

const getCourseMetadata = (title: string): CourseMetadata => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('google') || lowerTitle.includes('knowledge')) {
    return { icon: Globe, color: "from-blue-500 to-cyan-500", trainer: trainers.sofiullah,
      featuresBn: ["গুগল সার্চ অপ্টিমাইজেশন", "ব্র্যান্ড ভেরিফিকেশন", "উইকিপিডিয়া এন্ট্রি গাইড", "সোশ্যাল প্রোফাইল সেটআপ"],
      featuresEn: ["Google Search Optimization", "Brand Verification", "Wikipedia Entry Guide", "Social Profile Setup"] };
  }
  if (lowerTitle.includes('microsoft') || lowerTitle.includes('office')) {
    return { icon: Monitor, color: "from-orange-500 to-red-500", trainer: trainers.prantik,
      featuresBn: ["MS Word মাস্টারি", "Excel ফর্মুলা ও ডাটা এনালাইসিস", "PowerPoint প্রেজেন্টেশন", "অফিস অটোমেশন"],
      featuresEn: ["MS Word Mastery", "Excel Formulas & Data Analysis", "PowerPoint Presentations", "Office Automation"] };
  }
  if (lowerTitle.includes('graphic') || lowerTitle.includes('গ্রাফিক')) {
    return { icon: Palette, color: "from-purple-500 to-pink-500", trainer: trainers.papiya,
      featuresBn: ["Adobe Photoshop", "Adobe Illustrator", "লোগো ও ব্র্যান্ডিং", "সোশ্যাল মিডিয়া ডিজাইন"],
      featuresEn: ["Adobe Photoshop", "Adobe Illustrator", "Logo & Branding", "Social Media Design"] };
  }
  if (lowerTitle.includes('video') || lowerTitle.includes('ভিডিও')) {
    return { icon: Video, color: "from-red-500 to-orange-500", trainer: trainers.shafiul,
      featuresBn: ["Adobe Premiere Pro", "কালার গ্রেডিং", "সাউন্ড ডিজাইন", "সোশ্যাল মিডিয়া ভিডিও"],
      featuresEn: ["Adobe Premiere Pro", "Color Grading", "Sound Design", "Social Media Videos"] };
  }
  if (lowerTitle.includes('photo') || lowerTitle.includes('ফটো')) {
    return { icon: Camera, color: "from-amber-500 to-yellow-500", trainer: trainers.sofiullah,
      featuresBn: ["ক্যামেরা বেসিক", "লাইটিং টেকনিক", "ফটো এডিটিং", "পোর্টফোলিও বিল্ডিং"],
      featuresEn: ["Camera Basics", "Lighting Techniques", "Photo Editing", "Portfolio Building"] };
  }
  if (lowerTitle.includes('seo') || lowerTitle.includes('marketing')) {
    return { icon: TrendingUp, color: "from-green-500 to-emerald-500", trainer: trainers.sofiullah,
      featuresBn: ["অন-পেজ ও অফ-পেজ SEO", "গুগল অ্যাডস", "ফেসবুক ও ইনস্টাগ্রাম মার্কেটিং", "এনালিটিক্স ও রিপোর্টিং"],
      featuresEn: ["On-Page & Off-Page SEO", "Google Ads", "Facebook & Instagram Marketing", "Analytics & Reporting"],
      isUpcoming: true };
  }
  if (lowerTitle.includes('web') && (lowerTitle.includes('coding') || lowerTitle.includes('html'))) {
    return { icon: Code, color: "from-cyan-500 to-blue-500", trainer: null,
      featuresBn: ["HTML5 ফান্ডামেন্টালস", "CSS3 ও Flexbox", "JavaScript বেসিক", "রেস্পন্সিভ ডিজাইন"],
      featuresEn: ["HTML5 Fundamentals", "CSS3 & Flexbox", "JavaScript Basics", "Responsive Design"],
      isUpcoming: true, isSpecial: true,
      specialContentBn: { title: "ওয়েব কোডিং কেন শিখবেন?", points: ["নিজের হাতে প্রফেশনাল ওয়েবসাইট বানান", "ফ্রিল্যান্সিং ও জব মার্কেটে সবচেয়ে চাহিদাসম্পন্ন স্কিল", "ওয়েব ডেভেলপার হিসেবে ক্যারিয়ার শুরু করুন"] },
      specialContentEn: { title: "Why Learn Web Coding?", points: ["Build professional websites with your own hands", "Most in-demand skill in freelancing & job market", "Start your career as a web developer"] } };
  }
  if (lowerTitle.includes('motion') || lowerTitle.includes('after effects')) {
    return { icon: Sparkles, color: "from-violet-500 to-purple-500", trainer: trainers.shafiul,
      featuresBn: ["After Effects বেসিক", "কীফ্রেম অ্যানিমেশন", "টেক্সট অ্যানিমেশন", "ভিজ্যুয়াল ইফেক্টস"],
      featuresEn: ["After Effects Basics", "Keyframe Animation", "Text Animation", "Visual Effects"],
      isSpecial: true,
      specialContentBn: { title: "মোশন গ্রাফিক্স কেন শিখবেন?", points: ["YouTube, Facebook, TikTok-এর জন্য প্রো-লেভেল ভিডিও বানান", "ব্র্যান্ডের জন্য লোগো অ্যানিমেশন ও ইন্ট্রো তৈরি করুন", "ফ্রিল্যান্সিং ও জব মার্কেটে হাই-ডিমান্ড স্কিল"] },
      specialContentEn: { title: "Why Learn Motion Graphics?", points: ["Create pro-level videos for YouTube, Facebook, TikTok", "Make logo animations & intros for brands", "High-demand skill in freelancing & job market"] } };
  }
  if (lowerTitle.includes('vibe') || lowerTitle.includes('ভাইব')) {
    return { icon: Zap, color: "from-pink-500 to-rose-500", trainer: trainers.sofiullah,
      featuresBn: ["AI ওয়েবসাইট বিল্ডার", "প্রম্পট টু ডিজাইন", "নো-কোড ডেভেলপমেন্ট", "হোস্টিং ও পাবলিশিং"],
      featuresEn: ["AI Website Builder", "Prompt to Design", "No-Code Development", "Hosting & Publishing"],
      isSpecial: true,
      specialContentBn: { title: "ভাইব কোডিং কি?", points: ["কোডিং না জেনেও সম্পূর্ণ ওয়েবসাইট তৈরি করুন", "AI টুলস ব্যবহার করে HTML, CSS, ডিজাইন জেনারেট করুন", "আইডিয়া → প্রম্পট → ওয়েবসাইট - এই সিম্পল ওয়ার্কফ্লো শিখুন"] },
      specialContentEn: { title: "What is Vibe Coding?", points: ["Create complete websites without knowing coding", "Generate HTML, CSS, design using AI tools", "Learn the simple workflow: Idea → Prompt → Website"] } };
  }
  if (lowerTitle.includes('ai') || lowerTitle.includes('prompt')) {
    return { icon: Bot, color: "from-indigo-500 to-blue-500", trainer: trainers.sofiullah,
      featuresBn: ["প্রম্পট স্ট্রাকচার", "রোল প্রম্পটিং", "টাস্ক-বেজড প্রম্পট", "AI অটোমেশন"],
      featuresEn: ["Prompt Structure", "Role Prompting", "Task-Based Prompts", "AI Automation"],
      isSpecial: true,
      specialContentBn: { title: "AI প্রম্পট ইঞ্জিনিয়ারিং কি শেখায়?", points: ["AI টুলসের জন্য ইফেক্টিভ প্রম্পট লেখা শিখুন", "ডিজাইন, কোডিং, মার্কেটিং, কন্টেন্টে AI ব্যবহার", "ChatGPT, Claude, Midjourney সব AI মাস্টার করুন"] },
      specialContentEn: { title: "What does AI Prompt Engineering teach?", points: ["Learn to write effective prompts for AI tools", "Use AI for design, coding, marketing, content", "Master all AI tools: ChatGPT, Claude, Midjourney"] } };
  }
  if (lowerTitle.includes('it') || lowerTitle.includes('support') || lowerTitle.includes('সাপোর্ট')) {
    return { icon: Wrench, color: "from-slate-500 to-zinc-600", trainer: trainers.prantik,
      featuresBn: ["কম্পিউটার ট্রাবলশুটিং", "নেটওয়ার্ক সেটআপ", "হার্ডওয়্যার মেইনটেন্যান্স", "সফটওয়্যার ইনস্টলেশন"],
      featuresEn: ["Computer Troubleshooting", "Network Setup", "Hardware Maintenance", "Software Installation"],
      isSpecial: true,
      specialContentBn: { title: "আইটি সাপোর্ট কেন শিখবেন?", points: ["যেকোনো অফিস বা প্রতিষ্ঠানে IT সাপোর্ট জব পান", "নিজের কম্পিউটার ও নেটওয়ার্ক সমস্যা সমাধান করুন", "ফ্রিল্যান্স টেক সাপোর্ট সার্ভিস দিন"] },
      specialContentEn: { title: "Why Learn IT Support?", points: ["Get IT support jobs in any office or organization", "Solve your own computer & network problems", "Provide freelance tech support services"] } };
  }
  return { icon: BookOpen, color: "from-primary to-purple-500", trainer: null,
    featuresBn: ["অনলাইন ক্লাস", "সার্টিফিকেট", "লাইফটাইম অ্যাক্সেস", "সাপোর্ট"],
    featuresEn: ["Online Classes", "Certificate", "Lifetime Access", "Support"] };
};

const translations = {
  en: {
    badge: "100% Online-Based Courses", title: "Learn with AlphaZero",
    subtitle: "Learn practical, job-ready and AI-powered skills. Build websites, brands and digital careers without deep technical knowledge.",
    beginnerFriendly: "Beginner-Friendly", certificate: "Certificate Provided", expertTrainer: "Expert Trainers",
    aboutTitle: "About", aboutDesc: "Learn with AlphaZero teaches practical, job-ready and AI-powered skills so students can build websites, brands, and digital careers without needing deep technical knowledge. All courses are 100% online-based, designed for beginners and affordable for Bangladesh market.",
    ourCourses: "Our", coursesTitle: "Courses", coursesSubtitle: "Professional Online Courses - Start Your Career Today",
    popularCourses: "Popular Courses",
    coursesDesc: "We have designed our courses with the most demanding professional skills. The knowledge, experience, and expertise gained through the program will ensure your desired career in the global market. From the list below you can enroll in any online or offline course at any time.",
    catAll: "All Course", catGraphic: "Graphic & Multimedia", catWeb: "Web & Software", catMarketing: "Digital Marketing", cat3D: "3D Animation & Visualization",
    special: "Special", upcoming: "Coming Soon", trainer: "Trainer", courseFee: "Course Fee",
    enrollNow: "Enroll Now", free: "Free", readMore: "Read More", readLess: "Show Less",
    startCareer: "Start Your Digital Career", startToday: "Today",
    ctaSubtitle: "100% Online Courses • Beginner-Friendly • Certificate Provided • Expert Trainers",
    enrollButton: "Enroll Now", whatsappContact: "WhatsApp Contact",
    noCourses: "No courses available yet", noCoursesDesc: "Please check back later for new courses.", loading: "Loading courses...",
    loginFirst: "Please login first to enroll",
  },
  bn: {
    badge: "১০০% অনলাইন-ভিত্তিক কোর্স", title: "Learn with AlphaZero",
    subtitle: "প্র্যাক্টিক্যাল, জব-রেডি ও AI-পাওয়ার্ড স্কিল শিখুন। কোনো টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড ও ডিজিটাল ক্যারিয়ার গড়ুন।",
    beginnerFriendly: "বিগিনার-ফ্রেন্ডলি", certificate: "সার্টিফিকেট প্রদান", expertTrainer: "এক্সপার্ট ট্রেইনার",
    aboutTitle: "সম্পর্কে", aboutDesc: "Learn with AlphaZero প্র্যাক্টিক্যাল, জব-রেডি এবং AI-পাওয়ার্ড স্কিল শেখায় যাতে শিক্ষার্থীরা গভীর টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড এবং ডিজিটাল ক্যারিয়ার গড়ে তুলতে পারে। আমাদের সব কোর্স ১০০% অনলাইন-ভিত্তিক, বিগিনার ও আধুনিক শিক্ষার্থীদের জন্য ডিজাইন করা এবং বাংলাদেশের বাজারের জন্য সাশ্রয়ী মূল্যে।",
    ourCourses: "আমাদের", coursesTitle: "কোর্সসমূহ", coursesSubtitle: "প্রফেশনাল অনলাইন কোর্স - আপনার ক্যারিয়ার শুরু করুন আজই",
    popularCourses: "জনপ্রিয় কোর্সসমূহ",
    coursesDesc: "আমরা সবচেয়ে চাহিদাসম্পন্ন প্রফেশনাল স্কিল দিয়ে আমাদের কোর্সগুলো সাজিয়েছি। এই প্রোগ্রাম থেকে অর্জিত জ্ঞান, অভিজ্ঞতা ও দক্ষতা গ্লোবাল মার্কেটে আপনার কাঙ্ক্ষিত ক্যারিয়ার নিশ্চিত করবে। নিচের তালিকা থেকে যেকোনো সময় অনলাইন বা অফলাইন কোর্সে ভর্তি হতে পারবেন।",
    catAll: "সব কোর্স", catGraphic: "গ্রাফিক ও মাল্টিমিডিয়া", catWeb: "ওয়েব ও সফটওয়্যার", catMarketing: "ডিজিটাল মার্কেটিং", cat3D: "৩ডি অ্যানিমেশন",
    special: "স্পেশাল", upcoming: "আসছে শীঘ্রই", trainer: "ট্রেইনার", courseFee: "কোর্স ফি",
    enrollNow: "এখনই ভর্তি হন", free: "ফ্রি", readMore: "আরো দেখুন", readLess: "কম দেখুন",
    startCareer: "আপনার ডিজিটাল ক্যারিয়ার", startToday: "শুরু করুন আজই",
    ctaSubtitle: "১০০% অনলাইন কোর্স • বিগিনার-ফ্রেন্ডলি • সার্টিফিকেট প্রদান • এক্সপার্ট ট্রেইনার",
    enrollButton: "এখনই ভর্তি হন", whatsappContact: "WhatsApp-এ যোগাযোগ",
    noCourses: "এখনো কোনো কোর্স নেই", noCoursesDesc: "নতুন কোর্সের জন্য পরে আবার দেখুন।", loading: "কোর্স লোড হচ্ছে...",
    loginFirst: "এনরোল করতে আগে লগইন করুন",
  }
};

const CoursesPage = () => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const t = translations[language];
  const isBn = language === "bn";
  const { getContent: getPageContent } = usePageContent("courses", "learn");
  const cms = (bnKey: string, enKey: string, bnFb: string, enFb: string) =>
    isBn ? (getPageContent(bnKey) || bnFb) : (getPageContent(enKey) || enFb);
  const { courses: dbCourses, isLoading: coursesLoading } = usePublicCourses();

  // Enrollment modal state
  const [enrollmentCourse, setEnrollmentCourse] = useState<Course | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const autoplayPlugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true }));

  const categories = useMemo(() => ([
    { id: "all", label: t.catAll, match: null as RegExp | null },
    { id: "graphic", label: t.catGraphic, match: /graphic|multimedia|photo|design|ui|ux|brand/i },
    { id: "web", label: t.catWeb, match: /web|software|code|coding|vibe|develop|program/i },
    { id: "marketing", label: t.catMarketing, match: /market|seo|social|digital market|facebook|ad/i },
    { id: "3d", label: t.cat3D, match: /3d|animation|motion|video|vfx|render/i },
  ]), [t]);

  const toggleExpand = (courseId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const displayCourses = useMemo(() => {
    const mapped = dbCourses.map(course => ({
      ...course,
      titleBn: course.title,
      titleEn: course.title_en || course.title,
      descriptionBn: course.description || '',
      descriptionEn: course.description_en || course.description || '',
    }));
    const activeCat = categories.find(c => c.id === activeCategory);
    if (!activeCat?.match) return mapped;
    return mapped.filter(c => activeCat.match!.test(c.titleEn));
  }, [dbCourses, activeCategory, categories]);

  const handleEnrollClick = (course: typeof displayCourses[0]) => {
    const metadata = getCourseMetadata(course.titleEn);
    if (metadata.isUpcoming) return;

    // If not logged in, redirect to student login
    if (!user) {
      toast.info(t.loginFirst);
      window.open('/student/login', '_blank', 'noopener,noreferrer');
      return;
    }

    const isFree = !course.price || course.price === 0;

    if (isFree) {
      // Instant free enrollment
      handleFreeEnrollment(course);
    } else {
      // Show payment modal
      setEnrollmentCourse(course as Course);
      setShowEnrollmentModal(true);
    }
  };

  const handleFreeEnrollment = async (course: typeof displayCourses[0]) => {
    if (!user || !profile) return;
    try {
      // Check existing
      const { data: existing } = await supabase
        .from('enrollment_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .eq('status', 'pending')
        .maybeSingle();
      if (existing) {
        toast.info(isBn ? 'ইতিমধ্যে রিকুয়েস্ট করা হয়েছে' : 'Already requested');
        return;
      }

      const { error } = await supabase.from('enrollment_requests').insert({
        user_id: user.id,
        course_id: course.id,
        student_name: profile.full_name,
        student_email: profile.email,
        payment_method: 'free',
        transaction_id: 'FREE',
        message: 'Free Course Enrollment',
        status: 'pending',
      });
      if (error) throw error;

      // Notify admin
      try {
        await supabase.functions.invoke('student-enrollment-notify', {
          body: {
            studentName: profile.full_name, studentEmail: profile.email,
            courseName: course.title, coursePrice: 0,
            paymentMethod: 'free', transactionId: 'FREE',
          }
        });
      } catch {}

      toast.success(isBn ? 'ফ্রি কোর্সে এনরোলমেন্ট রিকুয়েস্ট পাঠানো হয়েছে!' : 'Free course enrollment request sent!');
    } catch (err) {
      toast.error(isBn ? 'সমস্যা হয়েছে' : 'Something went wrong');
    }
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Rotating headline words
  const rotatingTitles = useMemo(
    () => isBn
      ? [
          getPageContent("hero.rotating1.bn") || "অসাধারণ",
          getPageContent("hero.rotating2.bn") || "নতুন",
          getPageContent("hero.rotating3.bn") || "চমৎকার",
        ]
      : [
          getPageContent("hero.rotating1.en") || "amazing",
          getPageContent("hero.rotating2.en") || "new",
          getPageContent("hero.rotating3.en") || "wonderful",
        ],
    [isBn, getPageContent]
  );
  const [titleNumber, setTitleNumber] = useState(0);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((n) => (n === rotatingTitles.length - 1 ? 0 : n + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, rotatingTitles]);

  // Redirect to learn subdomain when accessed from main site
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hostname.startsWith("learn.") && window.location.hostname.includes("alphazero.online")) {
      window.location.replace("https://learn.alphazero.online" + window.location.pathname.replace(/^\/courses/, "") + window.location.search);
    }
  }, []);

  // Scroll to the section matching the current route
  const location = useLocation();
  useEffect(() => {
    const map: Record<string, string> = {
      "/instructors": "instructors",
      "/contact": "contact",
      "/courses": "courses",
    };
    const targetId = map[location.pathname];
    if (targetId) {
      // Wait for content mount before scrolling
      const t = setTimeout(() => {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => clearTimeout(t);
    } else if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  return (
    <Layout>


      <Helmet>
        <title>AlphaZero Academy — Learn Graphic Design, Web Development, Vibe Coding, AI & Digital Marketing in Bangla</title>
        <meta name="description" content="AlphaZero Academy (Learn with AlphaZero) — Bangla online courses on graphic design, web development, vibe coding, digital marketing, AI automation, prompt engineering, motion graphics, Figma, Fiverr freelancing & digital products. Learn from experts & get certified." />
        <meta name="keywords" content="AlphaZero Academy, Learn with AlphaZero, graphic design course Bangla, web development Bangla, vibe coding, digital marketing Bangla, AI automation, prompt engineering, motion graphics, Figma course, Fiverr freelancing, digital product course, online course Bangladesh" />
        <meta name="author" content="AlphaZero Academy" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://learn.alphazero.online/" />

        <meta property="og:site_name" content="AlphaZero Academy" />
        <meta property="og:title" content="AlphaZero Academy — Learn Design, Web Dev, Vibe Coding, AI & Digital Marketing" />
        <meta property="og:description" content="Bangla online courses on graphic design, web development, vibe coding, digital marketing, AI automation, prompt engineering, motion graphics, Figma & Fiverr freelancing." />
        <meta property="og:url" content="https://learn.alphazero.online/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="bn_BD" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:image" content={learnOgImage.url} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AlphaZero Academy — Learn with AlphaZero" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AlphaZero Academy — Design, Web Dev, Vibe Coding, AI & Digital Marketing" />
        <meta name="twitter:description" content="Bangla courses on graphic design, web development, vibe coding, digital marketing, AI automation, prompt engineering, motion graphics, Figma & Fiverr freelancing." />
        <meta name="twitter:image" content={learnOgImage.url} />
        <meta name="twitter:image:alt" content="AlphaZero Academy — Learn with AlphaZero" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "AlphaZero Academy",
          "alternateName": ["Learn with AlphaZero", "AlphaZero Learn"],
          "url": "https://learn.alphazero.online/",
          "logo": "https://alphazero.online/logo.png",
          "description": "AlphaZero Academy — Bangla online learning platform teaching graphic design, web development, vibe coding, digital marketing, AI automation, prompt engineering, motion graphics, Figma, Fiverr freelancing and digital products.",
          "sameAs": [
            "https://alphazero.online",
            "https://www.facebook.com/alphazero.online",
            "https://www.youtube.com/@alphazero.online"
          ],
          "areaServed": "BD",
          "inLanguage": ["bn", "en"],
          "knowsAbout": [
            "Graphic Design", "Web Development", "Vibe Coding", "Digital Marketing",
            "AI Automation", "Prompt Engineering", "Motion Graphics", "Figma",
            "Fiverr Freelancing", "Digital Products"
          ]
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AlphaZero Academy",
          "alternateName": "Learn with AlphaZero",
          "url": "https://learn.alphazero.online/",
          "inLanguage": ["bn", "en"],
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://learn.alphazero.online/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "AlphaZero Academy Courses",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Graphic Design Course (Bangla)" },
            { "@type": "ListItem", "position": 2, "name": "Web Development Course (Bangla)" },
            { "@type": "ListItem", "position": 3, "name": "Vibe Coding Course" },
            { "@type": "ListItem", "position": 4, "name": "Digital Marketing Course (Bangla)" },
            { "@type": "ListItem", "position": 5, "name": "AI Automation Course" },
            { "@type": "ListItem", "position": 6, "name": "Prompt Engineering Course" },
            { "@type": "ListItem", "position": 7, "name": "Motion Graphics Course" },
            { "@type": "ListItem", "position": 8, "name": "Figma UI/UX Design Course" },
            { "@type": "ListItem", "position": 9, "name": "Fiverr Freelancing Course" },
            { "@type": "ListItem", "position": 10, "name": "Digital Product Course" }
          ]
        })}</script>
      </Helmet>
      {/* Hero - logo-forward editorial */}
      <section id="home" ref={heroRef} className="relative flex items-center justify-center overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-32 -mt-20">

        {/* Blue wave background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${coursesHeroBg})`,
            filter: "blur(6.4px)",
            transform: "scale(1.05)",
            maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          }}
        />
        {/* Dark overlay for text readability + bottom fade to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
        {/* Soft radial spotlight */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--primary) / 0.15), transparent 70%)" }} />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="w-full px-6 md:px-20 lg:px-32 relative z-10">
          <div className="mr-auto flex flex-col items-start text-left relative pl-0">




            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs md:text-sm font-medium tracking-wide text-foreground/80">
                {cms("hero.eyebrow.bn", "hero.eyebrow.en", "ডিজিটাল স্কিল একাডেমি", "Digital Skill Academy")}
              </span>
            </motion.div>

            {/* Editorial headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="font-playfair text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8 max-w-4xl leading-[1.1]"
            >
              <span className="text-foreground font-normal">
                {cms("hero.title1.bn", "hero.title1.en", "এক প্ল্যাটফর্ম।", "One platform.")}
              </span>{" "}
              <span className="text-foreground/70 font-normal">
                {cms("hero.title2.bn", "hero.title2.en", "প্রতিটি ডিজিটাল স্কিল।", "every digital skill.")}
              </span>
              <br />
              <span className="font-semibold bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                {cms("hero.title3.bn", "hero.title3.en", "অসীম সম্ভাবনা।", "Endless opportunities.")}
              </span>

            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-sm md:text-base text-foreground/65 max-w-xl mb-10 leading-[1.7]"
            >
              {cms(
                "hero.subtitle.bn",
                "hero.subtitle.en",
                "AI ও গ্রাফিক ডিজাইন থেকে প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং, ভিডিও এডিটিং, ফটোগ্রাফি এবং ফ্রিল্যান্সিং—সফল ডিজিটাল ক্যারিয়ার গড়তে যা প্রয়োজন সব শিখুন।",
                "From AI and graphic design to programming, web development, digital marketing, video editing, photography and freelancing — everything you need to build a thriving digital career."
              )}
            </motion.p>






            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-start mb-7"
            >
              <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary)/0.2)_0%,hsl(var(--primary))_50%,hsl(var(--primary)/0.2)_100%)]" />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background/90 backdrop-blur-3xl text-sm font-medium text-foreground">
                  <a
                    href="#courses"
                    className="inline-flex rounded-full text-center group items-center justify-center bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent text-foreground border-input border-[1px] hover:bg-gradient-to-tr hover:from-primary/30 hover:via-primary/20 hover:to-transparent transition-all py-4 px-10"
                  >
                    {cms("hero.cta.bn", "hero.cta.en", "কোর্স দেখুন", "Browse Courses")}
                  </a>
                </div>
              </span>
            </motion.div>




          </div>
        </motion.div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 border-t border-border/40" id="courses">

        <div className="container mx-auto px-6">
          {/* Centered header — Popular Courses */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-5">
              {(() => {
                const text = cms("grid.title.bn", "grid.title.en", "জনপ্রিয় কোর্স", t.popularCourses);
                const idx = text.toLowerCase().indexOf(isBn ? "কোর্স" : "course");
                if (idx === -1) return text;
                return (
                  <>
                    <span>{text.slice(0, idx)}</span>
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      {text.slice(idx)}
                    </span>
                  </>
                );
              })()}
            </h2>
          </motion.div>

          {/* Category pills */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground border border-border/50 hover:border-border"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCatPill"
                        className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>



          {coursesLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">{t.loading}</p>
            </div>
          )}

          {!coursesLoading && displayCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.noCourses}</h3>
              <p className="text-muted-foreground">{t.noCoursesDesc}</p>
            </div>
          )}

          {!coursesLoading && displayCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {displayCourses.map((course, index) => {
                const metadata = getCourseMetadata(course.titleEn);
                const CourseIcon = metadata.icon;
                const coursePrice = course.price || 0;
                const isFree = coursePrice === 0;
                const trainerName = course.trainer_name || metadata.trainer?.name;
                const trainerImage = course.trainer_image || metadata.trainer?.image;
                const trainerDesig = course.trainer_designation || (isBn ? metadata.trainer?.qualificationBn : metadata.trainer?.qualificationEn);
                
                return (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="group">
                    <div className={`relative flex flex-col rounded-[28px] overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/[0.12] p-2.5 ${metadata.isSpecial ? '' : ''} ${metadata.isUpcoming ? 'ring-1 ring-amber-500/20' : ''}`}>
                      
                      {/* Thumbnail with editorial number */}
                      {(() => {
                        const thumbnailUrl = course.thumbnail_url;
                        if (thumbnailUrl) {
                          return (
                            <div className="relative h-48 overflow-hidden rounded-[20px]">
                              <img src={thumbnailUrl} alt={isBn ? course.titleBn : course.titleEn}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex gap-1.5">
                                {metadata.isSpecial && (
                                  <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1 shadow-lg">
                                    <Sparkles className="w-3 h-3" />{t.special}
                                  </span>
                                )}
                                {metadata.isUpcoming && (
                                  <span className="px-3 py-1.5 rounded-full bg-amber-500 text-primary-foreground text-[10px] font-bold flex items-center gap-1 shadow-lg">
                                    <Clock className="w-3 h-3" />{t.upcoming}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className={`relative h-48 bg-gradient-to-br ${metadata.color} overflow-hidden rounded-[20px]`}>
                            <span className="absolute -bottom-4 -right-2 text-[5rem] font-display font-black text-white/[0.08] leading-none select-none">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              {metadata.isSpecial && (
                                <span className="px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-primary-foreground text-[10px] font-bold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />{t.special}
                                </span>
                              )}
                              {metadata.isUpcoming && (
                                <span className="px-3 py-1.5 rounded-full bg-amber-500 text-primary-foreground text-[10px] font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{t.upcoming}
                                </span>
                              )}
                            </div>
                            <div className="absolute top-1/2 left-5 -translate-y-1/2">
                              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                <CourseIcon className="w-7 h-7 text-white" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Body */}
                      <div className="flex flex-col px-3 pt-4 pb-3 gap-2.5">
                        <h3 className="text-[15px] font-display font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {isBn ? course.titleBn : course.titleEn}
                        </h3>
                        <p className={`text-xs text-muted-foreground leading-relaxed ${expandedCards.has(course.id) ? '' : 'line-clamp-2'}`}>
                          {isBn ? course.descriptionBn : course.descriptionEn}
                        </p>

                        {/* Read More toggle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpand(course.id); }}
                          className="text-[11px] text-primary font-semibold hover:underline self-start flex items-center gap-1"
                        >
                          {expandedCards.has(course.id) ? t.readLess : t.readMore}
                          <ArrowRight className={`w-3 h-3 transition-transform ${expandedCards.has(course.id) ? 'rotate-90' : ''}`} />
                        </button>

                        {/* Expanded content */}
                        {expandedCards.has(course.id) && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3 overflow-hidden">
                            <div className="flex flex-wrap gap-1.5">
                              {(isBn ? metadata.featuresBn : metadata.featuresEn).map((feature, idx) => (
                                <span key={idx} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/20">
                                  {feature}
                                </span>
                              ))}
                            </div>
                            {metadata.isSpecial && metadata.specialContentBn && metadata.specialContentEn && (
                              <div className="p-3 rounded-xl bg-primary/[0.05] border border-primary/10">
                                <h4 className="font-semibold text-primary text-xs mb-1.5 flex items-center gap-1">
                                  <Zap className="w-3.5 h-3.5" />
                                  {isBn ? metadata.specialContentBn.title : metadata.specialContentEn.title}
                                </h4>
                                <ul className="space-y-1">
                                  {(isBn ? metadata.specialContentBn.points : metadata.specialContentEn.points).map((point, idx) => (
                                    <li key={idx} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                      <span className="text-primary mt-0.5">•</span>{point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {trainerName && (
                              <div className="flex items-center gap-2">
                                <img src={trainerImage || '/placeholder.svg'}
                                  alt={trainerName}
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10 flex-shrink-0"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold truncate">{trainerName}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{trainerDesig}</p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-border/40 mt-1" />

                        {/* Price + Enroll row */}
                        <div className="flex items-center gap-3 pt-1">
                          <span className={`text-xl font-display font-bold ${isFree ? 'text-emerald-500' : 'text-primary'}`}>
                            {isFree ? t.free : `৳${coursePrice.toLocaleString(isBn ? 'bn-BD' : 'en-US')}`}
                          </span>
                          <button
                            onClick={() => handleEnrollClick(course)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-xs transition-all duration-300 ${
                              metadata.isUpcoming 
                                ? 'bg-amber-500/10 text-amber-500 cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]'
                            }`}
                            disabled={metadata.isUpcoming}
                          >
                            {metadata.isUpcoming ? (
                              <><Clock className="w-3.5 h-3.5" />{t.upcoming}</>
                            ) : (
                              <><ArrowRight className="w-3.5 h-3.5" />{t.enrollNow}</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>





      {/* Instructors section */}
      <section id="instructors" className="py-20 border-t border-border/40 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14 max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3 block">
              {cms("instructors.badge.bn", "instructors.badge.en", "আমাদের টিম", "Our Team")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold leading-tight">
              {cms("instructors.title1.bn", "instructors.title1.en", "এক্সপার্ট", "Expert")}{" "}
              <span className="gradient-text">{cms("instructors.title2.bn", "instructors.title2.en", "ইনস্ট্রাক্টর", "Instructors")}</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              {cms("instructors.desc.bn", "instructors.desc.en", "ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে সরাসরি শিখুন।", "Learn directly from industry experts.")}
            </p>
          </motion.div>
          <div className="max-w-7xl mx-auto relative">
            <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]} className="w-full">
              <CarouselContent className="-ml-4">
                {Object.values(trainers).map((tr, i) => (
                  <CarouselItem key={`${tr.name}-${i}`} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/6">
                    <div className="group">
                      <div className="glass-card rounded-2xl p-3 text-center shadow-none hover:shadow-none hover:border-primary/40 transition-all hover:-translate-y-1">
                        <div className="relative aspect-square w-full mb-3 overflow-hidden rounded-xl">
                          <img src={tr.image} alt={tr.name}
                            className="relative w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                        </div>
                        <h3 className="font-display font-bold text-sm mb-1 group-hover:text-primary transition-colors">{tr.name}</h3>
                        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-3">
                          {isBn ? tr.qualificationBn : tr.qualificationEn}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex left-2 z-10" />
              <CarouselNext className="hidden sm:flex right-2 z-10" />

            </Carousel>
          </div>


        </div>
      </section>


      {/* Contact / CTA Section */}
      <section id="contact" className="py-20 relative overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-10 lg:p-16">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3 block">
              {cms("cta.badge.bn", "cta.badge.en", "যোগাযোগ", "Get in Touch")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              {cms("cta.title.bn", "cta.title.en", "শুরু করুন আপনার ক্যারিয়ার", t.startCareer)}{" "}
              <span className="gradient-text">{cms("cta.title2.bn", "cta.title2.en", "আজই", t.startToday)}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              {cms("cta.subtitle.bn", "cta.subtitle.en", "নতুন স্কিল শিখুন, দক্ষতা তৈরি করুন এবং ইন্ডাস্ট্রিতে জায়গা করে নিন।", t.ctaSubtitle)}
            </p>

            {(() => {
              const phone = getPageContent("cta.phone") || "+880 1776-965533";
              const email = getPageContent("cta.email") || "learn@alphazero.online";
              const waNum = phone.replace(/[^\d+]/g, "");
              return (
                <div className="grid sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto text-left">
                  <a href={`tel:${waNum}`} className="glass-card rounded-xl p-4 hover:border-primary/40 transition-all">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{isBn ? "ফোন" : "Phone"}</p>
                    <p className="text-sm font-semibold">{phone}</p>
                  </a>
                  <a href={`mailto:${email}`} className="glass-card rounded-xl p-4 hover:border-primary/40 transition-all">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{isBn ? "ইমেইল" : "Email"}</p>
                    <p className="text-sm font-semibold break-all">{email}</p>
                  </a>
                  <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" className="glass-card rounded-xl p-4 hover:border-primary/40 transition-all">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">WhatsApp</p>
                    <p className="text-sm font-semibold">{isBn ? "চ্যাট করুন" : "Chat with us"}</p>
                  </a>
                </div>
              );
            })()}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#courses" className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
                <GraduationCap className="w-5 h-5" />{t.enrollButton}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://wa.me/+8801776965533" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 glass-card text-foreground rounded-xl font-medium text-lg hover:border-primary/30 transition-all duration-300">
                {t.whatsappContact}
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Enrollment Modal */}
      {enrollmentCourse && user && profile && (
        <CourseEnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => { setShowEnrollmentModal(false); setEnrollmentCourse(null); }}
          course={enrollmentCourse}
          userId={user.id}
          userEmail={profile.email}
          userName={profile.full_name}
          onSuccess={() => { setShowEnrollmentModal(false); setEnrollmentCourse(null); }}
          language={language}
        />
      )}
    </Layout>
  );
};

export default CoursesPage;
