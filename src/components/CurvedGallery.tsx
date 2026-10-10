import { useEffect, useMemo, useRef, useState } from 'react';
import { inviteImages } from '../data/invite';

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants. Everything that must track the stage width is a fraction.
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum number of rendered slots (one full ribbon period). */
const MIN_SLOTS = 9;

/** Perspective distance = 0.75 × stage width. */
const PERSPECTIVE_FRAC = 0.75;

/** Centre recess = 0.075 × stage width (z = -D·(1 − u²)). */
const DEPTH_FRAC = 0.075;

/** u = t / (0.55 × stage width). */
const HALF_SPAN_FRAC = 0.55;

/** Drift speed = 0.022 × stage width per second (no clamp). 0.22 / 0.022 = 10s. */
const SPEED_FRAC = 0.022;

/** Desktop layout (stage width ≥ 760px). */
const DESKTOP = { spacing: 0.22, item: 0.21, tilt: 18 };

/** Mobile layout (stage width < 760px). */
const MOBILE = { spacing: 0.36, item: 0.34, tilt: 16 };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Seamless modulo wrap that maps any value into [-halfPeriod, +halfPeriod).
 * Because the ribbon period is many screen-widths long, the wrap seam is
 * always off-screen, so the offset can grow forever with no visible jump.
 */
