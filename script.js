/* ---------- CONFIG: edit these ---------- */
const CONFIG = {
  whatsappNumber: "917569324738", // India country code + number, digits only
  email: "saitejakodi3@gmail.com",
  greeting: "Hi NOVARYX! I'd like to discuss a website project.",
};
/* Concept projects (edit or add). All are CONCEPT work, not real clients. */
const PROJECTS = [
  { id:"cafe", title:"Ember &amp; Oak", cat:"Restaurant / cafe", c1:"#c2703d", c2:"#2a1a12", cls:"pv-cafe",
    goal:"A warm, editorial hospitality concept with a menu-first layout and clear visit information.", demoUrl:"demos/index.html?theme=hospitality", tags:["Menu","Opening hours","Map link"], hero:"Slow coffee. Good bread.", cta:"View menu" },
  { id:"boutique", title:"Marlowe Boutique", cat:"Fashion / boutique", c1:"#d9a5b3", c2:"#1d1418", cls:"pv-boutique",
    goal:"A fashion-forward editorial storefront concept built around collection discovery.", demoUrl:"demos/index.html?theme=fashion", tags:["Lookbook","Product grid","Instagram link"], hero:"The new season edit", cta:"Shop collection" },
  { id:"tech", title:"Northbeam Consulting", cat:"Technology / business", c1:"#3d7bff", c2:"#0b1220", cls:"pv-tech",
    goal:"A confident, structured business concept that makes complex services easier to understand.", demoUrl:"demos/index.html?theme=technology", tags:["Services","Case study layout","Contact CTA"], hero:"Clear tech for growing teams", cta:"Book a call" }
];
document.documentElement.classList.add("js");
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const wa = t => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t)}`;

/* Mobile nav + header */
const header = $(".site-header"), toggle = $(".nav-toggle");
const setMenu = o => { header.classList.toggle("open", o); toggle.setAttribute("aria-expanded", o); toggle.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
toggle.addEventListener("click", () => setMenu(!header.classList.contains("open")));
$("#site-nav").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && header.classList.contains("open")) { setMenu(false); toggle.focus(); } });
addEventListener("resize", () => { if (innerWidth > 820) setMenu(false); });
const onScroll = () => header.classList.toggle("scrolled", scrollY > 10);
onScroll(); addEventListener("scroll", onScroll, { passive:true });
const progressBar = $("#scroll-progress span");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
};
updateProgress(); addEventListener("scroll", updateProgress, { passive: true }); addEventListener("resize", updateProgress);

/* Contact links */
const hasWhatsApp = () => /^\d{10,15}$/.test(CONFIG.whatsappNumber) && !/^0+$/.test(CONFIG.whatsappNumber);
const hasEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONFIG.email) && !CONFIG.email.includes("example.com");
$$("[data-whatsapp]").forEach(a => { a.href = hasWhatsApp() ? wa(CONFIG.greeting) : "#contact"; if (hasWhatsApp()) { a.target = "_blank"; a.rel = "noopener"; } else { a.title = "Add your WhatsApp number in script.js before launch"; a.textContent = "WhatsApp (setup needed)"; } });
$$("[data-mail]").forEach(a => { a.href = hasEmail() ? "mailto:" + CONFIG.email : "#contact"; a.textContent = hasEmail() ? CONFIG.email : "Email (configure before launch)"; });
$$("[data-social]").forEach(a => a.addEventListener("click", e => e.preventDefault()));

/* Portfolio cards + preview dialog */
const grid = $("#work-grid"), dlg = $("#preview");
grid.innerHTML = PROJECTS.map(p => `<article class="card work-card" data-category="${p.id}"><div class="thumb ${p.cls}" style="--c1:${p.c1};--c2:${p.c2}"><span class="thumb-ui"><i></i><i></i><i></i></span><span class="thumb-title">${p.title}</span><span class="thumb-corner">NX / ${p.id.toUpperCase()}</span></div>
<p class="eyebrow small">${p.cat} &middot; Concept study</p><p>${p.goal}</p><ul class="chips">${p.tags.map(t=>`<li>${t}</li>`).join("")}</ul>
<div class="work-card-actions"><button class="btn btn-ghost" data-open="${p.id}">Case study <span aria-hidden="true">↗</span></button><a class="text-link" href="${p.demoUrl}" target="_blank" rel="noopener">Live demo ↗</a></div></article>`).join("");
/* Portfolio category filters: accessible, instant, no page reload. */
const filterButtons = $$("[data-filter]");
filterButtons.forEach(button => button.addEventListener("click", () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(b => { const active = b === button; b.classList.toggle("is-active", active); b.setAttribute("aria-pressed", String(active)); });
  $$(".work-card", grid).forEach(card => {
    const show = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-filtered-out", !show);
    card.setAttribute("aria-hidden", String(!show));
  });
}));

grid.addEventListener("click", e => {
  const b = e.target.closest("[data-open]"); if (!b) return;
  const p = PROJECTS.find(x => x.id === b.dataset.open);
  $("#pv-body").innerHTML = `<div class="pv ${p.cls}" style="--c1:${p.c1};--c2:${p.c2}"><nav><span>${p.title}</span><span>CONCEPT STUDY / ${p.id.toUpperCase()}</span></nav>
  <div class="pv-hero"><p class="pv-kicker">${p.cat} / DESIGN DIRECTION</p><h4>${p.hero}</h4><span class="pv-btn">${p.cta} ↗</span></div><div class="pv-tiles"><i><b>01</b><span>Clear hierarchy</span></i><i><b>02</b><span>Responsive layout</span></i><i><b>03</b><span>Enquiry path</span></i></div></div>
  <div class="case-study-copy"><div><p class="eyebrow">Design intent</p><p>${p.goal}</p><p class="muted small">Self-initiated concept project. This is not a real client engagement or a live commercial business.</p></div><div><p class="eyebrow">Experience features</p><ul class="case-tags">${p.tags.map(t=>`<li>${t}</li>`).join("")}</ul><p class="muted small">Responsive structure · Clear calls to action · Brand-led visual direction</p></div></div>
  <div class="case-actions"><a class="btn btn-primary" href="${p.demoUrl}" target="_blank" rel="noopener">Explore full live demo ↗</a><button class="btn btn-ghost" type="button" data-case-enquire="${p.id}">Build something like this</button></div>`;
  dlg.showModal();
});
$("#pv-close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
$("#pv-body").addEventListener("click", e => { const b = e.target.closest("[data-case-enquire]"); if (!b) return; const p = PROJECTS.find(x => x.id === b.dataset.caseEnquire); try { localStorage.setItem("novaryx_interest", `${p.title} concept — ${p.cat} website`); } catch (_) {} dlg.close(); location.hash = "contact"; applySavedInterest(); });

/* Pricing buttons prefill the form */
$$("[data-pick]").forEach(a => a.addEventListener("click", () => {
  const m = $("#enquiry [name=message]"); if (!m.value) m.value = `I'm interested in the ${a.dataset.pick} package. `;
}));

