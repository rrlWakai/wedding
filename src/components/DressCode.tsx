import { UserRound } from 'lucide-react';
import type { EntourageSlide, GuestAttireGroup } from '../types';

interface DressCodeProps {
  entourage: EntourageSlide[];
  guests: GuestAttireGroup[];
}

const PLACEHOLDER_IMAGE =
  'w-full max-w-[180px] aspect-[4/5] rounded-lg border border-[#d9c5b2]/60';
const PLACEHOLDER_BG = 'bg-[#F1E5CE] overflow-hidden';
const PLACEHOLDER_LAYOUT = 'flex flex-col items-center justify-center';

function AttirePlaceholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={[PLACEHOLDER_IMAGE, PLACEHOLDER_BG, PLACEHOLDER_LAYOUT].join(
        ' ',
      )}
    >
      <UserRound className="w-10 h-10 text-[#8a735c]" aria-hidden="true" />
      <p
        className={[
          'absolute bottom-2 left-2 right-2 p-3',
          'text-xs text-center text-[#5c4a3d]/80 leading-5',
        ].join(' ')}
      >
        Attire image coming soon
      </p>
    </div>
  );
}

const SLIDE_IMAGE_WRAP =
  'w-full max-w-[200px] aspect-[4/5] rounded-lg border border-[#d9c5b2]/40';
const SLIDE_IMAGE_BG = 'overflow-hidden bg-[#F1E5CE]/20';

/**
 * Outfit image for an entourage category. Keeps the original aspect ratio
 * (object-contain, never cropped) inside a shared image container.
 */
function SlideImage({ slide }: { slide: EntourageSlide }) {
  if (slide.pendingImage || !slide.image) {
    return <AttirePlaceholder label={`Attire image coming soon — ${slide.label}`} />;
  }

  return (
    <div className={[SLIDE_IMAGE_WRAP, SLIDE_IMAGE_BG].join(' ')}>
      <img
        src={slide.image}
        alt={slide.alt}
        draggable={false}
        decoding="async"
        className="w-full h-full object-contain block"
        loading="lazy"
      />
    </div>
  );
}

export default function DressCode({ entourage, guests }: DressCodeProps) {
  return (
    <section aria-labelledby="dress-code-heading" className="py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        {/* ---- Entourage attire grid ---- */}
        <div className="text-center lg:text-left">
          <p className="section-eyebrow">Dress Code</p>
          <p className="section-script">The Entourage</p>
          <h2 className="section-title">Wedding Party Attire</h2>
        </div>

        <div
          className="grid w-full gap-5 lg:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {entourage.map((slide) => (
            <div
              key={slide.id}
              className="flex w-full flex-col items-center gap-3 lg:gap-4"
            >
              <SlideImage slide={slide} />

              <h3
                id={`dress-code-${slide.id}`}
                className="font-display text-[#3d2b1f] text-base sm:text-lg leading-6 tracking-tight"
              >
                {slide.label}
              </h3>

              <dl className="space-y-1 text-[#5c4a3d] text-sm leading-5">
                {slide.ladies && (
                  <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">
                    <dt className="font-semibold text-[#3d2b1f]">Ladies:</dt>
                    <dd className="text-right sm:text-left">{slide.ladies}</dd>
                  </div>
                )}
                {slide.gentlemen && (
                  <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">
                    <dt className="font-semibold text-[#3d2b1f]">Gentlemen:</dt>
                    <dd className="text-right sm:text-left">{slide.gentlemen}</dd>
                  </div>
                )}
                {slide.lady && (
                  <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">
                    <dt className="font-semibold text-[#3d2b1f]">Lady:</dt>
                    <dd className="text-right sm:text-left">{slide.lady}</dd>
                  </div>
                )}
                {slide.gentleman && (
                  <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">
                    <dt className="font-semibold text-[#3d2b1f]">Gentleman:</dt>
                    <dd className="text-right sm:text-left">{slide.gentleman}</dd>
                  </div>
                )}
              </dl>

              <div className="flex items-center justify-center gap-2">
                {slide.swatches.map((swatch) => (
                  <span
                    key={swatch.label}
                    aria-hidden="true"
                    title={swatch.label}
                    className="h-6 w-6 rounded-full border border-[#d4c3b9]/70 shrink-0"
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ---- Guest attire section ---- */}
        <div className="mt-12 lg:mt-16 text-center">
          <p className="section-eyebrow">Dress Code</p>
          <p className="section-script">Guests</p>
          <h2 className="section-title">Semi-Formal Attire</h2>
        </div>

        <p
          className={[
            'mx-auto mt-4 sm:mt-5 max-w-xl text-center text-[#5c4a3d] leading-6',
            'lg:mt-5 lg:text-left lg:mx-0',
          ].join(' ')}
        >
          We would be delighted to see our guests dressed in formal/semi-formal
          attire inspired by our wedding palette.
        </p>

        <div className="mt-8 lg:mt-10 grid w-full gap-5 lg:gap-9 lg:grid-cols-2 lg:items-start">
          {guests.map((group) => (
            <div
              key={group.id}
              className="flex w-full flex-col items-center gap-3 lg:gap-4 max-w-[300px] sm:max-w-[340px]"
            >
              <GuestPlaceholder
                label={`Attire image coming soon — ${group.heading} attire`}
              />

              <div className={[
                'flex w-full max-w-[220px] gap-0 rounded-lg border border-[#d9c5b2]/40',
                'bg-[#F1E5CE]/20',
              ].join(' ')}>
                {group.swatches.map((swatch) => (
                  <div
                    key={swatch.color}
                    aria-hidden="true"
                    className="flex-1 h-8 shrink-0"
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}
              </div>

              <p className="font-display text-[#3d2b1f] text-sm leading-5 text-center">
                {group.paletteLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/**
 * Guest attire placeholder. Mirrors the entourage image container's
 * proportions and treatment so the sections feel like one cohesive design.
 */
function GuestPlaceholder({ label }: { label: string }) {
  return <AttirePlaceholder label={label} />;
}

