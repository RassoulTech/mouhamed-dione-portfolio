import { marked } from "marked";

/*
 * Blog loader.
 * ------------
 * Chaque article est un simple fichier Markdown dans src/content/blog/.
 * Pour PUBLIER un nouvel article : ajoute un fichier .md dans ce dossier.
 * Rien d'autre a toucher — ce fichier le detecte automatiquement au build.
 *
 * Format d'un fichier (le bloc entre --- s'appelle le "frontmatter") :
 *
 *   ---
 *   title: "Le titre de mon article"
 *   date: 2026-06-21
 *   excerpt: "Une phrase d'accroche affichee dans la liste."
 *   tags: [Web, Carriere]
 *   cover: /blog/mon-image.jpg   (optionnel — image dans /public/blog/)
 *   ---
 *
 *   Ici tu ecris ton article en Markdown...
 */

marked.setOptions({ breaks: true, gfm: true });

// Vite charge tous les .md du dossier en texte brut, au moment du build.
const files = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  match[1].split("\n").forEach((line) => {
    const sep = line.indexOf(":");
    if (sep === -1) return;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();

    // Liste : tags: [Web, Carriere]
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

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // ~200 mots/min
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      dateLabel: formatDate(data.date),
      excerpt: data.excerpt || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover || "",
      readingTime: data.readingTime
        ? Number(data.readingTime)
        : estimateReadingTime(body),
      html: marked.parse(body),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1)); // plus recent en premier

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug) || null;
}
