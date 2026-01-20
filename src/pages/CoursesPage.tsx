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

// Default icon mapping for courses based on title keywords
const getIconForCourse = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('google') || lowerTitle.includes('knowledge')) return Globe;
  if (lowerTitle.includes('microsoft') || lowerTitle.includes('office')) return Monitor;
  if (lowerTitle.includes('graphic') || lowerTitle.includes('design')) return Palette;
  if (lowerTitle.includes('video') || lowerTitle.includes('editing')) return Video;
  if (lowerTitle.includes('photo')) return Camera;
  if (lowerTitle.includes('seo') || lowerTitle.includes('marketing')) return TrendingUp;
  if (lowerTitle.includes('web') || lowerTitle.includes('coding') || lowerTitle.includes('html')) return Code;
  if (lowerTitle.includes('motion') || lowerTitle.includes('after effects')) return Sparkles;
  if (lowerTitle.includes('ai') || lowerTitle.includes('prompt')) return Bot;
  if (lowerTitle.includes('vibe')) return Zap;
  if (lowerTitle.includes('it') || lowerTitle.includes('support')) return Wrench;
  return BookOpen;
};

// Default gradient colors based on course index
const gradientColors = [
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
  "from-red-500 to-orange-500",
  "from-amber-500 to-yellow-500",
  "from-green-500 to-emerald-500",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-slate-500 to-zinc-600",
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
    coursesSubtitle: "Professional Online Courses - Start Your Career Today",
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
    paymentType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCourse = useMemo(() => {
    return dbCourses.find(c => c.id === formData.course);
  }, [formData.course, dbCourses]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.email || !formData.password || !formData.course || !formData.paymentType) {
      toast.error(t.fillAll);
      return;
    }

    if (formData.password.length < 6) {
      toast.error(isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create student account using the edge function
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

      // If account created successfully, create enrollment request
      if (studentData?.user?.id && selectedCourse) {
        await supabase.from('enrollment_requests').insert({
          user_id: studentData.user.id,
          course_id: selectedCourse.id,
          student_name: formData.name,
          student_email: formData.email,
          message: `Mobile: ${formData.mobile}, Payment: ${formData.paymentType}`,
          status: 'pending',
        });
      }
      
      toast.success(t.success);
      setFormData({ name: "", mobile: "", email: "", password: "", course: "", paymentType: "" });
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

          {/* No Courses State */}
          {!coursesLoading && dbCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.noCourses}</h3>
              <p className="text-muted-foreground">{t.noCoursesDesc}</p>
            </div>
          )}

          {/* Courses Grid */}
          {!coursesLoading && dbCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
              {dbCourses.map((course, index) => {
                const CourseIcon = getIconForCourse(course.title);
                const gradientColor = gradientColors[index % gradientColors.length];
                
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group h-full"
                  >
                    <div className="relative h-full flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden">
                      {/* Gradient Background Header */}
                      <div className={`relative h-28 sm:h-36 bg-gradient-to-br ${gradientColor} p-4 sm:p-6`}>
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/30 rounded-full" />
                          <div className="absolute bottom-2 left-4 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-2 border-white/20 rounded-lg rotate-12" />
                        </div>
                        
                        {/* Thumbnail if available */}
                        {course.thumbnail_url && (
                          <div className="absolute inset-0">
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover opacity-30"
                            />
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
                            {course.title}
                          </h3>
                          {course.price !== null && course.price > 0 && (
                            <div className="flex-shrink-0 px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                              <span className="text-sm sm:text-base font-bold text-primary">৳{course.price.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {course.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                            {course.description}
                          </p>
                        )}

                        {/* Features - show some generic features */}
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs bg-secondary/50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5">
                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{isBn ? "অনলাইন ক্লাস" : "Online Classes"}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs bg-secondary/50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5">
                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{isBn ? "সার্টিফিকেট" : "Certificate"}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs bg-secondary/50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5">
                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{isBn ? "লাইফটাইম অ্যাক্সেস" : "Lifetime Access"}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs bg-secondary/50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5">
                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{isBn ? "সাপোর্ট" : "Support"}</span>
                          </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Enroll Button */}
                        <a
                          href="#admission"
                          onClick={() => handleInputChange("course", course.id)}
                          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                        >
                          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {t.enrollNow}
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
                      {dbCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} {course.price ? `- ৳${course.price.toLocaleString()}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Course Info */}
                {selectedCourse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{selectedCourse.title}</p>
                        {selectedCourse.price && (
                          <p className="text-xs text-primary font-medium">৳{selectedCourse.price.toLocaleString()}</p>
                        )}
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
