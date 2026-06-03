/* global React, Icons, cn, Modal, ModalHeader, ModalBody, ModalFooter, Button,
          EventModal, TaskModal, useEvents, useState, useEffect */

/* ============================================================
   SLOT ACTIONS (P26) — depuis un créneau suggéré : Créer / Partager.

   • Créer  → ouvre le popover de création EXISTANT, pré-rempli depuis le
     créneau (date/heure/durée + priorité pour les tâches). Aucun nouveau
     composeur : EventModal pour event/focus/meeting, TaskModal pour task/habit.
   • Partager → ShareSlotModal : lien (ShareLink) + rappel des infos
     importantes + destinataires, avec aperçu de ce que voit le destinataire.

   Architecture pub/sub window.* — comme le reste de l'app :
     window.__dpmCreateFromSlot(slot, opts)   · opts = { type, prio, duration }
     window.__dpmShareSlot(slot, opts)
   Un seul hôte <SlotActionHost/> monté au niveau du shell rend les modals.
============================================================ */

const DUR_MIN = { "15min": 15, "30min": 30, "45min": 45, "1h": 60, "1h30": 90, "2h": 120, "3h": 180 };
const DUR_LBL = { "15min": "15 min", "30min": "30 min", "45min": "45 min", "1h": "1 h", "1h30": "1h30", "2h": "2 h", "3h": "3 h" };
const PRIO_MAP = {
  URGENT: { label: "Urgent",  color: "0 84% 60%" },
  HIGH:   { label: "Haute",   color: "25 90% 55%" },
  MEDIUM: { label: "Moyenne", color: "45 93% 50%" },
  LOW:    { label: "Basse",   color: "142 65% 45%" },
};
const SLOT_MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function slotAddMinutes(hhmm, mins) {
  const [h, m] = (hhmm || "09:00").split(":").map(Number);
  const t = h * 60 + m + mins;
  const H = Math.floor((t % 1440) / 60), M = t % 60;
  return String(H).padStart(2, "0") + ":" + String(M).padStart(2, "0");
}
function slotISODate(d) {
  const m = (d || "").match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})/);
  if (!m) return new Date().toISOString().slice(0, 10);
  const mm = String(SLOT_MONTHS[m[1]]).padStart(2, "0");
  const dd = String(parseInt(m[2], 10)).padStart(2, "0");
  return "2026-" + mm + "-" + dd;
}

if (typeof window !== "undefined") {
  Object.assign(window, { __dpmSlotEndTime: slotAddMinutes, __dpmSlotISODate: slotISODate, DUR_LBL, PRIO_MAP });
}

