/* global React, useState, useEffect, useRef, Icons, Button, Card, Badge, Switch, Modal, ModalHeader, ModalBody, cn, useT */
/* ============================================================
   MUSIC DURING FOCUS (P23)

   - Connect a music service (Spotify / Apple Music / YouTube Music) via OAuth.
   - Import the USER's own playlists (mocked) and play one during a focus session.
   - "Now playing" vignette with full transport controls — toggleable.
   - Focus-friendly badge: DPM highlights, AMONG THE USER'S playlists, the ones
     best suited to concentration. This is a CAPABILITY that degrades by service
     (Spotify exposes audio-features → real scoring; Apple is limited; YouTube
     Music has no playback API at all).

   Architecture mirrors the existing stores: a single window.__dpmMusic source of
   truth + a "dpm-music-change" CustomEvent, with preferences persisted to
   localStorage (dpm-music-*). useMusic() returns [state, ops].
============================================================ */

/* ---- Services (pastille + name, NO real logos) ----
   playable      : can DPM control playback for this service at all?
   focusScoring  : can DPM score playlists for focus-friendliness?
   exploratory   : flagged as limited / experimental integration. */
const MUSIC_SERVICES = {
  spotify: { id: "spotify", name: "Spotify",       hue: "141 70% 42%", playable: true,  focusScoring: true,  exploratory: false },
  apple:   { id: "apple",   name: "Apple Music",   hue: "0 79% 63%",   playable: true,  focusScoring: false, exploratory: false },
  youtube: { id: "youtube", name: "YouTube Music", hue: "0 100% 50%",  playable: false, focusScoring: false, exploratory: true  },
};
const MUSIC_SERVICE_LIST = [MUSIC_SERVICES.spotify, MUSIC_SERVICES.apple, MUSIC_SERVICES.youtube];

/* The user's OWN library (mocked). focusScore 0–100 drives the focus-friendly
   badge (≥70). Covers are abstract two-hue gradients — never real artwork. */
const MUSIC_PLAYLISTS = [
  { id: "deep",    name: "Deep Work",        count: 64,  ha: 217, hb: 190, focusScore: 92 },
  { id: "lofi",    name: "Lofi Chill",       count: 120, ha: 263, hb: 305, focusScore: 85 },
  { id: "classic", name: "Concentration classique", count: 88, ha: 200, hb: 158, focusScore: 88 },
  { id: "piano",   name: "Piano & pluie",    count: 72,  ha: 228, hb: 262, focusScore: 78 },
  { id: "liked",   name: "Mes titres likés", count: 248, ha: 330, hb: 280, focusScore: 44 },
  { id: "ete",     name: "Été 2025",         count: 53,  ha: 38,  hb: 12,  focusScore: 26 },
  { id: "workout", name: "Workout",          count: 41,  ha: 0,   hb: 26,  focusScore: 17 },
];
const FOCUS_THRESHOLD = 70;
const isFocusFriendly = (p) => p.focusScore >= FOCUS_THRESHOLD;

/* Abstract, non-copyrighted track descriptors (NOT real song titles). */
const MUSIC_TRACKS = {
  deep:    ["Nappe ambiante", "Boucle continue", "Drone profond", "Pulsation lente"],
  lofi:    ["Beat feutré", "Vinyle & pluie", "Nuit calme", "Café d'hiver"],
  classic: ["Adagio n°2", "Nocturne en sol", "Prélude doux", "Andante"],
  piano:   ["Pluie au clavier", "Touches lentes", "Brume", "Aube"],
  liked:   ["Sélection 1", "Sélection 2", "Sélection 3", "Sélection 4"],
  ete:     ["Vague tiède", "Terrasse", "Coucher doré", "Sable"],
  workout: ["Tempo haut", "Sprint", "Montée", "Cardio"],
};
const tracksFor = (id) => MUSIC_TRACKS[id] || ["Piste 1", "Piste 2", "Piste 3"];

/* ============================================================
   STORE — window.__dpmMusic + "dpm-music-change", localStorage-backed.
============================================================ */
const MUSIC_DEFAULT = {
  service: null,          // null | "spotify" | "apple" | "youtube"
  tier: "premium",        // "premium" | "free"  (free → playback unavailable)
  playlistId: null,
  trackIdx: 0,
  isPlaying: false,
  progress: 37,           // mock %
  volume: 65,
  showVignette: true,     // "Afficher la vignette dans la session de concentration"
  collapsed: true,        // compact (mini-bar) by default — expand for full player
  startWithSession: false,
  muteOnBreak: true,
};

const MUSIC_LS = "dpm-music-state";

function musicLoad() {
  if (typeof window === "undefined") return { ...MUSIC_DEFAULT };
  try {
    const raw = localStorage.getItem(MUSIC_LS);
    if (raw) return { ...MUSIC_DEFAULT, ...JSON.parse(raw), isPlaying: false };
  } catch {}
  return { ...MUSIC_DEFAULT };
}

if (typeof window !== "undefined" && !window.__dpmMusic) {
  window.__dpmMusic = musicLoad();
}

function musicPersist(s) {
  try {
    const { service, tier, playlistId, volume, showVignette, collapsed, startWithSession, muteOnBreak } = s;
    localStorage.setItem(MUSIC_LS, JSON.stringify({ service, tier, playlistId, volume, showVignette, collapsed, startWithSession, muteOnBreak }));
  } catch {}
}

