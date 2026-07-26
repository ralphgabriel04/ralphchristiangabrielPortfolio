"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { projects } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";

/** Open (or toggle) the RG.SYS terminal from anywhere (header, footer, hero). */
export function openTerminal() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("rg:terminal"));
}

type Line = { v: string; c?: string };

const COL = {
  def: "var(--muted-foreground)",
  ink: "var(--foreground)",
  ok: "var(--shipped)",
  warn: "var(--active)",
  info: "var(--planned)",
  accent: "var(--accent)",
};

const EMAIL = "ralph.c.gabriel@proton.me";
const CAL = "cal.com/ralphchristiangabriel/15min";
/** `etude N` → these case studies, in order. */
const STUDIES = ["the-mad-space", "cadence", "financej"] as const;

const STACK: [string, string[]][] = [
  ["Frontend", ["TypeScript", "React", "Next.js", "Tailwind", "React Native"]],
  ["Backend & data", ["Node.js", "Spring Boot", "PostgreSQL", "Prisma", "Supabase"]],
  ["Quality & delivery", ["TDD", "JUnit", "Jest", "GitHub Actions", "Vercel"]],
];

export function Terminal() {
  const locale = useLocale();
  const fr = locale === "fr";
  const L = useCallback((a: string, b: string) => (fr ? a : b), [fr]);
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  // Command history: oldest → newest. `histIdx` = position while browsing with ↑/↓ (null = live input).
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const welcome = useCallback(
    (): Line[] => [
      { v: "RG.SYS v2.0 — " + L("terminal du portfolio", "portfolio terminal"), c: COL.def },
      { v: L("tape `help` pour la liste des commandes", "type `help` for the command list"), c: COL.def },
    ],
    [L],
  );

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus?.();
  }, []);

  const openTerm = useCallback(() => {
    openerRef.current = document.activeElement as HTMLElement;
    setOpen(true);
    setLines((prev) => (prev.length ? prev : welcome()));
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [welcome]);

  // Global open/close: custom event, ⌘K / Ctrl+K, backtick, Escape.
  useEffect(() => {
    const onEvt = () => (open ? close() : openTerm());
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "Escape" && open) return close();
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        return open ? close() : openTerm();
      }
      if (e.key === "`" && !typing) {
        e.preventDefault();
        return open ? close() : openTerm();
      }
    };
    window.addEventListener("rg:terminal", onEvt);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("rg:terminal", onEvt);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, openTerm]);

  // Autoscroll + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, lines]);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      const echo: Line = { v: "$ " + raw, c: COL.ink };
      const out = (v: string, c = COL.def): Line => ({ v, c });
      if (!cmd) {
        setLines((p) => [...p, echo]);
        return;
      }
      trackEvent("terminal_cmd", { cmd });
      const push = (arr: Line[]) => setLines((p) => [...p, echo, ...arr]);

      if (cmd === "help") {
        push([out("help · whoami · projets · etude 01|02|03 · stack · parcours · contact · temoignages · cv · recruteur · theme · fr|en · clear · sudo hire")]);
      } else if (cmd === "whoami") {
        push([out(L(
          "Ralph Christian Gabriel — dev full-stack junior/intermédiaire, B. Ing. génie logiciel @ ÉTS. FR/EN. Grand Montréal.",
          "Ralph Christian Gabriel — junior/intermediate full-stack dev, B.Eng. software engineering @ ÉTS. FR/EN. Greater Montréal.",
        ))]);
      } else if (cmd === "projets" || cmd === "projects" || cmd === "ls") {
        const rows = projects.slice(0, 5).map((p, i) =>
          out(`SYS–0${i + 1}  ${p.name} — ${p.tag[fr ? "fr" : "en"]}`, COL.def),
        );
        push([...rows, out(L("+ 4 autres · tape `etude 01` pour ouvrir une étude", "+ 4 more · type `etude 01` to open a study"), COL.info)]);
      } else if (/^(etude|study|open)\b/.test(cmd) || /^0?[123]$/.test(cmd)) {
        const m = cmd.match(/([123])\s*$/);
        if (m) {
          const id = STUDIES[Number(m[1]) - 1];
          push([out(L(`ouverture de SYS–0${m[1]} …`, `opening SYS–0${m[1]} …`), COL.ok)]);
          setTimeout(() => {
            close();
            router.push(`/projects/${id}`);
          }, 320);
        } else push([out(L("précise 01, 02 ou 03", "specify 01, 02 or 03"), COL.warn)]);
      } else if (cmd === "stack") {
        push(STACK.map(([name, items]) => out(`${name} → ${items.join(" · ")}`)));
      } else if (cmd === "parcours" || cmd === "path" || cmd === "experience") {
        push([out(L("ouverture du parcours …", "opening the path …"), COL.ok)]);
        setTimeout(() => {
          close();
          router.push("/experience");
        }, 320);
      } else if (cmd === "contact") {
        push([
          out(`email     ${EMAIL}`),
          out(`cal       ${CAL}`),
          out("linkedin  linkedin.com/in/ralph-christian-gabriel-45092021b"),
          out("github    github.com/ralphgabriel04"),
        ]);
      } else if (cmd === "temoignages" || cmd === "testimonials") {
        push([out(L("ouverture des témoignages …", "opening testimonials …"), COL.ok)]);
        setTimeout(() => {
          close();
          router.push("/temoignages");
        }, 320);
      } else if (cmd === "cv" || cmd === "resume") {
        push([out(L("ouverture du CV PDF …", "opening CV PDF …"), COL.ok)]);
        trackEvent(`cv_download_${locale}`);
        try {
          window.open(fr ? "/cv/ralph-gabriel-cv-fr.pdf" : "/cv/ralph-gabriel-cv-en.pdf", "_blank");
        } catch {}
      } else if (cmd === "recruteur" || cmd === "recruiter" || cmd === "summary") {
        push([out(L("mode recruteur …", "recruiter mode …"), COL.ok)]);
        setTimeout(() => {
          close();
          router.push("/recruteur");
        }, 300);
      } else if (cmd === "theme") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        push([out(L("thème basculé", "theme toggled"), COL.ok)]);
      } else if (cmd === "fr" || cmd === "en") {
        push([out(cmd === "fr" ? "langue : français" : "language: english", COL.ok)]);
        setTimeout(() => router.replace(pathname, { locale: cmd }), 120);
      } else if (cmd === "clear") {
        setLines([]);
        return;
      } else if (cmd === "sudo hire" || cmd === "hire") {
        push([
          out(L("Accès accordé ✓ — bonne décision.", "Access granted ✓ — good call."), COL.ok),
          out(L(`→ ${EMAIL} · réponse sous 24 h`, `→ ${EMAIL} · reply within 24 h`)),
        ]);
      } else if (cmd === "konami" || cmd === "rg") {
        push([out("▲▲▼▼◀▶◀▶BA — ✓", COL.accent)]);
      } else {
        push([out(L("commande inconnue : ", "unknown command: ") + cmd + L(" — tape `help`", " — type `help`"), COL.warn)]);
      }
    },
    [L, fr, locale, resolvedTheme, setTheme, router, pathname, close],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    const entry = input.trim();
    // Record non-empty commands, skipping an immediate duplicate of the last one.
    if (entry) setHistory((p) => (p[p.length - 1] === entry ? p : [...p, entry]));
    setInput("");
    setHistIdx(null);
  };

  // ↑/↓ browse previous commands, like a real shell.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      if (!history.length) return;
      e.preventDefault();
      const next = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      if (histIdx === null) return;
      e.preventDefault();
      if (histIdx >= history.length - 1) {
        setHistIdx(null);
        setInput("");
      } else {
        const next = histIdx + 1;
        setHistIdx(next);
        setInput(history[next] ?? "");
      }
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[160]">
          <div
            className="absolute inset-0 bg-black/45 motion-safe:animate-[page-in_.2s_ease]"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="RG.SYS terminal"
            className="absolute bottom-0 left-1/2 flex w-[min(860px,100vw)] -translate-x-1/2 flex-col rounded-t-2xl border border-b-0 border-border-strong bg-muted shadow-md motion-safe:animate-[term-up_.35s_cubic-bezier(.16,1,.3,1)]"
          >
            <div className="flex items-center gap-2.5 border-b border-border-color px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="font-mono text-xs text-muted-foreground">
                rg@portfolio — {L("terminal", "terminal")}
              </span>
              <button
                type="button"
                onClick={close}
                className="ml-auto rounded px-2 py-1 font-mono text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                esc ✕
              </button>
            </div>

            <div
              ref={bodyRef}
              className="h-[min(320px,44vh)] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-[1.75]"
            >
              {lines.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap" style={{ color: l.c ?? COL.def }}>
                  {l.v}
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2.5 border-t border-border-color px-4 py-3">
              <span className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={L("tape une commande…  (help)", "type a command…  (help)")}
                autoComplete="off"
                spellCheck={false}
                aria-label={L("commande", "command")}
                className="flex-1 bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <span className="hidden font-mono text-[10.5px] text-muted-foreground/60 sm:inline">
                help · projets · cv · contact
              </span>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
