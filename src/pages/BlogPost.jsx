import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock, Calendar } from "lucide-react";
import { getPostBySlug } from "../utils/blog";
import { Footer } from "../App.jsx";
import { BlogTopBar } from "./BlogChrome.jsx";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = post
      ? `${post.title} — Mouhamed Dione`
      : "Article introuvable — Mouhamed Dione";
  }, [post]);

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

        {/* CTA fin d'article */}
        <div className="mt-14 p-7 sm:p-9 rounded-[1.6rem] bg-ink text-snow relative overflow-hidden">
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
