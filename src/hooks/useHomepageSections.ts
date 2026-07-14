import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useSiteScope, SiteScope } from "@/contexts/SiteScopeContext";

export interface HomepageSection {
  id: string;
  site_scope: string;
  page_key: string;
  section_key: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  highlight: string | null;
  image_url: string | null;
  image_url_2: string | null;
  button_label: string | null;
  button_url: string | null;
  order_index: number;
  is_active: boolean;
}

export interface HomepageSectionItem {
  id: string;
  section_id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  image_url_2: string | null;
  url: string | null;
  order_index: number;
  is_active: boolean;
}


export const useHomepageSections = (
  scopeOverride?: SiteScope,
  pageKey: string = "home"
) => {
  const qc = useQueryClient();
  const detected = useSiteScope();
  const scope = scopeOverride ?? detected;

  useEffect(() => {
    const ch = supabase
      .channel(`hp-sections-${scope}-${pageKey}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "homepage_sections" },
        () => qc.invalidateQueries({ queryKey: ["hp-sections", scope, pageKey] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc, scope, pageKey]);

  return useQuery({
    queryKey: ["hp-sections", scope, pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections" as any)
        .select("*")
        .eq("site_scope", scope)
        .eq("page_key", pageKey)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as unknown as HomepageSection[];
    },
  });
};

export const useHomepageSection = (
  sectionKey: string,
  scopeOverride?: SiteScope,
  pageKey: string = "home"
) => {
  const { data: sections, ...rest } = useHomepageSections(scopeOverride, pageKey);
  const section = sections?.find((s) => s.section_key === sectionKey) ?? null;
  return { section, ...rest };
};

export const useHomepageSectionItems = (sectionId: string | null | undefined) => {
  const qc = useQueryClient();

  useEffect(() => {
    if (!sectionId) return;
    const ch = supabase
      .channel(`hp-items-${sectionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "homepage_section_items", filter: `section_id=eq.${sectionId}` },
        () => qc.invalidateQueries({ queryKey: ["hp-items", sectionId] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc, sectionId]);

  return useQuery({
    queryKey: ["hp-items", sectionId],
    enabled: !!sectionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_section_items" as any)
        .select("*")
        .eq("section_id", sectionId!)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as unknown as HomepageSectionItem[];
    },
  });
};

export const useUpdateSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HomepageSection> & { id: string }) => {
      const { id, ...patch } = payload;
      const { error } = await supabase
        .from("homepage_sections" as any)
        .update(patch as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hp-sections"] }),
  });
};

export const useCreateSectionItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HomepageSectionItem> & { section_id: string }) => {
      const { error } = await supabase
        .from("homepage_section_items" as any)
        .insert(payload as any);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["hp-items", v.section_id] }),
  });
};

export const useUpdateSectionItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HomepageSectionItem> & { id: string }) => {
      const { id, ...patch } = payload;
      const { error } = await supabase
        .from("homepage_section_items" as any)
        .update(patch as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hp-items"] }),
  });
};

export const useDeleteSectionItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("homepage_section_items" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hp-items"] }),
  });
};
