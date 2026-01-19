import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: Simple in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input validation
function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "Messages cannot be empty" };
  }
  
  if (messages.length > 50) {
    return { valid: false, error: "Too many messages (max 50)" };
  }
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `Invalid message at index ${i}` };
    }
    
    if (!msg.role || typeof msg.role !== 'string') {
      return { valid: false, error: `Missing or invalid role at index ${i}` };
    }
    
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: `Invalid role "${msg.role}" at index ${i}` };
    }
    
    if (!msg.content || typeof msg.content !== 'string') {
      return { valid: false, error: `Missing or invalid content at index ${i}` };
    }
    
    if (msg.content.length > 4000) {
      return { valid: false, error: `Message too long at index ${i} (max 4000 chars)` };
    }
    
    // Basic sanitization - remove potential injection attempts
    if (msg.content.includes('<script>') || msg.content.includes('javascript:')) {
      return { valid: false, error: "Invalid content detected" };
    }
  }
  
  return { valid: true };
}

// AlphaZero website knowledge base - comprehensive and structured
const websiteKnowledge = `
# AlphaZero Agency সম্পর্কে

AlphaZero একটি ক্রিয়েটিভ ডিজাইন ও আইটি এজেন্সি, রাজশাহী, বাংলাদেশে অবস্থিত।

স্লোগান: "শূন্য থেকে প্রভাব" (From Zero to Impact)

## আমাদের অর্জন
- 50+ প্রজেক্ট সম্পন্ন
- 30+ সন্তুষ্ট ক্লায়েন্ট
- 3+ বছরের অভিজ্ঞতা
- 100% ক্লায়েন্ট সন্তুষ্টি

## যোগাযোগ
- ইমেইল: agency.alphazero@gmail.com
- WhatsApp: +880 1846 484200
- ঠিকানা: বর্ণালী, রাজশাহী-6000
- কাজের সময়: শনি-বৃহস্পতি, সকাল ১০টা - রাত ৮টা

## সোশ্যাল মিডিয়া
- Facebook: facebook.com/share/1Zm7yMhPtk
- Instagram: instagram.com/alphazero.online
- Twitter/X: x.com/AgencyAlphazero

## ওয়েবসাইটের পেজ
- হোম: /
- আমাদের সম্পর্কে: /about
- সেবাসমূহ: /services
- আমাদের কাজ: /work
- টিম: /team
- কোর্স (Alpha Academy): /courses
- যোগাযোগ: /contact
- টিমে যোগ দিন: /join-team

---

# আমাদের সেবাসমূহ (Services)

1. গ্রাফিক ডিজাইন - লোগো, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া ডিজাইন, ব্যানার, পোস্টার
2. ওয়েব ডেভেলপমেন্ট - UI/UX ডিজাইন, ওয়েবসাইট তৈরি, ই-কমার্স, SEO
3. ভিডিও এডিটিং - প্রোমোশনাল ভিডিও, রিলস, মোশন গ্রাফিক্স
4. ডিজিটাল মার্কেটিং - Facebook/Google Ads, কন্টেন্ট মার্কেটিং
5. কম্পিউটার অপারেশন - MS Office, ডাটা এন্ট্রি

---

# Alpha Academy - আমাদের কোর্সসমূহ

সব কোর্স 100% অনলাইন-বেজড এবং বিগিনার-ফ্রেন্ডলি।

## কোর্স তালিকা ও ফি:

1. গুগল নলেজ প্যানেল ক্রিয়েশন - ৳3,000
   - ট্রেইনার: Sofiullah Ahammad
   - গুগলে ব্র্যান্ড/ব্যক্তিগত প্রোফাইলের নলেজ প্যানেল তৈরি

2. মাইক্রোসফট অফিস (Word, Excel, PowerPoint) - ৳2,000
   - ট্রেইনার: Md. Kamrul Hasan
   - অফিস কাজের জন্য সম্পূর্ণ MS Office দক্ষতা

3. গ্রাফিক ডিজাইন - ৳4,000
   - ট্রেইনার: Adib Sarkar
   - Photoshop, Illustrator, লোগো ও ব্র্যান্ডিং

4. ভিডিও এডিটিং - ৳4,500
   - ট্রেইনার: Md. Shafiul Haque
   - Premiere Pro, কালার গ্রেডিং, সোশ্যাল মিডিয়া ভিডিও

5. ফটোগ্রাফি - ৳2,500
   - ট্রেইনার: Sofiullah Ahammad
   - ক্যামেরা বেসিক, লাইটিং, ফটো এডিটিং

6. SEO ও ডিজিটাল মার্কেটিং - ৳4,000 (শীঘ্রই আসছে)
   - ট্রেইনার: Sofiullah Ahammad
   - Google/Facebook মার্কেটিং, SEO

7. ওয়েব কোডিং (HTML, CSS, JavaScript) - ৳5,000 (শীঘ্রই আসছে)
   - ট্রেইনার: শীঘ্রই ঘোষণা হবে

8. মোশন গ্রাফিক্স (After Effects) - ৳5,500
   - ট্রেইনার: Md. Shafiul Haque
   - After Effects, অ্যানিমেশন, ভিজ্যুয়াল ইফেক্টস

9. ভাইব কোডিং (AI দিয়ে ওয়েবসাইট তৈরি) - ৳4,500
   - ট্রেইনার: Sofiullah Ahammad
   - কোডিং না জেনে AI দিয়ে ওয়েবসাইট বানান

10. AI প্রম্পট ইঞ্জিনিয়ারিং - ৳3,500
    - ট্রেইনার: Sofiullah Ahammad
    - ChatGPT, Midjourney, Claude এর জন্য প্রম্পট লেখা

11. আইটি সাপোর্ট - ৳3,000
    - ট্রেইনার: Prantik Saha
    - কম্পিউটার ট্রাবলশুটিং, নেটওয়ার্কিং

## ভর্তির নিয়ম
- /courses পেজে গিয়ে অনলাইন ফর্ম পূরণ করুন
- অথবা WhatsApp: +880 1846 484200 এ যোগাযোগ করুন

---

# টিম মেম্বার

- Adib Sarkar - Lead Designer, Entrepreneur
- Sofiullah Ahammad - Graphics Designer, Vibe Coding Expert
- Md. Kamrul Hasan - Microsoft Office Expert
- Md. Shafiul Haque - Web Designer, Video Editor
- Prantik Saha - Graphics Designer, IT Support
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ 
        error: "অনেক বেশি রিকোয়েস্ট। একটু পরে আবার চেষ্টা করুন।" 
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = body;

    // Validate messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      console.log(`Validation failed: ${validation.error}`);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing AI assistant request with ${messages.length} messages from IP: ${clientIP}`);

    const systemPrompt = `${websiteKnowledge}

---

# তোমার পরিচয় ও নির্দেশনা

তুমি "জিরো" - AlphaZero-এর AI সহকারী। তুমি বন্ধুত্বপূর্ণ, সহায়ক এবং প্রফেশনাল।

## উত্তর দেওয়ার নিয়ম:
1. সংক্ষিপ্ত উত্তর দাও (2-4 বাক্যে)
2. কখনো asterisk (*) বা markdown formatting ব্যবহার করো না
3. সাধারণ টেক্সটে উত্তর দাও, পয়েন্ট দিতে চাইলে ড্যাশ (-) বা নম্বর ব্যবহার করো
4. ব্যবহারকারীর ভাষায় উত্তর দাও (বাংলা/ইংরেজি)
5. প্রশ্নের সরাসরি উত্তর দাও, অপ্রয়োজনীয় তথ্য দিও না

## কোর্স সম্পর্কে জিজ্ঞাসায়:
- কোর্সের নাম, ফি এবং ট্রেইনার বলো
- ভর্তির জন্য /courses পেজে যেতে বা WhatsApp করতে বলো

## পেজ লিংক দেওয়ার নিয়ম:
- শুধু পেজের নাম এবং পাথ বলো, যেমন: "কোর্স পেজ: /courses"
- সেবার জন্য: /services
- যোগাযোগের জন্য: /contact

## যা করবে না:
- অন্য কোম্পানি বা প্রতিযোগীর তথ্য দিও না
- ধর্মীয় বা রাজনৈতিক বিষয়ে কথা বলো না
- মিথ্যা তথ্য দিও না
- অতিরিক্ত লম্বা উত্তর দিও না`;

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
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "অনেক বেশি রিকোয়েস্ট। একটু পরে আবার চেষ্টা করুন।" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "সার্ভিস সাময়িকভাবে অনুপলব্ধ।" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI সার্ভিসে সমস্যা হয়েছে।" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("AI response received, streaming...");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "অজানা সমস্যা" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
