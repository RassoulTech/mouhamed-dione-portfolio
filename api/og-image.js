import { ImageResponse } from "@vercel/og";

/* Vercel Edge function — génère une image de partage par article.
   GET /api/og-image?title=...&format=wide|square
     - wide   = 1200×630 (LinkedIn, X, Facebook, Telegram…)
     - square = 1080×1080 (WhatsApp, qui aime les vignettes carrées)
   Bannière aux couleurs du portfolio (ink/blue) avec le titre dessus. */

export const config = { runtime: "edge" };

const INK = "#1C1C1E";
const BLUE = "#2E5BFF";
const SNOW = "#FAFAFA";

// Helper pour construire l'arbre sans JSX (Satori accepte cette forme).
const el = (type, style, children) => ({ type, props: { style, children } });

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  let title = (searchParams.get("title") || "Le Journal").trim();
  if (title.length > 150) title = title.slice(0, 147) + "…";

  const square = searchParams.get("format") === "square";
  const W = square ? 1080 : 1200;
  const H = square ? 1080 : 630;
  const pad = square ? 92 : 76;

  // Texte plus gros en carré (plus de hauteur dispo).
  const len = title.length;
  const fontSize = square
    ? len > 95
      ? 64
      : len > 60
      ? 78
      : 94
    : len > 95
    ? 52
    : len > 60
    ? 62
    : 74;

  const tree = el(
    "div",
    {
      width: `${W}px`,
      height: `${H}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: `${pad}px`,
      backgroundColor: INK,
      backgroundImage: `linear-gradient(135deg, ${INK} 55%, #1E3FB8 135%)`,
      color: SNOW,
      fontFamily: "sans-serif",
    },
    [
      // En-tête : pastille + "LE JOURNAL"
      el("div", { display: "flex", alignItems: "center" }, [
        el("div", {
          width: "18px",
          height: "18px",
          borderRadius: "9999px",
          backgroundColor: BLUE,
          marginRight: "18px",
        }),
        el(
          "div",
          {
            fontSize: square ? "30px" : "26px",
            letterSpacing: "10px",
            color: BLUE,
            textTransform: "uppercase",
          },
          "Le Journal"
        ),
      ]),

      // Titre de l'article
      el(
        "div",
        {
          display: "flex",
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          lineHeight: 1.16,
          maxWidth: `${W - pad * 2}px`,
        },
        title
      ),

      // Pied : nom + domaine
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        [
          el(
            "div",
            { display: "flex", fontSize: square ? "36px" : "32px", fontWeight: 700 },
            "Mouhamed Dione"
          ),
          el(
            "div",
            {
              fontSize: square ? "26px" : "24px",
              color: "rgba(250,250,250,0.55)",
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
    headers: {
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
