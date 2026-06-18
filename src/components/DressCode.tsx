import { motion } from 'framer-motion';
import type { DressCodeCategory } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionDivider from './SectionDivider';
import { scrollRevealMotion } from '../utils/motion';
interface DressCodeProps {
  dressCode: DressCodeCategory[];
}

export default function DressCode({ dressCode }: DressCodeProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <ScrollReveal className="text-center lg:text-left">          <p className="section-eyebrow">Dress Code</p>
          <p className="section-script mt-3">Warm, Earthy, Elegant</p>
          <h2 className="section-title mt-4">A curated palette for the evening</h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#5c4a3d] lg:mx-0">
            Embrace textured neutrals, muted golds, and soft sunset tones that reflect the warmth of our coastal
            celebration.
          </p>
          <div className="mt-8 hidden lg:block">
            <SectionDivider />
          </div>
        </ScrollReveal>
        <div className="space-y-6">
          {dressCode.map((item, index) => (
            <motion.div
              key={item.id}
              {...scrollRevealMotion(index * 0.1)}
              className="theme-card p-6 sm:p-8"
            >              <h3 className="text-lg font-semibold text-[#3d2b1f]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5c4a3d]">{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {item.swatchClasses.map((swatchClass) => (
                  <span
                    key={swatchClass}
                    className={`theme-rounded h-12 w-12 border border-[#d9c5b2]/40 shadow-sm ${swatchClass}`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
