# Design System: idea-lab

Three separate smoke-test products, each pulling from a named direction in `style-systems.md` instead of an improvised palette. Picked to fit each idea's actual buyer, not for visual variety on its own.

---

## Shiplog

### Direction
Precision & Density (category F, Modern Tech-Adjacent). Buyer is developers and indie SaaS founders, so a dense, technical, no-nonsense feel is honest rather than a generic "startup" look. Diff-style green/red is kept as a functional accent inside the changelog card itself (it means something: addition vs deletion), not decoration.

### Colors
- Primary: `#0F172A` (slate), page background
- Secondary: `#64748B` (cool gray), muted/meta text
- Accent: `#2563EB` (blue), links, buttons, focus ring
- Semantic (diff lines only): `#3FB950` addition, `#F85149` deletion, `#D29922` changed
- Text (body): `#C9D1D9` on dark background
- Text (headings): `#ECEFEC`
- Background (card surface): `#161B22`

### Typography
- Display / headings: Space Grotesk (Google Fonts), H1, release version numbers
- Body: Public Sans (Google Fonts), paragraphs, nav
- Technical labels: JetBrains Mono (Google Fonts), diff lines, version tags, eyebrow
- Scale: H1 ~52px / body 18px

### Spacing & shape
- Base spacing unit: 8px
- Border radius: 6px (sharp, matches developer-tool tokens)
- Shadow style: borders-only, no glows or blurred shadows

### Layout primitive
The live changelog card is the whole page. No separate feature-card row, the product's own output is the hero.

---

## Saveflow

### Direction
Sophistication & Trust (category B, Professional & Trust-Based Services). Buyer is an indie SaaS founder worried about revenue, and the emotional register is financial/trust, not "fun startup." This system is built for exactly that register (normally law/financial services), which fits a "we're protecting your revenue" pitch.

### Colors
- Primary: `#11233F` (navy), headings, primary button
- Secondary: `#5B6B7E` (slate), muted text
- Accent: `#B9974A` (muted gold), the recovered-dollar figure, used sparingly
- Text (body): `#5B6B7E` (slate)
- Background: `#FAF9F6` (warm white)

### Typography
- Display / headings: Playfair Display (Google Fonts)
- Body: Manrope (Google Fonts), paragraphs, nav, the recovered-dollar ticker (tabular figures)
- Scale: H1 ~48px / body 18px

### Spacing & shape
- Base spacing unit: 8px
- Border radius: 10px
- Shadow style: subtle only, no gradients, restrained motion (the dollar counter is the one deliberate motion moment)

### Layout primitive
The "recovery receipt" card: one large recovered-dollar figure plus a short ledger of declined-to-recovered line items.

---

## Clientloop

### Direction
Quiet Confidence (category D, Creative/Personal Brand). Buyer is freelancers and consultants: understated, craft-forward, human, the opposite of a generic SaaS dashboard.

### Colors
- Primary: `#1C1C1C` (charcoal), the "one link" card, headings
- Secondary: `#EDE3D3` (warm beige), page background
- Accent: `#A85C32` (muted clay), small highlight only
- Text (body): `#6B6459`
- Background: `#FBF9F6` (near the beige, slightly lighter for card surfaces)

### Typography
- Display / headings: Instrument Serif (Google Fonts)
- Body: General Sans (Fontshare, self-hosted)
- Scale: H1 ~50px / body 18px

### Spacing & shape
- Base spacing unit: 8px
- Border radius: 12px
- Shadow style: soft, low-opacity only

### Layout primitive
Chaos-to-calm convergence: scattered message fragments animate into the single branded link card. Kept from the original draft since it's a real demonstration of the product, not decoration.

---

## Pages built so far
- [x] Shiplog landing page
- [x] Saveflow landing page
- [x] Clientloop landing page

## Notes / decisions made along the way
Rebuilt from an initial pass that used improvised palettes (frontend-design skill, not Handbuilt) after Will asked to route SaaS site builds through Handbuilt specifically. Kept the structural signature elements from the first pass (live changelog card, recovery receipt, chaos-to-calm convergence) since those were already grounded in each product's own mechanic, not generic. Only the color/type systems changed to Will's actual named directions.