/* Enquiry form: validate, then open WhatsApp or email (no fake submit) */
const form = $("#enquiry"), status = $("#form-status");
form.addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form)), bad = [];
  const ok = (n, c) => { const el = form.elements[n]; el.setAttribute("aria-invalid", !c); if (!c) bad.push(el); };
  ok("name", d.name.trim().length > 1);
  ok("contact", /^\S+@\S+\.\S+$/.test(d.contact.trim()) || /^[+\d][\d\s-]{7,}$/.test(d.contact.trim()));
  ok("type", d.type !== "");
  ok("message", d.message.trim().length >= 10);
  if (bad.length) { status.className = "full status err"; status.textContent = "Please fix the highlighted fields: valid name, email or phone, website type and a short description."; bad[0].focus(); return; }
  const text = `NOVARYX WEBSITE ENQUIRY\nName: ${d.name}\nBusiness: ${d.business || "Not provided"}\nClient email/phone: ${d.contact}\nWebsite type: ${d.type}\nSelected package/budget: ${d.budget || "Not selected"}\nProject details: ${d.message}\n\nPlease contact me to discuss availability, scope and payment.\nEnquiry received via NOVARYX website.`;
  const mail = e.submitter && e.submitter.dataset.channel === "mail";
  status.className = "full status";
  status.textContent = mail ? "Your email app should open. Your enquiry is not sent until you press send there." : "WhatsApp should open. Your enquiry is not sent until you press send there.";
  if (mail && !hasEmail()) { status.className = "full status err"; status.textContent = "Email is not configured yet. Check CONFIG.email in script.js, then test again."; return; }
  if (!mail && !hasWhatsApp()) { status.className = "full status err"; status.textContent = "WhatsApp is not configured yet. Check CONFIG.whatsappNumber in script.js. Use country code + number, digits only. Your enquiry has not been sent."; return; }
  if (mail) location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(text)}`;
  else window.open(wa(text), "_blank", "noopener");
});

/* Hero parallax (desktop, motion allowed) */
const vis = $(".hero-visual");
if (matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches) {
  $(".hero").addEventListener("mousemove", e => {
    vis.style.setProperty("--mx", (e.clientX / innerWidth - .5).toFixed(2));
    vis.style.setProperty("--my", (e.clientY / innerHeight - .5).toFixed(2));
  });
}

/* Scroll reveal */
const items = $$(".reveal, .card, .step"); items.forEach(el => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { threshold:.12 });
  items.forEach(el => io.observe(el));
} else items.forEach(el => el.classList.add("visible"));
/* Live project brief summary + handoff from a standalone concept demo. */
const briefFields = { type: $("#brief-type"), budget: $("#brief-budget"), business: $("#brief-business") };
function updateBriefSummary() {
  if (!form || !briefFields.type) return;
  briefFields.type.textContent = form.elements.type.value || "Not selected";
  briefFields.budget.textContent = form.elements.budget.value || "Not sure yet";
  briefFields.business.textContent = form.elements.business.value.trim() || "Not provided";
}
function applySavedInterest() {
  let interest = "";
  try { interest = localStorage.getItem("novaryx_interest") || ""; if (interest) localStorage.removeItem("novaryx_interest"); } catch (_) {}
  if (interest && form) {
    const message = form.elements.message;
    message.value = `I'm interested in a website inspired by the ${interest}. Please contact me to discuss scope and pricing.`;
    const type = form.elements.type;
    if (/fashion|boutique/i.test(interest)) type.value = "Business website";
    else if (/technology|consulting/i.test(interest)) type.value = "Business website";
    else if (/hospitality|cafe|restaurant/i.test(interest)) type.value = "Restaurant / cafe";
    updateBriefSummary();
  }
}
if (form) { form.addEventListener("input", updateBriefSummary); form.addEventListener("change", updateBriefSummary); }
$("#copy-brief")?.addEventListener("click", async () => {
  const d = Object.fromEntries(new FormData(form));
  const text = `NOVARYX PROJECT BRIEF\nName: ${d.name || "-"}\nBusiness: ${d.business || "-"}\nContact: ${d.contact || "-"}\nWebsite type: ${d.type || "Not selected"}\nBudget: ${d.budget || "Not sure yet"}\nDescription: ${d.message || "-"}`;
  const copyStatus = $("#copy-status");
  try { await navigator.clipboard.writeText(text); copyStatus.textContent = "Project brief copied. You can paste it into a message or notes."; }
  catch (_) { copyStatus.textContent = "Clipboard access was blocked. Select the form details and copy them manually."; }
});
applySavedInterest(); updateBriefSummary();

