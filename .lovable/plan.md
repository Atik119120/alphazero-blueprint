# আলাদা Agency + Learn কন্ট্রোল প্যানেল

## লক্ষ্য
এক ব্যাকএন্ড থেকেই দুই সাইট (Agency এবং Learn) সম্পূর্ণ আলাদাভাবে কন্ট্রোল করা — আলাদা পেজ, আলাদা কন্টেন্ট, আলাদা ফুটার, আলাদা কোর্স/সার্ভিস, আলাদা অ্যাডমিন ট্যাব।

## ইতিমধ্যে হয়েছে
- আলাদা `LearnContactPage` (route: `/learn-contact`, learn subdomain এ `/contact`)
- আলাদা `LearnAboutPage`
- আলাদা `CoursesPage`, `CoursesNavbar`, `CoursesFooter`
- Learn নেভবার থেকে ভাষা টগল সরানো

## যা করা হবে

### ১. ডেটাবেস আলাদাকরণ — `site_scope` কলাম
নিচের CMS টেবিলগুলোতে একটা `site_scope text` কলাম যোগ হবে (`'agency'` বা `'learn'`), default `'agency'`:
- `page_content` — পেজ টেক্সট/হিরো/সেকশন
- `footer_content`, `footer_links` — ফুটার আলাদা
- `site_settings` — লোগো, ব্র্যান্ড, SEO, কনট্যাক্ট আলাদা

পুরনো row গুলো `agency` scope এ থাকবে। Learn এর জন্য নতুন row insert হবে `learn` scope এ।

### ২. Admin Dashboard — নতুন Site Switcher
Admin dashboard এর টপে একটা toggle: **[Agency Site] [Learn Site]**
- সিলেক্ট করা scope সব CMS ট্যাবে (Page Content, Footer, Site Settings) filter হিসেবে যাবে
- Save করলে সেই scope এ save হবে
- ফলাফল: একই UI, কিন্তু দুই সাইটের কন্টেন্ট আলাদাভাবে edit

### ৩. Frontend Hooks আপডেট
`usePageContent`, `useFooterData`, site settings hook গুলো একটা `scope` parameter নেবে। Layout auto detect করবে (learn context হলে `learn`, নাহলে `agency`) — কোনো পেজে ম্যানুয়ালি কিছু বদলাতে হবে না।

### ৪. আলাদা পেজ set (Learn side)
Agency এর প্রতিটি মূল পেজের Learn version — সবই DB থেকে scope অনুযায়ী কন্টেন্ট টানবে:
- `LearnHome` (already `CoursesPage`)
- `LearnAbout` (already exists)
- `LearnContact` (just added)
- `LearnCourses` catalog

Agency এর `/services`, `/work`, `/team`, `/join-team` — এগুলো শুধু agency তে থাকবে, Learn এ দেখাবে না।

### ৫. Courses/Services আলাদাভাবে দেখানো
- `courses` টেবিল ইতিমধ্যে আছে — Learn সাইটে দেখাবে
- `services` টেবিল — শুধু Agency সাইটে দেখাবে
কোনো schema change লাগবে না, শুধু frontend routing আটকানো।

### ৬. আলাদা SEO / লোগো / ব্র্যান্ডিং
`site_settings` scope অনুযায়ী:
- Agency: AlphaZero logo, agency title/description
- Learn: Learn with AlphaZero logo, academy title/description
Index.html meta ডাইনামিক ভাবে scope অনুযায়ী update হবে।

## টেকনিক্যাল ডিটেইলস

```text
Admin Dashboard
├─ [Agency] [Learn]  ← scope toggle (top bar)
├─ Page Content    → filters by scope
├─ Footer Mgmt     → filters by scope
├─ Site Settings   → filters by scope
├─ Courses         → learn only
├─ Services/Works  → agency only
├─ Team            → shared
└─ Students/Teachers → shared (LMS)
```

Migration:
```sql
ALTER TABLE page_content ADD COLUMN site_scope text NOT NULL DEFAULT 'agency';
ALTER TABLE footer_content ADD COLUMN site_scope text NOT NULL DEFAULT 'agency';
ALTER TABLE footer_links ADD COLUMN site_scope text NOT NULL DEFAULT 'agency';
ALTER TABLE site_settings ADD COLUMN site_scope text NOT NULL DEFAULT 'agency';
CREATE INDEX ON page_content(site_scope, page_key);
CREATE INDEX ON footer_content(site_scope);
```

Frontend context detect:
```ts
const scope = isLearnContext ? 'learn' : 'agency';
usePageContent('contact', scope);
```

## Scope যা এই প্ল্যানে **নেই**
- LMS (student/teacher/admin auth) শেয়ারড থাকবে — একই account দিয়ে দুই সাইটে login
- Database structure রিরাইট না, শুধু scope column add
- আলাদা domain deployment — সেটা DNS level এ আগে থেকেই আছে (`learn.alphazero.online`)

Approve করলে ধাপে ধাপে বিল্ড করব।
