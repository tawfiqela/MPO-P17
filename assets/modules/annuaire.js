/* =====================================================================
   Annuaire des enseignants et seniors : bouton dans la barre du haut,
   panneau sobre avec recherche. Les contacts se saisissent dans
   assets/config.js (liste « annuaire »).
   ===================================================================== */
(function () {
  const LIST = (P17.cfg.annuaire || []).slice().sort((a, b) => (a.nom || "").localeCompare(b.nom || "", "fr"));
  const esc = P17.esc;
  const telHref = t => "tel:" + String(t || "").replace(/[^\d+]/g, "");
  const ICO = {
    people: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c.5-3.4 2.9-5.5 6-5.5s5.500 2.100 6 5.500"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.200c2.600.2 4.400 1.900 5 4.800"/></svg>',
    tel: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.500 3.500h3l1.500 4-2 1.500a11 11 0 0 0 6 6l1.500-2 4 1.500v3a2 2 0 0 1-2.200 2A16 16 0 0 1 4.500 5.700a2 2 0 0 1 2-2.200Z"/></svg>',
    mail: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="m4 7 8 6 8-6"/></svg>'
  };
  const initials = c => ((c.prenom || "").charAt(0) + (c.nom || "").charAt(0)).toUpperCase();
  const row = c => `
    <li class="an-row" data-hay="${esc(P17.norm(`${c.nom || ""} ${c.prenom || ""} ${c.fonction || ""}`))}">
      <span class="an-av" aria-hidden="true">${esc(initials(c))}</span>
      <span class="an-id"><b>${esc(c.nom || "")} ${esc(c.prenom || "")}</b>${c.fonction ? `<em>${esc(c.fonction)}</em>` : ""}${c.exemple ? `<em class="an-ex">Exemple à remplacer</em>` : ""}
        <span class="an-links">
          ${c.tel ? (c.exemple ? `<span class="an-link">${ICO.tel}${esc(c.tel)}</span>` : `<a class="an-link" href="${telHref(c.tel)}">${ICO.tel}${esc(c.tel)}</a>`) : ""}
          ${c.mail ? (c.exemple ? `<span class="an-link">${ICO.mail}${esc(c.mail)}</span>` : `<a class="an-link" href="mailto:${esc(c.mail)}">${ICO.mail}${esc(c.mail)}</a>`) : ""}
        </span>
      </span>
    </li>`;

  function mount() {
    const back = document.getElementById("app-back");
    if (!back || document.getElementById("an-btn")) return;
    back.insertAdjacentHTML("afterend", `<button class="an-btn" id="an-btn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="an-panel" title="Annuaire">${ICO.people}<span>Annuaire</span></button>`);
    const wrap = document.createElement("div");
    wrap.className = "an";
    wrap.innerHTML = `
      <div class="an-scrim" hidden></div>
      <aside class="an-panel" id="an-panel" role="dialog" aria-modal="true" aria-label="Annuaire des enseignants et seniors" hidden>
        <header class="an-head"><span class="an-title">${ICO.people}Annuaire<small>Enseignants et seniors</small></span><button class="an-close" type="button" aria-label="Fermer">${P17.icon("close")}</button></header>
        ${LIST.length > 6 ? `<label class="an-search"><input type="search" placeholder="Rechercher un nom…" aria-label="Rechercher dans l'annuaire"></label>` : ""}
        ${LIST.length ? `<ul class="an-list">${LIST.map(row).join("")}</ul><p class="an-none" hidden>Aucun nom ne correspond.</p>`
          : `<p class="an-empty">L'annuaire est vide pour le moment. Les noms, numéros et adresses seront ajoutés dès que la liste sera fournie.</p>`}
      </aside>`;
    document.body.appendChild(wrap);
    const btn = document.getElementById("an-btn"), panel = wrap.querySelector(".an-panel"), scrim = wrap.querySelector(".an-scrim");
    const place = () => {
      const r = btn.getBoundingClientRect(), bar = document.getElementById("appbar").getBoundingClientRect();
      panel.style.top = Math.round(bar.bottom + 8) + "px";
      if (window.innerWidth > 640) panel.style.left = Math.round(Math.max(12, Math.min(r.left, window.innerWidth - 400 - 12))) + "px"; else panel.style.left = "";
    };
    const set = open => {
      if (open) place();
      panel.hidden = scrim.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      if (open) { const f = panel.querySelector("input, a, .an-close"); if (f) f.focus({ preventScroll: true }); }
    };
    btn.addEventListener("click", () => set(panel.hidden));
    scrim.addEventListener("click", () => set(false));
    wrap.querySelector(".an-close").addEventListener("click", () => { set(false); btn.focus(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { set(false); btn.focus(); } });
    window.addEventListener("resize", () => { if (!panel.hidden) place(); });
    window.addEventListener("hashchange", () => set(false));
    const input = panel.querySelector(".an-search input");
    if (input) input.addEventListener("input", () => {
      const q = P17.norm(input.value.trim()); let n = 0;
      panel.querySelectorAll(".an-row").forEach(li => { const on = !q || li.dataset.hay.includes(q); li.hidden = !on; if (on) n++; });
      panel.querySelector(".an-none").hidden = n > 0;
    });
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
