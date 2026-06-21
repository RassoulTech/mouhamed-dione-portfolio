import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Download } from "lucide-react";
import { useTheme, PROFILE } from "../App.jsx";
import { triggerCVDownload } from "../utils/generateCV";

/* Barre du haut des pages Blog — meme langage visuel que la navbar du portfolio. */
export function BlogTopBar() {
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed top-3 sm:top-4 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 flex items-center justify-between sm:justify-start gap-2 sm:gap-1.5 bg-snow/85 dark:bg-ink/75 backdrop-blur-2xl border border-ink/10 dark:border-snow/10 shadow-[0_15px_40px_-20px_rgba(28,28,30,0.35)] rounded-full pl-2 pr-2 py-1.5">
      <Link
        to="/"
        className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full lift text-ink dark:text-snow hover:bg-ink/5 dark:hover:bg-snow/10 transition-colors"
        aria-label="Retour au portfolio"
      >
        <ArrowLeft size={14} strokeWidth={2.4} className="text-blue" />
        <span className="text-[12.5px] font-extrabold tracking-tightest">
          {PROFILE.initials}
        </span>
      </Link>

      <span className="hidden sm:block h-5 w-px bg-ink/15 dark:bg-snow/15" />

      <Link
        to="/blog"
        className="hidden sm:inline-flex items-center text-[12px] font-medium px-3 py-2 rounded-full lift text-ink/70 dark:text-snow/70 hover:text-ink dark:hover:text-snow hover:bg-ink/5 dark:hover:bg-snow/10 transition-colors"
      >
        Le Journal
      </Link>

      <a
        href="/#contact"
        className="hidden sm:inline-flex items-center text-[12px] font-medium px-3 py-2 rounded-full lift text-ink/70 dark:text-snow/70 hover:text-ink dark:hover:text-snow hover:bg-ink/5 dark:hover:bg-snow/10 transition-colors"
      >
        Contact
      </a>

      <span className="hidden sm:block h-5 w-px bg-ink/15 dark:bg-snow/15" />

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={`Activer le mode ${theme === "dark" ? "clair" : "sombre"}`}
          className="magnetic relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-ink/[0.06] dark:bg-snow/10 text-ink dark:text-snow hover:bg-ink/10 dark:hover:bg-snow/15"
        >
          <Sun
            size={14}
            strokeWidth={2}
            className={`absolute transition-all duration-500 ${
              theme === "dark" ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
            }`}
          />
          <Moon
            size={14}
            strokeWidth={2}
            className={`absolute transition-all duration-500 ${
              theme === "dark" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => triggerCVDownload()}
          aria-label="Telecharger mon CV en PDF"
          className="magnetic group relative inline-flex items-center gap-2 bg-blue text-snow text-[12.5px] font-semibold pl-3.5 pr-4 py-2 rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(46,91,255,0.7)]"
        >
          <span className="absolute inset-0 bg-blue-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-magnetic" />
          <span className="relative flex items-center gap-2">
            <Download size={13} strokeWidth={2.6} />
            <span>CV</span>
          </span>
        </button>
      </div>
    </nav>
  );
}
