import { useEffect, useRef, useState, createContext, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Send,
  Sparkles,
  Code2,
  Network,
  PenTool,
  Briefcase,
  GraduationCap,
  Eye,
  FileText,
  CheckCircle2,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  Rocket,
  Loader2,
  AlertCircle,
  MessageSquare,
  User,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./lib/firebase";
import { triggerCVDownload, prewarmCV } from "./utils/generateCV";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* -------------------- THEME -------------------- */
const ThemeContext = createContext({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/* -------------------- BRAND ICONS -------------------- */
function Linkedin({ size = 18, strokeWidth = 1.7, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Github({ size = 18, strokeWidth = 1.7, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

/* -------------------- DATA -------------------- */
export const PROFILE = {
  name: "Mouhamed Dione",
  initials: "MD",
  title: "Developpeur Web · Communication Digitale",
  city: "Thies, Senegal",
  coords: "14.7886° N · 16.9246° W",
  yearsXp: "2+",
  projects: "5",
  about:
    "Developpeur web junior et gestionnaire de communication digitale, je combine la maitrise technique du developpement full-stack (PHP, Vue.js 3, JavaScript) avec une expertise en strategie de contenu et gestion des reseaux sociaux. Rigoureux, creatif et oriente resultats, je concois des solutions numeriques performantes tout en assurant une presence digitale coherente et impactante.",
  email: "dionemhd1@gmail.com",
  phone: "+221 77 383 13 64",
  linkedin: "https://www.linkedin.com/in/mouhamed-dione-60428a335",
  linkedinLabel: "mouhamed-dione",
  github: "https://github.com/RassoulTech",
  githubLabel: "github.com/RassoulTech",
  cvFileName: "mouhamed-dione-cv-2026.pdf",
  cvSize: "~ 60 Ko",
  cvPages: "1 page",
  cvVersion: "v2026.05",
};

const EXPERIENCES = [
  {
    period: "2026 — PRESENT",
    role: "Gestion-Pro — Plateforme de gestion",
    company: "Projet personnel · Next.js · Vercel",
    description:
      "Conception et developpement d'une application web de gestion (billing & quotas) avec Next.js, deployee sur Vercel. Architecture moderne : app router, composants serveurs, deploiement continu via GitHub.",
    tags: ["Next.js", "Vercel", "React"],
    icon: Rocket,
    links: {
      live: "https://gestion-pro-rassoultechs-projects.vercel.app/",
      repo: "https://github.com/RassoulTech/gestion-pro",
    },
  },
  {
    period: "2026 — PRESENT",
    role: "DigiGeek — Personal Branding & Social Links",
    company: "Projet personnel · Vue 3 · GitHub Pages",
    description:
      "Creation et gestion d'une marque digitale sur LinkedIn, Instagram, TikTok, WhatsApp. Production de contenu technique et pedagogique. Web-app Vue.js 3 de partage de profils avec QR Code dynamique, deployee sur GitHub Pages.",
    tags: ["Vue 3", "Vite", "Branding"],
    icon: PenTool,
    links: {
      live: "https://rassoultech.github.io/DigiGeek-Social-links/",
      repo: "https://github.com/RassoulTech/DigiGeek-Social-links",
    },
  },
  {
    period: "2025 — 2026",
    role: "Lab CCNA — Enterprise Network Simulation",
    company: "Projet technique · Cisco Packet Tracer",
    description:
      "Simulation d'une infrastructure reseau d'entreprise : VLAN (ADMIN/USERS), Inter-VLAN Routing, haute disponibilite (HSRP, Spanning Tree), agregation EtherChannel (LACP), DHCP. Tests valides en charge.",
    tags: ["VLAN", "HSRP", "LACP", "DHCP"],
    icon: Network,
  },
  {
    period: "2024 — 2025",
    role: "Cahier de Texte Numerique",
    company: "SUPDECO · Application Java/JavaFX",
    description:
      "Application MVC de gestion scolaire : cours, seances, utilisateurs, presences. 3 dashboards distincts (Chef Admin, Enseignant, Responsable de classe). Stack : Java, JavaFX, MySQL, BCrypt.",
    tags: ["Java", "JavaFX", "MySQL", "MVC"],
    icon: Code2,
  },
  {
    period: "2024",
    role: "Stage — Developpeur Web Junior",
    company: "SUPDECO Dakar",
    description:
      "Plateforme de gestion de stock en PHP. Premiere experience pro : conception base de donnees, integration frontend, restitution metier.",
    tags: ["PHP", "MySQL"],
    icon: Briefcase,
  },
];

const SKILLS = [
  { label: "Developpement Web", level: 85, axis: "Dev" },
  { label: "Communication Digitale", level: 90, axis: "Comm" },
  { label: "Reseaux & Infrastructure", level: 75, axis: "Net" },
  { label: "UI Design Frontend", level: 80, axis: "UI" },
  { label: "Gestion de Projet", level: 85, axis: "Ops" },
];

const STACK = [
  "Next.js",
  "Vue.js 3",
  "PHP",
  "Vite",
  "JavaScript ES6+",
  "Tailwind CSS",
  "HTML5",
  "CSS3",
  "MySQL",
  "REST API",
  "Java",
  "JavaFX",
  "Git",
  "GitHub",
  "Vercel",
  "Cisco Packet Tracer",
];

const FORMATION = [
  {
    year: "2024 — 2026",
    diploma: "Licence 2 Informatique",
    school: "Supdeco Campus Thies",
  },
  {
    year: "2025 — 2026",
    diploma: "Creation d'applications de A a Z (No-Code)",
    school: "Xarala Academy",
  },
  {
    year: "2026",
    diploma: "Formation Reseaux — CCNA1 & CCNA2",
    school: "Auto-formation en ligne, Thies",
  },
];

const NAV_LINKS = [
  { id: "about", label: "A propos" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Competences" },
  { id: "formation", label: "Formation" },
  { id: "blog", label: "Blog", to: "/blog" },
  { id: "resume", label: "CV" },
  { id: "contact", label: "Contact" },
];

/* Helper for CV CTA — triggers cross-platform PDF delivery (iOS-safe). */
function CVButton({ children, className = "", ariaLabel = "Telecharger mon CV" }) {
  return (
    <button
      type="button"
      onClick={() => triggerCVDownload()}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}

/* -------------------- NAVBAR -------------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handler = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.55);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const sections = ["hero", ...NAV_LINKS.map((l) => l.id)];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ===== DESKTOP / WIDE PILL (md+) ===== */}
      <nav
        className={`hidden md:flex fixed left-1/2 -translate-x-1/2 z-50 items-center gap-1.5 transition-all duration-500 ease-magnetic ${
          scrolled
            ? "top-4 bg-snow/80 dark:bg-ink/70 backdrop-blur-2xl border border-ink/10 dark:border-snow/10 shadow-[0_15px_50px_-20px_rgba(28,28,30,0.3)]"
            : "top-5 bg-ink/30 backdrop-blur-xl border border-snow/15"
        } rounded-full pl-2 pr-2 py-2`}
      >
        {/* Brand */}
        <a
          href="#hero"
          className={`flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full lift transition-colors duration-500 ${
            scrolled ? "text-ink dark:text-snow" : "text-snow"
          }`}
        >
          <span className="relative w-2 h-2 rounded-full bg-blue">
            <span className="absolute inset-0 rounded-full bg-blue animate-ping opacity-60" />
          </span>
          <span className="text-[13px] font-extrabold tracking-tightest">
            {PROFILE.initials}
          </span>
        </a>

        <span
          className={`h-5 w-px transition-colors duration-500 ${
            scrolled ? "bg-ink/15 dark:bg-snow/15" : "bg-snow/20"
          }`}
        />

        <ul className="flex items-center gap-0.5">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={l.to || `#${l.id}`}
                  className={`group relative inline-flex items-center text-[12px] font-medium px-3 py-2 rounded-full lift transition-colors duration-500 ${
                    scrolled
                      ? `${
                          isActive
                            ? "text-ink dark:text-snow bg-ink/[0.06] dark:bg-snow/10"
                            : "text-ink/65 dark:text-snow/65 hover:text-ink dark:hover:text-snow hover:bg-ink/5 dark:hover:bg-snow/10"
                        }`
                      : `${
                          isActive
                            ? "text-snow bg-snow/10"
                            : "text-snow/75 hover:text-snow hover:bg-snow/10"
                        }`
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <span
          className={`h-5 w-px transition-colors duration-500 ${
            scrolled ? "bg-ink/15 dark:bg-snow/15" : "bg-snow/20"
          }`}
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={`Activer le mode ${theme === "dark" ? "clair" : "sombre"}`}
          className={`magnetic relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-500 ${
            scrolled
              ? "bg-ink/[0.06] dark:bg-snow/10 text-ink dark:text-snow hover:bg-ink/10 dark:hover:bg-snow/15"
              : "bg-snow/10 text-snow hover:bg-snow/20"
          }`}
        >
          <Sun
            size={14}
            strokeWidth={2}
            className={`absolute transition-all duration-500 ${
              theme === "dark"
                ? "translate-y-0 opacity-100"
                : "-translate-y-6 opacity-0"
            }`}
          />
          <Moon
            size={14}
            strokeWidth={2}
            className={`absolute transition-all duration-500 ${
              theme === "dark"
                ? "translate-y-6 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          />
        </button>

        <CVButton
          ariaLabel="Telecharger mon CV en PDF"
          className="magnetic group ml-0.5 relative inline-flex items-center gap-2 bg-blue text-snow text-[12.5px] font-semibold pl-4 pr-4 py-2 rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(46,91,255,0.7)]"
        >
          <span className="absolute inset-0 bg-blue-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-magnetic" />
          <span className="relative flex items-center gap-2">
            <Download size={13} strokeWidth={2.6} />
            <span>CV</span>
          </span>
        </CVButton>
      </nav>

      {/* ===== MOBILE PILL (< md) ===== */}
      <nav
        className={`md:hidden fixed z-50 flex items-center justify-between gap-2 transition-all duration-500 ease-magnetic ${
          scrolled
            ? "top-3 left-3 right-3 bg-snow/85 dark:bg-ink/75 backdrop-blur-2xl border border-ink/10 dark:border-snow/10 shadow-[0_15px_40px_-20px_rgba(28,28,30,0.35)]"
            : "top-4 left-4 right-4 bg-ink/35 backdrop-blur-xl border border-snow/15"
        } rounded-full pl-2 pr-2 py-1.5`}
      >
        {/* Brand — left */}
        <a
          href="#hero"
          className={`flex items-center gap-2 pl-3 pr-3 py-1 rounded-full lift ${
            scrolled ? "text-ink dark:text-snow" : "text-snow"
          }`}
          aria-label="Mouhamed Dione — accueil"
        >
          <span className="relative w-2 h-2 rounded-full bg-blue">
            <span className="absolute inset-0 rounded-full bg-blue animate-ping opacity-60" />
          </span>
          <span className="text-[12.5px] font-extrabold tracking-tightest">
            {PROFILE.initials}
          </span>
        </a>

        {/* Right cluster — theme + burger */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Activer le mode ${theme === "dark" ? "clair" : "sombre"}`}
            className={`magnetic relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ${
              scrolled
                ? "bg-ink/[0.06] dark:bg-snow/10 text-ink dark:text-snow"
                : "bg-snow/10 text-snow"
            }`}
          >
            <Sun
              size={14}
              strokeWidth={2}
              className={`absolute transition-all duration-500 ${
                theme === "dark"
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-6 opacity-0"
              }`}
            />
            <Moon
              size={14}
              strokeWidth={2}
              className={`absolute transition-all duration-500 ${
                theme === "dark"
                  ? "translate-y-6 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className={`magnetic w-9 h-9 rounded-full flex items-center justify-center ${
              open
                ? "bg-blue text-snow"
                : scrolled
                ? "bg-ink/[0.06] dark:bg-snow/10 text-ink dark:text-snow"
                : "bg-snow/10 text-snow"
            }`}
          >
            {open ? (
              <X size={16} strokeWidth={2.4} />
            ) : (
              <Menu size={16} strokeWidth={2.4} />
            )}
          </button>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      <div
        id="mobile-drawer"
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-500 ease-magnetic ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/85 backdrop-blur-2xl"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute top-0 left-0 right-0 bg-ink text-snow border-b border-snow/10 rounded-b-[2rem] pt-20 pb-7 px-5 sm:px-7 transition-transform duration-500 ease-magnetic max-h-[100dvh] overflow-y-auto ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Identity card */}
          <div className="flex items-center gap-4 p-4 mb-6 rounded-2xl bg-snow/[0.04] border border-snow/10">
            <img
              src="/img.png"
              alt="Portrait de Mouhamed Dione"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue/60"
            />
            <div className="flex-1 min-w-0">
              <p className="font-sans font-bold text-snow text-[15px] tracking-tight truncate">
                Mouhamed Dione
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-snow/55 mt-0.5">
                Dev Web · Comm. Digitale
              </p>
            </div>
            <span className="relative w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-label="En ligne">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </div>

          {/* Nav links */}
          <ul className="flex flex-col mb-6">
            {NAV_LINKS.map((l, i) => (
              <li key={l.id}>
                <a
                  href={l.to || `#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-3.5 border-b border-snow/10 group ${
                    active === l.id ? "text-blue" : "text-snow"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`font-mono text-[10px] w-6 ${active === l.id ? "text-blue" : "text-snow/40"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-[17px] group-hover:text-blue transition-colors">
                      {l.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={17}
                    className={`group-hover:text-blue group-hover:translate-x-0.5 transition-all ${
                      active === l.id ? "text-blue" : "text-snow/40"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Primary CTA inside drawer */}
          <CVButton
            ariaLabel="Telecharger mon CV en PDF"
            className="magnetic group relative w-full inline-flex items-center justify-center gap-3 bg-blue text-snow px-6 py-4 rounded-full font-semibold text-[14px] overflow-hidden shadow-[0_15px_40px_-12px_rgba(46,91,255,0.7)]"
          >
            <span className="absolute inset-0 bg-blue-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-magnetic" />
            <span className="relative flex items-center gap-3">
              Telecharger mon CV
              <Download size={15} strokeWidth={2.4} />
            </span>
          </CVButton>

          {/* Quick socials */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="magnetic flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl bg-snow/[0.04] border border-snow/10 hover:border-blue/40"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} className="text-blue" strokeWidth={1.8} />
              <span className="font-mono text-[9px] tracking-widest uppercase text-snow/60">LinkedIn</span>
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="magnetic flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl bg-snow/[0.04] border border-snow/10 hover:border-blue/40"
              aria-label="GitHub"
            >
              <Github size={16} className="text-blue" strokeWidth={1.8} />
              <span className="font-mono text-[9px] tracking-widest uppercase text-snow/60">GitHub</span>
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              onClick={() => setOpen(false)}
              className="magnetic flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl bg-snow/[0.04] border border-snow/10 hover:border-blue/40"
              aria-label="Email"
            >
              <Mail size={16} className="text-blue" strokeWidth={1.8} />
              <span className="font-mono text-[9px] tracking-widest uppercase text-snow/60">Email</span>
            </a>
          </div>

          {/* Footer line */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-snow/10">
            <span className="font-mono text-[10px] tracking-widest uppercase text-snow/45">
              {PROFILE.city}
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-snow/45 flex items-center gap-2">
              {theme === "dark" ? (
                <Moon size={11} strokeWidth={2} className="text-blue" />
              ) : (
                <Sun size={11} strokeWidth={2} className="text-blue" />
              )}
              Theme {theme}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-reveal", { autoAlpha: 0, y: 36 });
      gsap.set(".hero-portrait", { autoAlpha: 0, scale: 0.92 });
      gsap.set(".hero-chip", { autoAlpha: 0, y: 14, scale: 0.9 });
      gsap.set(".hero-corner", { autoAlpha: 0 });
      gsap.set(".hero-rule", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-corner", { autoAlpha: 1, duration: 0.6, stagger: 0.08 })
        .to(
          ".hero-reveal",
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 },
          "-=0.3"
        )
        .to(
          ".hero-portrait",
          { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power4.out" },
          "-=0.9"
        )
        .to(
          ".hero-rule",
          { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
          "-=0.9"
        )
        .to(
          ".hero-chip",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        );

      gsap.to(".scroll-cue-line", {
        scaleY: 0.4,
        transformOrigin: "top",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });

      gsap.to(".portrait-orbit", {
        rotate: 360,
        duration: 80,
        repeat: -1,
        ease: "none",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-ink text-snow"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(46,91,255,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(46,91,255,0.1),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(250,250,250,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,250,250,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-0 grain-soft" />

      {/* Discreet portfolio mark — top right */}
      <div className="hero-corner absolute top-24 sm:top-32 right-5 sm:right-10 z-10 flex items-center gap-2 text-snow/55 font-mono text-[9px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.32em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-blue" />
        Portfolio<span className="text-blue">/</span>2026
      </div>

      {/* Main split */}
      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 pt-36 pb-24 sm:pt-44 sm:pb-32 lg:pt-40 lg:pb-28 min-h-[100dvh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-10 items-center">
          {/* LEFT */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="hero-reveal inline-flex items-center gap-2 sm:gap-3 pl-3 pr-3.5 sm:pr-4 py-1.5 sm:py-2 rounded-full border border-snow/15 bg-snow/[0.04] backdrop-blur-sm">
              <span className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </span>
              <span className="font-mono text-[9px] sm:text-[10.5px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-snow/80">
                Disponible · {PROFILE.city}
              </span>
            </div>

            <h1 className="hero-reveal mt-5 sm:mt-7 font-sans font-extrabold tracking-tightest uppercase leading-[0.88] text-[clamp(2.6rem,9vw,7.4rem)] text-balance">
              Mouhamed
              <br />
              <span className="text-blue">Dione</span>
              <span className="text-blue">.</span>
            </h1>

            <div className="hero-reveal mt-5 sm:mt-6 flex items-center gap-3 sm:gap-4">
              <span className="hero-rule block h-px w-12 sm:w-20 bg-blue" />
              <p className="font-serif italic text-snow/85 text-[clamp(1.05rem,2.1vw,1.55rem)] leading-snug">
                Developpeur web & architecte de presence digitale.
              </p>
            </div>

            <p className="hero-reveal mt-6 sm:mt-8 max-w-xl text-snow/65 leading-relaxed text-[14px] sm:text-[15px]">
              Je code, je redige, je publie. Un meme cerveau pour livrer
              l'interface, structurer la marque et tenir le canal sur la duree.
            </p>

            {/* Stats grid */}
            <div className="hero-reveal mt-8 sm:mt-10 grid grid-cols-3 max-w-md border-t border-snow/15">
              <div className="py-4 sm:py-5 pr-3 sm:pr-4 border-r border-snow/15">
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-snow/45 mb-1.5 sm:mb-2">
                  Experience
                </p>
                <p className="font-sans font-bold text-snow text-[18px] sm:text-[22px] tracking-tight">
                  {PROFILE.yearsXp}
                  <span className="text-blue text-xs sm:text-sm ml-1">ans</span>
                </p>
              </div>
              <div className="py-4 sm:py-5 px-3 sm:px-4 border-r border-snow/15">
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-snow/45 mb-1.5 sm:mb-2">
                  Projets
                </p>
                <p className="font-sans font-bold text-snow text-[18px] sm:text-[22px] tracking-tight">
                  {PROFILE.projects}
                  <span className="text-blue text-xs sm:text-sm ml-1">+</span>
                </p>
              </div>
              <div className="py-4 sm:py-5 pl-3 sm:pl-4">
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-snow/45 mb-1.5 sm:mb-2">
                  Base
                </p>
                <p className="font-sans font-bold text-snow text-[18px] sm:text-[22px] tracking-tight">
                  Thies
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-reveal mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#resume"
                className="magnetic group relative inline-flex items-center justify-center gap-3 bg-blue text-snow px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm overflow-hidden shadow-[0_18px_50px_-12px_rgba(46,91,255,0.75)]"
              >
                <span className="absolute inset-0 bg-blue-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-magnetic" />
                <span className="relative flex items-center gap-3">
                  Telecharger mon CV
                  <Download size={16} strokeWidth={2.4} />
                </span>
              </a>
              <a
                href="#contact"
                className="magnetic inline-flex items-center justify-center gap-3 border border-snow/30 text-snow px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm hover:border-snow hover:bg-snow/5"
              >
                Demarrer un projet
                <ArrowUpRight size={16} strokeWidth={2.4} />
              </a>
            </div>
          </div>

          {/* RIGHT — Portrait */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="hero-portrait relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]">
              <svg
                className="portrait-orbit absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke="#2E5BFF"
                  strokeOpacity="0.35"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                />
                <circle cx="100" cy="5" r="2" fill="#2E5BFF" />
              </svg>

              <div className="absolute inset-6 rounded-full bg-blue/30 blur-3xl" />
              <div className="absolute inset-4 rounded-full border border-snow/15" />
              <div className="absolute inset-8 rounded-full border border-snow/10" />

              <div className="absolute inset-10 sm:inset-12 rounded-full overflow-hidden border-2 border-blue/60 shadow-[0_30px_80px_-20px_rgba(46,91,255,0.6)] bg-graphite">
                <img
                  src="/img.png"
                  alt="Portrait de Mouhamed Dione"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              <div className="hero-chip absolute -top-2 -right-2 bg-snow text-ink rounded-full pl-2 pr-3 py-1.5 flex items-center gap-2 shadow-xl">
                <span className="w-5 h-5 rounded-full bg-blue flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-snow" strokeWidth={2.5} />
                </span>
                <span className="font-mono text-[9.5px] sm:text-[10px] tracking-widest uppercase font-semibold">
                  Disponible
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-snow/45 font-mono text-[9px] sm:text-[9.5px] tracking-[0.32em] uppercase">
        Scroll
        <span className="scroll-cue-line w-px h-8 sm:h-10 bg-snow/30 origin-top" />
      </div>
    </section>
  );
}

/* -------------------- ABOUT -------------------- */
function About() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-left", {
        scrollTrigger: { trigger: root.current, start: "top 75%" },
        autoAlpha: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".about-right > *", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(".about-line", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.4,
        ease: "power3.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative bg-snow text-ink dark:bg-ink dark:text-snow py-20 sm:py-32 lg:py-40 px-5 sm:px-6 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 about-left">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 sm:mb-6">
            01 — A propos
          </p>
          <h2 className="font-serif italic text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] text-ink dark:text-snow">
            Le code, la voix, <br />
            <span className="text-blue">la marque.</span>
          </h2>
          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
            <Sparkles size={18} className="text-blue" strokeWidth={1.6} />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-graphite/70 dark:text-snow/55">
              Manifeste personnel
            </span>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-1 justify-center">
          <div className="about-line w-px h-full min-h-[260px] bg-blue/60" />
        </div>

        <div className="lg:col-span-6 about-right space-y-6 sm:space-y-7">
          <p className="text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.65] text-graphite dark:text-snow/80 text-balance">
            {PROFILE.about}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 pt-6 border-t border-ink/10 dark:border-snow/10">
            <div>
              <p className="font-mono text-[9.5px] sm:text-[10px] tracking-widest uppercase text-graphite/60 dark:text-snow/50 mb-1">
                Focus
              </p>
              <p className="font-sans font-semibold text-ink dark:text-snow text-sm sm:text-base">
                Full-stack & Brand
              </p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] sm:text-[10px] tracking-widest uppercase text-graphite/60 dark:text-snow/50 mb-1">
                Disponible
              </p>
              <p className="font-sans font-semibold text-ink dark:text-snow text-sm sm:text-base">
                Mission · Freelance
              </p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] sm:text-[10px] tracking-widest uppercase text-graphite/60 dark:text-snow/50 mb-1">
                Langues
              </p>
              <p className="font-sans font-semibold text-ink dark:text-snow text-sm sm:text-base">
                FR · Wolof
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- EXPERIENCE -------------------- */
function Experience() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".xp-head", {
        scrollTrigger: { trigger: root.current, start: "top 80%" },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".timeline-spine", {
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
        scaleY: 0,
        transformOrigin: "top center",
      });

      gsap.utils.toArray(".xp-card").forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 85%" },
          autoAlpha: 0,
          x: window.innerWidth < 1024 ? 0 : fromLeft ? -60 : 60,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
        });
        const dot = card.querySelector(".xp-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0.6 },
            {
              scrollTrigger: { trigger: card, start: "top 78%" },
              scale: 1.4,
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={root}
      className="relative bg-snow text-ink dark:bg-ink dark:text-snow py-20 sm:py-32 lg:py-40 px-5 sm:px-6 transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto">
        <div className="xp-head text-center mb-14 sm:mb-20">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 sm:mb-6">
            02 — Experiences & Projets
          </p>
          <h2 className="font-serif italic text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] text-ink dark:text-snow">
            Une trajectoire <br />
            <span className="text-blue">construite</span> projet par projet.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-3 sm:left-4 lg:left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-blue/30 timeline-spine origin-top" />

          <ul className="space-y-10 sm:space-y-14">
            {EXPERIENCES.map((xp, i) => {
              const Icon = xp.icon;
              const onRight = i % 2 === 1;
              return (
                <li
                  key={xp.role + i}
                  className="xp-card relative pl-10 sm:pl-14 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-12 items-center"
                >
                  <div
                    className={`absolute left-3 sm:left-4 lg:left-1/2 top-7 sm:top-8 -translate-x-1/2 z-10 xp-dot`}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 -m-2 rounded-full bg-blue/20 blur-md" />
                      <div className="relative w-3.5 h-3.5 rounded-full bg-blue border-4 border-snow dark:border-ink shadow-md" />
                    </div>
                  </div>

                  <div
                    className={`card-hover bg-snow dark:bg-graphite/40 border border-ink/10 dark:border-snow/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-7 lg:p-9 shadow-[0_15px_45px_-25px_rgba(28,28,30,0.25)] ${
                      onRight ? "lg:col-start-2" : "lg:col-start-1"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3 sm:mb-4">
                      <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-blue">
                        {xp.period}
                      </span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ink/5 dark:bg-snow/10 flex items-center justify-center shrink-0">
                        <Icon
                          size={15}
                          className="text-ink dark:text-snow"
                          strokeWidth={1.7}
                        />
                      </div>
                    </div>
                    <h3 className="font-sans font-bold text-[17px] sm:text-[20px] lg:text-[22px] text-ink dark:text-snow leading-tight tracking-tight">
                      {xp.role}
                    </h3>
                    <p className="font-sans text-[13px] sm:text-[14px] text-graphite/70 dark:text-snow/60 mt-1">
                      {xp.company}
                    </p>
                    <p className="font-sans text-[14px] sm:text-[15px] leading-[1.6] sm:leading-[1.65] text-graphite dark:text-snow/75 mt-4 sm:mt-5">
                      {xp.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5 sm:mt-6">
                      {xp.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[9.5px] sm:text-[10.5px] tracking-wider uppercase text-ink/80 dark:text-snow/75 border border-ink/15 dark:border-snow/15 rounded-full px-2.5 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {xp.links && (
                      <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-ink/10 dark:border-snow/10">
                        {xp.links.live && (
                          <a
                            href={xp.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="magnetic group inline-flex items-center gap-2 bg-blue text-snow text-[12px] font-semibold px-3.5 py-2 rounded-full hover:bg-blue-deep transition-colors"
                          >
                            <ExternalLink size={13} strokeWidth={2.4} />
                            Voir en ligne
                            <ArrowUpRight
                              size={13}
                              strokeWidth={2.4}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </a>
                        )}
                        {xp.links.repo && (
                          <a
                            href={xp.links.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="magnetic inline-flex items-center gap-2 border border-ink/15 dark:border-snow/15 text-ink dark:text-snow text-[12px] font-semibold px-3.5 py-2 rounded-full hover:border-blue hover:text-blue dark:hover:text-blue transition-colors"
                          >
                            <Github size={13} strokeWidth={2} />
                            Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------- SKILLS RADAR -------------------- */
function SkillsRadar() {
  const root = useRef(null);

  const size = 460;
  const center = size / 2;
  const maxR = size * 0.4;
  const rings = 4;
  const n = SKILLS.length;

  const points = SKILLS.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (s.level / 100) * maxR;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      lx: center + Math.cos(angle) * (maxR + 38),
      ly: center + Math.sin(angle) * (maxR + 38),
      angle,
    };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill-head", {
        scrollTrigger: { trigger: root.current, start: "top 80%" },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".radar-ring", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "center",
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".radar-axis", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        scaleY: 0,
        transformOrigin: `${center}px ${center}px`,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".radar-polygon", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        autoAlpha: 0,
        scale: 0.7,
        transformOrigin: `${center}px ${center}px`,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.9,
      });
      gsap.from(".radar-vertex", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "center",
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(2)",
        delay: 1.4,
      });
      gsap.from(".radar-label", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        autoAlpha: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        delay: 1.5,
      });

      gsap.utils.toArray(".skill-row").forEach((row, i) => {
        const bar = row.querySelector(".skill-bar");
        const pct = row.querySelector(".skill-pct");
        gsap.from(row, {
          scrollTrigger: { trigger: row, start: "top 90%" },
          autoAlpha: 0,
          x: 20,
          duration: 0.6,
          delay: i * 0.06,
          ease: "power3.out",
        });
        if (bar) {
          gsap.fromTo(
            bar,
            { width: 0 },
            {
              scrollTrigger: { trigger: row, start: "top 88%" },
              width: bar.dataset.target,
              duration: 1.2,
              delay: 0.3 + i * 0.06,
              ease: "power3.out",
            }
          );
        }
        if (pct) {
          gsap.fromTo(
            pct,
            { textContent: 0 },
            {
              scrollTrigger: { trigger: row, start: "top 88%" },
              textContent: Number(pct.dataset.target),
              duration: 1.2,
              delay: 0.3 + i * 0.06,
              snap: { textContent: 1 },
              ease: "power3.out",
            }
          );
        }
      });

      gsap.from(".stack-tag", {
        scrollTrigger: { trigger: ".stack-grid", start: "top 88%" },
        autoAlpha: 0,
        y: 18,
        duration: 0.5,
        stagger: 0.03,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={root}
      className="relative bg-ink text-snow py-20 sm:py-32 lg:py-40 px-5 sm:px-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #2E5BFF 0px, transparent 50%), radial-gradient(circle at 80% 70%, #2E5BFF 0px, transparent 45%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="skill-head text-center mb-14 sm:mb-20">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 sm:mb-6">
            03 — Competences
          </p>
          <h2 className="font-serif italic text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] text-snow">
            Un tableau de bord <br />
            <span className="text-blue">multi-disciplinaire.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px]"
              style={{ filter: "drop-shadow(0 10px 30px rgba(46,91,255,0.22))" }}
            >
              {[...Array(rings)].map((_, idx) => {
                const r = (maxR * (idx + 1)) / rings;
                const ringPoints = SKILLS.map((_, i) => {
                  const a = (Math.PI * 2 * i) / n - Math.PI / 2;
                  return `${center + Math.cos(a) * r},${center + Math.sin(a) * r}`;
                }).join(" ");
                return (
                  <polygon
                    key={idx}
                    className="radar-ring"
                    points={ringPoints}
                    fill="none"
                    stroke="#FAFAFA"
                    strokeOpacity={0.12}
                    strokeWidth={1}
                  />
                );
              })}

              {points.map((p, i) => (
                <line
                  key={`axis-${i}`}
                  className="radar-axis"
                  x1={center}
                  y1={center}
                  x2={center + Math.cos(p.angle) * maxR}
                  y2={center + Math.sin(p.angle) * maxR}
                  stroke="#FAFAFA"
                  strokeOpacity={0.18}
                  strokeWidth={1}
                />
              ))}

              <polygon
                className="radar-polygon"
                points={polygonPath}
                fill="#2E5BFF"
                fillOpacity={0.28}
                stroke="#2E5BFF"
                strokeWidth={2}
              />

              {points.map((p, i) => (
                <g key={`v-${i}`} className="radar-vertex">
                  <circle cx={p.x} cy={p.y} r="6" fill="#2E5BFF" />
                  <circle cx={p.x} cy={p.y} r="3" fill="#FAFAFA" />
                </g>
              ))}

              {points.map((p, i) => {
                const anchor =
                  Math.abs(p.lx - center) < 5
                    ? "middle"
                    : p.lx < center
                    ? "end"
                    : "start";
                return (
                  <text
                    key={`l-${i}`}
                    className="radar-label"
                    x={p.lx}
                    y={p.ly}
                    fill="#FAFAFA"
                    fillOpacity={0.85}
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize="11"
                    fontWeight="500"
                    letterSpacing="0.15em"
                    textAnchor={anchor}
                    dominantBaseline="middle"
                  >
                    {SKILLS[i].axis.toUpperCase()}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="space-y-5 sm:space-y-7">
            {SKILLS.map((s) => (
              <div key={s.label} className="skill-row">
                <div className="flex items-end justify-between mb-2">
                  <span className="font-sans font-semibold text-snow text-[13.5px] sm:text-[15px]">
                    {s.label}
                  </span>
                  <span className="font-mono text-blue text-[12px] sm:text-[13px]">
                    <span className="skill-pct" data-target={s.level}>
                      0
                    </span>
                    %
                  </span>
                </div>
                <div className="h-[3px] w-full bg-snow/10 rounded-full overflow-hidden">
                  <div
                    className="skill-bar h-full bg-blue rounded-full"
                    data-target={`${s.level}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-snow/50 mb-5 sm:mb-6 text-center">
            Stack · Outils
          </p>
          <div className="stack-grid flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto">
            {STACK.map((t) => (
              <span
                key={t}
                className="stack-tag font-mono text-[11px] sm:text-[12px] uppercase tracking-wider text-snow/85 border border-snow/15 hover:border-blue hover:text-blue magnetic rounded-full px-3 sm:px-4 py-1.5 sm:py-2"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- FORMATION -------------------- */
function Formation() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-head", {
        scrollTrigger: { trigger: root.current, start: "top 80%" },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".form-card", {
        scrollTrigger: { trigger: root.current, start: "top 75%" },
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="formation"
      ref={root}
      className="relative bg-snow text-ink dark:bg-ink dark:text-snow py-20 sm:py-32 lg:py-36 px-5 sm:px-6 transition-colors duration-500"
    >
      <div className="max-w-5xl mx-auto">
        <div className="form-head mb-12 sm:mb-16">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 sm:mb-6">
            04 — Formation
          </p>
          <h2 className="font-serif italic text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] text-ink dark:text-snow">
            Les <span className="text-blue">fondations</span> academiques.
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {FORMATION.map((f) => (
            <article
              key={f.diploma}
              className="form-card card-hover grid grid-cols-12 gap-3 sm:gap-8 items-center bg-snow dark:bg-graphite/40 border border-ink/10 dark:border-snow/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-10"
            >
              <div className="col-span-12 sm:col-span-3">
                <span className="font-mono text-blue text-[11px] sm:text-[12px] tracking-widest uppercase">
                  {f.year}
                </span>
              </div>
              <div className="col-span-12 sm:col-span-8">
                <h3 className="font-sans font-bold text-[17px] sm:text-[19px] lg:text-[22px] text-ink dark:text-snow leading-tight">
                  {f.diploma}
                </h3>
                <p className="font-sans text-graphite/70 dark:text-snow/60 mt-1 text-[13px] sm:text-[14.5px]">
                  {f.school}
                </p>
              </div>
              <div className="hidden sm:flex col-span-1 justify-end">
                <GraduationCap
                  size={22}
                  className="text-ink/30 dark:text-snow/30"
                  strokeWidth={1.6}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- RESUME / CV DOWNLOAD -------------------- */
function ResumeCard() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rc-head", {
        scrollTrigger: { trigger: root.current, start: "top 78%" },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".rc-card", {
        scrollTrigger: { trigger: root.current, start: "top 72%" },
        autoAlpha: 0,
        y: 60,
        scale: 0.97,
        duration: 1.1,
        ease: "power3.out",
      });
      gsap.from(".rc-meta", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        autoAlpha: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".rc-line", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        delay: 0.4,
        ease: "power3.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="resume"
      ref={root}
      className="relative bg-snow text-ink dark:bg-ink dark:text-snow py-20 sm:py-32 lg:py-40 px-5 sm:px-6 overflow-hidden transition-colors duration-500"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl h-[60%] bg-blue/[0.07] dark:bg-blue/[0.12] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="rc-head text-center mb-12 sm:mb-16">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 sm:mb-6">
            05 — Document
          </p>
          <h2 className="font-serif italic text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] text-ink dark:text-snow">
            Mon CV, <span className="text-blue">en un clic.</span>
          </h2>
          <p className="font-sans text-graphite/70 dark:text-snow/60 mt-5 sm:mt-6 max-w-md mx-auto text-[14px] sm:text-[15px] leading-relaxed">
            Genere a la volee. PDF propre, optimise lecteur ATS et recruteurs.
          </p>
        </div>

        <article className="rc-card group relative bg-snow dark:bg-graphite/30 border border-ink/10 dark:border-snow/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_-30px_rgba(28,28,30,0.28)] hover:shadow-[0_45px_110px_-30px_rgba(46,91,255,0.35)] hover:border-blue/40 transition-all duration-700 ease-magnetic">
          <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-ink/[0.025] dark:bg-snow/[0.03] border-b border-ink/10 dark:border-snow/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ink/15 dark:bg-snow/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink/15 dark:bg-snow/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue" />
            </div>
            <span className="font-mono text-[9px] sm:text-[10.5px] tracking-widest uppercase text-graphite/55 dark:text-snow/45 truncate">
              {PROFILE.cvFileName}
            </span>
            <span className="font-mono text-[9px] sm:text-[10.5px] tracking-widest uppercase text-blue shrink-0">
              {PROFILE.cvVersion}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Mini PDF preview */}
            <div className="lg:col-span-2 relative bg-gradient-to-br from-ink to-graphite p-8 sm:p-10 lg:p-12 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FAFAFA 1px, transparent 1px), linear-gradient(to bottom, #FAFAFA 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue/30 rounded-full blur-3xl" />

              <div className="relative w-[150px] sm:w-[180px] lg:w-[200px] aspect-[3/4] bg-snow rounded-xl shadow-2xl rotate-[-4deg] group-hover:rotate-[-2deg] transition-transform duration-700 ease-magnetic p-3 sm:p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="h-2 w-16 bg-ink rounded-full mb-1.5" />
                    <div className="h-1.5 w-12 bg-graphite/40 rounded-full" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-blue/15 flex items-center justify-center">
                    <span className="font-mono text-[8px] font-bold text-blue">
                      MD
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <div className="h-1 w-full bg-graphite/25 rounded-full" />
                  <div className="h-1 w-[85%] bg-graphite/25 rounded-full" />
                  <div className="h-1 w-[92%] bg-graphite/25 rounded-full" />
                </div>
                <div className="mt-4 mb-1.5 h-1.5 w-10 bg-blue rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-1 w-full bg-graphite/25 rounded-full" />
                  <div className="h-1 w-[70%] bg-graphite/25 rounded-full" />
                </div>
                <div className="mt-4 mb-1.5 h-1.5 w-10 bg-blue rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-1 w-full bg-graphite/25 rounded-full" />
                  <div className="h-1 w-[88%] bg-graphite/25 rounded-full" />
                  <div className="h-1 w-[60%] bg-graphite/25 rounded-full" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="font-mono text-[6.5px] text-graphite/40">
                    PDF · A4
                  </span>
                  <span className="font-mono text-[6.5px] text-graphite/40">
                    1/1
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-12">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue/12 flex items-center justify-center">
                  <FileText size={19} className="text-blue" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.28em] uppercase text-blue mb-1.5 sm:mb-2">
                    Curriculum Vitae
                  </p>
                  <h3 className="font-sans font-bold text-ink dark:text-snow text-[19px] sm:text-[22px] lg:text-[26px] leading-tight tracking-tight">
                    Mouhamed Dione
                  </h3>
                  <p className="font-sans text-graphite/70 dark:text-snow/60 text-[13px] sm:text-[14px] mt-1">
                    Developpeur Web · Communication Digitale
                  </p>
                </div>
              </div>

              <div className="rc-line my-6 sm:my-7 h-px w-full bg-ink/10 dark:bg-snow/10 origin-left" />

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                {[
                  ["Format", "PDF"],
                  ["Taille", PROFILE.cvSize],
                  ["Pages", PROFILE.cvPages],
                  ["Langue", "Francais"],
                ].map(([k, v]) => (
                  <div key={k} className="rc-meta">
                    <dt className="font-mono text-[9px] sm:text-[9.5px] tracking-[0.22em] sm:tracking-[0.25em] uppercase text-graphite/55 dark:text-snow/45">
                      {k}
                    </dt>
                    <dd className="font-sans font-semibold text-ink dark:text-snow mt-1.5 text-sm sm:text-base">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3">
                <CVButton
                  ariaLabel="Generer et telecharger le CV"
                  className="magnetic group/btn relative inline-flex items-center justify-center gap-3 bg-ink dark:bg-blue text-snow px-5 sm:px-6 py-3.5 sm:py-4 rounded-full font-semibold text-[13.5px] sm:text-[14px] flex-1 overflow-hidden shadow-[0_15px_40px_-15px_rgba(28,28,30,0.65)] dark:shadow-[0_15px_40px_-12px_rgba(46,91,255,0.6)]"
                >
                  <span className="absolute inset-0 bg-blue dark:bg-blue-deep translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-magnetic" />
                  <span className="relative flex items-center gap-3">
                    Telecharger CV
                    <Download
                      size={15}
                      strokeWidth={2.4}
                      className="group-hover/btn:translate-y-0.5 transition-transform duration-300"
                    />
                  </span>
                </CVButton>
                <button
                  type="button"
                  onClick={() => triggerCVDownload()}
                  className="magnetic inline-flex items-center justify-center gap-3 border border-ink/15 dark:border-snow/20 text-ink dark:text-snow px-5 sm:px-6 py-3.5 sm:py-4 rounded-full font-semibold text-[13.5px] sm:text-[14px] hover:border-ink dark:hover:border-snow hover:bg-ink/[0.03] dark:hover:bg-snow/5"
                >
                  Generer & Apercu
                  <Eye size={15} strokeWidth={2.2} />
                </button>
              </div>

              <div className="mt-6 sm:mt-7 flex items-center gap-2 font-mono text-[9.5px] sm:text-[10.5px] tracking-widest uppercase text-graphite/50 dark:text-snow/40">
                <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                Mis a jour · Mai 2026
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* -------------------- CONTACT FORM -------------------- */
const CONTACT_ENDPOINT = "/api/contact";

function ContactForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key) => (e) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      setStatus("error");
      setErrorMsg("Merci de remplir nom, email et message.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject.trim(),
          message: data.message.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "Echec de l'envoi.");
      }

      setStatus("success");
      setData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 8000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Une erreur reseau est survenue.");
    }
  };

  const fieldBase =
    "w-full bg-snow/[0.04] border border-snow/15 rounded-2xl px-4 py-3.5 text-snow placeholder-snow/30 text-[14.5px] font-sans transition-all duration-300 focus:outline-none focus:border-blue focus:bg-snow/[0.06] focus:ring-4 focus:ring-blue/15";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="contact-form bg-snow/[0.03] border border-snow/10 rounded-[1.8rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4 mb-7 sm:mb-8">
        <span className="shrink-0 w-11 h-11 rounded-2xl bg-blue/15 flex items-center justify-center">
          <MessageSquare size={18} className="text-blue" strokeWidth={1.8} />
        </span>
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-blue">
            Envoyer un message
          </p>
          <h3 className="font-sans font-bold text-snow text-[20px] sm:text-[22px] mt-1 leading-tight">
            Parlons de ton projet.
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label
            htmlFor="cf-name"
            className="block font-mono text-[10px] tracking-[0.25em] uppercase text-snow/55 mb-2"
          >
            Nom complet *
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={data.name}
            onChange={update("name")}
            placeholder="Ton nom complet"
            className={fieldBase}
          />
        </div>
        <div>
          <label
            htmlFor="cf-email"
            className="block font-mono text-[10px] tracking-[0.25em] uppercase text-snow/55 mb-2"
          >
            Email *
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={data.email}
            onChange={update("email")}
            placeholder="Pour que je puisse te repondre"
            className={fieldBase}
          />
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <label
          htmlFor="cf-subject"
          className="block font-mono text-[10px] tracking-[0.25em] uppercase text-snow/55 mb-2"
        >
          Sujet
        </label>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          value={data.subject}
          onChange={update("subject")}
          placeholder="L'objet de ton message"
          className={fieldBase}
        />
      </div>

      <div className="mt-4 sm:mt-5">
        <label
          htmlFor="cf-message"
          className="block font-mono text-[10px] tracking-[0.25em] uppercase text-snow/55 mb-2"
        >
          Message *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          value={data.message}
          onChange={update("message")}
          placeholder="Decris en quelques lignes le contexte, le besoin et l'echeance."
          className={`${fieldBase} resize-none min-h-[140px]`}
        />
      </div>

      {/* Honeypot — bots fill this, humans don't see it */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="magnetic group relative inline-flex items-center justify-center gap-3 bg-blue text-snow px-7 py-4 rounded-full font-semibold text-[14px] overflow-hidden shadow-[0_15px_45px_-12px_rgba(46,91,255,0.7)] disabled:cursor-wait disabled:opacity-90"
        >
          <span className="absolute inset-0 bg-blue-deep translate-y-full group-hover:translate-y-0 group-disabled:translate-y-0 transition-transform duration-500 ease-magnetic" />
          <span className="relative flex items-center gap-3">
            {status === "sending" ? (
              <>
                <Loader2 size={16} strokeWidth={2.4} className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le message
                <Send size={16} strokeWidth={2.4} />
              </>
            )}
          </span>
        </button>

        <p className="font-mono text-[10px] sm:text-[10.5px] tracking-widest uppercase text-snow/40 max-w-xs">
          Reponse sous 24h ouvrees · Thies, SN
        </p>
      </div>

      {/* Status messages */}
      <div className="mt-5 min-h-[1.5rem]" aria-live="polite">
        {status === "success" && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
            <CheckCircle2
              size={18}
              strokeWidth={2}
              className="shrink-0 mt-0.5 text-emerald-400"
            />
            <p className="text-[13.5px] leading-relaxed">
              Message envoye. Je reviens vers toi tres vite a l'adresse fournie.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
            <AlertCircle
              size={18}
              strokeWidth={2}
              className="shrink-0 mt-0.5 text-rose-400"
            />
            <p className="text-[13.5px] leading-relaxed">
              {errorMsg ||
                "L'envoi n'a pas abouti. Reessaye dans un instant ou ecris directement a dionemhd1@gmail.com."}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

/* -------------------- CONTACT -------------------- */
function Contact() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-head", {
        scrollTrigger: { trigger: root.current, start: "top 75%" },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".contact-form", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(".contact-link", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.35,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const links = [
    {
      label: "Email direct",
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      Icon: Mail,
    },
    {
      label: "Telephone",
      value: PROFILE.phone,
      href: `tel:${PROFILE.phone.replace(/\s+/g, "")}`,
      Icon: Phone,
    },
    {
      label: "LinkedIn",
      value: PROFILE.linkedinLabel,
      href: PROFILE.linkedin,
      Icon: Linkedin,
    },
    {
      label: "GitHub",
      value: PROFILE.githubLabel,
      href: PROFILE.github,
      Icon: Github,
    },
    {
      label: "Localisation",
      value: PROFILE.city,
      href: "https://maps.google.com/?q=Thies,Senegal",
      Icon: MapPin,
    },
  ];

  return (
    <section
      id="contact"
      ref={root}
      className="relative bg-ink text-snow py-20 sm:py-32 lg:py-40 px-5 sm:px-6 overflow-hidden"
    >
      <div
        className="absolute -top-32 -right-32 w-[420px] sm:w-[480px] h-[420px] sm:h-[480px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(46,91,255,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[360px] sm:w-[420px] h-[360px] sm:h-[420px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(46,91,255,0.45) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="contact-head text-center">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-blue mb-5 sm:mb-6">
            06 — Contact
          </p>
          <h2 className="font-serif italic text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] text-snow text-balance">
            Travaillons <span className="text-blue">ensemble.</span>
          </h2>
          <p className="font-sans text-snow/70 text-[15px] sm:text-[17px] max-w-xl mx-auto mt-6 sm:mt-7 leading-relaxed">
            Un projet web a lancer, une presence digitale a structurer, une
            collaboration ? Remplis le formulaire — je reponds vite.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Form column */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Direct contact column */}
          <aside className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="px-1">
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-snow/50 mb-1">
                Ou directement
              </p>
              <p className="font-serif italic text-snow/80 text-[18px] sm:text-[20px] leading-snug">
                Le canal le plus rapide.
              </p>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {links.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="contact-link card-hover group flex items-center gap-4 bg-snow/[0.03] border border-snow/10 rounded-[1.3rem] sm:rounded-[1.4rem] p-3.5 sm:p-4 text-left hover:border-blue/50"
                  >
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue/15 flex items-center justify-center shrink-0 group-hover:bg-blue/25 transition-colors duration-500">
                      <Icon size={15} className="text-blue" strokeWidth={1.8} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-mono text-[9.5px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.25em] uppercase text-snow/50">
                        {label}
                      </span>
                      <span className="block font-sans text-snow text-[13px] sm:text-[14px] underline-animated truncate">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-snow/40 group-hover:text-blue lift transition-colors duration-500 shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 sm:mt-6 p-4 sm:p-5 rounded-[1.3rem] sm:rounded-[1.4rem] border border-snow/10 bg-blue/[0.08]">
              <p className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase text-blue/90 mb-1.5">
                Disponibilite
              </p>
              <p className="font-sans text-snow text-[13px] sm:text-[14px] leading-relaxed">
                Ouvert aux missions freelance, stages, collaborations brand &
                tech. Reponse sous 24h.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* -------------------- FOOTER -------------------- */
export function Footer() {
  const year = new Date().getFullYear();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    // N'affiche le lien Admin que si TU es connecté (session Firebase).
    return onAuthStateChanged(auth, (u) => setIsAdmin(Boolean(u)));
  }, []);

  return (
    <footer className="relative bg-graphite text-snow rounded-t-[3rem] sm:rounded-t-[4rem] pt-12 sm:pt-16 pb-8 sm:pb-10 px-5 sm:px-6 -mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-8 justify-between items-start md:items-center">
        <div>
          <p className="font-sans font-bold text-snow text-base sm:text-lg tracking-tight">
            Mouhamed Dione<span className="text-blue">.</span>
          </p>
          <p className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-snow/50 mt-2">
            Conception & developpement · Thies, Senegal · © {year}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="live-dot" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-snow/70">
            En ligne · disponible
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-snow/70 hover:text-blue lift"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} strokeWidth={1.7} />
          </a>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="text-snow/70 hover:text-blue lift"
            aria-label="GitHub"
          >
            <Github size={18} strokeWidth={1.7} />
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            className="text-snow/70 hover:text-blue lift"
            aria-label="Email"
          >
            <Mail size={18} strokeWidth={1.7} />
          </a>
          {isAdmin ? (
            <Link
              to="/admin"
              className="magnetic inline-flex items-center gap-1.5 bg-blue/15 text-blue border border-blue/30 rounded-full px-3 py-1.5 text-[11px] font-semibold hover:bg-blue/25 transition-colors"
              aria-label="Espace administration"
            >
              <Lock size={12} strokeWidth={2.2} /> Admin
            </Link>
          ) : (
            <Link
              to="/admin"
              className="text-snow/25 hover:text-blue lift"
              aria-label="Connexion auteur"
              title="Connexion auteur"
            >
              <Lock size={15} strokeWidth={1.7} />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

/* -------------------- ROOT -------------------- */
export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 250);
    /* Pre-load jsPDF chunk while the user reads the hero, so the very first
       Download click stays inside the iOS Safari user-activation window. */
    prewarmCV();
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="noise relative bg-snow text-graphite dark:bg-ink dark:text-snow transition-colors duration-500">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <SkillsRadar />
      <Formation />
      <ResumeCard />
      <Contact />
      <Footer />
    </div>
  );
}
