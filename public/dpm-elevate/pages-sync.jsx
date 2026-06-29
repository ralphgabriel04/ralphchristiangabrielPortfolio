/* global React, useState, useEffect, cn, Icons, Button, Card, Badge, Switch, ProgressBar */

/* ============================================================
   SYNC CENTER  (/sync)
   The home for everything calendar-connectivity: provider health,
   per-calendar permissions, conflict resolution, and data portability.
   FRONT-END ONLY — providers/conflicts are mock state; every back-end
   touchpoint (OAuth, token refresh, push/pull, export job) has a clear,
   credible visual representation but no network.
============================================================ */

/* ---------- right-side sheet (drawer) ---------- */
function SyncSheet({ open, onClose, title, subtitle, icon: Icon, children, footer, width = "max-w-[520px]" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex justify-end anim-fade-in" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={cn("h-full w-full bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] shadow-2xl flex flex-col anim-scale-in", width)} style={{ transformOrigin: "right" }}>
        <div className="px-5 h-16 flex items-center gap-3 border-b border-[hsl(var(--border))] flex-shrink-0">
          {Icon && <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.5)] flex items-center justify-center flex-shrink-0"><Icon size={17} /></div>}
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold truncate">{title}</div>
            {subtitle && <div className="text-[12px] text-[hsl(var(--muted-foreground))] truncate">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"><Icons.X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center justify-end gap-2 bg-[hsl(var(--background)/0.4)] flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- provider state model ---------- */
const PROVIDER_ICON = { google: Icons.Google, microsoft: Icons.Microsoft, apple: Icons.Apple };

const INITIAL_PROVIDERS = [
  {
    id: "google", name: "Google Calendar", account: "ralph@gmail.com",
    state: "connected", direction: "two-way", lastSync: "4 min ago",
    calCount: 5, calEnabled: 3, conflicts: 2, partial: true, paused: false,
    scopes: ["calendar.events", "calendar.readonly", "calendar.settings"],
    note: "1 calendar skipped — insufficient permission",
  },
  {
    id: "microsoft", name: "Microsoft Outlook", account: "ralph@dpm.io",
    state: "token-expired", direction: "two-way", lastSync: "3 days ago",
    calCount: 2, calEnabled: 2, conflicts: 0, scopes: ["Calendars.ReadWrite"],
  },
  {
    id: "apple", name: "Apple Calendar", account: null,
    state: "disconnected", calCount: 0, calEnabled: 0, conflicts: 0,
  },
];

const STATE_BADGE = {
  connected: { variant: "success", label: "Connected", dot: true },
  "token-expired": { variant: "danger", label: "Reconnect required", dot: true },
  "permissions": { variant: "warning", label: "Limited access", dot: true },
  syncing: { variant: "info", label: "Syncing…", dot: true },
  paused: { variant: "muted", label: "Paused", dot: true },
  disconnected: { variant: "muted", label: "Not connected", dot: false },
};

const MOCK_CALS = {
  google: [
    { id: "g1", name: "Work", color: "217 91% 60%", mode: "two-way", on: true },
    { id: "g2", name: "Personal", color: "263 70% 62%", mode: "two-way", on: true },
    { id: "g3", name: "Holidays in Canada", color: "142 70% 45%", mode: "import", on: true },
    { id: "g4", name: "Team — Engineering", color: "38 92% 55%", mode: "readonly", on: false },
    { id: "g5", name: "Birthdays", color: "330 80% 60%", mode: "import", on: false, blocked: true },
  ],
};

const CAL_MODE = {
  "two-way": { label: "Two-way", icon: Icons.Refresh, tone: "text-[hsl(142_70%_55%)]" },
  readonly: { label: "Read-only", icon: Icons.Eye, tone: "text-[hsl(var(--muted-foreground))]" },
  import: { label: "Import only", icon: Icons.Download, tone: "text-[hsl(217_91%_65%)]" },
};

function SyncProviderCard({ p, onSync, onManage, onConflicts, onMutate }) {
  const Icon = PROVIDER_ICON[p.id];
  const badge = STATE_BADGE[p.state] || STATE_BADGE.disconnected;
  const connected = p.state === "connected" || p.state === "syncing" || p.state === "paused";
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="flex items-start gap-3.5 p-4">
        <div className="w-11 h-11 rounded-[10px] bg-[hsl(var(--muted)/0.4)] flex items-center justify-center flex-shrink-0">
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14.5px] font-semibold">{p.name}</span>
            <Badge variant={badge.variant} dot={badge.dot}>{p.state === "syncing" ? "Syncing…" : badge.label}</Badge>
            {connected && p.direction && p.state !== "syncing" && (
              <Badge variant="muted">{p.direction === "two-way" ? "Two-way" : "Import only"}</Badge>
            )}
          </div>
          <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-1">
            {connected ? <>{p.account} · {p.calEnabled}/{p.calCount} calendars · last sync {p.lastSync}</>
              : p.state === "token-expired" ? <>{p.account} · token expired {p.lastSync}</>
              : "Connect to import and two-way sync your calendars"}
          </div>

          {/* syncing progress */}
          {p.state === "syncing" && (
            <div className="mt-2.5">
              <ProgressBar value={p.progress || 0} color="info" height="h-1.5" />
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Pulling events… {p.progress || 0}%</div>
            </div>
          )}

          {/* token expired error */}
          {p.state === "token-expired" && (
            <div className="mt-2.5 rounded-[8px] border border-[hsl(0_84%_60%/0.3)] bg-[hsl(0_84%_60%/0.05)] p-2.5 flex items-start gap-2">
              <Icons.AlertTriangle size={14} className="text-[hsl(0_84%_70%)] flex-shrink-0 mt-0.5" />
              <div className="text-[12px] text-[hsl(var(--muted-foreground))]">
                Authorization expired — Microsoft requires you to sign in again. Sync is paused until you reconnect.
              </div>
            </div>
          )}

          {/* partial / permission warning */}
          {p.state === "connected" && p.partial && (
            <div className="mt-2.5 rounded-[8px] border border-[hsl(38_92%_55%/0.3)] bg-[hsl(38_92%_55%/0.05)] p-2.5 flex items-start gap-2">
              <Icons.AlertTriangle size={14} className="text-[hsl(38_92%_60%)] flex-shrink-0 mt-0.5" />
              <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{p.note}. <button onClick={onManage} className="text-[hsl(var(--primary))] font-medium hover:underline">Review permissions</button></div>
            </div>
          )}

          {/* scopes + actions */}
          {connected && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {p.scopes?.map(s => <span key={s} className="inline-flex items-center gap-1 h-6 px-2 rounded-[6px] bg-[hsl(var(--muted)/0.5)] text-[10.5px] font-mono text-[hsl(var(--muted-foreground))]"><Icons.Lock size={9} />{s}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* action bar */}
      <div className="px-4 py-2.5 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.18)] flex items-center gap-2 flex-wrap">
        {p.state === "disconnected" && <Button size="sm" icon={Icons.Plus} onClick={() => onMutate(p.id, { state: "connected", account: "ralph@icloud.com", direction: "two-way", lastSync: "just now", calCount: 3, calEnabled: 3, scopes: ["calendar.read", "calendar.write"] })}>Connect</Button>}
        {p.state === "token-expired" && <Button size="sm" icon={Icons.Refresh} onClick={() => onMutate(p.id, { state: "connected", lastSync: "just now" })}>Reconnect</Button>}
        {connected && p.state !== "syncing" && (
          <>
            <Button size="sm" variant="outline" icon={Icons.Refresh} onClick={() => onSync(p.id)}>Sync now</Button>
            <Button size="sm" variant="ghost" icon={Icons.Layers} onClick={onManage}>Manage calendars</Button>
            {p.conflicts > 0 && (
              <button onClick={onConflicts} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[13px] font-medium text-[hsl(38_92%_62%)] hover:bg-[hsl(38_92%_55%/0.1)]">
                <Icons.AlertTriangle size={14} /> {p.conflicts} conflicts
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">Pause</span>
              <Switch checked={p.state === "paused"} onChange={(v) => onMutate(p.id, { state: v ? "paused" : "connected" })} size="sm" />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/* ---------- manage calendars sheet ---------- */
function ManageCalendarsSheet({ open, onClose, provider }) {
  const [cals, setCals] = useState(MOCK_CALS.google);
  const set = (id, patch) => setCals(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  return (
    <SyncSheet open={open} onClose={onClose} title="Manage calendars" subtitle={provider ? `${provider.name} · ${provider.account}` : ""} icon={Icons.Layers}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button onClick={() => { window.__dpmToast?.("Calendar settings saved"); onClose(); }}>Save changes</Button></>}>
      <div className="space-y-2.5">
        {cals.map(c => {
          const mode = CAL_MODE[c.mode];
          return (
            <div key={c.id} className={cn("rounded-[10px] border p-3", c.blocked ? "border-[hsl(0_84%_60%/0.3)] bg-[hsl(0_84%_60%/0.04)]" : "border-[hsl(var(--border))]")}>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${c.color})` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium flex items-center gap-2">{c.name}{!c.on && <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-normal">· disabled</span>}</div>
                  <div className={cn("text-[11.5px] inline-flex items-center gap-1 mt-0.5", mode.tone)}><mode.icon size={11} /> {mode.label}</div>
                </div>
                <Switch checked={c.on} onChange={(v) => set(c.id, { on: v })} />
              </div>
              {c.on && !c.blocked && (
                <div className="mt-2.5 pt-2.5 border-t border-[hsl(var(--border))] flex items-center gap-1.5">
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))] mr-1">Mode</span>
                  {Object.entries(CAL_MODE).map(([k, m]) => (
                    <button key={k} onClick={() => set(c.id, { mode: k })}
                      className={cn("h-7 px-2.5 rounded-[6px] text-[11.5px] font-medium inline-flex items-center gap-1 transition-colors",
                        c.mode === k ? "bg-[hsl(var(--primary))] text-white" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}>
                      <m.icon size={11} />{m.label}
                    </button>
                  ))}
                </div>
              )}
              {c.blocked && (
                <div className="mt-2.5 pt-2.5 border-t border-[hsl(0_84%_60%/0.2)] text-[11.5px] text-[hsl(0_84%_72%)] flex items-center gap-1.5">
                  <Icons.Lock size={11} /> Read access not granted — re-authorize to enable this calendar.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SyncSheet>
  );
}

/* ---------- conflict center ---------- */
const MOCK_CONFLICTS = [
  {
    id: "c1", kind: "time", title: "1:1 — Sarah", recurring: false, source: "Google",
    local: { time: "10:00 → 10:30", where: "Zoom", note: "edited 2h ago" },
    remote: { time: "10:15 → 10:45", where: "Zoom", note: "edited 40 min ago" },
    diff: ["time"],
  },
  {
    id: "c2", kind: "deleted", title: "Architecture workshop", recurring: false, source: "Google",
    local: { time: "14:00 → 16:00", where: "Room B2", note: "still on your calendar" },
    remote: { time: "Deleted remotely", where: "—", note: "removed 1 day ago" },
    diff: ["existence"],
  },
  {
    id: "c3", kind: "recurring", title: "Team standup", recurring: true, source: "Outlook",
    local: { time: "09:00 → 09:15 · daily", where: "Teams", note: "this week" },
    remote: { time: "09:30 → 09:45 · daily", where: "Teams", note: "series moved" },
    diff: ["time"],
  },
];

function ConflictCenterSheet({ open, onClose }) {
  const [conflicts, setConflicts] = useState(MOCK_CONFLICTS);
  const [openId, setOpenId] = useState("c1");
  const resolve = (id, how) => {
    setConflicts(cs => cs.filter(c => c.id !== id));
    window.__dpmToast?.(`Conflict resolved · ${how}`);
  };
  return (
    <SyncSheet open={open} onClose={onClose} title="Conflict Center" subtitle={`${conflicts.length} unresolved`} icon={Icons.AlertTriangle} width="max-w-[640px]"
      footer={<><span className="text-[12px] text-[hsl(var(--muted-foreground))] mr-auto">Resolutions apply on next sync</span><Button variant="ghost" onClick={onClose}>Close</Button></>}>
      {conflicts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-12 h-12 rounded-full bg-[hsl(142_70%_45%/0.14)] flex items-center justify-center mb-4"><Icons.Check size={22} stroke={2.5} className="text-[hsl(142_70%_55%)]" /></div>
          <p className="font-medium text-[15px] mb-1">All caught up</p>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))]">No sync conflicts. Everything is in agreement across your calendars.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map(c => {
            const expanded = openId === c.id;
            return (
              <div key={c.id} className="rounded-[12px] border border-[hsl(38_92%_55%/0.3)] overflow-hidden">
                <button onClick={() => setOpenId(expanded ? null : c.id)} className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-[hsl(var(--accent))]">
                  <Icons.AlertTriangle size={16} className="text-[hsl(38_92%_60%)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold flex items-center gap-2">{c.title}
                      {c.recurring && <Badge variant="muted">Recurring</Badge>}
                    </div>
                    <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">
                      {c.kind === "deleted" ? "Deleted remotely · kept locally" : c.kind === "recurring" ? "Series time changed" : "Time overlap"} · {c.source}
                    </div>
                  </div>
                  <Icons.ChevronDown size={15} className={cn("text-[hsl(var(--muted-foreground))] transition-transform", expanded && "rotate-180")} />
                </button>

                {expanded && (
                  <div className="px-3.5 pb-3.5">
                    {/* two-column comparison */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {[["This device", c.local, "local"], [c.source, c.remote, "remote"]].map(([label, side, key]) => (
                        <div key={key} className={cn("rounded-[9px] border p-3", key === "remote" ? "border-[hsl(217_91%_60%/0.3)] bg-[hsl(217_91%_60%/0.04)]" : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)]")}>
                          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-1.5">{label}</div>
                          <div className={cn("text-[13px] font-medium font-mono", c.diff.includes("time") || c.diff.includes("existence") ? "text-[hsl(38_92%_65%)]" : "")}>{side.time}</div>
                          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1">{side.where}</div>
                          <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{side.note}</div>
                        </div>
                      ))}
                    </div>

                    {/* preview of resolution */}
                    <div className="mt-2.5 rounded-[9px] border border-[hsl(142_70%_45%/0.25)] bg-[hsl(142_70%_45%/0.05)] p-2.5 flex items-center gap-2">
                      <Icons.Eye size={13} className="text-[hsl(142_70%_55%)]" />
                      <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">Preview: accepting {c.source} sets <span className="font-mono text-[hsl(var(--foreground))]">{c.remote.time}</span></span>
                    </div>

                    {/* actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => resolve(c.id, "kept local")}>Keep local</Button>
                      <Button size="sm" onClick={() => resolve(c.id, `accepted ${c.source}`)}>Accept {c.source}</Button>
                      {c.kind !== "deleted" && <Button size="sm" variant="ghost" icon={Icons.Layers} onClick={() => resolve(c.id, "merged")}>Merge</Button>}
                      {c.recurring && (
                        <div className="inline-flex items-center rounded-[7px] border border-[hsl(var(--border))] overflow-hidden ml-1">
                          <button onClick={() => resolve(c.id, "this occurrence")} className="h-8 px-2.5 text-[12px] hover:bg-[hsl(var(--accent))]">This occurrence</button>
                          <span className="w-px h-5 bg-[hsl(var(--border))]" />
                          <button onClick={() => resolve(c.id, "whole series")} className="h-8 px-2.5 text-[12px] hover:bg-[hsl(var(--accent))]">Whole series</button>
                        </div>
                      )}
                      <button onClick={() => resolve(c.id, "ignored")} className="h-8 px-2.5 text-[12px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] rounded-[7px] ml-auto">Ignore</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SyncSheet>
  );
}

/* ---------- export sheet ---------- */
const EXPORT_ITEMS = [
  { id: "events", label: "Events", fmt: "ICS", icon: Icons.Calendar, count: "1,284 events" },
  { id: "tasks", label: "Tasks", fmt: "CSV", icon: Icons.CheckSquare, count: "342 tasks" },
  { id: "habits", label: "Habits", fmt: "CSV", icon: Icons.Flame, count: "12 habits · 410 logs" },
  { id: "archive", label: "Full account archive", fmt: "JSON", icon: Icons.Layers, count: "Everything, machine-readable" },
];
function ExportSheet({ open, onClose }) {
  const [sel, setSel] = useState({ events: true, tasks: true, habits: false, archive: false });
  const [phase, setPhase] = useState("pick"); // pick | working | ready
  const [pct, setPct] = useState(0);
  useEffect(() => { if (!open) { setPhase("pick"); setPct(0); } }, [open]);
  useEffect(() => {
    if (phase !== "working") return;
    setPct(0);
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); setPhase("ready"); return 100; } return p + 8; }), 90);
    return () => clearInterval(t);
  }, [phase]);
  const any = Object.values(sel).some(Boolean);
  return (
    <SyncSheet open={open} onClose={onClose} title="Export data" subtitle="GDPR-compliant · take your data anywhere" icon={Icons.Download}
      footer={phase === "pick"
        ? <><Button variant="ghost" onClick={onClose}>Cancel</Button><Button disabled={!any} icon={Icons.Download} onClick={() => setPhase("working")}>Prepare export</Button></>
        : phase === "ready"
        ? <><Button variant="ghost" icon={Icons.Mail} onClick={() => { window.__dpmToast?.("Export link emailed to ralph@gmail.com"); }}>Email me the link</Button><Button icon={Icons.Download} onClick={() => { window.__dpmToast?.("Download started"); onClose(); }}>Download .zip</Button></>
        : null}>
      {phase === "pick" && (
        <div className="space-y-2.5">
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))]">Choose what to include. Exports are generated on demand and never leave your control.</p>
          {EXPORT_ITEMS.map(it => (
            <button key={it.id} onClick={() => setSel(s => ({ ...s, [it.id]: !s[it.id] }))}
              className={cn("w-full flex items-center gap-3 p-3 rounded-[10px] border text-left transition-colors", sel[it.id] ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.05)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
              <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.5)] flex items-center justify-center flex-shrink-0"><it.icon size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium flex items-center gap-2">{it.label} <Badge variant="muted">{it.fmt}</Badge></div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{it.count}</div>
              </div>
              <span className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", sel[it.id] ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground)/0.4)]")}>
                {sel[it.id] && <Icons.Check size={11} stroke={3} className="text-white" />}
              </span>
            </button>
          ))}
        </div>
      )}
      {phase === "working" && (
        <div className="py-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary)/0.12)] flex items-center justify-center mb-4"><Icons.Download size={22} className="text-[hsl(var(--primary))]" /></div>
          <p className="font-medium text-[14px] mb-1">Preparing your export…</p>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mb-4">Gathering and packaging selected data</p>
          <div className="w-full max-w-[280px]"><ProgressBar value={pct} height="h-2" /></div>
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-2">{pct}%</div>
        </div>
      )}
      {phase === "ready" && (
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[hsl(142_70%_45%/0.14)] flex items-center justify-center mb-4"><Icons.Check size={22} stroke={2.5} className="text-[hsl(142_70%_55%)]" /></div>
          <p className="font-medium text-[15px] mb-1">Export ready</p>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mb-4 max-w-xs">dpm-export-2026-06-27.zip · 4.2 MB · link valid for 24h</p>
          <div className="w-full rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)] p-3 flex items-center gap-3 text-left">
            <Icons.Layers size={16} className="text-[hsl(var(--muted-foreground))]" />
            <div className="flex-1 text-[12px] font-mono text-[hsl(var(--muted-foreground))] truncate">dpm-export-2026-06-27.zip</div>
            <Badge variant="success" dot>Ready</Badge>
          </div>
        </div>
      )}
    </SyncSheet>
  );
}

/* ---------- import sheet ---------- */
const IMPORT_SOURCES = [
  { id: "ics", label: "ICS file", icon: Icons.Calendar, hint: ".ics calendar export" },
  { id: "csv", label: "CSV file", icon: Icons.ListChecks, hint: "Tasks or events" },
  { id: "todoist", label: "Todoist", icon: Icons.Todoist, hint: "Projects & tasks" },
  { id: "notion", label: "Notion", icon: Icons.Notion, hint: "Database export" },
  { id: "google", label: "Google Takeout", icon: Icons.Google, hint: "Calendar archive" },
];
function ImportSheet({ open, onClose }) {
  const [src, setSrc] = useState(null);
  const [phase, setPhase] = useState("source"); // source | map | done
  useEffect(() => { if (!open) { setSrc(null); setPhase("source"); } }, [open]);
  return (
    <SyncSheet open={open} onClose={onClose} title="Import data" subtitle="Bring events and tasks from anywhere" icon={Icons.Inbox}
      footer={phase === "map"
        ? <><Button variant="ghost" onClick={() => setPhase("source")}>Back</Button><Button icon={Icons.Download} onClick={() => setPhase("done")}>Import 248 items</Button></>
        : phase === "done"
        ? <Button onClick={onClose}>Done</Button>
        : <Button variant="ghost" onClick={onClose}>Cancel</Button>}>
      {phase === "source" && (
        <div className="space-y-2.5">
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))]">Pick a source. We map fields, preview the result and flag duplicates before anything is added.</p>
          <div className="grid grid-cols-2 gap-2.5">
            {IMPORT_SOURCES.map(s => (
              <button key={s.id} onClick={() => { setSrc(s); setPhase("map"); }}
                className="flex flex-col items-start gap-2 p-3 rounded-[10px] border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] hover:border-[hsl(var(--primary)/0.4)] text-left transition-colors">
                <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.5)] flex items-center justify-center"><s.icon size={16} /></div>
                <div>
                  <div className="text-[13px] font-medium">{s.label}</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))]">{s.hint}</div>
                </div>
              </button>
            ))}
            <label className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-[10px] border border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] cursor-pointer text-center">
              <Icons.Plus size={16} className="text-[hsl(var(--muted-foreground))]" />
              <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">Drop a file</span>
            </label>
          </div>
        </div>
      )}
      {phase === "map" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[hsl(var(--muted)/0.3)]">
            <src.icon size={18} />
            <div className="flex-1"><div className="text-[13px] font-medium">{src.label}</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">tasks-export.csv · 251 rows detected</div></div>
            <Badge variant="success" dot>Parsed</Badge>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-2">Column mapping</div>
            <div className="space-y-1.5">
              {[["Name", "Title"], ["Due", "Due date"], ["Priority", "Priority"], ["Labels", "Tags"], ["Project", "Calendar"]].map(([from, to]) => (
                <div key={from} className="flex items-center gap-2 text-[12.5px]">
                  <span className="flex-1 font-mono text-[hsl(var(--muted-foreground))] truncate">{from}</span>
                  <Icons.ArrowRight size={13} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                  <span className="flex-1 font-medium px-2 h-7 rounded-[6px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] inline-flex items-center">{to}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-[hsl(38_92%_55%/0.3)] bg-[hsl(38_92%_55%/0.05)] p-3 flex items-start gap-2">
            <Icons.AlertTriangle size={14} className="text-[hsl(38_92%_60%)] flex-shrink-0 mt-0.5" />
            <div className="text-[12px] text-[hsl(var(--muted-foreground))]"><span className="font-semibold text-[hsl(38_92%_65%)]">3 duplicates</span> and 0 format errors found. Duplicates will be skipped — <span className="text-[hsl(var(--foreground))]">248 of 251</span> items will import.</div>
          </div>
        </div>
      )}
      {phase === "done" && (
        <div className="py-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[hsl(142_70%_45%/0.14)] flex items-center justify-center mb-4"><Icons.Check size={22} stroke={2.5} className="text-[hsl(142_70%_55%)]" /></div>
          <p className="font-medium text-[15px] mb-1">Import complete</p>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] max-w-xs">248 items added · 3 duplicates skipped. They’re now in your Tasks and Calendar.</p>
        </div>
      )}
    </SyncSheet>
  );
}

/* ---------- the page ---------- */
function SyncCenterPage() {
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [manageFor, setManageFor] = useState(null);
  const [conflictsOpen, setConflictsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // honor deep-link intent from Settings ("open conflicts")
  useEffect(() => {
    if (window.__dpmSyncIntent === "conflicts") { setConflictsOpen(true); window.__dpmSyncIntent = null; }
  }, []);

  const mutate = (id, patch) => setProviders(ps => ps.map(p => p.id === id ? { ...p, ...patch } : p));

  const syncOne = (id) => {
    mutate(id, { state: "syncing", progress: 0 });
    let pct = 0;
    const t = setInterval(() => {
      pct += 12;
      if (pct >= 100) { clearInterval(t); mutate(id, { state: "connected", progress: 100, lastSync: "just now" }); window.__dpmToast?.("Sync complete"); }
      else mutate(id, { progress: pct });
    }, 120);
  };
  const syncAll = () => { providers.filter(p => p.state === "connected" || p.state === "paused").forEach(p => syncOne(p.id)); };

  const totalConflicts = providers.reduce((n, p) => n + (p.conflicts || 0), 0);
  const connectedCount = providers.filter(p => ["connected", "syncing", "paused"].includes(p.state)).length;
  const totalCals = providers.reduce((n, p) => n + (p.calEnabled || 0), 0);
  const needsAttention = providers.some(p => p.state === "token-expired") || totalConflicts > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Sync Center</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Connect your calendars, manage permissions, and keep everything in agreement.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] text-[12.5px] font-medium",
            needsAttention ? "bg-[hsl(38_92%_55%/0.12)] text-[hsl(38_92%_62%)]" : "bg-[hsl(142_70%_45%/0.12)] text-[hsl(142_70%_55%)]")}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: needsAttention ? "hsl(38 92% 58%)" : "hsl(142 70% 50%)" }} />
            {needsAttention ? "Needs attention" : "All healthy"}
          </span>
          <Button icon={Icons.Refresh} onClick={syncAll}>Sync all now</Button>
        </div>
      </div>

      {/* summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Connected accounts", value: connectedCount, sub: `${providers.length} available`, icon: Icons.Plug, tone: "263 70% 62%" },
          { label: "Calendars syncing", value: totalCals, sub: "across all accounts", icon: Icons.Layers, tone: "217 91% 60%" },
          { label: "Open conflicts", value: totalConflicts, sub: totalConflicts ? "needs your call" : "all resolved", icon: Icons.AlertTriangle, tone: totalConflicts ? "38 92% 55%" : "142 70% 45%", action: () => setConflictsOpen(true) },
        ].map((s, i) => (
          <button key={i} onClick={s.action} disabled={!s.action}
            className={cn("text-left rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-colors", s.action && "hover:border-[hsl(var(--primary)/0.4)] cursor-pointer")}>
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: `hsl(${s.tone} / 0.14)`, color: `hsl(${s.tone})` }}><s.icon size={16} /></span>
              {s.action && <Icons.ChevronRight size={15} className="text-[hsl(var(--muted-foreground))]" />}
            </div>
            <div className="text-[26px] font-bold tracking-tight mt-2.5">{s.value}</div>
            <div className="text-[12.5px] font-medium mt-0.5">{s.label}</div>
            <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{s.sub}</div>
          </button>
        ))}
      </div>

      {/* providers */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">Connected accounts</div>
        <div className="space-y-3">
          {providers.map(p => (
            <SyncProviderCard key={p.id} p={p} onSync={syncOne}
              onManage={() => setManageFor(p)} onConflicts={() => setConflictsOpen(true)} onMutate={mutate} />
          ))}
        </div>
      </div>

      {/* data portability */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">Data portability</div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setImportOpen(true)} className="text-left rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 hover:border-[hsl(var(--primary)/0.4)] transition-colors">
            <span className="w-9 h-9 rounded-[8px] bg-[hsl(217_91%_60%/0.12)] text-[hsl(217_91%_65%)] flex items-center justify-center"><Icons.Inbox size={17} /></span>
            <div className="text-[14px] font-semibold mt-2.5">Import</div>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">ICS, CSV, Todoist, Notion, Google — with mapping & duplicate detection.</div>
          </button>
          <button onClick={() => setExportOpen(true)} className="text-left rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 hover:border-[hsl(var(--primary)/0.4)] transition-colors">
            <span className="w-9 h-9 rounded-[8px] bg-[hsl(263_70%_62%/0.12)] text-[hsl(263_70%_72%)] flex items-center justify-center"><Icons.Download size={17} /></span>
            <div className="text-[14px] font-semibold mt-2.5">Export</div>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">JSON archive, ICS calendar, CSV tasks & habits. GDPR-ready, link or email.</div>
          </button>
        </div>
      </div>

      {/* sheets */}
      <ManageCalendarsSheet open={!!manageFor} onClose={() => setManageFor(null)} provider={manageFor} />
      <ConflictCenterSheet open={conflictsOpen} onClose={() => setConflictsOpen(false)} />
      <ImportSheet open={importOpen} onClose={() => setImportOpen(false)} />
      <ExportSheet open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}

Object.assign(window, { SyncCenterPage });
