import { useState } from "react";
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
import { Plus, Pencil, Trash2, Facebook, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  order_index: number;
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
    is_active: true,
  });

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
            is_active: data.is_active,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert({
          name: data.name,
          role: data.role,
          bio: data.bio || null,
          image_url: data.image_url || null,
          facebook_url: data.facebook_url || null,
          instagram_url: data.instagram_url || null,
          linkedin_url: data.linkedin_url || null,
          is_active: data.is_active,
          order_index: (members?.length || 0) + 1,
        });
        if (error) throw error;
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
      is_active: true,
    });
    setEditingMember(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      image_url: member.image_url || "",
      facebook_url: member.facebook_url || "",
      instagram_url: member.instagram_url || "",
      linkedin_url: member.linkedin_url || "",
      is_active: member.is_active,
    });
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

              <div>
                <Label>Facebook Profile URL</Label>
                <Input
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div>
                <Label>Instagram Profile URL</Label>
                <Input
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <Label>LinkedIn Profile URL</Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active (ওয়েবসাইটে দেখাবে)</Label>
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
                <div className="flex gap-2">
                  {member.facebook_url && (
                    <a href={member.facebook_url} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a href={member.instagram_url} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 text-blue-700" />
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
