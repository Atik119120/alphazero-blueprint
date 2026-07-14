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
  Save, Loader2, ChevronRight, Sparkles, BookOpen, Target, MapPin, CheckCircle, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploader from "./ImageUploader";


interface Field {
  key: string;
  label: string;
  description?: string;
  type?: "input" | "textarea" | "image";
  fallback: string;
}


interface Section {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  fields: Field[];
}

const SECTIONS: Section[] = [
  {
    id: "hero",
    label: "Hero Section",
    hint: "Top badge, title, and description at the very top of the About page",
    icon: Sparkles,
    gradient: "from-sky-500 to-blue-600",
    fields: [
      { key: "subtitle", label: "🔖 Top Badge", description: "Small uppercase text above the title", fallback: "About Us" },
      { key: "title", label: "🏢 Hero Title", description: "Before the highlighted 'AlphaZero' word", fallback: "Meet" },
      { key: "description", label: "📝 Description", description: "Paragraph shown below the title", type: "textarea", fallback: "A creative studio crafting bold brands and impactful design." },
      { key: "tagline", label: "⚡ Founder Tagline", description: "Short tagline shown under founder name", fallback: "From zero to impact" },
      { key: "badge.agency", label: "🏷️ Founder Badge", description: "Small chip beside founder role (e.g., Agency)", fallback: "Agency" },
      { key: "whyChoose", label: "✅ 'Why Choose' Heading", description: "Header line above the 5 reasons list", fallback: "Why choose AlphaZero" },
    ],
  },
  {
    id: "founder",
    label: "Meet The Founder",
    hint: "Top badge, heading, and role text of the founder section (image + socials edit in Team Management)",
    icon: User,
    gradient: "from-fuchsia-500 to-pink-600",
    fields: [
      { key: "founder.badge", label: "🔖 Top Badge", description: "Small uppercase chip above the heading", fallback: "Meet The Founder" },
      { key: "founder.title", label: "📣 Heading (before AlphaZero)", fallback: "The Visionary Behind" },
      { key: "founder.title2", label: "📣 Heading (after AlphaZero)", description: "Leave empty if not needed", fallback: "" },
      { key: "founder.role", label: "🎯 Role Text", description: "Shown under founder name (both on image + info side)", fallback: "Photographer, Founder & Graphic Designer" },
    ],
  },
  {
    id: "story",
    label: "Our Story",
    hint: "Story section — badge, title, logo image, and the 3 cards below",
    icon: BookOpen,
    gradient: "from-violet-500 to-purple-600",
    fields: [
      { key: "story.badge", label: "🔖 Story Badge", fallback: "Our Story" },
      { key: "story.title", label: "📖 Story Title (before AlphaZero)", fallback: "The story behind" },
      { key: "story.title2", label: "📖 Story Title (after AlphaZero)", fallback: "" },
      { key: "story.logoUrl", label: "🖼️ Logo / Image", description: "Image shown in the tagline card (leave empty to use default AlphaZero logo)", type: "image", fallback: "" },
      { key: "story.card1.title", label: "🚀 Card 1 Title", fallback: "Launched with vision" },
      { key: "story.card1.desc", label: "🚀 Card 1 Description", type: "textarea", fallback: "Started with a bold idea and endless creativity." },
      { key: "story.card2.title", label: "⚡ Card 2 Title", fallback: "Built for impact" },
      { key: "story.card2.desc", label: "⚡ Card 2 Description", type: "textarea", fallback: "Every project we take on aims to make a real difference." },
      { key: "story.card3.title", label: "❤️ Card 3 Title", fallback: "Crafted with love" },
      { key: "story.card3.desc", label: "❤️ Card 3 Description", type: "textarea", fallback: "Design, strategy, and passion in every pixel." },
    ],
  },

  {
    id: "why",
    label: "Why Choose Us (5 points)",
    hint: "The 5 short reasons listed next to the founder",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-teal-600",
    fields: [
      { key: "why1", label: "✅ Reason 1", fallback: "Bold, distinctive design" },
      { key: "why2", label: "✅ Reason 2", fallback: "Client-first approach" },
      { key: "why3", label: "✅ Reason 3", fallback: "Fast turnaround" },
      { key: "why4", label: "✅ Reason 4", fallback: "Global-standard quality" },
      { key: "why5", label: "✅ Reason 5", fallback: "End-to-end creative partner" },
    ],
  },
  {
    id: "values",
    label: "Core Values",
    hint: "3 core value cards (Brand-focused / Zero-to-impact / Global Reach)",
    icon: Target,
    gradient: "from-amber-500 to-orange-600",
    fields: [
      { key: "values.title", label: "💎 Section Title", fallback: "Our Core Values" },
      { key: "values.subtitle", label: "💎 Section Subtitle", type: "textarea", fallback: "What drives every decision we make." },
      { key: "values.brandFocused", label: "🎯 Brand-Focused Title", fallback: "Brand-Focused" },
      { key: "values.brandFocusedDesc", label: "🎯 Brand-Focused Description", type: "textarea", fallback: "We build brands that stand out and stand for something." },
      { key: "values.zeroToImpact", label: "⚡ Zero-to-Impact Title", fallback: "Zero to Impact" },
      { key: "values.zeroToImpactDesc", label: "⚡ Zero-to-Impact Description", type: "textarea", fallback: "Turning raw ideas into results that matter." },
      { key: "values.globalReach", label: "🌐 Global Reach Title", fallback: "Global Reach" },
      { key: "values.globalReachDesc", label: "🌐 Global Reach Description", type: "textarea", fallback: "Serving clients across borders with world-class quality." },
    ],
  },
  {
    id: "location",
    label: "Location & CTA",
    hint: "Location section title, address, and CTA buttons at the bottom",
    icon: MapPin,
    gradient: "from-rose-500 to-pink-600",
    fields: [
      { key: "location.title", label: "📍 Location Title", fallback: "Where to find us" },
      { key: "location.address", label: "🏠 Address", type: "textarea", fallback: "Dhaka, Bangladesh" },
      { key: "location.desc", label: "📝 Location Description", type: "textarea", fallback: "Reach out — we'd love to hear from you." },
      { key: "location.cta1", label: "🔗 CTA Button 1", fallback: "Start a Project" },
      { key: "location.cta2", label: "🔗 CTA Button 2", fallback: "Contact Us" },
    ],
  },
];

