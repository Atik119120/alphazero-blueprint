import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import AsciiMosaic from "./AsciiMosaic"


interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: string
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
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <section className="relative max-w-full mx-auto z-1">
          {bottomImage && (
            <div className="relative w-full">
              <AsciiMosaic srcLight={bottomImage.light} srcDark={bottomImage.dark} className="w-full" cellSize={5} bloom={0} bgOpacity={0} animIntensity={20} />
              {/* dark overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background pointer-events-none" />

              {/* Overlayed text + button */}
              <div className="absolute inset-0 flex items-start justify-center px-4 pt-[22%] sm:pt-[16%] md:pt-[12%]">
                <div className="space-y-4 sm:space-y-7 max-w-6xl leading-tight lg:leading-5 mx-auto text-center">
                  <h1 className="text-[11px] sm:text-xs md:text-sm text-foreground/95 group font-geist mx-auto px-3 sm:px-4 py-1.5 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border-[2px] border-border rounded-3xl w-fit backdrop-blur-sm">
                    {title}
                    <ChevronRight className="inline w-3 h-3 ml-1.5 group-hover:translate-x-1 duration-300" />
                  </h1>
                  <h2 className="text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter font-geist mx-auto drop-shadow-2xl sm:whitespace-nowrap">
                    <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,hsl(var(--foreground))_0%,hsl(var(--foreground)/0.7)_100%)]">
                      {subtitle.regular}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))] [text-shadow:0_0_40px_hsl(var(--gradient-mid)/0.4)]">
                      {subtitle.gradient}
                    </span>
                  </h2>
                  <p className="max-w-3xl mx-auto text-foreground/90 text-sm sm:text-lg md:text-2xl drop-shadow-lg px-2">
                    {description}
                  </p>

                  <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary)/0.2)_0%,hsl(var(--primary))_50%,hsl(var(--primary)/0.2)_100%)]" />
                      <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background/90 backdrop-blur-3xl text-xs font-medium text-foreground">
                        <a
                          href={ctaHref}
                          className="inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent text-foreground border-input border-[1px] hover:bg-gradient-to-tr hover:from-primary/30 hover:via-primary/20 hover:to-transparent transition-all sm:w-auto py-4 px-10"
                        >
                          {ctaText}
                        </a>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    )
  },
)
HeroSection.displayName = "HeroSection"

export { HeroSection }
