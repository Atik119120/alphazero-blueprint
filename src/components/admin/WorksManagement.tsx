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
      toast.success(editingWork ? "Work updated" : "New Work added");
      resetForm();
    },
    onError: (error) => {
      toast.error("An error occurred: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("works").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-works"] });
      toast.success("Work deleted");
    },
    onError: (error) => {
      toast.error("Problem deleting: " + error.message);
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
      web: "Web Development",
      web_portfolio: "Portfolio Website",
      web_ecommerce: "E-commerce Website",
      web_education: "Education Website",
      web_agency: "Agency / Organization",
      web_general: "Other Websites",
      // Graphics
      graphics: "Graphics Design",
      design: "Graphics Design",
      graphics_social: "Social Media Design",
      graphics_logo: "Logo Design",
      graphics_vector: "Vector Design",
      graphics_branding: "Professional Branding",
      graphics_general: "Other Graphics",
      // Video
      video: "Video Editing",
      video_short: "Short Video",
      video_reels: "Reels",
      video_funny: "Funny Content",
      video_square: "Square Video",
      video_general: "Other Videos",
      // Other
      other: "Other",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Works / Portfolio</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingWork ? "Edit Work" : "Add New Work"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Project Name"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project Description"
                  rows={3}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-popover z-50">
                    {/* Web Development */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">Web Development</div>
                    <SelectItem value="web_portfolio">Portfolio Website</SelectItem>
                    <SelectItem value="web_ecommerce">E-commerce Website</SelectItem>
                    <SelectItem value="web_education">Education Website</SelectItem>
                    <SelectItem value="web_agency">Agency / Organization</SelectItem>
                    <SelectItem value="web_general">Other Websites</SelectItem>
                    
                    {/* Graphics Design */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">Graphics Design</div>
                    <SelectItem value="graphics_social">Social Media Design</SelectItem>
                    <SelectItem value="graphics_logo">Logo Design</SelectItem>
                    <SelectItem value="graphics_vector">Vector Design</SelectItem>
                    <SelectItem value="graphics_branding">Professional Branding</SelectItem>
                    <SelectItem value="graphics_general">Other Graphics</SelectItem>
                    
                    {/* Video Editing */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">Video Editing</div>
                    <SelectItem value="video_short">Short Video</SelectItem>
                    <SelectItem value="video_reels">Reels</SelectItem>
                    <SelectItem value="video_funny">Funny Content</SelectItem>
                    <SelectItem value="video_square">Square Video</SelectItem>
                    <SelectItem value="video_general">Other Videos</SelectItem>
                    
                    {/* Other */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">Other</div>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="works"
                label="Image / Content"
                placeholder="Paste URL or Upload"
                aspectRatio="video"
                maxSizeMB={10}
              />

              <div>
                <Label>Project Link</Label>
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
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
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
                      if (confirm("Do you want to delete?")) {
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
                    View Project
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!works || works.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          No work. Click the button above to Add New Work.
        </div>
      )}
    </div>
  );
};
