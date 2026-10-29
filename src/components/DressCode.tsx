import { Fragment } from 'react';
import { UserRound } from 'lucide-react';
import type {
  EntourageSlide,
  EntourageSwatch,
  GuestAttireGroup,
} from '../types';

interface DressCodeProps {
  entourage: EntourageSlide[];
  guests: GuestAttireGroup[];
}

const ENTOURAGE_GROUPS: { title: null; note?: null; ids: string[] }[] = [
  {
    title: null,
    ids: ['parents', 'principal-sponsors', 'secondary-sponsors'],
  },
  {
    title: null,
    note: null,
    ids: ['maid-of-honor-best-man', 'bridesmaids-groomsmen', 'flower-girls-bearers'],
  },
];

const SLOT = 'w-full aspect-[3/4] rounded-xl overflow-hidden grid place-items-center';

const IMAGE_FADE = {
  WebkitMaskImage:
    'radial-gradient(ellipse 72% 72% at 50% 50%, #000 60%, transparent 100%)',
  maskImage:
    'radial-gradient(ellipse 72% 72% at 50% 50%, #000 60%, transparent 100%)',
};

function AttirePlaceholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={`Attire image coming soon: ${label}`}
      className={`${SLOT} bg-[#ece3d6]`}
      style={{ borderRadius: '0.75rem' }}
    >
      <UserRound className="h-14 w-14" color="#a68a64" aria-hidden="true" />
    </div>
  );
}

function AttireImage({ slide }: { slide: EntourageSlide }) {
  if (slide.pendingImage || !slide.image) {
    return <AttirePlaceholder label={slide.label} />;
  }

  return (
    <div className={`${SLOT} bg-transparent`}>
      <img
        src={slide.image}
        alt={slide.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="w-full h-full object-contain mix-blend-multiply"
        style={IMAGE_FADE}
      />
    </div>
  );
}

function attireRows(slide: EntourageSlide) {
  const rows: { label: string; text: string; swatch: EntourageSwatch }[] = [];
  const first = slide.swatches[0];
  const last = slide.swatches[slide.swatches.length - 1];

  if (slide.ladies) {
    rows.push({ label: 'Ladies', text: slide.ladies, swatch: first });
  }
  if (slide.lady) {
    rows.push({ label: 'Lady', text: slide.lady, swatch: first });
  }
  if (slide.gentlemen) {
    rows.push({ label: 'Gentlemen', text: slide.gentlemen, swatch: last });
  }
  if (slide.gentleman) {
    rows.push({ label: 'Gentleman', text: slide.gentleman, swatch: last });
  }

  return rows;
}

function EntourageCard({ slide }: { slide: EntourageSlide }) {
  return (
    <article className="flex flex-col p-4 pb-6">
      <AttireImage slide={slide} />

      <h4 className="font-display text-xl text-[#3d2b1f] text-center mt-5 mb-3.5 leading-snug">
        {slide.label}
      </h4>

      <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-3 mx-auto w-full max-w-[20rem] text-base leading-6 text-[#5c4a3d]">
        {attireRows(slide).map((row) => (
          <Fragment key={row.label}>
            <dt className="font-semibold text-[#3d2b1f]">{row.label}</dt>
            <dd className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="inline-block shrink-0 rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: row.swatch.color,
                  borderRadius: '9999px',
                }}
              />
              {row.text}
            </dd>
          </Fragment>
        ))}
      </dl>
    </article>
  );
}

function GuestCard({ group }: { group: GuestAttireGroup }) {
  const image = group.pendingImage ? null : group.image;

  return (
    <article className="p-4 pb-6">
      {image ? (
        <div className={`${SLOT} bg-transparent`}>
          <img
            src={image}
            alt={group.alt ?? `${group.heading} guest attire`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-full h-full object-contain mix-blend-multiply"
            style={IMAGE_FADE}
          />
        </div>
      ) : (
        <div
          role="img"
          aria-label={`Attire image coming soon: ${group.heading}`}
          className={`${SLOT} bg-[#ece3d6]`}
          style={{ borderRadius: '0.75rem' }}
        >
          <UserRound className="h-14 w-14" color="#a68a64" aria-hidden="true" />
        </div>
      )}

      <h3 className="font-display text-xl text-[#3d2b1f] text-left mt-4">
        {group.heading}
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {group.swatches.map((swatch) => (
          <div key={swatch.color} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block shrink-0 rounded-full"
              style={{
                width: 20,
                height: 20,
                backgroundColor: swatch.color,
                borderRadius: '9999px',
              }}
            />
            <span className="font-semibold text-[#3d2b1f] text-base">
              {swatch.label}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function DressCode({ entourage, guests }: DressCodeProps) {
  return (
    <section aria-labelledby="dress-code-heading">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="section-script">Entourage</p>
          <h2 id="dress-code-heading" className="section-title">
            Formal Attire
          </h2>
        </div>

        {ENTOURAGE_GROUPS.map((group, index) => {
          const slides = group.ids
            .map((id) => entourage.find((slide) => slide.id === id))
            .filter((slide): slide is EntourageSlide => Boolean(slide));

          return (
            <div
              key={group.title}
              className={index === 0 ? 'mt-12' : 'mt-14 lg:mt-16'}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 mb-8">
                <h3 className="font-display text-2xl text-[#3d2b1f]">
                  {group.title}
                </h3>
                {group.note && (
                  <p className="text-[#5c4a3d]">{group.note}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {slides.map((slide) => (
                  <EntourageCard key={slide.id} slide={slide} />
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-20 text-center">
          <p className="section-script">Guests</p>
          <h2 className="section-title">Semi-Formal Attire</h2>
        </div>

        <p className="mx-auto mt-5 max-w-xl text-center text-[#5c4a3d] leading-6">
          We would be delighted to see our guests dressed in formal/semi-formal
          attire inspired by our wedding palette.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {guests.map((group) => (
            <GuestCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
