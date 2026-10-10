import { motion, type PanInfo } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { HeroContent } from '../types';
import { heroEase } from '../utils/motion';

interface HeroCarouselProps {
  hero: HeroContent;
}

const slideTransition = { duration: 1.4, ease: heroEase };

const textContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.25 },
  },
};

const textItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: heroEase },
  },
};

export default function HeroCarousel({ hero }: HeroCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % hero.slides.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [hero.slides.length, activeSlide]);

  const dotButtons = useMemo(
    () =>
      hero.slides.map((item, index) => {
        const isActive = index === activeSlide;

        return (
          <button
            key={item.id}
            type="button"
            className={`carousel-dot h-2 border border-white/35 transition-all duration-500 ease-out sm:h-2.5 ${
              isActive ? 'w-7 bg-white sm:w-8' : 'w-2 bg-white/30 hover:bg-white/55 sm:w-2.5'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? 'true' : undefined}
          />
        );
      }),
    [activeSlide, hero.slides]
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) {
      setActiveSlide((current) => (current + 1) % hero.slides.length);
    }
    if (info.offset.x > 60) {
      setActiveSlide((current) => (current - 1 + hero.slides.length) % hero.slides.length);
    }
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {hero.slides.map((item, index) => {
          const isActive = index === activeSlide;

          return (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.06,
              }}
              transition={slideTransition}
              aria-hidden={!isActive}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end justify-center px-5 py-24 sm:px-8 sm:py-28 md:px-10 lg:px-20"
      >
        <motion.div
          key={activeSlide}
          variants={textContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl text-center sm:max-w-5xl"
        >
          <motion.h1
            variants={textItem}
            className="mx-auto font-[Playfair_Display] text-[3.25rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[4.25rem] md:text-[5rem]"
          >
            {hero.heading}
          </motion.h1>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-12 sm:gap-3">
        {dotButtons}
      </div>
    </section>
  );
}
