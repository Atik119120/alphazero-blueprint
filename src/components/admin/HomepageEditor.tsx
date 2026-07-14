import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  ArrowLeft, ChevronRight, Home, Plus, Trash2, Save, Loader2,
  Sparkles, Building2, Boxes, Wrench, GraduationCap, Layers,
  ExternalLink, GripVertical, ImagePlus, Eye, EyeOff, MousePointerClick,
  MessageSquare, PhoneCall,
} from "lucide-react";
import { useAdminScope } from "@/contexts/AdminSiteScopeContext";
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
import { cn } from "@/lib/utils";

/* ----------------------------- Section schema ----------------------------- */

type FieldKey =
  | "title" | "subtitle" | "description" | "highlight"
  | "image_url" | "image_url_2" | "button_label" | "button_url";

interface SectionSchema {
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  fields: FieldKey[];
  itemsMode?: "brands" | "cards" | null; // null = no items list
  itemLabel?: string;
}

const SECTION_SCHEMA: Record<string, SectionSchema> = {
  hero: {
    label: "Hero Section", hint: "পেজের একদম উপরের বড় ব্যানার",
    icon: Sparkles, gradient: "from-sky-500 to-blue-600",
    fields: ["title", "subtitle", "description", "image_url", "button_label", "button_url"],
    itemsMode: null,
  },
  sister_brands: {
    label: "Sister Brands", hint: "সিস্টার ব্র্যান্ডের লোগো ও ওয়েবসাইট",
    icon: Building2, gradient: "from-amber-500 to-orange-600",
    fields: ["title", "subtitle"],
    itemsMode: "brands", itemLabel: "Brand",
  },
  what_we_do: {
    label: "What We Do", hint: "সেকশন হেডিং + প্রতিটা কাজের কার্ড (২টি ইমেজ সহ)",
    icon: Boxes, gradient: "from-fuchsia-500 to-pink-600",
    fields: ["title", "subtitle", "highlight"],
    itemsMode: "cards", itemLabel: "Item",
  },
  services_preview: {
    label: "Services Preview", hint: "সার্ভিস সেকশনের হেডিং",
    icon: Wrench, gradient: "from-emerald-500 to-teal-600",
    fields: ["title", "subtitle", "button_label", "button_url"],
    itemsMode: null,
  },
  courses_preview: {
    label: "Featured Courses", hint: "কোর্স সেকশনের হেডিং + CTA",
    icon: GraduationCap, gradient: "from-indigo-500 to-blue-600",
    fields: ["title", "subtitle", "button_label", "button_url"],
    itemsMode: null,
  },
  instructors: {
    label: "Instructors", hint: "ইন্সট্রাক্টরদের নাম, রোল ও ছবি",
    icon: GraduationCap, gradient: "from-violet-500 to-purple-600",
    fields: ["title", "subtitle"],
    itemsMode: "cards", itemLabel: "Instructor",
  },
  testimonials: {
    label: "Testimonials", hint: "ক্লায়েন্টদের রিভিউ",
    icon: MessageSquare, gradient: "from-rose-500 to-pink-600",
    fields: ["title", "subtitle", "highlight"],
    itemsMode: "cards", itemLabel: "Testimonial",
  },
  contact_cta: {
    label: "Contact / CTA", hint: "যোগাযোগের ব্লক + বাটন",
    icon: PhoneCall, gradient: "from-amber-500 to-orange-600",
    fields: ["title", "subtitle", "description", "button_label", "button_url"],
    itemsMode: null,
  },
};

const getSchema = (key: string): SectionSchema =>
  SECTION_SCHEMA[key] ?? {
    label: key, hint: "", icon: Layers, gradient: "from-slate-500 to-slate-700",
    fields: ["title", "subtitle", "description"], itemsMode: null,
  };

/* --------------------------------- Root ---------------------------------- */

