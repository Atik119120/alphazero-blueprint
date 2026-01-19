import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PassCode, PassCodeWithCourses, Course, Profile } from '@/types/lms';
import { useAuth } from '@/contexts/AuthContext';

export function usePassCodes() {
  const [passCodes, setPassCodes] = useState<PassCodeWithCourses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchPassCodes = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Fetch all pass codes
      const { data: passCodesData, error: passCodesError } = await supabase
        .from('pass_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (passCodesError) throw passCodesError;

      // Fetch all course assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('pass_code_courses')
        .select('pass_code_id, course_id');

      if (assignmentsError) throw assignmentsError;

      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');

      if (coursesError) throw coursesError;

      // Fetch all profiles for students
      const studentIds = (passCodesData || [])
        .map((pc: PassCode) => pc.student_id)
        .filter((id: string | null): id is string => id !== null);

      let profilesMap = new Map<string, Profile>();
      if (studentIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', studentIds);

        if (!profilesError && profilesData) {
          profilesMap = new Map(profilesData.map((p: Profile) => [p.id, p]));
        }
      }

      const coursesMap = new Map((coursesData || []).map((c: Course) => [c.id, c]));

      // Build pass codes with courses
      const passCodesWithCourses: PassCodeWithCourses[] = (passCodesData || []).map((passCode: PassCode) => {
        const courseIds = (assignmentsData || [])
          .filter((a: { pass_code_id: string }) => a.pass_code_id === passCode.id)
          .map((a: { course_id: string }) => a.course_id);

        const courses = courseIds
          .map((id: string) => coursesMap.get(id))
          .filter((c: Course | undefined): c is Course => c !== undefined);

        return {
          ...passCode,
          courses,
          student: passCode.student_id ? profilesMap.get(passCode.student_id) : undefined,
        };
      });

      setPassCodes(passCodesWithCourses);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // Initial fetch
  useEffect(() => {
    fetchPassCodes();
  }, [fetchPassCodes]);

  // Realtime auto-refresh (so admin doesn't need to manually refresh)
  const refreshTimerRef = useRef<number | null>(null);

  const scheduleRefetch = useCallback(() => {
    if (!isAdmin) return;

    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = window.setTimeout(() => {
      fetchPassCodes();
    }, 250);
  }, [fetchPassCodes, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-passcodes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pass_codes' },
        () => scheduleRefetch()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pass_code_courses' },
        () => scheduleRefetch()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => scheduleRefetch()
      )
      .subscribe();

    return () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [isAdmin, scheduleRefetch]);

  const generatePassCode = async (): Promise<string | null> => {
    const { data, error } = await supabase.rpc('generate_pass_code');
    if (error) {
      console.error('Error generating pass code:', error);
      return null;
    }
    return data;
  };

  const createPassCode = async (courseIds: string[] = []) => {
    const code = await generatePassCode();
    if (!code) return { error: 'Failed to generate pass code' };

    const { data: passCodeData, error: passCodeError } = await supabase
      .from('pass_codes')
      .insert({ code })
      .select()
      .single();

    if (passCodeError) return { error: passCodeError.message };

    // Assign courses if any
    if (courseIds.length > 0) {
      const assignments = courseIds.map(courseId => ({
        pass_code_id: passCodeData.id,
        course_id: courseId,
      }));

      const { error: assignError } = await supabase
        .from('pass_code_courses')
        .insert(assignments);

      if (assignError) return { error: assignError.message };
    }

    await fetchPassCodes();
    return { error: null, passCode: passCodeData };
  };

  const assignCourseToPassCode = async (passCodeId: string, courseId: string) => {
    const { error } = await supabase
      .from('pass_code_courses')
      .insert({ pass_code_id: passCodeId, course_id: courseId });

    if (!error) {
      await fetchPassCodes();
    }
    return { error: error?.message };
  };

  const removeCourseFromPassCode = async (passCodeId: string, courseId: string) => {
    const { error } = await supabase
      .from('pass_code_courses')
      .delete()
      .eq('pass_code_id', passCodeId)
      .eq('course_id', courseId);

    if (!error) {
      await fetchPassCodes();
    }
    return { error: error?.message };
  };

  const togglePassCodeStatus = async (passCodeId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('pass_codes')
      .update({ is_active: isActive })
      .eq('id', passCodeId);

    if (!error) {
      await fetchPassCodes();
    }
    return { error: error?.message };
  };

  const deletePassCode = async (passCodeId: string) => {
    const { error } = await supabase
      .from('pass_codes')
      .delete()
      .eq('id', passCodeId);

    if (!error) {
      await fetchPassCodes();
    }
    return { error: error?.message };
  };

  const linkPassCodeToStudent = async (passCode: string, profileId: string) => {
    const { error } = await supabase
      .from('pass_codes')
      .update({ student_id: profileId })
      .eq('code', passCode)
      .eq('is_active', true);

    return { error: error?.message };
  };

  return {
    passCodes,
    isLoading,
    error,
    refetch: fetchPassCodes,
    createPassCode,
    assignCourseToPassCode,
    removeCourseFromPassCode,
    togglePassCodeStatus,
    deletePassCode,
    linkPassCodeToStudent,
  };
}
