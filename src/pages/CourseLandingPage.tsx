import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckCircle2, Calendar, Clock, Users, GraduationCap,
  PlayCircle, Sparkles, BookOpen, ArrowRight, AlertCircle, Target,
} from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Extract YouTube video ID from various YouTube URL formats
function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

type Module = { id: string; title: string; description: string | null; order_index: number };
type FAQ = { question: string; answer: string };
type CourseData = {
  course: {
    id: string;
    title: string;
    title_en?: string;
    description?: string;
    description_en?: string;
    short_description?: string;
    short_description_en?: string;
    thumbnail_url?: string;
    price: number;
    course_type?: string;
    landing_slug?: string;
    trainer_name?: string;
    trainer_image?: string;
    trainer_designation?: string;
    trainer_bio?: string;
    trainer_bio_en?: string;
    start_date?: string;
    class_time?: string;
    total_classes?: string;
    duration?: string;
    learning_outcomes?: string[];
    faqs?: FAQ[];
  };
  modules: Module[];
  lesson_count: number;
};

export default function CourseLandingPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isBn = language === 'bn';
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        });
        const j = await res.json();
        if (!alive) return;
        if (!res.ok || !j.success) throw new Error(j.error || 'Failed');
        setData(j);
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const c = data?.course;
  const title = isBn ? c?.title : (c?.title_en || c?.title);
  const desc = isBn ? c?.description : (c?.description_en || c?.description);
  const shortDesc = isBn ? c?.short_description : (c?.short_description_en || c?.short_description);
  const bio = isBn ? c?.trainer_bio : (c?.trainer_bio_en || c?.trainer_bio);
  const outcomes = c?.learning_outcomes ?? [];
  const faqs = c?.faqs ?? [];

  const seoTitle = useMemo(
    () => title ? `${title} | AlphaZero` : 'Course | AlphaZero',
    [title]
  );
  const seoDesc = (shortDesc || desc || '').slice(0, 155);

  // SEO: set title, meta description, canonical, OG, and JSON-LD without react-helmet
  useEffect(() => {
    if (!c) return;
    document.title = seoTitle;
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (!el) {
        if (selector.startsWith('link')) {
          el = document.createElement('link');
          (el as HTMLLinkElement).rel = 'canonical';
        } else {
          el = document.createElement('meta');
          const m = selector.match(/\[(name|property)="([^"]+)"\]/);
          if (m) el.setAttribute(m[1], m[2]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', seoDesc);
    setMeta('link[rel="canonical"]', 'href', `https://alphazero.online/${SLUG}`);
    setMeta('meta[property="og:title"]', 'content', seoTitle);
    setMeta('meta[property="og:description"]', 'content', seoDesc);
    if (c.thumbnail_url) setMeta('meta[property="og:image"]', 'content', c.thumbnail_url);

    const ldId = 'course-landing-jsonld';
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.id = ldId;
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: title,
      description: seoDesc,
      provider: { '@type': 'Organization', name: 'AlphaZero', sameAs: 'https://alphazero.online' },
      image: c.thumbnail_url,
      offers: { '@type': 'Offer', price: c.price, priceCurrency: 'BDT' },
    });
  }, [c, seoTitle, seoDesc, title]);


  const loginHref = '/student/login';
  const signupHref = '/student/login?mode=signup';
  const handleEnroll = () => {
    if (user) {
      navigate(`/student?enroll=${c?.id ?? ''}`);
    } else {
      const next = encodeURIComponent(`/student?enroll=${c?.id ?? ''}`);
      navigate(`/student/login?redirect=${next}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg">
        <div className="container mx-auto px-4 py-20 space-y-8">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !c) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="font-display text-2xl">
              {isBn ? 'কোর্স লোড করা যায়নি' : 'Could not load course'}
            </h1>
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button asChild><Link to="/courses">{isBn ? 'সব কোর্স দেখুন' : 'Browse Courses'}</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg text-foreground">


      {/* Minimal top bar */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold">AlphaZero</Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><a href={loginHref}>{isBn ? 'লগইন' : 'Login'}</a></Button>
            <Button size="sm" onClick={handleEnroll}>{isBn ? 'এনরোল' : 'Enroll'}</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container mx-auto px-4 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> {isBn ? 'প্রিমিয়াম কোর্স' : 'Premium Course'}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            {shortDesc && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{shortDesc}</p>
            )}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-primary">৳{Number(c.price).toLocaleString()}</span>
              {c.course_type && (
                <Badge variant="outline" className="capitalize">{c.course_type.replace('_', ' ')}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" onClick={handleEnroll} className="text-base">
                {isBn ? 'এখনই এনরোল করুন' : 'Enroll Now'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#syllabus">{isBn ? 'সিলেবাস দেখুন' : 'View Syllabus'}</a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 blur-3xl rounded-full" />
            <div className="relative glass-card rounded-2xl overflow-hidden border border-border/50 aspect-video">
              {c.thumbnail_url ? (
                <img src={c.thumbnail_url} alt={title || 'Course'} className="w-full h-full object-cover" loading="eager" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <BookOpen className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {desc && (
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {isBn ? 'কোর্স সম্পর্কে' : 'About this Course'}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
              {desc}
            </p>
          </div>
        </section>
      )}

      {/* WHAT YOU'LL LEARN */}
      {outcomes.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            {isBn ? 'আপনি যা শিখবেন' : "What You'll Learn"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {outcomes.map((o, i) => (
              <div key={i} className="glass-card p-4 rounded-xl flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{o}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODULES */}
      {data!.modules.length > 0 && (
        <section id="syllabus" className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            {isBn ? 'কোর্স মডিউল' : 'Course Modules'}
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {data!.modules.map((m, i) => (
              <Card key={m.id} className="glass-card">
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-display font-bold shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{m.title}</h3>
                    {m.description && <p className="text-sm text-muted-foreground mt-1">{m.description}</p>}
                  </div>
                  <PlayCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* INSTRUCTOR */}
      {c.trainer_name && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            {isBn ? 'আপনার ইন্সট্রাক্টর' : 'Your Instructor'}
          </h2>
          <Card className="glass-card max-w-3xl mx-auto">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {c.trainer_image && (
                <img
                  src={c.trainer_image}
                  alt={c.trainer_name}
                  className="h-32 w-32 md:h-40 md:w-40 rounded-2xl object-cover border border-border/50 shrink-0"
                  loading="lazy"
                />
              )}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className="font-display text-2xl font-bold">{c.trainer_name}</h3>
                {c.trainer_designation && (
                  <p className="text-primary font-medium">{c.trainer_designation}</p>
                )}
                {bio && <p className="text-muted-foreground leading-relaxed pt-2">{bio}</p>}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* SCHEDULE */}
      {(c.start_date || c.class_time || c.total_classes || c.duration) && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            {isBn ? 'কোর্স শিডিউল' : 'Course Schedule'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Calendar, label: isBn ? 'শুরুর তারিখ' : 'Start Date', value: c.start_date },
              { icon: Clock, label: isBn ? 'ক্লাসের সময়' : 'Class Time', value: c.class_time },
              { icon: Users, label: isBn ? 'মোট ক্লাস' : 'Total Classes', value: c.total_classes },
              { icon: GraduationCap, label: isBn ? 'মেয়াদ' : 'Duration', value: c.duration },
            ].filter(x => x.value).map(({ icon: Icon, label, value }) => (
              <Card key={label} className="glass-card text-center">
                <CardContent className="p-5 space-y-2">
                  <Icon className="h-6 w-6 text-primary mx-auto" />
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                  <div className="font-semibold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            {isBn ? 'সাধারণ প্রশ্ন' : 'Frequently Asked Questions'}
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="glass-card rounded-xl border-0 px-5">
                  <AccordionTrigger className="text-left font-semibold">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass-card max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-8 md:p-14 text-center space-y-6 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
              {isBn ? 'আজই আপনার যাত্রা শুরু করুন' : 'Start Your Journey Today'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {isBn
                ? 'এনরোল করুন বা একাউন্ট তৈরি করে শুরু করুন। ইতিমধ্যে একাউন্ট আছে? লগইন করুন।'
                : 'Enroll now or create an account to get started. Already have an account? Log in.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button size="lg" onClick={handleEnroll} className="text-base">
                {isBn ? 'এনরোল করুন' : 'Enroll Now'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={signupHref}>{isBn ? 'সাইন আপ' : 'Sign Up'}</a>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href={loginHref}>{isBn ? 'লগইন' : 'Login'}</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AlphaZero · <Link to="/" className="hover:text-foreground">Home</Link>
      </footer>
    </div>
  );
}
