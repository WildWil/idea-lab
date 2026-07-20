# idea-lab

Smoke-test landing pages for an autonomous income venture — deliberately **separate** from Will Ward IT (different repo, different eventual domain, no shared branding, no shared infra).

## What this is

Three landing pages testing three narrow product ideas, each wired to a real (if minimal) email-capture backend so signups are genuine signal, not a mockup. The goal per idea: find out cheaply whether anyone actually wants this before spending a week building it for real.

## The three ideas, and why these

Selected from patterns that show up independently across multiple 2026 indie-hacker/micro-SaaS sources: boring, specific, recurring-revenue problems beat generic AI-wrapper tools (that space is saturated and mostly moat-free), and distribution — not build time — is the real bottleneck, so each idea needs a plausible organic/content angle, not just a build plan. All three also target a different buyer than Will Ward IT's clients (local businesses), by design, to keep this cleanly separate.

- **Shiplog** — auto-generates a public changelog page from a repo's commits/PRs/tags. Buyer: small dev teams / indie SaaS founders. Low support burden, clean SEO angle ("changelog examples," "changelog tool for X"), genuinely easy to build and dogfood.
- **Saveflow** — watches Stripe for failed subscription payments and runs an automatic recovery email sequence. Buyer: indie SaaS founders. Proven category (dunning/recovery tools are a recurring pattern in the research), real quantifiable value (recovered $) which markets itself.
- **Clientloop** — one branded link per client replacing scattered email threads (files, status, invoices). Buyer: freelancers/consultants generally — not Will Ward IT's own client base, to avoid overlap.

## Status

Landing pages + signup API are built. Not yet deployed — see "Remaining steps" below.

## Structure

```
public/
  index.html          internal directory (noindex, not for sharing)
  shiplog/             landing page + styles
  saveflow/
  clientloop/
src/index.js           Worker: serves static assets, handles POST /api/signup
wrangler.jsonc          Cloudflare config (Workers + static assets + KV)
```

Each idea has its own visual identity — different palette, type pairing, and one signature interaction — deliberately not a reskinned template, since a generic-looking page would suppress signup rate and contaminate the smoke-test signal.

## How signups are captured

`POST /api/signup` with `{ idea, email }` validates and writes to a KV namespace (binding `SIGNUPS`), one entry per signup with a timestamp. No email service wired up yet — this is just counting real intent per idea. Check counts with:

```
wrangler kv key list --namespace-id <ID> --prefix shiplog:
wrangler kv key list --namespace-id <ID> --prefix saveflow:
wrangler kv key list --namespace-id <ID> --prefix clientloop:
```

## Remaining steps (need Will — money, identity, or account access)

1. **`wrangler login`**, or connect this repo to Cloudflare via GitHub-integrated Workers Builds (same pattern as will-ward-portfolio) — local wrangler isn't authenticated yet, so nothing can deploy until one of these happens.
2. **`wrangler kv namespace create SIGNUPS`** (needs auth from step 1) — then paste the returned id into `wrangler.jsonc`'s `kv_namespaces[0].id`, replacing the placeholder.
3. **`wrangler deploy`** — ships it to a free `*.workers.dev` URL. No custom domain needed yet for smoke-testing.
4. **A small paid ad budget** (~$10-25 per idea, ~$30-75 total for these three) on whichever platform fits each buyer best — likely a developer-audience placement (e.g. a relevant newsletter/community ad, or search ads on long-tail terms) rather than broad social. This is the one step that actually costs money and needs a payment method, so it's Will's call on amount and platform.
5. Watch signups for 1-2 weeks, then decide which (if any) idea clears a bar worth building for real.

Nothing above requires picking a company name, forming an entity, or opening a payment processor account yet — those only matter once an idea actually validates.
