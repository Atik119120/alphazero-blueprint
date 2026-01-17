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
  Award
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

// Trainers based on existing team members
const trainers = {
  sofiullah: {
    name: "Sofiullah Ahammad",
    qualification: "Graphics Designer, Vibe Coding Expert, Google Knowledge Expert"
  },
  adib: {
    name: "Adib Sarkar",
    qualification: "Lead Designer, Entrepreneur"
  },
  kamrul: {
    name: "Md. Kamrul Hasan",
    qualification: "Microsoft Office Expert, Graphics Designer"
  },
  shafiul: {
    name: "Md. Shafiul Haque",
    qualification: "Web Designer, Video Editor, Cinematographer"
  },
  prantik: {
    name: "Prantik Saha",
    qualification: "Graphics Designer, Microsoft Office Expert, IT Support"
  }
};

// Course data with trainer assignments
const courses = [
  {
    id: "google-knowledge",
    name: "গুগল নলেজ প্যানেল ক্রিয়েশন",
    nameEn: "Google Knowledge Panel Creation",
    icon: Globe,
    fee: 3000,
    trainer: trainers.sofiullah,
    color: "from-blue-500 to-cyan-500",
    description: "গুগলে আপনার ব্র্যান্ড বা ব্যক্তিগত প্রোফাইলের জন্য নলেজ প্যানেল তৈরি করুন। অনলাইনে আপনার পরিচিতি বাড়ান এবং প্রফেশনাল ইমেজ গড়ে তুলুন।",
    features: ["গুগল সার্চ অপ্টিমাইজেশন", "ব্র্যান্ড ভেরিফিকেশন", "উইকিপিডিয়া এন্ট্রি গাইড", "সোশ্যাল প্রোফাইল সেটআপ"]
  },
  {
    id: "microsoft-office",
    name: "মাইক্রোসফট অফিস",
    nameEn: "Microsoft Office (Word, Excel, PowerPoint)",
    icon: Monitor,
    fee: 2000,
    trainer: trainers.kamrul,
    color: "from-orange-500 to-red-500",
    description: "Word, Excel, PowerPoint-এ সম্পূর্ণ দক্ষতা অর্জন করুন। অফিস কাজের জন্য প্রয়োজনীয় সব স্কিল শিখুন।",
    features: ["MS Word মাস্টারি", "Excel ফর্মুলা ও ডাটা এনালাইসিস", "PowerPoint প্রেজেন্টেশন", "অফিস অটোমেশন"]
  },
  {
    id: "graphic-design",
    name: "গ্রাফিক ডিজাইন",
    nameEn: "Graphic Design",
    icon: Palette,
    fee: 4000,
    trainer: trainers.adib,
    color: "from-purple-500 to-pink-500",
    description: "প্রফেশনাল গ্রাফিক ডিজাইন শিখুন। লোগো, ব্যানার, সোশ্যাল মিডিয়া পোস্ট থেকে শুরু করে সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি তৈরি করুন।",
    features: ["Adobe Photoshop", "Adobe Illustrator", "লোগো ও ব্র্যান্ডিং", "সোশ্যাল মিডিয়া ডিজাইন"]
  },
  {
    id: "video-editing",
    name: "ভিডিও এডিটিং",
    nameEn: "Video Editing",
    icon: Video,
    fee: 4500,
    trainer: trainers.shafiul,
    color: "from-red-500 to-orange-500",
    description: "প্রফেশনাল ভিডিও এডিটিং শিখুন। YouTube, Reels, TikTok-এর জন্য আকর্ষণীয় ভিডিও তৈরি করুন।",
    features: ["Adobe Premiere Pro", "কালার গ্রেডিং", "সাউন্ড ডিজাইন", "সোশ্যাল মিডিয়া ভিডিও"]
  },
  {
    id: "photography",
    name: "ফটোগ্রাফি",
    nameEn: "Photography",
    icon: Camera,
    fee: 2500,
    trainer: trainers.shafiul,
    color: "from-amber-500 to-yellow-500",
    description: "ক্যামেরা হ্যান্ডলিং থেকে শুরু করে প্রফেশনাল ফটোগ্রাফি পর্যন্ত সব শিখুন। মোবাইল ও DSLR দুটোতেই দক্ষ হন।",
    features: ["ক্যামেরা বেসিক", "লাইটিং টেকনিক", "ফটো এডিটিং", "পোর্টফোলিও বিল্ডিং"]
  },
  {
    id: "seo-digital-marketing",
    name: "SEO ও ডিজিটাল মার্কেটিং",
    nameEn: "SEO & Digital Marketing",
    icon: TrendingUp,
    fee: 4000,
    trainer: trainers.sofiullah,
    color: "from-green-500 to-emerald-500",
    description: "গুগল র‍্যাঙ্কিং, ফেসবুক মার্কেটিং, এড ক্যাম্পেইন সব শিখুন। আপনার বিজনেস অনলাইনে গ্রো করুন।",
    features: ["অন-পেজ ও অফ-পেজ SEO", "গুগল অ্যাডস", "ফেসবুক ও ইনস্টাগ্রাম মার্কেটিং", "এনালিটিক্স ও রিপোর্টিং"]
  },
  {
    id: "web-coding",
    name: "ওয়েব কোডিং",
    nameEn: "Web Coding (HTML, CSS, JavaScript)",
    icon: Code,
    fee: 5000,
    trainer: trainers.shafiul,
    color: "from-cyan-500 to-blue-500",
    description: "HTML, CSS এবং JavaScript দিয়ে ওয়েবসাইট বানানো শিখুন। বেসিক থেকে প্রফেশনাল লেভেল পর্যন্ত।",
    features: ["HTML5 ফান্ডামেন্টালস", "CSS3 ও Flexbox", "JavaScript বেসিক", "রেস্পন্সিভ ডিজাইন"]
  },
  {
    id: "motion-graphics",
    name: "মোশন গ্রাফিক্স",
    nameEn: "Motion Graphics (After Effects)",
    icon: Sparkles,
    fee: 5500,
    trainer: trainers.shafiul,
    color: "from-violet-500 to-purple-500",
    description: "After Effects দিয়ে অ্যানিমেশন ও মোশন গ্রাফিক্স তৈরি করুন। ভিডিও ইন্ট্রো, লোগো অ্যানিমেশন, ইফেক্টস সব শিখুন।",
    features: ["After Effects বেসিক", "কীফ্রেম অ্যানিমেশন", "টেক্সট অ্যানিমেশন", "ভিজ্যুয়াল ইফেক্টস"]
  },
  {
    id: "vibe-coding",
    name: "ভাইব কোডিং",
    nameEn: "Vibe Coding (AI-Powered Website Building)",
    icon: Zap,
    fee: 4500,
    trainer: trainers.sofiullah,
    color: "from-pink-500 to-rose-500",
    description: "কোডিং না জেনেও AI দিয়ে প্রফেশনাল ওয়েবসাইট বানান! AI টুলস ব্যবহার করে HTML, CSS, ডিজাইন, অ্যানিমেশন সব জেনারেট করুন।",
    features: ["AI ওয়েবসাইট বিল্ডার", "প্রম্পট টু ডিজাইন", "নো-কোড ডেভেলপমেন্ট", "হোস্টিং ও পাবলিশিং"],
    isSpecial: true,
    specialContent: {
      title: "ভাইব কোডিং কি?",
      points: [
        "কোডিং না জেনেও সম্পূর্ণ ওয়েবসাইট তৈরি করুন",
        "AI টুলস ব্যবহার করে HTML, CSS, ডিজাইন, অ্যানিমেশন জেনারেট করুন",
        "সঠিক প্রম্পট দিয়ে AI থেকে কোড নিন, নিজে লিখতে হবে না",
        "আইডিয়া → প্রম্পট → ওয়েবসাইট - এই সিম্পল ওয়ার্কফ্লো শিখুন",
        "AI ওয়েবসাইট বিল্ডার, এডিটর ও হোস্টিং প্ল্যাটফর্ম ব্যবহার করে রিয়েল ওয়েবসাইট বানান"
      ]
    }
  },
  {
    id: "ai-prompt",
    name: "AI প্রম্পট ইঞ্জিনিয়ারিং",
    nameEn: "AI Prompt Engineering",
    icon: Bot,
    fee: 3500,
    trainer: trainers.sofiullah,
    color: "from-indigo-500 to-blue-500",
    description: "AI টুলস থেকে সেরা আউটপুট পেতে শিখুন। ChatGPT, Midjourney, Claude সহ সব AI-এর জন্য ইফেক্টিভ প্রম্পট লিখুন।",
    features: ["প্রম্পট স্ট্রাকচার", "রোল প্রম্পটিং", "টাস্ক-বেজড প্রম্পট", "AI অটোমেশন"],
    isSpecial: true,
    specialContent: {
      title: "AI প্রম্পট ইঞ্জিনিয়ারিং কি শেখায়?",
      points: [
        "AI টুলসের জন্য ইফেক্টিভ প্রম্পট লেখা শিখুন",
        "প্রম্পট স্ট্রাকচার, রোল প্রম্পটিং ও টাস্ক-বেজড প্রম্পটিং",
        "ডিজাইন, কোডিং, মার্কেটিং, কন্টেন্ট ও অটোমেশনে AI ব্যবহার",
        "AI-কে আপনার পার্সোনাল অ্যাসিস্ট্যান্ট, ডিজাইনার ও ডেভেলপার হিসেবে ব্যবহার করুন",
        "ChatGPT, Claude, Midjourney, DALL-E সহ সব AI মাস্টার করুন"
      ]
    }
  }
];

