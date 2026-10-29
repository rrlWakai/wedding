import type { EntourageSlide, GuestAttireGroup, WeddingInfo } from '../types';
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
  /**
   * Entourage attire slides for the Dress Code carousel.
   * Categories with `image: null` and `pendingImage: true` await final outfit
   * artwork and render a temporary placeholder instead.
   */
  entourageSlides: [
    {
      id: 'parents',
      label: 'Parents',
      image: '/DressCode/Parents.png',
      pendingImage: false,
      alt: "Parents attire — a dark mauve gown for the ladies and a cream barong with brown pants for the gentlemen",
      ladies: 'Dark Mauve Gown',
      gentlemen: 'Cream Barong and Brown Pants',
      swatches: [
        { color: '#895F72', label: 'Dark mauve' },
        { color: '#F1E5CE', label: 'Cream' },
      ],
    },
    {
      id: 'principal-sponsors',
      label: 'Principal Sponsors',
      image: '/DressCode/PrincipalSponsor.png',
      pendingImage: false,
      alt: 'Principal Sponsors attire — a peach gown for the ladies and a cream barong with brown pants for the gentlemen',
      ladies: 'Peach Gown',
      gentlemen: 'Cream Barong and Brown Pants',
      swatches: [
        { color: '#E9B19A', label: 'Peach' },
        { color: '#F1E5CE', label: 'Cream' },
      ],
    },
    {
      id: 'maid-of-honor-best-man',
      label: 'Maid of Honor & Best Man',
      // No outfit artwork available yet — temporary placeholder rendered instead.
      image: null,
      pendingImage: true,
      alt: 'Maid of Honor and Best Man attire — attire image coming soon',
      lady: 'Dusty Blue Floor-Length Gown',
      gentleman: 'Mocha Brown Suit and Tie',
      swatches: [
        { color: '#91A8BD', label: 'Dusty blue' },
        { color: '#795A48', label: 'Mocha brown' },
      ],
    },
    {
      id: 'bridesmaids-groomsmen',
      label: 'Bridesmaids & Groomsmen',
      image: '/DressCode/Bridesmaid&Groomsmen.png',
      pendingImage: false,
      alt: "Bridesmaids and Groomsmen attire — choco brown floor-length gowns for the ladies, white polos with choco brown neck ties and khaki pants for the gentlemen",
      ladies: 'Choco Brown Floor-Length Gown',
      gentlemen: 'White Polo, Choco Brown Neck Ties, Brown Belt, and Khaki Pants',
      swatches: [
        { color: '#4A3028', label: 'Chocolate brown' },
        { color: '#F1E5CE', label: 'Cream' },
        { color: '#B8A47F', label: 'Khaki' },
      ],
    },
    {
      id: 'secondary-sponsors',
      label: 'Secondary Sponsors',
      image: '/DressCode/SecondarySponsor.png',
      pendingImage: false,
      alt: 'Secondary Sponsors attire — mauve floor-length gowns for the ladies, white polos with beige neck ties and khaki pants for the gentlemen',
      ladies: 'Mauve Floor-Length Gown',
      gentlemen: 'White Polo, Beige Neck Ties, Brown Belt, and Khaki Pants',
      swatches: [
        { color: '#B98491', label: 'Mauve' },
        { color: '#D8C6A9', label: 'Beige' },
        { color: '#B8A47F', label: 'Khaki' },
      ],
    },
    {
      id: 'flower-girls-bearers',
      label: 'Flower Girls & Bearers',
      image: '/DressCode/FlowerGirl&Bearers.png',
      pendingImage: false,
      alt: 'Flower Girls and Bearers attire — moss green floor-length gowns for the ladies, white polos with moss green neck ties and khaki pants for the gentlemen',
      ladies: 'Moss Green Floor-Length Gown',
      gentlemen: 'White Polo, Moss Green Neck Ties, Brown Belt, and Khaki Pants',
      swatches: [
        { color: '#687D57', label: 'Moss green' },
        { color: '#F1E5CE', label: 'Cream' },
        { color: '#B8A47F', label: 'Khaki' },
      ],
    },
  ],
  /**
   * Guest attire groups. Both await final outfit artwork and render temporary
   * placeholders alongside their wedding-palette swatches.
   */
  guestAttire: [
    {
      id: 'female-guests',
      heading: 'Female Guests',
      paletteLabel: "Female Guests' Palette",
      pendingImage: true,
      swatches: [
        { color: '#895F72' }, // Muted mauve
        { color: '#E3C5C1' }, // Dusty blush pink
      ],
    },
    {
      id: 'male-guests',
      heading: 'Male Guests',
      paletteLabel: "Male Guests' Palette",
      pendingImage: true,
      swatches: [
        { color: '#9BAFBE' }, // Dusty blue
        { color: '#7B9380' }, // Muted sage green
      ],
    },
  ],
  rsvpDueDate: 'October 1, 2026',
};
