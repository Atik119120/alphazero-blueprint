import { supabase } from '@/integrations/supabase/client';

// Common disposable email domain patterns
const disposablePatterns = [
  /tempmail/i,
  /temp-mail/i,
  /throwaway/i,
  /guerrilla/i,
  /mailinator/i,
  /fakeinbox/i,
  /yopmail/i,
  /trashmail/i,
  /10minute/i,
  /mohmal/i,
  /getairmail/i,
  /sharklasers/i,
  /spam4/i,
  /getnada/i,
  /discard/i,
  /maildrop/i,
  /tempinbox/i,
  /emailondeck/i,
];

// Cache for disposable domains from database
let cachedDomains: string[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchDisposableDomains(): Promise<string[]> {
  const now = Date.now();
  
  if (cachedDomains.length > 0 && now - lastFetch < CACHE_DURATION) {
    return cachedDomains;
  }

  try {
    const { data, error } = await supabase
      .from('disposable_email_domains')
      .select('domain');
    
    if (error) {
      console.error('Error fetching disposable domains:', error);
      return cachedDomains;
    }
    
    cachedDomains = data?.map(d => d.domain.toLowerCase()) || [];
    lastFetch = now;
    return cachedDomains;
  } catch (err) {
    console.error('Error fetching disposable domains:', err);
    return cachedDomains;
  }
}

export async function isDisposableEmail(email: string): Promise<boolean> {
  if (!email || !email.includes('@')) {
    return false;
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  // Check against pattern matches first
  for (const pattern of disposablePatterns) {
    if (pattern.test(domain)) {
      return true;
    }
  }

  // Check against database domains
  const domains = await fetchDisposableDomains();
  return domains.includes(domain);
}

export function getEmailValidationError(language: 'en' | 'bn'): string {
  return language === 'bn' 
    ? 'অস্থায়ী ইমেইল ব্যবহার করা যাবে না। অনুগ্রহ করে একটি স্থায়ী ইমেইল ব্যবহার করুন।'
    : 'Temporary emails are not allowed. Please use a permanent email address.';
}
