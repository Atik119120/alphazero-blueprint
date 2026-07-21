import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Loader2, Globe } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";

type Social = { href: string; icon: React.ReactNode; label: string };

const socialsOf = (m: any): Social[] => {
  const s: Social[] = [];
  if (m.instagram_url) s.push({ href: m.instagram_url, icon: <Instagram size={13} />, label: "Instagram" });
  if (m.linkedin_url) s.push({ href: m.linkedin_url, icon: <Linkedin size={13} />, label: "LinkedIn" });
  if (m.twitter_url) s.push({ href: m.twitter_url, icon: <Twitter size={13} />, label: "Twitter" });
  if (m.facebook_url) s.push({ href: m.facebook_url, icon: <Facebook size={13} />, label: "Facebook" });
  if (m.email) s.push({ href: `mailto:${m.email}`, icon: <Mail size={13} />, label: "Email" });
  if (m.portfolio_url) s.push({ href: m.portfolio_url, icon: <Globe size={13} />, label: "Portfolio" });
  return s.slice(0, 3);
};

function SmallCard({ member, index }: { member: any; index: number; reverse?: boolean }) {
  const socials = socialsOf(member);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-2xl overflow-hidden bg-primary/10 border border-border/40 hover:border-primary/30 hover:shadow-xl transition-all duration-500 aspect-[3/4]"
    >
      <img
        src={member.image_url || "/placeholder.svg"}
        alt={member.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-x-2 bottom-2 rounded-xl bg-background/95 backdrop-blur-sm px-3 py-2 shadow-xl">
        <h3 className="font-display font-bold text-sm text-foreground leading-tight line-clamp-1">{member.name}</h3>
        <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-semibold line-clamp-1">
          {member.role}
        </p>
        <div className="mt-1.5 pt-1.5 border-t border-dashed border-border/60 flex items-center gap-1">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-6 h-6 rounded-md bg-foreground text-background hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
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

  // Split into groups of 7: [3 left, 1 featured, 3 right]
  const groups: any[][] = [];
  for (let i = 0; i < members.length; i += 7) groups.push(members.slice(i, i + 7));

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
