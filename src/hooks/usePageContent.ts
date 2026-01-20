import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageContent {
  id: string;
  page_name: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

export const usePageContent = (pageName: string) => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  useEffect(() => {
    const channel = supabase
      .channel(`page-content-${pageName}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['page-content-public', pageName] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, pageName]);

  const { data: contents, isLoading } = useQuery({
    queryKey: ['page-content-public', pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_name', pageName)
        .order('content_key');
      if (error) throw error;
      return data as PageContent[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  // Create a getter function that returns content by key with language support
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

  // Check if content exists for a key
  const hasContent = useMemo(() => {
    return (key: string) => {
      return contents?.some(c => c.content_key === key) ?? false;
    };
  }, [contents]);

  return { 
    contents, 
    isLoading, 
    getContent,
    hasContent,
    language 
  };
};

// Hook for all pages content at once (for admin or preloading)
export const useAllPageContent = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('all-page-content-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['all-page-content'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['all-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_name')
        .order('content_key');
      if (error) throw error;
      return data as PageContent[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};
