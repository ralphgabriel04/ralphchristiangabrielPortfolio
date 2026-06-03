/* global React, Icons, Button, Card, Badge, Input, Checkbox, Avatar, Logo, cn, useState, ProgressBar */

/* ============================================================
   PAGE 2 — LOGIN (/login)
============================================================ */
function LoginPage({ setRoute }) {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-full grid lg:grid-cols-2">
      {/* Left */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <button onClick={() => setRoute("landing")} className="block mb-10">
            <Logo size={36} />
          </button>
          <h1 className="text-[28px] font-bold tracking-tight">Welcome!</h1>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-1.5 mb-8">Log in or create an account in 30 seconds.</p>

          <div className="space-y-2.5">
            <OAuthButton icon={<Icons.Google size={18} />} label="Continue with Google" onClick={() => setRoute("onboarding")} />
            <OAuthButton icon={<Icons.Microsoft size={18} />} label="Continue with Microsoft" onClick={() => setRoute("onboarding")} />
            <OAuthButton icon={<Icons.Github size={18} />} label="Continue with GitHub" onClick={() => setRoute("onboarding")} />
            <OAuthButton icon={<Icons.Apple size={18} />} label="Continue with Apple" onClick={() => setRoute("onboarding")} />
          </div>

          <div className="flex items-center gap-3 my-6 text-[11px] uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
            <span>Enterprise SSO</span>
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
          </div>

          <button className="w-full h-12 rounded-[8px] border border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.08)] flex items-center justify-center gap-2.5 text-[14px] font-medium transition-colors">
            <Icons.Building size={18} className="text-[hsl(var(--primary))]" />
            Sign in with SSO
          </button>

          <div className="flex items-center gap-3 my-6 text-[11px] uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
            <span>or with your email</span>
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
          </div>

          <div className="space-y-3">
            <Input
              icon={Icons.Mail}
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12"
            />
            <Button size="lg" className="w-full" iconRight={Icons.ArrowRight} onClick={() => setRoute("onboarding")}>Continue</Button>
          </div>

          <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-8 leading-relaxed">
            By continuing, you agree to our <a href="#" className="underline hover:text-[hsl(var(--foreground))]">Terms</a> and <a href="#" className="underline hover:text-[hsl(var(--foreground))]">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Right gradient */}
      <div className="hidden lg:flex relative overflow-hidden p-12 items-center justify-center" style={{ background: "linear-gradient(135deg, #2d1b69 0%, #1e1b4b 50%, #4c1d95 100%)" }}>
        <div className="ambient-glow" style={{ width: 500, height: 500, top: "20%", left: "20%", background: "#ec4899", opacity: 0.3 }} />
        <div className="ambient-glow" style={{ width: 400, height: 400, bottom: "10%", right: "10%", background: "#8b5cf6", opacity: 0.4 }} />
        <div className="relative max-w-md text-white">
          <Badge variant="primary" className="mb-6 bg-white/10 text-white">Early access</Badge>
          <h2 className="text-[36px] font-bold tracking-tight leading-[1.1]" style={{ textWrap: "balance" }}>
            Manage your time<br/><span className="italic font-serif">intelligently.</span>
          </h2>
          <p className="text-[15px] text-white/70 mt-5 leading-relaxed">
            One app for your calendars, tasks, habits and goals.
            Built for people who want to take back control.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-10">
            {[
              { i: Icons.Calendar, t: "Multi-calendar", d: "Google · Outlook · Apple" },
              { i: Icons.Target, t: "Focus & Pomodoro", d: "Guided sessions" },
              { i: Icons.Heart, t: "Energy", d: "Adapts to your rhythm" },
              { i: Icons.BarChart, t: "Insights", d: "Your private metrics" },
            ].map(f => (
              <div key={f.t} className="rounded-[10px] bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                <f.i size={18} className="mb-2" />
                <div className="text-[13px] font-semibold">{f.t}</div>
                <div className="text-[11px] text-white/60 mt-0.5">{f.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-[12px] text-white/60">
            <Icons.Shield size={14} />
            AES-256 encryption · GDPR-compliant
          </div>
        </div>
      </div>
    </div>
  );
}

function OAuthButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 rounded-[8px] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.4)] flex items-center justify-center gap-2.5 text-[14px] font-medium transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

/* OnboardingPage now lives in onboarding.jsx (loaded after this file). */
Object.assign(window, { LoginPage });
