import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnrollmentNotification {
  studentName: string;
  studentEmail: string;
  courseName: string;
  coursePrice: number;
  paymentMethod: string;
  transactionId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: EnrollmentNotification = await req.json();
    const { studentName, studentEmail, courseName, coursePrice, paymentMethod, transactionId } = body;

    console.log('Received enrollment notification request:', body);

    // Send Telegram notification if configured
    if (telegramBotToken && telegramChatId) {
      const paymentMethodDisplay = paymentMethod === 'bkash' ? '🩷 bKash' : '🧡 Nagad';
      
      const message = `
🎓 *নতুন কোর্স এনরোলমেন্ট রিকুয়েস্ট*

👤 *শিক্ষার্থী:* ${studentName}
📧 *ইমেইল:* ${studentEmail}

📚 *কোর্স:* ${courseName}
💰 *মূল্য:* ৳${coursePrice.toLocaleString()}

${paymentMethodDisplay}
🔢 *Transaction ID:* \`${transactionId}\`

⏰ *সময়:* ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}

_অ্যাডমিন প্যানেলে গিয়ে অনুমোদন করুন।_
      `.trim();

      try {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: message,
              parse_mode: 'Markdown',
            }),
          }
        );

        const telegramResult = await telegramResponse.json();
        console.log('Telegram notification result:', telegramResult);

        if (!telegramResult.ok) {
          console.error('Telegram API error:', telegramResult);
        }
      } catch (telegramError) {
        console.error('Error sending Telegram notification:', telegramError);
      }
    } else {
      console.log('Telegram not configured, skipping notification');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in student-enrollment-notify:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
