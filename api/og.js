/* Vercel serverless function — Node.js runtime.
   GET /api/og?slug=...  (branché sur /blog/:slug via vercel.json)

   But : générer un APERÇU enrichi (Open Graph) par article, pour que le
   partage d'un lien (WhatsApp, LinkedIn, X, Facebook…) affiche le TITRE de
   l'article + son accroche + une image — ce qui donne envie de cliquer.

   Pourquoi côté serveur ? Les robots des réseaux sociaux ne lisent pas le
   JavaScript. On lit donc l'article dans Firestore (API REST publique, les
   articles publiés sont lisibles) et on injecte les balises dans le HTML.

   Env (déjà sur Vercel) : VITE_FIREBASE_PROJECT_ID
*/

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function fetchPublishedArticle(slug) {
  if (!PROJECT_ID || !slug) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/posts/${encodeURIComponent(
    slug
  )}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const doc = await r.json();
  const f = doc.fields || {};
  if (f.published?.booleanValue !== true) return null;
  return {
    title: f.title?.stringValue || "",
    excerpt: f.excerpt?.stringValue || "",
    cover: f.cover?.stringValue || "",
    tag: f.tags?.arrayValue?.values?.[0]?.stringValue || "",
  };
}

export default async function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const base = `https://${host}`;
  const slug = (req.query.slug || "").toString();

  // Valeurs par défaut (article introuvable / non publié)
  let title = "Le Journal";
  let description =
    "Articles tech, présence digitale et solutions concrètes pour les étudiants et entrepreneurs.";
  let cover = "";
  let tag = "";

  try {
    const article = await fetchPublishedArticle(slug);
    if (article) {
      if (article.title) title = article.title;
      if (article.excerpt) description = article.excerpt;
      if (article.tag) tag = article.tag;
      if (article.cover) {
        cover = article.cover.startsWith("http")
          ? article.cover
          : `${base}${article.cover.startsWith("/") ? "" : "/"}${article.cover}`;
      }
    }
  } catch {
    /* on garde les valeurs par défaut */
  }

  // UNE bannière large (paysage 1200×630) pour TOUTES les plateformes.
  // C'est ce format paysage qui déclenche le GRAND aperçu sur WhatsApp
  // (comme une miniature YouTube), plutôt que la petite vignette latérale.
  const enc = encodeURIComponent(title);
  const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : "";
  const ogImage =
    cover || `${base}/api/og-image?title=${enc}${tagParam}&format=wide&v=2`;
  const twImage = ogImage;
  const dimsMeta = cover
    ? ""
    : `
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />`;

  // On récupère le HTML de l'app pour que les vrais visiteurs aient bien le site.
  let html;
  try {
    html = await fetch(`${base}/index.html`).then((x) => x.text());
  } catch {
    html =
      "<!doctype html><html lang=\"fr\"><head></head><body><div id=\"root\"></div></body></html>";
  }

  const pageUrl = `${base}/blog/${slug}`;
  const fullTitle = `${title} — Mouhamed Dione`;
  const tags = `
    <title>${esc(fullTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Mouhamed Dione" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${esc(ogImage)}" />${dimsMeta}
    <meta property="og:url" content="${esc(pageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(twImage)}" />
  `;

  // Remplace l'ancien <title> puis injecte nos balises avant </head>.
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  html = html.replace(/<\/head>/i, `${tags}</head>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=86400"
  );
  return res.status(200).send(html);
}