/* Interactive scope estimator: transparent planning range, never a binding quote. */
const estimateType = $("#estimate-type"), estimatePages = $("#estimate-pages");
const estimateBase = { landing:999, business:1399, portfolio:1899, restaurant:1399, shop:1899 };
const estimateNames = { landing:"Landing page", business:"Business website", portfolio:"Portfolio website", restaurant:"Restaurant / cafe", shop:"Online store" };
const formatINR = n => "₹" + Math.round(n).toLocaleString("en-IN");
function refreshEstimate() {
  if (!estimateType || !estimatePages) return;
  const type = estimateType.value, pages = Number(estimatePages.value);
  // The three advertised packages are fixed. Optional integrations are not included in these starter prices.
  const tier = pages <= 1 ? 999 : pages <= 3 ? 1399 : 1899;
  const checks = $$(".estimate-features input[type=checkbox]:checked");
  const extras = 0;
  const total = tier;
  const low = tier, high = tier;
  $("#page-count-label").textContent = `${pages} ${pages === 1 ? "page" : "pages"}`;
  $("#estimate-price").textContent = formatINR(total);
  $("#estimate-summary").textContent = `${estimateNames[type]} · ${pages} ${pages === 1 ? "page" : "pages"} · ${pages <= 1 ? "Starter" : pages <= 3 ? "Standard" : "Plus"} package`;
  $("#estimate-breakdown").innerHTML = `<li><span>Selected package</span><strong>${formatINR(total)}</strong></li><li><span>Optional integrations</span><strong>Quoted separately</strong></li>`;
  const budget = tier === 999 ? "₹999 — Starter" : tier === 1399 ? "₹1,399 — Standard" : "₹1,899 — Plus";
  const use = $("#use-estimate");
  const featureText = checks.map(input => input.parentElement.textContent.trim().replace(/\s+\+₹[\d,]+$/, "")).join(", ");
  if (use) {
    use.dataset.estimateType = type;
    use.dataset.estimatePages = String(pages);
    use.dataset.estimateBudget = budget;
    use.dataset.estimateRange = formatINR(total);
    use.dataset.estimateFeatures = featureText || "No optional features selected";
  }
}
if (estimateType && estimatePages) {
  estimateType.addEventListener("change", refreshEstimate); estimatePages.addEventListener("input", refreshEstimate);
  $$(".estimate-features input").forEach(input => input.addEventListener("change", refreshEstimate));
  $("#use-estimate").addEventListener("click", e => {
    const b = e.currentTarget;
    const typeMap = { landing:"Landing page", business:"Business website", portfolio:"Portfolio website", restaurant:"Restaurant / cafe", shop:"Business website" };
    form.elements.type.value = typeMap[b.dataset.estimateType] || "Business website";
    form.elements.budget.value = b.dataset.estimateBudget || "Not sure yet";
    const featureText = b.dataset.estimateFeatures || "No optional features selected";
    form.elements.message.value = `Please quote for a ${estimateNames[b.dataset.estimateType] || "website"} with ${b.dataset.estimatePages} page(s). Indicative planning range: ${b.dataset.estimateRange}. Optional features: ${featureText}. Please confirm final scope and price.`;
    updateBriefSummary(); location.hash = "contact"; form.elements.message.focus();
  });
  refreshEstimate();
}


