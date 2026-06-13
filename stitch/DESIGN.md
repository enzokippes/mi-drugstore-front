---
name: Neighborhood Apothecary
colors:
  surface: '#0f1419'
  surface-dim: '#0f1419'
  surface-bright: '#353a3f'
  surface-container-lowest: '#0a0f13'
  surface-container-low: '#171c21'
  surface-container: '#1b2025'
  surface-container-high: '#252a30'
  surface-container-highest: '#30353b'
  on-surface: '#dee3ea'
  on-surface-variant: '#d1c5af'
  inverse-surface: '#dee3ea'
  inverse-on-surface: '#2c3136'
  outline: '#9a907c'
  outline-variant: '#4e4635'
  surface-tint: '#eec14a'
  primary: '#ffd672'
  on-primary: '#3e2e00'
  primary-container: '#e6b943'
  on-primary-container: '#624a00'
  inverse-primary: '#775a00'
  secondary: '#aecbd7'
  on-secondary: '#17343d'
  secondary-container: '#314d57'
  on-secondary-container: '#a0bdc8'
  tertiary: '#dcdbd6'
  on-tertiary: '#30312e'
  tertiary-container: '#c0bfba'
  on-tertiary-container: '#4d4e4a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf97'
  primary-fixed-dim: '#eec14a'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5a4400'
  secondary-fixed: '#c9e7f3'
  secondary-fixed-dim: '#aecbd7'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#2f4b54'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#0f1419'
  on-background: '#dee3ea'
  surface-variant: '#30353b'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system transitions from a nightlife aesthetic to a warm, modern drugstore and wellness sanctuary. The brand personality is rooted in being a "trusted neighbor"—approachable and friendly, yet possessing the refined expertise of a premium apothecary. 

The visual style follows a **Modern/Corporate** foundation infused with **Tactile** warmth. It emphasizes clarity and trust through soft geometry, generous whitespace (even in dark mode), and high-quality typography. The goal is to evoke a sense of calm, health, and reliability, ensuring the user feels cared for rather than overwhelmed.

## Colors
The palette shifts away from high-contrast neon to a sophisticated, organic range.
- **Primary (Honey Gold):** A warm, muted gold used for calls to action and key highlights. It feels sunny and natural, reminiscent of honey or herbal oils.
- **Secondary (Slate Blue):** A calming, professional tone used for supporting elements and iconography to maintain a "medical" sense of trust.
- **Neutral (Deep Charcoal):** Replacing pure black, this base color uses a subtle blue-grey tint to soften the interface and reduce eye strain.
- **Surface (Parchment):** Used for light-mode elements or high-contrast text to provide a human, organic feel.

## Typography
The design system utilizes **Plus Jakarta Sans** across all levels. Its soft, rounded terminals and modern geometric proportions provide a friendly yet clean appearance that is highly legible for pharmaceutical or wellness information.

Headlines should use a tighter letter-spacing to feel "contained" and professional, while body text remains open to ensure high readability. Use the Bold and SemiBold weights sparingly for emphasis to maintain a gentle visual hierarchy.

## Layout & Spacing
This design system employs a **Fixed Grid** model for desktop and a **Fluid** model for mobile. 
- **Desktop:** 12-column grid with a 1280px max-width, 24px gutters, and 48px side margins.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows an 8px rhythmic scale. Components should prioritize "room to breathe," using larger padding (`24px`+) within cards to reinforce the premium, unhurried neighborhood feel.

## Elevation & Depth
Depth is created through **Tonal Layers** rather than aggressive shadows. Surfaces are differentiated by slight shifts in the charcoal base (e.g., a background at `#1A1F24` and a card at `#252B32`).

Where elevation is required for interactivity (like a floating button), use **Ambient Shadows**: soft, extremely diffused blurs with a low-opacity tint of the primary gold color to make the element feel like it is glowing softly with warmth rather than casting a cold, dark shadow.

## Shapes
To ensure the interface feels approachable and safe, the design system utilizes a high degree of roundedness. 
- **Standard elements (Buttons/Inputs):** 0.5rem (8px).
- **Cards and Containers:** 1rem (16px).
- **Large Promotional Sections:** 1.5rem (24px).

Avoid sharp 90-degree corners entirely to maintain the "soft apothecary" aesthetic.

## Components
- **Buttons:** Primary buttons use the Honey Gold fill with dark charcoal text. They should have ample horizontal padding (24px) to feel substantial. Secondary buttons should use a Slate Blue outline.
- **Input Fields:** Use a subtle border with a 0.5rem radius. Focus states should transition the border to Honey Gold with a soft outer glow.
- **Cards:** Cards should have a slightly lighter background than the main canvas. Include a generous 24px internal padding.
- **Chips/Badges:** Used for product categories (e.g., "Organic," "Wellness"). These should be pill-shaped with Slate Blue backgrounds and light text.
- **Lists:** Use dividers that are only 5-10% lighter than the background color to keep the UI clean and minimize visual noise.
- **Prescription/Status Indicators:** Use soft-colored dots (green for ready, amber for processing) to provide clear, gentle feedback.