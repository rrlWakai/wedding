import { useCallback, useEffect, useRef } from 'react';
import type { TimelineEvent } from '../types';

export default function StoryTimeline({ events }: { events: TimelineEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const walkerRef = useRef<SVGCircleElement>(null);
  const lenRef = useRef(0);

  const update = useCallback(() => {
    const section = sectionRef.current,
      draw = drawRef.current,
      walker = walkerRef.current;
    if (!section || !draw || !walker || !lenRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const r = section.getBoundingClientRect();
    const p = reduce
      ? 1
      : Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / section.offsetHeight));
    draw.style.strokeDashoffset = String(lenRef.current * (1 - p));
    const pt = draw.getPointAtLength(lenRef.current * p);
    walker.setAttribute('cx', String(pt.x));
    walker.setAttribute('cy', String(pt.y));
    walker.style.opacity = reduce ? '0' : p > 0 ? '1' : '0';
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
    const pts = [{ x: Math.max(30, ib.left - r.left + 12), y: ib.bottom - r.top - 8 }];
    section.querySelectorAll<HTMLElement>('[data-knot]').forEach((k) => {
      const b = k.getBoundingClientRect();
      pts.push({ x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top });
    });
    pts.push({ x: W * 0.5, y: H });
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
    <section id="story" ref={sectionRef} className="tl">
      <svg ref={svgRef} className="tl-trail" aria-hidden="true">
        <path ref={baseRef} className="tl-base" />
        <path ref={drawRef} className="tl-draw" />
        <circle ref={walkerRef} className="tl-walker" r="6" cx="-20" cy="-20" />
      </svg>

      <div ref={introRef} className="tl-intro">
        <span className="tl-script">The journey to our day</span>
        <h2>Every chapter led us here</h2>
      </div>

      {events.map((ev, i) => (
        <article key={i} className={`tl-chap tl-v${i % 3}`}>
          <span className="tl-year" aria-hidden="true">
            {ev.date.match(/\d{4}/g)?.slice(-1)[0] ?? ev.date}
          </span>
          <figure className="tl-print">
            <span className="tl-knot" data-knot />
            <img src={ev.image} alt={ev.title} onLoad={build} />
            {ev.caption && <figcaption>{ev.caption}</figcaption>}
          </figure>
          <div className="tl-words">
            <span className="tl-script tl-date">{ev.date}</span>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
          </div>
          {ev.aside && <p className="tl-aside" aria-hidden="true">{ev.aside}</p>}
        </article>
      ))}
    </section>
  );
}
