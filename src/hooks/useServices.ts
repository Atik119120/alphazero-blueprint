import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[] | null;
  is_active: boolean;
  order_index: number;
}

export function useServices() {
  return useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
