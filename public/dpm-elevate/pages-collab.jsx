/* global React, useState, cn, Icons, Button, Card, Badge, Switch, Avatar */

/* ============================================================
   COLLABORATION  (/collaboration)
   Sharing, roles, share links, meeting polls and an activity feed.
   FRONT-END ONLY — members, votes and links are mock state.
============================================================ */

const ROLES = [
  { id: "viewer", label: "Viewer", desc: "Can view", icon: Icons.Eye },
  { id: "commenter", label: "Commenter", desc: "Can comment", icon: Icons.Pen },
  { id: "editor", label: "Editor", desc: "Can edit", icon: Icons.Edit },
];

const INITIAL_MEMBERS = [
  { id: "m1", name: "Ralph Gabriel", email: "ralph@dpm.io", initials: "RG", role: "owner", you: true },
  { id: "m2", name: "Sarah Kim", email: "sarah@dpm.io", initials: "SK", role: "editor" },
  { id: "m3", name: "Marc Aubry", email: "marc@dpm.io", initials: "MA", role: "commenter" },
  { id: "m4", name: "Lea Tremblay", email: "lea@ext.com", initials: "LT", role: "viewer", expired: true },
  { id: "m5", name: "pending@team.com", email: "pending@team.com", initials: "?", role: "viewer", pending: true },
];

const POLL = {
  title: "Q2 planning sync",
  duration: "45 min",
  slots: [
    { id: "p1", label: "Tue 30 · 10:00", votes: ["SK", "MA"], you: true },
    { id: "p2", label: "Tue 30 · 14:00", votes: ["SK", "MA", "LT"], best: true, you: true },
    { id: "p3", label: "Wed 1 · 11:00", votes: ["MA"] },
    { id: "p4", label: "Thu 2 · 16:00", votes: [] },
  ],
  participants: 4, responded: 3,
};

const ACTIVITY = [
  { who: "Sarah Kim", what: "voted on", target: "Q2 planning sync", when: "12 min ago", icon: Icons.Check, tone: "142 70% 45%" },
  { who: "Marc Aubry", what: "commented on", target: "Architecture doc", when: "1h ago", icon: Icons.Pen, tone: "263 70% 62%" },
  { who: "You", what: "shared", target: "Work space", when: "3h ago", icon: Icons.Share, tone: "217 91% 60%" },
  { who: "Lea Tremblay", what: "access expired for", target: "Roadmap", when: "yesterday", icon: Icons.Clock, tone: "38 92% 55%" },
];

function RolePicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const cur = ROLES.find(r => r.id === value);
  if (value === "owner") return <span className="text-[12px] text-[hsl(var(--muted-foreground))] font-medium px-2">Owner</span>;
  return (
    <div className="relative">
      <button disabled={disabled} onClick={() => setOpen(o => !o)}
        className="h-8 px-2.5 rounded-[7px] border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] text-[12px] font-medium inline-flex items-center gap-1.5 disabled:opacity-50">
        {cur?.label || "Role"} <Icons.ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-[9px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl p-1 z-30 anim-fade-in">
          {ROLES.map(r => (
            <button key={r.id} onClick={() => { onChange(r.id); setOpen(false); }} className="w-full flex items-center gap-2.5 px-2.5 h-9 rounded-[7px] hover:bg-[hsl(var(--accent))] text-left">
              <r.icon size={14} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1"><div className="text-[12.5px] font-medium">{r.label}</div></div>
              {value === r.id && <Icons.Check size={13} className="text-[hsl(var(--primary))]" stroke={3} />}
            </button>
          ))}
          <div className="h-px bg-[hsl(var(--border))] my-1" />
          <button onClick={() => { onChange("remove"); setOpen(false); }} className="w-full flex items-center gap-2.5 px-2.5 h-9 rounded-[7px] hover:bg-[hsl(0_84%_60%/0.1)] text-left text-[hsl(0_84%_72%)]">
            <Icons.Trash size={13} /> <span className="text-[12.5px] font-medium">Remove access</span>
          </button>
        </div>
      )}
    </div>
  );
}

function CollaborationPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [invite, setInvite] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [linkOn, setLinkOn] = useState(true);
  const [publicLink, setPublicLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [poll, setPoll] = useState(POLL);

  const setRole = (id, role) => {
    if (role === "remove") { setMembers(m => m.filter(x => x.id !== id)); window.__dpmToast?.("Access removed"); return; }
    setMembers(m => m.map(x => x.id === id ? { ...x, role } : x));
  };
  const sendInvite = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(invite.trim())) return;
    setMembers(m => [...m, { id: "m" + Date.now(), name: invite.trim(), email: invite.trim(), initials: "?", role: inviteRole, pending: true }]);
    window.__dpmToast?.(`Invite sent to ${invite.trim()}`); setInvite("");
  };
  const copyLink = () => { try { navigator.clipboard?.writeText("https://dpm.cal/s/work-q2x9"); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1600); };
  const vote = (slotId) => setPoll(p => ({ ...p, slots: p.slots.map(s => s.id === slotId ? { ...s, you: !s.you, votes: s.you ? s.votes.filter(v => v !== "RG") : [...s.votes, "RG"] } : s) }));

  const best = poll.slots.reduce((a, b) => (b.votes.length > a.votes.length ? b : a), poll.slots[0]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight">Collaboration</h1>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Share spaces, set roles, collect availability — without exposing your whole calendar.</p>
      </div>

      {/* members */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] flex items-center justify-center"><Icons.Users size={16} /></div>
            <div><div className="text-[14px] font-semibold">Work space</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{members.length} people</div></div>
          </div>
          <Badge variant="primary"><Icons.Layers size={10} /> Shared</Badge>
        </div>

        {/* invite */}
        <div className="p-4 flex items-center gap-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.15)]">
          <input value={invite} onChange={e => setInvite(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendInvite(); }} type="email" placeholder="Invite by email…"
            className="flex-1 h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          <RolePicker value={inviteRole} onChange={setInviteRole} />
          <Button size="sm" icon={Icons.Send} onClick={sendInvite}>Invite</Button>
        </div>

        <div className="divide-y divide-[hsl(var(--border))]">
          {members.map(m => (
            <div key={m.id} className="p-3.5 flex items-center gap-3">
              <Avatar name={m.initials} size={34} />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium flex items-center gap-2">{m.name}{m.you && <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-normal">(you)</span>}
                  {m.pending && <Badge variant="warning" dot>Pending</Badge>}
                  {m.expired && <Badge variant="danger" dot>Access expired</Badge>}
                </div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] truncate">{m.email}</div>
              </div>
              {m.expired
                ? <Button size="sm" variant="outline" onClick={() => setMembers(ms => ms.map(x => x.id === m.id ? { ...x, expired: false } : x))}>Renew</Button>
                : <RolePicker value={m.role} onChange={(r) => setRole(m.id, r)} />}
            </div>
          ))}
        </div>

        {/* share link */}
        <div className="p-4 border-t border-[hsl(var(--border))] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Icons.Globe size={15} className="text-[hsl(var(--muted-foreground))]" /><span className="text-[13px] font-medium">Share link</span></div>
            <Switch checked={linkOn} onChange={setLinkOn} />
          </div>
          {linkOn && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center text-[12px] font-mono text-[hsl(var(--muted-foreground))] truncate">dpm.cal/s/work-q2x9</div>
                <Button size="sm" variant={copied ? "secondary" : "outline"} icon={copied ? Icons.Check : Icons.Copy} onClick={copyLink}>{copied ? "Copied" : "Copy"}</Button>
              </div>
              <label className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))] cursor-pointer">
                <Switch checked={publicLink} onChange={setPublicLink} size="sm" />
                Anyone with the link can view {publicLink ? "· public" : "· sign-in required"}
              </label>
            </>
          )}
        </div>
      </Card>

      {/* meeting poll */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[hsl(217_91%_60%/0.12)] text-[hsl(217_91%_65%)] flex items-center justify-center"><Icons.Calendar size={16} /></div>
            <div><div className="text-[14px] font-semibold">{poll.title}</div><div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{poll.duration} · {poll.responded}/{poll.participants} responded</div></div>
          </div>
          <Badge variant="info" dot>Meeting poll</Badge>
        </div>
        <div className="p-4 space-y-2">
          {poll.slots.map(s => {
            const pct = (s.votes.length / poll.participants) * 100;
            const isBest = s.id === best.id && best.votes.length > 0;
            return (
              <button key={s.id} onClick={() => vote(s.id)}
                className={cn("w-full flex items-center gap-3 p-2.5 rounded-[10px] border text-left transition-colors relative overflow-hidden",
                  s.you ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.05)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
                <span className="absolute left-0 top-0 bottom-0 bg-[hsl(217_91%_60%/0.08)]" style={{ width: `${pct}%` }} />
                <span className={cn("relative w-5 h-5 rounded-[6px] border-2 flex items-center justify-center flex-shrink-0", s.you ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground)/0.4)]")}>
                  {s.you && <Icons.Check size={11} stroke={3} className="text-white" />}
                </span>
                <span className="relative flex-1 text-[13px] font-medium font-mono">{s.label}</span>
                {isBest && <Badge variant="success" className="relative">Best</Badge>}
                <div className="relative flex items-center -space-x-1.5">
                  {s.votes.map((v, i) => <span key={i} className="w-6 h-6 rounded-full bg-[hsl(263_70%_60%)] border-2 border-[hsl(var(--card))] flex items-center justify-center text-[9px] font-bold text-white">{v}</span>)}
                  {s.votes.length === 0 && <span className="text-[11px] text-[hsl(var(--muted-foreground))]">No votes</span>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.18)] flex items-center gap-2">
          <span className="text-[12px] text-[hsl(var(--muted-foreground))]">Best slot: <span className="font-semibold text-[hsl(var(--foreground))] font-mono">{best.label}</span></span>
          <Button size="sm" className="ml-auto" icon={Icons.Calendar} onClick={() => window.__dpmToast?.(`Event created · ${best.label}`)}>Create event</Button>
        </div>
      </Card>

      {/* activity */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2.5">Recent activity</div>
        <Card padding="p-0" className="overflow-hidden divide-y divide-[hsl(var(--border))]">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="p-3.5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${a.tone} / 0.12)`, color: `hsl(${a.tone})` }}><a.icon size={14} /></span>
              <div className="flex-1 text-[13px]"><span className="font-medium">{a.who}</span> <span className="text-[hsl(var(--muted-foreground))]">{a.what}</span> <span className="font-medium">{a.target}</span></div>
              <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{a.when}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { CollaborationPage });
