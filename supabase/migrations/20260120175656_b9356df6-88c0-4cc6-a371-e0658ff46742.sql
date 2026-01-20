-- Add phone_number and transaction_id columns to enrollment_requests
ALTER TABLE public.enrollment_requests 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS transaction_id text;

-- Delete demo courses and insert the original 11 courses with correct prices
DELETE FROM public.courses WHERE id IN (
  'ee453434-2a44-4640-bb93-9ad7297246a2',
  '14e9a46e-64a8-4569-a0b7-95518e433ce8',
  'f08d5cfb-b396-462f-97a5-a2a0a6891843',
  'c2933a5f-d964-4d54-a137-e57f3acae928',
  '8404e7aa-5b5b-40f0-bd8b-2909e55a7381',
  '2c5284d0-535f-43bb-b2cc-e188ba171d45',
  'ef9fbd25-f05a-477b-a83c-8d2f7120ee3d',
  'f16bcb97-d96f-429b-af06-c38a7981878e',
  '035eb076-758a-4833-9c67-619146ad4ee7',
  'c47d60e0-8d9b-42b7-ad90-f3feaaceda85',
  '1dd0e869-f079-41e4-8ffa-84efc951ba2c',
  'caf31d96-b1a2-4547-99e6-13a6600ce823'
);

-- Insert original courses with correct prices from CoursesPage
INSERT INTO public.courses (title, description, price, is_published) VALUES
('গুগল নলেজ প্যানেল ক্রিয়েশন', 'গুগলে ব্র্যান্ড/ব্যক্তিগত প্রোফাইলের নলেজ প্যানেল তৈরি শিখুন। গুগল সার্চ অপ্টিমাইজেশন, ব্র্যান্ড ভেরিফিকেশন, উইকিপিডিয়া এন্ট্রি গাইড ও সোশ্যাল প্রোফাইল সেটআপ।', 3000, true),
('মাইক্রোসফট অফিস (Word, Excel, PowerPoint)', 'অফিস কাজের জন্য সম্পূর্ণ MS Office দক্ষতা অর্জন করুন। MS Word মাস্টারি, Excel ফর্মুলা ও ডাটা এনালাইসিস, PowerPoint প্রেজেন্টেশন ও অফিস অটোমেশন।', 2000, true),
('গ্রাফিক ডিজাইন', 'Adobe Photoshop ও Illustrator দিয়ে প্রফেশনাল গ্রাফিক ডিজাইন শিখুন। লোগো ও ব্র্যান্ডিং, সোশ্যাল মিডিয়া ডিজাইন তৈরি করুন।', 4000, true),
('ভিডিও এডিটিং', 'Adobe Premiere Pro দিয়ে ভিডিও এডিটিং মাস্টার করুন। কালার গ্রেডিং, সাউন্ড ডিজাইন ও সোশ্যাল মিডিয়া ভিডিও তৈরি করুন।', 4500, true),
('ফটোগ্রাফি', 'ক্যামেরা বেসিক, লাইটিং টেকনিক, ফটো এডিটিং শিখুন এবং প্রফেশনাল পোর্টফোলিও তৈরি করুন।', 2500, true),
('SEO ও ডিজিটাল মার্কেটিং', 'অন-পেজ ও অফ-পেজ SEO, গুগল অ্যাডস, ফেসবুক ও ইনস্টাগ্রাম মার্কেটিং, এনালিটিক্স ও রিপোর্টিং শিখুন।', 4000, true),
('ওয়েব কোডিং (HTML, CSS, JavaScript)', 'HTML5 ফান্ডামেন্টালস, CSS3 ও Flexbox, JavaScript বেসিক এবং রেস্পন্সিভ ওয়েব ডিজাইন শিখুন।', 5000, true),
('মোশন গ্রাফিক্স (After Effects)', 'After Effects বেসিক, কীফ্রেম অ্যানিমেশন, টেক্সট অ্যানিমেশন এবং ভিজ্যুয়াল ইফেক্টস শিখুন।', 5500, true),
('ভাইব কোডিং (AI দিয়ে ওয়েবসাইট তৈরি)', 'কোডিং না জেনে AI টুলস দিয়ে সম্পূর্ণ ওয়েবসাইট তৈরি করুন। AI ওয়েবসাইট বিল্ডার, প্রম্পট টু ডিজাইন, নো-কোড ডেভেলপমেন্ট।', 4500, true),
('AI প্রম্পট ইঞ্জিনিয়ারিং', 'AI টুলসের জন্য ইফেক্টিভ প্রম্পট লেখা শিখুন। ChatGPT, Claude, Midjourney সব AI মাস্টার করুন।', 3500, true),
('আইটি সাপোর্ট', 'কম্পিউটার ট্রাবলশুটিং, নেটওয়ার্ক সেটআপ, হার্ডওয়্যার মেইনটেন্যান্স এবং সফটওয়্যার ইনস্টলেশন শিখুন।', 3000, true);