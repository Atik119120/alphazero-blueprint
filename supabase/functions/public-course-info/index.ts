// Public REST endpoint — returns full course landing data by slug
// No auth required. Safe to call from any external site.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');
    if (!slug && !id) return json({ error: 'slug or id required' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const q = supabase.from('courses').select('*').eq('is_published', true).limit(1);
    const { data: courseRows, error: cErr } = slug
      ? await q.eq('landing_slug', slug)
      : await q.eq('id', id!);

    if (cErr) return json({ error: cErr.message }, 500);
    const course = courseRows?.[0];
    if (!course) return json({ error: 'Course not found' }, 404);

    const [{ data: modules }, { data: topics }, { data: videos }] = await Promise.all([
      supabase.from('course_modules').select('id,title,description,order_index')
        .eq('course_id', course.id).order('order_index'),
      supabase.from('course_topics').select('id,title,order_index')
        .eq('course_id', course.id).order('order_index'),
      supabase.from('videos').select('id,title,duration,order_index,topic_id')
        .eq('course_id', course.id).order('order_index'),
    ]);

    return json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        title_en: course.title_en,
        description: course.description,
        description_en: course.description_en,
        short_description: course.short_description,
        short_description_en: course.short_description_en,
        thumbnail_url: course.thumbnail_url,
        price: course.price,
        course_type: course.course_type,
        landing_slug: course.landing_slug,
        trainer_name: course.trainer_name,
        trainer_image: course.trainer_image,
        trainer_designation: course.trainer_designation,
        trainer_bio: course.trainer_bio,
        trainer_bio_en: course.trainer_bio_en,
        start_date: course.start_date,
        class_time: course.class_time,
        total_classes: course.total_classes,
        duration: course.duration,
        learning_outcomes: course.learning_outcomes ?? [],
        faqs: course.faqs ?? [],
      },
      modules: modules ?? [],
      topics: topics ?? [],
      lesson_count: (videos ?? []).length,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
