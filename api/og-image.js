import { ImageResponse } from "@vercel/og";

/* Vercel Edge function — génère une miniature PREMIUM par article.
   GET /api/og-image?title=...&tag=...&format=wide|square
   - Design adapté à l'article : palette de couleur choisie selon la catégorie
     (tag) ou, à défaut, dérivée du titre → chaque article a son look unique.
   - Typographie Plus Jakarta Sans (police du portfolio), chargée à la volée. */

export const config = { runtime: "edge" };

const el = (type, style, children) => ({ type, props: { style, children } });

// Palettes premium : fond sombre riche + couleur d'accent.
const PALETTES = [
  { bg: "#13204A", accent: "#3B82F6", glow: "rgba(59,130,246,0.45)" }, // bleu
  { bg: "#241544", accent: "#A78BFA", glow: "rgba(167,139,250,0.42)" }, // violet
  { bg: "#0E2E2A", accent: "#2DD4BF", glow: "rgba(45,212,191,0.40)" }, // émeraude
  { bg: "#3A1E14", accent: "#FB923C", glow: "rgba(251,146,60,0.42)" }, // ambre
  { bg: "#331425", accent: "#FB7185", glow: "rgba(251,113,133,0.42)" }, // rose
];

// Associe une catégorie connue à une palette ; sinon on dérive du titre.
const TAG_TO_PALETTE = {
  tech: 0, web: 0, dev: 0, "next.js": 0, code: 0,
  carrière: 1, carriere: 1, étudiant: 1, etudiant: 1, formation: 1,
  entrepreneuriat: 2, digital: 2, business: 2, marketing: 2,
  design: 3, ui: 3, créativité: 3, creativite: 3,
};

function pickPalette(tag, title) {
  const t = (tag || "").toLowerCase().trim();
  if (t && t in TAG_TO_PALETTE) return PALETTES[TAG_TO_PALETTE[t]];
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

async function loadFont(url, weight) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("font http " + r.status);
  return { name: "Jakarta", data: await r.arrayBuffer(), weight, style: "normal" };
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  let title = (searchParams.get("title") || "Le Journal").trim();
  if (title.length > 150) title = title.slice(0, 147) + "…";
  const tag = searchParams.get("tag") || "";
  const square = searchParams.get("format") === "square";

  const W = square ? 1080 : 1200;
  const H = square ? 1080 : 630;
  const pad = square ? 96 : 78;
  const p = pickPalette(tag, title);

  const len = title.length;
  const titleSize = square
    ? len > 95 ? 66 : len > 60 ? 82 : 100
    : len > 95 ? 54 : len > 60 ? 66 : 82;

  // Police de marque (graceful : si le CDN échoue, on garde la police par défaut).
  const FB = "https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans/files";
  let fonts = [];
  try {
    fonts = await Promise.all([
      loadFont(`${FB}/plus-jakarta-sans-latin-800-normal.woff`, 800),
      loadFont(`${FB}/plus-jakarta-sans-latin-500-normal.woff`, 500),
    ]);
  } catch {
    fonts = [];
  }
  const ff = fonts.length ? "Jakarta" : "sans-serif";

  const badgeText = (tag || "Article").toUpperCase();

  const tree = el(
    "div",
    {
      position: "relative",
      width: `${W}px`,
      height: `${H}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: `${pad}px`,
      backgroundColor: "#070B16",
      backgroundImage: `linear-gradient(140deg, #070B16 0%, ${p.bg} 100%)`,
      color: "#FFFFFF",
      fontFamily: ff,
      overflow: "hidden",
    },
    [
      // Lueur d'accent (haut-droite)
      el("div", {
        position: "absolute",
        top: `-${Math.round(H * 0.28)}px`,
        right: `-${Math.round(W * 0.12)}px`,
        width: `${Math.round(W * 0.6)}px`,
        height: `${Math.round(W * 0.6)}px`,
        borderRadius: "9999px",
        backgroundImage: `radial-gradient(circle, ${p.glow} 0%, rgba(0,0,0,0) 68%)`,
      }),
      // Lueur secondaire (bas-gauche)
      el("div", {
        position: "absolute",
        bottom: `-${Math.round(H * 0.32)}px`,
        left: `-${Math.round(W * 0.1)}px`,
        width: `${Math.round(W * 0.42)}px`,
        height: `${Math.round(W * 0.42)}px`,
        borderRadius: "9999px",
        backgroundImage: `radial-gradient(circle, ${p.glow} 0%, rgba(0,0,0,0) 70%)`,
        opacity: 0.6,
      }),

      // Haut : badge catégorie + marque
      el(
        "div",
        { display: "flex", alignItems: "center", justifyContent: "space-between" },
        [
          el(
            "div",
            {
              display: "flex",
              alignItems: "center",
              border: `2px solid ${p.accent}`,
              backgroundColor: "rgba(255,255,255,0.06)",
              color: p.accent,
              fontSize: square ? "26px" : "23px",
              fontWeight: 800,
              letterSpacing: "3px",
              padding: square ? "12px 26px" : "10px 22px",
              borderRadius: "9999px",
            },
            badgeText
          ),
          el(
            "div",
            {
              fontSize: square ? "24px" : "21px",
              fontWeight: 500,
              letterSpacing: "5px",
              color: "rgba(255,255,255,0.55)",
            },
            "MOUHAMED DIONE"
          ),
        ]
      ),

      // Milieu : barre d'accent + titre
      el("div", { display: "flex", flexDirection: "column" }, [
        el("div", {
          width: square ? "120px" : "96px",
          height: "8px",
          borderRadius: "9999px",
          backgroundColor: p.accent,
          marginBottom: square ? "40px" : "30px",
        }),
        el(
          "div",
          {
            display: "flex",
            fontSize: `${titleSize}px`,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            maxWidth: `${W - pad * 2}px`,
          },
          title
        ),
      ]),

      // Bas : "Le Journal" + domaine
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.14)",
          paddingTop: square ? "34px" : "26px",
        },
        [
          el("div", { display: "flex", alignItems: "center" }, [
            el("div", {
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              backgroundColor: p.accent,
              marginRight: "16px",
            }),
            el(
              "div",
              {
                fontSize: square ? "26px" : "23px",
                fontWeight: 800,
                letterSpacing: "4px",
              },
              "LE JOURNAL"
            ),
          ]),
          el(
            "div",
            {
              fontSize: square ? "24px" : "21px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
            },
            "cv-mouhamed.vercel.app"
          ),
        ]
      ),
    ]
  );

  return new ImageResponse(tree, {
    width: W,
    height: H,
    fonts: fonts.length ? fonts : undefined,
    headers: {
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
