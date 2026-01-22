import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface Work {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  project_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
}

export function useWorks() {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('works-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'works' },
        () => {
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['public-works'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['public-works'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as Work[];
    },
    staleTime: 0, // Always refetch for realtime updates
    refetchOnWindowFocus: true,
  });
}

export function useWorksByCategory() {
  const { data: works, isLoading, error } = useWorks();

  const webProjects = works?.filter(w => w.category === 'web' || w.category.startsWith('web_')) || [];
  // Backward compatible: old data used `design`, admin UI also used `graphics`
  const designProjects = works?.filter(w => w.category === 'design' || w.category === 'graphics' || w.category.startsWith('graphics_')) || [];
  const videoProjects = works?.filter(w => w.category === 'video' || w.category.startsWith('video_')) || [];

  return {
    webProjects,
    designProjects,
    videoProjects,
    isLoading,
    error,
  };
}
