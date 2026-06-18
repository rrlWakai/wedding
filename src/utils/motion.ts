export const smoothEase = [0.22, 1, 0.36, 1] as const;

export const heroEase = [0.16, 1, 0.3, 1] as const;

export const scrollRevealViewport = {
  once: true,
  amount: 0.18,
  margin: '-48px 0px -48px 0px',
} as const;

export const scrollRevealTransition = (delay = 0) => ({
  duration: 0.9,
  delay,
  ease: smoothEase,
});

export const scrollRevealMotion = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: scrollRevealViewport,
  transition: scrollRevealTransition(delay),
});
