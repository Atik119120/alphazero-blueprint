import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface FooterLink {
  id: string;
  link_type: string;
  title: string;
  url: string;
  icon: string | null;
  order_index: number;
  is_active: boolean;
}

interface FooterContent {
  id: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

export const useFooterLinks = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('footer-links-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'footer_links' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['footer-links-public'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['footer-links-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      return data as FooterLink[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};

export const useFooterContent = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('footer-content-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'footer_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['footer-content-public'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['footer-content-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*');
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
