/* ============================================================
   Protection légère + crédit — portfolio UNIQUEMENT (inspiré 500px)
   • Aucune couche transparente au-dessus des photos.
   • Images HD conservées : on bloque seulement clic droit + drag.
   • Clic normal, lightbox et navigation restent intacts.
   ============================================================ */
(function () {
  function G() { return (window.KD && window.KD.ui && window.KD.ui.guard) || {}; }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var host = null, hideTimer = null;
  function ensureHost() {
    if (host && document.body.contains(host)) return host;
    host = document.createElement("div");
    host.className = "kd-credit-host";
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
    return host;
  }

  window.KDshowCredit = function (info) {
    info = info || {};
    var g = G();
    var h = ensureHost();
    clearTimeout(hideTimer);
    h.innerHTML =
      '<div class="kd-credit" role="status">' +
        '<button class="kd-credit-x" aria-label="Fermer" type="button">&times;</button>' +
        '<div class="kd-credit-top">' +
          '<span class="kd-credit-lock" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>' +
          '</span>' +
          '<span class="kd-credit-badge">' + esc(g.badge || "Image protégée") + '</span>' +
        '</div>' +
        '<dl class="kd-credit-meta">' +
          '<div><dt>' + esc(g.photographer || "Photographe") + '</dt><dd>' + esc(g.photographerName || "Kim Dubois") + '</dd></div>' +
          (info.title ? '<div><dt>' + esc(g.titleLabel || "Titre") + '</dt><dd>' + esc(info.title) + '</dd></div>' : '') +
          (info.cat ? '<div><dt>' + esc(g.catLabel || "Catégorie") + '</dt><dd>' + esc(info.cat) + '</dd></div>' : '') +
        '</dl>' +
        '<p class="kd-credit-msg">' + esc(g.msg || "") + '</p>' +
        '<p class="kd-credit-cr">' + esc(g.copyright || "") + '</p>' +
      '</div>';
    h.classList.add("show");
    var card = h.querySelector(".kd-credit");
    requestAnimationFrame(function () { if (card) card.classList.add("in"); });
    function close() {
      if (card) card.classList.remove("in");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { h.classList.remove("show"); h.innerHTML = ""; }, 300);
    }
    h.querySelector(".kd-credit-x").addEventListener("click", close);
    hideTimer = setTimeout(close, 5400);
  };
})();

/* <img> protégée : clic droit → crédit · drag bloqué · clic normal conservé. */
function GuardedImage({ item, className, style, onLoad, innerRef }) {
  var P = window.KD && window.KD.portfolio;
  var cat = item.cat ||
    (P && item.tags && item.tags.length ? P.filters[item.tags[0]] : "") || "";
  return (
    <img
      ref={innerRef}
      className={className}
      style={style}
      src={item.src}
      alt={item.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onLoad={onLoad}
      onContextMenu={(e) => { e.preventDefault(); window.KDshowCredit && window.KDshowCredit({ title: item.title, cat: cat }); }}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}

Object.assign(window, { GuardedImage });
