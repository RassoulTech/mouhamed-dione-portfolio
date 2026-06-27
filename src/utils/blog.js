/*
 * Source LOCALE des articles (fichiers Markdown).
 * Utilisee :
 *   1. comme repli tant que Firebase n'est pas configure,
 *   2. comme articles de depart a importer dans Firebase (bouton dans /admin).
 *
 * Pour le fonctionnement Firebase, voir src/utils/posts.js.
 */

// Vite charge tous les .md du dossier en texte brut, au moment du build.
const files = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  match[1].split("\n").forEach((line) => {
    const sep = line.indexOf(":");
    if (sep === -1) return;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  });

  return { data, body: match[2] };
}

export function estimateReadingTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200)); // ~200 mots/min
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const localPosts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover || "",
      photoQuery: data.photoQuery || "",
      content: body.trim(),
      published: String(data.published).toLowerCase() !== "false",
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getLocalPosts() {
  return localPosts;
}
