# Design System

## Aesthetic Direction
**Premium Editorial Glassmorphism** — glass-cards, mesh backgrounds, editorial typography। কোনো background stripes/glows নয়।

## Typography
- **Headings:** Playfair Display (editorial serif)
- **Bangla:** Hind Siliguri
- **Body (English):** system-safe pairing with Playfair
- Dual language display: বাংলা এবং English সম্পূর্ণ isolated — mix করা যাবে না।

## Color & Tokens
- All colors defined as **semantic tokens** in `src/index.css` (HSL)
- shadcn variants use these tokens
- ❌ Never hardcode `text-white`, `bg-black`, `bg-[#xxx]` in components
- Dark mode via theme tokens

## Components
- shadcn/ui base
- Glass card = `backdrop-blur` + subtle border + soft shadow
- Buttons: primary (brand), secondary (glass), ghost
- Forms: labeled inputs, inline validation

## Layout Rules
- Course Viewer: video fixed top, sidebar (class list) scrolls independently, body locked (`overflow-hidden` on root, `100dvh`)
- Mobile: YouTube-style sticky video top
- Cards use consistent radius (`--radius`)

## Media
- Logos: theme-aware CSS filters
- Images: `no-referrer` + `crossOrigin` where needed
- Uploads: reusable `ImageUploader` → `media-uploads` bucket
- Video: Cloudinary HLS/DASH OR YouTube via VideoJS plugin

## Motion
- Subtle transitions (200-300ms)
- No aggressive parallax or auto-playing distractions

## Iconography
- Lucide-react only
