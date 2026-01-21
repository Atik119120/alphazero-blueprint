-- Add English title and description columns to courses table for language support
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS description_en text;

-- Update existing courses with English translations
UPDATE public.courses SET 
  title_en = 'Google Knowledge Panel Creation',
  description_en = 'Learn to create verified Google Knowledge Panels for brands and individuals. Google Search Optimization, Brand Verification, Wikipedia Entry Guide & Social Profile Setup.'
WHERE title = 'গুগল নলেজ প্যানেল ক্রিয়েশন';

UPDATE public.courses SET 
  title_en = 'Microsoft Office (Word, Excel, PowerPoint)',
  description_en = 'Master complete MS Office skills for office work. MS Word Mastery, Excel Formulas & Data Analysis, PowerPoint Presentations & Office Automation.'
WHERE title = 'মাইক্রোসফট অফিস (Word, Excel, PowerPoint)';

UPDATE public.courses SET 
  title_en = 'Graphic Design',
  description_en = 'Learn professional graphic design with Adobe Photoshop and Illustrator. Create logos, branding, and social media designs.'
WHERE title = 'গ্রাফিক ডিজাইন';

UPDATE public.courses SET 
  title_en = 'Video Editing',
  description_en = 'Master video editing with Adobe Premiere Pro. Learn color grading, sound design, and create social media videos.'
WHERE title = 'ভিডিও এডিটিং';

UPDATE public.courses SET 
  title_en = 'Photography',
  description_en = 'Learn camera basics, lighting techniques, photo editing and build your professional portfolio.'
WHERE title = 'ফটোগ্রাফি';

UPDATE public.courses SET 
  title_en = 'SEO & Digital Marketing',
  description_en = 'Learn on-page & off-page SEO, Google Ads, Facebook & Instagram marketing, analytics and reporting.'
WHERE title LIKE '%SEO%' OR title LIKE '%মার্কেটিং%';

UPDATE public.courses SET 
  title_en = 'Web Coding (HTML, CSS, JavaScript)',
  description_en = 'Learn HTML5 fundamentals, CSS3 & Flexbox, JavaScript basics and responsive web design.'
WHERE title LIKE '%ওয়েব কোডিং%' OR title LIKE '%HTML%';

UPDATE public.courses SET 
  title_en = 'Motion Graphics (After Effects)',
  description_en = 'Learn After Effects basics, keyframe animation, text animation and visual effects.'
WHERE title LIKE '%মোশন গ্রাফিক্স%' OR title LIKE '%After Effects%';

UPDATE public.courses SET 
  title_en = 'Vibe Coding (AI Website Builder)',
  description_en = 'Create complete websites without coding using AI tools. Learn prompt to design workflow.'
WHERE title LIKE '%ভাইব কোডিং%' OR title LIKE '%Vibe%';

UPDATE public.courses SET 
  title_en = 'AI Prompt Engineering',
  description_en = 'Learn to write effective prompts for AI tools. Master ChatGPT, Claude, Midjourney and more.'
WHERE title LIKE '%AI প্রম্পট%' OR title LIKE '%Prompt%';

UPDATE public.courses SET 
  title_en = 'IT Support',
  description_en = 'Learn computer troubleshooting, network setup, hardware maintenance and software installation.'
WHERE title LIKE '%আইটি সাপোর্ট%' OR title LIKE '%IT Support%';