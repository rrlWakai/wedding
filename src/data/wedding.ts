import type { WeddingInfo } from '../types';
import heroImage from '../../Hero.jpg';
import { galleryImages } from './gallery';
import { timelineEvents } from './timeline';

export const weddingInfo: WeddingInfo = {
  navigation: [
    { id: 'story', label: 'Our Story', icon: 'Heart' },
    { id: 'gallery', label: 'Gallery', icon: 'Camera' },
    { id: 'rsvp', label: 'RSVP', icon: 'Mail' },
  ],
  hero: {
    heading: 'Jerico & Glenda',
    subheading: 'Together with our families, we invite you to celebrate our wedding by the sea.',
    date: 'December 2, 2026',
    description: 'An elegant coastal celebration with warm earth tones, sunlit memories, and glassmorphic details.',
    ctaLabel: 'View Invitation',
    slides: [
      {
        id: 'hero-1',
        image: heroImage,
        alt: 'Jerico & Glenda — a coastal wedding celebration',
      },
    ],
  },
  countdownDate: '2026-12-02T00:00:00',
  timeline: timelineEvents,
  dressCode: [
    {
      id: 'code-1',
      title: 'Wedding Party',
      description:
        'Members of the wedding party are invited to wear warm gold, sand, and tan tones for a harmonious coastal palette.',
      swatchClasses: ['bg-[#C5A059]', 'bg-[#E5AA70]', 'bg-[#B38B6D]'],
    },
    {
      id: 'code-2',
      title: 'Guest Attire',
      description:
        'Please choose soft neutrals, beach florals, and gentle textures to complement the sunset ceremony.',
      swatchClasses: ['bg-[#F5D396]', 'bg-[#E8D3C0]', 'bg-[#F4B183]', 'bg-[#D9C5B2]', 'bg-[#F5F0EB]'],
    },
    {
      id: 'code-3',
      title: 'Colors to Avoid',
      description: 'Pure white, black for ladies, and neon tones are best left off the beach palette.',
      swatchClasses: ['bg-[#FFFFFF]', 'bg-[#000000]', 'bg-[#ff00ff]'],
    },
  ],
  locations: [
    {
      eyebrow: 'The Ceremony',
      script: 'Where we exchange our vows',
      heading: 'The Church',
      title: 'San Augustin Foursquare Gospel Church',
      address: 'Poblacion, San Augustin, Romblon, Philippines',
      description:
        'We will gather at San Augustin Foursquare Gospel Church to exchange our vows. Please arrive a little early so we can begin the ceremony together.',
      mapEmbedUrl: '',
      image: '/loc.jpg',
      facts: [
        { label: 'Ceremony', value: '4:00 PM' },
        { label: 'Address', value: 'Poblacion, San Augustin, Romblon, Philippines' },
        { label: 'Parking', value: 'Available on site' },
        { label: 'Arrival', value: 'Please arrive by 3:30 PM' },
      ],
    },
    {
      eyebrow: 'The Reception',
      script: 'Dinner, dancing & celebrating',
      heading: 'The Reception',
      title: 'Azure Shore Estate',
      address: '1024 Coast Highway, Malibu, CA 90265',
      description:
        'Our celebration continues at a private coastal estate overlooking the Pacific. Valet parking is provided at the main gate, and a shuttle will be available from nearby accommodations.',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.6835939775755!2d-118.67956368478304!3d34.03123848060825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82b6531a1783f%3A0x7572a3fdc16f91a4!2sMalibu%2C%20CA%2090265!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
      image: '/loc.jpg',
      facts: [
        { label: 'Reception', value: '6:30 PM' },
        { label: 'Address', value: '1024 Coast Highway, Malibu, CA 90265' },
        { label: 'Parking', value: 'Valet available' },
        { label: 'Shuttle', value: 'From local hotels, 1 hour before' },
      ],
    },
  ],
  gallery: galleryImages,
  rsvpDueDate: 'October 1, 2026',
};
