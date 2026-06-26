# CLAUDE.md — Interfluo

This file is the build + brand source of truth for Interfluo. Read it before generating any UI. It is self-contained: the tokens, logo component, and assets are all inline below — create the referenced files from these blocks on first run, then import them.

---

## What Interfluo is

AI co-pilot for UK residential conveyancing fee-earners. One screen, one verb: **"Draft my enquiries and Report on Title from this pack."** Drop in the contract pack (PDFs) → get a ranked list of enquiries and a first-draft Report on Title, every assertion footnoted to its source page.

## The non-negotiable feeling

Interfluo must read as **established legal infrastructure, not a chatbot** — quiet, precise, citation-grounded. Latin *interfluo* = "to flow between". When choosing between two options, pick the calmer and more restrained one. UK English everywhere.

---

## Logo

The logo is **typographic — there is no illustrated symbol to draw or import.** It is set in two webfonts.

- **Monogram / mark:** lowercase `if`, **Instrument Serif, italic**, `letter-spacing: -0.02em`, colour Ink `#17181C`. (Drawn from In­ter­f­luo.)
- **Wordmark:** `Interfluo`, **Hanken Grotesk 600**, `letter-spacing: -0.015em`, Ink.
- **Lockup:** mark + 1px hairline divider + wordmark, vertically centred.

Rules:
- Colour is Ink `#17181C` on light, Paper `#F5F1E9` (or white) on dark. **Never any other colour.**
- Clear space = the mark's cap-height on all four sides. Min size 20px (favicon 16px).
- App icon: Ink ground, Paper `if`, 22% corner radius.
- Never recolour, rotate, skew, add effects, substitute the font, or place on busy/gradient grounds.

Load the fonts once in `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```

---

## Colour

Monochrome by default — Ink on warm Paper. **One** accent, Conveyance Green, for primary actions/links/confirmations. Use it sparingly.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#17181C` | Primary text, the mark, dark surfaces |
| `--ink-soft` | `#4A4842` | Secondary text |
| `--muted` | `#736F64` | Tertiary / supporting text, citations |
| `--paper` | `#F5F1E9` | Primary background (warm) |
| `--paper-dim` | `#ECE7DC` | App chrome behind cards |
| `--surface` | `#FFFFFF` | Cards, inputs |
| `--line` | `#E2DCCF` | Borders, dividers |
| `--line-strong` | `#C9C2B2` | Stronger borders, dashed dropzones |
| `--accent` | `#2E5C46` | Conveyance Green — primary buttons, links, active |
| `--accent-dark` | `#234A38` | Hover / pressed |
| `--accent-on-dark` | `#5B9B7C` | Green on Ink grounds |
| `--accent-tint` | `#E7EFE9` | Positive / success surfaces |
| `--danger` | `#B23B2E` | Errors, destructive only |

On Ink surfaces: text `#F5F1E9`, secondary `rgba(245,241,233,.6)`, borders `#33343A`.

## Typography

Two families, no exceptions.
- **Instrument Serif** (400 / 400 italic) — display headlines, editorial moments, the mark. Large & sparse only.
- **Hanken Grotesk** (400/500/600/700) — everything else: UI, body, labels, buttons, the wordmark.

| Role | Font | Size / LH | Weight |
|---|---|---|---|
| Display | Instrument Serif | 48–72 / 1.05 | 400 |
| H1 | Hanken Grotesk | 36–40 / 1.1 | 600 |
| H2 | Hanken Grotesk | 28 / 1.2 | 600 |
| H3 | Hanken Grotesk | 20 / 1.3 | 500 |
| Body | Hanken Grotesk | 16 / 1.6 | 400 |
| Small | Hanken Grotesk | 14 / 1.5 | 400 |
| Label | Hanken Grotesk | 12, `.14em`, UPPERCASE | 600 |

## Spacing / radius / elevation

