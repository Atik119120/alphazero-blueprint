import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ExternalLink, Image } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

interface Work {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  project_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
}

export const WorksManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "web",
    image_url: "",
    project_url: "",
    is_featured: false,
    is_published: true,
  });

  const { data: works, isLoading } = useQuery({
    queryKey: ["admin-works"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as Work[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("works")
          .update({
            title: data.title,
            description: data.description || null,
            category: data.category,
            image_url: data.image_url || null,
            project_url: data.project_url || null,
            is_featured: data.is_featured,
            is_published: data.is_published,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("works").insert({
          title: data.title,
          description: data.description || null,
          category: data.category,
          image_url: data.image_url || null,
          project_url: data.project_url || null,
          is_featured: data.is_featured,
          is_published: data.is_published,
          order_index: (works?.length || 0) + 1,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      toast.success(editingWork ? "Work আপডেট হয়েছে" : "নতুন Work যোগ হয়েছে");
      resetForm();
    },
    onError: (error) => {
      toast.error("সমস্যা হয়েছে: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("works").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      toast.success("Work ডিলিট হয়েছে");
    },
    onError: (error) => {
      toast.error("ডিলিট করতে সমস্যা: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "web",
      image_url: "",
      project_url: "",
      is_featured: false,
      is_published: true,
    });
    setEditingWork(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description || "",
      category: work.category,
      image_url: work.image_url || "",
      project_url: work.project_url || "",
      is_featured: work.is_featured,
      is_published: work.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingWork?.id,
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      // Web
      web: "ওয়েব ডেভেলপমেন্ট",
      web_portfolio: "পোর্টফোলিও ওয়েবসাইট",
      web_ecommerce: "ই-কমার্স ওয়েবসাইট",
      web_education: "এডুকেশন ওয়েবসাইট",
      web_agency: "এজেন্সি / অর্গানাইজেশন",
      web_general: "অন্যান্য ওয়েবসাইট",
      // Graphics
      graphics: "গ্রাফিক্স ডিজাইন",
      design: "গ্রাফিক্স ডিজাইন",
      graphics_social: "সোশ্যাল মিডিয়া ডিজাইন",
      graphics_logo: "লোগো ডিজাইন",
      graphics_vector: "ভেক্টর ডিজাইন",
      graphics_branding: "প্রফেশনাল ব্র্যান্ডিং",
      graphics_general: "অন্যান্য গ্রাফিক্স",
      // Video
      video: "ভিডিও এডিটিং",
      video_short: "শর্ট ভিডিও",
      video_reels: "রিলস",
      video_funny: "ফানি কনটেন্ট",
      video_square: "স্কয়ার ভিডিও",
      video_general: "অন্যান্য ভিডিও",
      // Other
      other: "অন্যান্য",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Works / Portfolio</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন Work যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingWork ? "Work এডিট করুন" : "নতুন Work যোগ করুন"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div>
                <Label>শিরোনাম *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="প্রজেক্টের নাম"
                  required
                />
              </div>

              <div>
                <Label>বিবরণ</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="প্রজেক্টের বিবরণ"
                  rows={3}
                />
              </div>

              <div>
                <Label>ক্যাটাগরি</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-popover z-50">
                    {/* Web Development */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">ওয়েব ডেভেলপমেন্ট</div>
                    <SelectItem value="web_portfolio">পোর্টফোলিও ওয়েবসাইট</SelectItem>
                    <SelectItem value="web_ecommerce">ই-কমার্স ওয়েবসাইট</SelectItem>
                    <SelectItem value="web_education">এডুকেশন ওয়েবসাইট</SelectItem>
                    <SelectItem value="web_agency">এজেন্সি / অর্গানাইজেশন</SelectItem>
                    <SelectItem value="web_general">অন্যান্য ওয়েবসাইট</SelectItem>
                    
                    {/* Graphics Design */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">গ্রাফিক্স ডিজাইন</div>
                    <SelectItem value="graphics_social">সোশ্যাল মিডিয়া ডিজাইন</SelectItem>
                    <SelectItem value="graphics_logo">লোগো ডিজাইন</SelectItem>
                    <SelectItem value="graphics_vector">ভেক্টর ডিজাইন</SelectItem>
                    <SelectItem value="graphics_branding">প্রফেশনাল ব্র্যান্ডিং</SelectItem>
                    <SelectItem value="graphics_general">অন্যান্য গ্রাফিক্স</SelectItem>
                    
                    {/* Video Editing */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">ভিডিও এডিটিং</div>
                    <SelectItem value="video_short">শর্ট ভিডিও</SelectItem>
                    <SelectItem value="video_reels">রিলস</SelectItem>
                    <SelectItem value="video_funny">ফানি কনটেন্ট</SelectItem>
                    <SelectItem value="video_square">স্কয়ার ভিডিও</SelectItem>
                    <SelectItem value="video_general">অন্যান্য ভিডিও</SelectItem>
                    
                    {/* Other */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">অন্যান্য</div>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="works"
                label="ছবি / কনটেন্ট"
                placeholder="URL পেস্ট করুন অথবা আপলোড করুন"
                aspectRatio="video"
                maxSizeMB={10}
              />

              <div>
                <Label>প্রজেক্ট লিংক</Label>
                <Input
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label>Published</Label>
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
        {works?.map((work) => (
          <Card key={work.id} className={!work.is_published ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{work.title}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(work)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("ডিলিট করতে চান?")) {
                        deleteMutation.mutate(work.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {work.image_url && (
                <div className="mb-3 rounded-lg overflow-hidden bg-muted h-32 flex items-center justify-center">
                  <img
                    src={work.image_url}
                    alt={work.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              {!work.image_url && (
                <div className="mb-3 rounded-lg bg-muted h-32 flex items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground line-clamp-2">{work.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {getCategoryLabel(work.category)}
                  </span>
                  {work.is_featured && (
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded text-xs">
                      Featured
                    </span>
                  )}
                  {!work.is_published && (
                    <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded text-xs">
                      Unpublished
                    </span>
                  )}
                </div>
                {work.project_url && (
                  <a
                    href={work.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    প্রজেক্ট দেখুন
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!works || works.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          কোন Work নেই। উপরের বাটনে ক্লিক করে নতুন Work যোগ করুন।
        </div>
      )}
    </div>
  );
};
