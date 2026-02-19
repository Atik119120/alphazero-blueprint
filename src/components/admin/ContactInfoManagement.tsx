import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, MessageCircle, Save, Loader2, Contact } from "lucide-react";

interface PageContent {
  id: string;
  page_name: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

// Contact info fields that we want to expose for easy editing
const CONTACT_FIELDS = [
  {
    key: 'info.phone',
    label: 'ফোন নম্বর',
    labelEn: 'Phone Number',
    icon: Phone,
    placeholder: '+880 1410-190019',
    hint: 'কল করার নম্বর — ঠিক এইভাবে দিন: +880 1410-190019',
    color: 'text-primary',
  },
  {
    key: 'info.whatsapp',
    label: 'WhatsApp নম্বর (লিংকের জন্য)',
    labelEn: 'WhatsApp Number (for link)',
    icon: MessageCircle,
    placeholder: '+8801846484200',
    hint: 'লিংকে ব্যবহার হবে — স্পেস বা ড্যাশ ছাড়া: +8801846484200',
    color: 'text-[#25D366]',
  },
  {
    key: 'info.whatsapp_display',
    label: 'WhatsApp নম্বর (প্রদর্শনের জন্য)',
    labelEn: 'WhatsApp Number (display)',
    icon: MessageCircle,
    placeholder: '+880 1846-484200',
    hint: 'পেজে যেভাবে দেখাবে: +880 1846-484200',
    color: 'text-[#25D366]',
  },
  {
    key: 'info.email',
    label: 'ইমেইল',
    labelEn: 'Email Address',
    icon: Mail,
    placeholder: 'agency.alphazero@gmail.com',
    hint: 'Contact পেজ ও ইমেইল বাটনে ব্যবহার হবে',
    color: 'text-primary',
  },
  {
    key: 'info.address',
    label: 'ঠিকানা (English)',
    labelEn: 'Address (English)',
    icon: MapPin,
    placeholder: 'Hi-Tech Park, Rajshahi, Bangladesh',
    hint: 'Contact পেজে ইংরেজিতে দেখাবে',
    color: 'text-primary',
  },
  {
    key: 'info.hours',
    label: 'কাজের সময় (English)',
    labelEn: 'Working Hours (English)',
    icon: Clock,
    placeholder: 'Sat - Thu: 9:00 AM - 6:00 PM',
    hint: 'Contact পেজে দেখানো হবে',
    color: 'text-primary',
  },
];

const ContactInfoManagement = () => {
  const queryClient = useQueryClient();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const { data: contents, isLoading } = useQuery({
    queryKey: ['page-content-contact-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_name', 'contact')
        .in('content_key', CONTACT_FIELDS.map(f => f.key));
      if (error) throw error;
      return data as PageContent[];
    }
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existing = contents?.find(c => c.content_key === key);
      if (existing) {
        const { error } = await supabase
          .from('page_content')
          .update({ content_en: value, content_bn: value })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert({ page_name: 'contact', content_key: key, content_en: value, content_bn: value });
        if (error) throw error;
      }
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['page-content-contact-info'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-public', 'contact'] });
      setEditedValues(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      toast.success('তথ্য আপডেট হয়েছে!');
    },
    onError: () => toast.error('আপডেট করতে সমস্যা হয়েছে'),
  });

  const getValue = (key: string) => {
    if (editedValues[key] !== undefined) return editedValues[key];
    return contents?.find(c => c.content_key === key)?.content_en ?? '';
  };

  const handleChange = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    upsertMutation.mutate({ key, value: editedValues[key] ?? '' });
  };

  const hasChange = (key: string) => editedValues[key] !== undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Contact className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Contact তথ্য</h2>
          <p className="text-muted-foreground">ফোন, WhatsApp, ইমেইল, ঠিকানা — Contact পেজে সরাসরি আপডেট হবে</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CONTACT_FIELDS.map((field) => {
          const IconComp = field.icon;
          const value = getValue(field.key);
          const changed = hasChange(field.key);

          return (
            <Card key={field.key} className={`border-border/50 transition-colors ${changed ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComp className={`h-4 w-4 ${field.color}`} />
                  <CardTitle className="text-base">{field.label}</CardTitle>
                </div>
                <CardDescription className="text-xs">{field.hint}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSave(field.key)}
                    disabled={!changed || upsertMutation.isPending}
                    variant={changed ? "default" : "secondary"}
                  >
                    {upsertMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 text-sm text-muted-foreground space-y-1">
          <p>💡 <strong>WhatsApp লিংকের নম্বর</strong> — কোন স্পেস বা ড্যাশ ছাড়া দিন: <code className="bg-secondary px-1 rounded">+8801846484200</code></p>
          <p>💡 <strong>WhatsApp প্রদর্শনের নম্বর</strong> — যেভাবে পেজে দেখাবে: <code className="bg-secondary px-1 rounded">+880 1846-484200</code></p>
          <p>💡 সেভ বাটন (<Save className="inline h-3 w-3" />) চাপলে সাথে সাথে Contact পেজে আপডেট হবে।</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfoManagement;
