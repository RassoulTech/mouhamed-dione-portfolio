import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Calendar,
  Loader2,
  Link2,
  Check,
  MessageCircle,
} from "lucide-react";
import { getPostBySlug } from "../utils/posts";
import { Footer } from "../App.jsx";
import { BlogTopBar } from "./BlogChrome.jsx";

/* Barre de partage — WhatsApp, LinkedIn, X, et copier le lien. */
function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(title);
  const enc = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible */
    }
  };

  const btn =
    "magnetic inline-flex items-center gap-2 text-[12.5px] font-semibold px-3.5 py-2 rounded-full border border-ink/15 dark:border-snow/15 text-ink dark:text-snow hover:border-blue hover:text-blue transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2.5 mt-8">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-graphite/55 dark:text-snow/50 mr-1">
        Partager
      </span>
      <a
        className={btn}
        href={`https://wa.me/?text=${text}%20${enc}`}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={14} strokeWidth={2} /> WhatsApp
      </a>
      <a
        className={btn}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>
      <a
        className={btn}
        href={`https://twitter.com/intent/tweet?text=${text}&url=${enc}`}
        target="_blank"
        rel="noreferrer"
      >
        X
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? (
          <>
            <Check size={14} strokeWidth={2.4} className="text-blue" /> Lien copié
          </>
        ) : (
          <>
            <Link2 size={14} strokeWidth={2} /> Copier le lien
          </>
        )}
      </button>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let alive = true;
    setLoading(true);
    getPostBySlug(slug)
      .then((p) => {
        if (!alive) return;
        setPost(p);
        document.title = p
          ? `${p.title} — Mouhamed Dione`
          : "Article introuvable — Mouhamed Dione";
      })
      .catch((e) => console.error("Chargement de l'article:", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="noise relative min-h-screen bg-snow text-graphite dark:bg-ink dark:text-snow flex flex-col">
        <BlogTopBar />
        <div className="flex-1 flex items-center justify-center gap-3 text-graphite/60 dark:text-snow/50">
          <Loader2 size={18} className="animate-spin text-blue" />
          <span className="font-mono text-sm">Chargement…</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="noise relative min-h-screen bg-snow text-graphite dark:bg-ink dark:text-snow flex flex-col">
        <BlogTopBar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="font-serif italic text-4xl text-ink dark:text-snow">
            Article introuvable.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 text-blue font-semibold"
          >
            <ArrowLeft size={16} /> Revenir au Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="noise relative min-h-screen bg-snow text-graphite dark:bg-ink dark:text-snow transition-colors duration-500">
      <BlogTopBar />

      <article className="max-w-3xl mx-auto px-5 sm:px-6 pt-32 sm:pt-40 pb-16">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
          {post.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] tracking-wider uppercase text-blue border border-blue/30 rounded-full px-2.5 py-1"
            >
              {t}
            </span>
          ))}
          <span className="font-mono text-[10px] tracking-wider uppercase text-graphite/55 dark:text-snow/50 flex items-center gap-1.5">
            <Calendar size={11} strokeWidth={2} /> {post.dateLabel}
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-graphite/55 dark:text-snow/50 flex items-center gap-1.5">
            <Clock size={11} strokeWidth={2} /> {post.readingTime} min de lecture
          </span>
        </div>

        {/* Titre */}
        <h1 className="font-serif italic text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.04] text-ink dark:text-snow text-balance">
          {post.title}
        </h1>

        <ShareBar title={post.title} />

        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            className="mt-8 w-full rounded-[1.5rem] border border-ink/10 dark:border-snow/10 object-cover"
            loading="lazy"
          />
        )}

        {/* Corps de l'article (Markdown rendu) */}
        <div
          className="prose-md mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Partage en bas aussi */}
        <div className="mt-10 pt-8 border-t border-ink/10 dark:border-snow/10">
          <ShareBar title={post.title} />
        </div>

        {/* CTA fin d'article */}
        <div className="mt-12 p-7 sm:p-9 rounded-[1.6rem] bg-ink text-snow relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue/25 blur-3xl" />
          <div className="relative">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-blue mb-3">
              Un projet en tête ?
            </p>
            <p className="font-serif italic text-2xl sm:text-3xl leading-snug">
              Construisons quelque chose ensemble.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/#contact"
                className="magnetic inline-flex items-center gap-2 bg-blue text-snow text-sm font-semibold px-5 py-3 rounded-full hover:bg-blue-deep transition-colors"
              >
                Me contacter <ArrowUpRight size={15} strokeWidth={2.4} />
              </a>
              <Link
                to="/blog"
                className="magnetic inline-flex items-center gap-2 border border-snow/30 text-snow text-sm font-semibold px-5 py-3 rounded-full hover:bg-snow/10 transition-colors"
              >
                <ArrowLeft size={15} strokeWidth={2.4} /> Tous les articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
