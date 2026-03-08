import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const results: { table: string; id: string; field: string; oldUrl: string; newUrl: string; status: string }[] = [];

    // Helper: download image and upload to storage
    async function migrateImage(url: string, folder: string, filename: string): Promise<string | null> {
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0" },
          redirect: "follow",
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.status}`);
          return null;
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Determine extension
        let ext = "jpg";
        if (contentType.includes("png")) ext = "png";
        else if (contentType.includes("webp")) ext = "webp";
        else if (contentType.includes("gif")) ext = "gif";

        const storagePath = `${folder}/${filename}.${ext}`;

        // Upload to media-uploads bucket
        const { data, error } = await supabase.storage
          .from("media-uploads")
          .upload(storagePath, uint8Array, {
            contentType,
            upsert: true,
          });

        if (error) {
          console.error(`Upload error for ${storagePath}:`, error.message);
          return null;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("media-uploads")
          .getPublicUrl(storagePath);

        return publicUrlData.publicUrl;
      } catch (err) {
        console.error(`Error migrating ${url}:`, err);
        return null;
      }
    }

    function isExternalUrl(url: string | null): boolean {
      if (!url) return false;
      return (
        url.startsWith("http") &&
        !url.includes("supabase.co") &&
        !url.includes("supabase.in")
      );
    }

    // 1. Migrate team_members images
    const { data: teamMembers } = await supabase
      .from("team_members")
      .select("id, name, image_url");

    if (teamMembers) {
      for (const member of teamMembers) {
        if (isExternalUrl(member.image_url)) {
          const safeName = member.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          const newUrl = await migrateImage(member.image_url, "team-members", safeName);
          if (newUrl) {
            const { error } = await supabase
              .from("team_members")
              .update({ image_url: newUrl })
              .eq("id", member.id);
            results.push({
              table: "team_members",
              id: member.id,
              field: "image_url",
              oldUrl: member.image_url,
              newUrl,
              status: error ? `update_failed: ${error.message}` : "success",
            });
          } else {
            results.push({
              table: "team_members",
              id: member.id,
              field: "image_url",
              oldUrl: member.image_url,
              newUrl: "",
              status: "download_failed",
            });
          }
        }
      }
    }

    // 2. Migrate works images
    const { data: works } = await supabase
      .from("works")
      .select("id, title, image_url");

    if (works) {
      for (const work of works) {
        if (isExternalUrl(work.image_url)) {
          const safeName = work.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          const newUrl = await migrateImage(work.image_url, "works", safeName);
          if (newUrl) {
            const { error } = await supabase
              .from("works")
              .update({ image_url: newUrl })
              .eq("id", work.id);
            results.push({
              table: "works",
              id: work.id,
              field: "image_url",
              oldUrl: work.image_url,
              newUrl,
              status: error ? `update_failed: ${error.message}` : "success",
            });
          } else {
            results.push({
              table: "works",
              id: work.id,
              field: "image_url",
              oldUrl: work.image_url,
              newUrl: "",
              status: "download_failed",
            });
          }
        }
      }
    }

    // 3. Migrate courses thumbnail_url and trainer_image
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title, thumbnail_url, trainer_image");

    if (courses) {
      for (const course of courses) {
        const safeTitle = course.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

        if (isExternalUrl(course.thumbnail_url)) {
          const newUrl = await migrateImage(course.thumbnail_url, "courses/thumbnails", safeTitle);
          if (newUrl) {
            const { error } = await supabase
              .from("courses")
              .update({ thumbnail_url: newUrl })
              .eq("id", course.id);
            results.push({
              table: "courses",
              id: course.id,
              field: "thumbnail_url",
              oldUrl: course.thumbnail_url,
              newUrl,
              status: error ? `update_failed: ${error.message}` : "success",
            });
          }
        }

        if (isExternalUrl(course.trainer_image)) {
          const newUrl = await migrateImage(course.trainer_image, "courses/trainers", safeTitle + "_trainer");
          if (newUrl) {
            const { error } = await supabase
              .from("courses")
              .update({ trainer_image: newUrl })
              .eq("id", course.id);
            results.push({
              table: "courses",
              id: course.id,
              field: "trainer_image",
              oldUrl: course.trainer_image,
              newUrl,
              status: error ? `update_failed: ${error.message}` : "success",
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        migrated: results.filter((r) => r.status === "success").length,
        failed: results.filter((r) => r.status !== "success").length,
        details: results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
