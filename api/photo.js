/* Vercel serverless — redirige vers une VRAIE photo pour un article.
   GET /api/photo?slug=...&tag=...&w=1200&h=630

   - Si UNSPLASH_ACCESS_KEY est défini : photo Unsplash assortie au THÈME
     (mots-clés dérivés de la catégorie), déterministe par article.
   - Sinon : Lorem Picsum (vraie photo, sans clé).
   Utilisé à la fois par les cartes du blog (img) et le partage (og:image). */

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
  for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function keywords(tag) {
  const t = (tag || "").toLowerCase().trim();
  return TAG_QUERY[t] || tag || "technology workspace abstract";
}

export default async function handler(req, res) {
  const slug = (req.query.slug || "blog").toString();
  const tag = (req.query.tag || "").toString();
  const q = (req.query.q || "").toString().trim();
  const W = parseInt(req.query.w, 10) || 1200;
  const H = parseInt(req.query.h, 10) || 630;

  // Repli par défaut : Picsum (sans clé).
  let url = `https://picsum.photos/seed/${encodeURIComponent(slug)}/${W}/${H}`;

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (key) {
    try {
      const r = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          q || keywords(tag)
        )}&orientation=landscape&per_page=12&content_filter=high`,
        { headers: { Authorization: `Client-ID ${key}` } }
      );
      if (r.ok) {
        const data = await r.json();
        const results = data.results || [];
        if (results.length) {
          const raw = results[hash(slug) % results.length]?.urls?.raw;
          if (raw) url = `${raw}&w=${W}&h=${H}&fit=crop&crop=entropy&q=80&fm=jpg`;
        }
      }
    } catch {
      /* on garde Picsum */
    }
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.statusCode = 302;
  res.setHeader("Location", url);
  res.end();
}
