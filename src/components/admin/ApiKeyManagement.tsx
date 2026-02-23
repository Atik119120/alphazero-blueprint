import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Key, Save, Loader2, Eye, EyeOff, Plus, Trash2, 
  CreditCard, Globe, BarChart3, Shield, Settings2
} from "lucide-react";

interface ApiKeyConfig {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
}

// Define API key categories
const API_CATEGORIES = [
  {
    id: 'payment',
    label: 'পেমেন্ট গেটওয়ে',
    labelEn: 'Payment Gateways',
    icon: CreditCard,
    color: 'from-emerald-500 to-teal-500',
    keys: [
      { key: 'bkash_api_key', label: 'bKash API Key', description: 'bKash Payment Gateway API Key' },
      { key: 'bkash_api_secret', label: 'bKash API Secret', description: 'bKash Payment Gateway Secret' },
      { key: 'bkash_username', label: 'bKash Username', description: 'bKash Merchant Username' },
      { key: 'bkash_password', label: 'bKash Password', description: 'bKash Merchant Password' },
      { key: 'nagad_merchant_id', label: 'Nagad Merchant ID', description: 'Nagad Merchant ID' },
      { key: 'nagad_api_key', label: 'Nagad API Key', description: 'Nagad Payment API Key' },
      { key: 'uddoktapay_api_key', label: 'UddoktaPay API Key', description: 'UddoktaPay Payment Gateway API Key' },
      { key: 'uddoktapay_base_url', label: 'UddoktaPay Base URL', description: 'UddoktaPay API Base URL' },
    ]
  },
  {
    id: 'google',
    label: 'গুগল সার্ভিস',
    labelEn: 'Google Services',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    keys: [
      { key: 'google_ads_client_id', label: 'Google Ads Client ID', description: 'Google Ads Account Client ID' },
      { key: 'google_ads_api_key', label: 'Google Ads API Key', description: 'Google Ads Developer Token' },
      { key: 'google_analytics_id', label: 'Google Analytics ID', description: 'GA4 Measurement ID (G-XXXXXXX)' },
      { key: 'google_tag_manager_id', label: 'Google Tag Manager ID', description: 'GTM Container ID (GTM-XXXXXXX)' },
      { key: 'google_recaptcha_key', label: 'reCAPTCHA Site Key', description: 'Google reCAPTCHA v3 Site Key' },
    ]
  },
  {
    id: 'meta',
    label: 'মেটা / ফেসবুক',
    labelEn: 'Meta / Facebook',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-500',
    keys: [
      { key: 'meta_pixel_id', label: 'Meta Pixel ID', description: 'Facebook/Meta Pixel Tracking ID' },
      { key: 'meta_access_token', label: 'Meta Access Token', description: 'Meta Marketing API Access Token' },
      { key: 'meta_app_id', label: 'Meta App ID', description: 'Facebook App ID' },
      { key: 'meta_app_secret', label: 'Meta App Secret', description: 'Facebook App Secret' },
    ]
  },
  {
    id: 'other',
    label: 'অন্যান্য',
    labelEn: 'Other Services',
    icon: Settings2,
    color: 'from-amber-500 to-orange-500',
    keys: [
      { key: 'telegram_bot_token', label: 'Telegram Bot Token', description: 'Telegram Bot API Token' },
      { key: 'telegram_chat_id', label: 'Telegram Chat ID', description: 'Telegram Group/Channel Chat ID' },
      { key: 'resend_api_key', label: 'Resend API Key', description: 'Resend Email Service API Key' },
      { key: 'cloudflare_turnstile_key', label: 'Turnstile Site Key', description: 'Cloudflare Turnstile Site Key' },
    ]
  }
];

