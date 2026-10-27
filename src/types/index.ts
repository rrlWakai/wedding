export interface NavigationItem {
  id: string;
  label: string;
  icon: 'Calendar' | 'Camera' | 'Mail' | 'MapPin' | 'Heart';
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  rotateClass: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  caption?: string;
  aside?: string;
}

export interface WeddingFaq {
  question: string;
  answer: string;
}

export interface DressCodeCategory {
  id: string;
  title: string;
  description: string;
  swatchClasses: string[];
}

export interface LocationInfo {
  eyebrow?: string;
  script?: string;
  heading: string;
  title: string;
  address: string;
  description: string;
  mapEmbedUrl: string;
  image?: string;
  facts?: { label: string; value: string }[];
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
}

export interface HeroContent {
  heading: string;
  subheading: string;
  date: string;
  description: string;
  ctaLabel: string;
  slides: HeroSlide[];
}



export interface WeddingInfo {
  navigation: NavigationItem[];
  hero: HeroContent;
  countdownDate: string;
  timeline: TimelineEvent[];
  dressCode: DressCodeCategory[];
  locations: LocationInfo[];
  gallery: GalleryImage[];
  rsvpDueDate: string;
}

export interface RSVPFormData {
  name: string;
  email: string;
  attendance: 'yes' | 'no' | '';
  message: string;
}
