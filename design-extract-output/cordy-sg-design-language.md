# Design Language: CORDY

> Extracted from `https://www.cordy.sg/` on May 5, 2026
> 1930 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#e84855` | rgb(232, 72, 85) | hsl(355, 78%, 60%) | 2 |
| Secondary | `#2e519f` | rgb(46, 81, 159) | hsl(221, 55%, 40%) | 1 |
| Accent | `#ff70a6` | rgb(255, 112, 166) | hsl(337, 100%, 72%) | 2 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#1a1b1f` | hsl(228, 9%, 11%) | 3759 |
| `#000000` | hsl(0, 0%, 0%) | 72 |
| `#ffffff` | hsl(0, 0%, 100%) | 15 |
| `#fff7e7` | hsl(40, 100%, 95%) | 2 |

### Background Colors

Used on large-area elements: `#fff7e7`, `#000000`

### Text Colors

Text color palette: `#000000`, `#1a1b1f`, `#ef476f`, `#ffffff`, `#ff70a6`, `#06d6a0`, `#4cc9f0`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#1a1b1f` | text, border | 3759 |
| `#000000` | text, border, background | 72 |
| `#ffffff` | text, border, background | 15 |
| `#ef476f` | text, border | 10 |
| `#fff7e7` | background | 2 |
| `#e84855` | background | 2 |
| `#ff70a6` | text, border | 2 |
| `#06d6a0` | text, border | 2 |
| `#4cc9f0` | text, border | 2 |
| `#2e519f` | background | 1 |

## Typography

### Font Families

- **DM Sans** — used for body (1874 elements)
- **sans-serif** — used for all (34 elements)
- **Gilroy** — used for all (22 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 50px | 3.125rem | 900 | 45px | normal | h2, br, span |
| 30px | 1.875rem | 900 | 30px | normal | h3, h2 |
| 25px | 1.5625rem | 600 | 36px | normal | h3, br |
| 20px | 1.25rem | 400 | 28px | normal | body, div, section, a |
| 16px | 1rem | 400 | normal | normal | html, head, style, meta |

### Heading Scale

```css
h2 { font-size: 50px; font-weight: 900; line-height: 45px; }
h3 { font-size: 30px; font-weight: 900; line-height: 30px; }
h3 { font-size: 25px; font-weight: 600; line-height: 36px; }
```

### Body Text

```css
body { font-size: 50px; font-weight: 900; line-height: 45px; }
```

### Font Weights in Use

`400` (1904x), `900` (17x), `600` (5x), `700` (4x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-5 | 5px | 0.3125rem |
| spacing-40 | 40px | 2.5rem |
| spacing-100 | 100px | 6.25rem |
| spacing-234 | 234px | 14.625rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 8px | 6 |
| lg | 16px | 2 |
| full | 60px | 1 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgb(0, 0, 0) 0px 5px 0px 0px;
```

## CSS Custom Properties

### Spacing

```css
--space-cadet-csg: #2e519f;
```

### Other

```css
--eggshell: #fff7e7;
--black: black;
--white: white;
--white-2: #fffbf4;
--crayon-red: #e84855;
--yellow-crayola: #ffe787;
--opp-red: #ef476f;
--opp-orange: #fb8500;
--opp-pink: #ff70a6;
--opp-green: #06d6a0;
--opp-blue: #4cc9f0;
--opp-yellow: #ffc44d;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| sm | 479px | max-width |
| md | 767px | max-width |
| md | 768px | min-width |
| lg | 991px | max-width |
| xl | 1280px | min-width |
| 1440px | 1440px | min-width |

## Transitions & Animations

**Durations:** `0.2s`

### Common Transitions

```css
transition: all;
transition: opacity 0.2s;
```

### Keyframe Animations

**spin**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (3 instances)

```css
.button {
  background-color: rgb(232, 72, 85);
  color: rgb(26, 27, 31);
  font-size: 20px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 16px;
}
```

### Links (9 instances)

```css
.link {
  color: rgb(26, 27, 31);
  font-size: 20px;
  font-weight: 400;
}
```

### Navigation (3 instances)

```css
.navigatio {
  color: rgb(26, 27, 31);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (4 instances)

```css
.foote {
  color: rgb(26, 27, 31);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 20px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgb(232, 72, 85);
  color: rgb(26, 27, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 16px;
  border: 4px solid rgb(0, 0, 0);
  font-size: 20px;
  font-weight: 400;
```

## Layout System

**0 grid containers** and **22 flex containers** detected.

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 11x |
| row/nowrap | 11x |

**Gap values:** `20px`, `normal 10px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 0 passing, 0 failing color pairs

## Design System Score

**Overall: 87/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 80/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 75/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 40 !important rules — prefer specificity over overrides
- 97% of CSS is unused — consider purging
- 6649 duplicate CSS declarations

## Z-Index Map

**3 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 100,999 | a.c.2.-.b.u.t.t.o.n. .w.-.i.n.l.i.n.e.-.b.l.o.c.k, a.c.2.-.b.u.t.t.o.n.-.2. .w.-.i.n.l.i.n.e.-.b.l.o.c.k, section.s.e.c.t.i.o.n.-.4.1 |
| base | 0,0 | div.l.o.t.t.i.e.-.a.n.i.m.a.t.i.o.n.-.1.8 |

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| webflow-icons | self-hosted | 400 | normal |
| Fatfrank | self-hosted | 700 | normal |
| DM Sans | self-hosted | 400, 500, 700 | italic, normal |
| Winkle | self-hosted | 400 | normal |
| Gilroy | self-hosted | 100, 200, 300, 400, 500, 600, 700, 900 | italic, normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 1 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 3.17:1 (1x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `sm` | `200ms` | 200 |

## Component Anatomy

### button — 2 instances

**Slots:** label

## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Sentence case (tight)

### Top CTA Verbs

- **start** (2)

### Button Copy Patterns

- "start" (2×)

### Sample Headings

> FIND WHAT
EXCITES YOU
> START
> FIND WHAT
EXCITES YOU
> START
> I know 600+ competitions,
workshops, volunteering....
> I’ll recommend the best ones for you.
> 100+ available
right now.
> FIND
OPPORTUNITIES
NOW
> START

## Page Intent

**Type:** `landing` (confidence 0.45)
**Description:** Find your passions with CORDY. Find opportunities for youths such as competitions, workshops, hackathons, grants, volunteering  and more!

## Section Roles

Reading order (top→bottom): content → content → hero → content → hero → content

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | content | FIND WHAT
EXCITES YOU | 0.3 |
| 1 | content | — | 0.3 |
| 2 | hero | FIND WHAT
EXCITES YOU | 0.85 |
| 3 | content | I know 600+ competitions,
workshops, volunteering.... | 0.3 |
| 4 | hero | FIND
OPPORTUNITIES
NOW | 0.85 |
| 5 | content | — | 0.3 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.457 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 60px |
| backdrop-filter in use | no |
| Gradients | 0 |

## Imagery Style

**Label:** `flat-illustration` (confidence 0.55)
**Counts:** total 1, svg 1, icon 0, screenshot-like 0, photo-like 0
**Dominant aspect:** ultra-wide
**Radius profile on images:** square

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `DM Sans` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
