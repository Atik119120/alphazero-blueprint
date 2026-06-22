UPDATE public.courses SET
  short_description = 'AI এর সাথে কথা বলে ওয়েবসাইট, অ্যাপ ও সফটওয়্যার তৈরি করুন — কোনো কোডিং অভিজ্ঞতা ছাড়াই। Lovable, Cursor, ChatGPT ব্যবহার করে শূন্য থেকে প্রোডাক্ট launch করার complete হাতে-কলমে কোর্স।',
  short_description_en = 'Build websites, apps and software just by talking to AI — no coding experience required. A complete hands-on course on launching real products from zero using Lovable, Cursor and ChatGPT.',
  trainer_bio = 'AlphaZero এর প্রধান ইন্সট্রাক্টর। ৫+ বছরের অভিজ্ঞতা সম্পন্ন ফুল-স্ট্যাক ডেভেলপার ও AI প্রোডাক্ট বিল্ডার। শতাধিক শিক্ষার্থীকে AI দিয়ে নিজের প্রোডাক্ট বানাতে সাহায্য করেছেন।',
  trainer_bio_en = 'Lead instructor at AlphaZero. 5+ years experience as a full-stack developer and AI product builder. Helped hundreds of students launch their own products using AI tools.',
  start_date = COALESCE(start_date, 'যেকোনো সময় শুরু করুন'),
  class_time = COALESCE(class_time, 'নিজের সুবিধামতো'),
  total_classes = COALESCE(total_classes, '৩০+ ভিডিও'),
  duration = COALESCE(duration, '৮ সপ্তাহ'),
  learning_outcomes = COALESCE(learning_outcomes, '[
    "AI প্রম্পট দিয়ে ফুল ওয়েবসাইট ও অ্যাপ তৈরি",
    "Lovable, Cursor, ChatGPT এর প্রফেশনাল ব্যবহার",
    "Database, Authentication ও Payment integration",
    "নিজের SaaS প্রোডাক্ট launch ও sell করার পদ্ধতি",
    "Modern UI/UX ডিজাইন AI দিয়ে",
    "Freelancing ও client project AI দিয়ে দ্রুত deliver",
    "Bug fix ও debugging AI দিয়ে",
    "Real-world ৫টি project শূন্য থেকে বিল্ড"
  ]'::jsonb),
  faqs = COALESCE(faqs, '[
    {"question":"কোডিং না জানলেও কি কোর্সটি করতে পারব?","answer":"হ্যাঁ, একদম। এই কোর্স পুরোপুরি beginner-দের জন্য। AI কে instruction দিয়ে কাজ করানো শেখানো হবে — কোনো প্রোগ্রামিং background দরকার নেই।"},
    {"question":"কোর্স শেষ করতে কত সময় লাগবে?","answer":"নিজের সুবিধামতো — গড়ে ৬-৮ সপ্তাহ। সব ভিডিও lifetime access, যখন খুশি দেখতে পারবেন।"},
    {"question":"কোর্সে কি certificate পাব?","answer":"হ্যাঁ, কোর্সের সব lesson সম্পন্ন করলে AlphaZero থেকে verified digital certificate পাবেন।"},
    {"question":"Payment কিভাবে করব?","answer":"bKash, Nagad, Rocket, Card — সব ধরনের পেমেন্ট method support করা আছে UddoktaPay এর মাধ্যমে।"},
    {"question":"কোর্সে কি support পাব?","answer":"হ্যাঁ, প্রতি lesson এর নিচে Q&A section আছে যেখানে instructor সরাসরি reply দেয়। এছাড়া community chat ও support ticket system আছে।"},
    {"question":"কোর্স কিনলে কি refund পাওয়া যাবে?","answer":"৭ দিনের money-back guarantee আছে। কোর্স ভালো না লাগলে refund নিতে পারবেন (প্রথম ২টি module শেষ হওয়ার আগে)।"}
  ]'::jsonb)
WHERE landing_slug = 'vibe-coding';