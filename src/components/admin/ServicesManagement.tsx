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
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import PageHeroEditor from "./PageHeroEditor";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  features: string[] | null;
  is_active: boolean;
  order_index: number;
}

const iconOptions = [
  "Code", "Palette", "Video", "Search", "Globe", "Smartphone",
  "Monitor", "PenTool", "Camera", "Megaphone", "BarChart", "Shield",
  "Zap", "Sparkles", "Target", "Layers", "Box", "Settings"
];

export const ServicesManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Sparkles",
    features: [] as string[],
    is_active: true,
  });
  const [newFeature, setNewFeature] = useState("");

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("services")
          .update({
            title: data.title,
            description: data.description || null,
            icon: data.icon,
            features: data.features.length > 0 ? data.features : null,
            is_active: data.is_active,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert({
          title: data.title,
          description: data.description || null,
          icon: data.icon,
          features: data.features.length > 0 ? data.features : null,
          is_active: data.is_active,
          order_index: (services?.length || 0) + 1,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success(editingService ? "Service updated" : "New service added");
      resetForm();
    },
    onError: (error) => {
      toast.error("Problem occurred: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Service deleted");
    },
    onError: (error) => {
      toast.error("Problem deleting: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "Sparkles",
      features: [],
      is_active: true,
    });
    setNewFeature("");
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || "",
      icon: service.icon,
      features: service.features || [],
      is_active: service.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingService?.id,
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Code: LucideIcons.Code,
      Palette: LucideIcons.Palette,
      Video: LucideIcons.Video,
      Search: LucideIcons.Search,
      Globe: LucideIcons.Globe,
      Smartphone: LucideIcons.Smartphone,
      Monitor: LucideIcons.Monitor,
      PenTool: LucideIcons.PenTool,
      Camera: LucideIcons.Camera,
      Megaphone: LucideIcons.Megaphone,
      BarChart: LucideIcons.BarChart,
      Shield: LucideIcons.Shield,
      Zap: LucideIcons.Zap,
      Sparkles: LucideIcons.Sparkles,
      Target: LucideIcons.Target,
      Layers: LucideIcons.Layers,
      Box: LucideIcons.Box,
      Settings: LucideIcons.Settings,
    };
    const IconComponent = icons[iconName] || LucideIcons.Sparkles;
    return <IconComponent className="w-5 h-5" />;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeroEditor
        pageName="services"
        title="Services Page — Hero Section"
        subtitle="Click to edit the top hero (title parts, description)"
        fields={[
          { key: "hero.title", label: "✨ Title Part 1 (script)", description: "First script-font word (e.g. Our)", type: "input", fallback: "Our" },
          { key: "hero.title2", label: "💼 Title Part 2 (bold)", description: "Bold continuation on the same line (e.g. Services to)", type: "input", fallback: "Services to" },
          { key: "hero.title3", label: "💼 Title Part 3 (bold)", description: "Second line bold text (e.g. Bold Brands That)", type: "input", fallback: "Bold Brands That" },
          { key: "hero.title4", label: "✨ Title Part 4 (script)", description: "Last script-font word (e.g. Matter)", type: "input", fallback: "Matter" },
          { key: "hero.description", label: "📝 Description", description: "Paragraph shown below the title", type: "textarea", fallback: "Comprehensive creative solutions tailored to your needs." },
        ]}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Service Name"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Service Details"
                  rows={3}
                />
              </div>

              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {iconOptions.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={formData.icon === icon ? "default" : "outline"}
                      size="icon"
                      onClick={() => setFormData({ ...formData, icon })}
                      title={icon}
                    >
                      {getIcon(icon)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                    >
                      {feature}
                      <button type="button" onClick={() => removeFeature(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active (will show on website)</Label>
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
        {services?.map((service) => (
          <Card key={service.id} className={!service.is_active ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getIcon(service.icon)}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Do you want to delete?")) {
                        deleteMutation.mutate(service.id);
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
                {service.description && (
                  <p className="text-muted-foreground line-clamp-2">{service.description}</p>
                )}
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-muted rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                {!service.is_active && (
                  <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded text-xs">
                    Inactive
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!services || services.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          No service. Click the button above to Add New Service.
        </div>
      )}
    </div>
  );
};
