import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Music, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

const TRACK = {
  title: 'Can\'t Help Falling In Love',
  artist: 'Kina Grannis',
  cover: '/music/cover.jpg',
};

const AUDIO_SRC = '/music/wedding-song.mp3';
const VOLUME_STORAGE_KEY = 'wedding-music-volume';
const PAUSED_STORAGE_KEY = 'wedding-music-paused';

const DEFAULT_VOLUME = 0.6;
const START_DELAY_MS = 2000;
const FADE_IN_MS = 2000;
const FADE_OUT_MS = 600;
const COLLAPSE_DELAY_MS = 5000;
const ENTRANCE_DELAY_MS = 1500;

const clampVolume = (value: number): number => Math.min(1, Math.max(0, value));

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
};

const readStoredVolume = (): number => {
  try {
    const raw = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    if (raw === null) return DEFAULT_VOLUME;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? clampVolume(parsed) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
};

const readStoredPaused = (): boolean => {
  try {
    return window.localStorage.getItem(PAUSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const writeStoredPaused = (paused: boolean) => {
  try {
    window.localStorage.setItem(PAUSED_STORAGE_KEY, String(paused));
  } catch {
    /* storage can be unavailable; keep the in-memory value */
  }
};

interface BackgroundMusicProps {
  introComplete?: boolean;
}

interface VinylDiscProps {
  playing: boolean;
  reduceMotion: boolean;
  coverFailed: boolean;
  onCoverError: () => void;
  className?: string;
}

function VinylDisc({
  playing,
  reduceMotion,
  coverFailed,
  onCoverError,
  className = '',
}: VinylDiscProps) {
  const discStyle: CSSProperties = {
    borderRadius: '9999px',
    background:
      'repeating-radial-gradient(circle at center, rgba(245, 240, 235, 0.16) 0 0.75px, transparent 0.75px 6px)',
    animationName: reduceMotion ? 'none' : 'vinyl-spin',
    animationDuration: '6s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationPlayState: playing ? 'running' : 'paused',
    willChange: 'transform',
  };

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-[#2a1d14] shadow-[0_2px_7px_rgba(42,29,20,0.35)] ${className}`}
      style={{ borderRadius: '9999px' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full" style={discStyle}>
        <div
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#c5a059]"
          style={{ borderRadius: '9999px' }}
        >
          {coverFailed ? (
            <span className="flex h-full w-full items-center justify-center">
              <Music size={8} strokeWidth={2} className="text-[#6f4c2e]" />
            </span>
          ) : (
            <img
              src={TRACK.cover}
              alt=""
              className="h-full w-full object-cover"
              onError={onCoverError}
            />
          )}
        </div>
        <span
          className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5f0eb] shadow-[0_0_0_1px_rgba(42,29,20,0.45)]"
          style={{ borderRadius: '9999px' }}
        />
      </div>
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 26%, transparent 45%, transparent 68%, rgba(255,255,255,0.08) 100%)',
        }}
      />
    </div>
  );
}

export default function BackgroundMusic({ introComplete = true }: BackgroundMusicProps) {
  const [volume, setVolume] = useState<number>(() => readStoredVolume());
  const [initialPaused] = useState<boolean>(() => readStoredPaused());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volumeSupported, setVolumeSupported] = useState(true);
  const [coverFailed, setCoverFailed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volume);
  const volumeSupportedRef = useRef(true);
  const lastNonZeroVolumeRef = useRef(volume > 0 ? volume : DEFAULT_VOLUME);
  const pausedRef = useRef(initialPaused);
  const fadeFrameRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);
  const collapseTimerRef = useRef<number | null>(null);
  const wasPlayingBeforeHideRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const volumeGroupRef = useRef<HTMLDivElement | null>(null);
  const playButtonRef = useRef<HTMLButtonElement | null>(null);
  const armUnlockRef = useRef<(() => void) | null>(null);
  const pendingPlayFocusRef = useRef(false);
  const suppressToggleUntilRef = useRef(0);

  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    volumeRef.current = volume;
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    } catch {
      /* storage can be unavailable; keep the in-memory value */
    }
  }, [volume]);

  const cancelFade = () => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const fadeTo = (target: number, durationMs: number, onDone?: () => void) => {
    cancelFade();
    const audio = audioRef.current;
    if (!audio) {
      onDone?.();
      return;
    }

    const clampedTarget = clampVolume(target);
    if (durationMs <= 0) {
      audio.volume = clampedTarget;
      onDone?.();
      return;
    }

    const startVolume = audio.volume;
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      audio.volume = clampVolume(startVolume + (clampedTarget - startVolume) * progress);
      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(step);
      } else {
        audio.volume = clampedTarget;
        fadeFrameRef.current = null;
        onDone?.();
      }
    };

    fadeFrameRef.current = window.requestAnimationFrame(step);
  };

  const applyVolumeInstant = (value: number) => {
    cancelFade();
    const audio = audioRef.current;
    if (audio) audio.volume = clampVolume(value);
  };

  const startPlayback = (fadeIn: boolean, armOnFailure = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    const supported = volumeSupportedRef.current;
    const isMuted = volumeRef.current === 0;

    if (!supported) {
      audio.muted = isMuted;
    } else {
      audio.muted = false;
    }

    if (!audio.paused) {
      setIsPlaying(true);
      if (fadeIn) {
        cancelFade();
        if (supported) fadeTo(isMuted ? 0 : volumeRef.current, FADE_IN_MS);
      }
      return;
    }

    if (fadeIn && supported && !isMuted) {
      cancelFade();
      audio.volume = 0;
    } else if (supported) {
      applyVolumeInstant(isMuted ? 0 : volumeRef.current);
    }

    const handleFailure = () => {
      setIsPlaying(false);
      cancelFade();
      if (fadeIn && supported) audio.volume = volumeRef.current;
      if (armOnFailure) armUnlockRef.current?.();
    };

    try {
      const playPromise = audio.play();
      void playPromise
        .then(() => {
          if (pausedRef.current) {
            audio.pause();
            setIsPlaying(false);
            return;
          }
          setIsPlaying(true);
          if (!supported) return;
          if (volumeRef.current === 0) {
            applyVolumeInstant(0);
          } else if (fadeIn) {
            fadeTo(volumeRef.current, FADE_IN_MS);
          } else {
            applyVolumeInstant(volumeRef.current);
          }
        })
        .catch(handleFailure);
    } catch {
      handleFailure();
    }
  };

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const hasKeyboardFocus = () => {
    const container = containerRef.current;
    const active = document.activeElement;
    if (!container || !(active instanceof HTMLElement) || !container.contains(active)) return false;
    try {
      return active.matches(':focus-visible');
    } catch {
      return true;
    }
  };

  const scheduleCollapse = () => {
    clearCollapseTimer();
    collapseTimerRef.current = window.setTimeout(() => {
      collapseTimerRef.current = null;
      if (hasKeyboardFocus()) return;
      setIsExpanded(false);
      setIsVolumeOpen(false);
    }, COLLAPSE_DELAY_MS);
  };

  const expandPlayer = (focusPlayButton = false) => {
    setIsExpanded(true);
    scheduleCollapse();
    if (focusPlayButton) pendingPlayFocusRef.current = true;
  };

  const handleActivity = () => {
    if (!isExpanded) {
      expandPlayer();
      return;
    }
    scheduleCollapse();
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      if (performance.now() < suppressToggleUntilRef.current) return;
      pausedRef.current = true;
      writeStoredPaused(true);
      setIsPlaying(false);
      if (audio) {
        if (!volumeSupportedRef.current) {
          audio.pause();
        } else {
          fadeTo(0, FADE_OUT_MS, () => {
            if (pausedRef.current) audio.pause();
          });
        }
      }
      return;
    }

    pausedRef.current = false;
    writeStoredPaused(false);
    startPlayback(true);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    const supported = volumeSupportedRef.current;
    setIsVolumeOpen(true);
    scheduleCollapse();

    if (volumeRef.current === 0) {
      const restored =
        lastNonZeroVolumeRef.current > 0 ? lastNonZeroVolumeRef.current : DEFAULT_VOLUME;
      volumeRef.current = restored;
      setVolume(restored);

      if (!supported) {
        if (audio) audio.muted = false;
      } else if (audio) {
        audio.muted = false;
        if (!audio.paused) {
          fadeTo(restored, FADE_OUT_MS);
        } else {
          applyVolumeInstant(restored);
        }
      }
      return;
    }

    lastNonZeroVolumeRef.current = volumeRef.current;
    volumeRef.current = 0;
    setVolume(0);

    if (!supported) {
      if (audio) audio.muted = true;
    } else if (audio) {
      if (!audio.paused) {
        fadeTo(0, FADE_OUT_MS);
      } else {
        applyVolumeInstant(0);
      }
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = clampVolume(Number(event.currentTarget.value) / 100);
    const audio = audioRef.current;
    const supported = volumeSupportedRef.current;

    volumeRef.current = nextVolume;
    setVolume(nextVolume);
    scheduleCollapse();

    if (nextVolume > 0) {
      lastNonZeroVolumeRef.current = nextVolume;
    }

    if (!audio) return;

    if (!supported) {
      audio.muted = nextVolume === 0;
      return;
    }

    audio.muted = false;
    applyVolumeInstant(nextVolume);
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || duration <= 0) return;
    const nextTime = Math.min(Math.max(Number(event.currentTarget.value), 0), duration);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    scheduleCollapse();
  };

  useEffect(() => {
    if (!introComplete) return;
    const timer = window.setTimeout(() => setIsVisible(true), ENTRANCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [introComplete]);

  useEffect(() => {
    if (!isVisible || !isExpanded) return;
    scheduleCollapse();
    return () => clearCollapseTimer();
  }, [isVisible, isExpanded]);

  useEffect(() => {
    if (!isExpanded || !pendingPlayFocusRef.current) return;
    pendingPlayFocusRef.current = false;
    const timer = window.setTimeout(
      () => playButtonRef.current?.focus(),
      reduceMotion ? 0 : 260,
    );
    return () => window.clearTimeout(timer);
  }, [isExpanded, reduceMotion]);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.preload = 'auto';
    audio.loop = true;

    let supported = true;
    try {
      const probe = 0.17;
      audio.volume = probe;
      supported = Math.abs(audio.volume - probe) < 0.001;
    } catch {
      supported = false;
    }

    volumeSupportedRef.current = supported;
    setVolumeSupported(supported);

    if (supported) {
      audio.volume = clampVolume(volumeRef.current);
      audio.muted = false;
    } else {
      audio.muted = volumeRef.current === 0;
    }
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (!audio.paused) {
          wasPlayingBeforeHideRef.current = true;
          cancelFade();
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      if (wasPlayingBeforeHideRef.current) {
        wasPlayingBeforeHideRef.current = false;
        if (!pausedRef.current) startPlayback(true, true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function removeUnlockListeners() {
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
      window.removeEventListener('wheel', handleUnlock);
      window.removeEventListener('scroll', handleUnlock, true);
    }

    function handleUnlock() {
      removeUnlockListeners();
      if (pausedRef.current || !audio.paused) return;
      startPlayback(true, true);
    }

    function armUnlockListeners() {
      removeUnlockListeners();
      window.addEventListener('pointerdown', handleUnlock);
      window.addEventListener('touchstart', handleUnlock, { passive: true });
      window.addEventListener('keydown', handleUnlock);
      window.addEventListener('wheel', handleUnlock, { passive: true });
      window.addEventListener('scroll', handleUnlock, { passive: true, capture: true });
    }

    armUnlockRef.current = armUnlockListeners;

    if (pausedRef.current) {
      setIsPlaying(false);
    }

    return () => {
      removeUnlockListeners();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      armUnlockRef.current = null;
      cancelFade();
      if (startTimerRef.current !== null) {
        window.clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    if (pausedRef.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    let started = false;

    const clearStartTimer = () => {
      if (startTimerRef.current !== null) {
        window.clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
    };

    const removeEarlyListeners = () => {
      window.removeEventListener('pointerdown', handleEarlyInteraction);
      window.removeEventListener('touchstart', handleEarlyInteraction);
      window.removeEventListener('keydown', handleEarlyInteraction);
      window.removeEventListener('wheel', handleEarlyInteraction);
      window.removeEventListener('scroll', handleEarlyInteraction, true);
    };

    const startNow = () => {
      if (started) return;
      started = true;
      clearStartTimer();
      removeEarlyListeners();
      if (pausedRef.current) return;
      startPlayback(true, true);
    };

    function handleEarlyInteraction() {
      suppressToggleUntilRef.current = performance.now() + 500;
      startNow();
    }

    window.addEventListener('pointerdown', handleEarlyInteraction);
    window.addEventListener('touchstart', handleEarlyInteraction, { passive: true });
    window.addEventListener('keydown', handleEarlyInteraction);
    window.addEventListener('wheel', handleEarlyInteraction, { passive: true });
    window.addEventListener('scroll', handleEarlyInteraction, { passive: true, capture: true });

    startTimerRef.current = window.setTimeout(() => {
      startTimerRef.current = null;
      startNow();
    }, START_DELAY_MS);

    return () => {
      clearStartTimer();
      removeEarlyListeners();
    };
  }, [introComplete]);

  if (!isVisible) return null;

  const isMuted = volume === 0;
  const volumePercent = Math.round(volume * 100);
  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const VolumeIcon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const progressStyle = { '--music-progress': `${progressPercent}%` } as CSSProperties;
  const volumeStyle = { '--music-progress': `${volumePercent}%` } as CSSProperties;
  const ringRadius = 20;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progressPercent / 100);

  const handleContainerPointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' && !isExpanded) expandPlayer();
  };

  const handleVolumePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') {
      setIsVolumeOpen(true);
      scheduleCollapse();
    }
  };

  const handleVolumePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const group = volumeGroupRef.current;
    if (group && group.contains(document.activeElement)) return;
    setIsVolumeOpen(false);
  };

  const handleVolumeBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && volumeGroupRef.current?.contains(next)) return;
    setIsVolumeOpen(false);
  };

  const handleContainerBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && containerRef.current?.contains(next)) return;
    scheduleCollapse();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 z-40 mx-auto w-fit sm:inset-x-auto sm:left-5 sm:mx-0"
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
      onPointerEnter={handleContainerPointerEnter}
      onPointerMove={handleActivity}
      onPointerDown={handleActivity}
      onKeyDown={() => {
        if (isExpanded) scheduleCollapse();
      }}
      onFocusCapture={() => {
        if (isExpanded) scheduleCollapse();
      }}
      onBlurCapture={handleContainerBlur}
    >
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: 'easeOut' }}
      >
        {isPlaying && !isExpanded && !reduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c5a059]"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: [0.7, 0], scale: [1, 1.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}

        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? 280 : 44,
            height: isExpanded ? 76 : 44,
            borderRadius: isExpanded ? 16 : 9999,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
          style={{ maxWidth: '92vw' }}
          className={`relative overflow-hidden bg-[#f5f0eb]/90 shadow-[0_18px_45px_-18px_rgba(61,43,31,0.5)] backdrop-blur-md ${
            isExpanded ? 'border border-[#6f4c2e]/20' : 'border-0'
          }`}
        >
          <AnimatePresence initial={false} mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                className="relative h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
              >
                <div className="flex h-full items-center gap-2.5 px-3">
                  <VinylDisc
                    playing={isPlaying}
                    reduceMotion={reduceMotion}
                    coverFailed={coverFailed}
                    onCoverError={() => setCoverFailed(true)}
                    className="h-11 w-11"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-tight text-[#3d2b1f]">
                      {TRACK.title}
                    </p>
                    <p className="truncate text-[10px] leading-snug text-[#8a735c]">
                      {TRACK.artist}
                    </p>
                  </div>

                  <div
                    ref={volumeGroupRef}
                    className="flex shrink-0 items-center"
                    onPointerEnter={handleVolumePointerEnter}
                    onPointerLeave={handleVolumePointerLeave}
                    onBlur={handleVolumeBlur}
                  >
                    <button
                      type="button"
                      onClick={handleMuteToggle}
                      onFocus={() => setIsVolumeOpen(true)}
                      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                      aria-pressed={isMuted}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#6f4c2e] transition-colors hover:bg-[#6f4c2e]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-1 focus-visible:ring-offset-[#f5f0eb]"
                      style={{ borderRadius: '9999px' }}
                    >
                      <VolumeIcon size={16} strokeWidth={1.8} aria-hidden="true" />
                    </button>

                    <AnimatePresence initial={false}>
                      {volumeSupported && isVolumeOpen && (
                        <motion.div
                          key="volume-slider"
                          className="overflow-hidden"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 56, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                        >
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={volumePercent}
                            onChange={handleVolumeChange}
                            aria-label="Music volume"
                            aria-valuetext={`${volumePercent} percent`}
                            className="music-volume w-14"
                            style={volumeStyle}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                    <svg
                      className="pointer-events-none absolute -inset-1 h-11 w-11 -rotate-90"
                      viewBox="0 0 44 44"
                      aria-hidden="true"
                    >
                      <circle
                        cx="22"
                        cy="22"
                        r={ringRadius}
                        fill="none"
                        stroke="rgba(111,76,46,0.16)"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r={ringRadius}
                        fill="none"
                        stroke="#c5a059"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringOffset}
                        style={{
                          transition: reduceMotion ? 'none' : 'stroke-dashoffset 0.3s linear',
                        }}
                      />
                    </svg>

                    <motion.button
                      ref={playButtonRef}
                      type="button"
                      onClick={handlePlayPause}
                      aria-label={isPlaying ? 'Pause music' : 'Play music'}
                      aria-pressed={isPlaying}
                      whileHover={reduceMotion ? undefined : { scale: 1.07 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[#6f4c2e] bg-transparent text-[#6f4c2e] transition-colors duration-200 hover:bg-[#6f4c2e] hover:text-[#f5f0eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0eb]"
                      style={{ borderRadius: '9999px' }}
                    >
                      {isPlaying ? (
                        <Pause size={16} fill="currentColor" aria-hidden="true" />
                      ) : (
                        <Play size={16} fill="currentColor" aria-hidden="true" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 1}
                  step={1}
                  value={duration > 0 ? Math.min(currentTime, duration) : 0}
                  onChange={handleSeek}
                  disabled={duration <= 0}
                  aria-label="Song progress"
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  className="music-progress absolute inset-x-0 bottom-0 z-10"
                  style={progressStyle}
                />
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                type="button"
                onClick={(event) => expandPlayer(event.detail === 0)}
                aria-label="Expand music player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
                className="h-full w-full overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c5a059]"
              >
                <VinylDisc
                  playing={isPlaying}
                  reduceMotion={reduceMotion}
                  coverFailed={coverFailed}
                  onCoverError={() => setCoverFailed(true)}
                  className="h-full w-full"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
