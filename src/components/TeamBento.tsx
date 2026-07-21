import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Loader2, Globe } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";

type Social = { href: string; icon: React.ReactNode; label: string; brand: string; shadow: string };

const BRAND: Record<string, { brand: string; shadow: string }> = {
  Instagram: { brand: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888]", shadow: "hover:shadow-[0_8px_20px_-6px_rgba(220,60,120,0.55)]" },
  LinkedIn:  { brand: "hover:bg-[#0A66C2]", shadow: "hover:shadow-[0_8px_20px_-6px_rgba(10,102,194,0.55)]" },
  Twitter:   { brand: "hover:bg-[#0f1419]", shadow: "hover:shadow-[0_8px_20px_-6px_rgba(15,20,25,0.55)]" },
  Facebook:  { brand: "hover:bg-[#1877F2]", shadow: "hover:shadow-[0_8px_20px_-6px_rgba(24,119,242,0.55)]" },
  Email:     { brand: "hover:bg-[#EA4335]", shadow: "hover:shadow-[0_8px_20px_-6px_rgba(234,67,53,0.55)]" },
  Portfolio: { brand: "hover:bg-[#10B981]", shadow: "hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.55)]" },
};

const socialsOf = (m: any): Social[] => {
  const s: Social[] = [];
  const mk = (label: string, href: string, icon: React.ReactNode) => ({ href, icon, label, ...BRAND[label] });
  if (m.instagram_url) s.push(mk("Instagram", m.instagram_url, <Instagram size={13} />));
  if (m.linkedin_url) s.push(mk("LinkedIn", m.linkedin_url, <Linkedin size={13} />));
  if (m.twitter_url) s.push(mk("Twitter", m.twitter_url, <Twitter size={13} />));
  if (m.facebook_url) s.push(mk("Facebook", m.facebook_url, <Facebook size={13} />));
  if (m.email) s.push(mk("Email", `mailto:${m.email}`, <Mail size={13} />));
  if (m.portfolio_url) s.push(mk("Portfolio", m.portfolio_url, <Globe size={13} />));
  return s.slice(0, 3);
};

const iconBtnCls = (s: Social, size: "sm" | "md" = "sm") =>
  `${size === "md" ? "w-9 h-9" : "w-8 h-8"} rounded-[10px] bg-white border border-border/60 text-foreground/70 ` +
  `flex items-center justify-center transition-all duration-300 ease-out ` +
  `hover:text-white hover:border-transparent hover:-translate-y-0.5 hover:scale-105 ` +
  `active:scale-95 shadow-sm ${s.brand} ${s.shadow}`;


function SmallCard({ member, index, reverse = false }: { member: any; index: number; reverse?: boolean }) {
  const socials = socialsOf(member);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group flex bg-background rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-xl transition-all duration-500"
    >
      <div className={`relative w-2/5 aspect-square shrink-0 overflow-hidden bg-primary/10 ${reverse ? "order-last" : ""}`}>
        <img
          src={member.image_url || "/placeholder.svg"}
          alt={member.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-display font-bold text-base leading-tight text-foreground">{member.name}</h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold line-clamp-2">
            {member.role}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-dashed border-border/60 flex items-center gap-1.5">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-7 h-7 rounded-md bg-foreground text-background hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCard({ member }: { member: any }) {
  const socials = socialsOf(member);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden bg-primary/20 h-[520px] lg:h-full lg:min-h-[520px]"
    >
      <img
        src={member.image_url || "/placeholder.svg"}
        alt={member.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-background/95 backdrop-blur-sm px-4 py-3 shadow-2xl">
        <h3 className="font-display font-bold text-base text-foreground leading-tight">{member.name}</h3>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold line-clamp-1">
          {member.role}
        </p>
        <div className="mt-2 pt-2 border-t border-dashed border-border/60 flex items-center gap-1.5">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-7 h-7 rounded-md bg-foreground text-background hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamBento() {
  const { data: members, isLoading } = useTeamMembers();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!members || members.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No team members found.</div>;
  }

  // Reorder so the CEO / first member (Sofiullah) is featured in the center
  const reordered = [...members];
  const ceoIdx = reordered.findIndex((m: any) => /sofiullah/i.test(m.name));
  if (ceoIdx > -1) {
    const [ceo] = reordered.splice(ceoIdx, 1);
    // Place at index 3 so it lands as the featured card in the first group of 7
    reordered.splice(3, 0, ceo);
  }

  // Split into groups of 7: [3 left, 1 featured, 3 right]
  const groups: any[][] = [];
  for (let i = 0; i < reordered.length; i += 7) groups.push(reordered.slice(i, i + 7));


  return (
    <div className="space-y-6">
      {groups.map((group, gi) => {
        const leftMembers = group.slice(0, 3);
        const featured = group[3] || group[0];
        const rightMembers = group.slice(4, 7);

        return (
          <div
            key={gi}
            className="rounded-3xl bg-muted/30 border border-border/40 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch"
          >
            <div className="order-2 lg:order-1 flex flex-col gap-4">
              {leftMembers.map((m, i) => (
                <SmallCard key={m.id || i} member={m} index={i} />
              ))}
            </div>
            <div className="order-1 lg:order-2">
              {featured && <FeaturedCard member={featured} />}
            </div>
            <div className="order-3 flex flex-col gap-4">
              {rightMembers.map((m, i) => (
                <SmallCard key={m.id || i} member={m} index={i} reverse />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

}
