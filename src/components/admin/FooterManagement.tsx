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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Link2, 
  Plus, 
  Save, 
  Loader2, 
  Trash2, 
  Pencil, 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  Twitter,
  Youtube,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface FooterLink {
  id: string;
  link_type: string;
  title: string;
  url: string;
  icon: string | null;
  order_index: number;
  is_active: boolean;
}

interface FooterContent {
  id: string;
  content_key: string;
  content_en: string | null;
  content_bn: string | null;
}

const ICON_OPTIONS = [
  { value: 'Facebook', label: 'Facebook', icon: Facebook },
  { value: 'Instagram', label: 'Instagram', icon: Instagram },
  { value: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'MessageCircle', label: 'WhatsApp', icon: MessageCircle },
  { value: 'Twitter', label: 'Twitter/X', icon: Twitter },
  { value: 'Youtube', label: 'YouTube', icon: Youtube },
  { value: 'Github', label: 'GitHub', icon: Github },
  { value: 'Globe', label: 'Website', icon: Globe },
  { value: 'Mail', label: 'Email', icon: Mail },
  { value: 'Phone', label: 'Phone', icon: Phone },
];

const FooterManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("links");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [editingContent, setEditingContent] = useState<FooterContent | null>(null);
  
  const [linkForm, setLinkForm] = useState({
    link_type: 'social',
    title: '',
    url: '',
    icon: '',
    order_index: 0
  });

  const [contentForm, setContentForm] = useState({
    content_en: '',
    content_bn: ''
  });

  // Fetch footer links
  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ['footer-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .order('link_type')
        .order('order_index');
      if (error) throw error;
      return data as FooterLink[];
    }
  });

  // Fetch footer content
  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ['footer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .order('content_key');
      if (error) throw error;
      return data as FooterContent[];
    }
  });

  // Link mutations
  const addLinkMutation = useMutation({
    mutationFn: async (data: Omit<FooterLink, 'id' | 'is_active'>) => {
      const { error } = await supabase.from('footer_links').insert([{ ...data, is_active: true }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-links'] });
      toast.success('লিঙ্ক যোগ হয়েছে!');
      setIsAddDialogOpen(false);
      resetLinkForm();
    },
    onError: () => toast.error('লিঙ্ক যোগ করতে সমস্যা হয়েছে')
  });

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<FooterLink> & { id: string }) => {
      const { error } = await supabase.from('footer_links').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-links'] });
      toast.success('লিঙ্ক আপডেট হয়েছে!');
      setEditingLink(null);
      resetLinkForm();
    },
    onError: () => toast.error('লিঙ্ক আপডেট করতে সমস্যা হয়েছে')
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('footer_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-links'] });
      toast.success('লিঙ্ক মুছে ফেলা হয়েছে!');
    },
    onError: () => toast.error('লিঙ্ক মুছতে সমস্যা হয়েছে')
  });

  // Content mutations
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, content_en, content_bn }: { id: string; content_en: string; content_bn: string }) => {
      const { error } = await supabase
        .from('footer_content')
        .update({ content_en, content_bn })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-content'] });
      toast.success('কনটেন্ট আপডেট হয়েছে!');
      setEditingContent(null);
    },
    onError: () => toast.error('কনটেন্ট আপডেট করতে সমস্যা হয়েছে')
  });

  const resetLinkForm = () => {
    setLinkForm({ link_type: 'social', title: '', url: '', icon: '', order_index: 0 });
  };

  const handleAddLink = () => {
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      toast.error('Title এবং URL দিন');
      return;
    }
    addLinkMutation.mutate(linkForm);
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;
    updateLinkMutation.mutate({
      id: editingLink.id,
      ...linkForm
    });
  };

  const startEditLink = (link: FooterLink) => {
    setEditingLink(link);
    setLinkForm({
      link_type: link.link_type,
      title: link.title,
      url: link.url,
      icon: link.icon || '',
      order_index: link.order_index
    });
  };

  const startEditContent = (content: FooterContent) => {
    setEditingContent(content);
    setContentForm({
      content_en: content.content_en || '',
      content_bn: content.content_bn || ''
    });
  };

  const handleUpdateContent = () => {
    if (!editingContent) return;
    updateContentMutation.mutate({
      id: editingContent.id,
      content_en: contentForm.content_en,
      content_bn: contentForm.content_bn
    });
  };

  const toggleLinkStatus = (link: FooterLink) => {
    updateLinkMutation.mutate({ id: link.id, is_active: !link.is_active });
  };

  const getIconComponent = (iconName: string | null) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
    if (iconOption) {
      const IconComp = iconOption.icon;
      return <IconComp className="h-4 w-4" />;
    }
    return <Globe className="h-4 w-4" />;
  };

  const getContentLabel = (key: string) => {
    const labels: Record<string, string> = {
      'tagline': 'Tagline',
      'description': 'Description',
      'address': 'Address',
      'email': 'Email',
      'phone': 'Phone',
      'copyright': 'Copyright Text'
    };
    return labels[key] || key;
  };

  const socialLinks = links?.filter(l => l.link_type === 'social') || [];
  const navLinks = links?.filter(l => l.link_type === 'nav') || [];

  const isLoading = linksLoading || contentsLoading;

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
        <Link2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">ফুটার ম্যানেজমেন্ট</h2>
          <p className="text-muted-foreground">সোশ্যাল লিঙ্ক, নেভিগেশন এবং ফুটার কনটেন্ট পরিবর্তন করুন</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="links">সোশ্যাল লিঙ্ক</TabsTrigger>
          <TabsTrigger value="nav">নেভিগেশন</TabsTrigger>
          <TabsTrigger value="content">কনটেন্ট</TabsTrigger>
        </TabsList>

        {/* Social Links Tab */}
        <TabsContent value="links" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />নতুন সোশ্যাল লিঙ্ক</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>নতুন সোশ্যাল লিঙ্ক যোগ করুন</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input
                      value={linkForm.title}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Facebook, Instagram, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={linkForm.url}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select value={linkForm.icon} onValueChange={(v) => setLinkForm(prev => ({ ...prev, icon: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="h-4 w-4" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={linkForm.order_index}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <Button onClick={handleAddLink} disabled={addLinkMutation.isPending} className="w-full">
                    {addLinkMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    যোগ করুন
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {socialLinks.map(link => (
              <Card key={link.id} className={`border-border/50 ${!link.is_active ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  {editingLink?.id === link.id ? (
                    <div className="space-y-3">
                      <Input
                        value={linkForm.title}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Title"
                      />
                      <Input
                        value={linkForm.url}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="URL"
                      />
                      <Select value={linkForm.icon} onValueChange={(v) => setLinkForm(prev => ({ ...prev, icon: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2"><opt.icon className="h-4 w-4" />{opt.label}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateLink} disabled={updateLinkMutation.isPending}>
                          <Save className="h-4 w-4 mr-1" />সেভ
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingLink(null)}>বাতিল</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getIconComponent(link.icon)}
                        </div>
                        <div>
                          <p className="font-medium">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch checked={link.is_active} onCheckedChange={() => toggleLinkStatus(link)} />
                        <Button size="icon" variant="ghost" onClick={() => startEditLink(link)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteLinkMutation.mutate(link.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Navigation Links Tab */}
        <TabsContent value="nav" className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {navLinks.map(link => (
              <Card key={link.id} className={`border-border/50 ${!link.is_active ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-xs text-muted-foreground">{link.url}</p>
                    </div>
                    <Switch checked={link.is_active} onCheckedChange={() => toggleLinkStatus(link)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Footer Content Tab */}
        <TabsContent value="content" className="mt-6 space-y-4">
          {contents?.map(content => (
            <Card key={content.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{getContentLabel(content.content_key)}</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => startEditContent(content)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingContent?.id === content.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>English</Label>
                      <Textarea
                        value={contentForm.content_en}
                        onChange={(e) => setContentForm(prev => ({ ...prev, content_en: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>বাংলা</Label>
                      <Textarea
                        value={contentForm.content_bn}
                        onChange={(e) => setContentForm(prev => ({ ...prev, content_bn: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateContent} disabled={updateContentMutation.isPending}>
                        {updateContentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        সেভ করুন
                      </Button>
                      <Button variant="outline" onClick={() => setEditingContent(null)}>বাতিল</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">English</Label>
                      <p className="text-sm bg-secondary/50 p-2 rounded-lg">{content.content_en || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">বাংলা</Label>
                      <p className="text-sm bg-secondary/50 p-2 rounded-lg">{content.content_bn || '-'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterManagement;
