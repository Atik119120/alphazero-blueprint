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
  Clock
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

// Course data with trainer assignments and bilingual support
const courses = [
  {
    id: "google-knowledge",
    nameBn: "গুগল নলেজ প্যানেল ক্রিয়েশন",
    nameEn: "Google Knowledge Panel Creation",
    icon: Globe,
    fee: 3000,
    trainer: trainers.sofiullah,
    color: "from-blue-500 to-cyan-500",
    descriptionBn: "গুগলে আপনার ব্র্যান্ড বা ব্যক্তিগত প্রোফাইলের জন্য নলেজ প্যানেল তৈরি করুন। অনলাইনে আপনার পরিচিতি বাড়ান।",
    descriptionEn: "Create a Knowledge Panel for your brand or personal profile on Google. Increase your online presence.",
    featuresBn: ["গুগল সার্চ অপ্টিমাইজেশন", "ব্র্যান্ড ভেরিফিকেশন", "উইকিপিডিয়া এন্ট্রি গাইড", "সোশ্যাল প্রোফাইল সেটআপ"],
    featuresEn: ["Google Search Optimization", "Brand Verification", "Wikipedia Entry Guide", "Social Profile Setup"]
  },
  {
    id: "microsoft-office",
    nameBn: "মাইক্রোসফট অফিস",
    nameEn: "Microsoft Office (Word, Excel, PowerPoint)",
    icon: Monitor,
    fee: 2000,
    trainer: trainers.kamrul,
    color: "from-orange-500 to-red-500",
    descriptionBn: "Word, Excel, PowerPoint-এ সম্পূর্ণ দক্ষতা অর্জন করুন। অফিস কাজের জন্য প্রয়োজনীয় সব স্কিল শিখুন।",
    descriptionEn: "Master Word, Excel, PowerPoint completely. Learn all skills needed for office work.",
    featuresBn: ["MS Word মাস্টারি", "Excel ফর্মুলা ও ডাটা এনালাইসিস", "PowerPoint প্রেজেন্টেশন", "অফিস অটোমেশন"],
    featuresEn: ["MS Word Mastery", "Excel Formulas & Data Analysis", "PowerPoint Presentations", "Office Automation"]
  },
  {
    id: "graphic-design",
    nameBn: "গ্রাফিক ডিজাইন",
    nameEn: "Graphic Design",
    icon: Palette,
    fee: 4000,
    trainer: trainers.adib,
    color: "from-purple-500 to-pink-500",
    descriptionBn: "প্রফেশনাল গ্রাফিক ডিজাইন শিখুন। লোগো, ব্যানার, সোশ্যাল মিডিয়া পোস্ট থেকে শুরু করে সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি।",
    descriptionEn: "Learn professional graphic design. From logos, banners, social media posts to complete brand identity.",
    featuresBn: ["Adobe Photoshop", "Adobe Illustrator", "লোগো ও ব্র্যান্ডিং", "সোশ্যাল মিডিয়া ডিজাইন"],
    featuresEn: ["Adobe Photoshop", "Adobe Illustrator", "Logo & Branding", "Social Media Design"]
  },
  {
    id: "video-editing",
    nameBn: "ভিডিও এডিটিং",
    nameEn: "Video Editing",
    icon: Video,
    fee: 4500,
    trainer: trainers.shafiul,
    color: "from-red-500 to-orange-500",
    descriptionBn: "প্রফেশনাল ভিডিও এডিটিং শিখুন। YouTube, Reels, TikTok-এর জন্য আকর্ষণীয় ভিডিও তৈরি করুন।",
    descriptionEn: "Learn professional video editing. Create engaging videos for YouTube, Reels, TikTok.",
    featuresBn: ["Adobe Premiere Pro", "কালার গ্রেডিং", "সাউন্ড ডিজাইন", "সোশ্যাল মিডিয়া ভিডিও"],
    featuresEn: ["Adobe Premiere Pro", "Color Grading", "Sound Design", "Social Media Videos"]
  },
  {
    id: "photography",
    nameBn: "ফটোগ্রাফি",
    nameEn: "Photography",
    icon: Camera,
    fee: 2500,
    trainer: trainers.sofiullah,
    color: "from-amber-500 to-yellow-500",
    descriptionBn: "ক্যামেরা হ্যান্ডলিং থেকে শুরু করে প্রফেশনাল ফটোগ্রাফি পর্যন্ত সব শিখুন। মোবাইল ও DSLR দুটোতেই দক্ষ হন।",
    descriptionEn: "Learn everything from camera handling to professional photography. Master both mobile and DSLR.",
    featuresBn: ["ক্যামেরা বেসিক", "লাইটিং টেকনিক", "ফটো এডিটিং", "পোর্টফোলিও বিল্ডিং"],
    featuresEn: ["Camera Basics", "Lighting Techniques", "Photo Editing", "Portfolio Building"]
  },
  {
    id: "seo-digital-marketing",
    nameBn: "SEO ও ডিজিটাল মার্কেটিং",
    nameEn: "SEO & Digital Marketing",
    icon: TrendingUp,
    fee: 4000,
    trainer: trainers.sofiullah,
    color: "from-green-500 to-emerald-500",
    descriptionBn: "গুগল র‍্যাঙ্কিং, ফেসবুক মার্কেটিং, এড ক্যাম্পেইন সব শিখুন। আপনার বিজনেস অনলাইনে গ্রো করুন।",
    descriptionEn: "Learn Google ranking, Facebook marketing, ad campaigns. Grow your business online.",
    featuresBn: ["অন-পেজ ও অফ-পেজ SEO", "গুগল অ্যাডস", "ফেসবুক ও ইনস্টাগ্রাম মার্কেটিং", "এনালিটিক্স ও রিপোর্টিং"],
    featuresEn: ["On-Page & Off-Page SEO", "Google Ads", "Facebook & Instagram Marketing", "Analytics & Reporting"],
    isUpcoming: true
  },
  {
    id: "web-coding",
    nameBn: "ওয়েব কোডিং",
    nameEn: "Web Coding (HTML, CSS, JavaScript)",
    icon: Code,
    fee: 5000,
    trainer: trainers.shafiul,
    color: "from-cyan-500 to-blue-500",
    descriptionBn: "HTML, CSS এবং JavaScript দিয়ে ওয়েবসাইট বানানো শিখুন। বেসিক থেকে প্রফেশনাল লেভেল পর্যন্ত।",
    descriptionEn: "Learn to build websites with HTML, CSS and JavaScript. From basic to professional level.",
    featuresBn: ["HTML5 ফান্ডামেন্টালস", "CSS3 ও Flexbox", "JavaScript বেসিক", "রেস্পন্সিভ ডিজাইন"],
    featuresEn: ["HTML5 Fundamentals", "CSS3 & Flexbox", "JavaScript Basics", "Responsive Design"]
  },
  {
    id: "motion-graphics",
    nameBn: "মোশন গ্রাফিক্স",
    nameEn: "Motion Graphics (After Effects)",
    icon: Sparkles,
    fee: 5500,
    trainer: trainers.shafiul,
    color: "from-violet-500 to-purple-500",
    descriptionBn: "After Effects দিয়ে অ্যানিমেশন ও মোশন গ্রাফিক্স তৈরি করুন। ভিডিও ইন্ট্রো, লোগো অ্যানিমেশন সব শিখুন।",
    descriptionEn: "Create animations and motion graphics with After Effects. Learn video intros, logo animations.",
    featuresBn: ["After Effects বেসিক", "কীফ্রেম অ্যানিমেশন", "টেক্সট অ্যানিমেশন", "ভিজ্যুয়াল ইফেক্টস"],
    featuresEn: ["After Effects Basics", "Keyframe Animation", "Text Animation", "Visual Effects"]
  },
  {
    id: "vibe-coding",
    nameBn: "ভাইব কোডিং",
    nameEn: "Vibe Coding (AI-Powered Website Building)",
    icon: Zap,
    fee: 4500,
    trainer: trainers.sofiullah,
    color: "from-pink-500 to-rose-500",
    descriptionBn: "কোডিং না জেনেও AI দিয়ে প্রফেশনাল ওয়েবসাইট বানান! AI টুলস ব্যবহার করে সব জেনারেট করুন।",
    descriptionEn: "Build professional websites with AI without knowing coding! Generate everything using AI tools.",
    featuresBn: ["AI ওয়েবসাইট বিল্ডার", "প্রম্পট টু ডিজাইন", "নো-কোড ডেভেলপমেন্ট", "হোস্টিং ও পাবলিশিং"],
    featuresEn: ["AI Website Builder", "Prompt to Design", "No-Code Development", "Hosting & Publishing"],
    isSpecial: true,
    specialContentBn: {
      title: "ভাইব কোডিং কি?",
      points: [
        "কোডিং না জেনেও সম্পূর্ণ ওয়েবসাইট তৈরি করুন",
        "AI টুলস ব্যবহার করে HTML, CSS, ডিজাইন জেনারেট করুন",
        "আইডিয়া → প্রম্পট → ওয়েবসাইট - এই সিম্পল ওয়ার্কফ্লো শিখুন"
      ]
    },
    specialContentEn: {
      title: "What is Vibe Coding?",
      points: [
        "Create complete websites without knowing coding",
        "Generate HTML, CSS, design using AI tools",
        "Learn the simple workflow: Idea → Prompt → Website"
      ]
    }
  },
  {
    id: "ai-prompt",
    nameBn: "AI প্রম্পট ইঞ্জিনিয়ারিং",
    nameEn: "AI Prompt Engineering",
    icon: Bot,
    fee: 3500,
    trainer: trainers.sofiullah,
    color: "from-indigo-500 to-blue-500",
    descriptionBn: "AI টুলস থেকে সেরা আউটপুট পেতে শিখুন। ChatGPT, Midjourney, Claude সহ সব AI-এর জন্য ইফেক্টিভ প্রম্পট লিখুন।",
    descriptionEn: "Learn to get the best output from AI tools. Write effective prompts for ChatGPT, Midjourney, Claude.",
    featuresBn: ["প্রম্পট স্ট্রাকচার", "রোল প্রম্পটিং", "টাস্ক-বেজড প্রম্পট", "AI অটোমেশন"],
    featuresEn: ["Prompt Structure", "Role Prompting", "Task-Based Prompts", "AI Automation"],
    isSpecial: true,
    specialContentBn: {
      title: "AI প্রম্পট ইঞ্জিনিয়ারিং কি শেখায়?",
      points: [
        "AI টুলসের জন্য ইফেক্টিভ প্রম্পট লেখা শিখুন",
        "ডিজাইন, কোডিং, মার্কেটিং, কন্টেন্টে AI ব্যবহার",
        "ChatGPT, Claude, Midjourney সব AI মাস্টার করুন"
      ]
    },
    specialContentEn: {
      title: "What does AI Prompt Engineering teach?",
      points: [
        "Learn to write effective prompts for AI tools",
        "Use AI for design, coding, marketing, content",
        "Master all AI tools: ChatGPT, Claude, Midjourney"
      ]
    }
  }
];

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
    coursesSubtitle: "10 Professional Online Courses - Start Your Career Today",
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
    success: "Your enrollment has been submitted successfully! We will contact you soon."
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
    coursesSubtitle: "১০টি প্রফেশনাল অনলাইন কোর্স - আপনার ক্যারিয়ার শুরু করুন আজই",
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
    success: "আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।"
  }
};

const CoursesPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isBn = language === "bn";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
    paymentType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === formData.course);
  }, [formData.course]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.email || !formData.course || !formData.paymentType) {
      toast.error(t.fillAll);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t.success);
    setFormData({ name: "", mobile: "", email: "", course: "", paymentType: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Animated Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group h-full"
              >
                <div className={`relative h-full flex flex-col rounded-3xl overflow-hidden ${course.isSpecial ? 'ring-2 ring-primary/50' : ''} ${course.isUpcoming ? 'ring-2 ring-amber-500/50' : ''}`}>
                  {/* Gradient Background Header */}
                  <div className={`relative h-36 bg-gradient-to-br ${course.color} p-6`}>
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white/30 rounded-full" />
                      <div className="absolute bottom-2 left-6 w-12 h-12 border-2 border-white/20 rounded-lg rotate-12" />
                    </div>
                    
                    {/* Special Badge */}
                    {course.isSpecial && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {t.special}
                      </div>
                    )}

                    {/* Upcoming Badge */}
                    {course.isUpcoming && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.upcoming}
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <course.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 flex flex-col bg-card border border-border border-t-0 rounded-b-3xl p-6">
                    {/* Course Name & Price Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-display font-bold leading-tight">
                        {isBn ? course.nameBn : course.nameEn}
                      </h3>
                      <div className="flex-shrink-0 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-base font-bold text-primary">৳{course.fee.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {isBn ? course.descriptionBn : course.descriptionEn}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {(isBn ? course.featuresBn : course.featuresEn).slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs bg-secondary/50 rounded-lg px-2 py-1.5">
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Special Content for Vibe Coding & AI Prompt */}
                    {course.isSpecial && (
                      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
                        <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {isBn ? course.specialContentBn?.title : course.specialContentEn?.title}
                        </h4>
                        <ul className="space-y-1">
                          {(isBn ? course.specialContentBn?.points : course.specialContentEn?.points)?.slice(0, 3).map((point, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Trainer with Photo */}
                    <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-secondary/30 border border-border mb-4 mt-auto">
                      <img
                        src={course.trainer.image}
                        alt={course.trainer.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{t.trainer}</p>
                        <p className="text-sm font-semibold truncate">{course.trainer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {isBn ? course.trainer.qualificationBn : course.trainer.qualificationEn}
                        </p>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <a
                      href="#admission"
                      onClick={() => handleInputChange("course", course.id)}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        course.isUpcoming 
                          ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-not-allowed'
                          : course.isSpecial 
                            ? 'bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      {course.isUpcoming ? t.upcoming : t.enrollNow}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                      {courses.filter(c => !c.isUpcoming).map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {isBn ? course.nameBn : course.nameEn} - ৳{course.fee.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trainer Info (Auto-filled) */}
                {selectedCourse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedCourse.trainer.image}
                        alt={selectedCourse.trainer.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                      />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.trainer}</p>
                        <p className="text-sm font-semibold">{selectedCourse.trainer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isBn ? selectedCourse.trainer.qualificationBn : selectedCourse.trainer.qualificationEn}
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                  disabled={isSubmitting}
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
