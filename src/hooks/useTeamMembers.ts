import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  order_index: number;
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['public-team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
