import { motion } from 'framer-motion';
import type { GalleryImage } from '../types';
import SectionHeading from './SectionHeading';
import { scrollRevealMotion } from '../utils/motion';
interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Our Memories"
        script="Quiet moments along the hills"
        title="Captured in golden light"
        className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 lg:mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
        {images.map((image, index) => (
          <motion.figure
            key={image.id}
            {...scrollRevealMotion(index * 0.06)}
            whileHover={{ y: -6 }}
            className={`theme-card overflow-hidden p-4 pb-5 ${image.rotateClass}`}
          >            <div className="theme-rounded overflow-hidden bg-[#e8d3c0]/35">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-4/5 w-full object-cover transition duration-500 hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-4 text-center text-xs uppercase tracking-[0.32em] text-[#8a735c]">
              {image.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
