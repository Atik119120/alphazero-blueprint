-- Create footer_links table for social media and navigation links
CREATE TABLE public.footer_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_type TEXT NOT NULL, -- 'social', 'nav', 'legal'
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT, -- For social icons like 'Facebook', 'Instagram', etc.
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create footer_content table for footer text content
CREATE TABLE public.footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_en TEXT,
  content_bn TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view footer links" ON public.footer_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage footer links" ON public.footer_links FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view footer content" ON public.footer_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage footer content" ON public.footer_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers
CREATE TRIGGER update_footer_links_updated_at BEFORE UPDATE ON public.footer_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON public.footer_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default footer links
INSERT INTO public.footer_links (link_type, title, url, icon, order_index) VALUES
('social', 'Facebook', 'https://www.facebook.com/AlphaZero00', 'Facebook', 1),
('social', 'Instagram', 'https://www.instagram.com/alphazero00', 'Instagram', 2),
('social', 'LinkedIn', 'https://www.linkedin.com/company/alphazero00', 'Linkedin', 3),
('social', 'WhatsApp', 'https://wa.me/8801234567890', 'MessageCircle', 4),
('nav', 'Home', '/', NULL, 1),
('nav', 'About', '/about', NULL, 2),
('nav', 'Services', '/services', NULL, 3),
('nav', 'Work', '/work', NULL, 4),
('nav', 'Team', '/team', NULL, 5),
('nav', 'Contact', '/contact', NULL, 6);

-- Insert footer content
INSERT INTO public.footer_content (content_key, content_en, content_bn) VALUES
('tagline', 'Creating Digital Excellence', 'ডিজিটাল উৎকর্ষতা তৈরি করছি'),
('description', 'We are a creative agency specializing in graphics design, video editing, web development, and digital marketing.', 'আমরা গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং, ওয়েব ডেভেলপমেন্ট এবং ডিজিটাল মার্কেটিংয়ে বিশেষজ্ঞ একটি ক্রিয়েটিভ এজেন্সি।'),
('address', 'Gopalganj, Dhaka, Bangladesh', 'গোপালগঞ্জ, ঢাকা, বাংলাদেশ'),
('email', 'alphazero@gmail.com', 'alphazero@gmail.com'),
('phone', '+880 1234-567890', '+880 1234-567890'),
('copyright', '© 2024 Alpha Zero. All rights reserved.', '© ২০২৪ আলফা জিরো। সর্বস্বত্ব সংরক্ষিত।');

-- Insert comprehensive page content for HOME page
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
('home', 'hero.tagline', 'Alpha Zero - Where Creativity Meets Technology', 'আলফা জিরো - যেখানে সৃজনশীলতা প্রযুক্তির সাথে মিলিত হয়'),
('home', 'hero.cta1', 'Start Your Project', 'আপনার প্রজেক্ট শুরু করুন'),
('home', 'hero.cta2', 'View Our Work', 'আমাদের কাজ দেখুন'),
('home', 'stats.projects', '500+', '৫০০+'),
('home', 'stats.projects_label', 'Projects Completed', 'সম্পন্ন প্রজেক্ট'),
('home', 'stats.clients', '200+', '২০০+'),
('home', 'stats.clients_label', 'Happy Clients', 'সন্তুষ্ট ক্লায়েন্ট'),
('home', 'stats.years', '3+', '৩+'),
('home', 'stats.years_label', 'Years Experience', 'বছরের অভিজ্ঞতা'),
('home', 'services.title', 'What We Do', 'আমরা কী করি'),
('home', 'services.subtitle', 'Our Expertise', 'আমাদের দক্ষতা'),
('home', 'why.title', 'Why Choose Us', 'কেন আমাদের বেছে নেবেন'),
('home', 'testimonials.title', 'What Clients Say', 'ক্লায়েন্টরা কী বলেন'),
('home', 'cta.title', 'Ready to Start Your Project?', 'আপনার প্রজেক্ট শুরু করতে প্রস্তুত?'),
('home', 'cta.description', 'Let''s discuss how we can help bring your vision to life.', 'আসুন আলোচনা করি কিভাবে আমরা আপনার দৃষ্টিভঙ্গি বাস্তবায়নে সাহায্য করতে পারি।'),
('home', 'cta.button', 'Get Free Consultation', 'ফ্রি পরামর্শ নিন')
ON CONFLICT (page_name, content_key) DO NOTHING;

-- Insert comprehensive page content for ABOUT page
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
('about', 'hero.description', 'Learn about our journey, values, and the team behind Alpha Zero.', 'আলফা জিরোর পেছনের যাত্রা, মূল্যবোধ এবং টিম সম্পর্কে জানুন।'),
('about', 'story.title', 'Our Story', 'আমাদের গল্প'),
('about', 'story.description', 'Founded with a vision to bridge creativity and technology, Alpha Zero has grown into a full-service creative agency serving clients worldwide.', 'সৃজনশীলতা এবং প্রযুক্তির মধ্যে সেতুবন্ধন তৈরির দৃষ্টিভঙ্গি নিয়ে প্রতিষ্ঠিত, আলফা জিরো বিশ্বব্যাপী ক্লায়েন্টদের সেবা প্রদানকারী একটি পূর্ণ-সেবা ক্রিয়েটিভ এজেন্সিতে পরিণত হয়েছে।'),
('about', 'values.title', 'Our Values', 'আমাদের মূল্যবোধ'),
('about', 'values.creativity', 'Creativity', 'সৃজনশীলতা'),
('about', 'values.creativity_desc', 'We bring fresh, innovative ideas to every project.', 'প্রতিটি প্রজেক্টে আমরা নতুন, উদ্ভাবনী ধারণা নিয়ে আসি।'),
('about', 'values.quality', 'Quality', 'গুণমান'),
('about', 'values.quality_desc', 'Excellence is our standard, not an exception.', 'উৎকর্ষতা আমাদের মান, ব্যতিক্রম নয়।'),
('about', 'values.integrity', 'Integrity', 'সততা'),
('about', 'values.integrity_desc', 'We build trust through transparency and honesty.', 'স্বচ্ছতা এবং সততার মাধ্যমে আমরা বিশ্বাস তৈরি করি।'),
('about', 'location.title', 'Our Location', 'আমাদের অবস্থান'),
('about', 'location.description', 'Based in Gopalganj, Bangladesh, we serve clients globally.', 'গোপালগঞ্জ, বাংলাদেশে অবস্থিত, আমরা বিশ্বব্যাপী ক্লায়েন্টদের সেবা প্রদান করি।'),
('about', 'cta.title', 'Want to Work With Us?', 'আমাদের সাথে কাজ করতে চান?'),
('about', 'cta.button', 'Get in Touch', 'যোগাযোগ করুন')
ON CONFLICT (page_name, content_key) DO NOTHING;

-- Insert comprehensive page content for CONTACT page
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
('contact', 'info.phone_label', 'Phone', 'ফোন'),
('contact', 'info.phone', '+880 1234-567890', '+৮৮০ ১২৩৪-৫৬৭৮৯০'),
('contact', 'info.email_label', 'Email', 'ইমেইল'),
('contact', 'info.email', 'alphazero@gmail.com', 'alphazero@gmail.com'),
('contact', 'info.address_label', 'Address', 'ঠিকানা'),
('contact', 'info.address', 'Gopalganj, Dhaka, Bangladesh', 'গোপালগঞ্জ, ঢাকা, বাংলাদেশ'),
('contact', 'info.hours_label', 'Working Hours', 'কাজের সময়'),
('contact', 'info.hours', 'Sat - Thu: 9:00 AM - 6:00 PM', 'শনি - বৃহ: সকাল ৯:০০ - সন্ধ্যা ৬:০০'),
('contact', 'form.title', 'Send us a Message', 'আমাদের মেসেজ পাঠান'),
('contact', 'form.name', 'Your Name', 'আপনার নাম'),
('contact', 'form.email', 'Your Email', 'আপনার ইমেইল'),
('contact', 'form.subject', 'Subject', 'বিষয়'),
('contact', 'form.message', 'Your Message', 'আপনার মেসেজ'),
('contact', 'form.submit', 'Send Message', 'মেসেজ পাঠান'),
('contact', 'quick.email_btn', 'Email Us', 'ইমেইল করুন'),
('contact', 'quick.whatsapp_btn', 'WhatsApp', 'হোয়াটসঅ্যাপ')
ON CONFLICT (page_name, content_key) DO NOTHING;

-- Insert content for SERVICES page
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
('services', 'hero.title', 'Our Services', 'আমাদের সেবাসমূহ'),
('services', 'hero.subtitle', 'What We Offer', 'আমরা কী অফার করি'),
('services', 'hero.description', 'Comprehensive creative solutions tailored to your needs.', 'আপনার প্রয়োজন অনুযায়ী সম্পূর্ণ সৃজনশীল সমাধান।'),
('services', 'process.title', 'Our Process', 'আমাদের প্রক্রিয়া'),
('services', 'cta.title', 'Ready to Get Started?', 'শুরু করতে প্রস্তুত?'),
('services', 'cta.button', 'Contact Us', 'যোগাযোগ করুন')
ON CONFLICT (page_name, content_key) DO NOTHING;

-- Insert content for WORK page
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
('work', 'hero.title', 'Our Work', 'আমাদের কাজ'),
('work', 'hero.subtitle', 'Portfolio', 'পোর্টফোলিও'),
('work', 'hero.description', 'Explore our latest projects and creative work.', 'আমাদের সর্বশেষ প্রজেক্ট এবং সৃজনশীল কাজ দেখুন।'),
('work', 'web.title', 'Web Development', 'ওয়েব ডেভেলপমেন্ট'),
('work', 'graphics.title', 'Graphic Design', 'গ্রাফিক ডিজাইন'),
('work', 'video.title', 'Video Editing', 'ভিডিও এডিটিং'),
('work', 'cta.title', 'Have a Project in Mind?', 'মনে কোন প্রজেক্ট আছে?'),
('work', 'cta.button', 'Start a Project', 'প্রজেক্ট শুরু করুন')
ON CONFLICT (page_name, content_key) DO NOTHING;

-- Insert content for TEAM page
INSERT INTO public.page_content (page_name, content_key, content_en, content_bn) VALUES
('team', 'hero.title', 'Meet Our Team', 'আমাদের টিমের সাথে পরিচিত হন'),
('team', 'hero.subtitle', 'The Minds Behind Alpha Zero', 'আলফা জিরোর পেছনের মস্তিষ্ক'),
('team', 'hero.description', 'A passionate team of creative professionals dedicated to delivering excellence.', 'উৎকর্ষতা প্রদানে নিবেদিত সৃজনশীল পেশাদারদের একটি উদ্যমী দল।'),
('team', 'join.title', 'Join Our Team', 'আমাদের টিমে যোগ দিন'),
('team', 'join.description', 'We''re always looking for talented individuals to join our creative family.', 'আমরা সবসময় আমাদের সৃজনশীল পরিবারে যোগ দিতে প্রতিভাবান ব্যক্তিদের খুঁজছি।'),
('team', 'join.cta1', 'View Open Positions', 'খোলা পদ দেখুন'),
('team', 'join.cta2', 'Contact Us', 'যোগাযোগ করুন')
ON CONFLICT (page_name, content_key) DO NOTHING;