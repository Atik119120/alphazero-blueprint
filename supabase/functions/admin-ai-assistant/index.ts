import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const toBengaliDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

const sanitizePhoneDisplay = (value: string) => value.replace(/^tel:/i, "").trim();

const sanitizePhoneLink = (value: string) => value.replace(/\D/g, "");

const inferBanglaAddress = (value: string) => {
  const replacements: Array<[RegExp, string]> = [
    [/Hi[- ]?Tech Park/gi, "হাই-টেক পার্ক"],
    [/Rajshahi/gi, "রাজশাহী"],
    [/Bangladesh/gi, "বাংলাদেশ"],
  ];

  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
};

const extractContactUpdate = (message: string) => {
  const lines = message
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const email = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]?.trim();
  const phone = sanitizePhoneDisplay(
    message.match(/(?:tel:)?\+?\d[\d\s-]{7,}\d/)?.[0] || ""
  );

  const address = lines.find(
    (line) =>
      line !== email &&
      line !== phone &&
      !/whatsapp|হোয়াটসঅ্যাপ|phone|ফোন|email|ইমেইল|mail|tel:/i.test(line)
  );

  const wantsContactUpdate = /contact|যোগাযোগ|phone|ফোন|email|ইমেইল|mail|address|ঠিকানা|whatsapp|হোয়াটসঅ্যাপ|tel:/i.test(message);
  const wantsWhatsappUpdate = /whatsapp|হোয়াটসঅ্যাপ|wa\.me|same number|same as phone|oi number|ওই number/i.test(message);

  if (!wantsContactUpdate || (!email && !phone && !address)) return null;

  return {
    email,
    phone,
    address,
    wantsWhatsappUpdate,
  };
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
    const [worksRes, servicesRes, teamRes, coursesRes, pageContentRes, footerContentRes, footerLinksRes, siteSettingsRes] = await Promise.all([
      adminClient.from("works").select("id, title, category, is_published, is_featured, image_url, project_url, description, order_index").order("order_index"),
      adminClient.from("services").select("id, title, description, icon, is_active, order_index, features, show_on_homepage").order("order_index"),
      adminClient.from("team_members").select("id, name, role, is_active, image_url, order_index, show_on_homepage, bio, facebook_url, instagram_url, linkedin_url").order("order_index"),
      adminClient.from("courses").select("id, title, is_published, price, course_type, trainer_name, show_on_homepage, description, thumbnail_url").order("created_at", { ascending: false }),
      adminClient.from("page_content").select("id, page_name, content_key, content_bn, content_en"),
      adminClient.from("footer_content").select("id, content_key, content_bn, content_en"),
      adminClient.from("footer_links").select("id, title, url, icon, link_type, is_active, order_index").order("order_index"),
      adminClient.from("site_settings").select("id, setting_key, setting_value, setting_type"),
    ]);

    const dbContext = {
      works: worksRes.data || [],
      services: servicesRes.data || [],
      team_members: teamRes.data || [],
      courses: coursesRes.data || [],
      page_content: pageContentRes.data || [],
      footer_content: footerContentRes.data || [],
      footer_links: footerLinksRes.data || [],
      site_settings: siteSettingsRes.data || [],
    };

    const directContactUpdate = extractContactUpdate(message);

    if (directContactUpdate) {
      const actionResults: any[] = [];
      const footerContent = footerContentRes.data || [];
      const footerLinks = footerLinksRes.data || [];
      const pageContent = pageContentRes.data || [];

      const updateFooterContent = async (key: string, contentEn: string, contentBn: string) => {
        const row = footerContent.find((item: any) => item.content_key === key);
        if (!row) return;

        const { data, error } = await adminClient
          .from("footer_content")
          .update({ content_en: contentEn, content_bn: contentBn })
          .eq("id", row.id)
          .select();

        actionResults.push({ success: !error, table: "footer_content", type: "update", data, error: error?.message });
      };

      const updatePageContent = async (key: string, contentEn: string, contentBn: string) => {
        const row = pageContent.find((item: any) => item.page_name === "contact" && item.content_key === key);
        if (!row) return;

        const { data, error } = await adminClient
          .from("page_content")
          .update({ content_en: contentEn, content_bn: contentBn })
          .eq("id", row.id)
          .select();

        actionResults.push({ success: !error, table: "page_content", type: "update", data, error: error?.message });
      };

      if (directContactUpdate.phone) {
        const phoneEn = directContactUpdate.phone;
        const phoneBn = toBengaliDigits(phoneEn);
        await updateFooterContent("phone", phoneEn, phoneBn);
        await updatePageContent("info.phone", phoneEn, phoneBn);

        if (directContactUpdate.wantsWhatsappUpdate) {
          const whatsappDigits = sanitizePhoneLink(phoneEn);
          const whatsappLinkRow = footerLinks.find((item: any) => item.link_type === "social" && /whatsapp/i.test(item.title));

          if (whatsappLinkRow) {
            const { data, error } = await adminClient
              .from("footer_links")
              .update({ url: `https://wa.me/${whatsappDigits}` })
              .eq("id", whatsappLinkRow.id)
              .select();

            actionResults.push({ success: !error, table: "footer_links", type: "update", data, error: error?.message });
          }

          await updatePageContent("info.whatsapp", `+${whatsappDigits}`, toBengaliDigits(`+${whatsappDigits}`));
          await updatePageContent("info.whatsapp_display", phoneEn, phoneBn);
        }
      }

      if (directContactUpdate.email) {
        await updateFooterContent("email", directContactUpdate.email, directContactUpdate.email);
        await updatePageContent("info.email", directContactUpdate.email, directContactUpdate.email);

        const emailLinkRow = footerLinks.find((item: any) => item.link_type === "social" && /email/i.test(item.title));
        if (emailLinkRow) {
          const { data, error } = await adminClient
            .from("footer_links")
            .update({ url: `mailto:${directContactUpdate.email}` })
            .eq("id", emailLinkRow.id)
            .select();

          actionResults.push({ success: !error, table: "footer_links", type: "update", data, error: error?.message });
        }
      }

      if (directContactUpdate.address) {
        const addressEn = directContactUpdate.address;
        const addressBn = inferBanglaAddress(addressEn);
        await updateFooterContent("address", addressEn, addressBn);
        await updatePageContent("info.address", addressEn, addressBn);
      }

      return new Response(
        JSON.stringify({
          message: "যোগাযোগের তথ্য সফলভাবে আপডেট করা হয়েছে।",
          actions_executed: actionResults,
          has_actions: actionResults.length > 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `You are "Alpha Assistant" — a powerful AI admin assistant for the Alpha Academy website. You can manage the ENTIRE website through natural conversation — from database CRUD to editing every page's text, layout labels, stats, CTAs, and more.

## Your Capabilities:
You can perform CRUD operations on these database tables:
1. **works** — Portfolio/work items (fields: title, description, category, image_url, project_url, is_featured, is_published, order_index, show_on_homepage)
   - Categories: web_portfolio, web_ecommerce, web_education, web_agency, web_general, graphics_social, graphics_logo, graphics_vector, graphics_branding, graphics_general, video_short, video_reels, video_funny, video_square, video_general, other
2. **services** — Services offered (fields: title, description, icon, features[], is_active, order_index, show_on_homepage)
3. **team_members** — Team members (fields: name, role, bio, image_url, is_active, order_index, facebook_url, instagram_url, linkedin_url, show_on_homepage, etc.)
4. **page_content** — ALL page text content (fields: page_name, content_key, content_bn, content_en). THIS IS YOUR MOST POWERFUL TOOL — it controls every text on every page!
5. **courses** — LMS courses (fields: title, description, price, is_published, course_type, trainer_name, show_on_homepage, thumbnail_url)
6. **footer_content** — Contact/footer text (fields: content_key, content_bn, content_en). Common keys: phone, email, address, description, tagline
7. **footer_links** — Social/footer links (fields: title, url, icon, link_type, is_active, order_index)
8. **site_settings** — Site-wide settings (fields: setting_key, setting_value, setting_type)

## PAGE CONTENT EDITING — VIBE CODING POWER:
The **page_content** table controls ALL text on EVERY page of the website. Each row has:
- **page_name**: which page (home, about, contact, services, team, pricing, courses, join-team)
- **content_key**: identifies what text element (e.g., hero.title, hero.subtitle, stats.projects, cta.title, etc.)
- **content_bn**: Bengali text
- **content_en**: English text

### What you can change via page_content:
- Hero section titles, subtitles, descriptions
- Stats numbers and labels (projects count, students count, etc.)
- CTA (Call to Action) titles, descriptions, button text
- Section headings and descriptions
- About page mission, vision, story text
- Contact page info (address, phone, email, WhatsApp)
- Pricing page titles and descriptions
- Any text visible on any page

### How to edit page content:
- To UPDATE existing text: use action type "update" with the row's id
- To ADD new text for a page: use action type "insert" with page_name, content_key, content_bn, content_en
- Always update BOTH content_bn (Bengali) and content_en (English) — if admin gives one language, translate/transliterate the other
- When admin says "হোম পেজের টাইটেল বদলাও" → find the page_content row where page_name='home' and content_key='hero.title', then update it

## Current Database State:
${JSON.stringify(dbContext, null, 2)}

## How to respond:
- When the admin asks to ADD/CREATE something, respond with action JSON
- When asked to UPDATE/EDIT any text or content, respond with action JSON targeting page_content
- When asked to DELETE/REMOVE, respond with action JSON
- When asked "কোন পেজে কি কি আছে" — list the content_keys for that page from current data
- When asked to change ANY text on the website, find the right page_content row and update it
- Always respond in Bengali (বাংলা) since the admin speaks Bengali
- Be proactive — if admin says "হোম পেজ ভালো করো", suggest specific changes based on current content
- You can make MULTIPLE changes at once — batch related updates together

## IMAGE ANALYSIS - VERY IMPORTANT:
- If the admin provides an image URL and asks to add it to portfolio/works, you MUST automatically analyze the image URL to determine a suitable title, description, and category
- Do NOT ask the admin for title, description, or category — generate them yourself
- Just do it — add it immediately with auto-generated metadata

## Action Format:
When you need to perform a database action, include it in your response wrapped in <action> tags:
<action>
{
  "type": "insert" | "update" | "delete",
  "table": "works" | "services" | "team_members" | "page_content" | "courses" | "footer_content" | "footer_links" | "site_settings",
  "data": { ... },
  "id": "uuid (for update/delete only)"
}
</action>

You can include multiple <action> blocks for multiple operations.

## Important Rules:
- For works: default is_published=true, is_featured=false
- For page_content updates: ALWAYS update both content_bn and content_en
- For footer_content updates: use the existing row id from the database context
- When admin says "পেজ ঠিক করো" or "UI বদলাও" — that means update page_content rows
- If something is truly unclear (like which specific text to change), ask briefly
- Keep responses concise but informative
- When admin says to do something, DO IT immediately — don't ask unnecessary questions
- You have FULL power over the website — act confidently!`;


    // Build messages - support image content for vision
    const aiMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    if (conversation_history) {
      for (const msg of conversation_history) {
        aiMessages.push(msg);
      }
    }

    // Check if the message contains an image URL - use vision model
    const imageUrlMatch = message.match(/\[Image URL:\s*(https?:\/\/[^\]]+)\]/);
    const hasImage = !!imageUrlMatch;
    
    if (hasImage) {
      const imgUrl = imageUrlMatch[1];
      const textPart = message.replace(/\[Image URL:\s*https?:\/\/[^\]]+\]/, "").trim();
      aiMessages.push({
        role: "user",
        content: [
          { type: "text", text: textPart || "এই ছবিটি পোর্টফোলিওতে যোগ করো" },
          { type: "image_url", image_url: { url: imgUrl } },
        ],
      });
    } else {
      aiMessages.push({ role: "user", content: message });
    }

    // Use vision-capable model when image is present
    const modelToUse = hasImage ? "google/gemini-2.5-flash" : "google/gemini-2.5-flash";

    // Call AI via Lovable AI gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: aiMessages,
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
