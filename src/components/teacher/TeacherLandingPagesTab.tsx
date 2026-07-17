import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import CourseLandingEditor, { type EditorCourse } from '@/components/shared/CourseLandingEditor';

const SELECT_COLS =
  'id,title,title_en,landing_slug,thumbnail_url,description,description_en,short_description,short_description_en,trainer_bio,trainer_bio_en,start_date,class_time,total_classes,duration,learning_outcomes,why_learn,intro_video_url,faqs';

export default function TeacherLandingPagesTab() {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [courses, setCourses] = useState<EditorCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!profile) return;
      setLoading(true);
      let coCourseIds: string[] = [];
      if (profile.linked_team_member_id) {
        const { data } = await supabase
          .from('course_instructors')
          .select('course_id')
          .eq('instructor_id', profile.linked_team_member_id);
        coCourseIds = (data || []).map((r: any) => r.course_id);
      }
      const orFilter = coCourseIds.length
        ? `teacher_id.eq.${profile.id},id.in.(${coCourseIds.join(',')})`
        : `teacher_id.eq.${profile.id}`;
      const { data } = await supabase
        .from('courses')
        .select(SELECT_COLS)
        .or(orFilter)
        .order('created_at', { ascending: false });
      setCourses((data ?? []) as any as EditorCourse[]);
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{isBn ? 'ল্যান্ডিং পেজ' : 'Landing Pages'}</h1>
        <p className="text-sm text-muted-foreground">
          {isBn
            ? 'আপনার কোর্সের public ল্যান্ডিং পেজ এডিট করুন — banner, video, modules, syllabus, FAQ ইত্যাদি।'
            : 'Edit the public landing pages for your courses — banner, video, modules, syllabus, FAQ, and more.'}
        </p>
      </div>
      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {isBn ? 'আপনার কোনো কোর্স assign করা নেই।' : 'No courses assigned to you yet.'}
          </CardContent>
        </Card>
      ) : (
        <CourseLandingEditor courses={courses} learnScopeOnly />
      )}
    </div>
  );
}
