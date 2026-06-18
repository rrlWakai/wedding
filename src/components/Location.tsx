import { ArrowUpRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LocationInfo } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionDivider from './SectionDivider';
import { scrollRevealMotion } from '../utils/motion';

interface LocationProps {
  location: LocationInfo;
}

export default function Location({ location }: LocationProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <ScrollReveal className="mb-14 text-center lg:hidden">
        <p className="section-eyebrow">The Location</p>
        <p className="section-script mt-3">{location.title}</p>
      </ScrollReveal>
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:items-center">
        <ScrollReveal delay={0.05}>
          <p className="section-eyebrow hidden lg:block">The Location</p>
          <p className="section-script mt-3 hidden lg:block">{location.title}</p>
          <h2 className="section-title mt-4 hidden lg:block">Where the evening unfolds</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#5c4a3d]">{location.description}</p>
          <div className="theme-card mt-8 p-6 sm:mt-10">
            <div className="flex items-center gap-4">
              <span className="theme-rounded flex h-12 w-12 shrink-0 items-center justify-center bg-[#f5d396]/25 text-[#6f4c2e]">
                <MapPin size={20} />
              </span>
              <div>
                <p className="text-base font-semibold text-[#3d2b1f]">{location.title}</p>
                <p className="text-sm text-[#5c4a3d]">{location.address}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5c4a3d]">
              Valet parking is available. A shuttle service will operate from local hotels starting one hour before
              the ceremony.
            </p>
          </div>
          <a
            href="#gallery"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.26em] text-[#6f4c2e] transition hover:text-[#3d2b1f]"
          >
            Discover the venue
            <ArrowUpRight size={16} />
          </a>
          <div className="mt-10 hidden lg:block">
            <SectionDivider />
          </div>
        </ScrollReveal>
        <motion.div
          {...scrollRevealMotion(0.12)}
          className="theme-rounded overflow-hidden border border-[#d9c5b2]/50 shadow-[0_24px_60px_-24px_rgba(111,76,46,0.28)]"
        >
          <iframe
            title="Wedding venue map"
            src={location.mapEmbedUrl}
            className="aspect-4/3 w-full border-0"
          />
        </motion.div>
      </div>
    </div>
  );
}
