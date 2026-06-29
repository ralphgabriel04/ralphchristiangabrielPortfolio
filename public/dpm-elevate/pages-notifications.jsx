/* global React, useState, cn, Icons, Button, Card, Badge, Switch */

/* ============================================================
   NOTIFICATIONS  (/notifications)
   Permission states, per-type channels, quiet hours, digests and a live
   inbox. FRONT-END ONLY — permission + delivery are simulated.
============================================================ */

const NOTIF_TYPES = [
  { id: "focus", label: "Focus session", desc: "Start / end of a focus block", icon: Icons.Zap, push: true, email: false },
  { id: "overdue", label: "Overdue tasks", desc: "When a task passes its due time", icon: Icons.AlertTriangle, push: true, email: true },
  { id: "conflict", label: "Sync conflicts", desc: "When calendars disagree", icon: Icons.Refresh, push: true, email: false },
  { id: "energy", label: "Energy check-in", desc: "Twice-daily mood & energy prompt", icon: Icons.Heart, push: false, email: false },
  { id: "reminder", label: "Event reminders", desc: "Before meetings & events", icon: Icons.Bell, push: true, email: false },
  { id: "digest", label: "Daily digest", desc: "Tomorrow's plan, every evening", icon: Icons.Inbox, push: false, email: true },
];

const INBOX = [
  { id: 1, type: "focus", title: "Focus block starting", body: "Deep work — Architecture doc · 90 min", when: "now", tone: "142 70% 45%", icon: Icons.Zap },
  { id: 2, type: "overdue", title: "Task overdue", body: "Review PR #142 was due at 14:00", when: "12 min ago", tone: "0 84% 60%", icon: Icons.AlertTriangle },
  { id: 3, type: "conflict", title: "Sync conflict", body: "1:1 — Sarah overlaps Design review", when: "1h ago", tone: "38 92% 55%", icon: Icons.Refresh, action: "Resolve" },
  { id: 4, type: "energy", title: "How's your energy?", body: "Quick check-in to plan your afternoon", when: "2h ago", tone: "263 70% 62%", icon: Icons.Heart },
  { id: 5, type: "failed", title: "Notification failed", body: "Couldn't reach your device — retry?", when: "3h ago", tone: "0 84% 60%", icon: Icons.AlertTriangle, failed: true },
];

function PermissionCard({ state, onChange }) {
  const map = {
    default: { badge: "warning", label: "Not enabled", title: "Enable push notifications", body: "Get reminders, focus alerts and conflict warnings on this device.", cta: "Enable notifications", icon: Icons.Bell },
    granted: { badge: "success", label: "Enabled", title: "Push notifications are on", body: "This device will receive alerts based on your preferences below.", cta: "Send test notification", icon: Icons.Check },
    denied: { badge: "danger", label: "Blocked", title: "Notifications are blocked", body: "Your browser is blocking notifications. Enable them in site settings to receive alerts.", cta: "How to fix", icon: Icons.EyeOff },
  };
  const m = map[state];
  return (
    <Card className={cn(state === "granted" && "border-[hsl(142_70%_45%/0.3)]", state === "denied" && "border-[hsl(0_84%_60%/0.3)]")}>
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ background: state === "granted" ? "hsl(142 70% 45% / 0.14)" : state === "denied" ? "hsl(0 84% 60% / 0.12)" : "hsl(38 92% 55% / 0.12)",
                   color: state === "granted" ? "hsl(142 70% 55%)" : state === "denied" ? "hsl(0 84% 70%)" : "hsl(38 92% 60%)" }}>
          <m.icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2"><span className="text-[14px] font-semibold">{m.title}</span><Badge variant={m.badge} dot>{m.label}</Badge></div>
          <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-1">{m.body}</div>
        </div>
        <Button size="sm" variant={state === "granted" ? "outline" : "primary"}
          onClick={() => { if (state === "default") { onChange("granted"); window.__dpmToast?.("Notifications enabled"); } else if (state === "granted") { window.__dpmToast?.("Test notification sent"); } else { onChange("default"); } }}>
          {m.cta}
        </Button>
      </div>
    </Card>
  );
}

function ChannelToggle({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick}
      className={cn("h-7 px-2 rounded-[6px] text-[11px] font-medium inline-flex items-center gap-1 border transition-colors",
        active ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.1)] text-[hsl(263_70%_75%)]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}>
      <Icon size={11} /> {label}
    </button>
  );
}

