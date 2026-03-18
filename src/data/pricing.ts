export interface PricingItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  features: string[];
}

export interface MonthlyPackage {
  id: string;
  badge: string;
  name: string;
  tagline: string;
  discountedPrice: number;
  originalPrice: number;
  designsPerMonth: number;
  features: string[];
}

export interface DomainRow {
  domain: string;
  condition: string;
  charge: string;
  isFree: boolean;
}

export const webPricing = {
  wordpress: [
    {
      id: "business-portfolio",
      name: "Business / Portfolio",
      icon: "🏠",
      description: "Personal or business introductory website",
      discountedPrice: 5500,
      originalPrice: 9000,
      features: [
        "5–8 pages, Responsive Design",
        "Contact Form + Basic SEO",
        "🎁 Free .online/.site/.store/.shop domain",
        "Storage/hosting cost borne by client",
      ],
    },
    {
      id: "ecommerce-woo",
      name: "E-Commerce (WooCommerce)",
      icon: "🛒",
      description: "Full online store with product management",
      discountedPrice: 14000,
      originalPrice: 22000,
      features: [
        "Unlimited products, Cart & Checkout",
        "Payment gateway integration",
        "🎁 Free .online/.site/.store/.shop domain",
        "Storage/hosting cost borne by client",
      ],
    },
    {
      id: "blog-news",
      name: "Blog / News Portal",
      icon: "📰",
      description: "Content-rich blog or news publishing site",
      discountedPrice: 9000,
      originalPrice: 16000,
      features: [
        "Category system, Author profiles",
        "SEO optimized, Fast loading",
        "🎁 Free .online/.site/.store/.shop domain",
        "Storage/hosting cost borne by client",
      ],
    },
    {
      id: "educational-lms",
      name: "Educational / LMS",
      icon: "🎓",
      description: "Online learning platform with course management",
      discountedPrice: 17000,
      originalPrice: 28000,
      features: [
        "Course builder, Video lessons",
        "Student dashboard, Certificates",
        "🎁 Free .online/.site/.store/.shop domain",
        "Storage/hosting cost borne by client",
      ],
    },
    {
      id: "corporate-company",
      name: "Corporate / Company",
      icon: "🏢",
      description: "Professional corporate website with modern design",
      discountedPrice: 12000,
      originalPrice: 20000,
      features: [
        "Multi-page layout, Team section",
        "Blog, Testimonials, Contact forms",
        "🎁 Free .online/.site/.store/.shop domain",
        "Storage/hosting cost borne by client",
      ],
    },
    {
      id: "real-estate",
      name: "Real Estate / Listing",
      icon: "🏡",
      description: "Property listing and management website",
      discountedPrice: 16000,
      originalPrice: 26000,
      features: [
        "Property listings, Search & Filter",
        "Agent profiles, Map integration",
        "🎁 Free .online/.site/.store/.shop domain",
        "Storage/hosting cost borne by client",
      ],
    },
  ] as PricingItem[],

  customCode: [
    {
      id: "portfolio-landing",
      name: "Portfolio / Landing Page",
      icon: "💼",
      description: "Fast and unique design with HTML/CSS/JS or React",
      discountedPrice: 7500,
      originalPrice: 13000,
      features: [
        "🚀 Hosted on Vercel — Ultra Fast",
        "☁️ Cloudflare R2 — 25 GB free storage",
        "🗄️ Supabase — 5 GB backend storage",
        "Custom Animation & UI Design",
        "🎁 Free .online/.site/.store/.shop domain",
      ],
    },
    {
      id: "custom-ecommerce",
      name: "Custom E-Commerce",
      icon: "🛍️",
      description: "Fully custom e-commerce with modern tech stack",
      discountedPrice: 25000,
      originalPrice: 42000,
      features: [
        "🚀 Hosted on Vercel — Ultra Fast",
        "☁️ Cloudflare R2 — 25 GB free storage",
        "🗄️ Supabase — 5 GB backend storage",
        "Custom cart, payment, admin panel",
        "🎁 Free .online/.site/.store/.shop domain",
      ],
    },
    {
      id: "saas-webapp",
      name: "SaaS / Web App",
      icon: "🚀",
      description: "Full-stack SaaS application with authentication & dashboard",
      discountedPrice: 40000,
      originalPrice: 65000,
      features: [
        "🚀 Hosted on Vercel — Ultra Fast",
        "☁️ Cloudflare R2 — 25 GB free storage",
        "🗄️ Supabase — 5 GB backend storage",
        "Auth, Dashboard, API integrations",
        "🎁 Free .online/.site/.store/.shop domain",
      ],
    },
  ] as PricingItem[],
};

export const graphicPricing = {
  oneTime: [
    {
      id: "logo-design",
      name: "Logo Design",
      icon: "✦",
      description: "Unique and professional logo for your brand",
      discountedPrice: 1500,
      originalPrice: 3500,
      features: ["3 unique concepts", "2 revision rounds", "AI/EPS/PNG/SVG delivery", "Brand color guide"],
    },
    {
      id: "social-media-post",
      name: "Social Media Post",
      icon: "📱",
      description: "Eye-catching social media content design",
      discountedPrice: 250,
      originalPrice: 500,
      features: ["Per post pricing", "Platform optimized sizes", "PNG/JPG delivery", "1 revision"],
    },
    {
      id: "banner-thumbnail",
      name: "Banner / Thumbnail",
      icon: "🖼️",
      description: "Professional banners and thumbnails",
      discountedPrice: 400,
      originalPrice: 800,
      features: ["YouTube/Facebook/Web banners", "High resolution", "Multiple sizes", "1 revision"],
    },
    {
      id: "flyer-poster",
      name: "Flyer / Poster",
      icon: "📄",
      description: "Print-ready flyers and posters",
      discountedPrice: 600,
      originalPrice: 1200,
      features: ["Print-ready (300 DPI)", "A4/A3 sizes", "Both sides design", "1 revision"],
    },
    {
      id: "business-card",
      name: "Business Card",
      icon: "💳",
      description: "Professional business card design",
      discountedPrice: 500,
      originalPrice: 1000,
      features: ["Front & back design", "Print-ready files", "Multiple concepts", "1 revision"],
    },
    {
      id: "brand-identity",
      name: "Brand Identity Pack",
      icon: "🎨",
      description: "Complete brand identity package",
      discountedPrice: 3500,
      originalPrice: 7000,
      features: ["Logo + Variants", "Color palette & Typography", "Business card + Letterhead", "Brand guidelines PDF"],
    },
  ] as PricingItem[],

  monthly: [
    {
      id: "starter",
      badge: "Basic",
      name: "Starter",
      tagline: "For small businesses or new startups",
      discountedPrice: 2500,
      originalPrice: 5000,
      designsPerMonth: 8,
      features: [
        "Social Media Post (6)",
        "Banner / Thumbnail (2)",
        "PNG/JPG delivery",
        "3-day delivery",
        "1 revision round per item",
      ],
    },
    {
      id: "growth",
      badge: "Premium",
      name: "Growth",
      tagline: "For growing brands that need consistency",
      discountedPrice: 5000,
      originalPrice: 9500,
      designsPerMonth: 18,
      features: [
        "Social Media Post (12)",
        "Banner / Thumbnail (4)",
        "Flyer / Poster (2)",
        "PNG + PDF delivery",
        "2-day delivery",
        "2 revision rounds",
        "Dedicated designer",
      ],
    },
    {
      id: "scale",
      badge: "Platinum",
      name: "Scale",
      tagline: "For businesses scaling fast and need volume",
      discountedPrice: 9000,
      originalPrice: 17000,
      designsPerMonth: 30,
      features: [
        "Social Media Post (20)",
        "Banner / Thumbnail (6)",
        "Flyer / Poster (4)",
        "PNG + PDF + Source file",
        "1-day delivery",
        "Unlimited revisions",
        "Priority support",
      ],
    },
    {
      id: "empire",
      badge: "Elite Gold",
      name: "Empire",
      tagline: "Full creative team at your service",
      discountedPrice: 15000,
      originalPrice: 28000,
      designsPerMonth: 50,
      features: [
        "Social Media Post (30)",
        "Banner / Thumbnail (10)",
        "Flyer / Poster (8)",
        "1 Logo/Brand refresh per month",
        "All formats + Source files",
        "Same-day option",
        "Unlimited revisions",
        "Dedicated creative manager",
        "WhatsApp direct support",
      ],
    },
  ] as MonthlyPackage[],
};

export const domainPricing: DomainRow[] = [
  { domain: ".online", condition: "All packages", charge: "FREE", isFree: true },
  { domain: ".site", condition: "All packages", charge: "FREE", isFree: true },
  { domain: ".store", condition: "All packages", charge: "FREE", isFree: true },
  { domain: ".shop", condition: "All packages", charge: "FREE", isFree: true },
  { domain: ".com", condition: "Any package", charge: "৳ 1,200–1,500/yr", isFree: false },
  { domain: ".com.bd", condition: "Any package", charge: "৳ 1,500–2,000/yr", isFree: false },
  { domain: ".net / .org", condition: "Any package", charge: "৳ 1,400–1,800/yr", isFree: false },
  { domain: "Other domains", condition: "Varies", charge: "Market rate", isFree: false },
];

export const servicePolicies = [
  {
    icon: "🛡️",
    title: "Lifetime Support",
    description: "As long as our company operates, we will continue supporting every client's website and design work.",
  },
  {
    icon: "🔧",
    title: "Free Bug Fix",
    description: "If any issue occurs due to OUR coding or design mistake, we will fix it completely free of charge, at any time.",
  },
  {
    icon: "✏️",
    title: "Changes = Payment",
    description: "If the client wants to change design, colors, layout, content, or features based on their own preference, a separate charge will apply.",
  },
  {
    icon: "📋",
    title: "Approve Before Delivery",
    description: "Before handover of any website or design, the client must review and approve everything. Changes after final approval will incur extra fees.",
  },
  {
    icon: "💬",
    title: "Revision Process",
    description: "Feedback can be given during the development/design phase. However, after final approval, no revision is free.",
  },
  {
    icon: "⚠️",
    title: "What is NOT Free?",
    description: "Adding new pages, new features, content updates, new designs, or any new work is always chargeable.",
  },
];
