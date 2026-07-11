import * as React from "react";
import { cn } from "@/lib/utils";

type Logo = {
  src?: string;
  alt: string;
  label?: string;
  href?: string;
  invert?: boolean;
  large?: boolean;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos?: Logo[];
};

const defaultLogos: Logo[] = [
  { alt: "Brand 1", label: "Brand 01" },
  { alt: "Brand 2", label: "Brand 02" },
  { alt: "Brand 3", label: "Brand 03" },
  { alt: "Brand 4", label: "Brand 04" },
];

const gradientDirections = [
  "bg-gradient-to-br",
  "bg-gradient-to-tr",
  "bg-gradient-to-bl",
  "bg-gradient-to-tl",
];

export function LogoCloud({ className, logos = defaultLogos, ...props }: LogoCloudProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-6xl", className)} {...props}>
      {/* Grid Container */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/5">
        {/* Corner + intersection plus markers */}
        <span aria-hidden className="absolute -top-1.5 -left-1.5 text-primary/40 text-xs font-light select-none">+</span>
        <span aria-hidden className="absolute -top-1.5 -right-1.5 text-primary/40 text-xs font-light select-none">+</span>
        <span aria-hidden className="absolute -bottom-1.5 -left-1.5 text-primary/40 text-xs font-light select-none">+</span>
        <span aria-hidden className="absolute -bottom-1.5 -right-1.5 text-primary/40 text-xs font-light select-none">+</span>
        <span aria-hidden className="absolute -top-1.5 left-1/2 -ml-1 text-primary/30 text-xs font-light select-none lg:hidden">+</span>
        <span aria-hidden className="absolute -top-1.5 left-1/4 -ml-1 text-primary/30 text-xs font-light select-none hidden lg:block">+</span>
        <span aria-hidden className="absolute -top-1.5 left-2/4 -ml-1 text-primary/30 text-xs font-light select-none hidden lg:block">+</span>
        <span aria-hidden className="absolute -top-1.5 left-3/4 -ml-1 text-primary/30 text-xs font-light select-none hidden lg:block">+</span>

        {logos.map((logo, i) => (
          <LogoCard
            key={i}
            logo={logo}
            className={cn(
              "border-r border-b border-white/5",
              gradientDirections[i % gradientDirections.length],
              "from-white/[0.02] to-transparent hover:from-white/[0.05]",
            )}
          />
        ))}
      </div>

      {/* Decorative technical sub-label */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
            Global Portfolio v2.0
          </span>
        </div>
      </div>
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, ...props }: LogoCardProps) {
  const inner = (
    <>
      {logo.src ? (
        <img
          src={logo.src}
          alt={logo.alt}
          className={cn(
            "w-auto object-contain opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105",
            logo.large ? "max-h-20 md:max-h-28" : "max-h-8 md:max-h-10",
            logo.invert && "brightness-0 invert",
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
        "group relative aspect-[4/3] lg:aspect-auto lg:h-48 flex items-center justify-center transition-all duration-500 overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Cyan hover wash */}
      <span aria-hidden className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.06] transition-colors duration-500" />
      <div className="relative flex items-center justify-center w-full h-full px-4">
        {logo.href ? (
          <a
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-full"
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}
