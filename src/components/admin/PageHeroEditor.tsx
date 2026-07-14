import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export interface PageHeroField {
  key: string;
  label: string;
  description: string;
  type: "input" | "textarea";
  fallback: string;
}

interface Props {
  pageName: string;
  title: string;
  subtitle?: string;
  fields: PageHeroField[];
}

export default function PageHeroEditor({ pageName, title, subtitle, fields }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["page-hero-editor", pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key, content_en")
        .eq("page_name", pageName)
        .in("content_key", fields.map((f) => f.key));
      if (error) throw error;
      return data as { content_key: string; content_en: string | null }[];
    },
  });

  useEffect(() => {
    const map: Record<string, string> = {};
    fields.forEach((f) => {
      const row = data?.find((r) => r.content_key === f.key);
      map[f.key] = row?.content_en ?? f.fallback;
    });
    setValues(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const rows = fields.map((f) => ({
        page_name: pageName,
        content_key: f.key,
        content_en: values[f.key] ?? "",
        site_scope: "agency",
      }));
      const { error } = await supabase
        .from("page_content")
        .upsert(rows, { onConflict: "site_scope,page_name,content_key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Hero section updated");
      queryClient.invalidateQueries({ queryKey: ["page-hero-editor", pageName] });
      queryClient.invalidateQueries({ queryKey: ["page-hero", pageName] });
      queryClient.invalidateQueries({ queryKey: ["page-content"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  return (
    <Card>
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left">
        <CardHeader className="flex flex-row items-center justify-between gap-3 hover:bg-muted/40 transition-colors rounded-t-lg">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {open ? "Click to collapse" : subtitle ?? "Click to edit the top hero section"}
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CardHeader>
      </button>
      {open && (
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="font-semibold">{f.label}</Label>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                  {f.type === "textarea" ? (
                    <Textarea
                      rows={3}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                    />
                  ) : (
                    <Input
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Hero Section
                </Button>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
