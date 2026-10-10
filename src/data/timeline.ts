
import type { TimelineEvent } from '../types';

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'timeline-1',
    date: 'Summer 2018',
    title: 'How We Met',
    description:
      "A chance meeting at a coastal bookstore in Malibu turned into a five-hour conversation over espresso and the smell of old paper. We discovered a shared love for warm light, quiet beaches, and slow afternoons.",
    image:
      '/StorySection/Story1.jpg',
      caption: 'a bookstore in Malibu',
  },
  {
    id: 'timeline-2',
    date: '2019 - 2024',
    title: 'Our Journey',
    description:
      'From cross-country road trips to quiet weekends in the garden, we built a life centered around peace, creativity, and the simple joy of each other’s company. Every day felt like a chapter in a coastal story.',
    image:
      '/StorySection/story2.jpg',
      caption: 'barefoot, as usual',
      aside: 'always the long way home',
  },
  {
    id: 'timeline-3',
    date: 'October 2025',
    title: 'The Proposal',
    description:
      'Under a canopy of stars on the same beach where our first date began, Jerico asked the question that changed everything. Quiet, perfect, and intimate—just our kind of forever.',
    image: '/StorySection/story3.jpg',
      caption: 'yes, a thousand times',
  },
];