- Spacing (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius: `--r-sm 6px` · `--r-md 10px` · `--r-lg 12px` · pill 999px · app-icon 22%.
- Shadows soft & warm (never hard black/blue): card `0 1px 2px rgba(30,28,24,.06)`; raised `0 22px 50px -32px rgba(30,28,24,.45)`.

## Components

- **Primary button:** `--accent` ground, white text, `--r-md`, 600, 48px tall, padding `0 30px`; hover `--accent-dark`.
- **Secondary button:** `--surface`, 1px `--line`, Ink text.
- **Input / dropzone:** `--surface`/`--paper`, 1px `--line` (dashed `--line-strong` for upload), `--r-md`.
- **Checkbox (on):** `--accent` fill + white tick; (off) 1.5px `--line-strong`.
- **Citation chip:** `--muted`, 12.5px — always shown next to generated content. Citations are a feature; surface them.
- **Top bar:** Ink ground, Paper logo lockup, nav `rgba(245,241,233,.6)`.

## Voice

Precise, calm, grounded — infrastructure a 30-year conveyancing partner trusts. Always cite the source document + page. Confident, never overclaiming.
- ✅ "Enquiry raised: the title register notes a restrictive covenant at entry 3 — see page 4."
- ✕ "🚀 Supercharge your conveyancing with AI!" (no hype, no emoji, no "AI" as personality, no US spelling.)

---

## Files to create from the blocks below

`src/brand/tokens.css`, `src/brand/Logo.tsx`, `public/favicon.svg`. Import `tokens.css` once at the app root; import `tokens.css`'s `@import` already pulls the fonts (or use the `<link>` above).

### `src/brand/tokens.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --ink:#17181C; --ink-soft:#4A4842; --muted:#736F64;
  --paper:#F5F1E9; --paper-dim:#ECE7DC; --surface:#FFFFFF;
  --line:#E2DCCF; --line-strong:#C9C2B2;
  --accent:#2E5C46; --accent-dark:#234A38; --accent-on-dark:#5B9B7C;
  --accent-tint:#E7EFE9; --danger:#B23B2E;
  --on-ink:#F5F1E9; --on-ink-soft:rgba(245,241,233,.6); --on-ink-line:#33343A;
  --divider-paper:#D8D1C2; --divider-ink:rgba(245,241,233,.25);

  --font-display:'Instrument Serif',Georgia,serif;
  --font-sans:'Hanken Grotesk',system-ui,sans-serif;

  --text-display:56px; --text-h1:40px; --text-h2:28px; --text-h3:20px;
  --text-body:16px; --text-small:14px; --text-label:12px;
  --lh-tight:1.05; --lh-head:1.2; --lh-body:1.6;
  --tracking-wordmark:-0.015em; --tracking-mark:-0.02em; --tracking-label:0.14em;

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-6:24px; --space-8:32px; --space-12:48px; --space-16:64px; --space-24:96px;

  --r-sm:6px; --r-md:10px; --r-lg:12px; --r-pill:999px;
  --shadow-card:0 1px 2px rgba(30,28,24,.06);
  --shadow-raised:0 22px 50px -32px rgba(30,28,24,.45);
}

body{
  background:var(--paper); color:var(--ink);
  font-family:var(--font-sans); font-size:var(--text-body);
  line-height:var(--lh-body); -webkit-font-smoothing:antialiased;
}

.btn-primary{
  background:var(--accent); color:#fff; border:none;
  font-family:var(--font-sans); font-weight:600;
  border-radius:var(--r-md); padding:0 30px; height:48px; cursor:pointer;
}
.btn-primary:hover{ background:var(--accent-dark); }
```

### `src/brand/Logo.tsx`
```tsx
import React from "react";

/**
 * Interfluo logo. Requires the Instrument Serif + Hanken Grotesk webfonts loaded.
 *   <Logo />                  // horizontal lockup, ink
 *   <Logo variant="mark" />   // just the `if` monogram
 *   <Logo variant="wordmark" />
 *   <Logo variant="stacked" />
 *   <Logo tone="paper" />     // on ink / dark grounds
 *   <Logo size={28} />        // mark cap size in px
 */