$("#year").textContent = new Date().getFullYear();

/* ---------- Cinematic upgrade ---------- */
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* Intro + hero entrance. Anime.js drives the timeline; if it fails to load, the original CSS intro runs. */
const intro = $("#intro"), root = document.documentElement;
const h1 = $("h1");
if (!calm) {
  let n = 0;
  const wrap = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()) { f.append(t); return; } const o = document.createElement("span"); o.className = "w"; const i = document.createElement("span"); i.textContent = t; i.style.setProperty("--i", n++); o.append(i); f.append(o); });
      c.replaceWith(f);
    } else if (c.nodeType === 1) wrap(c);
  });
  wrap(h1); h1.classList.add("split");
}
const markReady = () => { root.classList.add("ready"); dispatchEvent(new Event("novaryx:ready")); };
const endIntro = () => { intro.classList.add("done"); markReady(); try { sessionStorage.setItem("seen", "1"); } catch (e) {} };
(async () => {
  if (calm || root.classList.contains("seen")) { intro.remove(); markReady(); root.classList.add("h1-in"); return; }
  let m = null;
  try { m = await import("./motion.js"); } catch (err) { console.info("Anime.js unavailable, CSS intro fallback:", err.message); }
  if (!m) { // fallback: original CSS intro
    $("#intro-skip").addEventListener("click", endIntro);
    intro.addEventListener("animationend", e => { if (e.animationName === "introOut") endIntro(); });
    setTimeout(endIntro, 3000); return;
  }
  root.classList.add("am");
  let finished = false;
  const finish = () => { if (finished) return; finished = true; endIntro(); m.heroIn().catch(() => root.classList.add("h1-in")); };
  $("#intro-skip").addEventListener("click", () => { m.skipIntro(); finish(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !finished) { m.skipIntro(); finish(); } });
  m.playIntro(intro).then(finish);
  setTimeout(finish, 4500); // safety net: never trap the visitor behind the intro
  m.sectionReveals();
})();

/* 3D hero (lazy, with CSS fallback) */
const hv = $("#hero-visual");
(async () => {
  if (calm && !hv) return;
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) throw new Error("no webgl");
    const { initHero } = await import("./hero3d.js");
    initHero(hv); hv.classList.add("gl");
  } catch (err) { console.info("3D hero unavailable, using CSS visual:", err.message); }
})();

