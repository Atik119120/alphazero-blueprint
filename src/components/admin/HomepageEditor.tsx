import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, Home, Layers, Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { useAdminScope } from "@/contexts/AdminSiteScopeContext";
import AdminSiteScopeSwitcher from "@/components/admin/AdminSiteScopeSwitcher";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  useHomepageSections,
  useHomepageSectionItems,
  useUpdateSection,
  useCreateSectionItem,
  useUpdateSectionItem,
  useDeleteSectionItem,
  HomepageSection,
  HomepageSectionItem,
} from "@/hooks/useHomepageSections";

const SECTION_META: Record<string, { label: string; hint: string; isList: boolean }> = {
  hero: { label: "Hero Section", hint: "টাইটেল, সাবটাইটেল, ব্যাকগ্রাউন্ড ইমেজ, CTA বাটন", isList: false },
  sister_brands: { label: "Sister Brands", hint: "প্রতিটা ব্র্যান্ডের লোগো + ওয়েবসাইট লিংক", isList: true },
  what_we_do: { label: "What We Do", hint: "সেকশন হেডিং + প্রতিটা আইটেমের টাইটেল, ২টি ইমেজ, বর্ণনা", isList: true },
  services_preview: { label: "Services Preview", hint: "সার্ভিস সেকশন হেডিং", isList: false },
  courses_preview: { label: "Courses Preview", hint: "কোর্স সেকশন হেডিং", isList: false },
  instructors: { label: "Instructors", hint: "ইন্সট্রাক্টর কার্ড লিস্ট", isList: true },
};

const HomepageEditor = () => {
  const { scope } = useAdminScope();
  const { data: sections, isLoading } = useHomepageSections(scope);
  const [selectedPage, setSelectedPage] = useState<"home" | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const selectedSection = sections?.find((s) => s.id === selectedSectionId) ?? null;

  // Breadcrumb
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button className="hover:text-foreground flex items-center gap-1" onClick={() => { setSelectedPage(null); setSelectedSectionId(null); }}>
            <Home className="w-4 h-4" /> Pages
          </button>
          {selectedPage && <><ChevronRight className="w-4 h-4" /><button className="hover:text-foreground" onClick={() => setSelectedSectionId(null)}>Home</button></>}
          {selectedSection && <><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">{SECTION_META[selectedSection.section_key]?.label ?? selectedSection.section_key}</span></>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{scope === "learn" ? "Learn Site" : "Agency Site"}</Badge>
          <AdminSiteScopeSwitcher />
        </div>
      </div>

      {!selectedPage && <PageList onSelect={() => setSelectedPage("home")} />}

      {selectedPage && !selectedSection && (
        <SectionList
          sections={sections ?? []}
          isLoading={isLoading}
          onOpen={(id) => setSelectedSectionId(id)}
        />
      )}

      {selectedSection && (
        <SectionEditor
          section={selectedSection}
          onBack={() => setSelectedSectionId(null)}
        />
      )}
    </div>
  );
};

const PageList = ({ onSelect }: { onSelect: () => void }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card className="cursor-pointer hover:shadow-lg transition group" onClick={onSelect}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Home Page</CardTitle>
            <CardDescription>হোমপেজের সেকশনগুলো এডিট করুন</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  </div>
);

