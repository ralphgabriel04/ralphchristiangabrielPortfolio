/* global React, Icons, Button, Badge, cn, useState, useEffect, useRef, useLang */

/* ============================================================
   AUTH KIT — shared building blocks for Login & Sign-up so the two
   pages stay perfectly consistent (same fields, states, marketing
   aside, validation rules). Loaded BEFORE pages-auth / pages-signup.

   Front-end mock: there is no server. "Loading" states are simulated
   with a short timer so every button has a real pending affordance,
   and validation is real (email shape, password strength) to make the
   forms behave like the shipping product.
============================================================ */

/* ---- bilingual strings ---- */
const AUTH_T = {
  fr: {
    orEmail: "ou avec votre email",
    sso: "SSO Entreprise", ssoBtn: "Se connecter avec le SSO",
    continueWith: (p) => `Continuer avec ${p}`,
    signupWith: (p) => `S'inscrire avec ${p}`,
    email: "Email", emailPh: "nom@entreprise.com",
    emailErr: "Entrez une adresse email valide.",
    password: "Mot de passe", passwordPh: "Votre mot de passe",
    createPassword: "Créer un mot de passe", createPasswordPh: "8 caractères minimum",
    show: "Afficher le mot de passe", hide: "Masquer le mot de passe",
    firstName: "Prénom", firstNamePh: "Camille",
    firstNameErr: "Indiquez votre prénom.",
    forgot: "Mot de passe oublié ?", remember: "Se souvenir de moi",
    pwWeak: "Faible", pwMedium: "Moyen", pwStrong: "Fort",
    pwHint: "8+ caractères, avec chiffres et majuscules pour un mot de passe fort.",
    legalPre: "En continuant, vous acceptez nos ",
    terms: "Conditions", and: " et notre ", privacy: "Politique de confidentialité", dot: ".",
    aside: {
      loginBadge: "Bon retour",
      loginTitle: ["Votre temps,", "intelligemment."],
      loginSub: "Une seule app pour vos agendas, tâches, habitudes et objectifs. Pensée pour celles et ceux qui veulent reprendre le contrôle.",
      signupBadge: "Accès anticipé",
      signupTitle: ["Commencez en", "deux minutes."],
      signupSub: "Créez votre compte et laissez DPM bâtir votre première semaine — autour de votre énergie, pas contre elle.",
      features: [
        { i: "Calendar", t: "Multi-agenda", d: "Google · Outlook · Apple" },
        { i: "Target", t: "Focus & Pomodoro", d: "Sessions guidées" },
        { i: "Heart", t: "Énergie", d: "S'adapte à votre rythme" },
        { i: "BarChart", t: "Statistiques", d: "Vos métriques privées" },
      ],
      proof: [
        { v: "12 000+", l: "agendas planifiés" },
        { v: "4,9/5", l: "note moyenne" },
        { v: "92 %", l: "gardent leur série" },
      ],
      quote: "« En deux minutes le matin, ma journée est posée. Je n'ai jamais autant tenu mes objectifs. »",
      quoteName: "Sofia R. · Fondatrice",
      secure: "Chiffrement AES-256 · Conforme RGPD",
    },
  },
  en: {
    orEmail: "or with your email",
    sso: "Enterprise SSO", ssoBtn: "Sign in with SSO",
    continueWith: (p) => `Continue with ${p}`,
    signupWith: (p) => `Sign up with ${p}`,
    email: "Email", emailPh: "name@company.com",
    emailErr: "Enter a valid email address.",
    password: "Password", passwordPh: "Your password",
    createPassword: "Create a password", createPasswordPh: "At least 8 characters",
    show: "Show password", hide: "Hide password",
    firstName: "First name", firstNamePh: "Camille",
    firstNameErr: "Tell us your first name.",
    forgot: "Forgot password?", remember: "Remember me",
    pwWeak: "Weak", pwMedium: "Medium", pwStrong: "Strong",
    pwHint: "8+ characters, with numbers and capitals for a strong password.",
    legalPre: "By continuing, you agree to our ",
    terms: "Terms", and: " and ", privacy: "Privacy Policy", dot: ".",
    aside: {
      loginBadge: "Welcome back",
      loginTitle: ["Manage your time", "intelligently."],
      loginSub: "One app for your calendars, tasks, habits and goals. Built for people who want to take back control.",
      signupBadge: "Early access",
      signupTitle: ["Get started in", "two minutes."],
      signupSub: "Create your account and let DPM build your first week — around your energy, not against it.",
      features: [
        { i: "Calendar", t: "Multi-calendar", d: "Google · Outlook · Apple" },
        { i: "Target", t: "Focus & Pomodoro", d: "Guided sessions" },
        { i: "Heart", t: "Energy", d: "Adapts to your rhythm" },
        { i: "BarChart", t: "Insights", d: "Your private metrics" },
      ],
      proof: [
        { v: "12,000+", l: "calendars planned" },
        { v: "4.9/5", l: "average rating" },
        { v: "92%", l: "keep their streak" },
      ],
      quote: "“Two minutes each morning and my day is set. I've never hit my goals so consistently.”",
      quoteName: "Sofia R. · Founder",
      secure: "AES-256 encryption · GDPR-compliant",
    },
  },
};
function useAuthT() {
  const lang = (typeof useLang === "function") ? useLang() : "fr";
  return [AUTH_T[lang === "fr" ? "fr" : "en"], lang];
}