function NotificationsPage() {
  const [perm, setPerm] = useState("default");
  const [types, setTypes] = useState(NOTIF_TYPES);
  const [quiet, setQuiet] = useState(true);
  const [inbox, setInbox] = useState(INBOX);

  const setChannel = (id, ch) => setTypes(ts => ts.map(t => t.id === id ? { ...t, [ch]: !t[ch] } : t));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight">Notifications</h1>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Decide what reaches you, where, and when — without the noise.</p>
      </div>

      <PermissionCard state={perm} onChange={setPerm} />

      {/* quiet hours */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[hsl(263_70%_62%/0.12)] text-[hsl(263_70%_72%)] flex items-center justify-center"><Icons.Moon size={16} /></div>
            <div><div className="text-[13.5px] font-semibold">Quiet hours</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">Silence non-urgent alerts overnight</div></div>
          </div>
          <Switch checked={quiet} onChange={setQuiet} />
        </div>
        {quiet && (
          <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[12.5px]"><span className="text-[hsl(var(--muted-foreground))]">From</span>
              <span className="h-8 px-3 rounded-[7px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] inline-flex items-center font-mono font-medium">22:00</span>
              <span className="text-[hsl(var(--muted-foreground))]">to</span>
              <span className="h-8 px-3 rounded-[7px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] inline-flex items-center font-mono font-medium">07:30</span>
            </div>
            <span className="text-[11.5px] text-[hsl(var(--muted-foreground))] inline-flex items-center gap-1.5"><Icons.AlertTriangle size={11} className="text-[hsl(38_92%_60%)]" /> Urgent conflicts still come through</span>
          </div>
        )}
      </Card>

      {/* per-type channels */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">By type</div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-[hsl(var(--border))]">
          {types.map(t => {
            const off = !t.push && !t.email;
            return (
              <div key={t.id} className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.5)] flex items-center justify-center flex-shrink-0"><t.icon size={15} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold flex items-center gap-2">{t.label}{off && <span className="text-[11px] font-normal text-[hsl(var(--muted-foreground))]">· off</span>}</div>
                  <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{t.desc}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ChannelToggle active={t.push} onClick={() => setChannel(t.id, "push")} icon={Icons.Smartphone} label="Push" />
                  <ChannelToggle active={t.email} onClick={() => setChannel(t.id, "email")} icon={Icons.Mail} label="Email" />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* digests */}
      <Card>
        <div className="text-[13px] font-semibold mb-3">Digests</div>
        <div className="space-y-3 divide-y divide-[hsl(var(--border))]">
          {[
            { l: "Daily digest", d: "Tomorrow's plan, every evening at 20:00", on: true },
            { l: "Weekly review", d: "Your week in review, Sunday at 18:00", on: false },
          ].map((d, i) => (
            <div key={i} className={cn("flex items-center justify-between gap-4", i > 0 && "pt-3")}>
              <div><div className="text-[13px] font-medium">{d.l}</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{d.d}</div></div>
              <Switch checked={d.on} onChange={() => {}} />
            </div>
          ))}
        </div>
      </Card>

      {/* live inbox */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))]">Recent · preview</div>
          <button onClick={() => setInbox([])} className="text-[12px] text-[hsl(var(--primary))] hover:underline">Clear all</button>
        </div>
        {inbox.length === 0 ? (
          <Card padding="p-10" className="text-center">
            <div className="w-11 h-11 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-3 text-[hsl(var(--muted-foreground))]"><Icons.Bell size={18} /></div>
            <p className="text-[13.5px] font-medium">You're all caught up</p>
            <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">New notifications will appear here.</p>
          </Card>
        ) : (
          <Card padding="p-0" className="overflow-hidden divide-y divide-[hsl(var(--border))]">
            {inbox.map(n => (
              <div key={n.id} className="p-3.5 flex items-start gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${n.tone} / 0.12)`, color: `hsl(${n.tone})` }}><n.icon size={14} /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold flex items-center gap-2">{n.title}{n.failed && <Badge variant="danger" dot>Failed</Badge>}</div>
                  <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{n.body}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {n.action && <Button size="sm" variant="outline" onClick={() => { window.__dpmSyncIntent = "conflicts"; window.__dpmNavigate?.("sync"); }}>{n.action}</Button>}
                  {n.failed && <Button size="sm" variant="ghost" icon={Icons.Refresh} onClick={() => window.__dpmToast?.("Retrying…")}>Retry</Button>}
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))] whitespace-nowrap">{n.when}</span>
                  <button onClick={() => setInbox(b => b.filter(x => x.id !== n.id))} className="w-6 h-6 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"><Icons.X size={12} /></button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsPage });
