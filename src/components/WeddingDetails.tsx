import { motion } from 'framer-motion';
import { Calendar, Clock, Heart, Users } from 'lucide-react';
import type { WeddingDetail } from '../types';
import ScrollReveal from './ScrollReveal';
import SectionDivider from './SectionDivider';
import { scrollRevealMotion } from '../utils/motion';
const detailIcons = {
  Calendar: Calendar,
  Clock: Clock,
  Heart: Heart,
  Users: Users,
} as const;

interface WeddingDetailsProps {
  details: WeddingDetail[];
}

export default function WeddingDetails({ details }: WeddingDetailsProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <ScrollReveal className="mb-16 text-center">
        <p className="section-eyebrow">Wedding Details</p>
        <p className="section-script mt-3">We can&apos;t wait to celebrate with you</p>
        <h2 className="section-title mt-4">An evening by the sea</h2>
        <div className="mt-8">
          <SectionDivider />
        </div>
      </ScrollReveal>      <div className="grid gap-8 lg:grid-cols-2">
        {details.map((detail, index) => {
          const Icon = detailIcons[detail.icon];
          return (
            <motion.article
              key={detail.id}
              {...scrollRevealMotion(index * 0.1)}
              className="theme-card p-6 sm:p-8"
            >              <div className="flex items-start gap-5">
                <span className="theme-rounded flex h-14 w-14 shrink-0 items-center justify-center bg-[#f5d396]/25 text-[#6f4c2e]">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8a735c]">{detail.title}</p>
                  <p className="mt-3 text-2xl font-[Playfair_Display] font-semibold text-[#3d2b1f]">
                    {detail.subtitle}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#6f4c2e]">
                    {detail.time} · {detail.location}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#5c4a3d]">{detail.note}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
