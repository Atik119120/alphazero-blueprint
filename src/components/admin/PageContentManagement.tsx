import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { FileText, Home, Info, Phone, Plus, Save, Loader2, Trash2, Pencil, Briefcase, Users, Wrench } from "lucide-react";

interface PageContent {
  id: string;
  page_name: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

const PAGES = [
  { id: 'home', label: 'হোম', labelEn: 'Home', icon: Home },
  { id: 'about', label: 'অ্যাবাউট', labelEn: 'About', icon: Info },
  { id: 'contact', label: 'কন্টাক্ট', labelEn: 'Contact', icon: Phone },
  { id: 'services', label: 'সার্ভিসেস', labelEn: 'Services', icon: Wrench },
  { id: 'work', label: 'ওয়ার্ক', labelEn: 'Work', icon: Briefcase },
  { id: 'team', label: 'টিম', labelEn: 'Team', icon: Users },
];

const PageContentManagement = () => {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("home");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({
    content_key: '',
    content_en: '',
    content_bn: ''
  });

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
      resetForm();
    },
    onError: () => {
      toast.error('কনটেন্ট যোগ করতে সমস্যা হয়েছে');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<PageContent> & { id: string }) => {
      const { error } = await supabase
        .from('page_content')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast.success('কনটেন্ট আপডেট হয়েছে!');
      setEditingContent(null);
      resetForm();
    },
    onError: () => {
      toast.error('কনটেন্ট আপডেট করতে সমস্যা হয়েছে');
    }
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
    onError: () => {
      toast.error('কনটেন্ট মুছতে সমস্যা হয়েছে');
    }
  });

  const resetForm = () => {
    setFormData({ content_key: '', content_en: '', content_bn: '' });
  };

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

  const handleUpdate = () => {
    if (!editingContent) return;
    updateMutation.mutate({
      id: editingContent.id,
      content_en: formData.content_en || null,
      content_bn: formData.content_bn || null
    });
  };

  const startEdit = (content: PageContent) => {
    setEditingContent(content);
    setFormData({
      content_key: content.content_key,
      content_en: content.content_en || '',
      content_bn: content.content_bn || ''
    });
  };

  const cancelEdit = () => {
    setEditingContent(null);
    resetForm();
  };

  const getPageIcon = (pageId: string) => {
    const page = PAGES.find(p => p.id === pageId);
    if (page) {
      const IconComp = page.icon;
      return <IconComp className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getPageLabel = (pageId: string) => {
    const page = PAGES.find(p => p.id === pageId);
    return page ? page.label : pageId;
  };

  const filteredContents = contents?.filter(c => c.page_name === selectedPage) || [];

  // Group content by section (e.g., hero, stats, etc.)
  const groupedContents = filteredContents.reduce((acc, content) => {
    const section = content.content_key.split('.')[0];
    if (!acc[section]) acc[section] = [];
    acc[section].push(content);
    return acc;
  }, {} as Record<string, PageContent[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">পেজ কনটেন্ট</h2>
            <p className="text-muted-foreground">Home, About, Contact পেজের টেক্সট এডিট করুন</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              নতুন কনটেন্ট
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>নতুন কনটেন্ট যোগ করুন ({getPageLabel(selectedPage)})</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Content Key</Label>
                <Input
                  value={formData.content_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_key: e.target.value }))}
                  placeholder="hero.title, section.description, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>English Text</Label>
                <Textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                  placeholder="Enter English content..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>বাংলা টেক্সট</Label>
                <Textarea
                  value={formData.content_bn}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_bn: e.target.value }))}
                  placeholder="বাংলায় কনটেন্ট লিখুন..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAdd} disabled={addMutation.isPending} className="w-full">
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                যোগ করুন
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="grid grid-cols-6 w-full max-w-2xl">
          {PAGES.map(page => (
            <TabsTrigger key={page.id} value={page.id} className="flex items-center gap-2">
              {getPageIcon(page.id)}
              <span className="hidden sm:inline">{page.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGES.map(page => (
          <TabsContent key={page.id} value={page.id} className="mt-6">
            <div className="space-y-4">
              {filteredContents.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    এই পেজে কোন কনটেন্ট নেই। নতুন কনটেন্ট যোগ করুন।
                  </CardContent>
                </Card>
              ) : (
                filteredContents.map(content => (
                  <Card key={content.id} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-mono text-primary">
                            {content.content_key}
                          </CardTitle>
                          <CardDescription>Content ID: {content.id.slice(0, 8)}...</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => startEdit(content)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(content.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingContent?.id === content.id ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>English</Label>
                            <Textarea
                              value={formData.content_en}
                              onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>বাংলা</Label>
                            <Textarea
                              value={formData.content_bn}
                              onChange={(e) => setFormData(prev => ({ ...prev, content_bn: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                              সেভ করুন
                            </Button>
                            <Button variant="outline" onClick={cancelEdit}>
                              বাতিল
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">English</Label>
                            <p className="text-sm bg-secondary/50 p-3 rounded-lg min-h-[60px]">
                              {content.content_en || <span className="text-muted-foreground italic">No content</span>}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">বাংলা</Label>
                            <p className="text-sm bg-secondary/50 p-3 rounded-lg min-h-[60px]">
                              {content.content_bn || <span className="text-muted-foreground italic">কনটেন্ট নেই</span>}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PageContentManagement;
