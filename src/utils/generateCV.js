/*  Premium A4 CV generator
    -----------------------------------------------------------
    Single source of truth for the downloadable PDF.
    Layout : header band (dark) + sidebar (left, light) + main column (right).
    Generous margins, consistent rhythm, page-break safe.

    Color, type, spacing decisions follow the on-site "Architecte Minimal"
    system: deep ink, electric blue accent, muted graphite for body copy.
*/

/* ----------- Design tokens ----------- */
const PAGE = { w: 210, h: 297 };
const HEADER_H = 36;          // dark header band
const SIDEBAR_W = 68;         // left sidebar
const MAIN_X = SIDEBAR_W + 12;
const MAIN_W = PAGE.w - MAIN_X - 12;
const SIDEBAR_PAD = 9;
const FOOTER_Y = PAGE.h - 10;

const COLOR = {
  ink: [22, 24, 32],
  blue: [46, 91, 255],
  blueDeep: [30, 63, 184],
  blueSoft: [200, 215, 255],
  graphite: [60, 64, 75],
  mute: [128, 132, 145],
  rule: [220, 224, 230],
  snow: [255, 255, 255],
  paper: [248, 249, 252],
  sidebarBg: [243, 245, 250],
};

const T = {
  /* Helvetica is mapped to a WinAnsi-safe stack at PDF level.
     We keep French accents as-is — jsPDF transcodes correctly. */
  family: "helvetica",
};

/* ----------- Helpers ----------- */
function setFill(doc, [r, g, b]) {
  doc.setFillColor(r, g, b);
}
function setText(doc, [r, g, b]) {
  doc.setTextColor(r, g, b);
}
function setDraw(doc, [r, g, b]) {
  doc.setDrawColor(r, g, b);
}

function drawHeader(doc) {
  setFill(doc, COLOR.ink);
  doc.rect(0, 0, PAGE.w, HEADER_H, "F");

  /* thin blue accent rail under header */
  setFill(doc, COLOR.blue);
  doc.rect(0, HEADER_H, PAGE.w, 1.4, "F");

  /* identity block (left) */
  setText(doc, COLOR.snow);
  doc.setFont(T.family, "bold");
  doc.setFontSize(22);
  doc.text("MOUHAMED DIONE", 12, 16, { charSpace: 0.8 });

  setText(doc, COLOR.blueSoft);
  doc.setFont(T.family, "normal");
  doc.setFontSize(9.5);
  doc.text(
    "Developpeur Web  ·  Communication Digitale",
    12,
    22.5,
    { charSpace: 0.2 }
  );

  /* contact block (right) */
  setText(doc, COLOR.snow);
  doc.setFont(T.family, "normal");
  doc.setFontSize(8);
  const rx = PAGE.w - 12;
  const ry = 12.5;
  const lh = 3.6;
  doc.text("dionemhd1@gmail.com", rx, ry, { align: "right" });
  doc.text("+221 77 383 13 64", rx, ry + lh, { align: "right" });
  setText(doc, COLOR.blueSoft);
  doc.text("linkedin.com/in/mouhamed-dione", rx, ry + lh * 2, { align: "right" });
  doc.text("github.com/RassoulTech", rx, ry + lh * 3, { align: "right" });

  /* small location chip top right of the band */
  setText(doc, [180, 195, 230]);
  doc.setFontSize(7);
  doc.text("Thies, Senegal", 12, 30, { charSpace: 0.5 });
}

function drawSidebarBg(doc) {
  setFill(doc, COLOR.sidebarBg);
  doc.rect(0, HEADER_H + 1.4, SIDEBAR_W, PAGE.h - HEADER_H - 1.4, "F");
}

