/* ============================================================
   CRCC · Explorateur d'anatomie interactif (race.html)
   Illustration du standard (image) + repères cliquables invisibles
   posés sur les numéros imprimés · liste synchronisée bidirectionnelle
   i18n live FR/EN · accessible (clavier, ARIA) · reduced-motion
   ============================================================ */
(function () {
  "use strict";

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

  /* Modèle de données — libellés + descriptions du standard CRCC, bilingues.
     n   : numéro imprimé sur l'illustration (l'ordre de la liste suit ces numéros).
     pin : centre du repère imprimé, en % de l'image (zone cliquable invisible). */
  var PARTS = [
    {
      id: "oreilles", n: 1, pin: { l: 11.6, t: 5.1 },
      fr: { l: "Oreilles", d: "« Grandes, alertes, larges à la base, placées haut sur la tête et presque parallèles l'une à l'autre. Pointes légèrement arrondies, mais pas pointues. »" },
      en: { l: "Ears", d: "“Large, alert, broad at the base, set high on the head and almost parallel to one another. Tips slightly rounded, not pointed.”" }
    },
    {
      id: "tete", n: 2, pin: { l: 33.4, t: 4.7 },
      fr: { l: "Tête", d: "« Crâne ovoïde à occiput saillant, un tiers plus longue que large. Front légèrement arrondi, nez romain à voûte haute. Patons, pommettes et pinch proéminents ; museau arrondi, menton fort ; morsure en ciseaux. »" },
      en: { l: "Head", d: "“Ovoid skull with a prominent occiput, one-third longer than wide. Slightly rounded forehead, Roman nose with a high arch. Whisker pads, cheekbones and pinch prominent and well defined; rounded muzzle, strong chin; jaws close in a scissor bite.”" }
    },
    {
      id: "yeux", n: 3, pin: { l: 22.7, t: 22.7 },
      fr: { l: "Yeux", d: "« De taille moyenne à grande, légèrement ovales, inclinés tout juste vers le haut, ouverts et alertes. Séparés d'environ la largeur d'un œil. Toutes les couleurs sont acceptées. »" },
      en: { l: "Eyes", d: "“Medium to large, slightly oval, tilted just upward, open and alert. Set about one eye's width apart. All colours are accepted.”" }
    },
    {
      id: "profil", n: 4, pin: { l: 4.6, t: 35.4 },
      fr: { l: "Profil", d: "« Double courbe convexe — du sommet du crâne jusqu'à l'arête du nez, puis jusqu'au bout du nez — qui crée le profil « romain ». Ligne plutôt droite du bout du nez jusqu'au menton profond et fort. »" },
      en: { l: "Profile", d: "“A double convex curve — from the top of the skull to the bridge of the nose, then on to the tip — creating the Roman profile. A fairly straight line runs from the nose tip to the deep, strong chin.”" }
    },
    {
      id: "cou", n: 5, pin: { l: 20.8, t: 45.0 },
      fr: { l: "Cou", d: "« Long, fin, musclé et élégant, le cou forme une arche caractéristique à la base du crâne. »" },
      en: { l: "Neck", d: "“Long, slender, muscular and elegant, the neck forms a characteristic arch at the base of the skull.”" }
    },
    {
      id: "allure", n: 6, pin: { l: 44.6, t: 40.1 },
      fr: { l: "Allure générale", d: "« Élégance faite de courbes et de lignes gracieuses ; type élancé et raffiné, unique. Se tient haut sur de longues pattes — ossature fine mais musculature dure, le rendant fort et athlétique. Petite à moyenne taille : femelles 2–3 kg, mâles 3–4 kg, jamais lourds ni trapus. »" },
      en: { l: "General type", d: "“Elegance made of curves and graceful lines; a slender, refined type that is unique and unmistakable. Stands tall on long legs — fine boning but hard, well-formed musculature, making it surprisingly strong and athletic. Small to medium size: females 2–3 kg (5–7 lb), males 3–4 kg (7–9 lb), never heavy or cobby.”" }
    },
    {
      id: "robe", n: 7, pin: { l: 51.6, t: 56.2 },
      fr: { l: "Robe", d: "« Sous-poil soyeux, dense, doux et bouclé, chaud au toucher, moulant le corps en vagues uniformes et étroitement tissées. Entièrement dépourvue de poils de garde ; ondulations marquées sur le dos, les épaules et les flancs. Toutes les couleurs et tous les patrons sont acceptés. »" },
      en: { l: "Coat", d: "“A silky, dense, soft and curly undercoat, warm to the touch, hugging the body in even, tightly woven waves. Entirely free of guard hairs; the waves are most marked on the back, shoulders and flanks. All colours and patterns are accepted.”" }
    },
    {
      id: "pattes", n: 8, pin: { l: 36.1, t: 73.7 },
      fr: { l: "Pattes & pieds", d: "« Très longues et minces, à l'ossature fine, terminées par de petits pieds ovales. L'effet général est celui d'un chat qui se tient haut, presque sur la pointe des pieds. »" },
      en: { l: "Legs & paws", d: "“Very long and slender, with fine boning, ending in small oval paws. The overall effect is a cat standing tall, almost on tiptoe.”" }
    },
    {
      id: "corps", n: 9, pin: { l: 80.5, t: 53.5 },
      fr: { l: "Corps", d: "« Allongé et souple, mince et musclé. Poitrine profonde mais pas ronde ; ligne du dos naturellement arquée. Le ventre rentré (tuck) forme une taille fine ; train arrière arrondi, cuisses fortes et bien musclées. »" },
      en: { l: "Body", d: "“Long and supple, slim and muscular. Chest deep but not round; topline naturally arched. The tucked-up belly (tuck) forms a fine waist; hindquarters rounded, thighs strong and well muscled.”" }
    },
    {
      id: "queue", n: 10, pin: { l: 92.3, t: 18.7 },
      fr: { l: "Queue", d: "« Très longue et mince, s'effilant légèrement vers l'extrémité ; aussi longue que le corps en proportion. Très flexible, couverte d'un poil fin et dense, de préférence en vagues. »" },
      en: { l: "Tail", d: "“Very long and slender, tapering slightly toward the tip; as long as the body in proportion. Very flexible, covered with fine, dense fur, preferably waved.”" }
    }
  ];

  var UI = {
    fr: { list: "Parties du standard de race",
      alt: "Illustration d'un Rex de Cornouailles, dix repères numérotés situant les parties du standard. Partie active : " },
    en: { list: "Breed standard parts",
      alt: "Illustration of a Cornish Rex with ten numbered markers locating the parts of the standard. Active part: " }
  };

  function lang(){ return (window.CRCC && window.CRCC.lang) || "fr"; }
  function partById(id){ for (var i=0;i<PARTS.length;i++) if (PARTS[i].id===id) return PARTS[i]; return PARTS[0]; }

  function init(){
    var root = document.getElementById("anat");
    if (!root) return;

    var pinsWrap = root.querySelector(".anat-pins");
    var list = root.querySelector(".anat-list");
    var live = root.querySelector(".anat-live");
    var elNum = root.querySelector(".anat-detail-num");
    var elLabel = root.querySelector(".anat-detail-label");
    var elDesc = root.querySelector(".anat-detail-desc");
    var illus = root.querySelector(".anat-illus");

    var active = "allure";

    /* ---- Build invisible hotspots (over printed numbers) + list items ---- */
    PARTS.forEach(function (p) {
      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "anat-pin";
      pin.dataset.z = p.id;
      pin.style.left = p.pin.l + "%";
      pin.style.top = p.pin.t + "%";
      pin.setAttribute("aria-pressed", "false");
      pin.addEventListener("click", function () { select(p.id); });
      pinsWrap.appendChild(pin);

      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "anat-item";
      b.dataset.z = p.id;
      b.setAttribute("aria-pressed", "false");
      b.innerHTML =
        '<span class="anat-item-num">' + p.n + '</span>' +
        '<span class="anat-item-label"></span>' +
        '<span class="anat-item-check" aria-hidden="true">' + CHECK + '</span>';
      b.addEventListener("click", function () { select(p.id); });
      // hover sync: list item ↔ its hotspot ring
      b.addEventListener("mouseenter", function () { syncHover(p.id, true); });
      b.addEventListener("mouseleave", function () { syncHover(p.id, false); });
      li.appendChild(b);
      list.appendChild(li);
    });

    var pinEls = Array.prototype.slice.call(pinsWrap.querySelectorAll(".anat-pin"));
    var itemEls = Array.prototype.slice.call(list.querySelectorAll(".anat-item"));

    function syncHover(id, on){
      var pin = pinsWrap.querySelector('.anat-pin[data-z="'+id+'"]');
      if (pin) pin.classList.toggle("hover", on);
    }

    /* ---- Roving arrow-key navigation within each control group ---- */
    function arrowNav(nodes){
      nodes.forEach(function (n, i) {
        n.addEventListener("keydown", function (e) {
          var j = -1;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % nodes.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + nodes.length) % nodes.length;
          else if (e.key === "Home") j = 0;
          else if (e.key === "End") j = nodes.length - 1;
          if (j >= 0) { e.preventDefault(); nodes[j].focus(); select(nodes[j].dataset.z); }
        });
      });
    }
    arrowNav(pinEls);
    arrowNav(itemEls);

    /* ---- Render current language into every text surface ---- */
    function render(){
      var L = lang();
      var p = partById(active);
      var t = p[L] || p.fr;

      elNum.textContent = p.n;
      elLabel.textContent = t.l;
      elDesc.textContent = t.d;

      itemEls.forEach(function (el) {
        var pp = partById(el.dataset.z), tt = pp[L] || pp.fr;
        el.querySelector(".anat-item-label").textContent = tt.l;
        el.setAttribute("aria-label", pp.n + ". " + tt.l);
      });
      pinEls.forEach(function (el) {
        var pp = partById(el.dataset.z), tt = pp[L] || pp.fr;
        var name = pp.n + ". " + tt.l;
        el.setAttribute("aria-label", name);
        el.setAttribute("title", name);
      });

      if (illus) illus.setAttribute("alt", UI[L].alt + t.l + ".");
      if (list) list.setAttribute("aria-label", UI[L].list);
      if (live) live.textContent = t.l;
    }

    /* ---- Selection — syncs hotspot, list, detail ---- */
    function select(id){
      active = id;
      pinEls.forEach(function (el) {
        var on = el.dataset.z === id;
        el.classList.toggle("is-on", on);
        el.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) el.setAttribute("aria-current", "true"); else el.removeAttribute("aria-current");
      });
      itemEls.forEach(function (el) {
        var on = el.dataset.z === id;
        el.classList.toggle("is-on", on);
        el.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) el.setAttribute("aria-current", "true"); else el.removeAttribute("aria-current");
      });
      render();
    }

    /* Live i18n — re-render active detail + all labels when language flips */
    if (window.CRCC && Array.isArray(window.CRCC.onLangChange)) {
      window.CRCC.onLangChange.push(render);
    }

    select("allure");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
