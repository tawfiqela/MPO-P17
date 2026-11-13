/* Anesth P17 — application de protocoles (PWA, sans dépendance) */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const q = document.getElementById('q');
  const backBtn = document.getElementById('back');
  const offlineBadge = document.getElementById('offline-badge');

  let DATA = { categories: [], protocoles: [] };

  /* ---------- Favoris (stockage local, facultatif) ---------- */
  const FAV_KEY = 'p17-favoris';
  const loadFavs = () => {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
    catch { return new Set(); }
  };
  let favs = loadFavs();
  const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch {} };

  /* ---------- Outils ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const chevron = '<svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const catById = (id) => DATA.categories.find((c) => c.id === id);
  const protoById = (id) => DATA.protocoles.find((p) => p.id === id);
  const protosOf = (catId) => DATA.protocoles.filter((p) => p.categorie === catId);

  /* Texte d'une fiche, pour la recherche */
  const plain = (p) => [p.titre, p.resume, ...(p.motsCles || []), ...(p.sections || []).map((s) => `${s.titre} ${s.contenu}`)]
    .join(' ').replace(/<[^>]+>/g, ' ');

  const protoItem = (p) => {
    const cat = catById(p.categorie);
    return `<li><a href="#/protocole/${encodeURIComponent(p.id)}">
      <span class="t"><strong>${esc(p.titre)}</strong><small>${esc(p.resume || (cat ? cat.nom : ''))}</small></span>${chevron}</a></li>`;
  };

  /* ---------- Vues ---------- */
  function viewHome() {
    backBtn.hidden = true;
    const favList = DATA.protocoles.filter((p) => favs.has(p.id));
    const tiles = DATA.categories.map((c) => {
      const n = protosOf(c.id).length;
      return `<a class="tile" href="#/categorie/${encodeURIComponent(c.id)}">
        <span class="ico" aria-hidden="true">${esc(c.icone || '•')}</span>
        <strong>${esc(c.nom)}</strong>
        <span class="count">${n === 0 ? 'Bientôt' : n + ' fiche' + (n > 1 ? 's' : '')}</span></a>`;
    }).join('');

    app.innerHTML = `
      ${favList.length ? `<h2 class="section">Favoris</h2><ul class="list">${favList.map(protoItem).join('')}</ul>` : ''}
      <h2 class="section">Rubriques</h2>
      <div class="grid">${tiles}</div>`;
  }

  function viewCategory(id) {
    const c = catById(id);
    if (!c) return viewNotFound();
    backBtn.hidden = false;
    const list = protosOf(id);
    app.innerHTML = `
      <h1 class="page">${esc(c.icone || '')} ${esc(c.nom)}</h1>
      ${c.description ? `<p style="color:var(--muted);margin-top:-6px">${esc(c.description)}</p>` : ''}
      ${list.length ? `<ul class="list">${list.map(protoItem).join('')}</ul>` : '<div class="empty">Aucune fiche pour le moment.</div>'}`;
  }

  function viewProtocol(id) {
    const p = protoById(id);
    if (!p) return viewNotFound();
    backBtn.hidden = false;
    const cat = catById(p.categorie);
    const isFav = favs.has(p.id);
    const sections = (p.sections || []).map((s) => `
      <section class="block${s.type === 'alerte' ? ' alert' : ''}">
        ${s.titre ? `<h2>${esc(s.titre)}</h2>` : ''}
        ${s.contenu.includes('<table') ? `<div class="tablewrap">${s.contenu}</div>` : s.contenu}
      </section>`).join('');

    app.innerHTML = `
      <div class="proto-head">
        <h1>${esc(p.titre)}</h1>
        <button class="fav" id="fav" aria-pressed="${isFav}" aria-label="Ajouter aux favoris">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 17.3l-6.2 3.7 1.7-7L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.5 4.8 1.7 7z" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="meta">
        ${cat ? `<a class="chip" href="#/categorie/${encodeURIComponent(cat.id)}" style="text-decoration:none">${esc(cat.nom)}</a>` : ''}
        ${p.brouillon ? '<span class="chip draft">Exemple / brouillon</span>' : ''}
        ${p.maj ? `<span class="chip">Mise à jour : ${esc(p.maj)}</span>` : ''}
      </div>
      ${sections}
      ${p.source ? `<p class="source">Source : ${esc(p.source)}</p>` : ''}`;

    document.getElementById('fav').addEventListener('click', () => {
      favs.has(p.id) ? favs.delete(p.id) : favs.add(p.id);
      saveFavs();
      viewProtocol(id);
    });
  }

  function viewSearch(term) {
    backBtn.hidden = false;
    const words = norm(term).split(/\s+/).filter(Boolean);
    const hits = DATA.protocoles
      .map((p) => {
        const hay = norm(plain(p));
        const title = norm(p.titre);
        if (!words.every((w) => hay.includes(w))) return null;
        const score = words.reduce((s, w) => s + (title.includes(w) ? 3 : 1), 0);
        return { p, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map((h) => h.p);

    app.innerHTML = `
      <h1 class="page">Résultats pour « ${esc(term)} »</h1>
      ${hits.length ? `<ul class="list">${hits.map(protoItem).join('')}</ul>` : '<div class="empty">Aucun résultat.</div>'}`;
  }

  function viewNotFound() {
    backBtn.hidden = false;
    app.innerHTML = '<div class="empty">Page introuvable. <a href="#/">Retour à l’accueil</a></div>';
  }

  /* ---------- Navigation ---------- */
  function route() {
    const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [kind, ...rest] = hash.split('/');
    const id = rest.join('/');
    if (kind === 'categorie') viewCategory(id);
    else if (kind === 'protocole') viewProtocol(id);
    else if (kind === 'recherche') viewSearch(id);
    else viewHome();
    if (kind !== 'recherche' && q.value) q.value = '';
    window.scrollTo(0, 0);
  }

  let searchTimer;
  q.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const v = q.value.trim();
      if (v) history.replaceState(null, '', '#/recherche/' + encodeURIComponent(v));
      else history.replaceState(null, '', '#/');
      v ? viewSearch(v) : viewHome();
    }, 150);
  });

  backBtn.addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.hash = '#/';
  });

  window.addEventListener('hashchange', route);

  const updateOnline = () => { offlineBadge.hidden = navigator.onLine; };
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);

  /* ---------- Chargement ---------- */
  fetch('data/protocoles.json', { cache: 'no-cache' })
    .then((r) => r.json())
    .then((json) => { DATA = json; route(); updateOnline(); })
    .catch(() => { app.innerHTML = '<div class="empty">Impossible de charger les protocoles. Vérifie ta connexion puis recharge la page.</div>'; });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