type Variant = "lockup" | "mark" | "wordmark" | "stacked";
type Tone = "ink" | "paper";
const INK = "#17181C", PAPER = "#F5F1E9";

export function Logo({
  variant = "lockup", tone = "ink", size = 40, className, style,
}: {
  variant?: Variant; tone?: Tone; size?: number;
  className?: string; style?: React.CSSProperties;
}) {
  const color = tone === "paper" ? PAPER : INK;
  const divider = tone === "paper" ? "rgba(245,241,233,0.25)" : "#D8D1C2";
  const mark: React.CSSProperties = {
    fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic",
    fontWeight: 400, letterSpacing: "-0.02em", fontSize: size, lineHeight: 1, color,
  };
  const wordmark: React.CSSProperties = {
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontWeight: 600,
    letterSpacing: "-0.015em", fontSize: size * 0.82, lineHeight: 1, color,
  };
  if (variant === "mark")
    return <span className={className} style={{ ...mark, ...style }}>if</span>;
  if (variant === "wordmark")
    return <span className={className} style={{ ...wordmark, fontSize: size, ...style }}>Interfluo</span>;
  if (variant === "stacked")
    return (
      <span className={className} style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:size*0.12, ...style }}>
        <span style={mark}>if</span>
        <span style={{ ...wordmark, fontSize:size*0.42, letterSpacing:"0.02em" }}>Interfluo</span>
      </span>
    );
  return (
    <span className={className} style={{ display:"inline-flex", alignItems:"center", gap:size*0.36, ...style }}>
      <span style={mark}>if</span>
      <span style={{ width:1, height:size*0.72, background:divider }} />
      <span style={wordmark}>Interfluo</span>
    </span>
  );
}
export default Logo;
```

### `public/favicon.svg`
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs><style>
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&amp;display=swap');
    .mk{font-family:'Instrument Serif',Georgia,serif;font-style:italic;}
  </style></defs>
  <rect width="64" height="64" rx="14" fill="#17181C"/>
  <text class="mk" x="33" y="45" font-size="38" text-anchor="middle" fill="#F5F1E9" letter-spacing="-1">if</text>
</svg>
```
(For a fully static favicon that never depends on a webfont, export this to PNG, or render the `if` to outlined paths.)

### `public/logo-mark.svg` (the `if` monogram, Ink)
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs><style>
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&amp;display=swap');
    .mk{font-family:'Instrument Serif',Georgia,serif;font-style:italic;}
  </style></defs>
  <text class="mk" x="52" y="70" font-size="82" text-anchor="middle" fill="#17181C" letter-spacing="-2">if</text>
</svg>
```

### `public/logo-lockup.svg` (mark + wordmark, Ink)
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="96" viewBox="0 0 360 96">
  <defs><style>
    @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600&amp;family=Instrument+Serif:ital@1&amp;display=swap');
    .mk{font-family:'Instrument Serif',Georgia,serif;font-style:italic;}
    .wm{font-family:'Hanken Grotesk',system-ui,sans-serif;font-weight:600;}
  </style></defs>
  <text class="mk" x="8" y="64" font-size="60" fill="#17181C" letter-spacing="-1.2">if</text>
  <rect x="78" y="30" width="1.5" height="38" fill="#D8D1C2"/>
  <text class="wm" x="96" y="62" font-size="48" fill="#17181C" letter-spacing="-0.7">Interfluo</text>
</svg>
```
On Ink grounds swap fills to Paper `#F5F1E9` and the divider to `rgba(245,241,233,.25)`.

---

## Definition of done for any screen

1. Fonts loaded; Ink-on-Paper by default; green used only for actions.
2. Logo via `<Logo />` — never a recoloured or restyled `if`.
3. Every AI-generated line shows a source citation (doc + page).
4. Copy is calm, cited, UK English — no hype, no emoji.
