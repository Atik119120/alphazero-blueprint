# সেকশন-ভিত্তিক হোমপেজ CMS (Agency + Learn আলাদা)

## লক্ষ্য
Admin panel এ scope switcher (Agency/Learn) সিলেক্ট করার পর — **Pages → Home → [Section]** এভাবে ড্রিল-ডাউন করে হোমপেজের প্রতিটা সেকশন আলাদাভাবে edit করা যাবে। প্রতিটা সেকশনের নিজস্ব fields (title, subtitle, images, button, list items) থাকবে, এবং list items (sister brands, what-we-do items) add/remove/reorder করা যাবে।

## নেভিগেশন ফ্লো

```text
Admin Dashboard
└─ [Agency Site ▼] scope switcher (already exists)
   └─ Pages tab
      └─ Home
         ├─ Hero              → title, subtitle, bg image, CTA button
         ├─ Sister Brands     → list: logo image + website URL (add/remove/reorder)
         ├─ What We Do        → title, subtitle, highlight text
         │  └─ Items list     → item title, 2 images, description (add/remove)
         ├─ Services Preview  → title, subtitle
         └─ Footer            → columns, links, contact info, socials
```

Learn scope সিলেক্ট করলে একই UI, কিন্তু Learn এর নিজস্ব সেকশন সেট (Hero, Courses Preview, Instructors, Footer)।

## ধাপ

### ১. Database — dynamic section schema
নতুন দুইটা টেবিল (সব CMS content এর জন্য পুনর্ব্যবহারযোগ্য):

```sql
homepage_sections (
  id, site_scope, page_key, section_key, section_type,
  title, subtitle, description, highlight, image_url, image_url_2,
  button_label, button_url, order_index, is_active
)

homepage_section_items (
  id, section_id (FK), title, subtitle, image_url, url, order_index, is_active
)
```

- `section_type`: `hero | brands | what_we_do | services_preview | footer | custom`
- List-type sections (sister brands, what-we-do items) items table ব্যবহার করবে।
- Simple sections শুধু sections টেবিলেই থাকবে।
- Existing `page_content`, `footer_content` টেবিল intact থাকবে — backward compatible।

### ২. Admin UI — drill-down editor
নতুন কম্পোনেন্ট:
- `HomepageEditor.tsx` — section list, "Edit" click করলে section-specific editor খোলে
- `SectionEditor.tsx` — dynamic form: text fields, image uploader (existing `ImageUploader`), URL fields
- `SectionItemsEditor.tsx` — list items grid, add/remove/reorder (drag handle)
- Pages tab এর ভিতরে integrate — Home ক্লিক করলে editor খোলে

### ৩. Frontend — data-driven সেকশন
- `useHomepageSection(sectionKey, scope?)` hook — realtime subscription সহ
- `useHomepageSectionItems(sectionKey, scope?)` hook — list items এর জন্য
- বিদ্যমান `Index.tsx` (agency home) আর `CoursesPage.tsx` (learn home) এর হার্ডকোডেড sections ধাপে ধাপে DB-driven করা হবে — শুরুতে Sister Brands + What We Do সেকশন থেকে।

### ৪. Seed data
Migration এ existing hardcoded content (current sister brand logos, what-we-do items) DB তে seed করা হবে যাতে migration এর পর সাইটে কিছু ভেঙে না পড়ে।

## টেকনিক্যাল ডিটেইলস
- RLS: public read (is_active), admin-only write (`has_role('admin')`)
- Realtime enabled — admin এ save করলে সাইটে সাথে সাথে দেখাবে
- Image upload: existing `media-uploads` bucket + `ImageUploader` component
- Scope isolation: প্রতিটা query তে `site_scope` filter, admin edit এ selected scope এ save

## এই প্ল্যানে যা **নেই**
- বিদ্যমান UI design বদলানো — শুধু content DB থেকে টানা হবে
- Full drag-and-drop page builder — fixed section types, শুধু items reorder
- Multi-language field editor — existing `en/bn` pattern follow করবে

Approve করলে migration + admin editor + Sister Brands / What We Do সেকশন দিয়ে শুরু করব, তারপর বাকি সেকশন যোগ করব।
