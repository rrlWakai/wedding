import { ArrowUpRight } from 'lucide-react';
import type { LocationInfo } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

interface LocationProps {
  locations: LocationInfo[];
}

const FALLBACK_IMAGE = '/loc.jpg';

function LocationBlock({ location, reverse }: { location: LocationInfo; reverse: boolean }) {
  const image = location.image ?? FALLBACK_IMAGE;
  const facts = (location.facts ?? []).slice(0, 4);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;

  return (
    <div className="grid w-full lg:grid-cols-2">
      <ScrollReveal
        y={0}
        className={`relative min-h-[280px] overflow-hidden sm:min-h-[380px] lg:min-h-[560px] ${
          reverse ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <img
          src={image}
          alt={`${location.title} exterior`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </ScrollReveal>

      <div
        className={`loc-panel flex items-center bg-[#EAE2D6] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 xl:px-20 ${
          reverse ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        <div className="w-full max-w-[560px]">
          <SectionHeading
            className="loc-heading"
            eyebrow={location.eyebrow ?? 'The Venue'}
            script={location.script}
            title={
              <>
                <span className="block text-[0.42em] font-normal tracking-[0.06em] text-[#7a5a40]">
                  We&apos;ll see you at
                </span>
                <span className="mt-2 block break-words">{location.title}</span>
              </>
            }
            dividerClassName="w-[clamp(7rem,44vw,13rem)]"
          />

          <ScrollReveal delay={0.16}>
            <p className="mt-6 max-w-[46ch] text-[13.5px] leading-[1.75] text-[#5c4a3d] lg:text-[14px]">
              {location.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.24} className="mt-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-10">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-[#6f4c2e]">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 break-words text-[14px] font-semibold text-[#3d2b1f]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          <ScrollReveal delay={0.32} className="mt-8">
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="loc-btn inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#f5f0eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4c2e] min-[480px]:w-auto"
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

export default function Location({ locations }: LocationProps) {
  return (
    <div className="divide-y divide-[#c9b39d]">
      {locations.map((location, index) => (
        <LocationBlock key={location.heading} location={location} reverse={index % 2 === 1} />
      ))}
    </div>
  );
}
