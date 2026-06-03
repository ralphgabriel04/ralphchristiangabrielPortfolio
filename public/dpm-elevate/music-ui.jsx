/* global React, useState, useEffect, useRef, Icons, Button, Card, Badge, Switch, Modal, ModalHeader, ModalBody, cn, useT,
          useMusic, MUSIC_SERVICES, MUSIC_SERVICE_LIST, MUSIC_PLAYLISTS, tracksFor, isFocusFriendly,
          ServiceDot, Cover, FocusBadge */
/* ============================================================
   MUSIC UI (P23) — connect flow, now-playing vignette, playlist
   library, focus-panel orchestrator and the Settings row.
   All copy goes through useT() so the feature is properly bilingual.
============================================================ */

/* Small colored service button used in the connect flow. */
function ServiceConnectButton({ svc, onConnect }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => onConnect(svc.id)}
      className="group w-full flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--accent)/0.3)] transition-all text-left min-h-[44px]"
    >
      <span className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${svc.hue} / 0.16)` }}>
        <Icons.Music size={16} style={{ color: `hsl(${svc.hue})` }} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold flex items-center gap-2">
          {svc.name}
          {svc.exploratory && (
            <span className="text-[9px] uppercase tracking-wide font-semibold text-[hsl(38_92%_70%)] bg-[hsl(38_92%_55%/0.14)] border border-[hsl(38_92%_55%/0.3)] px-1.5 py-0.5 rounded-full">
              {t("music.limitedApi")}
            </span>
          )}
        </div>
        <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
          {svc.exploratory ? t("music.svc.youtubeNote") : svc.focusScoring ? t("music.svc.spotifyNote") : t("music.svc.appleNote")}
        </div>
      </div>
      <span className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors flex-shrink-0">
        <Icons.Plug size={16} />
      </span>
    </button>
  );
}

/* NOT-CONNECTED state — invite to connect a service + scope transparency. */
function MusicConnectCard({ ops, compact = false }) {
  const t = useT();
  return (
    <div className={cn("anim-fade-in", compact && "text-[13px]")}>
      {!compact && (
        <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] leading-relaxed mb-3" style={{ textWrap: "pretty" }}>
          {t("music.connectIntro")}
        </p>
      )}
      <div className="space-y-2">
        {MUSIC_SERVICE_LIST.map(svc => <ServiceConnectButton key={svc.id} svc={svc} onConnect={ops.connect} />)}
      </div>
      <div className="mt-3 flex items-start gap-2 text-[11px] text-[hsl(var(--muted-foreground))] leading-snug">
        <Icons.Shield size={13} className="flex-shrink-0 mt-0.5 text-[hsl(142_60%_55%)]" />
        <span style={{ textWrap: "pretty" }}>{t("music.scopes")}</span>
      </div>
    </div>
  );
}

/* Volume control — slider + mute toggle. */
function VolumeControl({ value, onChange }) {
  const t = useT();
  const muted = value === 0;
  const prev = useRef(value || 65);
  const toggleMute = () => {
    if (muted) { onChange(prev.current || 65); }
    else { prev.current = value; onChange(0); }
  };
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMute}
        className="w-8 h-8 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
        aria-label={muted ? t("music.unmute") : t("music.mute")}
      >
        {muted ? <Icons.VolumeX size={15} /> : <Icons.Volume size={15} />}
      </button>
      <input
        type="range" min="0" max="100" value={value}
        onChange={e => onChange(+e.target.value)}
        aria-label={t("music.volume")}
        className="music-range flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, hsl(var(--primary)) ${value}%, hsl(var(--muted)) ${value}%)` }}
      />
    </div>
  );
}

/* Transport buttons (prev / play-pause / next). */
function Transport({ state, ops, caps, big = false }) {
  const t = useT();
  const disabled = !caps.canPlay;
  const btn = "rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button" onClick={ops.prev} disabled={disabled} aria-label={t("music.prev")}
        className={cn(btn, "w-9 h-9 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]")}>
        <Icons.SkipBack size={16} />
      </button>
      <button type="button" onClick={ops.toggle} disabled={disabled} aria-label={state.isPlaying ? t("common.pause") : t("music.play")}
        className={cn(btn, big ? "w-12 h-12" : "w-11 h-11", "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(263_70%_55%)] shadow-sm shadow-[hsl(var(--primary)/0.35)]")}>
        {state.isPlaying ? <Icons.Pause size={big ? 20 : 18} /> : <Icons.Play size={big ? 20 : 18} />}
      </button>
      <button type="button" onClick={ops.next} disabled={disabled} aria-label={t("music.next")}
        className={cn(btn, "w-9 h-9 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]")}>
        <Icons.SkipForward size={16} />
      </button>
    </div>
  );
}

