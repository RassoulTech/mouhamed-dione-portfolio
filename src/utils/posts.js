import { marked } from "marked";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import {
  getLocalPosts,
  formatDate,
  estimateReadingTime,
} from "./blog";

marked.setOptions({ breaks: true, gfm: true });

/* Ajoute les champs calcules (date lisible, temps de lecture, HTML rendu). */
function decorate(post) {
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : [],
    dateLabel: formatDate(post.date),
    readingTime: estimateReadingTime(post.content),
    html: marked.parse(post.content || ""),
  };
}

function sortByDateDesc(list) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ---------- LECTURE PUBLIQUE (site) ---------- */

export async function getAllPosts() {
  if (!isFirebaseConfigured) {
    return getLocalPosts().map(decorate);
  }
  const snap = await getDocs(collection(db, "posts"));
  const posts = snap.docs
    .map((d) => ({ slug: d.id, ...d.data() }))
    .filter((p) => p.published);
  return sortByDateDesc(posts).map(decorate);
}

export async function getPostBySlug(slug) {
  if (!isFirebaseConfigured) {
    const found = getLocalPosts().find((p) => p.slug === slug);
    return found ? decorate(found) : null;
  }
  const ref = doc(db, "posts", slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = { slug: snap.id, ...snap.data() };
  if (!data.published) return null;
  return decorate(data);
}

/* ---------- ADMINISTRATION (page /admin, protegee) ---------- */

// Tous les articles, brouillons compris.
export async function adminGetAllPosts() {
  const snap = await getDocs(collection(db, "posts"));
  const posts = snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
  return sortByDateDesc(posts);
}

export async function adminGetPost(slug) {
  const snap = await getDoc(doc(db, "posts", slug));
  return snap.exists() ? { slug: snap.id, ...snap.data() } : null;
}

// Cree ou met a jour un article (la cle = le slug).
export async function adminSavePost(slug, data, { isNew } = {}) {
  const ref = doc(db, "posts", slug);
  await setDoc(
    ref,
    {
      title: data.title || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      cover: data.cover || "",
      content: data.content || "",
      date: data.date || new Date().toISOString().slice(0, 10),
      published: Boolean(data.published),
      updatedAt: serverTimestamp(),
      ...(isNew ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
}

export async function adminDeletePost(slug) {
  await deleteDoc(doc(db, "posts", slug));
}

// Importe les articles Markdown de depart (ceux deja presents). Une seule fois.
export async function adminSeedFromLocal() {
  const locals = getLocalPosts();
  let count = 0;
  for (const p of locals) {
    const existing = await getDoc(doc(db, "posts", p.slug));
    if (existing.exists()) continue;
    await adminSavePost(p.slug, { ...p, published: true }, { isNew: true });
    count += 1;
  }
  return count;
}

/* Transforme un titre en slug propre pour l'URL. */
export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // enleve les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