/* ---- validation helpers ---- */
function emailValid(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
}
/* 0 none · 1 weak · 2 medium · 3 strong */
function passwordScore(v) {
  const s = String(v || "");
  if (!s) return 0;
  let pts = 0;
  if (s.length >= 8) pts++;
  if (s.length >= 12) pts++;
  if (/[0-9]/.test(s)) pts++;
  if (/[A-Z]/.test(s)) pts++;
  if (/[^A-Za-z0-9]/.test(s)) pts++;
  if (s.length < 6) return 1;
  if (pts <= 2) return 1;
  if (pts === 3) return 2;
  return 3;
}

/* ---- spinner (inline, currentColor) ---- */
function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="lp-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---- labelled field wrapper with error slot ---- */
function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12.5px] font-medium mb-1.5">{label}</label>
      {children}
      {error
        ? <p className="mt-1.5 text-[12px] text-[hsl(0_84%_68%)] flex items-center gap-1.5"><Icons.AlertTriangle size={12} /> {error}</p>
        : hint ? <p className="mt-1.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">{hint}</p> : null}
    </div>
  );
}

/* ---- text input that matches the design system, with optional left icon ----
   NOTE: we build the spread object manually and delete icon/invalid rather than
   relying on `{...rest}` destructuring — the in-browser Babel + JSX instrumentation
   here does not reliably strip renamed/rest props, which leaked `icon`/`invalid`
   onto the DOM <input>. Explicit deletion is bulletproof. */
function AuthInput(allProps) {
  const Icon = allProps.icon;
  const invalid = allProps.invalid;
  const className = allProps.className || "";
  const rest = Object.assign({}, allProps);
  delete rest.icon; delete rest.invalid; delete rest.className;
  return (
    <div className="relative">
      {Icon ? <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none" /> : null}
      <input
        {...rest}
        className={cn(
          "w-full h-12 rounded-[8px] border bg-[hsl(var(--background))] text-[14px]",
          "placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:border-transparent",
          invalid
            ? "border-[hsl(0_84%_60%/0.6)] focus:ring-[hsl(0_84%_60%/0.5)]"
            : "border-[hsl(var(--input))] focus:ring-[hsl(var(--ring))]",
          Icon ? "pl-9 pr-3" : "px-3",
          className
        )}
      />
    </div>
  );
}

/* ---- password field: left lock, show/hide toggle, optional strength meter ---- */
function PasswordField({ id, value, onChange, placeholder, autoComplete = "current-password", invalid, withMeter = false }) {
  const [show, setShow] = useState(false);
  const [T] = useAuthT();
  const score = passwordScore(value);
  const labels = [null, T.pwWeak, T.pwMedium, T.pwStrong];
  const colors = [null, "0 84% 60%", "38 92% 55%", "142 70% 48%"];
  return (
    <div>
      <div className="relative">
        <Icons.Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name="password"
          autoComplete={autoComplete}
          className={cn(
            "w-full h-12 rounded-[8px] border bg-[hsl(var(--background))] text-[14px] pl-9 pr-11",
            "placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            invalid ? "border-[hsl(0_84%_60%/0.6)] focus:ring-[hsl(0_84%_60%/0.5)]" : "border-[hsl(var(--input))] focus:ring-[hsl(var(--ring))]"
          )}
        />
        <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? T.hide : T.show} aria-pressed={show}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[6px] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
          {show ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
        </button>
      </div>
      {withMeter && value && (
        <div className="mt-2" aria-live="polite">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <span key={i} className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i <= score ? `hsl(${colors[score]})` : "hsl(var(--muted))" }} />
            ))}
          </div>
          <div className="mt-1 text-[11.5px] font-medium" style={{ color: `hsl(${colors[score]})` }}>{labels[score]}</div>
        </div>
      )}
    </div>
  );
}

