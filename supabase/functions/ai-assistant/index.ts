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

// AlphaZero website knowledge base
const websiteKnowledge = `
আপনি AlphaZero-এর AI সহকারী। AlphaZero একটি ক্রিয়েটিভ ডিজাইন ও আইটি এজেন্সি যা বাংলাদেশের রাজশাহীতে অবস্থিত।

**আমাদের সেবাসমূহ:**
1. **গ্রাফিক ডিজাইন সার্ভিস:**
   - লোগো ডিজাইন - আপনার ব্র্যান্ডের পরিচয় তৈরি
   - ব্র্যান্ড আইডেন্টিটি - সম্পূর্ণ ভিজ্যুয়াল সিস্টেম
   - সোশ্যাল মিডিয়া ডিজাইন - আকর্ষণীয় পোস্ট ও স্টোরি
   - ব্যানার ও পোস্টার ডিজাইন
   - প্রিন্ট ডিজাইন - বিজনেস কার্ড, ব্রোশিওর

2. **ওয়েবসাইট ডেভেলপমেন্ট:**
   - UI/UX ডিজাইন
   - ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট
   - ই-কমার্স ওয়েবসাইট
   - SEO অপ্টিমাইজেশন

3. **ভিডিও এডিটিং সার্ভিস:**
   - প্রোমোশনাল ভিডিও
   - সোশ্যাল মিডিয়া রিলস
   - মোশন গ্রাফিক্স
   - ইভেন্ট হাইলাইটস

4. **ডিজিটাল মার্কেটিং:**
   - সোশ্যাল মিডিয়া অ্যাডস
   - Google Ads
   - কন্টেন্ট মার্কেটিং
   - লিড জেনারেশন

5. **কম্পিউটার অপারেশন সার্ভিস:**
   - Microsoft Excel, Word, PowerPoint
   - ডাটা এন্ট্রি
   - ডকুমেন্ট ফরম্যাটিং

**পেজ নেভিগেশন:**
- হোম পেজ: / - আমাদের প্রধান পেজ
- আমাদের সম্পর্কে: /about - AlphaZero সম্পর্কে জানুন
- সেবাসমূহ: /services - আমাদের সব সার্ভিস দেখুন
- আমাদের কাজ: /work - পোর্টফোলিও ও প্রজেক্ট
- টিম: /team - আমাদের টিম মেম্বারদের সাথে পরিচিত হন
- কোর্স: /courses - আমাদের ট্রেনিং প্রোগ্রাম
- যোগাযোগ: /contact - আমাদের সাথে যোগাযোগ করুন

**যোগাযোগের তথ্য:**
- Email: agency.alphazero@gmail.com
- WhatsApp: +880 1846 484200
- ঠিকানা: বর্ণালী, রাজশাহী, বাংলাদেশ - ৬০০০
- কাজের সময়: শনি - বৃহস্পতি: সকাল ১০টা - রাত ৮টা

**সোশ্যাল মিডিয়া:**
- Facebook: https://www.facebook.com/share/1Zm7yMhPtk/
- Instagram: https://www.instagram.com/alphazero.online
- X (Twitter): https://x.com/AgencyAlphazero

**আমাদের মূল বৈশিষ্ট্য:**
- ৫০+ প্রজেক্ট সম্পন্ন
- ৩০+ সন্তুষ্ট ক্লায়েন্ট
- ৩+ বছরের অভিজ্ঞতা
- ১০০% ক্লায়েন্ট সন্তুষ্টি

**আমাদের স্লোগান:** "শূন্য থেকে প্রভাব" / "From Zero to Impact"

সবসময় বাংলায় বা ইংরেজিতে উত্তর দিন ব্যবহারকারীর ভাষা অনুযায়ী। সংক্ষিপ্ত, সহায়ক এবং বন্ধুত্বপূর্ণ উত্তর দিন। যদি কেউ কোনো সার্ভিস সম্পর্কে জানতে চায়, তাদের /services পেজে যেতে বা /contact পেজে যোগাযোগ করতে বলুন।
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `${websiteKnowledge}

আপনি AlphaZero-এর বন্ধুত্বপূর্ণ AI সহকারী। আপনার কাজ হলো ভিজিটরদের সাহায্য করা:
- ওয়েবসাইটে নেভিগেট করতে
- সার্ভিস সম্পর্কে জানাতে
- যোগাযোগের তথ্য দিতে
- প্রশ্নের উত্তর দিতে

সংক্ষিপ্ত ও সহায়ক উত্তর দিন। প্রয়োজনে সঠিক পেজের লিংক দিন।`
          },
          ...messages,
        ],
        stream: true,
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
