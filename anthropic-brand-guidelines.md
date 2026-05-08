# Anthropic / Claude Brand Guidelines Analysis

## Context
Research analysis of the Claude (claude.com) and Anthropic (anthropic.com) brand identity, extracted from live screenshots and CSS inspection of: claude.com/blog, claude.com/solutions/education, and anthropic.com/economic-futures.

---

## 1. Typography

### Font Families
| Font | Usage | Fallback |
|------|-------|----------|
| **Anthropic Sans** | Body text, navigation, UI elements, card titles | Arial, sans-serif |
| **Anthropic Serif** | Hero headings, display text, section titles | Georgia, sans-serif |
| **Anthropic Mono** | Code blocks, technical content | JetBrains Mono |
| **Noto Sans** | Logographic/CJK character support | Arial, sans-serif |

Additional typefaces found on anthropic.com: **Copernicus**, **Styrene A/B**, **Tiempos Text**

### Type Scale (from claude.com)
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 (hero) | Anthropic Serif | 112px | 400 (regular) | 1.1 (123.2px) |
| H2 (section) | Anthropic Serif | 36px | 500 (medium) | 1.3 (46.8px) |
| H3 (card title) | Anthropic Sans | 20px | 600 (semibold) | — |
| Body | Anthropic Sans | 17px | 400 (regular) | — |
| Nav links | Anthropic Sans | 15px | 500 (medium) | — |

### Typography Style Notes
- Hero headings use **serif** (Anthropic Serif) with normal weight — elegant and editorial
- Body/UI text uses **sans-serif** (Anthropic Sans) — clean and functional
- No text-transform (uppercase) is used on headings — always sentence case
- Letter spacing is `normal` across all heading levels
- Text wrapping set to `pretty` for optimal line breaks

---

## 2. Color Palette

### Gray Scale (warm-tinted grays — NOT neutral)
| Token | Hex | Usage |
|-------|-----|-------|
| `gray-000` | `#FFFFFF` | Pure white |
| `gray-050` | `#FAF9F5` | Light background (warm off-white), light-mode text on dark bg |
| `gray-100` | `#F5F4ED` | Subtle background variation |
| `gray-150` | `#F0EEE6` | Card backgrounds (light mode) |
| `gray-200` | `#E8E6DC` | Borders, dividers (light mode) |
| `gray-250` | `#DEDCD1` | — |
| `gray-300` | `#D1CFC5` | — |
| `gray-350` | `#C2C0B6` | — |
| `gray-400` | `#B0AEA5` | Muted text |
| `gray-450` | `#9C9A92` | Secondary text |
| `gray-500` | `#87867F` | Tertiary text, metadata |
| `gray-550` | `#73726C` | — |
| `gray-600` | `#5E5D59` | — |
| `gray-750` | `#30302E` | Card backgrounds (dark mode) |
| `gray-900` | `#1A1918` | Dark surface |
| `gray-950` | `#141413` | Primary dark background (page bg in dark mode) |
| `gray-1000` | `#000000` | Pure black |

### Brand / Accent Colors
| Token | Hex | RGB | Description |
|-------|-----|-----|-------------|
| **clay** | `#D97757` | 217, 119, 87 | **Primary brand color** — terracotta/antique brass. Used for logo, CTAs, accents |
| **clay-interactive** | `#C96442` | 201, 100, 66 | Darker clay for hover/active states |
| **oat** | `#E3DACC` | 227, 218, 204 | Warm beige — card backgrounds, illustrations |
| **olive** | `#788C5D` | 120, 140, 93 | Sage green — illustration backgrounds |
| **cactus** | `#BCD1CA` | 188, 209, 202 | Light teal/sage — illustration backgrounds |
| **sky** | `#6A9BCC` | 106, 155, 204 | Medium blue — illustration backgrounds |
| **heather** | `#CBCADB` | 203, 202, 219 | Lavender — illustration backgrounds |
| **fig** | `#C46686` | 196, 102, 134 | Pink/rose — illustration backgrounds |
| **coral** | `#EBCECE` | 235, 206, 206 | Light pink — illustration backgrounds |

