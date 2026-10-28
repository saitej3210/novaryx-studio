# NOVARYX Studio — digital agency portfolio

A lightweight static website built with HTML, CSS and vanilla JavaScript. No build step, paid libraries, API keys or backend are required for the demo.

## Run locally on Windows
**The 3D hero uses ES modules, so serve the folder over HTTP** (opening `index.html` by double-click still works, but shows the CSS fallback visual instead of the 3D scene).

1. Extract this ZIP.
2. Open the `studio-site` folder in VS Code.
3. Install the free **Live Server** extension if you want automatic reloads.
4. Right-click `index.html` → **Open with Live Server** (recommended, enables the 3D hero). Alternative: run `python -m http.server 8000` in the folder and open http://localhost:8000.

## Customize before publishing

### 1. Business identity
- The current proposed brand is `NOVARYX`. Before publishing, verify name, domain and trademark availability. If you choose another brand, replace NOVARYX in `index.html` and update the page metadata.
- Update the page title, description and footer.
- Update the About section so it accurately describes you.

### 2. Contact information
Open `script.js` and edit the `CONFIG` object:
- `whatsappNumber`: configured to `917569324738` (India country code + number, digits only).
- `email`: configured to `saitejakodi3@gmail.com`.
- `greeting`: the default WhatsApp message.

The contact form does not submit to a server. It validates the fields and opens your WhatsApp chat with the client details and project brief prefilled. The client must press Send in WhatsApp; browsers do not allow a website to send a WhatsApp message silently. The email path opens the visitor's email app.

### 3. Portfolio and pricing
- Edit `PROJECTS` in `script.js` to change concept cards and previews.
- The three starter prices are ₹999, ₹1,399 and ₹1,899. These are for simple static website scopes only. Domain, hosting, online payments, booking systems and backend features are excluded and should be discussed separately before confirming a quote.
- Concept projects must remain labelled as concepts until they are real client work.
- Domain, hosting, advanced forms, bookings, payments and ongoing maintenance should be scoped and priced separately.

### 4. Social link
Replace the placeholder Instagram link in `index.html` and update the social-link handling in `script.js` if you add a real profile.

## Deploy
For a static site, you can use a suitable free hosting tier such as GitHub Pages or Netlify. Review the provider's current terms and usage limits. A custom domain may cost extra.

## Pre-launch checklist
- [ ] Replace all name, phone, email and social placeholders.
- [ ] Check the pricing and included features.
- [ ] Test every navigation link, button and concept preview.
- [ ] Test contact form validation and both contact paths.
- [ ] Check at 360px, tablet and desktop widths.
- [ ] Test keyboard navigation and reduced-motion mode.
- [ ] Check there are no broken assets or browser-console errors.
- [ ] Keep fictional portfolio work labelled as concept work.

## Brand and visual system
- Proposed brand: NOVARYX Studio. This name has not been checked for domain or trademark availability. Do not use a registered trademark symbol unless registration is verified.
- Palette: near-black, soft white, lime accent.
- Hero uses a locally bundled Three.js scene with CSS fallback.
- The scrolling signal strip and manifesto section are visual storytelling elements, not customer metrics.

## 3D / cinematic upgrade notes
- `hero3d.js` — Three.js scene (r160, MIT). Three.js is vendored locally in `vendor/three/` (no CDN, no npm install, no build step). Its licence is in `vendor/three/LICENSE`.
- The 3D scene loads lazily. If WebGL or module loading fails, the original CSS browser-mockup hero is shown automatically.
- `prefers-reduced-motion`: intro and headline animation are skipped and the 3D object is rendered still. Mobile uses lower geometry detail and a lower pixel ratio. Rendering pauses when the hero is off-screen or the tab is hidden.
- The intro has a Skip button, auto-ends after about 3 s, and is skipped on repeat visits in the same browser session.
- Deploy: upload the whole folder (including `vendor/`) to GitHub Pages or Netlify; no settings needed.
- Earlier baseline build notes reported a headless Chromium check; that result does not apply to this newest upgrade. Check this version on your laptop and a real phone before launch.

