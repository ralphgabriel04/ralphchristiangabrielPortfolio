/* global React, useState, cn, Icons, Button, Card, Badge, Switch, ProgressBar */

/* ============================================================
   PRIVACY / DATA CENTER  (/privacy)  +  BILLING / PLANS  (/billing)
   Clear, reassuring data controls and a billing surface that's ready
   without dominating the app. FRONT-END ONLY — all mock state.
============================================================ */

/* =================== PRIVACY / DATA CENTER =================== */
const DATA_CATEGORIES = [
  { id: "calendar", label: "Calendar & events", icon: Icons.Calendar, size: "2.1 MB", why: "Powers your agenda, planning and conflict detection.", scope: "1,284 events" },
  { id: "tasks", label: "Tasks & projects", icon: Icons.CheckSquare, size: "640 KB", why: "Your to-dos, priorities and time estimates.", scope: "342 tasks" },
  { id: "health", label: "Health & energy", icon: Icons.Heart, size: "1.4 MB", why: "Energy check-ins to schedule around your peaks.", scope: "From Apple Health" },
  { id: "journal", label: "Notes & journal", icon: Icons.Book, size: "320 KB", why: "Quick notes and reflections. Never used for AI training.", scope: "84 notes" },
  { id: "analytics", label: "Usage analytics", icon: Icons.BarChart, size: "180 KB", why: "Anonymous product metrics. Optional.", scope: "Opt-out anytime" },
];

const CONNECTED_APPS = [
  { name: "Google Calendar", icon: Icons.Google, scopes: ["calendar.events", "calendar.readonly"], granted: "Mar 2026" },
  { name: "Apple Health", icon: Icons.Apple, scopes: ["health.read"], granted: "Apr 2026" },
  { name: "Spotify", icon: Icons.Spotify, scopes: ["playback.read"], granted: "May 2026" },
];

const ACCESS_LOG = [
  { what: "Calendar synced", src: "Google · automated", when: "4 min ago" },
  { what: "Data export generated", src: "You · web", when: "2 days ago" },
  { what: "Signed in", src: "macOS · Montréal", when: "2 days ago" },
  { what: "Health data imported", src: "Apple Health", when: "1 week ago" },
];

