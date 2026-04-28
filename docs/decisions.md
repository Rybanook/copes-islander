# Architecture & Scope Decisions

This document records key decisions made during the build of the Copes' Islander website. See chat history with thinking-partner Claude for full context.

## V1 scope (locked)

- 5-page marketing site: Home, The Suite, The Location, Gallery, Contact/Inquire
- Inquiry-only — no booking, no payments, no calendar sync
- Upscale-coastal visual direction; logo as the folksy element
- Astro + Tailwind, deployed to Cloudflare Pages or Netlify (TBD)
- Existing domain bbvancouverisland-bc.com retained for SEO

## Photo policy

All photos on the deployed site must be real photographs of the actual property. No AI-generated or AI-enhanced images on production. Local development references may live in the gitignored dev-assets/ folder.
