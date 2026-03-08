import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, Monitor, Palette, Video, Camera, TrendingUp, Code, Sparkles, Bot, Globe,
  CheckCircle2, BookOpen, Star, Zap, Target, Award, Clock, Wrench, Lock, Loader2, LucideIcon
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import CourseEnrollmentModal from "@/components/student/CourseEnrollmentModal";
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
    return { icon: Monitor, color: "from-orange-500 to-red-500", trainer: trainers.kamrul,
      featuresBn: ["MS Word মাস্টারি", "Excel ফর্মুলা ও ডাটা এনালাইসিস", "PowerPoint প্রেজেন্টেশন", "অফিস অটোমেশন"],
      featuresEn: ["MS Word Mastery", "Excel Formulas & Data Analysis", "PowerPoint Presentations", "Office Automation"] };
  }
  if (lowerTitle.includes('graphic') || lowerTitle.includes('গ্রাফিক')) {
    return { icon: Palette, color: "from-purple-500 to-pink-500", trainer: trainers.adib,
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
    badge: "100% Online-Based Courses", title: "Alpha Academy",
    subtitle: "Learn practical, job-ready and AI-powered skills. Build websites, brands and digital careers without deep technical knowledge.",
    beginnerFriendly: "Beginner-Friendly", certificate: "Certificate Provided", expertTrainer: "Expert Trainers",
    aboutTitle: "About", aboutDesc: "Alpha Academy teaches practical, job-ready and AI-powered skills so students can build websites, brands, and digital careers without needing deep technical knowledge. All courses are 100% online-based, designed for beginners and affordable for Bangladesh market.",
    ourCourses: "Our", coursesTitle: "Courses", coursesSubtitle: "Professional Online Courses - Start Your Career Today",
    special: "Special", upcoming: "Coming Soon", trainer: "Trainer", courseFee: "Course Fee",
    enrollNow: "Enroll Now", free: "Free",
    startCareer: "Start Your Digital Career", startToday: "Today",
    ctaSubtitle: "100% Online Courses • Beginner-Friendly • Certificate Provided • Expert Trainers",
    enrollButton: "Enroll Now", whatsappContact: "WhatsApp Contact",
    noCourses: "No courses available yet", noCoursesDesc: "Please check back later for new courses.", loading: "Loading courses...",
    loginFirst: "Please login first to enroll",
  },
  bn: {
    badge: "১০০% অনলাইন-ভিত্তিক কোর্স", title: "Alpha Academy",
    subtitle: "প্র্যাক্টিক্যাল, জব-রেডি ও AI-পাওয়ার্ড স্কিল শিখুন। কোনো টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড ও ডিজিটাল ক্যারিয়ার গড়ুন।",
    beginnerFriendly: "বিগিনার-ফ্রেন্ডলি", certificate: "সার্টিফিকেট প্রদান", expertTrainer: "এক্সপার্ট ট্রেইনার",
    aboutTitle: "সম্পর্কে", aboutDesc: "Alpha Academy প্র্যাক্টিক্যাল, জব-রেডি এবং AI-পাওয়ার্ড স্কিল শেখায় যাতে শিক্ষার্থীরা গভীর টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড এবং ডিজিটাল ক্যারিয়ার গড়ে তুলতে পারে। আমাদের সব কোর্স ১০০% অনলাইন-ভিত্তিক, বিগিনার ও আধুনিক শিক্ষার্থীদের জন্য ডিজাইন করা এবং বাংলাদেশের বাজারের জন্য সাশ্রয়ী মূল্যে।",
    ourCourses: "আমাদের", coursesTitle: "কোর্সসমূহ", coursesSubtitle: "প্রফেশনাল অনলাইন কোর্স - আপনার ক্যারিয়ার শুরু করুন আজই",
    special: "স্পেশাল", upcoming: "আসছে শীঘ্রই", trainer: "ট্রেইনার", courseFee: "কোর্স ফি",
    enrollNow: "এখনই ভর্তি হন", free: "ফ্রি",
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
  const { courses: dbCourses, isLoading: coursesLoading } = usePublicCourses();

  // Enrollment modal state
  const [enrollmentCourse, setEnrollmentCourse] = useState<Course | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const displayCourses = useMemo(() => {
    return dbCourses.map(course => ({
      ...course,
      titleBn: course.title,
      titleEn: course.title_en || course.title,
      descriptionBn: course.description || '',
      descriptionEn: course.description_en || course.description || '',
    }));
  }, [dbCourses]);

  const handleEnrollClick = (course: typeof displayCourses[0]) => {
    const metadata = getCourseMetadata(course.titleEn);
    if (metadata.isUpcoming) return;

    // If not logged in, redirect to student login
    if (!user) {
      toast.info(t.loginFirst);
      navigate('/student/login');
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

  return (
    <Layout>
      {/* Hero */}
      <section className="py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-8">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{t.badge}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="gradient-text">{t.title}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t.subtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                <Target className="w-4 h-4 text-primary" /><span className="text-sm">{t.beginnerFriendly}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                <Award className="w-4 h-4 text-primary" /><span className="text-sm">{t.certificate}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                <Star className="w-4 h-4 text-primary" /><span className="text-sm">{t.expertTrainer}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About — editorial */}
      <section className="py-16 border-y border-border/40 dark:border-border/20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              Alpha Academy <span className="gradient-text">{t.aboutTitle}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.aboutDesc}</p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20" id="courses">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              {t.ourCourses} <span className="gradient-text">{t.coursesTitle}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.coursesSubtitle}</p>
          </motion.div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {displayCourses.map((course, index) => {
                const metadata = getCourseMetadata(course.titleEn);
                const CourseIcon = metadata.icon;
                const coursePrice = course.price || 0;
                const isFree = coursePrice === 0;
                
                return (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group h-full">
                    <div className={`relative h-full flex flex-col rounded-3xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${metadata.isSpecial ? 'ring-2 ring-primary/40' : ''} ${metadata.isUpcoming ? 'ring-2 ring-amber-500/40' : ''}`}>
                      {/* Course Thumbnail - NO price overlay */}
                      {(() => {
                        const thumbnailUrl = course.thumbnail_url;
                        if (thumbnailUrl) {
                          return (
                            <div className="relative h-48 overflow-hidden">
                              <img src={thumbnailUrl} alt={isBn ? course.titleBn : course.titleEn}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              {metadata.isSpecial && (
                                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                  <Sparkles className="w-3.5 h-3.5" />{t.special}
                                </div>
                              )}
                              {metadata.isUpcoming && (
                                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                  <Clock className="w-3.5 h-3.5" />{t.upcoming}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div className={`relative h-40 bg-gradient-to-br ${metadata.color} p-6`}>
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-4 right-4 w-24 h-24 border-4 border-white/30 rounded-full" />
                              <div className="absolute bottom-4 left-6 w-16 h-16 border-2 border-white/20 rounded-lg rotate-12" />
                            </div>
                            {metadata.isSpecial && (
                              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <Sparkles className="w-3.5 h-3.5" />{t.special}
                              </div>
                            )}
                            {metadata.isUpcoming && (
                              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                <Clock className="w-3.5 h-3.5" />{t.upcoming}
                              </div>
                            )}
                            <div className="relative w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                              <CourseIcon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Card Body */}
                      <div className="flex-1 flex flex-col p-6">
                        <h3 className="text-lg font-display font-bold leading-tight mb-3">
                          {isBn ? course.titleBn : course.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {isBn ? course.descriptionBn : course.descriptionEn}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {(isBn ? metadata.featuresBn : metadata.featuresEn).slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs bg-secondary/60 rounded-xl px-3 py-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground truncate">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Special Content */}
                        {metadata.isSpecial && metadata.specialContentBn && metadata.specialContentEn && (
                          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                            <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-1.5">
                              <Zap className="w-4 h-4" />
                              {isBn ? metadata.specialContentBn.title : metadata.specialContentEn.title}
                            </h4>
                            <ul className="space-y-1.5">
                              {(isBn ? metadata.specialContentBn.points : metadata.specialContentEn.points).slice(0, 3).map((point, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-0.5">•</span>{point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Trainer */}
                        {(course.trainer_name || metadata.trainer) && (
                          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/30 border border-border mb-4 mt-auto">
                            <img src={course.trainer_image || metadata.trainer?.image || '/placeholder.svg'}
                              alt={course.trainer_name || metadata.trainer?.name || 'Trainer'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 shadow-md"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">{t.trainer}</p>
                              <p className="text-sm font-semibold truncate">{course.trainer_name || metadata.trainer?.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {course.trainer_designation || (isBn ? metadata.trainer?.qualificationBn : metadata.trainer?.qualificationEn)}
                              </p>
                            </div>
                          </div>
                        )}
                        {!course.trainer_name && !metadata.trainer && <div className="flex-1" />}

                        {/* Price + Enroll Button */}
                        <div className="space-y-3 mt-auto">
                          {/* Price Display */}
                          <div className="flex items-center justify-between px-1">
                            <span className="text-xs text-muted-foreground">{t.courseFee}</span>
                            <Badge className={`text-base px-3 py-0.5 font-bold border-0 ${isFree ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary'}`}>
                              {isFree ? t.free : `৳${coursePrice.toLocaleString(isBn ? 'bn-BD' : 'en-US')}`}
                            </Badge>
                          </div>

                          {/* Enroll Button */}
                          <button
                            onClick={() => handleEnrollClick(course)}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                              metadata.isUpcoming 
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-not-allowed'
                                : metadata.isSpecial 
                                  ? 'bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]' 
                                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02]'
                            }`}
                            disabled={metadata.isUpcoming}
                          >
                            <GraduationCap className="w-4 h-4" />
                            {metadata.isUpcoming ? t.upcoming : t.enrollNow}
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              {t.startCareer} <span className="gradient-text">{t.startToday}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">{t.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#courses" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
                <GraduationCap className="w-5 h-5" />{t.enrollButton}
              </a>
              <a href="https://wa.me/+8801776965533" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300">
                {t.whatsappContact}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enrollment Modal (for paid courses) */}
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