const ApiKeyManagement = () => {
  const queryClient = useQueryClient();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('payment');
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Fetch all API settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      const allKeys = API_CATEGORIES.flatMap(cat => cat.keys.map(k => k.key));
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', allKeys);
      
      if (error) throw error;
      return (data || []) as ApiKeyConfig[];
    }
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // Check if key exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: value, updated_at: new Date().toISOString() })
          .eq('setting_key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ setting_key: key, setting_value: value, setting_type: 'api_key' });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['api-settings'] });
      toast.success(`${variables.key} সেভ হয়েছে!`);
      setEditedValues(prev => {
        const next = { ...prev };
        delete next[variables.key];
        return next;
      });
      setSavingKey(null);
    },
    onError: () => {
      toast.error('সেভ করতে সমস্যা হয়েছে');
      setSavingKey(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('setting_key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-settings'] });
      toast.success('API Key মুছে ফেলা হয়েছে');
    }
  });

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.setting_key === key)?.setting_value || '';
  };

  const isConfigured = (key: string) => {
    const val = getSettingValue(key);
    return val && val.trim().length > 0;
  };

  const handleSave = (key: string) => {
    const value = editedValues[key];
    if (value !== undefined) {
      setSavingKey(key);
      upsertMutation.mutate({ key, value });
    }
  };

  const toggleVisibility = (key: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return '•'.repeat(value.length);
    return value.slice(0, 4) + '•'.repeat(value.length - 8) + value.slice(-4);
  };

  const currentCategory = API_CATEGORIES.find(c => c.id === activeCategory)!;
  const configuredCount = (cat: typeof API_CATEGORIES[0]) => 
    cat.keys.filter(k => isConfigured(k.key)).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Key className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">API কী ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">পেমেন্ট গেটওয়ে, গুগল, মেটা এবং অন্যান্য API কী সেটআপ করুন</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {API_CATEGORIES.map(cat => {
          const CatIcon = cat.icon;
          const configured = configuredCount(cat);
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border/50 hover:border-border bg-card hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                <CatIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-center">{cat.label}</span>
              {configured > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {configured}/{cat.keys.length}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Keys List */}
      <div className="space-y-3">
        {currentCategory.keys.map(keyConfig => {
          const currentValue = editedValues[keyConfig.key] ?? getSettingValue(keyConfig.key);
          const hasChanges = editedValues[keyConfig.key] !== undefined;
          const configured = isConfigured(keyConfig.key);
          const isVisible = visibleKeys.has(keyConfig.key);

          return (
            <Card key={keyConfig.key} className={`border transition-all ${configured ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/50'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    configured ? 'bg-emerald-500/20' : 'bg-muted'
                  }`}>
                    {configured ? (
                      <Shield className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Key className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{keyConfig.label}</p>
                        <p className="text-xs text-muted-foreground">{keyConfig.description}</p>
                      </div>
                      {configured && (
                        <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[10px]">
                          সক্রিয়
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={isVisible ? "text" : "password"}
                          value={isVisible ? currentValue : (currentValue ? maskValue(currentValue) : '')}
                          onChange={(e) => setEditedValues(prev => ({ ...prev, [keyConfig.key]: e.target.value }))}
                          onFocus={() => {
                            if (!visibleKeys.has(keyConfig.key)) {
                              toggleVisibility(keyConfig.key);
                            }
                          }}
                          placeholder="API Key বসান..."
                          className="pr-10 h-9 text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => toggleVisibility(keyConfig.key)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSave(keyConfig.key)}
                        disabled={!hasChanges || savingKey === keyConfig.key}
                        variant={hasChanges ? "default" : "secondary"}
                        className="h-9 px-3"
                      >
                        {savingKey === keyConfig.key ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      {configured && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('এই API Key মুছতে চান?')) {
                              deleteMutation.mutate(keyConfig.key);
                            }
                          }}
                          className="h-9 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">💡 গুরুত্বপূর্ণ তথ্য</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1.5">
          <p>• API Key সেভ করলে তা সাথে সাথে সক্রিয় হয়ে যাবে</p>
          <p>• পেমেন্ট API সেটআপ না হলে ম্যানুয়াল বিকাশ/নগদ সিস্টেম চালু থাকবে</p>
          <p>• Google Ads ও Meta Pixel ID দিলে ওয়েবসাইটে ট্র্যাকিং কোড অটো যুক্ত হবে</p>
          <p>• API Key ভুল দিলে সংশ্লিষ্ট সার্ভিস কাজ করবে না</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
