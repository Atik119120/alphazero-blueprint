

## Plan: Admin প্যানেল থেকে সেভ করা API Key Edge Function-এ কাজ করানো

### সমস্যা
বর্তমানে Admin Dashboard-এ UddoktaPay API Key ও Base URL সেভ করলে সেগুলো শুধু `site_settings` টেবিলে যায়। কিন্তু Edge Functions (`uddoktapay-checkout`, `uddoktapay-verify`) শুধু `Deno.env` থেকে সিক্রেট পড়ে — ডাটাবেস থেকে না। তাই Admin প্যানেলে কী সেভ করলেও পেমেন্ট সিস্টেমে কোনো প্রভাব পড়ে না।

### সমাধান
Edge Functions আপডেট করে একটি **fallback system** তৈরি করা হবে:
1. প্রথমে `Deno.env` (runtime secrets) চেক করবে
2. না পেলে `site_settings` টেবিল থেকে পড়বে

### পরিবর্তনসমূহ

**1. `supabase/functions/uddoktapay-checkout/index.ts` আপডেট**
- Supabase Admin Client তৈরি করে `site_settings` টেবিল থেকে `uddoktapay_api_key` ও `uddoktapay_base_url` পড়ার লজিক যোগ করা
- Priority: `Deno.env` → `site_settings` fallback

**2. `supabase/functions/uddoktapay-verify/index.ts` আপডেট**
- একই fallback লজিক যোগ করা

### Technical Details

উভয় Edge Function-এ একটি helper function যোগ হবে:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function getApiConfig() {
  // Try env vars first
  let apiKey = Deno.env.get('UDDOKTAPAY_API_KEY');
  let baseUrl = Deno.env.get('UDDOKTAPAY_BASE_URL');

  // Fallback to site_settings
  if (!apiKey || !baseUrl) {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data } = await supabaseAdmin
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['uddoktapay_api_key', 'uddoktapay_base_url']);

    for (const row of data || []) {
      if (!apiKey && row.setting_key === 'uddoktapay_api_key') apiKey = row.setting_value;
      if (!baseUrl && row.setting_key === 'uddoktapay_base_url') baseUrl = row.setting_value;
    }
  }

  return { apiKey, baseUrl };
}
```

এরপর বিদ্যমান `Deno.env.get()` কলগুলো এই `getApiConfig()` দিয়ে প্রতিস্থাপন করা হবে।

### ফাইল পরিবর্তন
- `supabase/functions/uddoktapay-checkout/index.ts` — fallback লজিক যোগ
- `supabase/functions/uddoktapay-verify/index.ts` — fallback লজিক যোগ

