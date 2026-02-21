import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Pencil, Trash2, Facebook, Instagram, Linkedin, Twitter, Mail, Globe, MessageCircle, Link as LinkIcon, X } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

// Custom icons for platforms without lucide equivalents
const FiverrIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h1.527v1.316zm-6.786 1.501h-3.359c.088.545.432.953 1.09.953.484 0 .88-.226 1.026-.608h1.584c-.322 1.174-1.37 1.99-2.61 1.99-1.584 0-2.852-1.13-2.852-2.764 0-1.633 1.268-2.763 2.852-2.763 1.584 0 2.853 1.13 2.853 2.763 0 .15-.02.28-.038.43h-.546zm-1.243-1.14c-.088-.5-.42-.862-1.004-.862s-.916.363-1.004.862h2.008zm-6.167-.991h2.153v1.213h-2.153v1.501h2.61v1.316H8.396v-5.647h3.376v1.316h-2.61v.301h2.61zm-4.93-1.617h1.61v5.647H3.882v-.37c-.322.37-.724.518-1.247.518-1.34 0-2.35-1.008-2.35-2.632 0-1.625 1.01-2.632 2.35-2.632.523 0 .925.148 1.247.518v-.37h1.61v-.679h-.61v-.679h1.61v.679zm-2.035 3.858c.546 0 .926-.393.926-1.05 0-.659-.38-1.05-.926-1.05-.548 0-.927.391-.927 1.05 0 .657.38 1.05.927 1.05z"/>
  </svg>
);

const UpworkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.85-.706 2.044-1.114 3.382-1.169l.164-.006c1.077 0 2.063.238 2.88.678-.148-.56-.42-1.025-.82-1.393-.586-.536-1.432-.821-2.443-.821h-.103c-1.17.03-2.14.475-2.736 1.222l-1.511-1.236c.96-1.177 2.405-1.867 4.134-1.974h.138c1.605 0 2.965.488 3.93 1.407.893.852 1.386 2.041 1.428 3.441v.049c.083.018.165.036.249.056 1.188.276 2.163.857 2.898 1.724.878 1.037 1.272 2.378 1.14 3.88-.173 1.962-1.058 3.639-2.559 4.851-1.358 1.096-3.17 1.759-5.38 1.971-.262.025-.521.037-.781.037zm-1.2-8.319c-.788.036-1.408.247-1.793.609-.353.333-.53.756-.499 1.194.062 1.04 1.072 1.75 2.467 1.679 1.017-.053 1.8-.447 2.326-1.17.312-.428.523-.973.635-1.634-.66-.244-1.436-.49-2.369-.592-.257-.03-.516-.058-.767-.086z"/>
  </svg>
);

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  whatsapp_url: string | null;
  email: string | null;
  fiverr_url: string | null;
  upwork_url: string | null;
  portfolio_url: string | null;
  threads_url: string | null;
  is_active: boolean;
  order_index: number;
}

interface CustomLink {
  id?: string;
  label: string;
  url: string;
  icon_url: string;
}

