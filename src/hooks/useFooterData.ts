import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useSiteScope, SiteScope } from "@/contexts/SiteScopeContext";

interface FooterLink {
  id: string;
  link_type: string;
  title: string;
  url: string;
  icon: string | null;
  order_index: number;
  is_active: boolean;
  site_scope?: string;
}

interface FooterContent {
  id: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
  site_scope?: string;
}

export const useFooterLinks = (scopeOverride?: SiteScope) => {
  const queryClient = useQueryClient();
  const detectedScope = useSiteScope();
  const scope = scopeOverride ?? detectedScope;

  useEffect(() => {
    const channel = supabase
      .channel(`footer-links-${scope}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'footer_links' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['footer-links-public', scope] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, scope]);

  return useQuery({
    queryKey: ['footer-links-public', scope],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .eq('is_active', true)
        .eq('site_scope', scope)
        .order('order_index');
      if (error) throw error;
      return data as FooterLink[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};

export const useFooterContent = (scopeOverride?: SiteScope) => {
  const queryClient = useQueryClient();
  const detectedScope = useSiteScope();
  const scope = scopeOverride ?? detectedScope;

  useEffect(() => {
    const channel = supabase
      .channel(`footer-content-${scope}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'footer_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['footer-content-public', scope] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, scope]);

  return useQuery({
    queryKey: ['footer-content-public', scope],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .eq('site_scope', scope);
      if (error) throw error;
      return data as FooterContent[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};

export const useFooterContentByKey = (key: string, language: 'en' | 'bn' = 'en') => {
  const { data: contents } = useFooterContent();
  const content = contents?.find(c => c.content_key === key);
  return language === 'bn' ? content?.content_bn || content?.content_en : content?.content_en;
};
