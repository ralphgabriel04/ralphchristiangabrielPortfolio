/* global React, useState, useEffect, cn, Icons, Button */

/* ============================================================
   APP STATES — offline / reconnecting banner, error boundary, and a
   reusable StateView (loading / error / offline / empty). These give every
   future back-end touchpoint a credible front-end representation.

   Connection is driven by window.__dpmSetConn('online'|'reconnecting'|'offline')
   (wired to a Tweak). FRONT-END ONLY.
============================================================ */

function OfflineBanner() {
  const [conn, setConn] = useState("online");
  useEffect(() => {
    window.__dpmSetConn = (s) => { setConn(s); window.__dpmConn = s; };
    const h = (e) => setConn(e.detail);
    window.addEventListener("dpm-conn-change", h);
    return () => window.removeEventListener("dpm-conn-change", h);
  }, []);
  if (conn === "online") return null;
  const reconnecting = conn === "reconnecting";
  return (
    <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 h-8 text-[12px] font-medium anim-fade-in"
      style={{ background: reconnecting ? "hsl(38 92% 55% / 0.95)" : "hsl(0 84% 60% / 0.95)", color: "white" }}>
      {reconnecting
        ? <><span className="lp-spin inline-flex"><Icons.Refresh size={12} /></span> Reconnecting… changes will sync automatically</>
        : <><Icons.AlertTriangle size={12} /> You're offline — working from your last synced data</>}
    </div>
  );
}

/* Reusable state surface for any module. */
function StateView({ kind = "loading", title, subtitle, onRetry, rows = 3 }) {
  if (kind === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-[12px] border border-[hsl(var(--border))] p-4 flex gap-3.5">
            <div className="w-10 h-10 rounded-[9px] skeleton" />
            <div className="flex-1 space-y-2 py-1"><div className="h-3.5 w-1/3 skeleton rounded" /><div className="h-3 w-1/2 skeleton rounded" /></div>
          </div>
        ))}
      </div>
    );
  }
  const map = {
    error: { icon: Icons.AlertTriangle, t: title || "Something went wrong", s: subtitle || "We couldn't load this. Check your connection and try again.", tone: "0 84% 60%" },
    offline: { icon: Icons.Cloud, t: title || "You're offline", s: subtitle || "This will refresh automatically once you're back online.", tone: "38 92% 55%" },
    empty: { icon: Icons.Inbox, t: title || "Nothing here yet", s: subtitle || "When there's data, it'll show up here.", tone: "263 70% 62%" },
  };
  const m = map[kind] || map.empty;
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: `hsl(${m.tone} / 0.12)`, color: `hsl(${m.tone})` }}><m.icon size={22} /></div>
      <p className="font-medium text-[15px] mb-1">{m.t}</p>
      <p className="text-[13px] text-[hsl(var(--muted-foreground))] mb-5 max-w-xs">{m.s}</p>
      {onRetry && <Button icon={Icons.Refresh} onClick={onRetry}>Retry</Button>}
    </div>
  );
}

/* Visual error boundary — keeps a thrown screen from blanking the app. */
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch() {}
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6">
          <div className="w-14 h-14 rounded-full bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_70%)] flex items-center justify-center mb-4"><Icons.AlertTriangle size={26} /></div>
          <p className="font-semibold text-[16px] mb-1">This view hit a snag</p>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mb-5 max-w-sm">The rest of DPM is still running. Reload this view to try again — your data is safe.</p>
          <Button icon={Icons.Refresh} onClick={() => this.setState({ error: null })}>Reload view</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

Object.assign(window, { OfflineBanner, StateView, AppErrorBoundary });
