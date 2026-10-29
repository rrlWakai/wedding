import { useCallback, useEffect, useRef, useState } from 'react';
import { inviteImages } from '../data/invite';
import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

const SWIPE_THRESHOLD = 36;
const VELOCITY_THRESHOLD = 0.28;

export default function CurvedGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [stageWidth, setStageWidth] = useState(1000);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    isDragging: false,
    isHorizontal: null as boolean | null,
    pointerId: -1,
  });

  const count = inviteImages.length;

  // Responsive stage measurement
  useEffect(() => {
    const updateWidth = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + count) % count);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % count);
      }
    },
    [count]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      isDragging: true,
      isHorizontal: null,
      pointerId: e.pointerId,
    };

    stage.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragInfo.current;
    if (!d.isDragging || e.pointerId !== d.pointerId) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    // Determine gesture orientation early
    if (d.isHorizontal === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        d.isHorizontal = Math.abs(dx) >= Math.abs(dy);
        if (d.isHorizontal) {
          setIsDragging(true);
        }
      }
    }

    if (d.isHorizontal) {
      const now = performance.now();
      const dt = Math.max(1, now - d.lastTime);
      d.velocity = (e.clientX - d.lastX) / dt;
      d.lastX = e.clientX;
      d.lastTime = now;
      setDragOffset(dx);
    }
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    const d = dragInfo.current;
    if (!d.isDragging || e.pointerId !== d.pointerId) return;

    const stage = stageRef.current;
    if (stage && stage.hasPointerCapture(e.pointerId)) {
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture release fallback
      }
    }

    const dx = e.clientX - d.startX;
    const wasHorizontal = d.isHorizontal;
    const velocity = d.velocity;

    d.isDragging = false;
    d.isHorizontal = null;
    d.pointerId = -1;
    setIsDragging(false);
    setDragOffset(0);

    if (wasHorizontal) {
      const shouldAdvanceNext = dx < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD;
      const shouldAdvancePrev = dx > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

      if (shouldAdvanceNext) {
        setActiveIndex((prev) => (prev + 1) % count);
      } else if (shouldAdvancePrev) {
        setActiveIndex((prev) => (prev - 1 + count) % count);
      }
    }
  };

  // Click on a visible card to bring it into focus
  const handleCardClick = (targetRel: number) => {
    if (isDragging || Math.abs(dragOffset) > 6) return;
    if (targetRel !== 0) {
      setActiveIndex((prev) => (prev + targetRel + count) % count);
    }
  };

  // Card dimensions & spacing calculation
  const isMobile = stageWidth < 640;
  const isTablet = stageWidth >= 640 && stageWidth < 1024;

  const cardWidth = isMobile
    ? Math.min(250, Math.max(210, stageWidth * 0.65))
    : isTablet
    ? 280
    : 330;

  const stepX = isMobile
    ? cardWidth * 0.52
    : isTablet
    ? cardWidth * 0.58
    : cardWidth * 0.64;

  const dragFraction = isDragging && cardWidth > 0 ? dragOffset / cardWidth : 0;

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
        className={`gal-stage ${isDragging ? 'is-dragging' : ''}`}
        role="region"
        aria-label="Layered photo gallery, swipe left or right"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {inviteImages.map((img, i) => {
          let rel = i - activeIndex;
          if (rel > count / 2) rel -= count;
          if (rel < -count / 2) rel += count;

          // Continuous relative position with real-time drag
          const pos = rel - dragFraction;
          const absPos = Math.abs(pos);

          // Render only within visible depth range
          const maxVisible = isMobile ? 1.6 : 2.6;
          if (absPos > maxVisible) {
            return null;
          }

          // Visual transformation: depth, scale, perspective, opacity
          const x = pos * stepX;
          const scale = Math.max(0.62, 1 - Math.min(absPos, 2) * 0.17);
          const rotateY = Math.max(-16, Math.min(16, -pos * 10));
          const opacity = absPos <= 0.2 ? 1 : Math.max(0.25, 1 - absPos * 0.38);
          const zIndex = Math.round(10 - absPos * 3);
          const brightness = absPos <= 0.2 ? 1 : Math.max(0.82, 1 - absPos * 0.12);
          const isCenter = Math.abs(rel) === 0;

          return (
            <figure
              key={img.src}
              className={`gal-card ${isCenter ? 'is-active' : ''}`}
              style={{
                width: `${cardWidth}px`,
                transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, 0) scale(${scale.toFixed(3)}) rotateY(${rotateY.toFixed(1)}deg)`,
                zIndex,
                opacity: opacity.toFixed(2),
                filter: `brightness(${brightness.toFixed(2)})`,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.42s ease, filter 0.42s ease',
                cursor: isCenter ? 'grab' : 'pointer',
              }}
              onClick={() => handleCardClick(rel)}
              aria-hidden={!isCenter}
            >
              <img
                src={img.src}
                alt={isCenter ? img.alt : ''}
                style={{ objectPosition: img.position }}
                loading={absPos <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
