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
      title: 'San Agustin Foursquare Gospel Church',
      address: 'San Agustin Foursquare Gospel Church, Q Manalon St, San Agustin, Romblon, Philippines',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=H48J%2BRJ7%2C%20Q%20Manalon%20St%2C%20San%20Agustin%2C%20Romblon%2C%20Philippines',
      description:
        'We will gather at San Agustin Foursquare Gospel Church on Q Manalon St, San Agustin, Romblon to exchange our vows.',
      mapEmbedUrl: '',
      image: '/loc.jpg',
      facts: [
        { label: 'Ceremony', value: '2:00 PM' },
        { label: 'Address', value: 'San Agustin Foursquare Gospel Church,, Q Manalon St, San Agustin, Romblon, Philippines' },
      ],
    },
    {
      eyebrow: 'The Reception',
      script: 'Dinner & evening fellowship',
      heading: 'The Reception',
      title: 'Rise & Shine – Garden Cafe and Events Place',
      address: 'Cabolutan, San Agustin, Romblon, Philippines',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=H4WJ%2B2P6%2C%20Cabolutan%2C%20San%20Agustin%2C%20Romblon%2C%20Philippines',
      description:
        'Our celebration continues at Rise & Shine – Garden Cafe and Events Place in Cabolutan, San Agustin, Romblon for the reception program, dinner, and an evening of fellowship.',
      mapEmbedUrl: '',
      image: '/recep.jpeg',
      facts: [
        { label: 'Reception Program', value: '4:30 PM' },
        { label: 'Dinner Reception', value: '6:00 PM' },
        { label: 'Address', value: 'Cabolutan, San Agustin, Romblon, Philippines' },
      ],
    },
  ],
  gallery: galleryImages,
  entourageSlides: [
    {
      id: 'parents',
      label: 'Parents',
      image: '/DressCode/Parents.png',
      pendingImage: false,
      alt: 'Parents attire: a dark mauve gown for the ladies and a navy blue suit and tie for the gentlemen',
      ladies: 'Dark Mauve Gown',
      gentlemen: 'Navy Blue Suit and Tie',
      swatches: [
        { color: '#895F72', label: 'Dark mauve' },
        { color: '#22304F', label: 'Navy blue' },
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
        { color: '#E6D7B5', label: 'Cream' },
      ],
    },
    {
      id: 'maid-of-honor-best-man',
      label: 'Maid of Honor & Best Man',
     
      image: '/DressCode/Honor.png'  ,
      pendingImage: false,
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
        { color: '#E6D7B5', label: 'Cream' },
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
        { color: '#E6D7B5', label: 'Cream' },
        { color: '#B8A47F', label: 'Khaki' },
      ],
    },
  ],

  guestAttire: [
    {
      id: 'female-guests',
      heading: 'Ladies',
      paletteLabel: "Female Guests' Palette",
      image: '/DressCode/GuestFemale.png',
      pendingImage: false,
      swatches: [
        { color: '#895F72', label: 'Dark mauve' }, 
        { color: '#E3C5C1', label: 'Blush' }, 
      ],
    },
    {
      id: 'male-guests',
      heading: 'Gentlemen',
      paletteLabel: "Male Guests' Palette",
      image: '/DressCode/GuestMale.png',
      pendingImage: false,
      swatches: [
        { color: '#9BAFBE', label: 'Dusty blue' }, // Dusty blue
        { color: '#7B9380', label: 'Sage green' }, // Muted sage green
      ],
    },
  ],
  rsvpDueDate: 'November 30, 2026',
};