export const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    twitter_url: "",
    whatsapp_url: "",
    email: "",
    fiverr_url: "",
    upwork_url: "",
    portfolio_url: "",
    threads_url: "",
    is_active: true,
    show_on_homepage: false,
  });
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  const { data: members, isLoading } = useQuery({
    queryKey: ["admin-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      let memberId = data.id;
      if (data.id) {
        const { error } = await supabase
          .from("team_members")
          .update({
            name: data.name,
            role: data.role,
            bio: data.bio || null,
            image_url: data.image_url || null,
            facebook_url: data.facebook_url || null,
            instagram_url: data.instagram_url || null,
            linkedin_url: data.linkedin_url || null,
            twitter_url: data.twitter_url || null,
            whatsapp_url: data.whatsapp_url || null,
            email: data.email || null,
            fiverr_url: data.fiverr_url || null,
            upwork_url: data.upwork_url || null,
            portfolio_url: data.portfolio_url || null,
            threads_url: data.threads_url || null,
            is_active: data.is_active,
            show_on_homepage: data.show_on_homepage,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { data: newMember, error } = await supabase.from("team_members").insert({
          name: data.name,
          role: data.role,
          bio: data.bio || null,
          image_url: data.image_url || null,
          facebook_url: data.facebook_url || null,
          instagram_url: data.instagram_url || null,
          linkedin_url: data.linkedin_url || null,
          twitter_url: data.twitter_url || null,
          whatsapp_url: data.whatsapp_url || null,
          email: data.email || null,
          fiverr_url: data.fiverr_url || null,
          upwork_url: data.upwork_url || null,
          portfolio_url: data.portfolio_url || null,
          threads_url: data.threads_url || null,
          is_active: data.is_active,
          show_on_homepage: data.show_on_homepage,
          order_index: (members?.length || 0) + 1,
        }).select('id').single();
        if (error) throw error;
        memberId = newMember?.id;
      }

      // Save custom links
      if (memberId) {
        // Delete existing custom links
        await supabase.from("team_member_custom_links").delete().eq("team_member_id", memberId);
        
        // Insert new custom links
        if (customLinks.length > 0) {
          const linksToInsert = customLinks.filter(l => l.label && l.url).map((link, idx) => ({
            team_member_id: memberId!,
            label: link.label,
            url: link.url,
            icon_url: link.icon_url || null,
            order_index: idx,
          }));
          if (linksToInsert.length > 0) {
            await supabase.from("team_member_custom_links").insert(linksToInsert);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success(editingMember ? "Team member আপডেট হয়েছে" : "নতুন Team member যোগ হয়েছে");
      resetForm();
    },
    onError: (error) => {
      toast.error("সমস্যা হয়েছে: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success("Team member ডিলিট হয়েছে");
    },
    onError: (error) => {
      toast.error("ডিলিট করতে সমস্যা: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      image_url: "",
      facebook_url: "",
      instagram_url: "",
      linkedin_url: "",
      twitter_url: "",
      whatsapp_url: "",
      email: "",
      fiverr_url: "",
      upwork_url: "",
      portfolio_url: "",
      threads_url: "",
      is_active: true,
      show_on_homepage: false,
    });
    setCustomLinks([]);
    setEditingMember(null);
    setIsDialogOpen(false);
  };

  const handleEdit = async (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      image_url: member.image_url || "",
      facebook_url: member.facebook_url || "",
      instagram_url: member.instagram_url || "",
      linkedin_url: member.linkedin_url || "",
      twitter_url: member.twitter_url || "",
      whatsapp_url: member.whatsapp_url || "",
      email: member.email || "",
      fiverr_url: member.fiverr_url || "",
      upwork_url: member.upwork_url || "",
      portfolio_url: member.portfolio_url || "",
      threads_url: member.threads_url || "",
      is_active: member.is_active,
      show_on_homepage: (member as any).show_on_homepage || false,
    });
    
    // Load custom links
    const { data: links } = await supabase
      .from("team_member_custom_links")
      .select("*")
      .eq("team_member_id", member.id)
      .order("order_index");
    
    setCustomLinks((links || []).map(l => ({ id: l.id, label: l.label, url: l.url, icon_url: l.icon_url || '' })));
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingMember?.id,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন Member যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Member এডিট করুন" : "নতুন Member যোগ করুন"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>নাম *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="সম্পূর্ণ নাম"
                  required
                />
              </div>

              <div>
                <Label>পদবি / Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="যেমন: CEO, Designer, Developer"
                  required
                />
              </div>

              <div>
                <Label>বায়ো / পরিচিতি</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="সংক্ষিপ্ত পরিচিতি"
                  rows={3}
                />
              </div>

              <div>
                <Label>প্রোফাইল ছবি URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Social Media Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">সোশ্যাল মিডিয়া লিংক</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <Input
                      value={formData.facebook_url}
                      onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                      placeholder="Facebook URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600 flex-shrink-0" />
                    <Input
                      value={formData.instagram_url}
                      onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                      placeholder="Instagram URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <Input
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      placeholder="Twitter/X URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0"><ThreadsIcon /></span>
                    <Input
                      value={formData.threads_url}
                      onChange={(e) => setFormData({ ...formData, threads_url: e.target.value })}
                      placeholder="Threads URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <Input
                      value={formData.whatsapp_url}
                      onChange={(e) => setFormData({ ...formData, whatsapp_url: e.target.value })}
                      placeholder="WhatsApp (wa.me/8801XXXXXXXXX)"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      type="email"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <Input
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="LinkedIn URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 text-green-600"><FiverrIcon /></span>
                    <Input
                      value={formData.fiverr_url}
                      onChange={(e) => setFormData({ ...formData, fiverr_url: e.target.value })}
                      placeholder="Fiverr Profile URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 text-green-500"><UpworkIcon /></span>
                    <Input
                      value={formData.upwork_url}
                      onChange={(e) => setFormData({ ...formData, upwork_url: e.target.value })}
                      placeholder="Upwork Profile URL"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                    <Input
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                      placeholder="Portfolio Website URL"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Links Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm text-muted-foreground">কাস্টম লিংক (অন্যান্য সাইট)</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomLinks([...customLinks, { label: '', url: '', icon_url: '' }])}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    লিংক যোগ
                  </Button>
                </div>
                
                {customLinks.map((link, idx) => (
                  <div key={idx} className="space-y-2 mb-3 p-3 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => setCustomLinks(customLinks.filter((_, i) => i !== idx))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="লেবেল (যেমন: YouTube)"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...customLinks];
                          updated[idx].label = e.target.value;
                          setCustomLinks(updated);
                        }}
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...customLinks];
                          updated[idx].url = e.target.value;
                          setCustomLinks(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">আইকন (URL বা আপলোড)</Label>
                      <ImageUploader
                        value={link.icon_url}
                        onChange={(url) => {
                          const updated = [...customLinks];
                          updated[idx].icon_url = url;
                          setCustomLinks(updated);
                        }}
                        folder="custom-icons"
                        placeholder="আইকন URL বা আপলোড করুন"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.show_on_homepage}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_on_homepage: checked })}
                  />
                  <Label>Homepage</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
                  {saveMutation.isPending ? "সেভ হচ্ছে..." : "সেভ করুন"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  বাতিল
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => (
          <Card key={member.id} className={!member.is_active ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.image_url || ""} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("ডিলিট করতে চান?")) {
                        deleteMutation.mutate(member.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {member.bio && (
                  <p className="text-muted-foreground line-clamp-2">{member.bio}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {member.facebook_url && (
                    <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" title="Facebook">
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" title="Instagram">
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" title="Twitter/X">
                      <Twitter className="w-4 h-4 text-sky-500" />
                    </a>
                  )}
                  {member.threads_url && (
                    <a href={member.threads_url} target="_blank" rel="noopener noreferrer" title="Threads">
                      <ThreadsIcon />
                    </a>
                  )}
                  {member.whatsapp_url && (
                    <a href={member.whatsapp_url} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} title="Email">
                      <Mail className="w-4 h-4 text-red-500" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <Linkedin className="w-4 h-4 text-blue-700" />
                    </a>
                  )}
                  {member.fiverr_url && (
                    <a href={member.fiverr_url} target="_blank" rel="noopener noreferrer" title="Fiverr" className="text-green-600">
                      <FiverrIcon />
                    </a>
                  )}
                  {member.upwork_url && (
                    <a href={member.upwork_url} target="_blank" rel="noopener noreferrer" title="Upwork" className="text-green-500">
                      <UpworkIcon />
                    </a>
                  )}
                  {member.portfolio_url && (
                    <a href={member.portfolio_url} target="_blank" rel="noopener noreferrer" title="Portfolio">
                      <Globe className="w-4 h-4 text-primary" />
                    </a>
                  )}
                </div>
                {!member.is_active && (
                  <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded text-xs">
                    Inactive
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!members || members.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          কোন Team Member নেই। উপরের বাটনে ক্লিক করে নতুন Member যোগ করুন।
        </div>
      )}
    </div>
  );
};
