import { ReactNode, useMemo } from "react";
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y, Keyboard, FreeMode } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

export type AppSwiperVariant = "cards" | "marquee" | "logos" | "hero";

export interface AppSwiperProps<T> extends Omit<SwiperProps, "children" | "breakpoints"> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  variant?: AppSwiperVariant;
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplayDelay?: number;
  speed?: number;
  spaceBetween?: number;
  loop?: boolean;
  breakpoints?: SwiperOptions["breakpoints"];
  slideClassName?: string;
  className?: string;
}

const variantDefaults: Record<AppSwiperVariant, { breakpoints: SwiperOptions["breakpoints"]; spaceBetween: number }> = {
  cards: {
    spaceBetween: 24,
    breakpoints: {
      0: { slidesPerView: 1.1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 4 },
    },
  },
  logos: {
    spaceBetween: 32,
    breakpoints: {
      0: { slidesPerView: 3 },
      640: { slidesPerView: 4 },
      1024: { slidesPerView: 6 },
    },
  },
  marquee: {
    spaceBetween: 16,
    breakpoints: {
      0: { slidesPerView: "auto" },
    },
  },
  hero: {
    spaceBetween: 0,
    breakpoints: {
      0: { slidesPerView: 1 },
    },
  },
};

export function AppSwiper<T>({
  items,
  renderItem,
  keyExtractor,
  variant = "cards",
  showNavigation = false,
  showPagination = false,
  autoplayDelay = 3500,
  speed = 700,
  spaceBetween,
  loop = true,
  breakpoints,
  slideClassName,
  className,
  modules,
  ...rest
}: AppSwiperProps<T>) {
  const defaults = variantDefaults[variant];
  const finalModules = useMemo(
    () => [Autoplay, Navigation, Pagination, A11y, Keyboard, FreeMode, ...(modules ?? [])],
    [modules],
  );

  const isMarquee = variant === "marquee";

  return (
    <Swiper
      modules={finalModules}
      speed={speed}
      loop={loop}
      spaceBetween={spaceBetween ?? defaults.spaceBetween}
      breakpoints={breakpoints ?? defaults.breakpoints}
      navigation={showNavigation}
      pagination={showPagination ? { clickable: true } : false}
      keyboard={{ enabled: true }}
      a11y={{ enabled: true }}
      autoplay={
        isMarquee
          ? { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }
          : { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }
      }
      freeMode={isMarquee ? { enabled: true, momentum: false } : false}
      allowTouchMove
      grabCursor
      className={className}
      {...rest}
    >
      {items.map((item, i) => (
        <SwiperSlide
          key={keyExtractor ? keyExtractor(item, i) : i}
          className={slideClassName}
          style={isMarquee ? { width: "auto" } : undefined}
        >
          {renderItem(item, i)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default AppSwiper;