function musicSet(next) {
  const cur = window.__dpmMusic;
  const v = typeof next === "function" ? next(cur) : { ...cur, ...next };
  window.__dpmMusic = v;
  musicPersist(v);
  window.dispatchEvent(new CustomEvent("dpm-music-change", { detail: v }));
}

/* Capability helpers (derive from service + tier). */
function musicCaps(state) {
  const svc = state.service ? MUSIC_SERVICES[state.service] : null;
  const connected = !!svc;
  const canPlay = !!(svc && svc.playable && state.tier === "premium");
  const canScore = !!(svc && svc.focusScoring);
  return { svc, connected, canPlay, canScore };
}

function useMusic() {
  const [state, setState] = useState(() => (typeof window !== "undefined" ? window.__dpmMusic : { ...MUSIC_DEFAULT }));
  useEffect(() => {
    const h = (e) => setState({ ...e.detail });
    window.addEventListener("dpm-music-change", h);
    return () => window.removeEventListener("dpm-music-change", h);
  }, []);

  const ops = {
    connect: (serviceId) => musicSet(s => ({
      ...s, service: serviceId,
      tier: "premium",
      // pick a sensible default playlist (first focus-friendly) on first connect
      playlistId: s.playlistId || (MUSIC_PLAYLISTS.find(isFocusFriendly)?.id ?? MUSIC_PLAYLISTS[0].id),
      isPlaying: false, trackIdx: 0,
    })),
    disconnect: () => musicSet(s => ({ ...s, service: null, isPlaying: false })),
    setTier: (tier) => musicSet({ tier, isPlaying: false }),
    selectPlaylist: (id) => musicSet(s => ({ ...s, playlistId: id, trackIdx: 0, progress: 0, isPlaying: musicCaps(s).canPlay ? true : s.isPlaying })),
    play: () => musicSet({ isPlaying: true }),
    pause: () => musicSet({ isPlaying: false }),
    toggle: () => musicSet(s => ({ ...s, isPlaying: !s.isPlaying })),
    next: () => musicSet(s => ({ ...s, trackIdx: (s.trackIdx + 1) % tracksFor(s.playlistId).length, progress: 0 })),
    prev: () => musicSet(s => ({ ...s, trackIdx: (s.trackIdx - 1 + tracksFor(s.playlistId).length) % tracksFor(s.playlistId).length, progress: 0 })),
    setVolume: (v) => musicSet({ volume: Math.max(0, Math.min(100, v)) }),
    setShowVignette: (b) => musicSet({ showVignette: b }),
    setCollapsed: (b) => musicSet({ collapsed: b }),
    toggleCollapsed: () => musicSet(s => ({ ...s, collapsed: !s.collapsed })),
    setStartWithSession: (b) => musicSet({ startWithSession: b }),
    setMuteOnBreak: (b) => musicSet({ muteOnBreak: b }),
    setProgress: (p) => musicSet({ progress: p }),
  };
  return [state, ops, musicCaps(state)];
}

/* ============================================================
   PRESENTATIONAL BITS
============================================================ */
function ServiceDot({ id, size = 10 }) {
  const svc = MUSIC_SERVICES[id];
  if (!svc) return null;
  return <span className="inline-block rounded-full flex-shrink-0" style={{ width: size, height: size, background: `hsl(${svc.hue})` }} />;
}

/* Abstract gradient cover for a playlist. `fill` makes it absolutely fill a
   positioned parent (used by the square grid tiles). */
function Cover({ p, size = 44, radius = 10, playing = false, fill = false }) {
  if (!p) return null;
  const box = fill
    ? { position: "absolute", inset: 0, borderRadius: radius }
    : { width: size, height: size, borderRadius: radius };
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        ...box,
        background: `linear-gradient(135deg, hsl(${p.ha} 65% 32%), hsl(${p.hb} 70% 22%))`,
      }}
    >
      <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 70% 25%, hsl(${p.ha} 80% 60% / 0.55), transparent 60%)` }} />
      {playing && (
        <span className="absolute bottom-1 right-1 flex items-end gap-[1.5px] h-3" aria-hidden="true">
          {[0,1,2].map(i => (
            <span key={i} className="w-[2px] bg-white/90 rounded-full music-eq-bar" style={{ animationDelay: `${i * 0.18}s`, height: "100%" }} />
          ))}
        </span>
      )}
    </div>
  );
}

function FocusBadge({ score, compact = false }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold text-[hsl(142_70%_75%)] bg-[hsl(142_70%_45%/0.15)] border border-[hsl(142_70%_45%/0.35)]",
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
      )}
      title={t("music.focusFriendly.tip")}
    >
      <Icons.Sparkles size={compact ? 9 : 10} /> {t("music.focusFriendly")}{!compact && score != null ? ` · ${score}` : ""}
    </span>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    useMusic, MUSIC_SERVICES, MUSIC_SERVICE_LIST, MUSIC_PLAYLISTS, MUSIC_TRACKS,
    tracksFor, isFocusFriendly, musicCaps,
    ServiceDot, Cover, FocusBadge,
  });
}
