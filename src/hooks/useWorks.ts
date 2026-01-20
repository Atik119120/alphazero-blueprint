import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useWorksByCategory() {
  const { data: works, isLoading, error } = useWorks();

  const webProjects = works?.filter(w => w.category === 'web') || [];
  const designProjects = works?.filter(w => w.category === 'design') || [];
  const videoProjects = works?.filter(w => w.category === 'video') || [];

  return {
    webProjects,
    designProjects,
    videoProjects,
    isLoading,
    error,
  };
}