const CoursesPage = () => {
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
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
    setFormData({ name: "", mobile: "", email: "", course: "", paymentType: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* SEO Meta - handled via index.html */}
      
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
              <span className="text-primary font-medium">১০০% অনলাইন-ভিত্তিক কোর্স</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-7xl font-display font-bold mb-6"
            >
              <span className="gradient-text">Alpha Academy</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              প্র্যাক্টিক্যাল, জব-রেডি ও AI-পাওয়ার্ড স্কিল শিখুন। কোনো টেকনিক্যাল জ্ঞান ছাড়াই ওয়েবসাইট, ব্র্যান্ড ও ডিজিটাল ক্যারিয়ার গড়ুন।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm">বিগিনার-ফ্রেন্ডলি</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm">সার্টিফিকেট প্রদান</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm">এক্সপার্ট ট্রেইনার</span>
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
              Alpha Academy <span className="gradient-text">সম্পর্কে</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Alpha Academy প্র্যাক্টিক্যাল, জব-রেডি এবং AI-পাওয়ার্ড স্কিল শেখায় যাতে শিক্ষার্থীরা গভীর টেকনিক্যাল জ্ঞান ছাড়াই 
              ওয়েবসাইট, ব্র্যান্ড এবং ডিজিটাল ক্যারিয়ার গড়ে তুলতে পারে। আমাদের সব কোর্স ১০০% অনলাইন-ভিত্তিক, 
              বিগিনার ও আধুনিক শিক্ষার্থীদের জন্য ডিজাইন করা এবং বাংলাদেশের বাজারের জন্য সাশ্রয়ী মূল্যে।
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
              আমাদের <span className="gradient-text">কোর্সসমূহ</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ১০টি প্রফেশনাল অনলাইন কোর্স - আপনার ক্যারিয়ার শুরু করুন আজই
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
                className="group"
              >
                <div className={`relative h-full rounded-3xl overflow-hidden ${course.isSpecial ? 'ring-2 ring-primary/50' : ''}`}>
                  {/* Gradient Background Header */}
                  <div className={`relative h-32 bg-gradient-to-br ${course.color} p-6`}>
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white/30 rounded-full" />
                      <div className="absolute bottom-2 left-6 w-12 h-12 border-2 border-white/20 rounded-lg rotate-12" />
                    </div>
                    
                    {/* Special Badge */}
                    {course.isSpecial && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        স্পেশাল
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <course.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="bg-card border border-border border-t-0 rounded-b-3xl p-6">
                    {/* Course Name & Price Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-xl font-display font-bold leading-tight">{course.name}</h3>
                      <div className="flex-shrink-0 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-lg font-bold text-primary">৳{course.fee.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {course.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs bg-secondary/50 rounded-lg px-2 py-1.5">
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Special Content for Vibe Coding & AI Prompt */}
                    {course.isSpecial && course.specialContent && (
                      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
                        <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {course.specialContent.title}
                        </h4>
                        <ul className="space-y-1">
                          {course.specialContent.points.slice(0, 3).map((point, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Trainer */}
                    <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-secondary/30 border border-border mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{course.trainer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{course.trainer.qualification}</p>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <a
                      href="#admission"
                      onClick={() => handleInputChange("course", course.id)}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        course.isSpecial 
                          ? 'bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      এখনই ভর্তি হন
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
                অনলাইন <span className="gradient-text">ভর্তি ফর্ম</span>
              </h2>
              <p className="text-muted-foreground">
                আপনার পছন্দের কোর্সে এখনই ভর্তি হন - সহজ অনলাইন প্রক্রিয়া
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    শিক্ষার্থীর পূর্ণ নাম
                  </Label>
                  <Input
                    id="name"
                    placeholder="আপনার নাম লিখুন"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    মোবাইল নম্বর
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
                    ইমেইল
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
                    কোর্স নির্বাচন করুন
                  </Label>
                  <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="কোর্স সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - ৳{course.fee.toLocaleString()}
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
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium">ট্রেইনার:</span>
                      <span>{selectedCourse.trainer.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      {selectedCourse.trainer.qualification}
                    </p>
                  </motion.div>
                )}

                {/* Payment Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    পেমেন্ট অপশন
                  </Label>
                  <Select value={formData.paymentType} onValueChange={(value) => handleInputChange("paymentType", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="পেমেন্ট অপশন সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">সম্পূর্ণ পেমেন্ট (একবারে)</SelectItem>
                      <SelectItem value="installment">কিস্তিতে পেমেন্ট (২ কিস্তি)</SelectItem>
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
                      প্রসেস হচ্ছে...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Enroll Online – Alpha Academy
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
              আপনার ডিজিটাল ক্যারিয়ার <span className="gradient-text">শুরু করুন আজই</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              ১০০% অনলাইন কোর্স • বিগিনার-ফ্রেন্ডলি • সার্টিফিকেট প্রদান • এক্সপার্ট ট্রেইনার
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#admission"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                <GraduationCap className="w-5 h-5" />
                এখনই ভর্তি হন
              </a>
              <a
                href="https://wa.me/+8801776965533"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                WhatsApp-এ যোগাযোগ
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;
