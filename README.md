# Beyond Basik Income Tax — Business Website

A responsive, six-page public website for Beyond Basik Income Tax, a Detroit-based tax services business. Built with HTML, CSS, and vanilla JavaScript, and deployed on Vercel.

**Live website:** https://beyond-basik-website.vercel.app

## Pages

- `/` — Home
- `/services` — Services
- `/how-it-works` — How It Works
- `/why-us` — Why Us
- `/reviews` — Google Reviews call to action
- `/contact` — Phone, social profiles, and business location

## Local preview

From the repository root, run:

```powershell
py -m http.server 3000
```

Then open http://localhost:3000. There is no package manager, application server, or environment file required for this static frontend.

## Project layout

- `assets/css/styles.css` — shared responsive styling
- `assets/js/main.js` — mobile navigation, transitions, and interactions
- `assets/img/` — brand imagery
- `assets/icons/ui.svg` — shared interface icons
- `vercel.json` — Vercel routing and asset cache configuration

## Client site notes

The header, mobile navigation, and footer each contain navigation links intentionally. Shared CSS and JavaScript are centralized, while each page has its own HTML for static hosting.

Business contact information, social/review/map URLs, and claims shown on the website belong to the client and should be confirmed with them before changing. No client records, tax documents, or backend database are part of this repository.

## Deployment

The production Vercel project is connected to the GitHub `main` branch. Commit changes to `main` only after local checks; Vercel then builds a new production deployment automatically. Verify the deployment status and live pages before considering the release complete.
