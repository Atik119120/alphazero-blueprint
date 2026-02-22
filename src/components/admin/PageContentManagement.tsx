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
import { FileText, Home, Info, Phone, Plus, Save, Loader2, Trash2, Pencil, Briefcase, Users, Wrench, Globe, Languages, Search, X, CheckCircle2 } from "lucide-react";

interface PageContent {
  id: string;
  page_name: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

const PAGES = [
  { id: 'home', label: 'হোম', labelEn: 'Home', icon: Home, color: 'from-sky-500 to-blue-600' },
  { id: 'about', label: 'অ্যাবাউট', labelEn: 'About', icon: Info, color: 'from-violet-500 to-purple-600' },
  { id: 'contact', label: 'কন্টাক্ট', labelEn: 'Contact', icon: Phone, color: 'from-emerald-500 to-teal-600' },
  { id: 'services', label: 'সার্ভিসেস', labelEn: 'Services', icon: Wrench, color: 'from-amber-500 to-orange-600' },
  { id: 'work', label: 'ওয়ার্ক', labelEn: 'Work', icon: Briefcase, color: 'from-rose-500 to-pink-600' },
  { id: 'team', label: 'টিম', labelEn: 'Team', icon: Users, color: 'from-cyan-500 to-sky-600' },
];

const PageContentManagement = () => {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("home");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredContents = (contents || []).filter(c => {
    if (c.page_name !== selectedPage) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.content_key.toLowerCase().includes(q) ||
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
            <p className="text-sm text-muted-foreground">ওয়েবসাইটের সব টেক্সট এখান থেকে এডিট করুন</p>
          </div>
        </div>

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

      {/* Page Selector Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
              <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

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
            {searchQuery ? 'কোনো ফলাফল নেই' : 'এই পেজে কোনো কনটেন্ট নেই। নতুন কনটেন্ট যোগ করুন।'}
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Badge variant="outline" className="text-xs font-mono capitalize">{section}</Badge>
              <span className="text-xs text-muted-foreground">{items.length} আইটেম</span>
            </div>
            <div className="space-y-2">
              {items.map(content => {
                const isEditing = editingId === content.id;
                const ed = editData[content.id];
                return (
                  <Card key={content.id} className={`transition-all ${isEditing ? 'ring-2 ring-primary/30' : 'hover:border-primary/20'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <code className="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {content.content_key}
                        </code>
                        <div className="flex gap-1">
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