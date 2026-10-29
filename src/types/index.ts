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

export interface EntourageSwatch {
  color: string;
  label: string;
}

export interface EntourageSlide {
  id: string;
  label: string;
  /** Public URL of the outfit illustration/photo. `null` while artwork is pending. */
  image: string | null;
  /** Set to `true` when no final image exists yet; a temporary placeholder is rendered instead. */
  pendingImage: boolean;
  alt: string;
  lady?: string;
  ladies?: string;
  gentleman?: string;
  gentlemen?: string;
  swatches: EntourageSwatch[];
}

export interface GuestAttireGroup {
  id: string;
  heading: string;
  paletteLabel: string;
  /** Set to `true` when no final image exists yet; a temporary placeholder is rendered instead. */
  pendingImage: boolean;
  swatches: { color: string }[];
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
  entourageSlides: EntourageSlide[];
  guestAttire: GuestAttireGroup[];
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
