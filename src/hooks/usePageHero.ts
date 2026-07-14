import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePageHero(pageName: string) {
  const { data } = useQuery({
    queryKey: ["page-hero", pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key, content_en")
        .eq("page_name", pageName);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => {
        if (r.content_en) map[r.content_key] = r.content_en;
      });
      return map;
    },
    staleTime: 30_000,
  });
  return (key: string, fallback?: string) => data?.[key] ?? fallback ?? "";
}
