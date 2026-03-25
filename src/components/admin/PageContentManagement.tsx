import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Home, Info, Phone, Plus, Save, Loader2, Trash2, Pencil, Briefcase, Users, Wrench, Globe, Languages, Search, X, CheckCircle2, HelpCircle, Tag, DollarSign, UserPlus, BookOpen, Eye, EyeOff } from "lucide-react";

interface PageContent {
  id: string;
  page_name: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

// Human-readable labels and descriptions for content keys
const CONTENT_KEY_INFO: Record<string, Record<string, { label: string; labelEn: string; description: string }>> = {
  home: {
    'hero.title': { label: '🏠 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'হোম পেজের একদম উপরের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 হিরো সাবটাইটেল', labelEn: 'Hero Subtitle', description: 'টাইটেলের উপরের ছোট ট্যাগলাইন' },
    'hero.description': { label: '📝 হিরো বর্ণনা', labelEn: 'Hero Description', description: 'হিরো সেকশনের প্যারাগ্রাফ টেক্সট' },
    'hero.tagline': { label: '⚡ ট্যাগলাইন', labelEn: 'Tagline', description: 'ছোট ব্র্যান্ড ট্যাগলাইন' },
    'hero.cta1': { label: '🔗 প্রাইমারি বাটন', labelEn: 'Primary CTA', description: 'হিরোর প্রথম বাটনের টেক্সট' },
    'hero.cta2': { label: '🔗 সেকেন্ডারি বাটন', labelEn: 'Secondary CTA', description: 'হিরোর দ্বিতীয় বাটনের টেক্সট' },
    'services.title': { label: '🛠️ সার্ভিস শিরোনাম', labelEn: 'Services Section Title', description: 'হোম পেজে সার্ভিস সেকশনের হেডিং' },
    'services.subtitle': { label: '🛠️ সার্ভিস সাবটাইটেল', labelEn: 'Services Subtitle', description: 'সার্ভিস সেকশনের ছোট বর্ণনা' },
    'stats.projects': { label: '📊 প্রজেক্ট সংখ্যা', labelEn: 'Projects Count', description: 'প্রজেক্টের সংখ্যা (যেমন 50+)' },
    'stats.projects_label': { label: '📊 প্রজেক্ট লেবেল', labelEn: 'Projects Label', description: 'প্রজেক্টের নিচের টেক্সট' },
    'stats.clients': { label: '👥 ক্লায়েন্ট সংখ্যা', labelEn: 'Clients Count', description: 'ক্লায়েন্টের সংখ্যা (যেমন 30+)' },
    'stats.clients_label': { label: '👥 ক্লায়েন্ট লেবেল', labelEn: 'Clients Label', description: 'ক্লায়েন্টের নিচের টেক্সট' },
    'stats.years': { label: '📅 বছর সংখ্যা', labelEn: 'Years Count', description: 'অভিজ্ঞতার বছর (যেমন 3+)' },
    'stats.years_label': { label: '📅 বছর লেবেল', labelEn: 'Years Label', description: 'বছরের নিচের টেক্সট' },
    'stats.satisfaction': { label: '✅ সন্তুষ্টি %', labelEn: 'Satisfaction %', description: 'ক্লায়েন্ট সন্তুষ্টি (যেমন 100%)' },
    'stats.satisfaction_label': { label: '✅ সন্তুষ্টি লেবেল', labelEn: 'Satisfaction Label', description: 'সন্তুষ্টির নিচের টেক্সট' },
    'why.title': { label: '❓ কেন আমরা শিরোনাম', labelEn: 'Why Choose Us Title', description: '"কেন আমাদের বেছে নিবেন" সেকশনের হেডিং' },
    'testimonials.title': { label: '💬 টেস্টিমোনিয়াল শিরোনাম', labelEn: 'Testimonials Title', description: 'রিভিউ সেকশনের হেডিং' },
    'cta.title': { label: '📢 CTA শিরোনাম', labelEn: 'CTA Title', description: 'পেজের নিচের CTA সেকশনের টাইটেল' },
    'cta.description': { label: '📢 CTA বর্ণনা', labelEn: 'CTA Description', description: 'CTA সেকশনের বিস্তারিত' },
    'cta.button': { label: '📢 CTA বাটন', labelEn: 'CTA Button Text', description: 'CTA বাটনের টেক্সট' },
  },
  about: {
    'hero.title': { label: '🏢 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'About পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
    'story.title': { label: '📖 গল্প শিরোনাম', labelEn: 'Story Title', description: 'আমাদের গল্প সেকশনের হেডিং' },
    'story.description': { label: '📖 গল্প বর্ণনা', labelEn: 'Story Description', description: 'গল্প সেকশনের বিস্তারিত' },
    'story.content': { label: '📖 গল্প কনটেন্ট', labelEn: 'Story Content', description: 'গল্পের মূল টেক্সট' },
    'values.title': { label: '💎 ভ্যালু শিরোনাম', labelEn: 'Values Title', description: 'Core Values সেকশনের হেডিং' },
    'values.creativity': { label: '🎨 ক্রিয়েটিভিটি', labelEn: 'Creativity Value', description: 'ক্রিয়েটিভিটি ভ্যালু কার্ডের শিরোনাম' },
    'values.creativity_desc': { label: '🎨 ক্রিয়েটিভিটি বর্ণনা', labelEn: 'Creativity Desc', description: 'ক্রিয়েটিভিটির বিস্তারিত' },
    'values.quality': { label: '⭐ কোয়ালিটি', labelEn: 'Quality Value', description: 'কোয়ালিটি ভ্যালু কার্ড' },
    'values.quality_desc': { label: '⭐ কোয়ালিটি বর্ণনা', labelEn: 'Quality Desc', description: 'কোয়ালিটির বিস্তারিত' },
    'values.integrity': { label: '🛡️ ইন্টেগ্রিটি', labelEn: 'Integrity Value', description: 'ইন্টেগ্রিটি ভ্যালু কার্ড' },
    'values.integrity_desc': { label: '🛡️ ইন্টেগ্রিটি বর্ণনা', labelEn: 'Integrity Desc', description: 'ইন্টেগ্রিটির বিস্তারিত' },
    'location.title': { label: '📍 লোকেশন শিরোনাম', labelEn: 'Location Title', description: 'লোকেশন সেকশনের হেডিং' },
    'location.description': { label: '📍 লোকেশন বর্ণনা', labelEn: 'Location Description', description: 'ঠিকানার নিচের বিবরণ' },
    'cta.title': { label: '📢 CTA শিরোনাম', labelEn: 'CTA Title', description: 'নিচের CTA সেকশনের টাইটেল' },
    'cta.button': { label: '📢 CTA বাটন', labelEn: 'CTA Button', description: 'CTA বাটনের টেক্সট' },
  },
  contact: {
    'hero.title': { label: '📞 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Contact পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
    'info.phone': { label: '📱 ফোন নম্বর', labelEn: 'Phone Number', description: 'যোগাযোগের ফোন নম্বর' },
    'info.phone_label': { label: '📱 ফোন লেবেল', labelEn: 'Phone Label', description: '"ফোন" লেখাটি' },
    'info.email': { label: '✉️ ইমেইল', labelEn: 'Email', description: 'যোগাযোগের ইমেইল ঠিকানা' },
    'info.email_label': { label: '✉️ ইমেইল লেবেল', labelEn: 'Email Label', description: '"ইমেইল" লেখাটি' },
    'info.address': { label: '🏠 ঠিকানা', labelEn: 'Address', description: 'অফিসের ঠিকানা' },
    'info.address_label': { label: '🏠 ঠিকানা লেবেল', labelEn: 'Address Label', description: '"ঠিকানা" লেখাটি' },
    'info.hours': { label: '🕐 কার্যসময়', labelEn: 'Working Hours', description: 'অফিসের কাজের সময়' },
    'info.hours_label': { label: '🕐 কার্যসময় লেবেল', labelEn: 'Hours Label', description: '"কার্যসময়" লেখাটি' },
    'info.whatsapp': { label: '💬 WhatsApp লিংক', labelEn: 'WhatsApp Link', description: 'WhatsApp নম্বর/লিংক' },
    'info.whatsapp_display': { label: '💬 WhatsApp দেখানো নম্বর', labelEn: 'WhatsApp Display', description: 'WhatsApp বাটনে দেখানো নম্বর' },
    'form.title': { label: '📋 ফর্ম শিরোনাম', labelEn: 'Form Title', description: 'কন্টাক্ট ফর্মের হেডিং' },
    'form.name': { label: '📋 নাম ফিল্ড', labelEn: 'Name Field', description: 'নাম ইনপুটের লেবেল' },
    'form.email': { label: '📋 ইমেইল ফিল্ড', labelEn: 'Email Field', description: 'ইমেইল ইনপুটের লেবেল' },
    'form.subject': { label: '📋 সাবজেক্ট ফিল্ড', labelEn: 'Subject Field', description: 'সাবজেক্ট ইনপুটের লেবেল' },
    'form.message': { label: '📋 মেসেজ ফিল্ড', labelEn: 'Message Field', description: 'মেসেজ ইনপুটের লেবেল' },
    'form.submit': { label: '📋 সাবমিট বাটন', labelEn: 'Submit Button', description: 'ফর্ম সাবমিট বাটনের টেক্সট' },
    'quick.email_btn': { label: '⚡ ইমেইল বাটন', labelEn: 'Quick Email Btn', description: 'দ্রুত ইমেইল বাটনের টেক্সট' },
    'quick.whatsapp_btn': { label: '⚡ WhatsApp বাটন', labelEn: 'Quick WhatsApp Btn', description: 'দ্রুত WhatsApp বাটনের টেক্সট' },
  },
  services: {
    'hero.title': { label: '🛠️ হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Services পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
    'process.title': { label: '🔄 প্রক্রিয়া শিরোনাম', labelEn: 'Process Title', description: '"কিভাবে কাজ করি" সেকশনের হেডিং' },
    'cta.title': { label: '📢 CTA শিরোনাম', labelEn: 'CTA Title', description: 'নিচের CTA সেকশনের টাইটেল' },
    'cta.button': { label: '📢 CTA বাটন', labelEn: 'CTA Button', description: 'CTA বাটনের টেক্সট' },
  },
  work: {
    'hero.title': { label: '💼 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Work পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
    'web.title': { label: '🌐 ওয়েব শিরোনাম', labelEn: 'Web Section Title', description: 'ওয়েব ক্যাটাগরির হেডিং' },
    'graphics.title': { label: '🎨 গ্রাফিক্স শিরোনাম', labelEn: 'Graphics Section Title', description: 'গ্রাফিক্স ক্যাটাগরির হেডিং' },
    'video.title': { label: '🎬 ভিডিও শিরোনাম', labelEn: 'Video Section Title', description: 'ভিডিও ক্যাটাগরির হেডিং' },
    'cta.title': { label: '📢 CTA শিরোনাম', labelEn: 'CTA Title', description: 'নিচের CTA সেকশনের টাইটেল' },
    'cta.button': { label: '📢 CTA বাটন', labelEn: 'CTA Button', description: 'CTA বাটনের টেক্সট' },
  },
  team: {
    'hero.title': { label: '👥 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Team পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
    'join.title': { label: '🤝 জয়েন শিরোনাম', labelEn: 'Join Section Title', description: 'টিমে যোগ দিন সেকশনের হেডিং' },
    'join.description': { label: '🤝 জয়েন বর্ণনা', labelEn: 'Join Description', description: 'জয়েন সেকশনের বিস্তারিত' },
    'join.cta1': { label: '🔗 জয়েন বাটন ১', labelEn: 'Join CTA 1', description: 'প্রথম CTA বাটনের টেক্সট' },
    'join.cta2': { label: '🔗 জয়েন বাটন ২', labelEn: 'Join CTA 2', description: 'দ্বিতীয় CTA বাটনের টেক্সট' },
  },
  pricing: {
    'hero.title': { label: '💰 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Pricing পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
  },
  courses: {
    'hero.title': { label: '📚 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Courses পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
  },
  'join-team': {
    'hero.title': { label: '🤝 হিরো শিরোনাম', labelEn: 'Hero Title', description: 'Join Team পেজের বড় টাইটেল' },
    'hero.subtitle': { label: '🔖 সাবটাইটেল', labelEn: 'Subtitle', description: 'টাইটেলের উপরে ছোট ট্যাগ' },
    'hero.description': { label: '📝 বর্ণনা', labelEn: 'Description', description: 'হিরো সেকশনের প্যারাগ্রাফ' },
  },
};

const PAGES = [
  { id: 'home', label: 'হোম', labelEn: 'Home', icon: Home, color: 'from-sky-500 to-blue-600', description: 'হোম পেজের সব টেক্সট' },
  { id: 'about', label: 'অ্যাবাউট', labelEn: 'About', icon: Info, color: 'from-violet-500 to-purple-600', description: 'আমাদের সম্পর্কে পেজ' },
  { id: 'contact', label: 'কন্টাক্ট', labelEn: 'Contact', icon: Phone, color: 'from-emerald-500 to-teal-600', description: 'যোগাযোগ তথ্য ও ফর্ম' },
  { id: 'services', label: 'সার্ভিসেস', labelEn: 'Services', icon: Wrench, color: 'from-amber-500 to-orange-600', description: 'আমাদের সেবাসমূহ পেজ' },
  { id: 'work', label: 'ওয়ার্ক', labelEn: 'Work', icon: Briefcase, color: 'from-rose-500 to-pink-600', description: 'পোর্টফোলিও পেজ' },
  { id: 'team', label: 'টিম', labelEn: 'Team', icon: Users, color: 'from-cyan-500 to-sky-600', description: 'আমাদের টিম পেজ' },
  { id: 'pricing', label: 'প্রাইসিং', labelEn: 'Pricing', icon: DollarSign, color: 'from-green-500 to-emerald-600', description: 'মূল্যতালিকা পেজ' },
  { id: 'courses', label: 'কোর্স', labelEn: 'Courses', icon: BookOpen, color: 'from-indigo-500 to-blue-600', description: 'কোর্স লিস্ট পেজ' },
  { id: 'join-team', label: 'জয়েন টিম', labelEn: 'Join Team', icon: UserPlus, color: 'from-fuchsia-500 to-pink-600', description: 'টিমে যোগ দিন পেজ' },
];

const PageContentManagement = () => {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("home");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [formData, setFormData] = useState({
    content_key: '',
    content_en: '',
    content_bn: ''
  });
  const [editData, setEditData] = useState<Record<string, { content_en: string; content_bn: string }>>({});

  const { data: contents, isLoading } = useQuery({
    queryKey: ['page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_name')
        .order('content_key');
      if (error) throw error;
      return data as PageContent[];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: Omit<PageContent, 'id'>) => {
      const { error } = await supabase.from('page_content').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast.success('নতুন কনটেন্ট যোগ হয়েছে!');
      setIsAddDialogOpen(false);
      setFormData({ content_key: '', content_en: '', content_bn: '' });
    },
    onError: () => toast.error('কনটেন্ট যোগ করতে সমস্যা হয়েছে')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content_en, content_bn }: { id: string; content_en: string | null; content_bn: string | null }) => {
      const { error } = await supabase.from('page_content').update({ content_en, content_bn }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast.success('কনটেন্ট আপডেট হয়েছে!');
      setEditingId(null);
    },
    onError: () => toast.error('আপডেট করতে সমস্যা হয়েছে')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('page_content').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast.success('কনটেন্ট মুছে ফেলা হয়েছে!');
    },
    onError: () => toast.error('মুছতে সমস্যা হয়েছে')
  });

  const handleAdd = () => {
    if (!formData.content_key.trim()) {
      toast.error('Content Key দিন');
      return;
    }
    addMutation.mutate({
      page_name: selectedPage,
      content_key: formData.content_key,
      content_en: formData.content_en || null,
      content_bn: formData.content_bn || null
    });
  };

  const startEdit = (content: PageContent) => {
    setEditingId(content.id);
    setEditData(prev => ({
      ...prev,
      [content.id]: {
        content_en: content.content_en || '',
        content_bn: content.content_bn || ''
      }
    }));
  };

  const saveEdit = (id: string) => {
    const data = editData[id];
    if (!data) return;
    updateMutation.mutate({
      id,
      content_en: data.content_en || null,
      content_bn: data.content_bn || null
    });
  };

  const selectedPageInfo = PAGES.find(p => p.id === selectedPage);
  const pageKeyInfo = CONTENT_KEY_INFO[selectedPage] || {};

  const getKeyInfo = (key: string) => {
    return pageKeyInfo[key] || { label: key, labelEn: key, description: '' };
  };

  const filteredContents = (contents || []).filter(c => {
    if (c.page_name !== selectedPage) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const info = getKeyInfo(c.content_key);
    return (
      c.content_key.toLowerCase().includes(q) ||
      info.label.toLowerCase().includes(q) ||
      (c.content_en || '').toLowerCase().includes(q) ||
      (c.content_bn || '').toLowerCase().includes(q)
    );
  });

  // Group by section prefix
  const grouped = filteredContents.reduce((acc, c) => {
    const section = c.content_key.split('.')[0] || 'general';
    if (!acc[section]) acc[section] = [];
    acc[section].push(c);
    return acc;
  }, {} as Record<string, PageContent[]>);

  const sectionLabels: Record<string, string> = {
    hero: '🎯 হিরো সেকশন',
    services: '🛠️ সার্ভিস সেকশন',
    stats: '📊 পরিসংখ্যান',
    why: '❓ কেন আমরা',
    testimonials: '💬 রিভিউ',
    cta: '📢 CTA (কল টু অ্যাকশন)',
    story: '📖 আমাদের গল্প',
    values: '💎 মূল্যবোধ',
    location: '📍 লোকেশন',
    info: '📋 তথ্যাবলী',
    form: '📝 ফর্ম ফিল্ড',
    quick: '⚡ কুইক অ্যাকশন',
    join: '🤝 জয়েন সেকশন',
    process: '🔄 প্রক্রিয়া',
    web: '🌐 ওয়েব',
    graphics: '🎨 গ্রাফিক্স',
    video: '🎬 ভিডিও',
    general: '📄 সাধারণ',
  };

  const totalForPage = (contents || []).filter(c => c.page_name === selectedPage).length;

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPageInfo?.color || 'from-primary to-primary'} flex items-center justify-center`}>
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">পেজ কনটেন্ট</h2>
            <p className="text-sm text-muted-foreground">ওয়েবসাইটের প্রতিটি পেজের টেক্সট এখান থেকে চেঞ্জ করুন</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 text-xs"
            onClick={() => setShowDescriptions(!showDescriptions)}
          >
            {showDescriptions ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showDescriptions ? 'বর্ণনা লুকান' : 'বর্ণনা দেখান'}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                নতুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>নতুন কনটেন্ট — {selectedPageInfo?.label}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Content Key</Label>
                  <Input
                    value={formData.content_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_key: e.target.value }))}
                    placeholder="hero.title"
                    className="font-mono text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    ফরম্যাট: section.field (যেমন hero.title, cta.button)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Globe className="w-3 h-3" /> English</Label>
                    <Textarea
                      value={formData.content_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                      placeholder="English text..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><Languages className="w-3 h-3" /> বাংলা</Label>
                    <Textarea
                      value={formData.content_bn}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_bn: e.target.value }))}
                      placeholder="বাংলা টেক্সট..."
                      rows={4}
                    />
                  </div>
                </div>
                <Button onClick={handleAdd} disabled={addMutation.isPending} className="w-full">
                  {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  যোগ করুন
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* How it works info */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-primary">কিভাবে কাজ করে?</h3>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• নিচে থেকে যেকোনো পেজ সিলেক্ট করুন, তারপর সেই পেজের টেক্সট গুলো দেখবেন</p>
          <p>• প্রতিটি আইটেমের পাশে <strong>কোথায় দেখায়</strong> সেটা লেখা আছে — তাহলে বুঝবেন কোনটা কি</p>
          <p>• ✏️ বাটনে ক্লিক করে English ও বাংলা দুইটাই এডিট করতে পারবেন</p>
          <p>• সেভ করলেই ওয়েবসাইটে তাৎক্ষণিক পরিবর্তন হবে ⚡</p>
        </div>
      </div>

      {/* Page Selector Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {PAGES.map(page => {
          const count = (contents || []).filter(c => c.page_name === page.id).length;
          const Icon = page.icon;
          const isActive = selectedPage === page.id;
          return (
            <button
              key={page.id}
              onClick={() => { setSelectedPage(page.id); setSearchQuery(''); }}
              className={`relative p-3 rounded-xl text-center transition-all duration-200 border ${
                isActive
                  ? 'border-primary/50 bg-primary/5 shadow-sm'
                  : 'border-border/50 hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${
                isActive ? `bg-gradient-to-br ${page.color} text-white` : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {page.label}
              </p>
              {count > 0 && (
                <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
                  {count}
                </Badge>
              )}
              {count === 0 && (
                <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0 text-orange-500 border-orange-500/30">
                  খালি
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected page description */}
      {selectedPageInfo && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2.5 rounded-lg">
          <Tag className="w-4 h-4 text-primary" />
          <span>{selectedPageInfo.description}</span>
          <span className="text-xs">•</span>
          <span className="text-xs">{totalForPage} আইটেম</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`${selectedPageInfo?.label} পেজে খুঁজুন...`}
          className="pl-9 h-9"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Content Cards grouped by section */}
      {filteredContents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <div className="space-y-3">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground/30" />
              {searchQuery ? (
                <p>কোনো ফলাফল নেই</p>
              ) : (
                <div>
                  <p className="font-medium">এই পেজে এখনো কোনো কনটেন্ট নেই</p>
                  <p className="text-xs mt-1">নতুন কনটেন্ট যোগ করতে উপরের "নতুন" বাটনে ক্লিক করুন</p>
                  <p className="text-xs mt-1 text-primary">অথবা AI Assistant কে বলুন এই পেজের কনটেন্ট তৈরি করতে!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold">
                {sectionLabels[section] || `📄 ${section}`}
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(content => {
                const isEditing = editingId === content.id;
                const ed = editData[content.id];
                const keyInfo = getKeyInfo(content.content_key);
                return (
                  <Card key={content.id} className={`transition-all ${isEditing ? 'ring-2 ring-primary/30' : 'hover:border-primary/20'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{keyInfo.label}</span>
                            <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {content.content_key}
                            </code>
                          </div>
                          {showDescriptions && keyInfo.description && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              📍 {keyInfo.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          {isEditing ? (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 px-2 text-xs">
                                বাতিল
                              </Button>
                              <Button size="sm" onClick={() => saveEdit(content.id)} disabled={updateMutation.isPending} className="h-7 px-2 text-xs gap-1">
                                {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                সেভ
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(content)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => { if (confirm('মুছে ফেলবেন?')) deleteMutation.mutate(content.id); }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing && ed ? (
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1 text-muted-foreground"><Globe className="w-3 h-3" /> English</Label>
                            <Textarea
                              value={ed.content_en}
                              onChange={(e) => setEditData(prev => ({
                                ...prev,
                                [content.id]: { ...prev[content.id], content_en: e.target.value }
                              }))}
                              rows={3}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1 text-muted-foreground"><Languages className="w-3 h-3" /> বাংলা</Label>
                            <Textarea
                              value={ed.content_bn}
                              onChange={(e) => setEditData(prev => ({
                                ...prev,
                                [content.id]: { ...prev[content.id], content_bn: e.target.value }
                              }))}
                              rows={3}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                              <Globe className="w-3 h-3" /> English
                            </p>
                            <p className="text-sm bg-muted/40 p-2.5 rounded-lg min-h-[44px] leading-relaxed">
                              {content.content_en || <span className="text-muted-foreground italic text-xs">Empty</span>}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                              <Languages className="w-3 h-3" /> বাংলা
                            </p>
                            <p className="text-sm bg-muted/40 p-2.5 rounded-lg min-h-[44px] leading-relaxed">
                              {content.content_bn || <span className="text-muted-foreground italic text-xs">খালি</span>}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PageContentManagement;
