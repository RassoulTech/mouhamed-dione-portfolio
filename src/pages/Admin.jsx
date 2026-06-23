import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  DownloadCloud,
  ExternalLink,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import {
  adminGetAllPosts,
  adminSavePost,
  adminDeletePost,
  adminSeedFromLocal,
  slugify,
} from "../utils/posts";
import { BlogTopBar } from "./BlogChrome.jsx";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  cover: "",
  photoQuery: "",
  content: "",
  date: new Date().toISOString().slice(0, 10),
  published: false,
};

/* Logo Google (G multicolore). */
function GoogleG({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C39.9 36.5 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* ---------- Ecran : non configure ---------- */
function NotConfigured() {
  return (
    <div className="max-w-xl mx-auto px-6 pt-40 text-center">
      <div className="inline-flex w-14 h-14 rounded-2xl bg-blue/15 items-center justify-center mb-6">
        <Lock size={22} className="text-blue" />
      </div>
      <h1 className="font-serif italic text-4xl text-ink dark:text-snow">
        Firebase pas encore branché
      </h1>
      <p className="mt-4 text-graphite dark:text-snow/70 leading-relaxed">
        Pour activer l'espace de rédaction, suis le guide
        <span className="font-mono text-blue"> FIREBASE-SETUP.md</span> (créer le
        projet + coller les 6 clés). Une fois fait, cette page deviendra ton
        tableau de bord d'écriture.
      </p>
      <Link
        to="/blog"
        className="mt-8 inline-flex items-center gap-2 text-blue font-semibold"
      >
        Voir le blog <ExternalLink size={15} />
      </Link>
    </div>
  );
}

/* Traduit le code d'erreur Firebase en message clair (et affiche le code brut si inconnu). */
function authErrorMessage(err) {
  const code = err?.code || "";
  const map = {
    "auth/invalid-credential": "Email ou mot de passe incorrect.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/user-not-found": "Aucun compte avec cet email. Crée-le dans Firebase > Authentication > Users.",
    "auth/invalid-email": "Email invalide.",
    "auth/operation-not-allowed":
      "Méthode non activée dans Firebase (Authentication > Sign-in method).",
    "auth/unauthorized-domain":
      "Domaine non autorisé. Ajoute ce domaine dans Firebase > Authentication > Settings > Authorized domains.",
    "auth/popup-closed-by-user": "Fenêtre Google fermée avant la fin.",
    "auth/cancelled-popup-request": "Connexion Google annulée.",
    "auth/popup-blocked": "La popup Google a été bloquée par le navigateur.",
    "auth/network-request-failed": "Problème de réseau. Réessaie.",
  };
  return map[code] || `Connexion refusée${code ? ` (${code})` : ""}.`;
}

/* ---------- Ecran : connexion ---------- */
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const loginWithGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  const [showPw, setShowPw] = useState(false);

  const field =
    "w-full bg-ink/[0.03] dark:bg-ink/40 border border-ink/12 dark:border-snow/12 rounded-xl pl-11 py-3.5 text-[15px] text-ink dark:text-snow placeholder:text-graphite/45 dark:placeholder:text-snow/35 outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition";
  const icon =
    "absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite/40 dark:text-snow/35";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-28 sm:py-32">
      {/* Halo décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] max-w-[140vw] rounded-full bg-blue/15 dark:bg-blue/20 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-[430px]">
        <div className="relative bg-snow/85 dark:bg-graphite/30 backdrop-blur-2xl border border-ink/10 dark:border-snow/10 rounded-[1.8rem] sm:rounded-[2.2rem] p-7 sm:p-10 shadow-[0_40px_90px_-30px_rgba(28,28,30,0.55)]">
          {/* Badge de marque */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16 rounded-[1.3rem] bg-blue flex items-center justify-center shadow-[0_18px_45px_-12px_rgba(46,91,255,0.75)]">
              <Lock size={26} strokeWidth={2.2} className="text-snow" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-snow dark:border-graphite" />
            </div>
          </div>

          <p className="text-center font-mono text-[10px] tracking-[0.34em] uppercase text-blue mt-6 mb-2">
            Espace privé
          </p>
          <h1 className="text-center font-serif italic text-[clamp(2.1rem,7vw,2.7rem)] leading-[1.05] text-ink dark:text-snow">
            Espace rédaction
          </h1>
          <p className="text-center text-graphite/65 dark:text-snow/55 text-[14px] mt-3 mb-7">
            Connecte-toi pour gérer ton blog.
          </p>

          <form onSubmit={submit} className="space-y-3.5">
            <div className="relative">
              <Mail size={17} className={icon} />
              <input
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${field} pr-4`}
                required
              />
            </div>
            <div className="relative">
              <Lock size={17} className={icon} />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Ton mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${field} pr-11`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Masquer" : "Afficher"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite/45 dark:text-snow/40 hover:text-blue transition-colors"
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-[13px] text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="magnetic group relative w-full inline-flex items-center justify-center bg-blue text-snow font-semibold text-[15px] px-5 py-3.5 rounded-xl overflow-hidden shadow-[0_15px_35px_-12px_rgba(46,91,255,0.7)] disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-blue-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-magnetic" />
              <span className="relative flex items-center gap-2">
                {busy && <Loader2 size={17} className="animate-spin" />}
                Se connecter
                {!busy && (
                  <ArrowRight
                    size={16}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                )}
              </span>
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-ink/10 dark:bg-snow/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite/45 dark:text-snow/35">
              ou
            </span>
            <span className="h-px flex-1 bg-ink/10 dark:bg-snow/10" />
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="magnetic w-full inline-flex items-center justify-center gap-3 bg-snow dark:bg-ink/50 border border-ink/12 dark:border-snow/15 text-ink dark:text-snow font-semibold text-[14.5px] px-5 py-3.5 rounded-xl hover:border-blue hover:shadow-[0_12px_30px_-15px_rgba(46,91,255,0.5)] transition-all"
          >
            <GoogleG size={18} /> Continuer avec Google
          </button>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-graphite/55 dark:text-snow/50 hover:text-blue transition-colors"
          >
            <ArrowLeft size={13} /> Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Ecran : editeur d'article ---------- */
function Editor({ initial, onDone, onCancel }) {
  const isNew = !initial.slug;
  const [form, setForm] = useState({
    ...EMPTY,
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : initial.tags || "",
  });
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const slug = isNew ? slugify(form.slug || form.title) : form.slug;

  const save = async (publish) => {
    setBusy(true);
    try {
      await adminSavePost(
        slug,
        {
          title: form.title,
          excerpt: form.excerpt,
          cover: form.cover,
          photoQuery: form.photoQuery,
          content: form.content,
          date: form.date,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          published: publish,
        },
        { isNew }
      );
      onDone();
    } catch (e) {
      console.error(e);
      alert("Erreur à l'enregistrement. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full bg-snow dark:bg-graphite/40 border border-ink/15 dark:border-snow/15 rounded-xl px-4 py-3 text-ink dark:text-snow outline-none focus:border-blue transition-colors";
  const label =
    "block font-mono text-[10px] tracking-[0.2em] uppercase text-graphite/60 dark:text-snow/50 mb-2";

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-28 sm:pt-32 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif italic text-3xl sm:text-4xl text-ink dark:text-snow">
          {isNew ? "Nouvel article" : "Modifier"}
        </h1>
        <button
          onClick={onCancel}
          className="magnetic w-10 h-10 rounded-full flex items-center justify-center border border-ink/15 dark:border-snow/15 text-ink dark:text-snow hover:border-blue hover:text-blue"
          aria-label="Annuler"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className={label}>Titre</label>
          <input
            className={field}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Le titre de mon article"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Adresse (slug)</label>
            <input
              className={`${field} ${!isNew ? "opacity-60" : ""}`}
              value={slug}
              onChange={(e) => set("slug", e.target.value)}
              disabled={!isNew}
              placeholder="mon-article"
            />
            <p className="mt-1 font-mono text-[10px] text-graphite/50 dark:text-snow/40">
              /blog/{slug || "…"}
            </p>
          </div>
          <div>
            <label className={label}>Date</label>
            <input
              type="date"
              className={field}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label}>Accroche (excerpt)</label>
          <input
            className={field}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Phrase affichée dans la liste des articles"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Tags (séparés par des virgules)</label>
            <input
              className={field}
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Tech, Carrière"
            />
          </div>
          <div>
            <label className={label}>Image de couverture (URL, optionnel)</label>
            <input
              className={field}
              value={form.cover}
              onChange={(e) => set("cover", e.target.value)}
              placeholder="/blog/mon-image.jpg"
            />
          </div>
        </div>

        <div>
          <label className={label}>Mot-clé pour la photo (optionnel)</label>
          <input
            className={field}
            value={form.photoQuery}
            onChange={(e) => set("photoQuery", e.target.value)}
            placeholder="ex. developer portfolio, bureau startup, étudiant code…"
          />
          <p className="mt-1.5 font-mono text-[10px] text-graphite/50 dark:text-snow/40">
            La photo est cherchée sur Unsplash avec ce mot-clé. Vide = basé sur
            la catégorie. (Une image de couverture remplie reste prioritaire.)
          </p>
        </div>

        <div>
          <label className={label}>Contenu (Markdown)</label>
          <textarea
            className={`${field} font-mono text-[13px] leading-relaxed min-h-[360px] resize-y`}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder={"## Un sous-titre\n\nMon texte en **markdown**…"}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => save(true)}
            disabled={busy || !form.title}
            className="magnetic inline-flex items-center gap-2 bg-blue text-snow font-semibold px-5 py-3 rounded-xl hover:bg-blue-deep transition-colors disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Eye size={15} />}
            Publier
          </button>
          <button
            onClick={() => save(false)}
            disabled={busy || !form.title}
            className="magnetic inline-flex items-center gap-2 border border-ink/15 dark:border-snow/15 text-ink dark:text-snow font-semibold px-5 py-3 rounded-xl hover:border-blue hover:text-blue transition-colors disabled:opacity-60"
          >
            <Save size={15} /> Enregistrer en brouillon
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Ecran : tableau de bord ---------- */
function Dashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} (new) | post
  const [seeding, setSeeding] = useState(false);

  const refresh = () => {
    setLoading(true);
    adminGetAllPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = "Admin — Mouhamed Dione";
    refresh();
  }, []);

  if (editing !== null) {
    return (
      <Editor
        initial={editing}
        onCancel={() => setEditing(null)}
        onDone={() => {
          setEditing(null);
          refresh();
        }}
      />
    );
  }

  const seed = async () => {
    setSeeding(true);
    try {
      const n = await adminSeedFromLocal();
      alert(n > 0 ? `${n} article(s) importé(s).` : "Déjà importés.");
      refresh();
    } finally {
      setSeeding(false);
    }
  };

  const remove = async (slug) => {
    if (!window.confirm("Supprimer définitivement cet article ?")) return;
    await adminDeletePost(slug);
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-28 sm:pt-32 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif italic text-3xl sm:text-4xl text-ink dark:text-snow">
            Mes articles
          </h1>
          <p className="font-mono text-[11px] text-graphite/55 dark:text-snow/50 mt-1">
            Connecté : {user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/blog"
            className="magnetic w-10 h-10 rounded-full flex items-center justify-center border border-ink/15 dark:border-snow/15 text-ink dark:text-snow hover:border-blue hover:text-blue"
            aria-label="Voir le blog"
          >
            <ExternalLink size={15} />
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="magnetic w-10 h-10 rounded-full flex items-center justify-center border border-ink/15 dark:border-snow/15 text-ink dark:text-snow hover:border-blue hover:text-blue"
            aria-label="Déconnexion"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setEditing({})}
          className="magnetic inline-flex items-center gap-2 bg-blue text-snow font-semibold px-5 py-3 rounded-xl hover:bg-blue-deep transition-colors"
        >
          <Plus size={16} /> Nouvel article
        </button>
        <button
          onClick={seed}
          disabled={seeding}
          className="magnetic inline-flex items-center gap-2 border border-ink/15 dark:border-snow/15 text-ink dark:text-snow font-semibold px-5 py-3 rounded-xl hover:border-blue hover:text-blue transition-colors disabled:opacity-60"
        >
          {seeding ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <DownloadCloud size={15} />
          )}
          Importer les articles de départ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-16 text-graphite/60 dark:text-snow/50">
          <Loader2 size={18} className="animate-spin text-blue" />
          <span className="font-mono text-sm">Chargement…</span>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-graphite/60 dark:text-snow/50 font-mono text-sm py-16">
          Aucun article. Clique sur « Nouvel article » ou importe ceux de départ.
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="flex items-center gap-4 bg-snow dark:bg-graphite/40 border border-ink/10 dark:border-snow/10 rounded-2xl p-4"
            >
              <span
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  p.published
                    ? "bg-blue/15 text-blue"
                    : "bg-ink/5 dark:bg-snow/10 text-graphite/50 dark:text-snow/40"
                }`}
                title={p.published ? "Publié" : "Brouillon"}
              >
                {p.published ? <Eye size={15} /> : <EyeOff size={15} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-ink dark:text-snow truncate">
                  {p.title || "(sans titre)"}
                </p>
                <p className="font-mono text-[10px] text-graphite/50 dark:text-snow/40 truncate">
                  /blog/{p.slug} · {p.date}
                </p>
              </div>
              <button
                onClick={() => setEditing(p)}
                className="magnetic w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 dark:border-snow/15 text-ink dark:text-snow hover:border-blue hover:text-blue"
                aria-label="Modifier"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => remove(p.slug)}
                className="magnetic w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 dark:border-snow/15 text-ink dark:text-snow hover:border-red-500 hover:text-red-500"
                aria-label="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Ecran : connecté mais pas autorisé ---------- */
function Unauthorized({ email }) {
  return (
    <div className="max-w-md mx-auto px-6 pt-40 text-center">
      <div className="inline-flex w-14 h-14 rounded-2xl bg-red-500/15 items-center justify-center mb-6">
        <Lock size={22} className="text-red-500" />
      </div>
      <h1 className="font-serif italic text-4xl text-ink dark:text-snow">
        Accès non autorisé
      </h1>
      <p className="mt-4 text-graphite dark:text-snow/70 leading-relaxed">
        Le compte <span className="font-mono text-blue">{email}</span> n'est pas
        autorisé à gérer ce blog. Seul l'auteur peut écrire.
      </p>
      <button
        onClick={() => signOut(auth)}
        className="magnetic mt-8 inline-flex items-center gap-2 bg-blue text-snow font-semibold px-5 py-3 rounded-xl hover:bg-blue-deep transition-colors"
      >
        <LogOut size={15} /> Se déconnecter
      </button>
    </div>
  );
}

// Adresse autorisée à administrer (définie dans .env / Vercel).
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

/* ---------- Page /admin ---------- */
export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = en cours de vérif

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return unsub;
  }, []);

  const allowed =
    user && (!ADMIN_EMAIL || (user.email || "").toLowerCase() === ADMIN_EMAIL);

  return (
    <div className="noise relative min-h-screen bg-snow text-graphite dark:bg-ink dark:text-snow transition-colors duration-500">
      <BlogTopBar />
      {!isFirebaseConfigured ? (
        <NotConfigured />
      ) : user === undefined ? (
        <div className="flex items-center justify-center pt-48 gap-3 text-graphite/60 dark:text-snow/50">
          <Loader2 size={18} className="animate-spin text-blue" />
          <span className="font-mono text-sm">Vérification…</span>
        </div>
      ) : !user ? (
        <LoginForm />
      ) : allowed ? (
        <Dashboard user={user} />
      ) : (
        <Unauthorized email={user.email} />
      )}
    </div>
  );
}