function wrapCenter(v: number, period: number): number {
  const half = period / 2;
  return ((v + half) % period + period) % period - half;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CurvedGallery() {
  const sectionRef  = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const figRefs     = useRef<(HTMLElement | null)[]>([]);
  const warnedRef   = useRef(false);
  const warnedSrcsRef = useRef<Set<string>>(new Set());

  // Per-frame values live in refs — no per-frame setState.
  const offsetRef   = useRef(0);   // px, grows forever (monotonic drift)
  const spacingRef  = useRef(0);   // px between slot centres
  const spanRef     = useRef(0);   // px half-span for the u profile
  const itemWRef    = useRef(0);   // px photo width
  const depthRef    = useRef(0);   // px centre recess
  const tiltRef     = useRef(0);   // deg at |u| = 1
  const pxPerSecRef = useRef(0);   // px/sec drift

  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set<string>());

  const images = useMemo(
    () => inviteImages.filter((img) => Boolean(img?.src) && !failed.has(img.src)),
    [failed],
  );
  const ready = images.length > 0;
  const slotCount = Math.max(MIN_SLOTS, images.length);

  // ── Warn once if the dataset collapsed to a single image ─────────────────
  useEffect(() => {
    if (images.length !== 1 || warnedRef.current) return;
    warnedRef.current = true;
    console.warn('CurvedGallery: only one valid image in inviteImages');
  }, [images.length]);

  // ── Entrance animation ───────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Main loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let last     = 0;
    let raf      = 0;
    let onScreen = true;

    // ─────────────────────────────────────────────────────────────────────
    // applyFrame
    //
    // World-space ribbon. Slot centres are laid out linearly in world x and
    // never back-projected: the browser's perspective shrinks each photo and
    // the gap beside it by the same factor, so gaps stay even.
    //
    //   period      = slotCount * spacing
    //   centreIndex = (slotCount - 1) / 2
    //   t           = wrapCenter((i - centreIndex)*spacing - offset, period)
    //   u           = clamp(t / span, -1, 1)
    //   z           = -depth * (1 - u*u)          centre farthest, edges at 0
    //   tilt        = -tiltMax * u                decoupled from depth
    //
    // Tilt sign: CSS positive rotateY pushes a photo's right edge away from the
    // viewer. A photo on the right (u > 0) must rotate negative so its outer
    // (right) edge comes forward and its inner edge stays back; the left side
    // mirrors this. Hence tilt = -tiltMax * u.
    // ─────────────────────────────────────────────────────────────────────
    const applyFrame = () => {
      const spacing = spacingRef.current;
      const span    = spanRef.current;
      const depth   = depthRef.current;
      const tiltMax = tiltRef.current;
      if (!spacing || !span) return;

      const period = slotCount * spacing;
      const centreIndex = (slotCount - 1) / 2;
      const offset = offsetRef.current;

      for (let i = 0; i < slotCount; i++) {
        const figure = figRefs.current[i];
        if (!figure) continue;

        const slotX = (i - centreIndex) * spacing;
        const t     = wrapCenter(slotX - offset, period);
        const u     = clamp(t / span, -1, 1);
        const z     = -depth * (1 - u * u);
        const tilt  = -tiltMax * u;

        figure.style.transform =
          `translate3d(calc(-50% + ${t.toFixed(2)}px), -50%, ${z.toFixed(2)}px) ` +
          `rotateY(${tilt.toFixed(3)}deg)`;
      }
    };

    // ─────────────────────────────────────────────────────────────────────
    // applyLayout — recalculates every metric from the stage width and writes
    // the perspective on the viewport element (it is not set in CSS).
    // ─────────────────────────────────────────────────────────────────────
    const applyLayout = () => {
      const w = stage.clientWidth;
      const cfg = w < 760 ? MOBILE : DESKTOP;

      spacingRef.current  = w * cfg.spacing;
      itemWRef.current    = w * cfg.item;
      spanRef.current     = w * HALF_SPAN_FRAC;
      depthRef.current    = w * DEPTH_FRAC;
      tiltRef.current     = cfg.tilt;
      pxPerSecRef.current = w * SPEED_FRAC;

      const viewport = viewportRef.current;
      if (viewport) viewport.style.perspective = `${w * PERSPECTIVE_FRAC}px`;

      const itemW = itemWRef.current;
      stage.style.height = `${itemW * (4 / 3)}px`;

      for (let i = 0; i < slotCount; i++) {
        const fig = figRefs.current[i];
        if (fig) fig.style.width = `${itemW}px`;
      }

      applyFrame();
    };

    // ─────────────────────────────────────────────────────────────────────
    // rAF tick — one steady, linear leftward drift.
    // ─────────────────────────────────────────────────────────────────────
    const tick = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      offsetRef.current += pxPerSecRef.current * dt;
      applyFrame();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce || raf || !onScreen || document.hidden) return;
      last = 0;
      raf  = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    applyLayout();

    const ro = new ResizeObserver(applyLayout);
    ro.observe(stage);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start(); else stop();
    });
    io.observe(sectionRef.current as HTMLElement);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduce) start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ready, slotCount]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="invite"
      className={`gal${inView ? ' is-in' : ''}`}
      aria-label="Photo gallery"
    >
      <div className="gal-head">
        <p className="gal-eyebrow">Our Moments</p>
        <svg className="gal-orn" viewBox="0 0 220 20" aria-hidden="true" focusable="false">
          <line className="gal-orn-line" x1="0"   y1="10" x2="82"  y2="10" />
          <line className="gal-orn-line" x1="138" y1="10" x2="220" y2="10" />
          <path className="gal-orn-diamond" d="M110 2.5 117.5 10 110 17.5 102.5 10Z" />
          <circle className="gal-orn-core" cx="110" cy="10" r="2.3" />
        </svg>
        <h2 className="gal-script">Moments we&rsquo;ll treasure forever</h2>
        <p className="gal-lead">
          We&rsquo;re getting married! Join us this December. Explore our story, the venue, dress
          code, and RSVP details to celebrate our special day together.
        </p>
        <a className="gal-btn" href="#rsvp">RSVP Now</a>
      </div>

      {ready && (
        <div className="gal-viewport" ref={viewportRef}>
          <div
            className="gal-stage"
            ref={stageRef}
            role="group"
            aria-label="Photos of Jerico and Glenda"
          >
            {Array.from({ length: slotCount }, (_, i) => {
              const img  = images[i % images.length];
              const dupe = i >= images.length;
              return (
                <figure
                  key={`${img.src}-${i}`}
                  ref={(el) => { figRefs.current[i] = el; }}
                  aria-hidden={dupe ? true : undefined}
                >
                  <img
                    src={img.src}
                    alt={dupe ? '' : img.alt}
                    style={{ objectPosition: img.position }}
                    loading={i < 5 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    onError={() => {
                      if (!warnedSrcsRef.current.has(img.src)) {
                        warnedSrcsRef.current.add(img.src);
                        console.warn(`CurvedGallery: failed to load image "${img.src}"`);
                      }
                      setFailed((prev) => {
                        const next = new Set(prev);
                        next.add(img.src);
                        return next;
                      });
                    }}
                  />
                </figure>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