const SectionList = ({
  sections,
  isLoading,
  onOpen,
}: {
  sections: HomepageSection[];
  isLoading: boolean;
  onOpen: (id: string) => void;
}) => {
  if (isLoading) return <div className="text-muted-foreground">লোড হচ্ছে...</div>;
  if (!sections.length) return <div className="text-muted-foreground">এই সাইটের জন্য কোন সেকশন নেই।</div>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {sections.map((s) => {
        const meta = SECTION_META[s.section_key];
        return (
          <Card key={s.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => onOpen(s.id)}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    {meta?.label ?? s.section_key}
                    {!s.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {meta?.hint ?? s.section_type}
                  </CardDescription>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

const SectionEditor = ({ section, onBack }: { section: HomepageSection; onBack: () => void }) => {
  const meta = SECTION_META[section.section_key];
  const isList = meta?.isList ?? false;
  const updateSection = useUpdateSection();
  const [form, setForm] = useState<HomepageSection>(section);

  const set = <K extends keyof HomepageSection>(k: K, v: HomepageSection[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      await updateSection.mutateAsync({
        id: form.id,
        title: form.title,
        title_bn: form.title_bn,
        subtitle: form.subtitle,
        subtitle_bn: form.subtitle_bn,
        description: form.description,
        description_bn: form.description_bn,
        highlight: form.highlight,
        highlight_bn: form.highlight_bn,
        image_url: form.image_url,
        image_url_2: form.image_url_2,
        button_label: form.button_label,
        button_url: form.button_url,
        is_active: form.is_active,
      });
      toast.success("সেভ হয়েছে");
    } catch (e: any) {
      toast.error(e.message ?? "সেভ করা যায়নি");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <Label className="flex items-center gap-2 text-sm">
            <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            Visible
          </Label>
          <Button onClick={save} disabled={updateSection.isPending}>
            {updateSection.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{meta?.label ?? section.section_key}</CardTitle>
          <CardDescription>{meta?.hint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Title (English)</Label>
              <Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <Label>Title (বাংলা)</Label>
              <Input value={form.title_bn ?? ""} onChange={(e) => set("title_bn", e.target.value)} />
            </div>
            <div>
              <Label>Subtitle (English)</Label>
              <Input value={form.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
            </div>
            <div>
              <Label>Subtitle (বাংলা)</Label>
              <Input value={form.subtitle_bn ?? ""} onChange={(e) => set("subtitle_bn", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Description (English)</Label>
              <Textarea rows={3} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Description (বাংলা)</Label>
              <Textarea rows={3} value={form.description_bn ?? ""} onChange={(e) => set("description_bn", e.target.value)} />
            </div>
            <div>
              <Label>Highlight (English)</Label>
              <Input value={form.highlight ?? ""} onChange={(e) => set("highlight", e.target.value)} placeholder="e.g. Graphic Design" />
            </div>
            <div>
              <Label>Highlight (বাংলা)</Label>
              <Input value={form.highlight_bn ?? ""} onChange={(e) => set("highlight_bn", e.target.value)} />
            </div>
            <div>
              <ImageUploader
                label="Image 1"
                value={form.image_url ?? ""}
                onChange={(url) => set("image_url", url)}
                folder="homepage"
              />
            </div>
            <div>
              <ImageUploader
                label="Image 2"
                value={form.image_url_2 ?? ""}
                onChange={(url) => set("image_url_2", url)}
                folder="homepage"
              />
            </div>
            <div>
              <Label>Button Label</Label>
              <Input value={form.button_label ?? ""} onChange={(e) => set("button_label", e.target.value)} />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input value={form.button_url ?? ""} onChange={(e) => set("button_url", e.target.value)} placeholder="/services" />
            </div>
          </div>
        </CardContent>
      </Card>

      {isList && <SectionItemsEditor sectionId={section.id} sectionKey={section.section_key} />}
    </div>
  );
};

const SectionItemsEditor = ({ sectionId, sectionKey }: { sectionId: string; sectionKey: string }) => {
  const { data: items, isLoading } = useHomepageSectionItems(sectionId);
  const createItem = useCreateSectionItem();
  const updateItem = useUpdateSectionItem();
  const deleteItem = useDeleteSectionItem();

  const addItem = async () => {
    try {
      await createItem.mutateAsync({
        section_id: sectionId,
        title: "",
        order_index: (items?.length ?? 0) + 1,
        is_active: true,
      });
      toast.success("যোগ হয়েছে");
    } catch (e: any) {
      toast.error(e.message ?? "যোগ করা যায়নি");
    }
  };

  const isBrandsLike = sectionKey === "sister_brands" || sectionKey === "instructors";
  const isDualImage = sectionKey === "what_we_do";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Items</CardTitle>
          <CardDescription>{isBrandsLike ? "লোগো + লিংক" : "প্রতিটা আইটেমের টাইটেল, ইমেজ, বর্ণনা"}</CardDescription>
        </div>
        <Button size="sm" onClick={addItem} disabled={createItem.isPending}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <div className="text-muted-foreground text-sm">লোড হচ্ছে...</div>}
        {items?.map((it) => (
          <ItemRow
            key={it.id}
            item={it}
            isBrandsLike={isBrandsLike}
            isDualImage={isDualImage}
            onSave={async (patch) => {
              try {
                await updateItem.mutateAsync({ id: it.id, ...patch });
                toast.success("সেভ হয়েছে");
              } catch (e: any) {
                toast.error(e.message);
              }
            }}
            onDelete={async () => {
              if (!confirm("এই আইটেমটি ডিলিট করবেন?")) return;
              try {
                await deleteItem.mutateAsync(it.id);
                toast.success("ডিলিট হয়েছে");
              } catch (e: any) {
                toast.error(e.message);
              }
            }}
          />
        ))}
        {items && !items.length && <div className="text-sm text-muted-foreground">এখনো কোন আইটেম যোগ করা হয়নি।</div>}
      </CardContent>
    </Card>
  );
};

const ItemRow = ({
  item,
  isBrandsLike,
  isDualImage,
  onSave,
  onDelete,
}: {
  item: HomepageSectionItem;
  isBrandsLike: boolean;
  isDualImage: boolean;
  onSave: (patch: Partial<HomepageSectionItem>) => void;
  onDelete: () => void;
}) => {
  const [f, setF] = useState<HomepageSectionItem>(item);
  const set = <K extends keyof HomepageSectionItem>(k: K, v: HomepageSectionItem[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="p-4 border rounded-lg space-y-3 bg-muted/30">
      <div className="grid md:grid-cols-2 gap-3">
        {!isBrandsLike && (
          <>
            <div>
              <Label>Title (EN)</Label>
              <Input value={f.title ?? ""} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <Label>Title (BN)</Label>
              <Input value={f.title_bn ?? ""} onChange={(e) => set("title_bn", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Description (EN)</Label>
              <Textarea rows={2} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Description (BN)</Label>
              <Textarea rows={2} value={f.description_bn ?? ""} onChange={(e) => set("description_bn", e.target.value)} />
            </div>
          </>
        )}
        <div>
          <ImageUploader
            label={isDualImage ? "Image 1" : isBrandsLike ? "Logo" : "Image"}
            value={f.image_url ?? ""}
            onChange={(url) => set("image_url", url)}
            folder="homepage-items"
          />
        </div>
        {isDualImage && (
          <div>
            <ImageUploader
              label="Image 2"
              value={f.image_url_2 ?? ""}
              onChange={(url) => set("image_url_2", url)}
              folder="homepage-items"
            />
          </div>
        )}
        <div className="md:col-span-2">
          <Label>{isBrandsLike ? "Website URL" : "Link (optional)"}</Label>
          <Input value={f.url ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-3">
          <Label>Order</Label>
          <Input type="number" className="w-24" value={f.order_index} onChange={(e) => set("order_index", parseInt(e.target.value || "0", 10))} />
          <Label className="flex items-center gap-2 ml-4">
            <Switch checked={f.is_active} onCheckedChange={(v) => set("is_active", v)} />
            Visible
          </Label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
        <Button size="sm" onClick={() => onSave(f)}>
          <Save className="w-4 h-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
};

export default HomepageEditor;
