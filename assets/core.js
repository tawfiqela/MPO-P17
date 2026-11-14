/* =====================================================================
   Réa Chir P17 — noyau de l'application
   Routeur, composants d'affichage, recherche, thème, visionneuse, PWA
   ===================================================================== */
(function () {
  "use strict";

  const CFG = window.P17_CONFIG || {};
  const $app = () => document.getElementById("app");

  const P17 = {
    cfg: CFG,
    routes: {},
    sections: [],
    searchIndex: [],
    _after: []
  };

  /* ---------------- Utilitaires ---------------- */
  P17.esc = function (s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  P17.norm = function (s) {
    return String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  };
  /* Chemin d'image : version intégrée (fichier unique) si disponible */
  P17.src = function (p) { return (window.P17_IMG && window.P17_IMG[p]) || p; };
  P17.num = function (v) {
    if (v === null || v === undefined) return null;
    const n = parseFloat(String(v).replace(",", ".").trim());
    return Number.isFinite(n) ? n : null;
  };
  P17.fmt = function (n, d = 1) {
    if (n === null || n === undefined || !Number.isFinite(n)) return "—";
    return n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  P17.storage = {
    get(k, def) { try { const v = localStorage.getItem(k); return v === null ? def : v; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- Icônes ---------------- */
  const ICONS = {
    anesthesie: '<path d="M9 3h6M12 3v4"/><rect x="7" y="7" width="10" height="14" rx="2"/><path d="M10 12h4M12 10v4"/>',
    reanimation: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    echographie: '<path d="M4 20a8 8 0 0 1 16 0"/><path d="M8 20a4 4 0 0 1 8 0"/><path d="M12 4v6"/><circle cx="12" cy="4" r="1.5"/>',
    calculateurs: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h2M16 15v3"/>',
    eer: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z"/><path d="M9 14h6"/>',
    antibiotherapie: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M9.5 8.5l5 7"/>',
    bibliographie: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
    enseignement: '<path d="M2 9l10-5 10 5-10 5Z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    fiche: '<path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    analgesie: '<path d="M4 20 15 9"/><path d="m13 7 4 4"/><path d="m15 5 4 4"/><path d="M17 3l4 4"/><path d="M6 14l4 4"/>',
    sspi: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M6 11h3l1.5-3 2 6 1.5-3H18"/><path d="M9 20h6M12 16v4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>',
    tool: '<path d="M14 6a4 4 0 0 1-5 5L4 16l4 4 5-5a4 4 0 0 1 5-5l-3-3Z"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    urgence: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12Z"/>',
    perop: '<path d="M4 20 14.5 9.5"/><path d="m13 8 3 3"/><path d="M15.5 6.5 19 3l2 2-3.5 3.5"/><path d="M6 15l3 3"/>',
    terrain: '<circle cx="12" cy="7" r="3.2"/><path d="M5.5 20c.6-3.8 3.2-6 6.5-6s5.900 2.200 6.500 6"/><path d="M12 14v3M10.500 15.500h3"/>',
    thrombo: '<path d="M12 3c3 4 5.500 6.800 5.500 10a5.500 5.500 0 0 1-11 0C6.500 9.800 9 7 12 3Z"/><path d="M9.500 13.500a2.500 2.500 0 0 0 2.500 2.500"/>',
    home: '<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/>',
    left: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    warn: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'
  };
  P17.icon = function (name, cls = "ico") {
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.fiche}</svg>`;
  };

  /* Drapeau marocain stylisé (fond rouge, étoile verte à cinq branches) */
  P17.flag = function (cls = "flag") {
    return `<svg class="${cls}" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" rx="3"/><path d="M15 4.2 18.41 14.69 9.48 8.21h11.04L11.59 14.69Z"/></svg>`;
  };
  P17.star = function (cls = "star") {
    return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 75.86 87.6 8.15 38.4h83.7L24.14 87.6Z"/></svg>`;
  };

  /* ---------------- Enregistrement ---------------- */
  P17.route = function (path, def) { P17.routes[path] = def; };
  /* Ancienne adresse renvoyée vers une page existante (évite les pages en double) */
  P17.redirect = function (from, to) { P17.routes[from] = { redirect: to }; };
  P17.section = function (def) { P17.sections.push(def); };
  P17.index = function (path, title, keywords = "", section = "") {
    const known = P17.searchIndex.find(i => i.path === path);
    if (known) { known.hay += " " + P17.norm(title + " " + keywords); return; }   // une page = un seul résultat
    P17.searchIndex.push({ path, title, section, hay: P17.norm(title + " " + keywords + " " + section) });
  };
  P17.after = function (fn) { P17._after.push(fn); };

  /* ---------------- Composants ---------------- */
  P17.crumbs = function (items) {
    if (!items || !items.length) return "";
    return `<nav class="crumbs" aria-label="Fil d'Ariane">
      <a href="#/" class="crumb-home" aria-label="Accueil">${P17.icon("home")}</a>
      ${items.map((c, i) => i === items.length - 1
        ? `<span class="crumb-cur" aria-current="page">${P17.esc(c[0])}</span>`
        : `<a href="${c[1]}">${P17.esc(c[0])}</a>`).join("")}
    </nav>`;
  };

  /* Lien « Retour » de la page : repris dans la barre du haut (toujours visible) */
  P17.backLink = function (href, label = "") {
    return `<a class="back-link" href="${href}" ${label ? `data-label="${P17.esc(label)}"` : ""}>${P17.icon("left")}<span>Retour</span></a>`;
  };

  P17.page = function ({ crumbs = [], title, subtitle = "", accent = "", icon = "", body = "", back }) {
    const backHref = back || (crumbs.length > 1 ? crumbs[crumbs.length - 2][1] : "#/");
    return `
      <section class="page ${accent ? "accent-" + accent : ""}">
        <div class="page-head">
          ${P17.backLink(backHref)}
          ${P17.crumbs(crumbs)}
          <div class="page-title-row">
            ${icon ? `<span class="page-ico">${P17.icon(icon)}</span>` : ""}
            <div>
              <h1 class="page-title">${title}</h1>
              ${subtitle ? `<p class="page-sub">${subtitle}</p>` : ""}
            </div>
          </div>
        </div>
        ${body}
      </section>`;
  };

  P17.tiles = function (items, opts = {}) {
    return `<div class="tiles ${opts.compact ? "tiles--compact" : ""}">
      ${items.map(t => `
        <a class="tile ${t.accent ? "accent-" + t.accent : ""}" href="${t.href}">
          ${t.img ? `<span class="tile-img"><img src="${P17.src(t.img)}" alt="" loading="lazy"></span>` : `<span class="tile-ico">${P17.icon(t.icon || "fiche")}</span>`}
          <span class="tile-body">
            <span class="tile-title">${t.title}</span>
            ${t.desc ? `<span class="tile-desc">${t.desc}</span>` : ""}
          </span>
          ${t.badge ? `<span class="tile-badge">${t.badge}</span>` : ""}
          <span class="tile-go">${P17.icon("arrow")}</span>
        </a>`).join("")}
    </div>`;
  };

  P17.group = function (title, html, note = "") {
    return `<section class="group">
      <h2 class="group-title">${title}</h2>
      ${note ? `<p class="group-note">${note}</p>` : ""}
      ${html}
    </section>`;
  };

  /* Galerie d'images-mémos (échographie, classifications) */
  P17.gallery = function (items) {
    return `<div class="gallery">
      ${items.map(it => `
        <button class="gal-item" type="button" data-view="${it.src}" data-title="${P17.esc(it.title)}">
          <span class="gal-thumb"><img src="${P17.src(it.src)}" alt="" loading="lazy"></span>
          <span class="gal-title">${it.title}</span>
        </button>`).join("")}
    </div>`;
  };

  /* Blocs de contenu */
  P17.blocks = function (blocks) {
    if (!blocks) return "";
    if (!Array.isArray(blocks)) blocks = [blocks];
    return blocks.map(b => {
      if (b === null || b === undefined || b === "") return "";
      if (typeof b === "string") return b.trim().startsWith("<") ? b : `<p>${b}</p>`;
      if (b.ul) return `${b.title ? `<h4 class="blk-title">${b.title}</h4>` : ""}<ul class="list">${b.ul.map(li => `<li>${li}</li>`).join("")}</ul>`;
      if (b.ol) return `${b.title ? `<h4 class="blk-title">${b.title}</h4>` : ""}<ol class="list list--num">${b.ol.map(li => `<li>${li}</li>`).join("")}</ol>`;
      if (b.kv) return `<dl class="kv">${b.kv.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
      if (b.table) {
        const t = b.table;
        // Sur mobile, les tableaux de texte (≥ 3 colonnes) s'empilent en cartes ; les grilles courtes défilent
        const txt = c => String(c ?? "").replace(/<[^>]+>/g, "");
        const stack = t.head && t.head.length >= 3 && t.rows.some(r => r.slice(1).some(c => txt(c).length > 28));
        const lab = i => t.head && t.head[i] ? ` data-label="${P17.esc(txt(t.head[i]))}"` : "";
        return `${b.title ? `<h4 class="blk-title">${b.title}</h4>` : ""}<div class="table-wrap${stack ? " table-wrap--stack" : ""}"><table class="tbl ${t.cls || ""}">
          ${t.head ? `<thead><tr>${t.head.map(c => `<th>${c}</th>`).join("")}</tr></thead>` : ""}
          <tbody>${t.rows.map(r => `<tr>${r.map((c, i) => i === 0 && t.rowHead !== false ? `<th scope="row">${c}</th>` : `<td${lab(i)}>${c}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>${t.note ? `<p class="tbl-note">${t.note}</p>` : ""}`;
      }
      if (b.callout !== undefined) {
        const tone = b.tone || "info";
        const ico = tone === "warn" || tone === "danger" ? "warn" : tone === "ok" ? "ok" : "info";
        return `<div class="callout callout--${tone}">${P17.icon(ico)}<div>${b.title ? `<strong>${b.title}</strong> ` : ""}${b.callout}</div></div>`;
      }
      if (b.figs) return `<div class="figs ${b.cols ? "figs--" + b.cols : ""}">${b.figs.map(f => `
        <button class="fig" type="button" data-view="${f.img}" data-title="${P17.esc(f.caption || "")}">
          <img src="${P17.src(f.img)}" alt="${P17.esc(f.caption || "")}" loading="lazy" ${f.w ? `width="${f.w}" height="${f.h}"` : ""}><span class="fig-cap">${f.caption || ""}</span>
        </button>`).join("")}</div>`;
      if (b.img) return `<button class="inline-img" type="button" data-view="${b.img}" data-title="${P17.esc(b.caption || "")}"><img src="${P17.src(b.img)}" alt="" loading="lazy"><span>${b.caption || "Agrandir"}</span></button>`;
      if (b.html) return b.html;
      return "";
    }).join("");
  };

  /* Fiche type « atlas » avec en-tête du service.
     Grand écran : sommaire collant à gauche, sections en une colonne de lecture.
     Téléphone : sommaire repliable au-dessus des sections. */
  P17.fiche = function ({ kicker = "", title, subtitle = "", tags = [], sections = [], refs = [], accent = "", serviceHeader = true, intro = "", tool = "", meta = "", toolLabel = "Outil interactif" }) {
    const toc = [];
    if (tool) toc.push(["f-tool", toolLabel]);
    if (intro) toc.push(["f-intro", "Introduction"]);
    sections.forEach((s, i) => toc.push([`f-${i + 1}`, String(s.title).replace(/<[^>]+>/g, "")]));
    if (refs.length) toc.push(["f-refs", "Références"]);
    const hasToc = toc.length >= 2;
    return `
      <article class="fiche ${accent ? "accent-" + accent : ""}">
        <header class="fiche-head">
          ${serviceHeader ? `
          <div class="fiche-service">
            <span class="fiche-mark" aria-hidden="true">CHU</span>
            <span class="fiche-service-name">${P17.esc(CFG.serviceLong || "Service")}</span>
            <span class="fiche-chu">${P17.flag()}${P17.esc(CFG.etablissement || "")}, ${P17.esc(CFG.ville || "")}</span>
          </div>` : ""}
          ${kicker ? `<div class="fiche-kicker">${kicker}</div>` : ""}
          <h1 class="fiche-title">${title}</h1>
          ${subtitle ? `<p class="fiche-sub">${subtitle}</p>` : ""}
          ${tags.length ? `<div class="chips">${tags.map(t => `<span class="chip">${t}</span>`).join("")}</div>` : ""}
        </header>
        <div class="fiche-layout ${hasToc ? "has-toc" : ""}">
          ${hasToc ? `
          <details class="fiche-toc" data-toc>
            <summary>${P17.icon("list")}<span>Sommaire</span></summary>
            <ol>${toc.map(([id, t]) => `<li><button type="button" data-scroll="${id}">${P17.esc(t)}</button></li>`).join("")}</ol>
          </details>` : ""}
          <div class="fiche-main">
            ${tool ? `<div class="fiche-tool calc-grid" id="f-tool">${tool}</div>` : ""}
            ${intro ? `<div class="fiche-intro" id="f-intro">${P17.blocks(intro)}</div>` : ""}
            ${sections.map((s, i) => `
              <section class="fcard ${s.wide ? "fcard--wide" : ""} ${s.tone ? "fcard--" + s.tone : ""}" id="f-${i + 1}">
                <h2 class="fcard-title">${s.title}</h2>
                <div class="fcard-body">${P17.blocks(s.blocks)}</div>
              </section>
              ${s.tool ? `<div class="calc-grid fiche-tool">${s.tool}</div>` : ""}`).join("")}
            <footer class="fiche-foot">
              ${refs.length ? `<div class="refs" id="f-refs"><h2 class="refs-label">Références</h2><ol>${refs.map(r => `<li>${r}</li>`).join("")}</ol></div>` : ""}
              <p class="fiche-meta">${meta || `Révision ${P17.esc(CFG.revision || "")} · Contenu à valider par l'équipe médicale du service`}</p>
            </footer>
          </div>
        </div>
      </article>`;
  };

  /* Sommaire : ouvert sur grand écran, partie en cours marquée.
     Après un clic, l'entrée choisie reste marquée jusqu'à la fin du défilement. */
  let tocLock = 0;
  function tocSet(toc, id) {
    let cur = null;
    toc.querySelectorAll("[data-scroll]").forEach(b => {
      const on = b.dataset.scroll === id;
      b.classList.toggle("is-active", on);
      if (on) { b.setAttribute("aria-current", "true"); cur = b; } else b.removeAttribute("aria-current");
    });
    // Sommaire plus haut que l'écran : garder l'entrée en cours visible, sans faire défiler la page
    if (cur && toc.scrollHeight > toc.clientHeight + 2) {
      const top = cur.offsetTop, bot = top + cur.offsetHeight;
      if (top < toc.scrollTop + 8) toc.scrollTop = Math.max(0, top - 40);
      else if (bot > toc.scrollTop + toc.clientHeight - 8) toc.scrollTop = bot - toc.clientHeight + 40;
    }
  }
  // Clic dans le sommaire : l'entrée choisie est marquée tout de suite et le reste
  // jusqu'à l'arrêt du défilement (aucune entrée intermédiaire ne s'allume au passage).
  function tocHold(toc, id) {
    tocSet(toc, id);
    tocLock = Date.now() + 4000;
    let timer = 0;
    const done = () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      tocLock = 0;
      tocSet(toc, id);
    };
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(done, 160); };
    window.addEventListener("scroll", onScroll, { passive: true });
    timer = setTimeout(done, 300);
  }
  function initToc(root) {
    const toc = root.querySelector("[data-toc]");
    if (P17._tocObs) { P17._tocObs.disconnect(); P17._tocObs = null; }
    P17._tocUpdate = null; tocLock = 0;
    if (!toc) return;
    if (window.matchMedia("(min-width: 1080px)").matches) toc.open = true;
    const btns = Array.from(toc.querySelectorAll("[data-scroll]"));
    const targets = btns.map(b => root.querySelector("#" + b.dataset.scroll)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !targets.length) return;
    const seen = new Map();
    const update = () => {
      if (Date.now() < tocLock) return;
      const first = targets.find(t => seen.get(t.id));
      if (first) tocSet(toc, first.id);
    };
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
      update();
    }, { rootMargin: "-110px 0px -55% 0px" });
    targets.forEach(t => obs.observe(t));
    P17._tocObs = obs;
    P17._tocUpdate = update;
  }

  /* Volets repliables (menu à dérouler) : un seul ouvert à la fois, retrouvé au retour sur la page */
  const ACC = {};
  P17.accordion = function (key, items) {
    const open = ACC[key] || "";
    return `<section class="acc-group" data-acc-key="${key}">${items.map(it => `
      <div class="acc ${open === it.id ? "is-open" : ""}" data-acc="${it.id}">
        <button class="acc-head" type="button" aria-expanded="${open === it.id}" aria-controls="acc-${key}-${it.id}">
          <span class="acc-ico">${P17.icon(it.icon || "fiche")}</span>
          <span class="acc-t">${it.step ? `<span class="acc-step">${it.step}</span>` : ""}<b>${it.title}</b>${it.sub ? `<em>${it.sub}</em>` : ""}</span>
          <span class="acc-n">${it.n || ""}</span>
          <span class="acc-chev" aria-hidden="true">${P17.icon("arrow")}</span>
        </button>
        <div class="acc-panel" id="acc-${key}-${it.id}" ${open === it.id ? "" : "inert"}><div class="acc-inner">${it.html}</div></div>
      </div>`).join("")}</section>`;
  };
  document.addEventListener("click", e => {
    const h = e.target.closest("[data-acc-key] .acc-head"); if (!h) return;
    const grp = h.closest("[data-acc-key]"), acc = h.closest("[data-acc]");
    const on = !acc.classList.contains("is-open");
    grp.querySelectorAll("[data-acc]").forEach(o => {
      const x = o === acc && on;
      o.classList.toggle("is-open", x); o.querySelector(".acc-head").setAttribute("aria-expanded", String(x)); o.querySelector(".acc-panel").toggleAttribute("inert", !x);
    });
    ACC[grp.dataset.accKey] = on ? acc.dataset.acc : "";
  });

  /* Raccourcis d'écriture des fiches */
  P17.h = {
    S: (title, blocks, opts = {}) => ({ title, blocks: Array.isArray(blocks) ? blocks : [blocks], ...opts }),
    ul: (...items) => ({ ul: items }),
    ult: (title, ...items) => ({ title, ul: items }),
    ol: (...items) => ({ ol: items }),
    kv: (...pairs) => ({ kv: pairs }),
    tbl: (head, rows, note) => ({ table: { head, rows, note } }),
    warn: (t, title) => ({ callout: t, tone: "warn", title }),
    danger: (t, title) => ({ callout: t, tone: "danger", title }),
    info: (t, title) => ({ callout: t, tone: "info", title }),
    ok: (t, title) => ({ callout: t, tone: "ok", title })
  };

  /* ---------------- Calculateurs et outils interactifs ---------------- */
  const CALCS = {};

  function fieldHtml(cid, f) {
    const id = `${cid}__${f.id}`;
    const label = `<span class="f-label">${f.label}${f.unit ? ` <em>${f.unit}</em>` : ""}</span>`;
    if (f.type === "select") {
      return `<label class="field" for="${id}">${label}
        <select id="${id}" data-f="${f.id}">${f.options.map(o => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return `<option value="${P17.esc(v)}" ${String(v) === String(f.value ?? "") ? "selected" : ""}>${l}</option>`;
        }).join("")}</select></label>`;
    }
    if (f.type === "seg") {
      return `<fieldset class="field field--seg"><legend class="f-label">${f.label}</legend><div class="seg">
        ${f.options.map((o, i) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          const checked = f.value !== undefined ? String(v) === String(f.value) : i === 0;
          return `<label><input type="radio" name="${id}" value="${P17.esc(v)}" data-f="${f.id}" ${checked ? "checked" : ""}><span>${l}</span></label>`;
        }).join("")}</div></fieldset>`;
    }
    if (f.type === "time") {
      return `<label class="field" for="${id}">${label}<input id="${id}" data-f="${f.id}" type="time" value="${P17.esc(f.value ?? "")}"></label>`;
    }
    if (f.type === "date") {
      return `<label class="field" for="${id}">${label}<input id="${id}" data-f="${f.id}" type="date" value="${P17.esc(f.value ?? "")}"></label>`;
    }
    if (f.type === "check") {
      return `<label class="check" for="${id}"><input id="${id}" type="checkbox" data-f="${f.id}" ${f.value ? "checked" : ""}><span>${f.label}</span></label>`;
    }
    if (f.type === "checks") {
      return `<fieldset class="field field--checks"><legend class="f-label">${f.label}</legend><div class="checks">
        ${f.options.map(o => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return `<label class="check"><input type="checkbox" data-f="${f.id}" data-v="${P17.esc(v)}"><span>${l}</span></label>`;
        }).join("")}</div></fieldset>`;
    }
    return `<label class="field" for="${id}">${label}
      <input id="${id}" data-f="${f.id}" type="text" inputmode="decimal" autocomplete="off"
        placeholder="${P17.esc(f.placeholder ?? "")}" value="${P17.esc(f.value ?? "")}"></label>`;
  }

  function readValues(root, def) {
    const v = {};
    def.fields.forEach(f => {
      if (f.type === "seg") {
        const el = root.querySelector(`input[data-f="${f.id}"]:checked`);
        v[f.id] = el ? el.value : null;
      } else if (f.type === "check") {
        const el = root.querySelector(`input[data-f="${f.id}"]`);
        v[f.id] = !!(el && el.checked);
      } else if (f.type === "checks") {
        v[f.id] = Array.from(root.querySelectorAll(`input[data-f="${f.id}"]:checked`)).map(e => e.dataset.v);
      } else if (f.type === "select" || f.type === "date" || f.type === "time") {
        const el = root.querySelector(`[data-f="${f.id}"]`);
        v[f.id] = el && el.value ? el.value : null;
      } else {
        const el = root.querySelector(`[data-f="${f.id}"]`);
        v[f.id] = el ? P17.num(el.value) : null;
        v["_raw_" + f.id] = el ? el.value : "";
      }
    });
    return v;
  }

  function showIf(root, def, v) {
    def.fields.forEach(f => {
      if (!f.showIf) return;
      const show = !!f.showIf(v);
      const el = root.querySelector(`[data-wrap="${f.id}"]`);
      if (el) el.hidden = !show;
      const hd = root.querySelector(`[data-head="${f.id}"]`);
      if (hd) hd.hidden = !show;
    });
  }

  /* def: { id, title, desc, fields, compute(v) -> {main, sub, rows, tone, html} | null, note, wide, kind } */
  P17.calc = function (def) {
    CALCS[def.id] = def;
    const fields = def.fields.map(f => `${f.heading ? `<div class="f-heading" data-head="${f.id}">${f.heading}</div>` : ""}<div class="f-wrap ${f.full ? "f-wrap--full" : ""}" data-wrap="${f.id}">${fieldHtml(def.id, f)}</div>`).join("");
    return `
      <section class="calc ${def.wide ? "calc--wide" : ""} ${def.kind === "tool" ? "calc--tool" : ""} ${def.cls || ""}" data-calc="${def.id}">
        <header class="calc-head">
          <h3 class="calc-title">${def.title}</h3>
          ${def.desc ? `<p class="calc-desc">${def.desc}</p>` : ""}
        </header>
        <div class="calc-fields">${fields}</div>
        <div class="calc-out" aria-live="polite"></div>
        ${def.note ? `<div class="calc-note">${def.note}</div>` : ""}
      </section>`;
  };

  function renderOut(def, res) {
    if (!res) return `<div class="out out--empty">${def.empty || "Renseigner les champs pour obtenir le résultat."}</div>`;
    if (res.html && !res.main) return `<div class="out out--html ${res.tone ? "out--" + res.tone : ""}">${res.html}</div>`;
    return `<div class="out ${res.tone ? "out--" + res.tone : ""}">
      ${res.label ? `<div class="out-label">${res.label}</div>` : ""}
      ${res.main ? `<div class="out-main">${res.main}</div>` : ""}
      ${res.sub ? `<div class="out-sub">${res.sub}</div>` : ""}
      ${res.rows ? `<dl class="out-rows">${res.rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join("")}</dl>` : ""}
      ${res.html || ""}
    </div>`;
  }

  /* Plusieurs outils côte à côte : présentés en liste repliée, un clic ouvre l'outil */
  function collapseCalcs(root) {
    root.querySelectorAll(".calc-grid").forEach(grid => {
      const items = Array.from(grid.children).filter(el => el.matches("[data-calc]"));
      if (items.length < 2) return;
      grid.classList.add("calc-list");
      items.forEach(box => {
        if (box.classList.contains("is-collapsible")) return;
        box.classList.add("is-collapsible");
        const head = box.querySelector(".calc-head");
        head.setAttribute("role", "button"); head.setAttribute("tabindex", "0"); head.setAttribute("aria-expanded", "false");
        head.insertAdjacentHTML("beforeend", `<span class="calc-chev" aria-hidden="true">${P17.icon("arrow")}</span>`);
        const toggle = () => { const open = box.classList.toggle("is-open"); head.setAttribute("aria-expanded", String(open)); };
        head.addEventListener("click", toggle);
        head.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
      });
    });
  }
  function bindCalcs(root) {
    collapseCalcs(root);
    root.querySelectorAll("[data-calc]").forEach(box => {
      const def = CALCS[box.dataset.calc];
      if (!def) return;
      const out = box.querySelector(".calc-out");
      const update = () => {
        const v = readValues(box, def);
        showIf(box, def, v);
        let res = null;
        try { res = def.compute(v); } catch (e) { console.error(e); res = null; }
        out.innerHTML = renderOut(def, res);
      };
      box.addEventListener("input", update);
      box.addEventListener("change", update);
      update();
    });
  }

  /* ---------------- Recherche ---------------- */
  function initSearch() {
    const input = document.getElementById("search-input");
    const box = document.getElementById("search-results");
    if (!input || !box) return;
    const ph = input.getAttribute("placeholder");
    const fitPh = () => input.setAttribute("placeholder", window.matchMedia("(max-width: 600px)").matches ? "Rechercher…" : ph);
    fitPh(); window.addEventListener("resize", fitPh);
    let sel = -1;
    const close = () => { box.hidden = true; sel = -1; };
    const run = () => {
      const q = P17.norm(input.value);
      if (q.length < 2) { close(); return; }
      const toks = q.split(/\s+/).filter(Boolean);
      const res = P17.searchIndex
        .map(it => {
          // Début de mot prioritaire (« LUS » ne doit pas remonter « occlusion »)
          let score = 0;
          const title = " " + P17.norm(it.title).replace(/[^a-z0-9]+/g, " ");
          const hay = " " + it.hay.replace(/[^a-z0-9]+/g, " ");
          for (const t of toks) {
            if (!it.hay.includes(t)) return null;
            score += title.includes(" " + t) ? 6 : title.includes(t) ? 2 : hay.includes(" " + t) ? 3 : 0.5;
          }
          return { it, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score || a.it.title.length - b.it.title.length)
        .slice(0, 12);
      box.innerHTML = res.length
        ? res.map((r, i) => `<a href="${r.it.path}" class="sr ${i === sel ? "is-sel" : ""}"><span class="sr-title">${P17.esc(r.it.title)}</span><span class="sr-sec">${P17.esc(r.it.section)}</span></a>`).join("")
        : `<div class="sr-empty">Aucun résultat pour « ${P17.esc(input.value)} »</div>`;
      box.hidden = false;
    };
    input.addEventListener("input", () => { sel = -1; run(); });
    input.addEventListener("focus", run);
    input.addEventListener("keydown", e => {
      const links = box.querySelectorAll(".sr");
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, links.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); }
      else if (e.key === "Enter") { const l = links[sel >= 0 ? sel : 0]; if (l) { P17.go(l.getAttribute("href")); input.value = ""; input.blur(); close(); } return; }
      else if (e.key === "Escape") { close(); input.blur(); return; }
      else return;
      links.forEach((l, i) => l.classList.toggle("is-sel", i === sel));
    });
    document.addEventListener("click", e => { if (!e.target.closest(".search")) close(); });
    box.addEventListener("click", e => { if (e.target.closest(".sr")) { input.value = ""; close(); } });
  }

  /* ---------------- Visionneuse d'images ---------------- */
  function initViewer() {
    const v = document.getElementById("viewer");
    const img = document.getElementById("viewer-img");
    const title = document.getElementById("viewer-title");
    const stage = document.getElementById("viewer-stage");
    const close = () => { v.hidden = true; img.src = ""; v.classList.remove("is-zoom"); document.body.classList.remove("no-scroll"); };
    P17.view = (src, t = "") => {
      img.src = P17.src(src); title.textContent = t; v.hidden = false; v.classList.remove("is-zoom");
      document.body.classList.add("no-scroll"); stage.scrollTop = 0; stage.scrollLeft = 0;
    };
    document.getElementById("viewer-close").addEventListener("click", close);
    document.getElementById("viewer-zoom").addEventListener("click", () => v.classList.toggle("is-zoom"));
    stage.addEventListener("click", e => { if (e.target === stage) close(); });
    img.addEventListener("dblclick", () => v.classList.toggle("is-zoom"));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !v.hidden) close(); });
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-view]");
      if (b) { e.preventDefault(); P17.view(b.dataset.view, b.dataset.title || ""); }
    });
  }

  /* ---------------- Thème ---------------- */
  function initTheme() {
    const btn = document.getElementById("theme-btn");
    const root = document.documentElement;
    const effective = () => {
      const t = root.getAttribute("data-theme");
      if (t) return t;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    const sync = () => {
      const t = effective();
      btn.setAttribute("data-mode", t);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", t === "light" ? "#f4f3f8" : "#120e22");
    };
    btn.addEventListener("click", () => {
      const next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      P17.storage.set("p17-theme", next);
      sync();
    });
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", sync);
    sync();
  }

  /* ---------------- PWA ---------------- */
  function initPwa() {
    const btn = document.getElementById("install-btn");
    let deferred = null;
    window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; btn.hidden = false; });
    btn.addEventListener("click", async () => {
      if (!deferred) return;
      deferred.prompt();
      try { await deferred.userChoice; } catch (e) {}
      deferred = null; btn.hidden = true;
    });
    const isHttp = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if ("serviceWorker" in navigator && isHttp && !P17.cfg.noServiceWorker) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(() => {});
      });
    }
  }

  /* ---------------- Routeur ----------------
     Les liens internes gardent la forme « #/rubrique/page » dans le code,
     mais la navigation est gérée par l'application (clic intercepté) et
     l'adresse affiche une forme simple « #rubrique--page », compatible avec
     les fenêtres d'aperçu qui n'acceptent pas les barres obliques. */
  let CUR = "#/";
  const normPath = p => {
    p = String(p || "#/").split("?")[0];
    if (!p.startsWith("#/")) p = "#/" + p.replace(/^#/, "");
    p = p.replace(/\/+$/, "");
    return p === "#" || p === "" ? "#/" : p;
  };
  const toHash = p => (p === "#/" ? "" : p.slice(2).split("/").join("--"));
  const fromHash = h => {
    h = decodeURIComponent(String(h || "").replace(/^#/, ""));
    if (!h || h === "accueil") return "#/";
    if (h.startsWith("/")) return normPath("#" + h);
    return normPath("#/" + h.split("--").join("/"));
  };

  const POS = {};   // position de défilement mémorisée par page
  let PREV = null;

  const BACK = {};   // page → cible de son bouton « Retour »
  // Suit les redirections (anciennes adresses) jusqu'à la page réelle
  const resolve = p => { let n = 0; while (P17.routes[p] && P17.routes[p].redirect && n++ < 5) p = P17.routes[p].redirect; return p; };
  const fixHash = p => { try { history.replaceState(null, "", "#" + (toHash(p) || "accueil")); } catch (e) {} };
  function navigate(p) {
    try { POS[CUR] = window.scrollY; } catch (e) {}
    PREV = CUR;
    CUR = p;
    render();
  }

  P17.go = function (path) {
    const p = resolve(normPath(path));
    navigate(p);
    try {
      const want = toHash(p) || "accueil";
      const now = location.hash.replace(/^#/, "");
      if (now !== want && !(want === "accueil" && now === "")) location.hash = want;
    } catch (e) { /* adresse non modifiable : la navigation interne suffit */ }
  };

  /* Bouton « Retour » de la barre du haut : même cible que le lien de la page */
  function syncBack(root, path) {
    const btn = document.getElementById("app-back");
    if (!btn) return;
    const link = root.querySelector(".back-link");
    const home = path === "#/";
    document.body.classList.toggle("has-back", !home);
    btn.hidden = home;
    if (home) return;
    const href = link ? link.getAttribute("href") : "#/";
    let label = link && link.dataset.label;
    if (!label) {
      const c = root.querySelector(`.crumbs a[href="${href}"]`);
      label = href === "#/" ? "Accueil" : c ? c.textContent.trim() : "";
    }
    BACK[path] = href;
    btn.setAttribute("href", href);
    const to = btn.querySelector(".ab-to");
    if (to) to.textContent = label || "";
    btn.setAttribute("aria-label", `Retour${label ? " : " + label : ""}`);
  }

  function render() {
    const path = CUR;
    const def = P17.routes[path];
    const root = $app();
    if (!def) {
      root.innerHTML = P17.page({
        title: "Page introuvable",
        subtitle: "Ce lien ne correspond à aucune page de la plateforme.",
        body: `<p class="empty"><a class="btn" href="#/">Revenir à l'accueil</a></p>`
      });
    } else {
      const html = def.render();
      if (typeof html === "string") root.innerHTML = html;
      document.title = def.title ? `${def.title} · ${CFG.appName}` : CFG.appName;
    }
    bindCalcs(root);
    syncBack(root, path);
    document.body.setAttribute("data-route", path.replace(/[#/]+/g, "-").replace(/^-|-$/g, "") || "home");
    // Retour vers une page parente : on retrouve l'endroit où l'on était
    const up = PREV && PREV !== path && (path === "#/" || PREV.startsWith(path + "/") || BACK[PREV] === path);
    const y = up && POS[path] ? POS[path] : 0;
    try { window.scrollTo(0, y); } catch (e) {}
    if (def && def.after) { try { def.after(root); } catch (e) { console.error(e); } }
    P17._after.forEach(fn => { try { fn(root, path); } catch (e) {} });
    initToc(root);
    if (y) { try { window.scrollTo(0, y); } catch (e) {} }
    root.classList.remove("is-enter"); void root.offsetWidth; root.classList.add("is-enter");
    try { root.focus({ preventScroll: true }); } catch (e) {}
  }

  function initLinks() {
    document.addEventListener("click", e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const sc = e.target.closest("[data-scroll]");
      if (sc) {
        const t = document.getElementById(sc.dataset.scroll);
        if (t) {
          e.preventDefault();
          // Sur téléphone, refermer le sommaire avant de défiler (sinon la page se décale)
          const toc = sc.closest("[data-toc]");
          if (toc && !window.matchMedia("(min-width: 1080px)").matches) toc.open = false;
          const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (toc) tocHold(toc, sc.dataset.scroll);
          t.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        }
        return;
      }
      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !(href === "#" || href.startsWith("#/"))) return;
      e.preventDefault();
      P17.go(href);
    });
    window.addEventListener("hashchange", () => {
      const raw = fromHash(location.hash);
      const p = resolve(raw);
      if (p !== raw) fixHash(p);
      if (p !== CUR) navigate(p);
    });
  }

  P17.start = function () {
    try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
    initTheme();
    initSearch();
    initViewer();
    initPwa();
    initLinks();
    if (CFG.logo) {
      const b = document.querySelector(".brand-chu");
      if (b) b.outerHTML = `<img class="brand-logo" src="${P17.esc(P17.src(CFG.logo))}" alt="">`;
    }
    const first = fromHash(location.hash);
    CUR = resolve(first);
    if (CUR !== first) fixHash(CUR);
    if (!P17.routes[CUR]) CUR = "#/";
    render();
  };

  window.P17 = P17;
})();
