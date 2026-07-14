import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Save, Loader2, ChevronRight, Sparkles, GraduationCap, BookOpen,
  Users, Phone, Target, Rocket, PlayCircle, Info, MessageCircle, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Field {
  key: string;
  label: string;
  description?: string;
  type?: "input" | "textarea";
  fallback: string;
}

interface Section {
  id: string;
  page: string; // page_name in DB (site_scope always 'learn')
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  fields: Field[];
}

const SECTIONS: Section[] = [
  // ============= COURSES PAGE =============
  {
    id: "courses-hero",
    page: "courses",
    label: "Courses — Hero",
    hint: "Top hero on /courses (rotating headline & CTA)",
    icon: GraduationCap,
    gradient: "from-sky-500 to-blue-600",
    fields: [
      { key: "hero.prefix.bn", label: "🇧🇩 Hero Prefix (Bangla)", description: "Left part before rotating word", fallback: "শিখুন কিছু" },
      { key: "hero.prefix.en", label: "🇬🇧 Hero Prefix (English)", fallback: "Learn something" },
      { key: "hero.rotating1.bn", label: "🔁 Rotating Word 1 (BN)", fallback: "নতুন" },
      { key: "hero.rotating1.en", label: "🔁 Rotating Word 1 (EN)", fallback: "new" },
      { key: "hero.rotating2.bn", label: "🔁 Rotating Word 2 (BN)", fallback: "সৃজনশীল" },
      { key: "hero.rotating2.en", label: "🔁 Rotating Word 2 (EN)", fallback: "creative" },
      { key: "hero.rotating3.bn", label: "🔁 Rotating Word 3 (BN)", fallback: "দুর্দান্ত" },
      { key: "hero.rotating3.en", label: "🔁 Rotating Word 3 (EN)", fallback: "amazing" },
      { key: "hero.cta.bn", label: "🔘 CTA Button (BN)", fallback: "কোর্স দেখুন" },
      { key: "hero.cta.en", label: "🔘 CTA Button (EN)", fallback: "Browse Courses" },
    ],
  },
  {
    id: "courses-grid",
    page: "courses",
    label: "Courses — Grid Heading",
    hint: "Section heading above the courses grid",
    icon: BookOpen,
    gradient: "from-violet-500 to-purple-600",
    fields: [
      { key: "grid.title.bn", label: "📚 Grid Title (BN)", description: "Word 'course' or 'কোর্স' will be highlighted", fallback: "জনপ্রিয় কোর্স" },
      { key: "grid.title.en", label: "📚 Grid Title (EN)", fallback: "Popular Courses" },
    ],
  },
  {
    id: "courses-instructors",
    page: "courses",
    label: "Courses — Instructors Section",
    hint: "Instructors section on /courses & /instructors",
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    fields: [
      { key: "instructors.badge.bn", label: "🔖 Badge (BN)", fallback: "আমাদের টিম" },
      { key: "instructors.badge.en", label: "🔖 Badge (EN)", fallback: "Our Team" },
      { key: "instructors.title1.bn", label: "👥 Title Prefix (BN)", fallback: "এক্সপার্ট" },
      { key: "instructors.title1.en", label: "👥 Title Prefix (EN)", fallback: "Expert" },
      { key: "instructors.title2.bn", label: "👥 Title Highlight (BN)", fallback: "ইনস্ট্রাক্টর" },
      { key: "instructors.title2.en", label: "👥 Title Highlight (EN)", fallback: "Instructors" },
      { key: "instructors.desc.bn", label: "📝 Description (BN)", type: "textarea", fallback: "ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে সরাসরি শিখুন।" },
      { key: "instructors.desc.en", label: "📝 Description (EN)", type: "textarea", fallback: "Learn directly from industry experts." },
    ],
  },
  {
    id: "courses-cta",
    page: "courses",
    label: "Courses — Contact / CTA",
    hint: "Bottom CTA & contact section on /courses",
    icon: Phone,
    gradient: "from-amber-500 to-orange-600",
    fields: [
      { key: "cta.badge.bn", label: "🔖 Badge (BN)", fallback: "যোগাযোগ" },
      { key: "cta.badge.en", label: "🔖 Badge (EN)", fallback: "Get in Touch" },
      { key: "cta.title.bn", label: "🚀 Title (BN)", fallback: "শুরু করুন আপনার ক্যারিয়ার" },
      { key: "cta.title.en", label: "🚀 Title (EN)", fallback: "Start your career" },
      { key: "cta.title2.bn", label: "🚀 Title Highlight (BN)", fallback: "আজই" },
      { key: "cta.title2.en", label: "🚀 Title Highlight (EN)", fallback: "today" },
      { key: "cta.subtitle.bn", label: "📝 Subtitle (BN)", type: "textarea", fallback: "নতুন স্কিল শিখুন, দক্ষতা তৈরি করুন এবং ইন্ডাস্ট্রিতে জায়গা করে নিন।" },
      { key: "cta.subtitle.en", label: "📝 Subtitle (EN)", type: "textarea", fallback: "Learn new skills, build expertise and stand out in the industry." },
      { key: "cta.phone", label: "📞 Phone", fallback: "+880 1776-965533" },
      { key: "cta.email", label: "📧 Email", fallback: "learn@alphazero.online" },
    ],
  },

  // ============= LEARN ABOUT PAGE =============
  {
    id: "labout-hero",
    page: "learn-about",
    label: "Learn About — Hero",
    hint: "Top of /learn-about (badge, headline, description)",
    icon: Sparkles,
    gradient: "from-fuchsia-500 to-pink-600",
    fields: [
      { key: "hero.badge.bn", label: "🔖 Badge (BN)", fallback: "আমাদের সম্পর্কে" },
      { key: "hero.badge.en", label: "🔖 Badge (EN)", fallback: "About Learn" },
      { key: "hero.title.bn", label: "🏫 Title Prefix (BN)", fallback: "শিখুন " },
      { key: "hero.title.en", label: "🏫 Title Prefix (EN)", fallback: "Learn with " },
      { key: "hero.description.bn", label: "📝 Description (BN)", type: "textarea", fallback: "AlphaZero-এর নিজস্ব লার্নিং প্ল্যাটফর্ম — যেখানে ডিজাইন, ডেভেলপমেন্ট, ফটোগ্রাফি ও ডিজিটাল ক্রিয়েটিভ স্কিল শেখানো হয় প্র্যাকটিকাল ও প্রফেশনাল উপায়ে।" },
      { key: "hero.description.en", label: "📝 Description (EN)", type: "textarea", fallback: "AlphaZero's very own learning platform — teaching design, development, photography, and digital creative skills the practical, professional way." },
    ],
  },
  {
    id: "labout-mission",
    page: "learn-about",
    label: "Learn About — Mission",
    hint: "Mission section (badge, title, paragraph, tagline)",
    icon: Rocket,
    gradient: "from-violet-500 to-purple-600",
    fields: [
      { key: "mission.tagline.bn", label: "✨ Tagline (BN)", fallback: "শেখো • তৈরি করো • এগিয়ে যাও" },
      { key: "mission.tagline.en", label: "✨ Tagline (EN)", fallback: "Learn • Create • Grow" },
      { key: "mission.badge.bn", label: "🔖 Badge (BN)", fallback: "আমাদের মিশন" },
      { key: "mission.badge.en", label: "🔖 Badge (EN)", fallback: "Our Mission" },
      { key: "mission.title.bn", label: "🎯 Title Prefix (BN)", fallback: "বাংলাদেশের ক্রিয়েটরদের জন্য একটি " },
      { key: "mission.title.en", label: "🎯 Title Prefix (EN)", fallback: "A modern learning home for " },
      { key: "mission.title2.bn", label: "🎯 Title Highlight (BN)", fallback: "আধুনিক শিক্ষা প্ল্যাটফর্ম" },
      { key: "mission.title2.en", label: "🎯 Title Highlight (EN)", fallback: "Bangladeshi creators" },
      { key: "mission.desc.bn", label: "📝 Description (BN)", type: "textarea", fallback: "Learn with AlphaZero হলো AlphaZero এজেন্সির লার্নিং শাখা।" },
      { key: "mission.desc.en", label: "📝 Description (EN)", type: "textarea", fallback: "Learn with AlphaZero is the education arm of the AlphaZero agency." },
      { key: "mission.whyTitle.bn", label: "✅ Why Heading (BN)", fallback: "কেন Learn with AlphaZero?" },
      { key: "mission.whyTitle.en", label: "✅ Why Heading (EN)", fallback: "Why Learn with AlphaZero?" },
    ],
  },
  {
    id: "labout-features",
    page: "learn-about",
    label: "Learn About — Features",
    hint: "Platform Features section heading",
    icon: PlayCircle,
    gradient: "from-emerald-500 to-teal-600",
    fields: [
      { key: "features.badge.bn", label: "🔖 Badge (BN)", fallback: "প্ল্যাটফর্ম ফিচার" },
      { key: "features.badge.en", label: "🔖 Badge (EN)", fallback: "Platform Features" },
      { key: "features.title.bn", label: "🎬 Title Prefix (BN)", fallback: "যা যা পাচ্ছেন এই " },
      { key: "features.title.en", label: "🎬 Title Prefix (EN)", fallback: "Everything you get on " },
      { key: "features.title2.bn", label: "🎬 Title Suffix (BN)", fallback: " প্ল্যাটফর্মে" },
      { key: "features.title2.en", label: "🎬 Title Suffix (EN)", fallback: " platform" },
    ],
  },
  {
    id: "labout-values",
    page: "learn-about",
    label: "Learn About — Core Values",
    hint: "Core Values section heading",
    icon: Target,
    gradient: "from-amber-500 to-orange-600",
    fields: [
      { key: "values.badge.bn", label: "🔖 Badge (BN)", fallback: "আমাদের মূল্যবোধ" },
      { key: "values.badge.en", label: "🔖 Badge (EN)", fallback: "Core Values" },
      { key: "values.title.bn", label: "💎 Title (BN)", fallback: "যে নীতিতে আমরা কোর্স তৈরি করি" },
      { key: "values.title.en", label: "💎 Title (EN)", fallback: "The principles behind every course" },
    ],
  },
  {
    id: "labout-instructors",
    page: "learn-about",
    label: "Learn About — Instructors",
    hint: "Instructors section heading",
    icon: Users,
    gradient: "from-rose-500 to-pink-600",
    fields: [
      { key: "linstructors.badge.bn", label: "🔖 Badge (BN)", fallback: "আমাদের টিম" },
      { key: "linstructors.badge.en", label: "🔖 Badge (EN)", fallback: "Our Team" },
      { key: "linstructors.title.bn", label: "👥 Title Prefix (BN)", fallback: "এক্সপার্ট " },
      { key: "linstructors.title.en", label: "👥 Title Prefix (EN)", fallback: "Expert " },
      { key: "linstructors.title2.bn", label: "👥 Title Highlight (BN)", fallback: "ইনস্ট্রাক্টর" },
      { key: "linstructors.title2.en", label: "👥 Title Highlight (EN)", fallback: "Instructors" },
      { key: "linstructors.desc.bn", label: "📝 Description (BN)", type: "textarea", fallback: "ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে সরাসরি শিখুন।" },
      { key: "linstructors.desc.en", label: "📝 Description (EN)", type: "textarea", fallback: "Learn directly from industry experts." },
    ],
  },
  {
    id: "labout-cta",
    page: "learn-about",
    label: "Learn About — CTA",
    hint: "Bottom CTA section",
    icon: Rocket,
    gradient: "from-sky-500 to-indigo-600",
    fields: [
      { key: "lcta.title.bn", label: "🚀 Title (BN)", fallback: "আজই শুরু করুন আপনার শেখার যাত্রা" },
      { key: "lcta.title.en", label: "🚀 Title (EN)", fallback: "Start your learning journey today" },
      { key: "lcta.desc.bn", label: "📝 Description (BN)", type: "textarea", fallback: "AlphaZero এর সাথে শিখুন, তৈরি করুন এবং আপনার ক্যারিয়ার এগিয়ে নিন।" },
      { key: "lcta.desc.en", label: "📝 Description (EN)", type: "textarea", fallback: "Learn with AlphaZero, build real work, and grow your career." },
      { key: "lcta.btn1.bn", label: "🔘 Button 1 (BN)", fallback: "সব কোর্স দেখুন" },
      { key: "lcta.btn1.en", label: "🔘 Button 1 (EN)", fallback: "Browse Courses" },
      { key: "lcta.btn2.bn", label: "🔘 Button 2 (BN)", fallback: "যোগাযোগ করুন" },
      { key: "lcta.btn2.en", label: "🔘 Button 2 (EN)", fallback: "Contact Us" },
    ],
  },

  // ============= LEARN CONTACT PAGE =============
  {
    id: "lcontact-hero",
    page: "learn-contact",
    label: "Learn Contact — Hero",
    hint: "Top hero of /learn-contact",
    icon: MessageCircle,
    gradient: "from-blue-500 to-cyan-600",
    fields: [
      { key: "hero.badge.bn", label: "🔖 Badge (BN)", fallback: "লার্ন সাপোর্ট" },
      { key: "hero.badge.en", label: "🔖 Badge (EN)", fallback: "Learn Support" },
      { key: "hero.title.bn", label: "💬 Title Prefix (BN)", fallback: "শিখতে চান? " },
      { key: "hero.title.en", label: "💬 Title Prefix (EN)", fallback: "Learning? " },
      { key: "hero.title2.bn", label: "💬 Title Highlight (BN)", fallback: "আমরা সাহায্য করব" },
      { key: "hero.title2.en", label: "💬 Title Highlight (EN)", fallback: "We're here to help" },
      { key: "hero.description.bn", label: "📝 Description (BN)", type: "textarea", fallback: "কোর্স, এনরোলমেন্ট বা পেমেন্ট সংক্রান্ত যেকোনো প্রশ্ন — আমাদের একাডেমী টিম ২৪ ঘন্টার মধ্যে উত্তর দেবে।" },
      { key: "hero.description.en", label: "📝 Description (EN)", type: "textarea", fallback: "Any question about courses, enrollment or payment — our academy team responds within 24 hours." },
    ],
  },
  {
    id: "lcontact-form",
    page: "learn-contact",
    label: "Learn Contact — Form Heading",
    hint: "Form section badge and heading",
    icon: Info,
    gradient: "from-violet-500 to-fuchsia-600",
    fields: [
      { key: "form.badge.bn", label: "🔖 Badge (BN)", fallback: "মেসেজ পাঠান" },
      { key: "form.badge.en", label: "🔖 Badge (EN)", fallback: "Send a Message" },
      { key: "form.title.bn", label: "📝 Title (BN)", fallback: "আপনার প্রশ্ন লিখুন" },
      { key: "form.title.en", label: "📝 Title (EN)", fallback: "Tell us your question" },
    ],
  },
  {
    id: "lcontact-info",
    page: "learn-contact",
    label: "Learn Contact — Contact Info",
    hint: "Phone, email, address, support hours",
    icon: MapPin,
    gradient: "from-emerald-500 to-teal-600",
    fields: [
      { key: "learn.phone", label: "📞 Phone", fallback: "+880 1344-497808" },
      { key: "learn.email", label: "📧 Email", fallback: "support@learn.alphazero.online" },
      { key: "learn.address", label: "📍 Address (BN)", fallback: "ঢাকা, বাংলাদেশ" },
      { key: "learn.address.en", label: "📍 Address (EN)", fallback: "Dhaka, Bangladesh" },
      { key: "info.hours.bn", label: "🕒 Support Hours (BN)", fallback: "শনি — বৃহস্পতি, ১০টা — ১০টা" },
      { key: "info.hours.en", label: "🕒 Support Hours (EN)", fallback: "Sat — Thu, 10am — 10pm" },
    ],
  },
];