function PrivacyPage() {
  const [consents, setConsents] = useState({ analytics: true, personalization: true, marketing: false });
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight">Data & Privacy</h1>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Exactly what's stored, why, and how to remove it. Your data is yours.</p>
      </div>

      {/* reassurance banner */}
      <div className="rounded-[12px] border border-[hsl(142_70%_45%/0.25)] bg-[hsl(142_70%_45%/0.05)] p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[hsl(142_70%_45%/0.14)] flex items-center justify-center flex-shrink-0"><Icons.Shield size={17} className="text-[hsl(142_70%_55%)]" /></div>
        <div className="text-[12.5px] text-[hsl(var(--muted-foreground))]">
          <span className="font-semibold text-[hsl(var(--foreground))]">Your calendar is private by default.</span> DPM never sells your data and never uses your notes or events to train models. You can export or delete everything at any time.
        </div>
      </div>

      {/* data categories */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">What we store</div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-[hsl(var(--border))]">
          {DATA_CATEGORIES.map(d => (
            <div key={d.id} className="p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.5)] flex items-center justify-center flex-shrink-0"><d.icon size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="text-[13.5px] font-semibold">{d.label}</span><Badge variant="muted">{d.size}</Badge></div>
                <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">{d.why}</div>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1 font-mono">{d.scope}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button size="sm" variant="ghost" icon={Icons.Download} onClick={() => window.__dpmToast?.(`Exporting ${d.label.toLowerCase()}…`)}>Export</Button>
                <Button size="sm" variant="ghost" icon={Icons.Trash} onClick={() => window.__dpmToast?.(`${d.label} deletion requested`, { tone: "danger" })}>Delete</Button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* connected apps + scopes */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">Connected apps & permissions</div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-[hsl(var(--border))]">
          {CONNECTED_APPS.map(a => (
            <div key={a.name} className="p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.4)] flex items-center justify-center flex-shrink-0"><a.icon size={18} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold">{a.name}</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {a.scopes.map(s => <span key={s} className="inline-flex items-center gap-1 h-6 px-2 rounded-[6px] bg-[hsl(var(--muted)/0.5)] text-[10.5px] font-mono text-[hsl(var(--muted-foreground))]"><Icons.Lock size={9} />{s}</span>)}
                </div>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1.5">Granted {a.granted}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => window.__dpmToast?.(`${a.name} access revoked`, { tone: "danger" })}>Revoke</Button>
            </div>
          ))}
        </Card>
      </div>

      {/* consents */}
      <Card>
        <div className="text-[13px] font-semibold mb-3">Consents</div>
        <div className="space-y-3 divide-y divide-[hsl(var(--border))]">
          {[
            { k: "analytics", l: "Anonymous analytics", d: "Help improve DPM with non-identifying usage data." },
            { k: "personalization", l: "Personalized suggestions", d: "Let the AI use your patterns to plan better." },
            { k: "marketing", l: "Product emails", d: "Occasional updates about new features." },
          ].map((c, i) => (
            <div key={c.k} className={cn("flex items-center justify-between gap-4", i > 0 && "pt-3")}>
              <div><div className="text-[13px] font-medium">{c.l}</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{c.d}</div></div>
              <Switch checked={consents[c.k]} onChange={v => setConsents(s => ({ ...s, [c.k]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      {/* access history */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">Access history</div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-[hsl(var(--border))]">
          {ACCESS_LOG.map((l, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3 text-[12.5px]">
              <Icons.Activity size={13} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
              <span className="font-medium">{l.what}</span>
              <span className="text-[hsl(var(--muted-foreground))]">{l.src}</span>
              <span className="ml-auto text-[11.5px] text-[hsl(var(--muted-foreground))]">{l.when}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* danger */}
      <Card className="border-[hsl(0_84%_60%/0.3)]">
        <div className="flex items-center gap-2 mb-3"><Icons.AlertTriangle size={16} className="text-[hsl(0_84%_70%)]" /><h3 className="text-[14px] font-semibold text-[hsl(0_84%_75%)]">Erase data</h3></div>
        <div className="space-y-3 divide-y divide-[hsl(var(--border))]">
          {[
            { l: "Delete imported data", d: "Remove everything imported from other apps — keeps your DPM data.", b: "Delete imports", v: "outline" },
            { l: "Pause my account", d: "Hide your data and stop all syncing. Reversible anytime.", b: "Pause", v: "outline" },
            { l: "Delete my account", d: "Permanent erasure within 24h · double confirmation required.", b: "Delete account", v: "destructive" },
          ].map((r, i) => (
            <div key={i} className={cn("flex items-center justify-between gap-4", i > 0 && "pt-3")}>
              <div><div className="text-[13px] font-medium">{r.l}</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{r.d}</div></div>
              <Button size="sm" variant={r.v} icon={r.v === "destructive" ? Icons.Trash : undefined}>{r.b}</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =================== BILLING / PLANS =================== */
const PLANS = [
  { id: "free", name: "Free", price: "CA$0", per: "forever", features: ["1 calendar", "Basic planning", "5 automations", "Community support"], cta: "Downgrade", current: false },
  { id: "pro", name: "Pro", price: "CA$12", per: "/ month", features: ["Unlimited calendars", "AI planning", "Unlimited automations", "All integrations", "Priority support"], cta: "Current plan", current: true, popular: true },
  { id: "team", name: "Team", price: "CA$25", per: "/ user / mo", features: ["Everything in Pro", "Shared spaces", "Meeting polls", "Admin controls", "SSO"], cta: "Upgrade", current: false },
];

const USAGE = [
  { label: "Calendars connected", value: 3, max: 999, display: "3 / Unlimited", pct: 12 },
  { label: "Active automations", value: 8, max: 999, display: "8 / Unlimited", pct: 16 },
  { label: "AI suggestions this month", value: 142, max: 500, display: "142 / 500", pct: 28 },
  { label: "Shared spaces", value: 2, max: 3, display: "2 / 3", pct: 66 },
];

function BillingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight">Plan & Billing</h1>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Manage your subscription, usage and invoices.</p>
      </div>

      {/* current plan */}
      <Card className="bg-gradient-to-br from-[hsl(263_70%_60%/0.08)] to-transparent border-[hsl(var(--primary)/0.25)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[10px] bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] flex items-center justify-center"><Icons.Sparkles size={20} /></div>
            <div>
              <div className="flex items-center gap-2"><span className="text-[16px] font-bold">DPM Pro</span><Badge variant="success" dot>Active</Badge></div>
              <div className="text-[12.5px] text-[hsl(var(--muted-foreground))]">CA$12 / month · renews Jul 27, 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">Manage</Button>
            <Button size="sm">Upgrade to Team</Button>
          </div>
        </div>
      </Card>

      {/* trial banner */}
      <div className="rounded-[10px] border border-[hsl(38_92%_55%/0.3)] bg-[hsl(38_92%_55%/0.05)] p-3.5 flex items-center gap-3">
        <Icons.Clock size={16} className="text-[hsl(38_92%_60%)] flex-shrink-0" />
        <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] flex-1"><span className="font-semibold text-[hsl(38_92%_64%)]">Team trial</span> — 9 days left. Add your team before it ends to keep shared spaces.</div>
        <Button size="sm" variant="outline">Start trial</Button>
      </div>

      {/* usage */}
      <Card>
        <div className="text-[13px] font-semibold mb-4">Usage this period</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {USAGE.map(u => (
            <div key={u.label}>
              <div className="flex items-center justify-between mb-1.5"><span className="text-[12.5px] text-[hsl(var(--muted-foreground))]">{u.label}</span><span className="text-[12px] font-semibold tabular-nums">{u.display}</span></div>
              <ProgressBar value={u.pct} color={u.pct > 80 ? "warning" : "primary"} height="h-1.5" />
            </div>
          ))}
        </div>
      </Card>

      {/* plans */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">Compare plans</div>
        <div className="grid grid-cols-3 gap-3">
          {PLANS.map(p => (
            <div key={p.id} className={cn("rounded-[12px] border p-4 flex flex-col relative", p.current ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.04)]" : "border-[hsl(var(--border))]")}>
              {p.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[hsl(var(--primary))] text-white text-[10px] font-semibold">Most popular</span>}
              <div className="text-[14px] font-bold">{p.name}</div>
              <div className="flex items-baseline gap-1 mt-1"><span className="text-[24px] font-bold">{p.price}</span><span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{p.per}</span></div>
              <div className="space-y-1.5 mt-3 flex-1">
                {p.features.map(f => <div key={f} className="flex items-start gap-1.5 text-[11.5px] text-[hsl(var(--muted-foreground))]"><Icons.Check size={12} className="mt-0.5 flex-shrink-0 text-[hsl(142_70%_55%)]" stroke={3} />{f}</div>)}
              </div>
              <Button size="sm" variant={p.current ? "secondary" : "outline"} className="mt-4 w-full" disabled={p.current} onClick={() => window.__dpmToast?.(`Switching to ${p.name}…`)}>{p.cta}</Button>
            </div>
          ))}
        </div>
      </div>

      {/* payment + invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <div className="text-[13px] font-semibold mb-3">Payment method</div>
          <div className="flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(var(--border))]">
            <div className="w-10 h-7 rounded-[5px] bg-gradient-to-br from-[hsl(217_91%_55%)] to-[hsl(263_70%_55%)] flex items-center justify-center text-white text-[9px] font-bold">VISA</div>
            <div className="flex-1"><div className="text-[12.5px] font-medium">•••• 4242</div><div className="text-[11px] text-[hsl(var(--muted-foreground))]">Expires 08/27</div></div>
            <Button size="sm" variant="ghost">Update</Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3"><div className="text-[13px] font-semibold">Invoices</div><button className="text-[12px] text-[hsl(var(--primary))] hover:underline">View all</button></div>
          <div className="space-y-1.5">
            {["Jun 2026", "May 2026", "Apr 2026"].map(m => (
              <div key={m} className="flex items-center gap-2 text-[12.5px] py-1">
                <Icons.Download size={13} className="text-[hsl(var(--muted-foreground))]" />
                <span className="flex-1">{m}</span><span className="text-[hsl(var(--muted-foreground))]">CA$12.00</span>
                <Badge variant="success">Paid</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { PrivacyPage, BillingPage });
