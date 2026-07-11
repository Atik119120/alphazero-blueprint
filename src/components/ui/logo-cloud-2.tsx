import * as React from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src?: string;
  alt: string;
  label?: string;
  href?: string;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos?: Logo[];
};

const defaultLogos: Logo[] = [
  { alt: "Brand 1", label: "Brand 01" },
  { alt: "Brand 2", label: "Brand 02" },
  { alt: "Brand 3", label: "Brand 03" },
  { alt: "Brand 4", label: "Brand 04" },
  { alt: "Brand 5", label: "Brand 05" },
  { alt: "Brand 6", label: "Brand 06" },
];

export function LogoCloud({ className, logos = defaultLogos, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-3 border border-border/60 rounded-2xl overflow-hidden bg-background/40 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {/* corner plus icons */}
      <PlusIcon className="absolute -top-2 -left-2 w-4 h-4 text-primary/70" />
      <PlusIcon className="absolute -top-2 -right-2 w-4 h-4 text-primary/70" />
      <PlusIcon className="absolute -bottom-2 -left-2 w-4 h-4 text-primary/70" />
      <PlusIcon className="absolute -bottom-2 -right-2 w-4 h-4 text-primary/70" />

      {logos.map((logo, i) => (
        <LogoCard key={i} logo={logo} index={i} total={logos.length} />
      ))}
    </div>
  );
}

type LogoCardProps = {
  logo: Logo;
  index: number;
  total: number;
};

function LogoCard({ logo, index, total }: LogoCardProps) {
  const cols = 3;
  const isLastCol = (index + 1) % cols === 0;
  const isLastRow = index >= total - (total % cols === 0 ? cols : total % cols);

  const inner = (
    <div className="flex items-center justify-center h-32 md:h-40 group transition-colors hover:bg-primary/[0.04]">
      {logo.src ? (
        <img
          src={logo.src}
          alt={logo.alt}
          className="max-h-14 md:max-h-16 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
      ) : (
        <span className="text-muted-foreground/60 group-hover:text-foreground text-sm font-medium tracking-wider uppercase transition-colors">
          {logo.label || logo.alt}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "relative",
        !isLastCol && "md:border-r border-border/60",
        (index + 1) % 2 === 0 ? "" : "border-r md:border-r border-border/60",
        !isLastRow && "border-b border-border/60",
      )}
    >
      {logo.href ? (
        <a href={logo.href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