/* ---- social button with per-button loading state ---- */
function OAuthButton({ icon, label, loading = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-12 rounded-[8px] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.4)] flex items-center justify-center gap-2.5 text-[14px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] disabled:opacity-60 disabled:pointer-events-none active:scale-[0.99]"
    >
      {loading ? <Spinner /> : icon}
      {label}
    </button>
  );
}

/* ---- shared marketing aside (right pane) ---- */
function AuthAside({ variant = "login" }) {
  const [T] = useAuthT();
  const a = T.aside;
  const isSignup = variant === "signup";
  const title = isSignup ? a.signupTitle : a.loginTitle;
  return (
    <div className="hidden lg:flex relative overflow-hidden p-12 items-center justify-center"
      style={{ background: "linear-gradient(135deg, #2d1b69 0%, #1e1b4b 50%, #4c1d95 100%)" }}>
      <div className="ambient-glow" style={{ width: 500, height: 500, top: "18%", left: "16%", background: "#ec4899", opacity: 0.3 }} />
      <div className="ambient-glow" style={{ width: 400, height: 400, bottom: "8%", right: "8%", background: "#8b5cf6", opacity: 0.4 }} />
      <div className="relative max-w-md text-white">
        <Badge variant="primary" className="mb-6 bg-white/10 text-white">{isSignup ? a.signupBadge : a.loginBadge}</Badge>
        <h2 className="text-[36px] font-bold tracking-tight leading-[1.1]" style={{ textWrap: "balance" }}>
          {title[0]}<br /><span className="italic font-serif">{title[1]}</span>
        </h2>
        <p className="text-[15px] text-white/70 mt-5 leading-relaxed">{isSignup ? a.signupSub : a.loginSub}</p>

        {isSignup ? (
          <>
            {/* social proof metrics */}
            <div className="grid grid-cols-3 gap-3 mt-9">
              {a.proof.map((p, i) => (
                <div key={i} className="rounded-[12px] bg-white/5 border border-white/10 p-3.5 text-center">
                  <div className="text-[22px] font-bold tracking-tight">{p.v}</div>
                  <div className="text-[11px] text-white/60 mt-0.5 leading-tight">{p.l}</div>
                </div>
              ))}
            </div>
            {/* short testimonial */}
            <div className="mt-7 rounded-[14px] bg-white/5 border border-white/10 p-5">
              <div className="flex gap-0.5 mb-2.5">{[0,1,2,3,4].map(s => <Icons.Star key={s} size={13} className="text-[hsl(38_92%_60%)]" fill="currentColor" />)}</div>
              <p className="text-[13.5px] leading-relaxed text-white/90" style={{ textWrap: "pretty" }}>{a.quote}</p>
              <div className="mt-3 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(263_70%_62%)] to-[hsl(330_80%_62%)] flex items-center justify-center text-[11px] font-semibold">SR</span>
                <span className="text-[12px] text-white/70">{a.quoteName}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-10">
            {a.features.map(f => (
              <div key={f.t} className="rounded-[10px] bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                {React.createElement(Icons[f.i] || Icons.Calendar, { size: 18, className: "mb-2" })}
                <div className="text-[13px] font-semibold">{f.t}</div>
                <div className="text-[11px] text-white/60 mt-0.5">{f.d}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-9 flex items-center gap-3 text-[12px] text-white/60">
          <Icons.Shield size={14} /> {a.secure}
        </div>
      </div>
    </div>
  );
}

/* ---- legal line shared by both forms ---- */
function AuthLegalLine({ onLegal }) {
  const [T] = useAuthT();
  return (
    <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] leading-relaxed">
      {T.legalPre}
      <button type="button" onClick={() => onLegal && onLegal("terms")} className="underline hover:text-[hsl(var(--foreground))]">{T.terms}</button>
      {T.and}
      <button type="button" onClick={() => onLegal && onLegal("privacy")} className="underline hover:text-[hsl(var(--foreground))]">{T.privacy}</button>
      {T.dot}
    </p>
  );
}

Object.assign(window, {
  AUTH_T, useAuthT, emailValid, passwordScore,
  Spinner, Field, AuthInput, PasswordField, OAuthButton, AuthAside, AuthLegalLine,
});
