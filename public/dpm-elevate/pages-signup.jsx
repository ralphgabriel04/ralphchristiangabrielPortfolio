/* global React, Icons, Button, Logo, cn, useState,
   useAuthT, emailValid, passwordScore, Spinner, Field, AuthInput, PasswordField,
   OAuthButton, AuthAside, AuthLegalLine, LegalModal, useProfile */

/* ============================================================
   PAGE — SIGN-UP (/signup)  ·  account CREATION

   Mirrors the Login split-screen for consistency but everything points
   to creating an account: social sign-up first, then email. The submit
   button stays DISABLED until the required GDPR consent is checked.
   Newsletter opt-in is unchecked by default (GDPR). On success we persist
   the identity and route to /onboarding to continue the flow.
============================================================ */
function SignupPage({ setRoute }) {
  const [T, lang] = useAuthT();
  const [, updateProfile] = useProfile();

  const [firstName, setFirst] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [news, setNews] = useState(false);            // GDPR: opt-in OFF by default
  const [touched, setTouched] = useState({ first: false, email: false, pwd: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [formError, setFormError] = useState("");
  const [legal, setLegal] = useState(null);

  const firstErr = (touched.first || submitted) && !firstName.trim() ? T.firstNameErr : "";
  const emailErr = (touched.email || submitted) && !emailValid(email) ? T.emailErr : "";
  const pwdErr = (touched.pwd || submitted) && passwordScore(pwd) < 1 ? (lang === "fr" ? "Choisissez un mot de passe." : "Choose a password.") : "";

  const formValid = firstName.trim() && emailValid(email) && passwordScore(pwd) >= 1 && gdpr;

  const proceed = () => {
    updateProfile({ firstName: firstName.trim(), email: email.trim(), newsletter: news });
    setRoute("onboarding");
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");
    if (!gdpr) { setFormError(lang === "fr" ? "Veuillez accepter les Conditions pour continuer." : "Please accept the Terms to continue."); return; }
    if (!formValid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); proceed(); }, 1000);
  };

  const oauth = (id) => {
    if (loading || oauthLoading) return;
    setOauthLoading(id);
    setTimeout(() => {
      setOauthLoading(null);
      updateProfile({ newsletter: news });
      setRoute("onboarding");
    }, 1000);
  };

  const providers = [
    { id: "google", icon: <Icons.Google size={18} />, name: "Google" },
    { id: "microsoft", icon: <Icons.Microsoft size={18} />, name: "Microsoft" },
    { id: "apple", icon: <Icons.Apple size={18} />, name: "Apple" },
    { id: "github", icon: <Icons.Github size={18} />, name: "GitHub" },
  ];

  return (
    <div className="min-h-full grid lg:grid-cols-2">
      {/* Left — creation form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <button onClick={() => setRoute("landing")} className="block mb-9 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" aria-label="DPM Elevate — home">
            <Logo size={36} />
          </button>
          <h1 className="text-[28px] font-bold tracking-tight">{lang === "fr" ? "Créez votre compte" : "Create your account"}</h1>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-1.5 mb-7 flex items-center gap-2">
            <Icons.Sparkles size={14} className="text-[hsl(var(--primary))]" />
            {lang === "fr" ? "Gratuit 14 jours, sans carte bancaire." : "Free for 14 days, no credit card."}
          </p>

          {/* Social sign-up FIRST */}
          <div className="grid grid-cols-2 gap-2.5">
            {providers.map(p => (
              <OAuthButton key={p.id} icon={p.icon} label={p.name}
                loading={oauthLoading === p.id}
                disabled={!!oauthLoading || loading}
                onClick={() => oauth(p.id)} />
            ))}
          </div>

          <div className="flex items-center gap-3 my-6 text-[11px] uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
            <span>{T.orEmail}</span>
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
          </div>

          <form onSubmit={submit} noValidate className="space-y-4">
            {formError && (
              <div className="rounded-[8px] border border-[hsl(0_84%_60%/0.4)] bg-[hsl(0_84%_60%/0.08)] px-3.5 py-2.5 text-[12.5px] text-[hsl(0_84%_72%)] flex items-center gap-2" role="alert">
                <Icons.AlertTriangle size={14} /> {formError}
              </div>
            )}

            <Field id="su-first" label={T.firstName} error={firstErr}>
              <AuthInput id="su-first" icon={Icons.Users} type="text" name="given-name" autoComplete="given-name"
                placeholder={T.firstNamePh} value={firstName} invalid={!!firstErr}
                onChange={e => setFirst(e.target.value)} onBlur={() => setTouched(t => ({ ...t, first: true }))} />
            </Field>

            <Field id="su-email" label={T.email} error={emailErr}>
              <AuthInput id="su-email" icon={Icons.Mail} type="email" name="email" autoComplete="email"
                placeholder={T.emailPh} value={email} invalid={!!emailErr}
                onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(t => ({ ...t, email: true }))} />
            </Field>

            <Field id="su-pwd" label={T.createPassword} error={pwdErr} hint={!pwdErr ? T.pwHint : ""}>
              <PasswordField id="su-pwd" value={pwd} onChange={e => setPwd(e.target.value)}
                placeholder={T.createPasswordPh} autoComplete="new-password" invalid={!!pwdErr} withMeter />
            </Field>

            {/* Consents */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <button type="button" role="checkbox" aria-checked={gdpr} aria-required="true" onClick={() => setGdpr(v => !v)}
                  className={cn("mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-colors flex-shrink-0",
                    gdpr ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground)/0.5)] hover:border-[hsl(var(--primary))]")}>
                  {gdpr && <Icons.Check size={12} stroke={3} className="text-white" />}
                </button>
                <span className="text-[12.5px] text-[hsl(var(--muted-foreground))] leading-snug">
                  {lang === "fr" ? "J'accepte les " : "I agree to the "}
                  <button type="button" onClick={(e) => { e.preventDefault(); setLegal("terms"); }} className="underline text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">{T.terms}</button>
                  {T.and}
                  <button type="button" onClick={(e) => { e.preventDefault(); setLegal("privacy"); }} className="underline text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">{T.privacy}</button>.
                  <span className="text-[hsl(0_84%_68%)]"> *</span>
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <button type="button" role="checkbox" aria-checked={news} onClick={() => setNews(v => !v)}
                  className={cn("mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-colors flex-shrink-0",
                    news ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground)/0.5)] hover:border-[hsl(var(--primary))]")}>
                  {news && <Icons.Check size={12} stroke={3} className="text-white" />}
                </button>
                <span className="text-[12.5px] text-[hsl(var(--muted-foreground))] leading-snug">
                  {lang === "fr" ? "Recevoir les nouveautés produit (optionnel, 1×/mois max)." : "Get product news (optional, 1×/month max)."}
                </span>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading || !gdpr}
              title={!gdpr ? (lang === "fr" ? "Acceptez les Conditions pour continuer" : "Accept the Terms to continue") : undefined}>
              {loading ? <><Spinner /> …</> : <>{lang === "fr" ? "Créer mon compte" : "Create my account"} <Icons.ArrowRight size={16} /></>}
            </Button>

            {/* reassurance */}
            <div className="flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-[11.5px] text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1.5"><Icons.Lock size={12} className="text-[hsl(142_70%_50%)]" /> {lang === "fr" ? "Chiffrement AES-256" : "AES-256 encryption"}</span>
              <span className="flex items-center gap-1.5"><Icons.Check size={12} className="text-[hsl(142_70%_50%)]" /> {lang === "fr" ? "Aucune carte requise" : "No card required"}</span>
              <span className="flex items-center gap-1.5"><Icons.Check size={12} className="text-[hsl(142_70%_50%)]" /> {lang === "fr" ? "Résiliable en 1 clic" : "Cancel in 1 click"}</span>
            </div>
          </form>

          {/* switch to login */}
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-7 text-center">
            {lang === "fr" ? "Vous avez déjà un compte ? " : "Already have an account? "}
            <button onClick={() => setRoute("login")} className="font-semibold text-[hsl(var(--primary))] hover:underline">
              {lang === "fr" ? "Se connecter" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      {/* Right — marketing (creation variant) */}
      <AuthAside variant="signup" />

      {typeof LegalModal !== "undefined" && <LegalModal open={!!legal} tab={legal} onClose={() => setLegal(null)} onTab={setLegal} />}
    </div>
  );
}

Object.assign(window, { SignupPage });