/* Card tilt + cursor light, magnetic CTAs (desktop only) */
if (fine && !calm) {
  $$(".card").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--px", x * 100 + "%"); c.style.setProperty("--py", y * 100 + "%");
    if (c.classList.contains("work-card")) c.style.transform = `perspective(900px) rotateY(${(x - .5) * 8}deg) rotateX(${(.5 - y) * 8}deg) translateY(-4px)`;
  }));
  $$(".work-card").forEach(c => c.addEventListener("pointerleave", () => c.style.transform = ""));
  $$(".btn-primary").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .2}px ${(e.clientY - r.top - r.height / 2) * .3}px`; });
    b.addEventListener("pointerleave", () => b.style.translate = "");
  });
}
/* Subtle global pointer light: enhances depth without introducing a custom cursor. */
if (fine && !calm) {
  const hero = $(".hero");
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--hero-x", `${e.clientX - r.left}px`);
    hero.style.setProperty("--hero-y", `${e.clientY - r.top}px`);
  }, { passive: true });
}
/* Active nav indicator */
if ("IntersectionObserver" in window) {
  const links = $$(".site-nav ul a"), map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
  const so = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a === map.get(en.target.id))); }), { rootMargin: "-45% 0px -50% 0px" });
  map.forEach((_, id) => { const el = document.getElementById(id); if (el) so.observe(el); });
}


/* Interactive design lab: let visitors compare three visual directions and desktop/mobile layouts. */
const demoStage = $(".playground-stage");
if (demoStage) {
  const demoCopy = {
    hospitality: {
      caption: "Warm editorial layouts, clear menus and inviting details.",
      brand: "MORNING / FORM", overline: "DESIGNED FOR THE EVERYDAY", title: "Good things|take time.",
      description: "Thoughtful food, considered spaces and a little room to slow down.", button: "Explore the menu", left: "GOOD FOOD. GOOD COMPANY.", right: "17° 23' N — OPEN TODAY ↗"
    },
    fashion: {
      caption: "Editorial typography, confident imagery and a considered collection story.",
      brand: "MAISON / MARLOWE", overline: "THE NEW SEASON, CONSIDERED", title: "Wear your|own story.",
      description: "A quieter kind of statement. Pieces chosen with intention, made to be lived in.", button: "Explore the edit", left: "A STUDY IN FORM & FEELING", right: "NEW SEASON — 01 / 06 ↗"
    },
    technology: {
      caption: "Structured layouts, sharp hierarchy and confident product storytelling.",
      brand: "NORTHBEAM / SYSTEMS", overline: "CLARITY FOR WHAT COMES NEXT", title: "Make complex|feel clear.",
      description: "Practical digital systems for teams ready to move with more focus.", button: "Explore solutions", left: "DESIGNED FOR MOMENTUM", right: "SYSTEM STATUS — OPTIMAL ↗"
    }
  };
  const setText = (selector, value) => { const el = $(selector, demoStage); if (el) el.textContent = value; };
  let demoMotion = null;
  import("./motion.js").then(module => { demoMotion = module; }).catch(() => {});
  const setDemoTheme = (theme) => {
    const data = demoCopy[theme] || demoCopy.hospitality;
    demoStage.dataset.demo = theme;
    const fullDemoLink = $("#full-demo-link");
    if (fullDemoLink) fullDemoLink.href = `demos/index.html?theme=${theme}`;
    $$("[data-demo-theme]").forEach(button => { const active = button.dataset.demoTheme === theme; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    setText("#demo-caption", data.caption);
    setText(".demo-brand", data.brand);
    setText(".demo-overline", data.overline);
    const title = $("#demo-title", demoStage);
    if (title) { const [first, second] = data.title.split("|"); title.replaceChildren(document.createTextNode(first), document.createElement("br")); const em = document.createElement("em"); em.textContent = second; title.append(em); }
    setText("#demo-description", data.description);
    const button = $("#demo-button-label", demoStage);
    if (button) { button.replaceChildren(document.createTextNode(data.button + " ")); const arrow = document.createElement("b"); arrow.textContent = "↗"; button.append(arrow); }
    setText("#demo-bottom-left", data.left);
    setText("#demo-bottom-right", data.right);
    if (demoMotion && theme !== demoStage.dataset.previousDemo) demoMotion.animateDemoSwitch(demoStage);
    demoStage.dataset.previousDemo = theme;
  };
  $$('[data-demo-theme]').forEach(button => button.addEventListener("click", () => setDemoTheme(button.dataset.demoTheme)));
  $$('[data-device]').forEach(button => button.addEventListener("click", () => {
    const mobile = button.dataset.device === "mobile";
    demoStage.classList.toggle("is-mobile", mobile);
    $$('[data-device]').forEach(b => { const active = b === button; b.classList.toggle("is-active", active); b.setAttribute("aria-pressed", String(active)); });
  }));
  setDemoTheme("hospitality");
}
