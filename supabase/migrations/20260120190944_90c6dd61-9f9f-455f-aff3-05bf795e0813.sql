-- Create site_settings table for favicon, logo, etc.
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page_content table for editable text blocks
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_en TEXT,
  content_bn TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_name, content_key)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for page_content
CREATE POLICY "Anyone can view page content"
ON public.page_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage page content"
ON public.page_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type) VALUES
('favicon_url', '/favicon.ico', 'image'),
('logo_url', '/logo.png', 'image'),
('site_name', 'Alpha Zero', 'text');

-- Insert default page content for Home, About, Contact
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
-- Home page
('home', 'hero.title', 'We Create Digital Experiences', 'আমরা ডিজিটাল অভিজ্ঞতা তৈরি করি'),
('home', 'hero.subtitle', 'Alpha Zero - Where Creativity Meets Technology', 'আলফা জিরো - যেখানে সৃজনশীলতা প্রযুক্তির সাথে মিলিত হয়'),
('home', 'hero.description', 'We are a creative agency specializing in graphics design, video editing, web development, and digital marketing solutions.', 'আমরা গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং, ওয়েব ডেভেলপমেন্ট এবং ডিজিটাল মার্কেটিং সলিউশনে বিশেষজ্ঞ একটি ক্রিয়েটিভ এজেন্সি।'),
-- About page
('about', 'hero.title', 'About Us', 'আমাদের সম্পর্কে'),
('about', 'hero.subtitle', 'Our Story', 'আমাদের গল্প'),
('about', 'story.content', 'Founded with a vision to bridge creativity and technology, Alpha Zero has grown into a full-service creative agency.', 'সৃজনশীলতা এবং প্রযুক্তির মধ্যে সেতুবন্ধন তৈরির দৃষ্টিভঙ্গি নিয়ে প্রতিষ্ঠিত, আলফা জিরো একটি পূর্ণ-সেবা ক্রিয়েটিভ এজেন্সিতে পরিণত হয়েছে।'),
-- Contact page
('contact', 'hero.title', 'Contact Us', 'যোগাযোগ করুন'),
('contact', 'hero.subtitle', 'Get in Touch', 'যোগাযোগ করুন'),
('contact', 'hero.description', 'Have a project in mind? Let''s discuss how we can help bring your vision to life.', 'মনে কোন প্রজেক্ট আছে? আসুন আলোচনা করি কিভাবে আমরা আপনার দৃষ্টিভঙ্গি বাস্তবায়নে সাহায্য করতে পারি।');