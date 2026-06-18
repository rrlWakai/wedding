import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { scrollRevealMotion, scrollRevealTransition, scrollRevealViewport, smoothEase } from '../utils/motion';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

export default function ScrollReveal({ children, delay = 0, y = 32, className, ...props }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={scrollRevealViewport}
      transition={{ ...scrollRevealTransition(delay), ease: smoothEase }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { scrollRevealMotion };
