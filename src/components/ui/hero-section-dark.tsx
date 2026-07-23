import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import gsap from "gsap"
import AsciiMosaic from "./AsciiMosaic"
import { PixelGrid } from "./pixel-grid"


interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: React.ReactNode
  ctaText?: string
  ctaHref?: string
  bottomImage?: {
    light: string
    dark: string
  }
  gridOptions?: {
    angle?: number
    cellSize?: number
    opacity?: number
    lightLineColor?: string
    darkLineColor?: string
  }
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}: NonNullable<HeroSectionProps["gridOptions"]>) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent to-90%" />
    </div>
  )
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "Build products for everyone",
      subtitle = {
        regular: "Designing your projects faster with ",
        gradient: "the largest figma UI kit.",
      },
      description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.",
      ctaText = "Browse courses",
      ctaHref = "#",
      bottomImage,

      gridOptions,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    React.useEffect(() => {
      const root = innerRef.current;
      if (!root) return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

      const ctx = gsap.context(() => {
        const targets = ["[data-hero-badge]", "[data-hero-title]", "[data-hero-desc]", "[data-hero-cta]"];
        gsap.fromTo(
          targets,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            clearProps: "transform,opacity,visibility",
          }
        );
      }, root);
      return () => ctx.revert();
    }, []);

    const splitWords = (text: string) => text;

    return (
      <div className={cn("relative", className)} ref={innerRef} {...props}>
        <section className="relative max-w-full mx-auto z-1">
          {bottomImage && (
            <>
              {/* ────── Desktop (lg+): PixelGrid dark bg + hero content ────── */}
              <div className="relative w-full hidden lg:block bg-[#05070d]">
                <div className="w-full [aspect-ratio:3/2] relative overflow-hidden">
                  <div className="absolute inset-0">
                    <PixelGrid pixelColor="#22d3ee" pixelSize={3} pixelSpacing={3} glow />
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(5,7,13,0) 0%, rgba(5,7,13,0.6) 70%, rgba(5,7,13,0.9) 100%)",
                    }}
                  />
                  <div className="dark absolute inset-0 flex items-start justify-center px-4 pt-[10%] text-foreground">
                    <HeroContent
                      title={title}
                      subtitle={subtitle}
                      description={description}
                      ctaText={ctaText}
                      ctaHref={ctaHref}
                      splitWords={splitWords}
                    />
                  </div>
                </div>
              </div>

              {/* ────── Mobile & Tablet (<lg): PixelGrid full-bleed ────── */}
              <div className="relative w-full lg:hidden dark text-foreground bg-[#05070d]">
                <div className="absolute inset-0">
                  <PixelGrid pixelColor="#22d3ee" pixelSize={3} pixelSpacing={3} glow />
                </div>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(5,7,13,0) 0%, rgba(5,7,13,0.7) 100%)",
                  }}
                />
                <div className="relative z-10 flex flex-col px-4 pt-32 sm:pt-36 pb-8">
                  <div className="flex-none">
                    <HeroContent
                      title={title}
                      subtitle={subtitle}
                      description={description}
                      ctaText={ctaText}
                      ctaHref={ctaHref}
                      splitWords={splitWords}
                    />
                  </div>
                  {props.children ? (
                    <div className="mt-8 sm:mt-10 -mx-4">{props.children as React.ReactNode}</div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    )
  },
)
HeroSection.displayName = "HeroSection"

const HeroContent = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  splitWords,
}: {
  title: string
  subtitle: { regular: string; gradient: string }
  description: React.ReactNode
  ctaText: string
  ctaHref: string
  splitWords: (t: string) => string
}) => (
  <div className="space-y-4 sm:space-y-7 max-w-6xl leading-tight lg:leading-5 mx-auto text-center">
    <h1 data-hero-badge className="text-[11px] sm:text-xs md:text-sm text-foreground/95 group font-geist mx-auto px-3 sm:px-4 py-1.5 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border-[2px] border-border rounded-3xl w-fit backdrop-blur-sm">
      {title}
      <ChevronRight className="inline w-3 h-3 ml-1.5 group-hover:translate-x-1 duration-300" />
    </h1>
    <h2 data-hero-title style={{ fontFamily: "'Roboto', sans-serif" }} className="text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mx-auto drop-shadow-2xl sm:whitespace-nowrap">
      <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,hsl(var(--foreground))_0%,hsl(var(--foreground)/0.7)_100%)]">
        {splitWords(subtitle.regular)}
      </span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))] [text-shadow:0_0_40px_hsl(var(--gradient-mid)/0.4)]">
        {splitWords(subtitle.gradient)}
      </span>
    </h2>
    <p data-hero-desc className="max-w-3xl mx-auto text-foreground/90 text-sm sm:text-lg md:text-2xl drop-shadow-lg px-2">
      {description}
    </p>
    <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
      <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary)/0.2)_0%,hsl(var(--primary))_50%,hsl(var(--primary)/0.2)_100%)]" />
        <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background/90 backdrop-blur-3xl text-xs font-medium text-foreground">
          <a
            href={ctaHref}
            data-hero-cta
            className="inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent text-foreground border-input border-[1px] hover:bg-gradient-to-tr hover:from-primary/30 hover:via-primary/20 hover:to-transparent transition-all sm:w-auto py-4 px-10"
          >
            {ctaText}
          </a>
        </div>
      </span>
    </div>
  </div>
)


export { HeroSection }
