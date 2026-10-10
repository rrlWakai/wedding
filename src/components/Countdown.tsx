import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { scrollRevealMotion, smoothEase } from '../utils/motion';
interface CountdownProps {
  targetDate: string;
  backgroundImage: string;
}

interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function createCountdown(target: Date): CountdownTime {
  const now = new Date();
  const distance = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

const countdownEntries = [
  { label: 'Days', key: 'days' as const },
  { label: 'Hours', key: 'hours' as const },
  { label: 'Minutes', key: 'minutes' as const },
  { label: 'Seconds', key: 'seconds' as const },
];

export default function Countdown({ targetDate, backgroundImage }: CountdownProps) {
  const [countdown, setCountdown] = useState<CountdownTime>(() => createCountdown(new Date(targetDate)));

  useEffect(() => {
    const target = new Date(targetDate);
    const id = window.setInterval(() => {
      setCountdown(createCountdown(target));
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetDate]);

  return (
    <section
      id="countdown"
      className="relative flex min-h-[100svh] items-end justify-center overflow-hidden text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,211,150,0.14)_0%,transparent_58%)]" />

      <div className="relative w-full max-w-6xl px-5 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28 lg:px-20 lg:pb-24 lg:pt-32">
        <ScrollReveal className="text-center">
          <p className="section-eyebrow text-[#e8d3c0]/80">The Countdown to Forever</p>
          <p className="section-script mt-3 text-[#f5d396]">December 2, 2026</p>
         
          <div className="theme-rounded mx-auto mt-10 max-w-4xl border border-white/15 bg-black/30 p-5 backdrop-blur-md sm:mt-14 sm:p-8 lg:p-10">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-0">              {countdownEntries.map((entry, index) => (
                <div key={entry.key} className="relative flex flex-col items-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -left-3 top-1/2 hidden -translate-y-1/2 font-[Playfair_Display] text-3xl text-[#f5d396]/45 sm:block"
                    >
                      :
                    </span>
                  )}
                  <div className="flex min-w-[5.5rem] flex-col items-center px-2 sm:min-w-[6.5rem]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={countdown[entry.key]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: smoothEase }}
                        className="font-[Playfair_Display] text-[clamp(2.5rem,8vw,4.5rem)] font-semibold leading-none tracking-tight text-white"
                      >
                        {countdown[entry.key]}
                      </motion.span>
                    </AnimatePresence>
                    <span className="mt-3 text-[0.65rem] uppercase tracking-[0.38em] text-[#e8d3c0]/80">
                      {entry.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>      
      </div>
    </section>
  );
}
