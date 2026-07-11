import * as React from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src?: string;
  alt: string;
  label?: string;
  href?: string;
  invert?: boolean;
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
  { alt: "Brand 7", label: "Brand 07" },
  { alt: "Brand 8", label: "Brand 08" },
];

export function LogoCloud({ className, logos = defaultLogos, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative mx-auto grid max-w-4xl grid-cols-2 md:grid-cols-4",
        className,
      )}
      {...props}
    >
      {logos.map((logo, i) => (
        <LogoCard
          key={i}
          logo={logo}
          className={cn(
            // checkerboard: shade cells where (row+col) is even
            (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? "bg-muted/40" : "bg-transparent",
          )}
        >
          {/* plus icons at each internal intersection */}
          {i % 4 !== 3 && (
            <PlusIcon
              aria-hidden
              className="pointer-events-none absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/60 md:block"
            />
          )}
          {i < 4 && i % 4 !== 3 && (
            <PlusIcon
              aria-hidden
              className="pointer-events-none absolute -bottom-2 -right-2 z-10 hidden h-4 w-4 text-muted-foreground/60 md:block"
            />
          )}
        </LogoCard>
      ))}
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  const inner = (
    <>
      {logo.src ? (
        <img
          src={logo.src}
          alt={logo.alt}
          className={cn(
            "max-h-8 md:max-h-10 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100",
            logo.invert && "invert brightness-0 dark:invert-0 dark:brightness-100",
          )}
          loading="lazy"
        />

      ) : (
        <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {logo.label || logo.alt}
        </span>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "group relative flex h-28 md:h-32 items-center justify-center",
        className,
      )}
      {...props}
    >
      {logo.href ? (
        <a href={logo.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
          {inner}
        </a>
      ) : (
        inner
      )}
      {children}
    </div>
  );
}