## NOVARYX motion upgrade (Anime.js)
- **Audit result:** plain HTML/CSS/JS plus Three.js. No React or Tailwind, so Motion (motion.dev), shadcn/ui, Kokonut UI and bklit.com (React chart components built on shadcn/ui, not relevant to this site) were used as interaction references only. No framework was added.
- `motion.js` — Anime.js v4.0.2 (MIT, vendored in `vendor/animejs/`, no install needed): brand-reveal timeline (SVG "N" line-draw, letter-by-letter wordmark), headline/hero entrance, and section-heading reveals. Anime only animates those elements; hover, tilt and card reveals stay CSS, so transforms don't collide.
- If `motion.js` fails to load, the original CSS intro runs instead. Intro has Skip button and Esc; auto-ends after about 4.5 s at most; skipped on repeat visits and with reduced motion.
- `hero3d.js` — entrance now starts when the intro finishes; camera follows the mouse and scroll (parallax and dolly); rendering pauses off-screen; all resources are disposed on page hide.
- Still no React/Motion/shadcn: add them only if you migrate to React + Tailwind later.

## Testing status
- `node --check` passes for `script.js`, `motion.js`, and `hero3d.js` after the Interactive Design Lab additions.
- The ZIP and file structure should be checked after packaging.
- A fresh browser-rendering run for this exact upgraded version did not complete in the available test environment. Therefore the latest visual output, interaction behaviour, console errors, and frame rate are NOT claimed as fully browser-verified.
- Please test on your laptop at desktop and mobile widths, switch all three design-lab styles, toggle Desktop/Mobile preview, filter the portfolio, open each concept preview, and test the contact form before publishing.


## Interactive Design Lab upgrade
- `index.html` includes a new Interactive Design Lab section with Hospitality, Fashion and Technology art directions plus desktop/mobile viewport toggles.
- The portfolio has category filters (All, Hospitality, Fashion, Technology) with accessible pressed states.
- `style.css` contains the design-lab responsive layouts, polished mock browser preview, moving abstract art object, and restrained cursor spotlight.
- `script.js` handles category filtering and updates the live concept preview without a reload.
- This project remains plain HTML/CSS/JavaScript with the existing vendored Three.js and Anime.js. Motion.dev, shadcn/ui and Kokonut UI are React-oriented in their common setup; they were not added as dependencies because that would require a framework migration for limited benefit. Their general interaction patterns informed the controls, while the current stack remains lightweight and easy to host.
- The preview is a visual concept demonstration, not a real customer website. Replace placeholder contact details before public launch.


## NOVARYX full conversion upgrade
- `demos/index.html?theme=hospitality`, `?theme=fashion`, and `?theme=technology` are standalone responsive concept websites. The main Design Lab and portfolio cards link to these full previews.
- The case-study dialog now includes design intent, concept feature tags, a live demo link, and a CTA that pre-fills the enquiry form.
- The contact section includes a live brief summary and a copy-brief action. Concept-to-contact handoff uses same-origin local storage when the visitor chooses “Build a site like this”.
- The enquiry form deliberately refuses to open a placeholder WhatsApp number or placeholder email. Before publishing, edit `CONFIG.whatsappNumber` and `CONFIG.email` at the top of `script.js`. WhatsApp should be country code + number digits only (India format: `91XXXXXXXXXX`).
- `demos/demo.css` uses local system font stacks and does not require a remote font download. The concept pages are fictional examples; replace details and prices with real client-approved content for any commercial deployment.
- The Three.js hero now includes a faceted glass-like accent object and a secondary orbit to create more depth. Performance and appearance still need checking on your laptop and a real mobile device before public launch.
- Validation performed for this build: JavaScript syntax checks and ZIP/file-path integrity checks. A headless browser run was blocked by the current test environment, so full browser rendering is not claimed as verified for this exact build.
