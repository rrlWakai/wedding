import { useEffect, useMemo, useRef, useState } from 'react';
import { inviteImages } from '../data/invite';
import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

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

// ─────────────────────────────────────────────────────────────────────────────
// Speed & feel constants.
// ─────────────────────────────────────────────────────────────────────────────

/** 1/s — how fast velocity returns to the base drift after a flick/release. */
const VELOCITY_EASE = 2.2;

/** Pointer-to-offset ratio; try 1.1 if the row feels like it lags the finger. */
const DRAG_GAIN = 1.0;

/** Max flick speed in stage-widths per second. */
const FLICK_MAX_FRAC = 1.2;

/** Desktop layout (stage width ≥ 760px). */
const DESKTOP = { spacing: 0.22, item: 0.21, tilt: 18 };

/** Mobile layout (stage width < 760px). */
const MOBILE = { spacing: 0.36, item: 0.34, tilt: 16 };

/**
 * Two counter-drifting ribbons. direction +1 = photos drift LEFT (offset
 * grows), −1 = photos drift RIGHT (offset shrinks). speed is a fraction of
 * stage width per second — 0.022 ≈ one photo pitch (~0.22·W) every 10s on
 * desktop; setting speed to 0 freezes a row's auto drift while keeping drag.
 */
const ROWS = [
  { id: 'a', direction: +1, speed: 0.022, imageShift: 0, reverse: false, startOffsetSlots: 0 },
  { id: 'b', direction: -1, speed: 0.016, imageShift: 4, reverse: false, startOffsetSlots: 0.5 },
] as const;

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
// Per-row mutable state (refs only — never setState per frame)
// ─────────────────────────────────────────────────────────────────────────────

interface RowState {
  offset: number;          // px along the ribbon, grows/shrinks freely
  velocity: number;        // px/s of offset (signed)
  dragging: boolean;
  pointerId: number;
  dragStartX: number;
  dragStartOffset: number;
  samples: { x: number; t: number }[]; // ring buffer for release velocity
  spacing: number;         // px between slot centres
  itemW: number;           // px photo width
  span: number;            // px half-span for the u profile
  depth: number;           // px centre recess
  tilt: number;            // deg at |u| = 1
  pxPerSec: number;        // signed base drift, px/s (auto, not during drag)
  stageW: number;          // px stage/viewport width
  initOffset: boolean;     // apply startOffsetSlots*spacing once
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CurvedGallery() {
  const sectionRef   = useRef<HTMLElement>(null);
  const viewportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const figRefs      = useRef<(HTMLElement | null)[][]>([[], []]);
  const warnedRef    = useRef(false);
  const warnedSrcsRef = useRef<Set<string>>(new Set());

  const rowStates = useRef<RowState[]>(
    ROWS.map(() => ({
      offset: 0,
      velocity: 0,
      dragging: false,
      pointerId: -1,
      dragStartX: 0,
      dragStartOffset: 0,
      samples: [],
      spacing: 0,
      itemW: 0,
      span: 0,
      depth: 0,
      tilt: 0,
      pxPerSec: 0,
      stageW: 0,
      initOffset: true,
    })),
  );

  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set<string>());

  const images = useMemo(
    () => inviteImages.filter((img) => Boolean(img?.src) && !failed.has(img.src)),
    [failed],
  );
  const ready = images.length > 0;
  const slotCount = Math.max(MIN_SLOTS, images.length);

  /** Per-row image order: base list, reversed per ROWS.reverse, then rotated. */
  const orderedRows = useMemo(
    () =>
      ROWS.map((row) => {
        let base = images;
        if (row.reverse) base = [...base].reverse();
        return Array.from(
          { length: base.length },
          (_, i) => base[(i + row.imageShift) % base.length],
        );
      }),
    [images],
  );

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

  // ── Motion loop + drag wiring ────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let onScreen = true;
    let last = 0;
    let raf = 0;