const HomepageEditor = () => {
  const { scope } = useAdminScope();
  const { data: sections, isLoading } = useHomepageSections(scope);
  const [selectedPage, setSelectedPage] = useState<"home" | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const selectedSection = sections?.find((s) => s.id === selectedSectionId) ?? null;

  return (
    <div className="space-y-5">
      <Breadcrumb
        selectedPage={selectedPage}
        selectedSection={selectedSection}
        onHome={() => { setSelectedPage(null); setSelectedSectionId(null); }}
        onPage={() => setSelectedSectionId(null)}
      />

      {!selectedPage && <PageList onSelect={() => setSelectedPage("home")} />}

      {selectedPage && !selectedSection && (
        <SectionGrid
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

/* ------------------------------- Breadcrumb ------------------------------ */

const Breadcrumb = ({
  selectedPage, selectedSection, onHome, onPage,
}: {
  selectedPage: string | null;
  selectedSection: HomepageSection | null;
  onHome: () => void;
  onPage: () => void;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <button
      onClick={onHome}
      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition"
    >
      <Home className="w-4 h-4" /> Pages
    </button>
    {selectedPage && (
      <>
        <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
        <button
          onClick={onPage}
          className={cn(
            "hover:text-foreground transition",
            selectedSection ? "text-muted-foreground" : "text-foreground font-medium"
          )}
        >
          Home
        </button>
      </>
    )}
    {selectedSection && (
      <>
        <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
        <span className="text-foreground font-medium">
          {getSchema(selectedSection.section_key).label}
        </span>
      </>
    )}
  </div>
);

/* -------------------------------- Page list ------------------------------ */

const PageList = ({ onSelect }: { onSelect: () => void }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <button
      onClick={onSelect}
      className="group text-left rounded-xl border bg-gradient-to-br from-sky-500/10 to-blue-600/10 hover:from-sky-500/20 hover:to-blue-600/20 border-sky-500/20 hover:border-sky-500/40 p-5 transition"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
          <Home className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base">Home Page</div>
          <div className="text-xs text-muted-foreground mt-0.5">হোমপেজের সব সেকশন এডিট করুন</div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition" />
      </div>
    </button>
  </div>
);

/* ------------------------------ Section grid ----------------------------- */

const SectionGrid = ({
  sections, isLoading, onOpen,
}: { sections: HomepageSection[]; isLoading: boolean; onOpen: (id: string) => void }) => {
  if (isLoading) return <SkeletonGrid />;
  if (!sections.length) {
    return <div className="text-center text-muted-foreground py-12">এই সাইটের জন্য কোন সেকশন নেই।</div>;
  }
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((s) => (
        <SectionCard key={s.id} section={s} onOpen={() => onOpen(s.id)} />
      ))}
    </div>
  );
};

const SectionCard = ({ section, onOpen }: { section: HomepageSection; onOpen: () => void }) => {
  const sch = getSchema(section.section_key);
  const Icon = sch.icon;
  const { data: items } = useHomepageSectionItems(sch.itemsMode ? section.id : null);
  const itemCount = items?.length ?? 0;

  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-xl border bg-card hover:bg-accent/30 hover:border-primary/40 transition overflow-hidden"
    >
      <div className={cn("h-1 bg-gradient-to-r", sch.gradient)} />
      <div className="p-4 flex items-start gap-3">
        <div className={cn("w-11 h-11 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-md", sch.gradient)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold truncate">{sch.label}</div>
            {!section.is_active && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-1">
                <EyeOff className="w-2.5 h-2.5" /> Hidden
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{sch.hint}</div>
          {sch.itemsMode && (
            <div className="text-[11px] mt-2 inline-flex items-center gap-1 text-muted-foreground">
              <Layers className="w-3 h-3" /> {itemCount} {sch.itemLabel ?? "item"}{itemCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition mt-1" />
      </div>
    </button>
  );
};

const SkeletonGrid = () => (
  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-24 rounded-xl border bg-muted/30 animate-pulse" />
    ))}
  </div>
);

/* ----------------------------- Section editor ---------------------------- */

const SectionEditor = ({ section, onBack }: { section: HomepageSection; onBack: () => void }) => {
  const sch = getSchema(section.section_key);
  const Icon = sch.icon;
  const updateSection = useUpdateSection();
  const [form, setForm] = useState<HomepageSection>(section);
  const [dirty, setDirty] = useState(false);

  const set = <K extends keyof HomepageSection>(k: K, v: HomepageSection[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const has = (k: FieldKey) => sch.fields.includes(k);

  const save = async () => {
    try {
      await updateSection.mutateAsync({
        id: form.id,
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        highlight: form.highlight,
        image_url: form.image_url, image_url_2: form.image_url_2,
        button_label: form.button_label, button_url: form.button_url,
        is_active: form.is_active,
      });

      toast.success("সেভ হয়েছে");
      setDirty(false);
    } catch (e: any) {
      toast.error(e.message ?? "সেভ করা যায়নি");
    }
  };

  const showText = has("title") || has("subtitle") || has("description") || has("highlight");
  const showMedia = has("image_url") || has("image_url_2");
  const showCta = has("button_label") || has("button_url");

  return (
    <div className="space-y-5">
      {/* Sticky header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-md", sch.gradient)}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold leading-tight">{sch.label}</div>
            <div className="text-xs text-muted-foreground">{sch.hint}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            <span className="inline-flex items-center gap-1">
              {form.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {form.is_active ? "Visible" : "Hidden"}
            </span>
          </label>
          <Button onClick={save} disabled={updateSection.isPending || !dirty}>
            {updateSection.isPending
              ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>

      {/* Section fields */}
      {showText && (
        <FieldGroup title="Content" description="Section text content">
          <div className="grid md:grid-cols-2 gap-4">
            {has("title") && (
              <FieldInput label="Title" value={form.title} onChange={(v) => set("title", v)} />
            )}
            {has("subtitle") && (
              <FieldInput label="Subtitle" value={form.subtitle} onChange={(v) => set("subtitle", v)} />
            )}
            {has("highlight") && (
              <FieldInput label="Highlight" placeholder="e.g. Graphic Design" value={form.highlight} onChange={(v) => set("highlight", v)} />
            )}
            {has("description") && (
              <div className="md:col-span-2">
                <FieldTextarea label="Description" value={form.description} onChange={(v) => set("description", v)} />
              </div>
            )}
          </div>
        </FieldGroup>
      )}


      {showMedia && (
        <FieldGroup title="Media" description="সেকশনের জন্য ইমেজ" icon={ImagePlus}>
          <div className="grid md:grid-cols-2 gap-4">
            {has("image_url") && (
              <ImageUploader
                label="Image"
                value={form.image_url ?? ""}
                onChange={(url) => set("image_url", url)}
                folder="homepage"
              />
            )}
            {has("image_url_2") && (
              <ImageUploader
                label="Image 2"
                value={form.image_url_2 ?? ""}
                onChange={(url) => set("image_url_2", url)}
                folder="homepage"
              />
            )}
          </div>
        </FieldGroup>
      )}

      {showCta && (
        <FieldGroup title="Call to Action" description="বাটনের টেক্সট ও লিংক" icon={MousePointerClick}>
          <div className="grid md:grid-cols-2 gap-4">
            <FieldInput label="Button Label" value={form.button_label} onChange={(v) => set("button_label", v)} />
            <FieldInput label="Button URL" placeholder="/services" value={form.button_url} onChange={(v) => set("button_url", v)} />
          </div>
        </FieldGroup>
      )}

      {sch.itemsMode && (
        <SectionItemsEditor sectionId={section.id} mode={sch.itemsMode} itemLabel={sch.itemLabel ?? "Item"} />
      )}
    </div>
  );
};

/* -------------------------------- Building blocks ------------------------ */

const FieldGroup = ({
  title, description, icon: Icon, children,
}: {
  title: string; description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <CardTitle className="text-sm font-semibold uppercase tracking-wide">{title}</CardTitle>
      </div>
      {description && <CardDescription className="text-xs">{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const FieldInput = ({
  label, value, onChange, placeholder,
}: { label: string; value: string | null | undefined; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const FieldTextarea = ({
  label, value, onChange, rows = 3,
}: { label: string; value: string | null | undefined; onChange: (v: string) => void; rows?: number }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
  </div>
);

/* ----------------------------- Items editor ------------------------------ */

const SectionItemsEditor = ({
  sectionId, mode, itemLabel,
}: { sectionId: string; mode: "brands" | "cards"; itemLabel: string }) => {
  const { data: items, isLoading } = useHomepageSectionItems(sectionId);
  const createItem = useCreateSectionItem();

  const nextOrder = useMemo(() => {
    if (!items?.length) return 1;
    return Math.max(...items.map((i) => i.order_index ?? 0)) + 1;
  }, [items]);

  const addItem = async () => {
    try {
      await createItem.mutateAsync({
        section_id: sectionId,
        title: "",
        order_index: nextOrder,
        is_active: true,
      });
      toast.success("আইটেম যোগ হয়েছে");
    } catch (e: any) {
      toast.error(e.message ?? "যোগ করা যায়নি");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">{itemLabel}s</CardTitle>
          <CardDescription className="text-xs">
            {mode === "brands" ? "প্রতিটা ব্র্যান্ডের লোগো ও ওয়েবসাইট লিংক" : "প্রতিটা আইটেমের কন্টেন্ট"}
          </CardDescription>
        </div>
        <Button size="sm" onClick={addItem} disabled={createItem.isPending}>
          <Plus className="w-4 h-4 mr-1" /> Add {itemLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="h-20 rounded-lg border bg-muted/30 animate-pulse" />
        )}
        {items?.map((it, idx) => (
          <ItemRow key={it.id} item={it} index={idx} mode={mode} itemLabel={itemLabel} />
        ))}
        {items && !items.length && (
          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            এখনো কোন {itemLabel.toLowerCase()} যোগ করা হয়নি।<br />
            <span className="text-xs">উপরের "Add {itemLabel}" বাটনে ক্লিক করুন।</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ItemRow = ({
  item, index, mode, itemLabel,
}: { item: HomepageSectionItem; index: number; mode: "brands" | "cards"; itemLabel: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [f, setF] = useState<HomepageSectionItem>(item);
  const [dirty, setDirty] = useState(false);
  const updateItem = useUpdateSectionItem();
  const deleteItem = useDeleteSectionItem();

  const set = <K extends keyof HomepageSectionItem>(k: K, v: HomepageSectionItem[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };

  const save = async () => {
    try {
      await updateItem.mutateAsync({
        id: f.id,
        title: f.title, title_bn: f.title_bn,
        subtitle: f.subtitle, subtitle_bn: f.subtitle_bn,
        description: f.description, description_bn: f.description_bn,
        image_url: f.image_url, image_url_2: f.image_url_2,
        url: f.url, order_index: f.order_index, is_active: f.is_active,
      });
      toast.success("সেভ হয়েছে");
      setDirty(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const del = async () => {
    if (!confirm(`এই ${itemLabel.toLowerCase()}টি ডিলিট করবেন?`)) return;
    try { await deleteItem.mutateAsync(f.id); toast.success("ডিলিট হয়েছে"); }
    catch (e: any) { toast.error(e.message); }
  };

  const summary = f.title || f.url || `${itemLabel} ${index + 1}`;

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition",
      expanded ? "bg-muted/30 border-primary/40" : "bg-card hover:bg-accent/30"
    )}>
      {/* Row header */}
      <div className="flex items-center gap-3 p-3">
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0 border">
          {f.image_url ? (
            <img src={f.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <ImagePlus className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{summary}</div>
          {f.url && (
            <a href={f.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground truncate flex items-center gap-1 hover:text-primary">
              <ExternalLink className="w-3 h-3" /> {f.url}
            </a>
          )}
        </div>
        {!f.is_active && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 gap-1">
            <EyeOff className="w-2.5 h-2.5" /> Hidden
          </Badge>
        )}
        <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Close" : "Edit"}
        </Button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="border-t p-4 space-y-4 bg-background/50">
          <div className="grid md:grid-cols-2 gap-4">
            {mode === "brands" && (
              <div className="md:col-span-2">
                <FieldInput label="Brand Name" value={f.title} onChange={(v) => set("title", v)} placeholder="e.g. AlphaZero" />
              </div>
            )}
            {mode === "cards" && (
              <>
                <FieldInput label="Title (English)" value={f.title} onChange={(v) => set("title", v)} />
                <FieldInput label="Title (বাংলা)" value={f.title_bn} onChange={(v) => set("title_bn", v)} />
                <div className="md:col-span-2">
                  <FieldTextarea label="Description (English)" rows={2} value={f.description} onChange={(v) => set("description", v)} />
                </div>
                <div className="md:col-span-2">
                  <FieldTextarea label="Description (বাংলা)" rows={2} value={f.description_bn} onChange={(v) => set("description_bn", v)} />
                </div>
              </>
            )}
            <ImageUploader
              label={mode === "brands" ? "Brand Logo" : "Image 1"}
              value={f.image_url ?? ""} onChange={(url) => set("image_url", url)}
              folder="homepage-items"
            />
            {mode === "cards" && (
              <ImageUploader
                label="Image 2 (optional)"
                value={f.image_url_2 ?? ""} onChange={(url) => set("image_url_2", url)}
                folder="homepage-items"
              />
            )}
            <div className="md:col-span-2 grid md:grid-cols-[1fr,120px,auto] gap-3 items-end">
              <FieldInput
                label={mode === "brands" ? "Website URL" : "Link (optional)"}
                placeholder="https://..." value={f.url} onChange={(v) => set("url", v)}
              />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Order</Label>
                <Input type="number" value={f.order_index}
                  onChange={(e) => set("order_index", parseInt(e.target.value || "0", 10))} />
              </div>
              <label className="flex items-center gap-2 text-sm pb-2">
                <Switch checked={f.is_active} onCheckedChange={(v) => set("is_active", v)} />
                {f.is_active ? "Visible" : "Hidden"}
              </label>
            </div>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={del} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
            <Button size="sm" onClick={save} disabled={!dirty || updateItem.isPending}>
              {updateItem.isPending
                ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                : <Save className="w-4 h-4 mr-1" />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
