/* global React, Icons, Button, Badge, Logo, cn, useState,
   useAuthT, emailValid, Spinner, Field, AuthInput, PasswordField,
   OAuthButton, AuthAside, AuthLegalLine, LegalModal, useProfile */

/* ============================================================
   PAGE 2 — LOGIN (/login)  ·  for EXISTING users

   Model (stated plainly to the user): email + password.
   Real states: live email validation, per-button OAuth loading,
   submit loading, and a readable error message. New users are routed
   to /signup. A successful login lands in the app (home).
============================================================ */
function LoginPage({ setRoute }) {
  const [T] = useAuthT();
  const [, updateProfile] = useProfile();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState({ email: false, pwd: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [formError, setFormError] = useState("");
  const [legal, setLegal] = useState(null);

  const emailErr = (touched.email || submitted) && !emailValid(email) ? T.emailErr : "";
  const pwdErr = (touched.pwd || submitted) && !pwd ? T.password + " —" : "";

  const goApp = () => {
    updateProfile({ email: email.trim() || (window.__dpmProfile && window.__dpmProfile.email) || "" });
    setRoute("home");
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");
    if (!emailValid(email) || !pwd) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); goApp(); }, 950);
  };

  const oauth = (id) => {
    if (loading || oauthLoading) return;
    setOauthLoading(id);
    setTimeout(() => { setOauthLoading(null); goApp(); }, 1000);
  };

  const providers = [
    { id: "google", icon: <Icons.Google size={18} />, name: "Google" },
    { id: "microsoft", icon: <Icons.Microsoft size={18} />, name: "Microsoft" },
    { id: "apple", icon: <Icons.Apple size={18} />, name: "Apple" },
    { id: "github", icon: <Icons.Github size={18} />, name: "GitHub" },
  ];

  return (
    <div className="min-h-full grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <button onClick={() => setRoute("landing")} className="block mb-10 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" aria-label="DPM Elevate — home">
            <Logo size={36} />
          </button>
          <h1 className="text-[28px] font-bold tracking-tight">{T.aside.loginBadge} 👋</h1>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-1.5 mb-8">
            {/* model stated plainly */}
            {(useAuthTLang() === "fr")
              ? "Connectez-vous avec votre email et votre mot de passe."
              : "Log in with your email and password."}
          </p>

          {/* OAuth — 2×2 grid, each with its own loading state */}
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
            <Field id="login-email" label={T.email} error={emailErr}>
              <AuthInput id="login-email" icon={Icons.Mail} type="email" name="email" autoComplete="email"
                placeholder={T.emailPh} value={email} invalid={!!emailErr}
                onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(t => ({ ...t, email: true }))} />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-pwd" className="block text-[12.5px] font-medium">{T.password}</label>
                <button type="button" onClick={() => setRoute("login")} className="text-[12px] text-[hsl(var(--primary))] hover:underline">{T.forgot}</button>
              </div>
              <PasswordField id="login-pwd" value={pwd} onChange={e => setPwd(e.target.value)}
                placeholder={T.passwordPh} autoComplete="current-password" invalid={!!pwdErr} />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
              <button type="button" role="checkbox" aria-checked={remember} onClick={() => setRemember(r => !r)}
                className={cn("w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-colors flex-shrink-0",
                  remember ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground)/0.4)]")}>
                {remember && <Icons.Check size={12} stroke={3} className="text-white" />}
              </button>
              <span className="text-[13px] text-[hsl(var(--muted-foreground))]">{T.remember}</span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <><Spinner /> …</> : <>{useAuthTLang() === "fr" ? "Se connecter" : "Log in"} <Icons.ArrowRight size={16} /></>}
            </Button>
          </form>

          {/* switch to signup */}
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-7 text-center">
            {useAuthTLang() === "fr" ? "Pas encore de compte ? " : "Don't have an account? "}
            <button onClick={() => setRoute("signup")} className="font-semibold text-[hsl(var(--primary))] hover:underline">
              {useAuthTLang() === "fr" ? "Créer un compte" : "Create an account"}
            </button>
          </p>

          <div className="mt-6"><AuthLegalLine onLegal={setLegal} /></div>
        </div>
      </div>

      {/* Right — marketing */}
      <AuthAside variant="login" />

      {typeof LegalModal !== "undefined" && <LegalModal open={!!legal} tab={legal} onClose={() => setLegal(null)} onTab={setLegal} />}
    </div>
  );
}

/* tiny helper to branch copy without re-calling the hook awkwardly */
function useAuthTLang() {
  return (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
}

Object.assign(window, { LoginPage });
