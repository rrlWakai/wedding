import type { WeddingInfo } from '../types';
import { galleryImages } from './gallery';
import { timelineEvents } from './timeline';

export const weddingInfo: WeddingInfo = {
  navigation: [
    { id: 'story', label: 'Our Story', icon: 'Heart' },
    { id: 'film', label: 'Our Film', icon: 'Camera' },
    { id: 'details', label: 'Details', icon: 'Calendar' },
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
        image:
          'https://lh3.googleusercontent.com/aida/AP1WRLt15mCUDTyMEw9knOUYMBrRGQ00Zh20S9-tlHJ-F2UEkjuOBIY2FOKt3-vc4taq0evluEgTp9SNBYsSzaa65ylWc71_rOLM2DkybzPRx__q5S7wsvy_pDZWCzsKmllehw30eP8wUMJdXNP_trHiEJiJO_GKTQgfOJPCaQpFmJYfwqH1HYOom4vkPWkXABRHHC0gg8d-mNj9g4jp876zG-B1eX3BkR4l-qGGoc7bfqaKAaFos3uc4RTwT7o',
        alt: 'Coastal wedding couple portrait',
      },
      {
        id: 'hero-2',
        image:
          'https://lh3.googleusercontent.com/aida/AP1WRLsqTQByEnIvOyMcnlnVmQ6UUY7tMLb0IPhXaom-nv_g-sXHTbsKgLLdSqDOKEIypUB7j8aJw17xlHDfQrGYAaKIoxf5bxvnUkKxCj6HvZH_Wpq3NYPiLLpYGLqefrCX3SbNkHy-tKangon-xi7xeApNGbxkpnOLPh0csUcb6hdGOAd_0o0bhawyPq6gsiP2HMYiWOzSnc5qqpcOPeV3aoMrKU2mRS7kQoE9jnUiQQmfetvO7YbSkH21QjQ',
        alt: 'Sunset wedding coastline',
      },
      {
        id: 'hero-3',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBafLs4LhK3Z2EGgyen8iHSWdCCNvABabj4ToeZzNFgPwvAnjYUq8oAAeTPY5qFIvvnpg65RleojvxkCfrH7f-5udRzyTnYBlqvgf70rZEOgtUYcu0YqT2j5T5ItfZQsgmX3vqcwTDd-F9h0g_oGK8DEJdjny9rz4FO3YfBCvSHheZ9KIvu20l96RiYJHYk6rB0qpJIT1nL2OihxQ3Df-J0iTiet1zgz44ShtHur3l17MR1VQMBcq0Wzngc3zmPeE8FILW0zo-i4DI',
        alt: 'Warm and intimate beach moment',
      },
    ],
  },
  countdownDate: '2026-12-02T00:00:00',
  timeline: timelineEvents,
  prenupVideo: {
    eyebrow: 'Pre-Nup Film',
    scriptLine: 'Warm, Earthy, Elegant',
    title: 'A glimpse of us before the aisle',
    description:
      'Captured along the coast in golden light, our pre-nup film is a quiet love letter — soft laughter, warm tones, and the calm before we say forever.',
    videoUrl:
      'https://cdn.coverr.co/videos/coverr-couple-walking-on-the-beach-1573/1080p.mp4',
    posterImage:
      'https://lh3.googleusercontent.com/aida/AP1WRLsqTQByEnIvOyMcnlnVmQ6UUY7tMLb0IPhXaom-nv_g-sXHTbsKgLLdSqDOKEIypUB7j8aJw17xlHDfQrGYAaKIoxf5bxvnUkKxCj6HvZH_Wpq3NYPiLLpYGLqefrCX3SbNkHy-tKangon-xi7xeApNGbxkpnOLPh0csUcb6hdGOAd_0o0bhawyPq6gsiP2HMYiWOzSnc5qqpcOPeV3aoMrKU2mRS7kQoE9jnUiQQmfetvO7YbSkH21QjQ',
    tag: 'Coastal Editorial',
    duration: '2 min watch',
  },
  details: [
    {
      id: 'detail-1',
      title: 'The Ceremony',
      subtitle: 'The Sands at Sunset Cliff',
      time: '4:00 PM',
      location: 'Malibu, California',
      note: 'Attire: Coastal Black Tie',
      icon: 'Calendar',
    },
    {
      id: 'detail-2',
      title: 'The Reception',
      subtitle: 'The Azure Shore Estate',
      time: '6:30 PM',
      location: 'Private beach access provided',
      note: 'Dinner, drinks & dancing to follow',
      icon: 'Heart',
    },
  ],
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
  location: {
    heading: 'The Location',
    title: 'Azure Shore Estate',
    address: '1024 Coast Highway, Malibu, CA 90265',
    description:
      'Our celebration will take place at a private coastal estate overlooking the Pacific. Valet parking is provided at the main gate, and a shuttle will be available from nearby accommodations.',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.6835939775755!2d-118.67956368478304!3d34.03123848060825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82b6531a1783f%3A0x7572a3fdc16f91a4!2sMalibu%2C%20CA%2090265!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
  },
  gallery: galleryImages,
  rsvpDueDate: 'October 1, 2026',
};
