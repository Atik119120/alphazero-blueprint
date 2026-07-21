import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  whatsapp_url: string | null;
  email: string | null;
  fiverr_url: string | null;
  upwork_url: string | null;
  portfolio_url: string | null;
  threads_url: string | null;
  is_active: boolean;
  order_index: number;
}

export function useTeamMembers(scope: 'agency' | 'learn' | 'all' = 'agency') {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('team-members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['public-team-members'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['public-team-members', scope],
    queryFn: async () => {
      let q = supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (scope !== 'all') {
        q = q.eq('site_scope', scope);
      }

      const { data, error } = await q;

      if (error) throw error;
      return data as TeamMember[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