    // ─────────────────────────────────────────────────────────────────────
    // applyRowFrame — identical per-row world-space math to the original
    // single ribbon. Slot centres are laid out linearly in world x and never
    // back-projected: the browser's perspective shrinks each photo and the
    // gap beside it by the same factor, so gaps stay even.
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
    const applyRowFrame = (i: number) => {
      const rs = rowStates.current[i];
      const spacing = rs.spacing;
      const span = rs.span;
      const depth = rs.depth;
      const tiltMax = rs.tilt;
      if (!spacing || !span) return;

      const period = slotCount * spacing;
      const centreIndex = (slotCount - 1) / 2;
      const offset = rs.offset;
      const figs = figRefs.current[i];

      for (let s = 0; s < slotCount; s++) {
        const figure = figs[s];
        if (!figure) continue;

        const slotX = (s - centreIndex) * spacing;
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
    // applyLayout — sizes and re-perspectives BOTH rows from a shared stage
    // width (each viewport gets its own perspective element so the top row
    // is not tilted by a shared origin).
    // ─────────────────────────────────────────────────────────────────────
    const applyLayout = () => {
      const probe = stageRefs.current[0];
      if (!probe) return;
      const w = probe.clientWidth;
      if (!w) return;
      const cfg = w < 760 ? MOBILE : DESKTOP;

      const spacing = w * cfg.spacing;
      const itemW   = w * cfg.item;
      const span    = w * HALF_SPAN_FRAC;
      const depth   = w * DEPTH_FRAC;
      const tilt    = cfg.tilt;

      for (let i = 0; i < ROWS.length; i++) {
        const rs = rowStates.current[i];
        const row = ROWS[i];

        rs.spacing  = spacing;
        rs.itemW    = itemW;
        rs.span     = span;
        rs.depth    = depth;
        rs.tilt     = tilt;
        rs.stageW   = w;
        rs.pxPerSec = row.direction * row.speed * w;

        if (rs.initOffset) {
          rs.offset = row.startOffsetSlots * spacing;
          rs.initOffset = false;
        }

        const vp = viewportRefs.current[i];
        if (vp) vp.style.perspective = `${w * PERSPECTIVE_FRAC}px`;

        const stage = stageRefs.current[i];
        if (stage) stage.style.height = `${itemW * (4 / 3)}px`;

        const figs = figRefs.current[i];
        for (let s = 0; s < slotCount; s++) {
          const f = figs[s];
          if (f) f.style.width = `${itemW}px`;
        }

        applyRowFrame(i);
      }
    };

    const baseFor = (i: number) => (reduce ? 0 : rowStates.current[i].pxPerSec);

    // Reduced motion: the loop only lives long enough to ease flicks to 0.
    const driftStopped = () =>
      reduce && !rowStates.current.some((r) => r.dragging || Math.abs(r.velocity) >= 1);

    const tick = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      for (let i = 0; i < ROWS.length; i++) {
        const rs = rowStates.current[i];
        if (!rs.dragging) {
          const base = baseFor(i);
          rs.velocity += (base - rs.velocity) * (1 - Math.exp(-dt * VELOCITY_EASE));
          rs.offset += rs.velocity * dt;
        }
        applyRowFrame(i);
      }

      if (driftStopped()) {
        raf = 0;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    // ─── Pointer / keyboard handlers (per row) ────────────────────────────
    const downs = ROWS.map((_, i) => (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const rs = rowStates.current[i];
      const vp = viewportRefs.current[i];
      if (!vp) return;
      rs.dragging = true;
      rs.pointerId = e.pointerId;
      rs.dragStartX = e.clientX;
      rs.dragStartOffset = rs.offset;
      rs.samples.length = 0;
      rs.samples.push({ x: e.clientX, t: performance.now() });
      vp.setPointerCapture(e.pointerId);
      vp.classList.add('is-dragging');
    });

    const moves = ROWS.map((_, i) => (e: PointerEvent) => {
      const rs = rowStates.current[i];
      if (!rs.dragging || e.pointerId !== rs.pointerId) return;
      rs.offset = rs.dragStartOffset - (e.clientX - rs.dragStartX) * DRAG_GAIN;
      const now = performance.now();
      rs.samples.push({ x: e.clientX, t: now });
      while (rs.samples.length > 6) rs.samples.shift();
      while (rs.samples.length && rs.samples[0].t < now - 100) rs.samples.shift();
      applyRowFrame(i);
    });

    const releases = ROWS.map((_, i) => () => {
      const rs = rowStates.current[i];
      if (!rs.dragging) return;
      rs.dragging = false;
      rs.pointerId = -1;
      const vp = viewportRefs.current[i];
      if (vp) vp.classList.remove('is-dragging');

      const s = rs.samples;
      let velocity = 0;
      if (s.length >= 2) {
        const a = s[0];
        const b = s[s.length - 1];
        const dt = b.t - a.t;
        if (dt >= 16) velocity = -((b.x - a.x) / dt) * 1000 * DRAG_GAIN;
      }
      rs.samples.length = 0;

      const maxV = FLICK_MAX_FRAC * rs.stageW;
      if (maxV > 0) velocity = clamp(velocity, -maxV, maxV);
      rs.velocity = velocity;
      if (reduce) start();
    });

    const preventDrag = (e: Event) => e.preventDefault();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const rs = rowStates.current[0];
      rs.velocity += (e.key === 'ArrowRight' ? 1 : -1) * rs.spacing * 3;
      if (reduce) start();
    };

    ROWS.forEach((_, i) => {
      const vp = viewportRefs.current[i];
      if (!vp) return;
      vp.addEventListener('pointerdown', downs[i]);
      vp.addEventListener('pointermove', moves[i]);
      vp.addEventListener('pointerup', releases[i]);
      vp.addEventListener('pointercancel', releases[i]);
      vp.addEventListener('lostpointercapture', releases[i]);
      vp.addEventListener('dragstart', preventDrag);
    });
    const aStage = stageRefs.current[0];
    if (aStage) aStage.addEventListener('keydown', onKey);

    applyLayout();

    const ro = new ResizeObserver(applyLayout);
    const probeStage = stageRefs.current[0];
    if (probeStage) ro.observe(probeStage);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start(); else stop();
    });
    if (sectionRef.current) io.observe(sectionRef.current);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduce) start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      ROWS.forEach((_, i) => {
        const vp = viewportRefs.current[i];
        if (!vp) return;
        vp.removeEventListener('pointerdown', downs[i]);
        vp.removeEventListener('pointermove', moves[i]);
        vp.removeEventListener('pointerup', releases[i]);
        vp.removeEventListener('pointercancel', releases[i]);
        vp.removeEventListener('lostpointercapture', releases[i]);
        vp.removeEventListener('dragstart', preventDrag);
      });
      if (aStage) aStage.removeEventListener('keydown', onKey);
    };
  }, [ready, slotCount, images]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="invite"
      className={`gal${inView ? ' is-in' : ''}`}
      aria-label="Photo gallery"
    >
      <div className="gal-head">
        <SectionHeading
          eyebrow="Our Moments"
          script="A story told in light"
          title="Moments We&rsquo;ll Treasure Forever"
          className="mx-auto"
        />
        <ScrollReveal delay={0.24} y={16}>
          <p className="gal-lead">
            We&rsquo;re getting married! Join us this December. Explore our story, the venue, dress
            code, and RSVP details to celebrate our special day together.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.32} y={16}>
          <a className="gal-btn" href="#rsvp">RSVP Now</a>
        </ScrollReveal>
      </div>

      {ready &&
        ROWS.map((row, ri) => {
          const list = orderedRows[ri];
          return (
            <div
              key={row.id}
              className="gal-viewport"
              ref={(el) => { viewportRefs.current[ri] = el; }}
              aria-hidden={ri === 1 ? true : undefined}
            >
              <div
                className="gal-stage"
                ref={(el) => { stageRefs.current[ri] = el; }}
                role={ri === 0 ? 'group' : undefined}
                aria-label={ri === 0 ? 'Photos of Jerico and Glenda' : undefined}
                tabIndex={ri === 0 ? 0 : undefined}
              >
                {Array.from({ length: slotCount }, (_, i) => {
                  const img  = list[i % list.length];
                  const dupe = i >= list.length;
                  return (
                    <figure
                      key={`${img.src}-${i}`}
                      ref={(el) => { figRefs.current[ri][i] = el; }}
                      aria-hidden={ri === 0 && dupe ? true : undefined}
                    >
                      <img
                        src={img.src}
                        alt={ri === 1 || dupe ? '' : img.alt}
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
          );
        })}
    </section>
  );
}