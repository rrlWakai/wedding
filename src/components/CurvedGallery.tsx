import { useCallback, useEffect, useRef } from 'react';
import { inviteImages } from '../data/invite';
import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

const BASE_SPEED = 0.2; // Slides per second (~5s per photo)
const FRICTION = 2.4; // Velocity ease rate

function wrapRel(diff: number, count: number): number {
  const half = count / 2;
  return ((diff + half) % count + count) % count - half;
}

export default function CurvedGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const figRefs = useRef<(HTMLElement | null)[]>([]);

  const offsetRef = useRef(0);
  const velocityRef = useRef(BASE_SPEED);
  const targetOffsetRef = useRef<number | null>(null);

  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);

  const stageWidthRef = useRef(1000);
  const cardWidthRef = useRef(320);
  const stepXRef = useRef(200);

  const dragData = useRef({
    startX: 0,
    startY: 0,
    startOffset: 0,
    lastX: 0,
    lastTime: 0,
    pointerId: -1,
    isHorizontal: null as boolean | null,
    dragSamples: [] as { x: number; time: number }[],
  });

  const count = inviteImages.length;

  // Compute responsive layout parameters
  const updateLayout = useCallback(() => {
    if (!stageRef.current) return;
    const w = stageRef.current.clientWidth || window.innerWidth;
    stageWidthRef.current = w;

    const isMobile = w < 640;
    const isTablet = w >= 640 && w < 1024;

    const cw = isMobile
      ? Math.min(250, Math.max(210, w * 0.65))
      : isTablet
      ? 280
      : 330;

    const sx = isMobile
      ? cw * 0.52
      : isTablet
      ? cw * 0.58
      : cw * 0.64;

    cardWidthRef.current = cw;
    stepXRef.current = sx;
  }, []);

  // Update card elements directly for 60/120fps performance
  const renderCards = useCallback((currentOffset: number) => {
    const w = stageWidthRef.current;
    const cw = cardWidthRef.current;
    const sx = stepXRef.current;
    const isMobile = w < 640;
    const maxVisible = isMobile ? 1.7 : 2.7;

    for (let i = 0; i < count; i++) {
      const el = figRefs.current[i];
      if (!el) continue;

      const pos = wrapRel(i - currentOffset, count);
      const absPos = Math.abs(pos);

      if (absPos > maxVisible) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        continue;
      }

      el.style.visibility = 'visible';
      const x = pos * sx;
      const scale = Math.max(0.62, 1 - Math.min(absPos, 2.5) * 0.17);
      const rotateY = Math.max(-16, Math.min(16, -pos * 10));
      const opacity = absPos <= 0.25 ? 1 : Math.max(0.2, 1 - absPos * 0.36);
      const zIndex = Math.round(20 - Math.min(absPos, 5) * 4);
      const brightness = absPos <= 0.25 ? 1 : Math.max(0.82, 1 - absPos * 0.12);
      const isActive = absPos < 0.45;

      el.style.width = `${cw}px`;
      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, 0) scale(${scale.toFixed(3)}) rotateY(${rotateY.toFixed(1)}deg)`;
      el.style.zIndex = String(zIndex);
      el.style.opacity = opacity.toFixed(2);
      el.style.filter = `brightness(${brightness.toFixed(2)})`;
      el.style.pointerEvents = absPos <= 1.5 ? 'auto' : 'none';

      if (isActive) {
        if (!el.classList.contains('is-active')) el.classList.add('is-active');
        el.setAttribute('aria-hidden', 'false');
      } else {
        if (el.classList.contains('is-active')) el.classList.remove('is-active');
        el.setAttribute('aria-hidden', 'true');
      }
    }
  }, [count]);

  // Continuous animation loop
  useEffect(() => {
    updateLayout();
    renderCards(offsetRef.current);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseSpeed = reduceMotion ? 0 : BASE_SPEED;
    velocityRef.current = baseSpeed;

    let lastTime = performance.now();
    let isVisible = true;
    let isIntersecting = true;
    let rafId: number;

    const tick = (now: number) => {
      const dt = Math.min(0.06, (now - lastTime) / 1000);
      lastTime = now;

      if (!isInteractingRef.current) {
        if (targetOffsetRef.current !== null) {
          // Smooth glide toward clicked/keyboard target
          const diff = wrapRel(targetOffsetRef.current - offsetRef.current, count);
          if (Math.abs(diff) < 0.01) {
            offsetRef.current = targetOffsetRef.current;
            targetOffsetRef.current = null;
            velocityRef.current = baseSpeed;
          } else {
            offsetRef.current = (offsetRef.current + diff * Math.min(1, dt * 7) + count) % count;
          }
        } else {
          // Coast / ease velocity smoothly back to base speed
          velocityRef.current += (baseSpeed - velocityRef.current) * (1 - Math.exp(-dt * FRICTION));
          offsetRef.current = (offsetRef.current + velocityRef.current * dt + count) % count;
        }

        renderCards(offsetRef.current);
      }

      if (isVisible && isIntersecting) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && isIntersecting) start();
      else stop();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting && isVisible) start();
      else stop();
    });

    if (stageRef.current) {
      io.observe(stageRef.current);
    }

    const ro = new ResizeObserver(() => {
      updateLayout();
      renderCards(offsetRef.current);
    });

    if (stageRef.current) {
      ro.observe(stageRef.current);
    }

    start();

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      io.disconnect();
      ro.disconnect();
    };
  }, [count, updateLayout, renderCards]);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetOffsetRef.current = (Math.round(offsetRef.current) - 1 + count) % count;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetOffsetRef.current = (Math.round(offsetRef.current) + 1) % count;
      }
    },
    [count]
  );

  // Pointer / Touch gestures
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    isInteractingRef.current = true;
    isDraggingRef.current = false;
    targetOffsetRef.current = null;
    velocityRef.current = 0;

    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offsetRef.current,
      lastX: e.clientX,
      lastTime: performance.now(),
      pointerId: e.pointerId,
      isHorizontal: null,
      dragSamples: [{ x: e.clientX, time: performance.now() }],
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragData.current;
    if (d.pointerId !== e.pointerId || !isInteractingRef.current) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    // Detect direction intent
    if (d.isHorizontal === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        d.isHorizontal = Math.abs(dx) >= Math.abs(dy);
        if (d.isHorizontal) {
          isDraggingRef.current = true;
          const stage = stageRef.current;
          if (stage) {
            stage.classList.add('is-dragging');
            try {
              stage.setPointerCapture(e.pointerId);
            } catch {
              // fallback
            }
          }
        }
      }
    }

    if (d.isHorizontal) {
      const now = performance.now();
      d.dragSamples.push({ x: e.clientX, time: now });
      while (d.dragSamples.length > 5) d.dragSamples.shift();

      const sx = stepXRef.current;
      const offsetDelta = dx / sx;
      offsetRef.current = (d.startOffset - offsetDelta + count * 100) % count;
      renderCards(offsetRef.current);
    }
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    const d = dragData.current;
    if (d.pointerId !== e.pointerId && d.pointerId !== -1) return;

    const stage = stageRef.current;
    if (stage) {
      stage.classList.remove('is-dragging');
      if (stage.hasPointerCapture(e.pointerId)) {
        try {
          stage.releasePointerCapture(e.pointerId);
        } catch {
          // fallback
        }
      }
    }

    const wasHorizontal = d.isHorizontal;
    const samples = d.dragSamples;

    // Calculate release velocity in slides/second
    let flingVelocity = 0;
    if (wasHorizontal && samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = (last.time - first.time) / 1000;
      if (dt > 0.02) {
        const pxPerSec = (last.x - first.x) / dt;
        flingVelocity = -pxPerSec / stepXRef.current;
      }
    }

    d.pointerId = -1;
    d.isHorizontal = null;
    isDraggingRef.current = false;

    if (Math.abs(flingVelocity) > 0.4) {
      // Fling momentum coasting
      velocityRef.current = Math.max(-2.5, Math.min(2.5, flingVelocity));
      isInteractingRef.current = false;
    } else {
      // Gentle pause then smooth resume
      velocityRef.current = 0;
      pauseTimerRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
        pauseTimerRef.current = null;
      }, 700);
    }
  };

  // Card click to bring neighbor into center
  const handleCardClick = (i: number) => {
    if (isDraggingRef.current) return;
    const rel = wrapRel(i - offsetRef.current, count);
    if (Math.abs(rel) >= 0.3) {
      targetOffsetRef.current = (offsetRef.current + rel + count) % count;
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      isInteractingRef.current = false;
    }
  };

  return (
    <section id="invite" className="gal" aria-label="Photo gallery">
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
          <a className="gal-btn" href="#rsvp">
            RSVP Now
          </a>
        </ScrollReveal>
      </div>

      <div
        ref={stageRef}
        className="gal-stage"
        role="region"
        aria-label="Continuously looping photo gallery, swipe to explore"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onMouseEnter={() => {
          if (!isDraggingRef.current) {
            velocityRef.current *= 0.5; // gentle slow-down on hover
          }
        }}
        onMouseLeave={() => {
          if (!isDraggingRef.current) {
            velocityRef.current = BASE_SPEED;
          }
        }}
      >
        {inviteImages.map((img, i) => (
          <figure
            key={img.src}
            ref={(el) => {
              figRefs.current[i] = el;
            }}
            className="gal-card"
            onClick={() => handleCardClick(i)}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ objectPosition: img.position }}
              loading={i < 4 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
