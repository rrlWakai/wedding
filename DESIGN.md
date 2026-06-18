---
name: Ethereal Sands
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#50453c'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#82756b'
  outline-variant: '#d4c3b9'
  surface-tint: '#7b5738'
  primary: '#553519'
  on-primary: '#ffffff'
  primary-container: '#6f4c2e'
  on-primary-container: '#efbe98'
  inverse-primary: '#edbd97'
  secondary: '#735b29'
  on-secondary: '#ffffff'
  secondary-container: '#fedb9d'
  on-secondary-container: '#785f2d'
  tertiary: '#463a2e'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e5144'
  on-tertiary-container: '#d7c4b4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#edbd97'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#603f23'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#e3c287'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5a4314'
  tertiary-fixed: '#f3dfce'
  tertiary-fixed-dim: '#d6c3b3'
  on-tertiary-fixed: '#231a0f'
  on-tertiary-fixed-variant: '#514538'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
  champagne: '#F2E5D5'
  peach-bloom: '#F7D7C4'
  sand-shadow: '#D9C5B2'
  off-white: '#F9F9F9'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 24px
  section-padding: 120px
---

## Brand & Style

This design system captures the essence of a high-end, destination beach wedding. The brand personality is sophisticated, timeless, and serene, evoking the quiet luxury of a private coastal estate at sunset. It targets a discerning audience that values understated elegance over flashy displays.

The visual style is **Minimalist with Glassmorphic accents**. It borrows heavily from premium editorial layouts—prioritizing generous "breathing room" (whitespace), intentional asymmetric balance, and a focus on high-quality photography. The interface should feel like a physical invitation or a curated coffee-table book: tactile, expensive, and effortless. Smooth, eased transitions and subtle backdrop blurs are used to create a sense of depth and fluidity, mimicking the gentle movement of the tide.

## Colors

The palette is rooted in a "Warm Earthy" spectrum, avoiding the starkness of pure white or the coldness of standard grays. 

- **Primary (Earth Brown):** Used sparingly for high-impact typography, primary action buttons, and structural lines to provide grounding.
- **Secondary (Butter Yellow):** An accent color for subtle highlights, active states, and celebratory elements.
- **Neutral (Sand/Off-White):** The foundation of the UI. Backgrounds should use `#FDFBF7` or `#F9F9F9` to maintain a soft, organic feel.
- **Glassmorphism:** Use semi-transparent layers of `Off-White` with a high background blur (20px+) to create floating navigation bars or overlay cards that feel light and airy.

## Typography

The typographic hierarchy relies on the contrast between the expressive, high-contrast serifs of **Playfair Display** and the functional, clean lines of **Inter**. 

Headlines should be treated as design elements themselves, often centered or paired with significant whitespace. Use "Display" sizes for hero sections and invitations. "Body" text should remain highly legible, utilizing the neutral character of Inter to ensure the content remains the focus. Labels and small navigational cues should use uppercase Inter with increased letter spacing to maintain a premium, architectural feel.

## Layout & Spacing

This design system utilizes a **Fixed Grid** on desktop (12 columns, max-width 1280px) and a **Fluid Grid** on mobile (4 columns). 

The spacing rhythm is intentional and generous. Avoid crowding elements; instead, use large section padding (120px+) to separate different phases of the user journey (e.g., from the "Story" to "Venue Details"). Margins are wide to create a frame-like effect for the content, mimicking high-end fashion magazines. Use an 8px base unit for all internal component spacing to ensure mathematical harmony.

## Elevation & Depth

Depth is conveyed through **Glassmorphism** and **Tonal Layers** rather than heavy shadows. 

1.  **Surface Tiers:** Use subtle shifts in background color (e.g., from `Neutral` to `Champagne`) to define content areas.
2.  **Backdrop Blur:** Use for global navigation bars and modal overlays. These should have a 60% opacity of the `Off-White` color and a 25px blur radius.
3.  **Soft Ambient Shadows:** For interactive cards, use extremely low-opacity shadows (4-6%) with a slight brown tint (`#6F4C2E`) to make them feel integrated with the "sandy" environment rather than floating in gray space.

## Shapes

The shape language is **Soft (0.25rem)**. While a "luxury" aesthetic often uses sharp corners, this system uses subtle rounding to mimic the smoothed edges of sea glass or stones found on the beach. Large image containers or primary "hero" cards may use `rounded-lg` (0.5rem) to feel more approachable, but the overall geometry remains structured and disciplined.

## Components

- **Buttons:** Primary buttons use the Earth Brown background with Off-White text. They should have a subtle hover transition that shifts the background to a slightly lighter tint. Secondary buttons are "Ghost" style with a 1px Earth Brown border or just a text link with an elegant underline.
- **Input Fields:** Use a simple bottom-border (1px) in Earth Brown or a very light Sand fill. Avoid heavy boxes. Focus states should be indicated by a subtle thickening of the bottom border.
- **Cards:** Cards should be "borderless" with either a tonal background shift or a glassmorphic blur. Padding inside cards should be generous (min 32px).
- **Chips/Tags:** Used for guest categories or dietary requirements, these should use the `Peach Bloom` or `Champagne` colors with Earth Brown text, using the `rounded-xl` setting for a pill-like appearance.
- **Dividers:** Use very thin (0.5px) lines in `Sand-Shadow` to separate content sections without breaking the visual flow.
- **Imagery:** All images should feature a consistent warm-toned filter to align with the "Sunset/Warm Earth" palette.