/* ============================================================
   SHARE SLOT MODAL — composeur + aperçu destinataire
============================================================ */
function ShareSlotModal({ open, slot, opts, onClose }) {
  const accent = "263 70% 60%";
  const dur = (opts && opts.duration) || "1h";
  const end = slot ? slotAddMinutes(slot.h, DUR_MIN[dur] || 60) : "";

  const [title, setTitle] = useState("");
  const [reminder, setReminder] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("Créneau proposé");
      setReminder("• Ce qu'il faut préparer\n• Ordre du jour\n• Lieu / lien visio");
      setRecipients([]);
      setDraft("");
      setActive(true);
      setCopied(false);
    }
  }, [open]);

  if (!open || !slot) return null;

  const addRecip = () => {
    const v = draft.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return;
    if (!recipients.includes(v)) setRecipients([...recipients, v]);
    setDraft("");
  };
  const copyLink = () => {
    try { navigator.clipboard && navigator.clipboard.writeText("https://dpm.cal/s/k9f2-tea-q2"); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Modal open={open} onClose={onClose} size="2xl">
      <ModalHeader title="Partager le créneau" onClose={onClose} />
      <ModalBody className="!px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-[hsl(var(--border))]">

          {/* COMPOSER */}
          <div className="px-5 pb-1 lg:pb-5">
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-3">Composer le partage</div>

            <label className="text-[11.5px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 block">Lien du créneau</label>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 min-w-0 h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center text-[12px] font-mono text-[hsl(var(--muted-foreground))] truncate">
                dpm.cal/s/<span className="text-[hsl(263_70%_80%)]">k9f2-tea-q2</span>
              </div>
              <button onClick={copyLink}
                className={cn("h-10 px-3.5 rounded-[8px] text-white text-[12.5px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors",
                  copied ? "bg-[hsl(142_70%_42%)]" : "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)]")}>
                {copied
                  ? <><Icons.Check size={13} stroke={3} /> Lien copié</>
                  : <><Icons.Copy size={13} /> Copier</>}
              </button>
            </div>

            <label className="text-[11.5px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 block">Titre / contexte</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13.5px] font-medium mb-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />

            <label className="text-[11.5px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 flex items-center gap-1.5">
              <Icons.AlertTriangle size={12} className="text-[hsl(38_92%_62%)]" /> Informations importantes (rappel)
            </label>
            <textarea value={reminder} onChange={(e) => setReminder(e.target.value)} rows={4}
              className="w-full px-3 py-2.5 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] leading-relaxed resize-none mb-1 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
            <p className="text-[10.5px] text-[hsl(var(--muted-foreground))] mb-4">Ce rappel accompagne le créneau dans la page du destinataire.</p>

            <label className="text-[11.5px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 block">Destinataires</label>
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {recipients.map((email, i) => (
                  <span key={email} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 h-7 rounded-full bg-[hsl(263_70%_60%/0.14)] text-[hsl(263_70%_82%)] text-[11.5px] font-medium">
                    {email}
                    <button onClick={() => setRecipients(recipients.filter((_, j) => j !== i))}
                      className="w-4 h-4 rounded-full hover:bg-[hsl(263_70%_60%/0.3)] flex items-center justify-center"><Icons.X size={9} stroke={3} /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} type="email" placeholder="email@exemple.com"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRecip(); } }}
                className="flex-1 h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <button onClick={addRecip} className="h-10 w-10 rounded-[8px] border border-[hsl(var(--input))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                <Icons.Plus size={15} />
              </button>
            </div>
          </div>

          {/* RECIPIENT PREVIEW */}
          <div className="px-5 pt-4 lg:pt-0 bg-[hsl(var(--muted)/0.18)]">
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-3 mt-1 flex items-center gap-2">
              <Icons.Eye size={13} /> Ce que voit le destinataire
            </div>
            <div className="rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
              <div className="h-[3px]" style={{ background: `hsl(${accent})` }} />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-[8px] gradient-violet flex items-center justify-center">
                    <Icons.Calendar size={13} className="text-white" />
                  </span>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))]"><strong className="text-[hsl(var(--foreground))]">Ralph Aubry</strong> te propose un créneau</div>
                </div>
                <h3 className="text-[17px] font-bold tracking-tight leading-tight">{title || "Créneau proposé"}</h3>

                <div className="mt-3 rounded-[12px] border p-3.5 flex items-center gap-3" style={{ borderColor: `hsl(${accent} / 0.35)`, background: `hsl(${accent} / 0.07)` }}>
                  <div className="w-11 h-11 rounded-[10px] flex flex-col items-center justify-center flex-shrink-0" style={{ background: `hsl(${accent} / 0.16)`, color: `hsl(${accent})` }}>
                    <span className="text-[8.5px] uppercase font-bold leading-none">{(slot.d || "").split(" ")[1] || "Mai"}</span>
                    <span className="text-[16px] font-bold leading-none mt-0.5">{((slot.d || "").match(/\d{1,2}/) || ["—"])[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">{slot.d}</div>
                    <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] font-mono">{slot.h} → {end} · {DUR_LBL[dur]}</div>
                  </div>
                  <span className={cn("px-1.5 py-0.5 rounded-full text-[9.5px] font-semibold",
                    slot.quality === "Optimal" ? "bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)]" : "bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)]")}>
                    {slot.quality === "Optimal" ? "Optimal" : "Bon"}
                  </span>
                </div>

                <div className="mt-3 rounded-[12px] border border-[hsl(38_92%_55%/0.35)] bg-[hsl(38_92%_40%/0.08)] p-3">
                  <div className="text-[10.5px] uppercase tracking-wide font-bold text-[hsl(38_92%_64%)] flex items-center gap-1.5 mb-1.5 whitespace-nowrap">
                    <Icons.AlertTriangle size={11} /> À retenir
                  </div>
                  <div className="text-[12px] leading-relaxed whitespace-pre-line">{reminder || "Aucune info importante ajoutée."}</div>
                </div>

                <button className="w-full h-10 rounded-[10px] bg-[hsl(var(--primary))] text-white text-[12.5px] font-semibold mt-3 hover:bg-[hsl(var(--primary)/0.9)] flex items-center justify-center gap-2">
                  <Icons.Calendar size={14} /> Ajouter à mon calendrier
                </button>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2.5 flex items-start gap-1.5 leading-snug">
                  <Icons.Lock size={11} className="mt-px flex-shrink-0" /> Ce lien ne montre que ce créneau. Le reste de l'agenda reste privé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <label className="flex items-center gap-2 text-[12px] cursor-pointer mr-auto">
          <Switch checked={active} onChange={setActive} />
          <span>Lien actif <span className="text-[hsl(var(--muted-foreground))]">· révocable</span></span>
        </label>
        <Button variant="outline" size="sm" onClick={onClose}>Fermer</Button>
        <Button size="sm" icon={Icons.Send} onClick={onClose}>Envoyer</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ============================================================
   HOST — listens to window openers, renders the right modal.
============================================================ */
function SlotActionHost() {
  const [evt, setEvt] = useState(null);     // { initial }
  const [task, setTask] = useState(null);   // { defaults }
  const [share, setShare] = useState(null); // { slot, opts }
  const [, eventOps] = useEvents();

  useEffect(() => {
    window.__dpmCreateFromSlot = (slot, opts) => {
      const o = opts || {};
      const dur = DUR_MIN[o.duration] || 60;
      const isTaskish = o.type === "task" || o.type === "habit";
      if (isTaskish) {
        setTask({ defaults: {
          title: "",
          priority: o.prio || "MEDIUM",
          planDate: slot.d,
          planTime: slot.h,
          duration: dur,
        } });
      } else {
        const date = slotISODate(slot.d);
        setEvt({ initial: {
          title: "",
          calendar: "Work",
          color: "263 70% 60%",
          date,
          start: slot.h,
          end: slotAddMinutes(slot.h, dur),
        } });
      }
    };
    window.__dpmShareSlot = (slot, opts) => setShare({ slot, opts: opts || {} });
    return () => { window.__dpmCreateFromSlot = undefined; window.__dpmShareSlot = undefined; };
  }, [eventOps]);

  return (
    <React.Fragment>
      <EventModal open={!!evt} initial={evt && evt.initial} onClose={() => setEvt(null)} onSave={(p) => eventOps.add(p)} />
      <TaskModal open={!!task} defaults={task && task.defaults} onClose={() => setTask(null)} />
      <ShareSlotModal open={!!share} slot={share && share.slot} opts={share && share.opts} onClose={() => setShare(null)} />
    </React.Fragment>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, { ShareSlotModal, SlotActionHost });
}
