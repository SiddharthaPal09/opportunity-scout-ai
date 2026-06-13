---
name: Opportunity Scout
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbec'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dfe9fa'
  surface-container-highest: '#d9e3f4'
  on-surface: '#121c28'
  on-surface-variant: '#44474c'
  inverse-surface: '#27313e'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777c'
  outline-variant: '#c5c6cc'
  surface-tint: '#555f6f'
  primary: '#0a1422'
  on-primary: '#ffffff'
  primary-container: '#1f2937'
  on-primary-container: '#8690a1'
  inverse-primary: '#bdc7d9'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#201100'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2300'
  on-tertiary-container: '#c88000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e3f6'
  primary-fixed-dim: '#bdc7d9'
  on-primary-fixed: '#121c2a'
  on-primary-fixed-variant: '#3d4756'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#121c28'
  surface-variant: '#d9e3f4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  mono-data:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style
The design system is built for "Opportunity Intelligence"—a discipline requiring high signal-to-noise ratios and rapid data processing. The aesthetic is **High-Utility Minimalism**, drawing direct influence from the refined, functional interfaces of technical tools like Linear and GitHub.

The system prioritizes clarity and density without sacrificing elegance. It evokes a sense of "quiet power"—professional, neutral, and highly organized. The UI stays out of the user's way, using white space not just for aesthetics, but as a functional separator for complex datasets. The emotional response is one of control, precision, and institutional reliability.

## Colors
The palette is rooted in a grayscale foundation to ensure that data remains the focal point. 

- **Primary Action (#1F2937):** A deep charcoal used for core interactions and primary navigation elements, providing a grounded, stable feel.
- **Success/Match (#10B981):** A vibrant emerald green used specifically to highlight positive opportunity scores, matches, and completed states.
- **Warning/Attention (#F59E0B):** An amber hue reserved for low-confidence scores or items requiring a second look.
- **Critical/Deadline (#EF4444):** A sharp red used sparingly for expired opportunities or high-priority deadlines.
- **Neutrals:** A range of cool grays (from #111111 for text to #F3F4F6 for surfaces) creates a layered hierarchy that defines structure without the need for heavy borders.

## Typography
This design system utilizes **Inter** for its exceptional legibility in UI contexts and **Geist** for labels and technical data to provide a slight "developer-tool" edge.

Typography is treated as a structural element. We use tight letter-spacing on larger headings to maintain a compact, modern feel. For data-dense views, we lean on `body-sm` and `mono-data` to ensure maximum information density without compromising scanability. All labels are set in `Geist` to distinguish metadata from content.

## Layout & Spacing
The layout follows a **disciplined 4px/8px grid system**. 

- **Desktop (1440px):** Utilizes a fixed sidebar (240px default, 64px collapsed) with a fluid content area. Dashboards use a 12-column grid for flexibility.
- **Density:** Components use tight internal padding (8px–12px) to allow for information-heavy "Opportunity Tables" and "Analytics Panels."
- **Reflow:** On smaller screens, the 12-column grid collapses to 4 columns. Sidebars transition to an overlay drawer or a bottom navigation bar on mobile.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Soft Outlines** rather than heavy drop shadows. 

1. **Level 0 (Background):** `#FFFFFF` or `#FAFAFA` for the canvas.
2. **Level 1 (Cards/Sections):** White background with a 1px solid border of `#E5E7EB`. No shadow.
3. **Level 2 (Popovers/Modals):** White background with a subtle, diffused shadow: `0 4px 12px rgba(0, 0, 0, 0.05)`.
4. **Interactive States:** Hovering over a card or list item should result in a subtle background shift to `#F9FAFB` rather than an elevation increase.

## Shapes
We utilize a **Soft (0.25rem)** roundedness profile. This provides just enough approachable softness while maintaining the rigid, professional structure required for an intelligence platform. 

- **Buttons & Inputs:** 4px (0.25rem) radius.
- **Cards & Modals:** 8px (0.5rem) radius.
- **Badges/Chips:** 100px (Pill) to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons are solid `#1F2937` with white text. Secondary buttons are `#FFFFFF` with a `#D1D5DB` border. Tertiary buttons are ghost-style (text only).
- **Tables:** Rows must have a subtle hover state (`#F9FAFB`). Headers are uppercase `label-sm` with a light bottom border. Cells use `body-sm` for high density.
- **Status Badges:** Subtle background tints (e.g., Emerald at 10% opacity) with high-contrast text for high readability at small sizes.
- **Inputs:** Clean 1px borders. Focus state uses a 1px solid `#1F2937` border with a faint 2px outer glow of the same color at 10% opacity.
- **Sidebar:** A neutral grey palette (`#F9FAFB` background) with active states indicated by a solid vertical 2px bar in Emerald Green on the left edge.
- **Analytics Panels:** Use simple line charts with 2px stroke widths and no area fill to maintain the minimal aesthetic.