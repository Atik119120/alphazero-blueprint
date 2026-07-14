import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Phone, Mail, MapPin, Clock, MessageCircle, Sparkles, FileText, Zap, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Field {
  key: string;
  label: string;
  description?: string;
  type?: "input" | "textarea";
  fallback: string;
  placeholder?: string;
}

interface Group {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: Field[];
  defaultOpen?: boolean;
}

const GROUPS: Group[] = [
  {
    id: "hero",
    title: "Hero Section",
    icon: Sparkles,
    defaultOpen: true,
    fields: [
      { key: "hero.subtitle", label: "🔖 Top Badge", description: "Small uppercase text above the title", fallback: "Get In Touch" },
      { key: "hero.title", label: "📞 Hero Title", description: "Main hero title", fallback: "Let's Talk" },
      { key: "hero.description", label: "📝 Description", description: "Short paragraph below the title", type: "textarea", fallback: "Reach out — we'd love to hear about your project." },
    ],
  },
  {
    id: "info",
    title: "Contact Information",
    icon: Phone,
    defaultOpen: true,
    fields: [
      { key: "info.phone_label", label: "📱 Phone Label", fallback: "Phone" },
      { key: "info.phone", label: "📱 Phone Number", fallback: "+8801410190019", placeholder: "+880..." },
      { key: "info.email_label", label: "✉️ Email Label", fallback: "Email" },
      { key: "info.email", label: "✉️ Email Address", fallback: "hello@alphazero.com", placeholder: "name@example.com" },
      { key: "info.address_label", label: "🏠 Address Label", fallback: "Address" },
      { key: "info.address", label: "🏠 Office Address", type: "textarea", fallback: "Dhaka, Bangladesh" },
      { key: "info.hours_label", label: "🕐 Business Hours Label", fallback: "Business Hours" },
      { key: "info.hours", label: "🕐 Business Hours", fallback: "Sat–Thu, 10:00 AM – 8:00 PM" },
      { key: "info.whatsapp", label: "💬 WhatsApp Link Number", description: "Digits only, no + or spaces — used in wa.me link", fallback: "8801846484200", placeholder: "8801..." },
      { key: "info.whatsapp_display", label: "💬 WhatsApp Display Number", description: "Number shown to users on the button", fallback: "+8801846484200" },
    ],
  },
  {
    id: "form",
    title: "Contact Form Labels",
    icon: FileText,
    fields: [
      { key: "form.title", label: "📋 Form Title", fallback: "Send us a message" },
      { key: "form.name", label: "📋 Name Field Label", fallback: "Your Name" },
      { key: "form.email", label: "📋 Email Field Label", fallback: "Email Address" },
      { key: "form.subject", label: "📋 Subject Field Label", fallback: "Subject" },
      { key: "form.message", label: "📋 Message Field Label", fallback: "Message" },
      { key: "form.submit", label: "📋 Submit Button Text", fallback: "Send Message" },
    ],
  },
  {
    id: "quick",
    title: "Quick Action Buttons",
    icon: Zap,
    fields: [
      { key: "quick.email_btn", label: "⚡ Quick Email Button Text", fallback: "Email Us" },
      { key: "quick.whatsapp_btn", label: "⚡ Quick WhatsApp Button Text", fallback: "Chat on WhatsApp" },
    ],
  },
];

const ALL_FIELDS = GROUPS.flatMap((g) => g.fields);

export default function ContactInfoManagement() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(GROUPS.map((g) => [g.id, !!g.defaultOpen]))
  );

  const { data, isLoading } = useQuery({
    queryKey: ["contact-info-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key, content_en")
        .eq("page_name", "contact")
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

  const saveMutation = useMutation({
    mutationFn: async () => {
      const rows = ALL_FIELDS.map((f) => ({
        page_name: "contact",
        content_key: f.key,
        content_en: values[f.key] ?? "",
      }));
      const { error } = await supabase
        .from("page_content")
        .upsert(rows, { onConflict: "page_name,content_key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contact info updated");
      queryClient.invalidateQueries({ queryKey: ["contact-info-management"] });
      queryClient.invalidateQueries({ queryKey: ["page-hero", "contact"] });
      queryClient.invalidateQueries({ queryKey: ["page-content"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  const toggleGroup = (id: string) =>
    setOpenGroups((s) => ({ ...s, [id]: !s[id] }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            Contact Page Info
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit all contact page details — hero, phone, email, address, form labels & quick actions.
          </p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="lg">
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save All Changes
        </Button>
      </div>

      {GROUPS.map((g) => {
        const Icon = g.icon;
        const open = openGroups[g.id];
        return (
          <Card key={g.id}>
            <button type="button" onClick={() => toggleGroup(g.id)} className="w-full text-left">
              <CardHeader className="flex flex-row items-center justify-between gap-3 hover:bg-muted/40 transition-colors rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5 text-primary" />
                  {g.title}
                </CardTitle>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                />
              </CardHeader>
            </button>
            {open && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {g.fields.map((f) => (
                    <div
                      key={f.key}
                      className={`space-y-1.5 ${f.type === "textarea" ? "md:col-span-2" : ""}`}
                    >
                      <Label className="font-semibold">{f.label}</Label>
                      {f.description && (
                        <p className="text-xs text-muted-foreground">{f.description}</p>
                      )}
                      {f.type === "textarea" ? (
                        <Textarea
                          rows={3}
                          value={values[f.key] ?? ""}
                          placeholder={f.placeholder}
                          onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                        />
                      ) : (
                        <Input
                          value={values[f.key] ?? ""}
                          placeholder={f.placeholder}
                          onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <div className="flex justify-end">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="lg">
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
