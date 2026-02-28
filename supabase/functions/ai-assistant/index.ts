import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) return { valid: false, error: "Messages must be an array" };
  if (messages.length === 0) return { valid: false, error: "Messages cannot be empty" };
  if (messages.length > 50) return { valid: false, error: "Too many messages (max 50)" };
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object') return { valid: false, error: `Invalid message at index ${i}` };
    if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) return { valid: false, error: `Invalid role at index ${i}` };
    if (!msg.content || typeof msg.content !== 'string') return { valid: false, error: `Missing content at index ${i}` };
    if (msg.content.length > 4000) return { valid: false, error: `Message too long at index ${i}` };
    if (msg.content.includes('<script>') || msg.content.includes('javascript:')) return { valid: false, error: "Invalid content" };
  }
  return { valid: true };
}

// Fetch real-time data from DB
async function fetchLiveKnowledge(): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch courses, services, team members, and footer content in parallel
  const [coursesRes, servicesRes, teamRes, footerContentRes, footerLinksRes] = await Promise.all([
    supabase.from('courses').select('title, title_en, description, price, trainer_name, trainer_designation, is_published, course_type').eq('is_published', true),
    supabase.from('services').select('title, description, features, is_active').eq('is_active', true).order('order_index'),
    supabase.from('team_members').select('name, role, bio, is_active').eq('is_active', true).order('order_index'),
    supabase.from('footer_content').select('content_key, content_bn, content_en'),
    supabase.from('footer_links').select('title, url, link_type, is_active').eq('is_active', true),
  ]);

  const courses = coursesRes.data || [];
  const services = servicesRes.data || [];
  const team = teamRes.data || [];
  const footerContent = footerContentRes.data || [];
  const footerLinks = footerLinksRes.data || [];

  // Build courses section
  let courseList = "";
  if (courses.length > 0) {
    courseList = courses.map((c, i) => {
      const price = c.price ? `৳${c.price}` : 'ফ্রি';
      const trainer = c.trainer_name || 'TBA';
      const type = c.course_type === 'coming_soon' ? ' (শীঘ্রই আসছে)' : '';
      return `${i + 1}. ${c.title}${type}\n   💰 ফি: ${price}\n   👨‍🏫 ট্রেইনার: ${trainer}${c.trainer_designation ? ` (${c.trainer_designation})` : ''}\n   📝 ${c.description || ''}`;
    }).join('\n\n');
  }

  // Build services section
  let serviceList = "";
  if (services.length > 0) {
    serviceList = services.map((s, i) => {
      const features = s.features ? s.features.join(', ') : '';
      return `${i + 1}. ${s.title} - ${s.description || ''}${features ? `\n   ফিচার: ${features}` : ''}`;
    }).join('\n');
  }

  // Build team section
  let teamList = "";
  if (team.length > 0) {
    teamList = team.map(t => `- ${t.name} - ${t.role}${t.bio ? ` (${t.bio})` : ''}`).join('\n');
  }

  // Build footer/contact info
  const contactInfo = footerContent.map(fc => `${fc.content_key}: ${fc.content_bn || fc.content_en || ''}`).join('\n');
  const socialLinks = footerLinks.map(fl => `${fl.title}: ${fl.url}`).join('\n');

  return `
# রিয়েল-টাইম ডেটাবেজ থেকে প্রাপ্ত তথ্য (সর্বশেষ আপডেট)

## বর্তমান কোর্স তালিকা (${courses.length}টি কোর্স)
${courseList || 'কোনো কোর্স পাওয়া যায়নি'}

## আমাদের সেবাসমূহ (${services.length}টি সেবা)
${serviceList || 'কোনো সেবা পাওয়া যায়নি'}

## টিম মেম্বার (${team.length} জন)
${teamList || 'কোনো টিম মেম্বার পাওয়া যায়নি'}

## যোগাযোগ ও সোশ্যাল লিংক
${contactInfo}
${socialLinks}
`;
}

