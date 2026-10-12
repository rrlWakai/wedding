import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import {
  PRELOADER_GLYPHS,
  PRELOADER_TEXT,
  PRELOADER_VIEWBOX,
} from './preloaderNames';

interface PreloaderProps {
  names: string;
  imageToPreload: string;
  onDone?: () => void;
}

type Phase = 'writing' | 'lifting' | 'done';

const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const WRITE_START = 0.2;
const WRITE_END = 2.4;
const STROKE_DURATION = 0.4;
const MASK_STROKE = 140;

const HOLD_MS = 500;
const IMAGE_WAIT_CAP = 6000;
const LIFT_SECONDS = 1;

const STROKES = PRELOADER_GLYPHS.flatMap((glyph) => glyph.contours);
const FILL_PATH = STROKES.join(' ');

const WRITE_SPAN = Math.max(WRITE_END - STROKE_DURATION - WRITE_START, 0);
const STROKE_DELAYS = STROKES.map((_, index) =>
  STROKES.length > 1 ? WRITE_START + (index / (STROKES.length - 1)) * WRITE_SPAN : WRITE_START,
);

const overlayVariants: Variants = {
  writing: { y: '0%' },
  lifting: { y: '-100%', transition: { duration: LIFT_SECONDS, ease: CURTAIN_EASE } },
  done: { y: '-100%', transition: { duration: 0 } },
};

function isReduced(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Preloader({ names, imageToPreload, onDone }: PreloaderProps) {
  const prefersReduced = useReducedMotion();
  const [enabled] = useState<boolean>(
    () => typeof window !== 'undefined' && !isReduced(),
  );
  const show = enabled && !prefersReduced;

  const [phase, setPhase] = useState<Phase>('writing');
  const [written, setWritten] = useState(false);
  const [holdDone, setHoldDone] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const previousOverflow = useRef<string | null>(null);
  const previousRestoration = useRef<ScrollRestoration | null>(null);

  const rawId = useId();
  const maskId = `preloader-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  useEffect(() => {
    if (import.meta.env.DEV && names !== PRELOADER_TEXT) {
      console.warn(
        `[Preloader] Stroke artwork ("${PRELOADER_TEXT}") does not match the hero heading ("${names}"). Regenerate src/components/preloaderNames.ts.`,
      );
    }
  }, [names]);

  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(() => setWritten(true), WRITE_END * 1000);
    return () => window.clearTimeout(timer);
  }, [show]);

  useEffect(() => {
    if (!show || !written) return;
    const timer = window.setTimeout(() => setHoldDone(true), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [show, written]);

  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    const done = () => {
      if (!cancelled) setImageReady(true);
    };
    const img = new Image();
    img.onload = done;
    img.onerror = done;
    img.src = imageToPreload;
    if (typeof img.decode === 'function') {
      img.decode().then(done).catch(done);
    } else if (img.complete) {
      done();
    }
    const cap = window.setTimeout(done, IMAGE_WAIT_CAP);
    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [show, imageToPreload]);

  useEffect(() => {
    if (!show) return;
    previousOverflow.current = document.body.style.overflow;
    previousRestoration.current = window.history.scrollRestoration;
    document.body.style.overflow = 'hidden';
    try {
      window.history.scrollRestoration = 'manual';
    } catch {
      /* ignore */
    }
    return () => {
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current;
      }
      if (previousRestoration.current !== null) {
        try {
          window.history.scrollRestoration = previousRestoration.current;
        } catch {
          /* ignore */
        }
      }
    };
  }, [show]);

  useEffect(() => {
    if (!show || phase !== 'writing' || !holdDone || !imageReady) return;
    window.scrollTo(0, 0);
    setPhase('lifting');
  }, [show, phase, holdDone, imageReady]);

  if (!show) return null;

  const releaseBody = () => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
    }
    if (previousRestoration.current !== null) {
      try {
        window.history.scrollRestoration = previousRestoration.current;
      } catch {
        /* ignore */
      }
    }
  };

  const handleExited = () => {
    releaseBody();
    onDone?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExited}>
      {phase !== 'done' && (
        <motion.div
          key="preloader"
          className="preloader"
          variants={overlayVariants}
          initial="writing"
          animate={phase}
          exit="done"
          role="status"
          aria-live="polite"
          aria-hidden={phase !== 'writing'}
          onAnimationComplete={(definition) => {
            if (definition === 'lifting') setPhase('done');
          }}
        >
          <motion.div
            className="flex w-full items-center justify-center px-6"
            animate={{ opacity: phase === 'writing' ? 1 : 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span className="sr-only">Loading invitation</span>

            <svg
              className="block h-auto w-[88vw] max-w-[900px]"
              viewBox={`${PRELOADER_VIEWBOX.x} ${PRELOADER_VIEWBOX.y} ${PRELOADER_VIEWBOX.width} ${PRELOADER_VIEWBOX.height}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={names}
            >
              <defs>
                <mask
                  id={maskId}
                  maskUnits="userSpaceOnUse"
                  maskContentUnits="userSpaceOnUse"
                  x={PRELOADER_VIEWBOX.x}
                  y={PRELOADER_VIEWBOX.y}
                  width={PRELOADER_VIEWBOX.width}
                  height={PRELOADER_VIEWBOX.height}
                >
                  {STROKES.map((d, index) => (
                    <path
                      key={index}
                      className="preloader-stroke"
                      d={d}
                      pathLength={1}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={MASK_STROKE}
                      strokeLinejoin="round"
                      style={{ animationDelay: `${STROKE_DELAYS[index]}s` }}
                    />
                  ))}
                </mask>
              </defs>

              <path d={FILL_PATH} fill="#c5a059" mask={`url(#${maskId})`} />
            </svg>
          </motion.div>

          <svg
            className="absolute left-0 top-full h-[6vh] w-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 0 H100 V6 C 75 20, 25 20, 0 6 Z" fill="#f5f0eb" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
