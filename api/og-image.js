import { ImageResponse } from "@vercel/og";

/* Vercel Edge function — génère une image de partage (1200×630) par article.
   GET /api/og-image?title=...
   Bannière aux couleurs du portfolio (ink/blue) avec le titre écrit dessus.
   Utilisée comme og:image quand l'article n'a pas d'image de couverture. */

export const config = { runtime: "edge" };

const INK = "#1C1C1E";
const BLUE = "#2E5BFF";
const SNOW = "#FAFAFA";

// Petit helper pour construire l'arbre sans JSX (Satori accepte cette forme).
const el = (type, style, children) => ({ type, props: { style, children } });

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  let title = (searchParams.get("title") || "Le Journal").trim();
  if (title.length > 150) title = title.slice(0, 147) + "…";

  // Taille de police adaptée à la longueur du titre.
  const fontSize = title.length > 95 ? 52 : title.length > 60 ? 62 : 74;

  const tree = el(
    "div",
    {
      width: "1200px",
      height: "630px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "76px",
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
            fontSize: "26px",
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
          maxWidth: "1010px",
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
            { display: "flex", fontSize: "32px", fontWeight: 700 },
            "Mouhamed Dione"
          ),
          el(
            "div",
            { fontSize: "24px", color: "rgba(250,250,250,0.55)" },
            "cv-mouhamed.vercel.app"
          ),
        ]
      ),
    ]
  );

  return new ImageResponse(tree, {
    width: 1200,
    height: 630,
    headers: {
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
