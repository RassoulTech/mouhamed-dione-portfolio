import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, PenTool, Loader2 } from "lucide-react";
import { getAllPosts } from "../utils/posts";
import { Footer } from "../App.jsx";
import { BlogTopBar } from "./BlogChrome.jsx";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    document.title = "Le Journal — Mouhamed Dione";
    window.scrollTo(0, 0);
    let alive = true;
    getAllPosts()
      .then((p) => alive && setPosts(p))
      .catch((e) => console.error("Chargement des articles:", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const categories = ["Tous", ...new Set(posts.flatMap((p) => p.tags))];
  const shown =
    filter === "Tous" ? posts : posts.filter((p) => p.tags.includes(filter));

  return (
    <div className="noise relative min-h-screen bg-snow text-graphite dark:bg-ink dark:text-snow transition-colors duration-500">
      <BlogTopBar />

      {/* En-tete */}
      <header className="relative overflow-hidden bg-ink text-snow pt-32 sm:pt-40 pb-16 sm:pb-24 px-5 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(46,91,255,0.18),transparent_55%)]" />
        <div className="relative max-w-5xl mx-auto">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 flex items-center gap-2">
            <PenTool size={13} strokeWidth={1.8} /> Le Journal
          </p>
          <h1 className="font-serif italic text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] text-balance">
            Je code, je rédige, <br />
            <span className="text-blue">je partage.</span>
          </h1>
          <p className="mt-6 max-w-xl text-snow/65 leading-relaxed text-[15px] sm:text-[16px]">
            Mes notes de développeur : tech, présence digitale et solutions
            concrètes pour les étudiants et entrepreneurs d'ici.
          </p>
        </div>
      </header>

      {/* Liste des articles */}
      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20 min-h-[40vh]">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-graphite/60 dark:text-snow/50">
            <Loader2 size={18} className="animate-spin text-blue" />
            <span className="font-mono text-sm">Chargement des articles…</span>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-graphite/60 dark:text-snow/50 font-mono text-sm py-20">
            Aucun article pour l'instant. Le premier arrive très vite.
          </p>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2.5 mb-10">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={`magnetic font-mono text-[10.5px] sm:text-[11px] tracking-wider uppercase px-4 py-2 rounded-full border transition-colors ${
                      filter === c
                        ? "bg-blue text-snow border-blue"
                        : "border-ink/15 dark:border-snow/15 text-graphite/70 dark:text-snow/60 hover:border-blue hover:text-blue"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {shown.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="card-hover group flex flex-col h-full bg-snow dark:bg-graphite/40 border border-ink/10 dark:border-snow/10 rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden shadow-[0_15px_45px_-25px_rgba(28,28,30,0.25)]"
                >
                  {/* Miniature : couverture de l'article, sinon la bannière générée */}
                  <img
                    src={
                      post.cover ||
                      `/api/photo?slug=${encodeURIComponent(
                        post.slug
                      )}&tag=${encodeURIComponent(post.tags[0] || "")}&pv=1`
                    }
                    alt={post.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="w-full aspect-[1200/630] object-cover bg-ink"
                  />

                  <div className="flex flex-col flex-1 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      {post.tags[0] && (
                        <span className="font-mono text-[9.5px] sm:text-[10.5px] tracking-wider uppercase text-blue border border-blue/30 rounded-full px-2.5 py-1">
                          {post.tags[0]}
                        </span>
                      )}
                      <span className="font-mono text-[10px] tracking-wider uppercase text-graphite/55 dark:text-snow/50 flex items-center gap-1.5">
                        <Clock size={11} strokeWidth={2} /> {post.readingTime} min
                      </span>
                    </div>

                    <h2 className="font-serif italic text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.08] text-ink dark:text-snow group-hover:text-blue transition-colors">
                      {post.title}
                    </h2>

                    <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.65] text-graphite dark:text-snow/70 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-6 pt-5 border-t border-ink/10 dark:border-snow/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-graphite/55 dark:text-snow/50">
                        {post.dateLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-blue font-semibold text-[13px]">
                        Lire
                        <ArrowUpRight
                          size={15}
                          strokeWidth={2.4}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
