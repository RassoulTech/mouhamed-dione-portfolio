import { ImageResponse } from "@vercel/og";

/* Vercel Edge function — miniature PREMIUM par article.
   GET /api/og-image?title=...&tag=...&format=wide|square

   - Si UNSPLASH_ACCESS_KEY est défini : une VRAIE PHOTO choisie selon le thème
     (catégorie/titre) sert de fond, avec un voile sombre + le titre par-dessus.
   - Sinon (ou si Unsplash échoue) : repli sur un dégradé premium aux couleurs
     du portfolio. Donc ça ne casse jamais.
   - Typographie Plus Jakarta Sans chargée à la volée (repli gracieux). */

export const config = { runtime: "edge" };

const el = (type, style, children) => ({ type, props: { style, children } });

const PALETTES = [
  { bg: "#13204A", accent: "#3B82F6", glow: "rgba(59,130,246,0.45)" },
  { bg: "#241544", accent: "#A78BFA", glow: "rgba(167,139,250,0.42)" },
  { bg: "#0E2E2A", accent: "#2DD4BF", glow: "rgba(45,212,191,0.40)" },
  { bg: "#3A1E14", accent: "#FB923C", glow: "rgba(251,146,60,0.42)" },
  { bg: "#331425", accent: "#FB7185", glow: "rgba(251,113,133,0.42)" },
];

const TAG_TO_PALETTE = {
  tech: 0, web: 0, dev: 0, "next.js": 0, code: 0,
  carrière: 1, carriere: 1, étudiant: 1, etudiant: 1, formation: 1,
  entrepreneuriat: 2, digital: 2, business: 2, marketing: 2,
  design: 3, ui: 3, créativité: 3, creativite: 3,
};

// Mots-clés de recherche photo selon la catégorie.
const TAG_QUERY = {
  tech: "technology code computer",
  web: "web development programming",
  dev: "programming developer code",
  "next.js": "programming code laptop",
  carrière: "career professional success",
  carriere: "career professional success",
  étudiant: "student study laptop",
  etudiant: "student study laptop",
  formation: "learning study books",
  entrepreneuriat: "business startup office",
  digital: "digital technology marketing",
  business: "business office meeting",
  marketing: "marketing social media",
  design: "design creative workspace",
};

function hash(str) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function pickPalette(tag, title) {
  const t = (tag || "").toLowerCase().trim();
  if (t && t in TAG_TO_PALETTE) return PALETTES[TAG_TO_PALETTE[t]];
  return PALETTES[hash(title) % PALETTES.length];
}

async function loadFonts() {
  const FB = "https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans/files";
  async function one(w) {
    const r = await fetch(`${FB}/plus-jakarta-sans-latin-${w}-normal.woff`);
    if (!r.ok) throw new Error("font");
    return { name: "Jakarta", data: await r.arrayBuffer(), weight: w, style: "normal" };
  }
  try {
    return await Promise.all([one(800), one(500)]);
  } catch {
    return [];
  }
}

async function fetchPhoto(query, orientation, seed, W, H) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&orientation=${orientation}&per_page=12&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!r.ok) return null;
    const data = await r.json();
    const results = data.results || [];
    if (!results.length) return null;
    const raw = results[seed % results.length]?.urls?.raw;
    if (!raw) return null;
    return `${raw}&w=${W}&h=${H}&fit=crop&crop=entropy&q=80&fm=jpg`;
  } catch {
    return null;
  }
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  let title = (searchParams.get("title") || "Le Journal").trim();
  if (title.length > 150) title = title.slice(0, 147) + "…";
  const tag = searchParams.get("tag") || "";
  const square = searchParams.get("format") === "square";

  const W = square ? 1080 : 1200;
  const H = square ? 1080 : 630;
  const pad = square ? 92 : 78;
  const p = pickPalette(tag, title);

  const len = title.length;
  const titleSize = square
    ? len > 95 ? 66 : len > 60 ? 82 : 100
    : len > 95 ? 54 : len > 60 ? 66 : 82;

  const query =
    TAG_QUERY[(tag || "").toLowerCase().trim()] ||
    tag ||
    "technology workspace abstract";

  const [fonts, photoUrl] = await Promise.all([
    loadFonts(),
    fetchPhoto(query, square ? "squarish" : "landscape", hash(title), W, H),
  ]);
  const ff = fonts.length ? "Jakarta" : "sans-serif";
  const badgeText = (tag || "Article").toUpperCase();

  // Couche de fond : photo + voile sombre, ou dégradé premium.
  const background = photoUrl
    ? [
        el("img", {
          position: "absolute",
          top: 0,
          left: 0,
          width: `${W}px`,
          height: `${H}px`,
          objectFit: "cover",
        }, undefined),
        el("div", {
          position: "absolute",
          top: 0,
          left: 0,
          width: `${W}px`,
          height: `${H}px`,
          backgroundImage:
            "linear-gradient(180deg, rgba(7,11,22,0.35) 0%, rgba(7,11,22,0.72) 52%, rgba(7,11,22,0.95) 100%)",
        }),
      ]
    : [
        el("div", {
          position: "absolute",
          top: `-${Math.round(H * 0.28)}px`,
          right: `-${Math.round(W * 0.12)}px`,
          width: `${Math.round(W * 0.6)}px`,
          height: `${Math.round(W * 0.6)}px`,
          borderRadius: "9999px",
          backgroundImage: `radial-gradient(circle, ${p.glow} 0%, rgba(0,0,0,0) 68%)`,
        }),
      ];

  const fixImgSrc = photoUrl;

  const content = [
    // Haut : badge + marque
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
            backgroundColor: "rgba(0,0,0,0.25)",
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
            color: "rgba(255,255,255,0.7)",
          },
          "MOUHAMED DIONE"
        ),
      ]
    ),
    // Milieu : barre + titre
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
    // Bas
    el(
      "div",
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255,255,255,0.2)",
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
            { fontSize: square ? "26px" : "23px", fontWeight: 800, letterSpacing: "4px" },
            "LE JOURNAL"
          ),
        ]),
        el(
          "div",
          { fontSize: square ? "24px" : "21px", fontWeight: 500, color: "rgba(255,255,255,0.65)" },
          "cv-mouhamed.vercel.app"
        ),
      ]
    ),
  ];

  // Injecte le src de l'image de fond (Satori lit props.src sur le type "img").
  if (fixImgSrc) background[0].props.src = fixImgSrc;

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
      backgroundImage: photoUrl
        ? undefined
        : `linear-gradient(140deg, #070B16 0%, ${p.bg} 100%)`,
      color: "#FFFFFF",
      fontFamily: ff,
      overflow: "hidden",
    },
    [...background, ...content]
  );

  return new ImageResponse(tree, {
    width: W,
    height: H,
    fonts: fonts.length ? fonts : undefined,
    headers: {
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
      // Diagnostic : indique d'où vient le fond (clé présente ? photo trouvée ?)
      "x-og-haskey": process.env.UNSPLASH_ACCESS_KEY ? "yes" : "no",
      "x-og-bg": photoUrl ? "photo" : "gradient",
    },
  });
}
