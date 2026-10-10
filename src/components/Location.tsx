import { ArrowUpRight } from 'lucide-react';
import type { LocationInfo } from '../types';
import ScrollReveal from './ScrollReveal';

interface LocationProps {
  location: LocationInfo;
}

const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBI2LMgqK_q8R6GZ9ZUVSvdOvGoednU62qPvLQIEU4EbSMa3bAZPQzgFbmcQ2ao-wpv6gNNWs2pJPfL6CliF-yulk-I_aNXc2aR-jJoiIlAs81k_j5A6ORzSsamVtnFkfK_JLIsxT0jNpgJ6OzT4u0P7D43F7Vthsj6y-sf1EOl48nyigmSswjeKTikIngsyVU8TtS9nCJxIqhorFRA2fbzUxyBxjFsXJ5ksQqe2KJC9l214dNwxB9zGo1fx6uHPn55d_iaU5toTAk';

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
          <ScrollReveal>
            <p className="text-[12px] text-[#b7b1a8]">The Venue</p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h2 className="mt-4 text-[2rem] font-normal leading-[1.15] sm:text-[2.25rem] lg:text-[2.75rem]">
              <span className="block text-[#f5f0eb]">We&apos;ll see you at</span>
              <span className="block text-[#c9a96a]">{location.title}</span>
            </h2>
          </ScrollReveal>

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
