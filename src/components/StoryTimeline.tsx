import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimelineEvent } from '../types';
import SectionHeading from './SectionHeading';

export default function StoryTimeline({ events }: { events: TimelineEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const walkerRef = useRef<SVGCircleElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lenRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(() => {
    const section = sectionRef.current,
      draw = drawRef.current,
      walker = walkerRef.current,
      endEl = endRef.current;
    if (!section || !draw || !walker || !lenRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const r = section.getBoundingClientRect();
    const viewportOffset = window.innerHeight * 0.58;
    const introBottom = introRef.current
      ? introRef.current.getBoundingClientRect().bottom - r.top
      : 0;
    const startY = introBottom - 20;
    const knots = section.querySelectorAll<HTMLElement>('[data-knot]');
    const lastKnot = knots[knots.length - 1];
    const lastKnotBox = lastKnot?.getBoundingClientRect();
    const endY = lastKnotBox
      ? lastKnotBox.top + lastKnotBox.height / 2 - r.top
      : endEl
        ? endEl.getBoundingClientRect().top - r.top - 16
        : Math.max(startY + 200, section.offsetHeight - window.innerHeight * 0.25);
    const travel = Math.max(1, endY - startY);
    const current = window.scrollY + viewportOffset;
    const sectionStart = window.scrollY + r.top + startY;
    const rawP = Math.min(1, Math.max(0, (current - sectionStart) / travel));
    const p = reduce ? 1 : rawP;
    draw.style.strokeDashoffset = String(lenRef.current * (1 - p));
    const pt = draw.getPointAtLength(lenRef.current * p);
    walker.setAttribute('cx', String(pt.x));
    walker.setAttribute('cy', String(pt.y));
    walker.style.opacity = p > 0 ? '1' : '0';

    // Active milestone: the last knot the moving indicator has passed
    const activePt = draw.getPointAtLength(lenRef.current * rawP);
    let idx = 0;
    Array.from(section.querySelectorAll<HTMLElement>('.tl-chap')).forEach((el, i) => {
      const knot = el.querySelector<HTMLElement>('[data-knot]');
      const box = (knot ?? el).getBoundingClientRect();
      const nodeY = box.top - r.top + box.height / 2;
      if (activePt.y >= nodeY) idx = i;
    });
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  }, []);

  const build = useCallback(() => {
    const section = sectionRef.current,
      svg = svgRef.current,
      base = baseRef.current,
      draw = drawRef.current,
      intro = introRef.current;
    if (!section || !svg || !base || !draw || !intro) return;
    const r = section.getBoundingClientRect();
    const W = r.width,
      H = section.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = `${H}px`;
    const ib = intro.getBoundingClientRect();
    const pts = [{ x: Math.max(30, ib.left - r.left + 12), y: ib.bottom - r.top - 10 }];
    section.querySelectorAll<HTMLElement>('[data-knot]').forEach((k) => {
      const b = k.getBoundingClientRect();
      pts.push({ x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top });
    });
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1],
        b = pts[i],
        dy = b.y - a.y,
        swing = (i % 2 ? 1 : -1) * W * 0.07;
      d += ` C${a.x + swing} ${a.y + dy * 0.55} ${b.x - swing} ${b.y - dy * 0.45} ${b.x} ${b.y}`;
    }
    base.setAttribute('d', d);
    draw.setAttribute('d', d);
    lenRef.current = draw.getTotalLength();
    draw.style.strokeDasharray = String(lenRef.current);
    update();
  }, [update]);

  useEffect(() => {
    build();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    window.addEventListener('load', build);
    document.fonts?.ready.then(build);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
      window.removeEventListener('load', build);
    };
  }, [build, update]);

  return (
    <section ref={sectionRef} className="tl">
      <svg ref={svgRef} className="tl-trail" aria-hidden="true">
        <path ref={baseRef} className="tl-base" />
        <path ref={drawRef} className="tl-draw" />
        <circle ref={walkerRef} className="tl-walker" r="6" cx="-20" cy="-20" />
      </svg>

      <div ref={introRef} className="tl-intro">
        <SectionHeading
          eyebrow="Our Story"
          script="The journey to our day"
          title="The Beginning of Us"
          dividerClassName="w-[clamp(11.25rem,62vw,20rem)]"
        />
      </div>

      {events.map((ev, i) => {
        const variant = i === 0 ? 'v0' : i === 1 ? 'v1' : i === 2 ? 'v2' : i === 3 ? 'v1' : 'v2';
        return (
          <article
            key={i}
            className={`tl-chap tl-${variant} ${activeIndex === i ? 'is-active' : ''}`}
          >
            <figure className="tl-print">
              <span className="tl-knot" data-knot />
              <img src={ev.image} alt={ev.title} onLoad={build} loading={i > 1 ? 'lazy' : 'eager'} />
              {ev.caption && <figcaption>{ev.caption}</figcaption>}
            </figure>
            <div className="tl-words">
              <span className="tl-script tl-date">{ev.date}</span>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
            </div>
            {ev.aside && <p className="tl-aside" aria-hidden="true">{ev.aside}</p>}
          </article>
        );
      })}
      <div ref={endRef} className="tl-end" aria-hidden="true" />
    </section>
  );
}