function drawFooter(doc, pageIndex, totalPages) {
  setDraw(doc, COLOR.rule);
  doc.setLineWidth(0.2);
  doc.line(12, FOOTER_Y - 3, PAGE.w - 12, FOOTER_Y - 3);

  setText(doc, COLOR.mute);
  doc.setFont(T.family, "normal");
  doc.setFontSize(7);
  doc.text("Mouhamed Dione  ·  Curriculum Vitae", 12, FOOTER_Y);
  doc.text(
    `${String(pageIndex).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    PAGE.w - 12,
    FOOTER_Y,
    { align: "right" }
  );
}

/* Section title — main column.
   Eyebrow number + uppercase title + thin blue rule */
function mainSectionTitle(doc, num, title, x, y) {
  setText(doc, COLOR.blue);
  doc.setFont(T.family, "bold");
  doc.setFontSize(6.5);
  doc.text(`${num}`, x, y - 0.5, { charSpace: 0.8 });

  setText(doc, COLOR.ink);
  doc.setFont(T.family, "bold");
  doc.setFontSize(10.5);
  doc.text(title.toUpperCase(), x + 7, y, { charSpace: 1.2 });

  setDraw(doc, COLOR.blue);
  doc.setLineWidth(0.6);
  doc.line(x, y + 2.4, x + 14, y + 2.4);

  return y + 9;
}

function sidebarTitle(doc, title, y) {
  setText(doc, COLOR.ink);
  doc.setFont(T.family, "bold");
  doc.setFontSize(8.5);
  doc.text(title.toUpperCase(), SIDEBAR_PAD, y, { charSpace: 1 });
  setDraw(doc, COLOR.blue);
  doc.setLineWidth(0.5);
  doc.line(SIDEBAR_PAD, y + 1.8, SIDEBAR_PAD + 10, y + 1.8);
  return y + 7.5;
}

/* Ensure vertical space is available in the main column.
   When out, push a new page and reset y to top of main column. */
function ensure(doc, y, need, redrawFns) {
  if (y + need > FOOTER_Y - 8) {
    doc.addPage();
    redrawFns.forEach((fn) => fn());
    return HEADER_H + 12;
  }
  return y;
}

/* ----------- DATA ----------- */
const CV = {
  profil:
    "Developpeur web junior et gestionnaire de communication digitale, je combine la maitrise technique du developpement full-stack (PHP, Vue.js 3, JavaScript, Next.js) avec une expertise en strategie de contenu et gestion des reseaux sociaux. Rigoureux, creatif et oriente resultats, je concois des solutions numeriques performantes tout en assurant une presence digitale coherente et impactante pour une institution.",

  experiences: [
    {
      period: "2026 — Present",
      role: "Gestion-Pro — Plateforme de gestion",
      company: "Projet personnel  ·  Next.js  ·  Vercel",
      bullets: [
        "Conception et developpement d'une application web de gestion (billing & quotas) avec Next.js, deployee sur Vercel.",
        "Architecture moderne : app-router, composants serveurs, deploiement continu via GitHub.",
        "Lien : gestion-pro-jet.vercel.app",
      ],
    },
    {
      period: "2026 — Present",
      role: "DigiGeek — Personal Branding & Social Links",
      company: "Projet personnel  ·  Vue 3  ·  GitHub Pages",
      bullets: [
        "Marque digitale personnelle sur 4 plateformes (LinkedIn, Instagram, TikTok, WhatsApp).",
        "Production de contenu technique et pedagogique oriente developpement web et IT.",
        "Application Vue.js 3 de partage de profils avec QR Code dynamique, deployee sur GitHub Pages.",
        "Lien : rassoultech.github.io/DigiGeek-Social-links",
      ],
    },
    {
      period: "2025 — 2026",
      role: "Lab CCNA — Enterprise Network Simulation",
      company: "Projet technique  ·  Cisco Packet Tracer",
      bullets: [
        "Simulation d'une infrastructure reseau d'entreprise : VLAN (ADMIN/USERS), Inter-VLAN Routing.",
        "Haute disponibilite : HSRP, Spanning Tree Protocol (Root & Backup).",
        "Agregation de liens EtherChannel (LACP), attribution automatique d'adresses via DHCP.",
        "Tests valides : communication inter-VLAN, basculement HSRP, equilibrage de charge.",
      ],
    },
    {
      period: "2024 — 2025",
      role: "Cahier de Texte Numerique",
      company: "SUPDECO  ·  Application Java / JavaFX",
      bullets: [
        "Application MVC de gestion scolaire : cours, seances, utilisateurs, presences.",
        "3 dashboards distincts (Chef Admin, Enseignant, Responsable de classe), gestion des roles et acces.",
        "Stack : Java, JavaFX, MySQL, BCrypt, architecture MVC.",
      ],
    },
    {
      period: "2024",
      role: "Stage — Developpeur Web Junior",
      company: "SUPDECO Dakar",
      bullets: [
        "Plateforme de gestion de stock en PHP.",
        "Conception base de donnees, integration frontend, restitution metier.",
      ],
    },
  ],

  interets: [
    "Innovation digitale & fintech",
    "Reseaux sociaux & marketing",
    "Cybersecurite & reseaux",
    "Open source",
  ],

  contact: [
    { k: "Email", v: "dionemhd1@gmail.com" },
    { k: "Telephone", v: "+221 77 383 13 64" },
    { k: "Localisation", v: "Thies, Senegal" },
    { k: "LinkedIn", v: "mouhamed-dione" },
    { k: "GitHub", v: "RassoulTech" },
  ],

  formation: [
    {
      year: "2024 — 2026",
      diploma: "Licence 2 Informatique",
      school: "Supdeco Campus Thies",
    },
    {
      year: "2025 — 2026",
      diploma: "Creation d'applications (No-Code)",
      school: "Xarala Academy",
    },
    {
      year: "2026",
      diploma: "Reseaux CCNA1 & CCNA2",
      school: "Auto-formation en ligne",
    },
  ],

  skills: [
    {
      title: "Developpement",
      items: [
        "PHP, MySQL, REST API",
        "Vue.js 3, Vite, Next.js",
        "JavaScript ES6+, HTML5, CSS3",
        "Tailwind CSS, UI Design",
      ],
    },
    {
      title: "Communication",
      items: [
        "Gestion reseaux sociaux",
        "Strategie de contenu",
        "LinkedIn, Instagram, TikTok",
        "Personal branding",
      ],
    },
    {
      title: "Outils & Reseau",
      items: [
        "Git, GitHub, Vercel",
        "VLAN, TCP/IP, CCNA",
        "Cisco Packet Tracer",
      ],
    },
  ],

  langues: [
    { lang: "Francais", level: "Courant" },
    { lang: "Wolof", level: "Courant" },
    { lang: "Anglais", level: "Intermediaire" },
  ],

  qualites: [
    "Rigueur & sens du detail",
    "Autonomie & proactivite",
    "Adaptabilite",
    "Esprit d'analyse",
  ],
};

/* ----------- SIDEBAR ----------- */
function drawSidebarContent(doc) {
  drawSidebarBg(doc);
  let y = HEADER_H + 12;

  /* PROFIL EN BREF */
  y = sidebarTitle(doc, "Profil", y);
  setText(doc, COLOR.graphite);
  doc.setFont(T.family, "normal");
  doc.setFontSize(7.5);
  const tagline = "Developpeur full-stack qui code, redige et publie.";
  const taglineWrap = doc.splitTextToSize(tagline, SIDEBAR_W - SIDEBAR_PAD * 2);
  doc.text(taglineWrap, SIDEBAR_PAD, y);
  y += taglineWrap.length * 3.2 + 6;

  /* CONTACT */
  y = sidebarTitle(doc, "Contact", y);
  CV.contact.forEach((c) => {
    setText(doc, COLOR.mute);
    doc.setFont(T.family, "bold");
    doc.setFontSize(6.8);
    doc.text(c.k.toUpperCase(), SIDEBAR_PAD, y, { charSpace: 0.6 });

    setText(doc, COLOR.ink);
    doc.setFont(T.family, "normal");
    doc.setFontSize(8);
    const w = doc.splitTextToSize(c.v, SIDEBAR_W - SIDEBAR_PAD * 2);
    doc.text(w, SIDEBAR_PAD, y + 3.3);
    y += 3.3 + w.length * 3 + 3;
  });
  y += 3;

  /* FORMATION */
  y = sidebarTitle(doc, "Formation", y);
  CV.formation.forEach((f) => {
    setText(doc, COLOR.blue);
    doc.setFont(T.family, "bold");
    doc.setFontSize(6.8);
    doc.text(f.year.toUpperCase(), SIDEBAR_PAD, y, { charSpace: 0.6 });

    setText(doc, COLOR.ink);
    doc.setFont(T.family, "bold");
    doc.setFontSize(8.2);
    const dWrap = doc.splitTextToSize(f.diploma, SIDEBAR_W - SIDEBAR_PAD * 2);
    doc.text(dWrap, SIDEBAR_PAD, y + 3.4);

    setText(doc, COLOR.mute);
    doc.setFont(T.family, "normal");
    doc.setFontSize(7.5);
    const sWrap = doc.splitTextToSize(f.school, SIDEBAR_W - SIDEBAR_PAD * 2);
    doc.text(sWrap, SIDEBAR_PAD, y + 3.4 + dWrap.length * 3.2 + 0.6);

    y += 3.4 + dWrap.length * 3.2 + 0.6 + sWrap.length * 2.8 + 4.5;
  });

  /* COMPETENCES */
  y = sidebarTitle(doc, "Competences", y);
  CV.skills.forEach((cat) => {
    setText(doc, COLOR.ink);
    doc.setFont(T.family, "bold");
    doc.setFontSize(8);
    doc.text(cat.title, SIDEBAR_PAD, y);
    y += 3.6;

    setText(doc, COLOR.graphite);
    doc.setFont(T.family, "normal");
    doc.setFontSize(7.4);
    cat.items.forEach((it) => {
      const w = doc.splitTextToSize(it, SIDEBAR_W - SIDEBAR_PAD * 2 - 3);
      /* small blue square bullet */
      setFill(doc, COLOR.blue);
      doc.rect(SIDEBAR_PAD, y - 1.5, 1.2, 1.2, "F");
      setText(doc, COLOR.graphite);
      doc.text(w, SIDEBAR_PAD + 3, y);
      y += w.length * 2.9 + 0.6;
    });
    y += 3.5;
  });

  /* LANGUES */
  y = sidebarTitle(doc, "Langues", y);
  CV.langues.forEach((l) => {
    setText(doc, COLOR.ink);
    doc.setFont(T.family, "bold");
    doc.setFontSize(8);
    doc.text(l.lang, SIDEBAR_PAD, y);

    setText(doc, COLOR.mute);
    doc.setFont(T.family, "normal");
    doc.setFontSize(7.5);
    doc.text(l.level, SIDEBAR_W - SIDEBAR_PAD, y, { align: "right" });
    y += 4.2;
  });
  y += 3;

  /* QUALITES */
  if (y < FOOTER_Y - 25) {
    y = sidebarTitle(doc, "Qualites", y);
    setText(doc, COLOR.graphite);
    doc.setFont(T.family, "normal");
    doc.setFontSize(7.4);
    CV.qualites.forEach((q) => {
      const w = doc.splitTextToSize(q, SIDEBAR_W - SIDEBAR_PAD * 2 - 3);
      setFill(doc, COLOR.blue);
      doc.rect(SIDEBAR_PAD, y - 1.5, 1.2, 1.2, "F");
      doc.text(w, SIDEBAR_PAD + 3, y);
      y += w.length * 2.9 + 1;
    });
  }
}

/* ----------- MAIN ----------- */
function drawMainContent(doc) {
  const redraw = [() => drawHeader(doc), () => drawSidebarContent(doc)];
  let y = HEADER_H + 12;

  /* PROFIL PROFESSIONNEL */
  y = mainSectionTitle(doc, "01", "Profil professionnel", MAIN_X, y);
  setText(doc, COLOR.graphite);
  doc.setFont(T.family, "normal");
  doc.setFontSize(9);
  const profilWrap = doc.splitTextToSize(CV.profil, MAIN_W);
  doc.text(profilWrap, MAIN_X, y, { lineHeightFactor: 1.45 });
  y += profilWrap.length * 4 + 8;

  /* EXPERIENCES & PROJETS */
  y = mainSectionTitle(doc, "02", "Experiences & Projets", MAIN_X, y);

  CV.experiences.forEach((xp, idx) => {
    const bulletLines = xp.bullets.reduce((acc, b) => {
      const w = doc.splitTextToSize(b, MAIN_W - 4);
      return acc + w.length * 3.4;
    }, 0);
    const blockHeight = 4 + 5 + 4 + bulletLines + 6;

    y = ensure(doc, y, blockHeight, redraw);

    /* period */
    setText(doc, COLOR.blue);
    doc.setFont(T.family, "bold");
    doc.setFontSize(7);
    doc.text(xp.period.toUpperCase(), MAIN_X, y, { charSpace: 0.6 });

    /* role */
    setText(doc, COLOR.ink);
    doc.setFont(T.family, "bold");
    doc.setFontSize(10.5);
    const roleWrap = doc.splitTextToSize(xp.role, MAIN_W);
    doc.text(roleWrap, MAIN_X, y + 4.2);

    /* company */
    setText(doc, COLOR.mute);
    doc.setFont(T.family, "italic");
    doc.setFontSize(8.5);
    const cy = y + 4.2 + roleWrap.length * 4.2;
    doc.text(xp.company, MAIN_X, cy);

    /* bullets */
    let by = cy + 4;
    setText(doc, COLOR.graphite);
    doc.setFont(T.family, "normal");
    doc.setFontSize(8.8);
    xp.bullets.forEach((b) => {
      const w = doc.splitTextToSize(b, MAIN_W - 4.5);
      by = ensure(doc, by, w.length * 3.4 + 1, redraw);
      /* blue dash bullet */
      setDraw(doc, COLOR.blue);
      doc.setLineWidth(0.6);
      doc.line(MAIN_X + 0.4, by - 1.1, MAIN_X + 2.4, by - 1.1);
      setText(doc, COLOR.graphite);
      doc.text(w, MAIN_X + 3.6, by, { lineHeightFactor: 1.4 });
      by += w.length * 3.4 + 0.6;
    });

    y = by + (idx === CV.experiences.length - 1 ? 6 : 6);

    /* hairline divider between entries */
    if (idx !== CV.experiences.length - 1) {
      setDraw(doc, COLOR.rule);
      doc.setLineWidth(0.2);
      doc.line(MAIN_X, y - 3, MAIN_X + MAIN_W, y - 3);
    }
  });

  /* CENTRES D'INTERET */
  y = ensure(doc, y, 22, redraw);
  y = mainSectionTitle(doc, "03", "Centres d'interet", MAIN_X, y);

  setText(doc, COLOR.graphite);
  doc.setFont(T.family, "normal");
  doc.setFontSize(9);
  let cx = MAIN_X;
  const cy = y;
  CV.interets.forEach((it, i) => {
    const txt = it + (i < CV.interets.length - 1 ? "" : "");
    const w = doc.getTextWidth(txt) + 6;
    if (cx + w > MAIN_X + MAIN_W) {
      cx = MAIN_X;
      y += 7;
    }
    /* soft pill */
    setFill(doc, COLOR.paper);
    doc.roundedRect(cx - 2, y - 3.3, w, 5.6, 2.8, 2.8, "F");
    setText(doc, COLOR.ink);
    doc.text(txt, cx, y);
    cx += w + 2;
  });
}

/* ----------- PLATFORM HELPERS ----------- */
function isIOSLike() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  // iPhone / iPod / iPad classic
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS 13+ identifies as Mac with touch
  if (
    navigator.platform === "MacIntel" &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  )
    return true;
  return false;
}

/* Broad mobile detection: catches iOS, Android (Chrome/Opera/Firefox/Samsung),
   Opera Mini, Windows Mobile, KaiOS. On these surfaces the <a download>
   attribute is unreliable for blob URLs, so we route through a pre-opened
   tab instead. */
function isMobileLike() {
  if (typeof navigator === "undefined") return false;
  if (isIOSLike()) return true;
  const ua = navigator.userAgent || navigator.vendor || "";
  return /Android|Mobile|Mobi|Opera Mini|Opera Mobi|IEMobile|KAIOS/i.test(ua);
}

function isInStandalonePWA() {
  if (typeof window === "undefined") return false;
  return (
    window.navigator?.standalone === true ||
    window.matchMedia?.("(display-mode: standalone)").matches === true
  );
}

/* Open a pre-rendered "Generation du CV..." tab synchronously during the
   user gesture. The async PDF build then redirects this tab to the blob URL.
   This pattern bypasses popup blockers on iOS Safari AND mobile Opera. */
function openLoadingTab() {
  if (typeof window === "undefined") return null;
  let w = null;
  try {
    w = window.open("about:blank", "_blank");
  } catch {
    return null;
  }
  if (!w) return null;
  try {
    w.document.open();
    w.document.write(`<!doctype html><html lang="fr"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="theme-color" content="#1C1C1E" />
<title>Generation du CV...</title>
<style>
  html,body{margin:0;height:100%;background:#1C1C1E;color:#FAFAFA;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    display:flex;align-items:center;justify-content:center;}
  .wrap{text-align:center;padding:24px;}
  .ring{width:42px;height:42px;border-radius:50%;
    border:3px solid rgba(250,250,250,0.15);border-top-color:#2E5BFF;
    animation:spin .9s linear infinite;margin:0 auto 18px;}
  @keyframes spin{to{transform:rotate(360deg);}}
  h1{margin:0;font-size:14px;font-weight:600;letter-spacing:0.18em;
    text-transform:uppercase;color:#FAFAFA;}
  p{margin:8px 0 0;font-size:12px;color:rgba(250,250,250,0.55);}
  .accent{color:#2E5BFF;}
</style></head><body>
<div class="wrap">
  <div class="ring" aria-hidden="true"></div>
  <h1>Generation du CV<span class="accent">.</span></h1>
  <p>Mouhamed Dione &middot; Portfolio</p>
</div>
</body></html>`);
    w.document.close();
  } catch {
    /* Cross-origin or sandboxed — keep the empty tab and let navigation handle it. */
  }
  return w;
}

/* Universal PDF delivery. Strategy by surface:
   - Mobile (iOS, Android, Opera/Opera Mini) + pre-opened tab : navigate the
     tab to the blob URL. The tab was opened during the click event so it
     escapes popup blockers everywhere.
   - Mobile + PWA standalone : navigate the current view (no tabs available).
   - Mobile + tab was blocked : <a download target="_blank"> AND a 600ms
     fallback that navigates the current tab.
   - Desktop : classic <a download> -> file lands in Downloads. */
function deliverPDF(doc, filename, preWindow) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  if (isMobileLike()) {
    if (preWindow && !preWindow.closed) {
      try {
        preWindow.location.replace(url);
      } catch {
        preWindow.location.href = url;
      }
      setTimeout(() => URL.revokeObjectURL(url), 180_000);
      return;
    }

    if (isInStandalonePWA()) {
      window.location.href = url;
      return;
    }

    /* No pre-window: best-effort. Anchor with target=_blank + download.
       If the new tab is blocked, navigate current tab after a short delay. */
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();

    const navTimer = setTimeout(() => {
      if (!document.hidden) {
        try {
          window.location.href = url;
        } catch {
          /* ignore */
        }
      }
    }, 700);

    const onVis = () => {
      if (document.hidden) clearTimeout(navTimer);
      document.removeEventListener("visibilitychange", onVis);
    };
    document.addEventListener("visibilitychange", onVis);

    setTimeout(() => URL.revokeObjectURL(url), 180_000);
    return;
  }

  /* Desktop — true file download */
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

/* ----------- BUILDER ----------- */
export async function generateCV(options = {}) {
  const { preWindow = null } = options;

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  drawHeader(doc);
  drawSidebarContent(doc);
  drawMainContent(doc);

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    if (p > 1) {
      drawHeader(doc);
      drawSidebarContent(doc);
    }
    drawFooter(doc, p, total);
  }

  doc.setProperties({
    title: "Mouhamed Dione — Curriculum Vitae",
    subject: "CV — Developpeur Web & Communication Digitale",
    author: "Mouhamed Dione",
    keywords:
      "developpeur, web, fullstack, vue, nextjs, php, communication, branding, senegal",
    creator: "mouhamed-dione.vercel.app",
  });

  deliverPDF(doc, "mouhamed-dione-cv-2026.pdf", preWindow);
}

/* Public entrypoint wired into every Download CV onClick.
   On any mobile surface (iOS, Android, Opera, Opera Mini, KaiOS) we
   synchronously open a loading tab BEFORE the async PDF build, so the
   user-activation flag survives the await. The tab is then redirected
   to the generated blob URL. */
export function triggerCVDownload() {
  let preWindow = null;
  if (
    typeof window !== "undefined" &&
    isMobileLike() &&
    !isInStandalonePWA()
  ) {
    preWindow = openLoadingTab();
  }
  return generateCV({ preWindow }).catch((err) => {
    console.error("CV generation failed:", err);
    if (preWindow && !preWindow.closed) {
      try {
        preWindow.document.title = "Echec";
        preWindow.document.body.innerHTML =
          '<div style="padding:24px;font-family:system-ui;color:#FAFAFA;background:#1C1C1E;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;">' +
          '<div><h1 style="margin:0;font-size:16px;">La generation a echoue.</h1>' +
          '<p style="margin:10px 0 0;color:#999;font-size:13px;">Reessaie dans un instant ou ferme cet onglet.</p></div></div>';
      } catch {
        preWindow.close();
      }
    }
    throw err;
  });
}

/* Warm the jspdf chunk early so the first click stays inside the user
   activation window — critical on iOS where async delays can drop the
   "transient activation" flag that authorises popups/tab-opens. */
export function prewarmCV() {
  if (typeof window === "undefined") return;
  const start = () => import("jspdf").catch(() => {});
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 2_500 });
  } else {
    setTimeout(start, 1_500);
  }
}
