// REpublic — comportements du site : grille de tirage, menu, recherche, commentaires.
(function () {
  'use strict';
  var cfg = window.REPUBLIC || {};

  // Grille de tirage : 150 cases, un tirage nouveau à chaque affichage.
  document.querySelectorAll('[data-sortition]').forEach(function (g) {
    var n = 150, k = +g.getAttribute('data-sortition') || 12, picked = {}, count = 0;
    while (count < k) { var r = Math.floor(Math.random() * n); if (!picked[r]) { picked[r] = 1; count++; } }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) { var c = document.createElement('i'); if (picked[i]) c.className = 'on'; frag.appendChild(c); }
    g.appendChild(frag);
  });

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('nav');
  if (toggle && nav) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
  });

  // Recherche dans le texte
  var index = null, loading = null;
  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = fetch('/search.json').then(function (r) { return r.json(); }).then(function (d) {
      index = d.map(function (a) { a.k = norm(a.t + ' ' + a.x); a.kt = norm(a.t); return a; });
      return index;
    });
    return loading;
  }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function escapeHtml(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function excerpt(text, words) {
    var n = norm(text), pos = -1;
    for (var i = 0; i < words.length && pos < 0; i++) pos = n.indexOf(words[i]);
    if (pos < 0) return text.slice(0, 110) + '…';
    var start = Math.max(0, pos - 40);
    return (start ? '…' : '') + text.slice(start, start + 130) + '…';
  }
  document.querySelectorAll('.search').forEach(function (form) {
    var input = form.querySelector('input'), list = form.querySelector('.search__results'), active = -1;
    function render(q) {
      q = q.trim(); active = -1;
      if (!q) { list.innerHTML = ''; return; }
      load().then(function (idx) {
        var res, words = norm(q).replace(/^(art(icle)?\.?\s*)/, '').split(/\s+/).filter(Boolean);
        var num = /^\d{1,3}$/.test(words[0] || '') && words.length === 1 ? +words[0] : null;
        if (num) res = idx.filter(function (a) { return a.n === num; });
        else res = idx.map(function (a) {
          var score = 0;
          for (var i = 0; i < words.length; i++) {
            if (a.k.indexOf(words[i]) < 0) return null;
            if (a.kt.indexOf(words[i]) >= 0) score += 5;
            score += a.k.split(words[i]).length - 1;
          }
          return { a: a, s: score };
        }).filter(Boolean).sort(function (x, y) { return y.s - x.s; }).slice(0, 12).map(function (r) { return r.a; });
        list.innerHTML = res.length ? res.map(function (a) {
          return '<li><a href="' + a.u + '"><b>' + a.n + '</b><span><b>' + escapeHtml(a.t) + '</b><small>' + a.g + ' · ' + escapeHtml(excerpt(a.x, words)) + '</small></span></a></li>';
        }).join('') : '<li class="search__empty">Aucun article ne correspond.</li>';
      });
    }
    input.addEventListener('focus', load);
    var initial = new URLSearchParams(location.search).get('q');
    if (initial && form === document.querySelector('.search')) { input.value = initial; render(initial); input.focus(); }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      var links = list.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!links.length) return;
        e.preventDefault();
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle('is-active', i === active); });
        links[active].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var target = links[active >= 0 ? active : 0];
        if (target) location.href = target.getAttribute('href');
      } else if (e.key === 'Escape') { input.value = ''; list.innerHTML = ''; }
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) list.innerHTML = ''; });
  });

  // Sommaire latéral : article en cours de lecture
  var tocLinks = document.querySelectorAll('.toc__arts a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
          byId[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.rp-article').forEach(function (a) { io.observe(a); });
  }

  // Commentaires par article (Giscus, sur GitHub Discussions), chargés à la demande.
  var g = cfg.giscus || {};
  var ready = g.repo && g.repoId && g.category && g.categoryId;
  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.querySelectorAll('.js-comment').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.rp-article__main').querySelector('.comments');
      var open = box.hidden;
      box.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Masquer les commentaires' : 'Commenter';
      if (!open || box.dataset.loaded) return;
      box.dataset.loaded = '1';
      if (!ready) {
        box.innerHTML = '<p class="comments__note">Les commentaires ouvriront à la mise en ligne publique du projet. En attendant, vous pouvez proposer une modification <a href="https://github.com/' + cfg.repo + '">sur GitHub</a>.</p>';
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      var attrs = {
        'data-repo': g.repo, 'data-repo-id': g.repoId, 'data-category': g.category, 'data-category-id': g.categoryId,
        'data-mapping': 'specific', 'data-term': btn.getAttribute('data-term'), 'data-strict': '1',
        'data-reactions-enabled': '1', 'data-emit-metadata': '0', 'data-input-position': 'top',
        'data-theme': dark ? 'noborder_dark' : 'noborder_light', 'data-lang': 'fr', 'data-loading': 'lazy'
      };
      Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      box.appendChild(s);
    });
  });

  // Adresse de contact reconstituée au clic.
  document.querySelectorAll('.js-mail').forEach(function (a) {
    var rev = function (s) { return s.split('').reverse().join(''); };
    var addr = rev(a.getAttribute('data-u')) + '@' + rev(a.getAttribute('data-d'));
    a.setAttribute('href', 'mailto:' + addr);
    a.insertAdjacentHTML('afterend', ' <span class="mail-addr">' + addr + '</span>');
  });

  // Lien vers l'article : copie l'adresse.
  document.querySelectorAll('.js-permalink').forEach(function (a) {
    a.addEventListener('click', function () {
      var url = location.origin + location.pathname + a.getAttribute('href');
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () {
        var t = a.textContent; a.textContent = 'Lien copié'; setTimeout(function () { a.textContent = t; }, 1600);
      });
    });
  });
})();
