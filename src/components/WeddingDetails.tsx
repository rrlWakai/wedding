import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useId, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { WeddingDetailsBlock } from '../types';
import ScrollReveal from './ScrollReveal';
import { smoothEase } from '../utils/motion';

interface WeddingDetailsProps {
  details: WeddingDetailsBlock;
}

export default function WeddingDetails({ details }: WeddingDetailsProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const faqs = details.faqs ?? [];

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const onAccordionKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button[aria-expanded]'),
    );
    if (buttons.length === 0) return;
    const focusedIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex =
      focusedIndex === -1
        ? direction === 1
          ? 0
          : buttons.length - 1
        : (focusedIndex + direction + buttons.length) % buttons.length;
    buttons[nextIndex]?.focus();
  };

  const rowTransition = {
    duration: reduceMotion ? 0 : 0.35,
    ease: smoothEase,
  };

  return (
    <div className="mx-auto max-w-[1080px] py-24 lg:py-32">
      <div className="grid gap-y-12 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-x-20 lg:gap-y-0">
        <div className="lg:sticky lg:top-28">
          <ScrollReveal>
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-[#5c564e]">
              <MessageCircle size={13} strokeWidth={1.5} className="text-[#8a7a4a]" />
              Questions
            </p>
            <h2 className="faq-serif mt-4 text-[clamp(3rem,12vw,4rem)] font-normal leading-[0.95] tracking-[-0.02em] text-[#1f2622] lg:text-[clamp(3.25rem,6.2vw,5.25rem)]">
              Good to
              <br />
              know
            </h2>
            <p className="mt-7 max-w-[24ch] text-[17px] leading-[1.6] text-[#7a746c] lg:text-[18px]">
              The practical things, answered before you have to ask.
            </p>
          </ScrollReveal>
        </div>

        <div onKeyDown={onAccordionKeyDown}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={faq.question} delay={index * 0.06} y={24}>
                <div className="border-b border-[#c9c1b5]">
                  <button
                    type="button"
                    id={`${baseId}-faq-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`${baseId}-panel-${index}`}
                    onClick={() => toggle(index)}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8a7a4a]"
                  >
                    <span className="faq-serif text-[clamp(1.375rem,2.2vw,2rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[#1f2622] transition-colors duration-200 group-hover:text-[#6f4c2e]">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-[#8a8070] transition-colors duration-200 group-hover:text-[#5c564e]"
                    >
                      <span
                        className="relative block h-5 w-5"
                        style={{
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                          transition: `transform ${reduceMotion ? 0 : 0.3}s ease-out`,
                        }}
                      >
                        <span className="absolute inset-0 m-auto h-px w-full bg-current" />
                        <span className="absolute inset-0 m-auto h-full w-px bg-current" />
                      </span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${baseId}-panel-${index}`}
                        role="region"
                        aria-labelledby={`${baseId}-faq-${index}`}
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={rowTransition}
                      >
                        <p className="max-w-[56ch] pb-7 pr-6 text-[15px] leading-[1.75] text-[#5c564e]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}