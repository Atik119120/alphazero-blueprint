import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Image, Type, Save, Loader2 } from "lucide-react";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
}

const SiteSettingsManagement = () => {
  const queryClient = useQueryClient();
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      return data as SiteSetting[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('সেটিং আপডেট হয়েছে!');
    },
    onError: () => {
      toast.error('সেটিং আপডেট করতে সমস্যা হয়েছে');
    }
  });

  const handleChange = (key: string, value: string) => {
    setEditedSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const value = editedSettings[key];
    if (value !== undefined) {
      updateMutation.mutate({ key, value });
      setEditedSettings(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  };

  const handleToggle = (key: string, currentValue: string | null) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    updateMutation.mutate({ key, value: newValue });
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      'favicon_url': 'Favicon URL',
      'logo_url': 'Logo URL',
      'site_name': 'Site Name',
      'bkash_number': 'বিকাশ নাম্বার',
      'nagad_number': 'নগদ নাম্বার',
      'bkash_enabled': 'বিকাশ পেমেন্ট',
      'nagad_enabled': 'নগদ পেমেন্ট',
    };
    return labels[key] || key;
  };

  const getSettingDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      'favicon_url': 'ব্রাউজার ট্যাবে দেখানো ছোট আইকন (URL দিন)',
      'logo_url': 'সাইটের মূল লোগো (URL দিন)',
      'site_name': 'সাইটের নাম',
      'bkash_number': 'কোর্স পেমেন্টের জন্য বিকাশ নাম্বার',
      'nagad_number': 'কোর্স পেমেন্টের জন্য নগদ নাম্বার',
      'bkash_enabled': 'বিকাশ ম্যানুয়াল পেমেন্ট অপশন চালু/বন্ধ করুন',
      'nagad_enabled': 'নগদ ম্যানুয়াল পেমেন্ট অপশন চালু/বন্ধ করুন',
    };
    return descriptions[key] || '';
  };

  const getSettingIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const toggleSettings = settings?.filter(s => s.setting_type === 'toggle') || [];
  const otherSettings = settings?.filter(s => s.setting_type !== 'toggle') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">সাইট সেটিংস</h2>
          <p className="text-muted-foreground">Favicon, Logo এবং সাইটের নাম পরিবর্তন করুন</p>
        </div>
      </div>

      {/* Toggle Settings - bKash/Nagad on/off */}
      {toggleSettings.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">💳 পেমেন্ট অপশন</CardTitle>
            <CardDescription>ম্যানুয়াল পেমেন্ট মেথড চালু/বন্ধ করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {toggleSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/30">
                <div>
                  <p className="font-medium">{getSettingLabel(setting.setting_key)}</p>
                  <p className="text-xs text-muted-foreground">{getSettingDescription(setting.setting_key)}</p>
                </div>
                <Switch
                  checked={setting.setting_value === 'true'}
                  onCheckedChange={() => handleToggle(setting.setting_key, setting.setting_value)}
                  disabled={updateMutation.isPending}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {otherSettings.map((setting) => {
          const currentValue = editedSettings[setting.setting_key] ?? setting.setting_value ?? '';
          const hasChanges = editedSettings[setting.setting_key] !== undefined;
          
          return (
            <Card key={setting.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {getSettingIcon(setting.setting_type)}
                  <CardTitle className="text-lg">{getSettingLabel(setting.setting_key)}</CardTitle>
                </div>
                <CardDescription>{getSettingDescription(setting.setting_key)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {setting.setting_type === 'image' && currentValue && (
                  <div className="relative h-20 w-20 rounded-lg border border-border overflow-hidden bg-secondary">
                    <img 
                      src={currentValue} 
                      alt={setting.setting_key}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor={setting.setting_key}>
                    {setting.setting_type === 'image' ? 'Image URL' : 'Value'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={setting.setting_key}
                      value={currentValue}
                      onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                      placeholder={setting.setting_type === 'image' ? 'https://example.com/image.png' : 'Enter value'}
                    />
                    <Button 
                      size="icon" 
                      onClick={() => handleSave(setting.setting_key)}
                      disabled={!hasChanges || updateMutation.isPending}
                      variant={hasChanges ? "default" : "secondary"}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">💡 টিপস</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Favicon এর জন্য .ico, .png বা .svg ফাইল ব্যবহার করুন (32x32 বা 64x64 পিক্সেল)</p>
          <p>• Logo এর জন্য transparent PNG ব্যবহার করুন</p>
          <p>• Image URL দেওয়ার আগে নিশ্চিত হন যে লিঙ্কটি publicly accessible</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManagement;
