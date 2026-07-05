# FarmChain Receipts — Landing Page

A static landing page explaining the protocol. No build step required.

## Run locally

```bash
cd web
python3 -m http.server 8081
# then open http://localhost:8081
```

Or open `index.html` directly in a browser.

## Design notes

- The hero visual shows a receipt receiving a verification stamp
  (CSS-animated, drawn once on load) — a literal depiction of "this
  receipt becomes checkable on-chain," not generic document iconography.
- Shares the Baobab Labs indigo/cream/gold palette for org consistency,
  with green as the primary action color here (vs. terracotta in
  diaspora-circle) to keep each repo visually distinguishable at a glance.
- No frameworks or build tooling — deploy directly via GitHub Pages,
  Netlify, or any static host.
