/* Anime.js choreography: intro timeline, headline/hero entrance, section-heading reveals.
   Anime owns ONLY the elements listed here; CSS keeps hover/tilt/card reveals, so transforms never collide. */
import { createTimeline, animate, stagger, svg } from "animejs";

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = "http://www.w3.org/2000/svg";
const ease = "outExpo";
let introTl = null;

/* Brand reveal: SVG "N" draws itself, wordmark rises letter by letter, then the overlay lifts. Resolves when finished or skipped. */
export function playIntro(intro) {
  return new Promise(resolve => {
    const sym = $(".intro-symbol", intro), logo = $(".intro-logo", intro), cap = $(".intro-caption", intro);
    const svgEl = document.createElementNS(NS, "svg");
    svgEl.setAttribute("viewBox", "0 0 54 54"); svgEl.setAttribute("aria-hidden", "true"); svgEl.classList.add("intro-n");
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M17 39V15l20 24V15");
    svgEl.append(path); sym.append(svgEl);

    // wrap wordmark letters (keep the trademark span intact)
    const word = logo.firstChild; let letters = [];
    if (word && word.nodeType === 3) {
      const f = document.createDocumentFragment();
      [...word.textContent].forEach(ch => { const s = document.createElement("span"); s.className = "ltr"; s.textContent = ch; f.append(s); letters.push(s); });
      word.replaceWith(f);
    }
    logo.setAttribute("aria-label", "NOVARYX");

    const done = () => { introTl = null; resolve(); };
    introTl = createTimeline({ defaults: { ease }, onComplete: done })
      .add(sym, { opacity: [0, 1], scale: [0.7, 1], rotate: ["-24deg", "-8deg"], duration: 900 }, 0)
      .add(svg.createDrawable(path), { draw: ["0 0", "0 1"], duration: 1000, ease: "inOutQuad" }, 150)
      .add(letters, { opacity: [0, 1], translateY: ["60%", "0%"], duration: 800, delay: stagger(55) }, 500)
      .add(logo.lastElementChild || logo, { opacity: [0, 1], duration: 500 }, 1100)
      .add(cap, { opacity: [0, 1], translateY: ["8px", "0px"], duration: 600 }, 1000)
      .add(intro, { opacity: [1, 0], duration: 550, ease: "inOutQuad" }, 2050);
  });
}
export function skipIntro() { if (introTl) { const t = introTl; introTl = null; t.pause(); } }

/* Hero entrance: headline words, supporting copy, then the 3D stage fades in behind. */
export function heroIn() {
  const words = $$("h1.split .w>span");
  const tl = createTimeline({ defaults: { ease } });
  if (words.length) tl.add(words, { translateY: ["110%", "0%"], duration: 1100, delay: stagger(70) }, 0);
  const rest = $$(".hero-copy > :not(h1)");
  if (rest.length) tl.add(rest, { opacity: [0, 1], translateY: ["18px", "0px"], duration: 900, delay: stagger(90) }, 350);
  const vis = $("#hero-visual");
  if (vis) tl.add(vis, { opacity: [0, 1], duration: 1200, ease: "outQuad" }, 150);
  return new Promise(r => { tl.then ? tl.then(() => r()) : r(); }).then(() => {
    document.documentElement.classList.add("h1-in");
    [...words, ...rest, vis].filter(Boolean).forEach(el => { el.style.transform = ""; el.style.opacity = ""; });
  });
}

/* Section heading reveals (eyebrow, h2, lead). A scroll check (not IntersectionObserver) also catches sections skipped by anchor jumps. */
export function sectionReveals() {
  const groups = $$("main section:not(.hero) > .container, .manifesto-section .manifesto-grid > div:nth-child(2)");
  let pending = [];
  groups.forEach(g => {
    const els = $$(":scope > .eyebrow, :scope > h2, :scope > .lead", g);
    if (els.length) { els.forEach(e => e.classList.add("pre")); pending.push({ g, els }); }
  });
  let tick = false;
  const check = () => {
    tick = false;
    const limit = innerHeight * 0.88;
    pending = pending.filter(({ g, els }) => {
      if (g.getBoundingClientRect().top > limit) return true;
      els.forEach(e => e.classList.remove("pre"));
      animate(els, { opacity: [0, 1], translateY: ["22px", "0px"], duration: 900, delay: stagger(90), ease,
        onComplete: () => els.forEach(e => { e.style.opacity = ""; e.style.transform = ""; }) });
      return false;
    });
    if (!pending.length) off();
  };
  const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(check); } };
  const off = () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
  check();
  return off;
}


/* Small, deliberate transition for the interactive design lab. Kept separate from card hover transforms. */
export function animateDemoSwitch(stage) {
  const page = stage && $(".demo-page", stage);
  if (!page || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  animate(page, { opacity: [0.62, 1], translateY: ["7px", "0px"], duration: 420, ease: "outExpo" });
}