/* NOW-PLAYING vignette. variant: "full" (Focus panel) | "bar" (mobile/compact). */
function NowPlaying({ state, ops, caps, onOpenLibrary, variant = "full" }) {
  const t = useT();
  const p = MUSIC_PLAYLISTS.find(x => x.id === state.playlistId) || MUSIC_PLAYLISTS[0];
  const track = tracksFor(p.id)[state.trackIdx] || tracksFor(p.id)[0];
  const degraded = !caps.canPlay;

  if (variant === "bar") {
    return (
      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <Cover p={p} size={36} radius={8} playing={state.isPlaying && !degraded} />
        <button onClick={onOpenLibrary} className="flex-1 min-w-0 text-left">
          <div className="text-[12px] font-semibold truncate">{degraded ? p.name : track}</div>
          <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] truncate flex items-center gap-1">
            <ServiceDot id={state.service} size={7} /> {p.name}
          </div>
        </button>
        {degraded
          ? <span className="text-[10px] text-[hsl(38_92%_70%)] font-medium flex-shrink-0">{t("music.openInApp")}</span>
          : <Transport state={state} ops={ops} caps={caps} />}
      </div>
    );
  }

  return (
    <div className="anim-fade-in">
      {/* Cover + meta */}
      <div className="flex items-center gap-3">
        <Cover p={p} size={56} radius={12} playing={state.isPlaying && !degraded} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold flex items-center gap-1.5">
            <ServiceDot id={state.service} size={7} /> {MUSIC_SERVICES[state.service]?.name}
          </div>
          <div className="text-[14px] font-bold tracking-tight truncate mt-0.5">{degraded ? p.name : track}</div>
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] truncate flex items-center gap-1.5">
            {p.name}
            {caps.canScore && isFocusFriendly(p) && <FocusBadge score={p.focusScore} compact />}
          </div>
        </div>
      </div>

      {degraded ? (
        /* Connected but playback unavailable (free account or no API). */
        <div className="mt-3 rounded-[10px] border border-[hsl(38_92%_55%/0.35)] bg-[hsl(38_92%_55%/0.08)] p-3">
          <div className="flex items-start gap-2">
            <Icons.AlertTriangle size={14} className="text-[hsl(38_92%_65%)] flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[hsl(38_92%_72%)]">
                {MUSIC_SERVICES[state.service]?.exploratory ? t("music.degraded.noApi") : t("music.degraded.freeTier")}
              </div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
                {MUSIC_SERVICES[state.service]?.exploratory ? t("music.degraded.noApiDesc") : t("music.degraded.freeTierDesc")}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2.5" icon={Icons.ArrowRight}>{t("music.openInApp")}</Button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${state.progress}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">
              <span>1:2{state.trackIdx}</span><span>3:4{state.trackIdx}</span>
            </div>
          </div>
          {/* Transport + volume on one compact row */}
          <div className="mt-2 flex items-center gap-3">
            <Transport state={state} ops={ops} caps={caps} />
            <div className="flex-1 min-w-0"><VolumeControl value={state.volume} onChange={ops.setVolume} /></div>
          </div>
        </>
      )}

      <button onClick={onOpenLibrary} className="mt-3 w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-[hsl(263_70%_80%)] hover:text-[hsl(263_70%_90%)] transition-colors py-1.5">
        <Icons.Music size={13} /> {t("music.changePlaylist")}
      </button>
    </div>
  );
}

