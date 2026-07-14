import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteScope, SiteScope } from "@/contexts/SiteScopeContext";

interface PageContent {
  id: string;
  page_name: string;
  content_key: string;
  content_en: string | null;
  site_scope?: string;
}


export const usePageContent = (pageName: string, scopeOverride?: SiteScope) => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const detectedScope = useSiteScope();
  const scope = scopeOverride ?? detectedScope;

  useEffect(() => {
    const channel = supabase
      .channel(`page-content-${pageName}-${scope}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['page-content-public', pageName, scope] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, pageName, scope]);

  const { data: contents, isLoading } = useQuery({
    queryKey: ['page-content-public', pageName, scope],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_name', pageName)
        .eq('site_scope', scope)
        .order('content_key');
      if (error) throw error;
      return data as PageContent[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  const getContent = useMemo(() => {
    return (key: string, fallback: string = '') => {
      const content = contents?.find(c => c.content_key === key);
      if (!content) return fallback;
      const value = language === 'bn'
        ? (content.content_bn || content.content_en)
        : content.content_en;
      return value || fallback;
    };
  }, [contents, language]);

  const hasContent = useMemo(() => {
    return (key: string) => {
      return contents?.some(c => c.content_key === key) ?? false;
    };
  }, [contents]);

  return { contents, isLoading, getContent, hasContent, language, scope };
};

export const useAllPageContent = (scopeOverride?: SiteScope) => {
  const queryClient = useQueryClient();
  const detectedScope = useSiteScope();
  const scope = scopeOverride ?? detectedScope;

  useEffect(() => {
    const channel = supabase
      .channel(`all-page-content-${scope}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['all-page-content', scope] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, scope]);

  return useQuery({
    queryKey: ['all-page-content', scope],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('site_scope', scope)
        .order('page_name')
        .order('content_key');
      if (error) throw error;
      return data as PageContent[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};
