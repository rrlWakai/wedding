import { ArrowUpRight } from 'lucide-react';
import type { LocationInfo } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

interface LocationProps {
  location: LocationInfo;
}

const FALLBACK_IMAGE =
  '/loc.jpg';

export default function Location({ location }: LocationProps) {
  const image = location.image ?? FALLBACK_IMAGE;
  const facts = (location.facts ?? []).slice(0, 4);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;

  return (
    <div className="grid w-full lg:grid-cols-[45fr_55fr]">
      <ScrollReveal className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[560px]" y={0}>
        <img
          src={image}
          alt={`${location.title} exterior`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </ScrollReveal>

      <div className="flex items-center bg-[#12110f] px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16 xl:px-20">
        <div className="w-full max-w-[560px]">
          <SectionHeading
            tone="light"
            eyebrow="The Venue"
            script="Join us by the sea"
            title={
              <>
                <span className="block">We&apos;ll see you at</span>
                <span className="block text-[#c9a96a]">{location.title}</span>
              </>
            }
            dividerClassName="w-[clamp(11.25rem,62vw,20rem)]"
          />

          <ScrollReveal delay={0.16}>
            <p className="mt-6 max-w-[34ch] text-[13px] leading-[1.7] text-[#a8a29a] lg:text-[14px]">
              We look forward to welcoming you at {location.title} for a memorable experience.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.24} className="mt-10">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-12">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[11px] text-[#8a847c] lg:text-[12px]">{fact.label}:</dt>
                  <dd className="mt-1 text-[14px] font-semibold text-[#f5f0eb]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          <ScrollReveal delay={0.32} className="mt-10">
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="loc-btn inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-semibold text-[#f5f0eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a059] min-[480px]:w-auto"
            >
              Find on the Map
              <ArrowUpRight size={15} />
            </a>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
