import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    // Verify the user is an admin
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, conversation_history } = await req.json();

    // Get current data context
    const [worksRes, servicesRes, teamRes, coursesRes, pageContentRes] = await Promise.all([
      adminClient.from("works").select("id, title, category, is_published, is_featured, image_url, project_url, description, order_index").order("order_index"),
      adminClient.from("services").select("id, title, description, icon, is_active, order_index, features").order("order_index"),
      adminClient.from("team_members").select("id, name, role, is_active, image_url, order_index").order("order_index"),
      adminClient.from("courses").select("id, title, is_published, price, course_type, trainer_name").order("created_at", { ascending: false }),
      adminClient.from("page_content").select("id, page_name, content_key, content_bn, content_en"),
    ]);

    const dbContext = {
      works: worksRes.data || [],
      services: servicesRes.data || [],
      team_members: teamRes.data || [],
      courses: coursesRes.data || [],
      page_content: pageContentRes.data || [],
    };

    const systemPrompt = `You are "Alpha Assistant" — an intelligent admin assistant for the Alpha Academy website. You help the admin manage the entire website through natural conversation.

## Your Capabilities:
You can perform CRUD operations on these database tables:
1. **works** — Portfolio/work items (fields: title, description, category, image_url, project_url, is_featured, is_published, order_index)
   - Categories: web_portfolio, web_ecommerce, web_education, web_agency, web_general, graphics_social, graphics_logo, graphics_vector, graphics_branding, graphics_general, video_short, video_reels, video_funny, video_square, video_general, other
2. **services** — Services offered (fields: title, description, icon, features[], is_active, order_index, show_on_homepage)
3. **team_members** — Team members (fields: name, role, bio, image_url, is_active, order_index, facebook_url, instagram_url, etc.)
4. **page_content** — Page text content (fields: page_name, content_key, content_bn, content_en)
5. **courses** — LMS courses (fields: title, description, price, is_published, course_type, trainer_name)

## Current Database State:
${JSON.stringify(dbContext, null, 2)}

## How to respond:
- When the admin asks to ADD/CREATE something, respond with action JSON
- When asked to UPDATE/EDIT, respond with action JSON
- When asked to DELETE/REMOVE, respond with action JSON
- When asked questions, answer based on current data
- Always respond in Bengali (বাংলা) since the admin speaks Bengali
- Be friendly and helpful
- If an image URL is provided in the message, use it directly

## Action Format:
When you need to perform a database action, include it in your response wrapped in <action> tags:
<action>
{
  "type": "insert" | "update" | "delete",
  "table": "works" | "services" | "team_members" | "page_content" | "courses",
  "data": { ... },
  "id": "uuid (for update/delete only)"
}
</action>

You can include multiple <action> blocks for multiple operations.

## Important Rules:
- For works: default is_published=true, is_featured=false
- For image_url: if admin provides an image URL, use it directly
- Always confirm what you're about to do before doing complex operations
- If something is unclear, ask for clarification
- Keep responses concise but informative`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversation_history || []),
      { role: "user", content: message },
    ];

    // Call AI via Lovable AI gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", errText);
      return new Response(JSON.stringify({ error: "AI service error", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices?.[0]?.message?.content || "দুঃখিত, কিছু সমস্যা হয়েছে।";

    // Parse and execute actions from the response
    const actionRegex = /<action>([\s\S]*?)<\/action>/g;
    const actions: any[] = [];
    let match;

    while ((match = actionRegex.exec(assistantMessage)) !== null) {
      try {
        const action = JSON.parse(match[1].trim());
        actions.push(action);
      } catch (e) {
        console.error("Failed to parse action:", e);
      }
    }

    const actionResults: any[] = [];

    for (const action of actions) {
      try {
        if (action.type === "insert") {
          const { data, error } = await adminClient
            .from(action.table)
            .insert(action.data)
            .select();
          actionResults.push({ success: !error, table: action.table, type: "insert", data, error: error?.message });
        } else if (action.type === "update" && action.id) {
          const { data, error } = await adminClient
            .from(action.table)
            .update(action.data)
            .eq("id", action.id)
            .select();
          actionResults.push({ success: !error, table: action.table, type: "update", data, error: error?.message });
        } else if (action.type === "delete" && action.id) {
          const { error } = await adminClient
            .from(action.table)
            .delete()
            .eq("id", action.id);
          actionResults.push({ success: !error, table: action.table, type: "delete", error: error?.message });
        }
      } catch (e) {
        actionResults.push({ success: false, error: String(e) });
      }
    }

    // Clean response (remove action tags for display)
    const cleanMessage = assistantMessage.replace(/<action>[\s\S]*?<\/action>/g, "").trim();

    return new Response(
      JSON.stringify({
        message: cleanMessage,
        actions_executed: actionResults,
        has_actions: actions.length > 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