### User-Provided Brand Colors (confirmed match)
| Hex | Name | Match to Token |
|-----|------|----------------|
| `#CC785C` | Antique Brass | ≈ `clay` (#D97757) — primary brand color |
| `#828179` | Friar Gray | ≈ `gray-500` (#87867F) — mid-tone gray |
| `#F0EFEA` | Cararra | ≈ `gray-150` (#F0EEE6) — light bg |
| `#FFFFFF` | White | = `gray-000` |
| `#141413` | Cod Gray | = `gray-950` — dark bg |

---

## 3. Visual & Illustration Style

### Illustration Approach
- **Hand-drawn, whimsical line art** — organic, slightly playful
- White or dark line art on colored backgrounds
- Often features abstract/conceptual objects: molecular shapes, furniture, tools, charts
- Terracotta/clay-colored organic shapes as accent elements
- Line weight is consistent, medium-thick strokes
- Not photorealistic — stylized, almost editorial/magazine quality

### Blog Card Thumbnails
- Colored background fills using the accent palette (olive, clay, cactus, oat, heather, sky)
- Centered abstract line-art icon on each card
- Icons represent the topic conceptually (not literal)
- Rounded corners on cards (~12-16px border radius)

### Icon Style
- Simple geometric line-art icons for feature sections
- Consistent stroke weight
- Monochrome (same color as text)
- Used in feature grids (4-column layouts)

---

## 4. Layout & Spacing

### Page Structure
- **Sticky top navigation** bar with logo + nav links + CTA buttons
- **Full-width hero sections** with oversized serif typography
- **Breadcrumb navigation** below the main nav (e.g., "Solutions / Education")
- **"Explore here"** dropdown for quick navigation
- Large, generous whitespace between sections
- Content width constrained to ~1200-1400px center column

### Grid Systems
- **3-column grid** for blog post cards
- **4-column grid** for feature/value proposition cards
- **2-column split** for hero sections (illustration left, text right)
- Responsive fluid spacing using CSS `clamp()` functions

### Navigation
- Logo: Claude starburst icon + "Claude" wordmark in Anthropic Sans
- Nav items: Meet Claude, Platform, Solutions, Pricing, Resources, Login
- Two CTA buttons: "Contact sales" (filled, dark bg with light text) and "Try Claude" (outlined)
- Footer: Multi-column link grid organized by category (Products, Features, Models, Solutions, etc.)

---

## 5. Themes (Dark vs Light)

### Claude.com — Dark Theme (Default)
- Background: `#141413` (gray-950)
- Primary text: `#FAF9F5` (gray-050)
- Secondary text: `#87867F` (gray-500)
- Card backgrounds: `#1F1E1D` to `#30302E` (gray-750 range)
- Navigation: Semi-transparent or dark with light text
- Accent: Clay/terracotta for logo icon, interactive elements

### Anthropic.com — Light Theme
- Background: `#F0EEE6` (ivory-light / gray-150)
- Primary text: `#141413` (gray-950)
- Clean, minimal, editorial feel
- Same accent colors but on light backgrounds

---

## 6. Button Styles

| Style | Background | Text | Border | Radius |
|-------|-----------|------|--------|--------|
| Primary CTA | `#141413` (dark) | `#FAF9F5` (light) | none | pill (~9999px) |
| Secondary/Outline | transparent | `#FAF9F5` (light) | 1px solid light | pill (~9999px) |
| Interactive hover | `#C96442` (clay-interactive) | white | — | pill |

- Buttons use **pill shape** (fully rounded)
- Font: Anthropic Sans, medium weight
- Padding is generous for comfortable click targets

---

## 7. Logo

- **Claude starburst/asterisk icon** in clay/terracotta (#D97757)
- **"Claude" wordmark** in Anthropic Sans, light color on dark bg
- The starburst has a sunburst/radial pattern — organic, warm feel
- Logo is always paired: icon + wordmark

---

## 8. Overall Brand Personality

- **Warm & approachable** — terracotta clay tones, hand-drawn illustrations, serif headings
- **Sophisticated & editorial** — large serif typography, generous whitespace, restrained color use
- **Organic & human** — warm gray tones (not cool/blue grays), hand-crafted illustration style
- **Dark-mode forward** — claude.com defaults to dark theme, conveying professionalism
- **Minimal & clean** — no visual clutter, clear hierarchy, purposeful use of color
- **Nature-inspired naming** — color tokens named after natural elements (clay, olive, cactus, oat, heather, fig, coral, sky)