const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);

export default function AboutPageEditor() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>(SECTIONS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["about-page-editor"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key, content_en")
        .eq("page_name", "about")
        .in("content_key", ALL_FIELDS.map((f) => f.key));
      if (error) throw error;
      return data as { content_key: string; content_en: string | null }[];
    },
  });

  useEffect(() => {
    const map: Record<string, string> = {};
    ALL_FIELDS.forEach((f) => {
      const row = data?.find((r) => r.content_key === f.key);
      map[f.key] = row?.content_en ?? f.fallback;
    });
    setValues(map);
  }, [data]);

  const selected = SECTIONS.find((s) => s.id === selectedId)!;

  const saveMutation = useMutation({
    mutationFn: async (section: Section) => {
      const rows = section.fields.map((f) => ({
        page_name: "about",
        content_key: f.key,
        content_en: values[f.key] ?? "",
      }));
      const { error } = await supabase
        .from("page_content")
        .upsert(rows, { onConflict: "page_name,content_key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("About section saved");
      queryClient.invalidateQueries({ queryKey: ["about-page-editor"] });
      queryClient.invalidateQueries({ queryKey: ["page-content", "about"] });
      queryClient.invalidateQueries({ queryKey: ["page-hero", "about"] });
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
          <Sparkles className="w-6 h-6 text-primary" />
          About Page Editor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edit every section of the About page. Pick a section below to edit its content.
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
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                  {s.hint}
                </p>
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
            {selected.fields.map((f) => (
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
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setValues({ ...values, [f.key]: e.target.value })
                    }
                  />
                ) : (
                  <Input
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setValues({ ...values, [f.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
