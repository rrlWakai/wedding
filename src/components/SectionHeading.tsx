import type { ReactNode } from 'react';
import ScrollReveal from './ScrollReveal';
import SectionDivider from './SectionDivider';

interface SectionHeadingProps {
  /** Small uppercase, letter-spaced label shown first. */
  eyebrow: string;
  /** Optional calligraphic subtitle in muted gold. */
  script?: string;
  /** Prominent serif heading. Accepts nodes for multi-line / two-tone titles. */
  title: ReactNode;
  /** Semantic heading level. */
  as?: 'h2' | 'h3';
  /** Render the thin-line + gold-dot divider motif. */
  divider?: boolean;
  /** `light` swaps eyebrow/title colors for use on dark backgrounds. */
  tone?: 'default' | 'light';
  /** Extra classes on the wrapper (text alignment, bottom gap, max width). */
  className?: string;
  /** Classes on the divider wrapper (e.g. left vs centered alignment). */
  dividerClassName?: string;
}

export default function SectionHeading({
  eyebrow,
  script,
  title,
  as: Heading = 'h2',
  divider = true,
  tone = 'default',
  className = '',
  dividerClassName = 'mx-auto w-[clamp(11.25rem,62vw,20rem)]',
}: SectionHeadingProps) {
  return (
    <div className={`sh${tone === 'light' ? ' sh-light' : ''}${className ? ` ${className}` : ''}`}>
      <ScrollReveal y={12} className="sh-eyebrow-row">
        <p className="section-eyebrow">{eyebrow}</p>
      </ScrollReveal>

      {script && (
        <ScrollReveal y={12} delay={0.06} className="sh-script-row">
          <p className="section-script">{script}</p>
        </ScrollReveal>
      )}

      <ScrollReveal y={12} delay={script ? 0.12 : 0.06} className="sh-title-row">
        <Heading className="section-title">{title}</Heading>
      </ScrollReveal>

      {divider && (
        <ScrollReveal y={12} delay={script ? 0.18 : 0.12} className="sh-divider-row">
          <SectionDivider className={dividerClassName} />
        </ScrollReveal>
      )}
    </div>
  );
}