// Static context that rarely changes
const staticKnowledge = `
# AlphaZero Agency সম্পর্কে

AlphaZero একটি ক্রিয়েটিভ ডিজাইন ও আইটি এজেন্সি, রাজশাহী, বাংলাদেশে অবস্থিত।
স্লোগান: "শূন্য থেকে প্রভাব" (From Zero to Impact)

## আমাদের অর্জন
- 50+ প্রজেক্ট সম্পন্ন
- 30+ সন্তুষ্ট ক্লায়েন্ট
- 3+ বছরের অভিজ্ঞতা

## যোগাযোগ
- ইমেইল: agency.alphazero@gmail.com
- WhatsApp: +880 1846 484200
- ঠিকানা: বর্ণালী, রাজশাহী-6000
- কাজের সময়: শনি-বৃহস্পতি, সকাল ১০টা - রাত ৮টা

## সোশ্যাল মিডিয়া
- Facebook: facebook.com/share/1Zm7yMhPtk
- Instagram: instagram.com/alphazero.online
- Twitter/X: x.com/AgencyAlphazero
- Discord: discord.gg/uerwPXFf5

## ওয়েবসাইটের পেজ
- হোম: /
- আমাদের সম্পর্কে: /about
- সেবাসমূহ: /services
- আমাদের কাজ: /work
- টিম: /team
- কোর্স (Alpha Academy): /courses
- যোগাযোগ: /contact
- টিমে যোগ দিন: /join-team
- সার্টিফিকেট ভেরিফাই: /verify-certificate

## পেমেন্ট পদ্ধতি
- বিকাশ (bKash) ও নগদ (Nagad) এর মাধ্যমে পেমেন্ট
- /courses পেজে গিয়ে ফর্ম পূরণ করুন
- পেমেন্ট করার পর ট্রানজেকশন আইডি দিন

## স্টুডেন্ট ড্যাশবোর্ড
- /student পেজে লগইন করে কোর্স দেখা, ভিডিও দেখা, প্রগ্রেস ট্র্যাক করা যায়
- স্টুডেন্ট আইডি কার্ড ডাউনলোড করা যায়

## সার্টিফিকেট
- কোর্স সম্পন্ন করলে সার্টিফিকেট পাওয়া যায়
- /verify-certificate পেজে সার্টিফিকেট ভেরিফাই করা যায়

## টিচার প্যানেল
- /teacher পেজে টিচাররা তাদের কোর্স ম্যানেজ করতে পারেন
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: "অনেক বেশি রিকোয়েস্ট। একটু পরে আবার চেষ্টা করুন।" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = body;
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch real-time data from database
    let liveKnowledge = "";
    try {
      liveKnowledge = await fetchLiveKnowledge();
    } catch (e) {
      console.error("Failed to fetch live knowledge:", e);
      liveKnowledge = "\n(রিয়েল-টাইম ডেটা লোড করা যায়নি, স্ট্যাটিক তথ্য ব্যবহার করা হচ্ছে)\n";
    }

    console.log(`Processing AI request with ${messages.length} messages, live data loaded`);

    const systemPrompt = `${staticKnowledge}

${liveKnowledge}

---

# তোমার পরিচয়

তুমি "Alpha One" - AlphaZero-এর বন্ধুত্বপূর্ণ AI সহকারী।

# উত্তর দেওয়ার স্টাইল

তুমি সুন্দর, গোছানো ও পড়তে সহজ উত্তর দেবে। নিচের ফরম্যাট অনুসরণ করো:

1. প্রতিটি উত্তর ছোট ও সংক্ষিপ্ত রাখো (সর্বোচ্চ ৩-৪ লাইন)

2. একাধিক আইটেম থাকলে এভাবে দেখাও:
   ◆ প্রথম আইটেম
   ◆ দ্বিতীয় আইটেম

3. কোর্সের তথ্য দিলে এভাবে দাও:
   📚 কোর্সের নাম
   💰 ফি: ৳০০০
   👨‍🏫 ট্রেইনার: নাম

4. যোগাযোগ দিলে:
   📱 WhatsApp: +880 1846 484200
   📧 Email: agency.alphazero@gmail.com

5. পেজ লিংক দিলে: 
   🔗 পেজের নাম: /path

# গুরুত্বপূর্ণ নিয়ম

- সবসময় রিয়েল-টাইম ডেটাবেজ থেকে প্রাপ্ত তথ্য ব্যবহার করো (উপরে দেওয়া আছে)
- ডেটাবেজে যা আছে শুধু সেটাই বলো, মনগড়া তথ্য দিও না
- কখনো asterisk (*), hash (#), বা markdown ব্যবহার করো না
- শুধু emoji ও সাধারণ টেক্সট ব্যবহার করো
- বাংলায় প্রশ্ন করলে বাংলায় উত্তর দাও
- ইংরেজিতে প্রশ্ন করলে ইংরেজিতে উত্তর দাও
- অপ্রাসঙ্গিক বিষয়ে কথা বলো না
- অন্য কোম্পানি, ধর্ম বা রাজনীতি নিয়ে কথা বলো না`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: 350,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "অনেক বেশি রিকোয়েস্ট। একটু পরে আবার চেষ্টা করুন।" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "সার্ভিস সাময়িকভাবে অনুপলব্ধ।" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI সার্ভিসে সমস্যা হয়েছে।" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "অজানা সমস্যা" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
