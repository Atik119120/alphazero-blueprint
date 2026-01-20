import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/lms';

export function usePublicCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses((data || []) as Course[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicCourses();
  }, []);

  return { courses, isLoading, error, refetch: fetchPublicCourses };
}
