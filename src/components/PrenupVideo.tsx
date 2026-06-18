import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import type { PrenupVideoContent } from '../types';
import ScrollReveal from './ScrollReveal';
import { scrollRevealMotion } from '../utils/motion';

interface PrenupVideoProps {
  content: PrenupVideoContent;
}

export default function PrenupVideo({ content }: PrenupVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <motion.div
          {...scrollRevealMotion(0)}
          className="mx-auto w-full max-w-[min(100%,18rem)] sm:max-w-xs lg:max-w-none"
        >
          <div className="theme-rounded relative aspect-[9/16] overflow-hidden border border-[#d9c5b2]/70 bg-[#e8d3c0]/30 shadow-[0_32px_80px_-24px_rgba(111,76,46,0.35)]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={content.posterImage}
              playsInline
              controls={isPlaying}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={content.videoUrl} type="video/mp4" />
            </video>

            {!isPlaying && (
              <button
                type="button"
                onClick={handlePlay}
                className="theme-rounded absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 transition hover:bg-black/40"
                aria-label="Play pre-nup film"
              >
                <span className="theme-rounded flex h-14 w-14 items-center justify-center border border-white/40 bg-black/50 text-white shadow-lg sm:h-16 sm:w-16">
                  <Play size={24} className="ml-1" fill="currentColor" />
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/90 sm:text-xs">
                  Watch Our Film
                </span>
              </button>
            )}
          </div>
        </motion.div>

        <ScrollReveal delay={0.12} className="text-center lg:text-left">
          <p className="section-eyebrow">{content.eyebrow}</p>
          <p className="section-script mt-3">{content.scriptLine}</p>
          <h2 className="section-title mt-4">{content.title}</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-[#5c4a3d] sm:text-lg lg:mx-0">
            {content.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <span className="theme-pill bg-[#f5d396]/35 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#6f4c2e]">
              {content.tag}
            </span>
            <span className="text-sm text-[#8a735c]">{content.duration}</span>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