const ALL_FIELDS_BY_PAGE = SECTIONS.reduce<Record<string, Field[]>>((acc, s) => {
  acc[s.page] = [...(acc[s.page] || []), ...s.fields];
  return acc;
}, {});

export default function LearnPagesEditor() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>(SECTIONS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["learn-pages-editor"],
    queryFn: async () => {
      const pages = Object.keys(ALL_FIELDS_BY_PAGE);
      const { data, error } = await supabase
        .from("page_content")
        .select("page_name, content_key, content_en")
        .in("page_name", pages)
        .eq("site_scope", "learn");
      if (error) throw error;
      return data as { page_name: string; content_key: string; content_en: string | null }[];
    },
  });

  useEffect(() => {
    const map: Record<string, string> = {};
    SECTIONS.forEach((s) => {
      s.fields.forEach((f) => {
        const row = data?.find((r) => r.page_name === s.page && r.content_key === f.key);
        map[`${s.page}::${f.key}`] = row?.content_en ?? f.fallback;
      });
    });
    setValues(map);
  }, [data]);

  const selected = SECTIONS.find((s) => s.id === selectedId)!;

  const saveMutation = useMutation({
    mutationFn: async (section: Section) => {
      const rows = section.fields.map((f) => ({
        page_name: section.page,
        content_key: f.key,
        content_en: values[`${section.page}::${f.key}`] ?? "",
        site_scope: "learn",
      }));
      const { error } = await supabase
        .from("page_content")
        .upsert(rows, { onConflict: "site_scope,page_name,content_key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Section saved");
      queryClient.invalidateQueries({ queryKey: ["learn-pages-editor"] });
      queryClient.invalidateQueries({ queryKey: ["page-content-public"] });
      queryClient.invalidateQueries({ queryKey: ["all-page-content"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Learn Site Pages Editor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edit every section across Courses, Learn About and Learn Contact pages.
          Bilingual — separate Bangla and English inputs.
        </p>
      </div>

      {/* Section cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              className={cn(
                "text-left rounded-xl border p-4 h-full min-h-[132px] flex gap-3 transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 hover:border-border hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-lg flex items-center justify-center text-white bg-gradient-to-br shrink-0",
                  s.gradient
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col h-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm">{s.label}</div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      active && "translate-x-0.5 text-primary"
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{s.hint}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor for selected section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br",
                  selected.gradient
                )}
              >
                <selected.icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{selected.label}</CardTitle>
                <CardDescription>{selected.hint}</CardDescription>
              </div>
            </div>
            <Button
              onClick={() => saveMutation.mutate(selected)}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {selected.fields.map((f) => {
              const stateKey = `${selected.page}::${f.key}`;
              return (
                <div
                  key={f.key}
                  className={cn(
                    "space-y-1.5",
                    f.type === "textarea" && "md:col-span-2"
                  )}
                >
                  <Label className="font-semibold">{f.label}</Label>
                  {f.description && (
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  )}
                  {f.type === "textarea" ? (
                    <Textarea
                      rows={3}
                      value={values[stateKey] ?? ""}
                      onChange={(e) =>
                        setValues({ ...values, [stateKey]: e.target.value })
                      }
                    />
                  ) : (
                    <Input
                      value={values[stateKey] ?? ""}
                      onChange={(e) =>
                        setValues({ ...values, [stateKey]: e.target.value })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
