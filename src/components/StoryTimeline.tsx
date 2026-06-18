import { motion } from 'framer-motion';
import type { TimelineEvent } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionDivider from './SectionDivider';
import { scrollRevealMotion } from '../utils/motion';

interface StoryTimelineProps {
  events: TimelineEvent[];
}

export default function StoryTimeline({ events }: StoryTimelineProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <ScrollReveal className="mb-16 text-center">
        <p className="section-eyebrow">Our Story</p>
        <p className="section-script mt-3">The Journey to Our Day</p>
        <h2 className="section-title mt-4">Every chapter led us here</h2>
        <div className="mt-8">
          <SectionDivider />
        </div>
      </ScrollReveal>
      <div className="relative">
        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-[#d9c5b2]/40 lg:block" />
        <div className="space-y-24">
          {events.map((event, index) => {
            const isReversed = index % 2 === 1;

            return (
              <motion.article
                key={event.id}
                {...scrollRevealMotion(index * 0.1)}
                className="relative grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center"
              >
                <div className={`order-2 ${isReversed ? 'lg:order-2 lg:pl-8' : 'lg:order-1 lg:pr-8'}`}>
                  <div className="theme-rounded relative aspect-[4/5] overflow-hidden border border-[#d9c5b2]/50 shadow-[0_24px_60px_-20px_rgba(111,76,46,0.28)]">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div
                  className={`order-1 flex flex-col justify-center ${
                    isReversed ? 'lg:order-1 lg:items-end lg:pr-8 lg:text-right' : 'lg:order-2 lg:pl-8'
                  }`}
                >
                  <span className="theme-pill inline-flex bg-[#f5d396]/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.32em] text-[#6f4c2e]">
                    {event.date}
                  </span>
                  <h3 className="mt-5 font-[Playfair_Display] text-[clamp(1.75rem,4vw,3rem)] font-semibold text-[#3d2b1f]">
                    {event.title}
                  </h3>
                  <p className="mt-6 max-w-xl text-base leading-8 text-[#5c4a3d] sm:text-lg">
                    {event.description}
                  </p>
                </div>
                <div className="carousel-dot absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 border border-[#c5a059]/50 bg-[#f5f0eb] lg:block" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