/* Horizontal carousel of the user's playlists, focus-friendly first. */
function PlaylistCarousel({ state, ops, caps }) {
  const t = useT();
  const sorted = [...MUSIC_PLAYLISTS].sort((a, b) => b.focusScore - a.focusScore);
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-2 px-0.5">{t("music.yourPlaylists")}</div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 music-scroll">
        {sorted.map(p => {
          const active = state.playlistId === p.id;
          return (
            <button key={p.id} onClick={() => ops.selectPlaylist(p.id)}
              className={cn(
                "flex-shrink-0 w-[112px] text-left rounded-[10px] p-2 border transition-all",
                active ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.3)]"
              )}>
              <Cover p={p} size={96} radius={8} playing={active && state.isPlaying && caps.canPlay} />
              <div className="mt-1.5 text-[12px] font-semibold truncate">{p.name}</div>
              <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] flex items-center justify-between mt-0.5">
                <span>{p.count} {t("music.tracks")}</span>
              </div>
              {caps.canScore && isFocusFriendly(p) && <div className="mt-1"><FocusBadge score={p.focusScore} compact /></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Full library modal — grid of playlists + service management + scopes. */
function MusicLibraryModal({ open, onClose }) {
  const t = useT();
  const [state, ops, caps] = useMusic();
  const sorted = [...MUSIC_PLAYLISTS].sort((a, b) => b.focusScore - a.focusScore);
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title={t("music.library")} onClose={onClose} />
      <ModalBody className="space-y-5">
        {/* Connected service row */}
        {caps.connected && (
          <div className="flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <span className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${caps.svc.hue} / 0.16)` }}>
              <Icons.Music size={16} style={{ color: `hsl(${caps.svc.hue})` }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold flex items-center gap-2">
                {caps.svc.name}
                <Badge variant="success" dot>{t("music.connected")}</Badge>
              </div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {caps.canScore ? t("music.caps.scoring") : t("music.caps.noScoring")}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={ops.disconnect}>{t("music.disconnect")}</Button>
          </div>
        )}

        {/* Demo: account tier toggle (to preview the degraded playback state) */}
        {caps.connected && caps.svc.playable && (
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="text-[12px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
              <Icons.Settings size={12} /> {t("music.accountTier")}
            </div>
            <div className="flex items-center p-0.5 rounded-md bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
              {["premium", "free"].map(tier => (
                <button key={tier} onClick={() => ops.setTier(tier)}
                  className={cn("px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-colors",
                    state.tier === tier ? "bg-[hsl(var(--primary))] text-white" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
                  {t("music.tier." + tier)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Switch / connect service when not connected */}
        {!caps.connected && <MusicConnectCard ops={ops} />}

        {/* Playlist grid */}
        {caps.connected && (
          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-2.5 flex items-center justify-between">
              <span>{t("music.yourPlaylists")}</span>
              {caps.canScore && <span className="normal-case tracking-normal text-[10.5px] flex items-center gap-1 text-[hsl(142_70%_70%)]"><Icons.Sparkles size={11} /> {t("music.sortedByFocus")}</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sorted.map(p => {
                const active = state.playlistId === p.id;
                return (
                  <button key={p.id} onClick={() => { ops.selectPlaylist(p.id); onClose(); }}
                    className={cn("text-left rounded-[12px] p-2.5 border transition-all",
                      active ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.3)]")}>
                    <div className="relative w-full" style={{ aspectRatio: "1" }}>
                      <Cover p={p} fill radius={9} playing={active && state.isPlaying && caps.canPlay} />
                    </div>
                    <div className="mt-2 text-[13px] font-semibold truncate">{p.name}</div>
                    <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{p.count} {t("music.tracks")}</div>
                    {caps.canScore && isFocusFriendly(p) && <div className="mt-1.5"><FocusBadge score={p.focusScore} /></div>}
                  </button>
                );
              })}
            </div>
            {!caps.canScore && (
              <div className="mt-3 flex items-start gap-2 text-[11px] text-[hsl(var(--muted-foreground))] leading-snug">
                <Icons.AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-[hsl(38_92%_65%)]" />
                <span>{t("music.scoringUnavailable")}</span>
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

/* The Cover with size="100%" needs an explicit square; handle that variant. */

/* ============================================================
   FOCUS MUSIC PANEL — lives in the Focus session (right column).
   Decides which state to show and honors the "show vignette" toggle.
   `inSession` = a focus session is active/locked (used for copy only).
============================================================ */
function FocusMusicPanel() {
  const t = useT();
  const [state, ops, caps] = useMusic();
  const [libOpen, setLibOpen] = useState(false);

  // Master toggle OFF → vignette fully hidden, slim restore affordance only.
  if (caps.connected && !state.showVignette) {
    return (
      <Card padding="p-3" className="flex items-center gap-2.5">
        <Icons.Music size={15} className="text-[hsl(var(--muted-foreground))]" />
        <span className="text-[12px] text-[hsl(var(--muted-foreground))] flex-1">{t("music.vignetteHidden")}</span>
        <button onClick={() => ops.setShowVignette(true)} className="text-[11.5px] font-medium text-[hsl(263_70%_80%)] hover:text-[hsl(263_70%_90%)]">
          {t("music.show")}
        </button>
      </Card>
    );
  }

  const collapsed = state.collapsed;
  const p = MUSIC_PLAYLISTS.find(x => x.id === state.playlistId) || MUSIC_PLAYLISTS[0];
  const track = tracksFor(p.id)[state.trackIdx] || tracksFor(p.id)[0];

  /* ---- Collapsed: a single slim mini-bar (cover + meta + play/pause) ---- */
  if (collapsed) {
    return (
      <Card padding="p-2.5" className="flex items-center gap-2.5" data-tour="feat-focus-music">
        {caps.connected ? (
          <>
            <Cover p={p} size={38} radius={9} playing={state.isPlaying && caps.canPlay} />
            <button onClick={() => ops.toggleCollapsed()} className="flex-1 min-w-0 text-left group">
              <div className="text-[12.5px] font-semibold truncate group-hover:text-[hsl(var(--foreground))]">{caps.canPlay ? track : p.name}</div>
              <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] truncate flex items-center gap-1.5">
                <ServiceDot id={state.service} size={6} /> {caps.canPlay ? p.name : t("music.caps.limited")}
              </div>
            </button>
            {caps.canPlay ? (
              <button onClick={ops.toggle} aria-label={state.isPlaying ? t("common.pause") : t("music.play")}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[hsl(var(--primary))] text-white hover:bg-[hsl(263_70%_55%)] transition-colors flex-shrink-0">
                {state.isPlaying ? <Icons.Pause size={15} /> : <Icons.Play size={15} />}
              </button>
            ) : (
              <span className="text-[10px] text-[hsl(38_92%_70%)] font-medium flex-shrink-0">{t("music.openInApp")}</span>
            )}
            <button onClick={() => ops.toggleCollapsed()} aria-label={t("music.expand")} title={t("music.expand")}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors flex-shrink-0">
              <Icons.ChevronDown size={15} />
            </button>
          </>
        ) : (
          <>
            <span className="w-9 h-9 rounded-[9px] bg-[hsl(263_70%_60%/0.12)] flex items-center justify-center flex-shrink-0">
              <Icons.Headphones size={16} className="text-[hsl(263_70%_75%)]" />
            </span>
            <button onClick={() => ops.toggleCollapsed()} className="flex-1 min-w-0 text-left">
              <div className="text-[12.5px] font-semibold">{t("music.title")}</div>
              <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] truncate">{t("music.connectShort")}</div>
            </button>
            <button onClick={() => ops.toggleCollapsed()} aria-label={t("music.expand")}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors flex-shrink-0">
              <Icons.ChevronDown size={15} />
            </button>
          </>
        )}
      </Card>
    );
  }

  /* ---- Expanded: full player ---- */
  return (
    <Card padding="p-4" className="flex flex-col gap-3 anim-fade-in" data-tour="feat-focus-music">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold flex items-center gap-2">
          <Icons.Headphones size={15} className="text-[hsl(263_70%_75%)]" /> {t("music.title")}
        </h3>
        <button onClick={() => ops.toggleCollapsed()} title={t("music.collapse")} aria-label={t("music.collapse")}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
          <Icons.ChevronUp size={15} />
        </button>
      </div>

      {!caps.connected ? (
        <MusicConnectCard ops={ops} />
      ) : (
        <>
          <NowPlaying state={state} ops={ops} caps={caps} onOpenLibrary={() => setLibOpen(true)} />
          <PlaylistCarousel state={state} ops={ops} caps={caps} />
          {/* Session link options — independent of the timer */}
          <div className="pt-1 border-t border-[hsl(var(--border))] space-y-1">
            <label className="flex items-center justify-between gap-2 py-1 cursor-pointer">
              <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{t("music.startWithSession")}</span>
              <Switch checked={state.startWithSession} onChange={ops.setStartWithSession} />
            </label>
            <label className="flex items-center justify-between gap-2 py-1 cursor-pointer">
              <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{t("music.muteOnBreak")}</span>
              <Switch checked={state.muteOnBreak} onChange={ops.setMuteOnBreak} />
            </label>
          </div>
        </>
      )}
      <MusicLibraryModal open={libOpen} onClose={() => setLibOpen(false)} />
    </Card>
  );
}

/* ============================================================
   SETTINGS — music integration row (Settings › Integrations) + the
   "Afficher la vignette…" preference toggle.
============================================================ */
function MusicSettingsCard() {
  const t = useT();
  const [state, ops, caps] = useMusic();
  const [libOpen, setLibOpen] = useState(false);
  return (
    <Card data-tour="feat-settings-music">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{t("music.integrationTitle")}</h3>
        <Icons.Music size={15} className="text-[hsl(var(--muted-foreground))]" />
      </div>

      <div className="space-y-2">
        {MUSIC_SERVICE_LIST.map(svc => {
          const isConn = state.service === svc.id;
          return (
            <div key={svc.id} className="flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(var(--border))]">
              <span className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${svc.hue} / 0.16)` }}>
                <Icons.Music size={18} style={{ color: `hsl(${svc.hue})` }} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold flex items-center gap-2">
                  {svc.name}
                  {isConn && <Badge variant="success" dot>{t("music.connected")}</Badge>}
                  {svc.exploratory && <span className="text-[9px] uppercase tracking-wide font-semibold text-[hsl(38_92%_70%)] bg-[hsl(38_92%_55%/0.14)] border border-[hsl(38_92%_55%/0.3)] px-1.5 py-0.5 rounded-full">{t("music.limitedApi")}</span>}
                </div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">
                  {isConn
                    ? (caps.canPlay ? t("music.caps.full") : t("music.caps.limited"))
                    : (svc.exploratory ? t("music.svc.youtubeNote") : svc.focusScoring ? t("music.svc.spotifyNote") : t("music.svc.appleNote"))}
                </div>
              </div>
              {isConn
                ? <Button variant="outline" size="sm" onClick={ops.disconnect}>{t("music.disconnect")}</Button>
                : <Button size="sm" onClick={() => ops.connect(svc.id)}>{t("music.connect")}</Button>}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 text-[11px] text-[hsl(var(--muted-foreground))] leading-snug">
        <Icons.Shield size={13} className="flex-shrink-0 mt-0.5 text-[hsl(142_60%_55%)]" />
        <span style={{ textWrap: "pretty" }}>{t("music.scopes")}</span>
      </div>

      {/* Preferences */}
      <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] divide-y divide-[hsl(var(--border))]">
        <div className="flex items-center justify-between gap-3 pb-3">
          <div className="min-w-0">
            <div className="text-[13px] font-medium">{t("music.showVignette")}</div>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{t("music.showVignetteDesc")}</div>
          </div>
          <Switch checked={state.showVignette} onChange={ops.setShowVignette} />
        </div>
        <div className="flex items-center justify-between gap-3 pt-3">
          <div className="min-w-0">
            <div className="text-[13px] font-medium">{t("music.startWithSession")}</div>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{t("music.startWithSessionDesc")}</div>
          </div>
          <Switch checked={state.startWithSession} onChange={ops.setStartWithSession} />
        </div>
      </div>

      {caps.connected && (
        <Button variant="ghost" size="sm" className="mt-3 w-full" icon={Icons.Music} onClick={() => setLibOpen(true)}>
          {t("music.openLibrary")}
        </Button>
      )}
      <MusicLibraryModal open={libOpen} onClose={() => setLibOpen(false)} />
    </Card>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    MusicConnectCard, NowPlaying, PlaylistCarousel, MusicLibraryModal,
    VolumeControl, Transport, ServiceConnectButton,
    FocusMusicPanel, MusicSettingsCard,
  });
}
