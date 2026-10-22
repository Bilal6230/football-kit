# Design system — Phase 1A

The `/` route is a temporary development specimen, not a storefront. Remove its noindex metadata when replacing it with an approved public page.

## Tokens and typography

`src/app/globals.css` owns semantic CSS variables and Tailwind v4 theme mappings. Use `bg-background`, `text-foreground`, `text-muted`, `border-line`, `bg-accent` and `bg-charcoal` instead of literal colours in components.

| Token | Value | Purpose |
| --- | --- | --- |
| background | #F7F4EE | Warm ivory canvas |
| surface | #FFFFFF | Raised or full-width surfaces |
| foreground | #181818 | Primary text |
| muted | #6B6B6B | Secondary readable text |
| line | #E7E1D8 | Decorative dividers; not control boundaries |
| accent / focus | #55624C | Olive actions and focus rings |
| charcoal | #252923 | Dark surfaces / primary hover |
| accent-soft | #E9EDE5 | Olive badge and secondary hover |

Playfair Display regular 400 is the display face; Inter 400/500/600 is the body/interface face. `next/font/google` downloads and self-hosts variable fonts at build time, with Latin preloads and swap/fallback metrics. Builds require Google Fonts network access; visitors do not contact Google. Display size scales from 52 to 112px, section headings 28–40px, body 16px with 1.6 line height. Labels use 11px semibold uppercase tracking; essential reading is never confined to labels.

Spacing follows a 4px unit, commonly 8/16/24/32/48px. Container max width is 80rem including responsive 20–80px gutters. Sections use 40–80px vertical padding. Corners are 2px; surfaces use a fine border and 4% ink shadow.

## Components

Import directly from `src/components/ui/`.

- `Container`: native div props, content width and responsive gutters. Place inside semantic section/main elements.
- `Button`: native button props/ref, default `type="button"`; `primary`, `secondary`, `text` variants. Supports disabled and normal keyboard activation. Supply accessible text and a real action; links should remain links.
- `SectionHeading`: children, optional eyebrow/description/id and `as="h2" | "h3"`. Preserve heading order and connect section labels with `aria-labelledby`.
- `Badge`: native span props and neutral/olive/dark tones; noninteractive.
- `ProductConditionBadge`: excellent/good/fair/new presentation labels, with a screen-reader condition prefix. These are not business grading rules or a backend enum.
- `Divider`: native hr props and semantic separator.

All components remain server-compatible. Only `design-system/button-specimen.tsx` is a client component, to demonstrate activation with a live status message. No UI framework or animation dependency was added.

## Motion and accessibility

Tokens: hover 200ms, card 300ms, section entrance 550ms, reserved hero 750ms, stagger 70ms; refined easing `cubic-bezier(0.22, 1, 0.36, 1)`. `.entrance` uses opacity/translateY and optional `--stagger-index`; it does not require JavaScript. Card/hero tokens are foundations only, not implemented storefront features. Reduced motion removes entrance animation, transition durations and button transforms.

Use native controls, at least 48px button height, visible 2px olive focus rings with 5px offset, and readable labels independent of colour. Decorative linen borders are not used as the sole indication of interactive boundaries. Inverse surfaces use white text. Disabled controls are visibly unavailable. Do not put the olive focus ring directly on a dark surface without an appropriate contrasting override.

Layouts stack on small screens, use two-column specimens at 768px, and a seven-column palette at 1024px. Keep DOM reading order consistent and allow controls/badges to wrap. Verify at 320px as well as representative mobile, tablet and desktop widths. Automated accessibility scans supplement manual visual/keyboard review; they do not establish full WCAG conformance.
