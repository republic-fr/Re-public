// REpublic — comportements du site : grille de tirage, menu, recherche, commentaires.
(function () {
  'use strict';
  var cfg = window.REPUBLIC || {};
  var EN = document.documentElement.lang === 'en';
  var T = EN ? {
    close: 'Close', menu: 'Menu', none: 'No article matches.', hide: 'Hide comments', comment: 'Comment',
    soon: 'Comments will open when the project goes public. Meanwhile, you can suggest a change <a href="https://github.com/' + cfg.repo + '">on GitHub</a>.',
    sending: 'Sending…', sent: 'Thank you, your message has been sent.', failed: 'Sending failed. Please try again, or write to us directly.', copied: 'Link copied'
  } : {
    close: 'Fermer', menu: 'Menu', none: 'Aucun article ne correspond.', hide: 'Masquer les commentaires', comment: 'Commenter',
    soon: 'Les commentaires ouvriront à la mise en ligne publique du projet. En attendant, vous pouvez proposer une modification <a href="https://github.com/' + cfg.repo + '">sur GitHub</a>.',
    sending: 'Envoi en cours…', sent: 'Merci, votre message a bien été envoyé.', failed: 'L’envoi a échoué. Réessayez, ou écrivez-nous directement.', copied: 'Lien copié'
  };

  // Grille de tirage : 150 cases, un tirage nouveau à chaque affichage.
  document.querySelectorAll('[data-sortition]').forEach(function (g) {
    var n = 150, k = +g.getAttribute('data-sortition') || 12, picked = {}, count = 0;
    while (count < k) { var r = Math.floor(Math.random() * n); if (!picked[r]) { picked[r] = 1; count++; } }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) { var c = document.createElement('i'); if (picked[i]) c.className = 'on'; frag.appendChild(c); }
    g.appendChild(frag);
  });

  // Anciens liens « #article-N » (numérotation de la v25) : renvoi vers la place actuelle de l'article.
  var old = /^#article-(\d{1,3})$/.exec(location.hash);
  if (old && window.fetch) fetch('/v25.json').then(function (r) { return r.json(); }).then(function (map) {
    var url = map[old[1]];
    if (url) location.replace(url);
  }).catch(function () {});

  // Schémas fonctionnels : liens dessinés entre les éléments, explications au survol ou au toucher.
  var NS = 'http://www.w3.org/2000/svg';
  var mobile = window.matchMedia('(max-width: 899px)');
  function boxOf(canvas, cr, id) {
    var el = canvas.querySelector('[data-node="' + id + '"]');
    var r = el.getBoundingClientRect();
    return { l: r.left - cr.left, t: r.top - cr.top, r: r.right - cr.left, b: r.bottom - cr.top, cx: (r.left + r.right) / 2 - cr.left, cy: (r.top + r.bottom) / 2 - cr.top };
  }
  function drawSchema(fig) {
    var canvas = fig.querySelector('.dg__canvas');
    var svg = canvas.querySelector('.dg__links');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (mobile.matches) return;
    var links = JSON.parse(canvas.getAttribute('data-links') || '[]');
    var cr = canvas.getBoundingClientRect();
    var gap = parseFloat(getComputedStyle(canvas).rowGap) || 60;
    var mid = 'dg-arrow-' + fig.id;
    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<marker id="' + mid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>';
    svg.appendChild(defs);
    var side = { droite: 0, gauche: 0 };
    var lanes = {};
    links.forEach(function (l) {
      var a = boxOf(canvas, cr, l.from), b = boxOf(canvas, cr, l.to), p, lx, ly;
      if (l.via) {
        var off = 16 + 10 * side[l.via]++;
        if (l.via === 'droite') { var x = Math.max(a.r, b.r) + off; p = [[a.r, a.cy], [x, a.cy], [x, b.cy], [b.r, b.cy]]; lx = x; }
        else { var x2 = Math.min(a.l, b.l) - off; p = [[a.l, a.cy], [x2, a.cy], [x2, b.cy], [b.l, b.cy]]; lx = x2; }
        ly = (a.cy + b.cy) / 2;
      } else if (Math.abs(a.cy - b.cy) < 4) {
        p = b.l >= a.r ? [[a.r, a.cy], [b.l, b.cy]] : [[a.l, a.cy], [b.r, b.cy]];
        lx = (p[0][0] + p[1][0]) / 2; ly = a.cy;
      } else if (Math.abs(a.cx - b.cx) < 4) {
        p = b.t > a.b ? [[a.cx, a.b], [b.cx, b.t]] : [[a.cx, a.t], [b.cx, b.b]];
        lx = a.cx; ly = (p[0][1] + p[1][1]) / 2;
      } else {
        var down = b.t > a.b;
        var y = down ? a.b + gap / 2 : a.t - gap / 2;
        var key = Math.round(y), lane = lanes[key] || (lanes[key] = { list: [] });
        var k = lane.list.indexOf(l.from);
        if (k < 0) { lane.list.push(l.from); k = lane.list.length - 1; }
        y += (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 8;
        p = [[a.cx, down ? a.b : a.t], [a.cx, y], [b.cx, y], [b.cx, down ? b.t : b.b]];
        lx = (a.cx + b.cx) / 2; ly = y;
      }
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M' + p.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' L'));
      path.setAttribute('marker-end', 'url(#' + mid + ')');
      path.setAttribute('class', l.dashed ? 'is-dashed' : '');
      path.setAttribute('data-from', l.from); path.setAttribute('data-to', l.to);
      svg.appendChild(path);
      if (l.label) {
        var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'dg-label');
        g.setAttribute('data-from', l.from); g.setAttribute('data-to', l.to);
        var t = document.createElementNS(NS, 'text'); t.textContent = l.label;
        t.setAttribute('x', lx); t.setAttribute('y', ly); t.setAttribute('text-anchor', 'middle'); t.setAttribute('dominant-baseline', 'central');
        g.appendChild(t); svg.appendChild(g);
        var bb = t.getBBox(), rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', bb.x - 4); rect.setAttribute('y', bb.y - 2); rect.setAttribute('width', bb.width + 8); rect.setAttribute('height', bb.height + 4);
        g.insertBefore(rect, t);
        // Étiquette sans la place nécessaire entre deux éléments voisins : masquée (elle reste dans la version texte).
        if (p.length === 2 && Math.abs(p[0][1] - p[1][1]) < 1 && Math.abs(p[1][0] - p[0][0]) < bb.width + 12) g.style.display = 'none';
      }
    });
    var on = fig.querySelector('.dg-node[aria-pressed="true"]');
    if (on) highlight(fig, on.getAttribute('data-node'));
  }
  function highlight(fig, id) {
    fig.querySelectorAll('.dg__links [data-from]').forEach(function (el) {
      var hit = el.getAttribute('data-from') === id || el.getAttribute('data-to') === id;
      el.classList.toggle('is-on', hit && el.tagName === 'path');
      el.classList.toggle('is-dim', !hit);
    });
  }
  document.querySelectorAll('[data-dg]').forEach(function (fig) {
    var panel = fig.querySelector('.dg__panel');
    var body = fig.querySelector('.dg__body');
    var inner = panel.querySelector('.dg__panel-in');
    function activate(btn, moved) {
      var id = btn.getAttribute('data-node');
      var tpl = fig.querySelector('template[data-node="' + id + '"]');
      fig.querySelectorAll('.dg-node').forEach(function (n) { n.setAttribute('aria-pressed', n === btn ? 'true' : 'false'); });
      inner.innerHTML = '';
      inner.appendChild(tpl.content.cloneNode(true));
      if (mobile.matches && moved) btn.after(panel);
      highlight(fig, id);
    }
    fig.querySelectorAll('.dg-node').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () { if (!mobile.matches) activate(btn); });
      btn.addEventListener('focus', function () { activate(btn); });
      btn.addEventListener('click', function () { activate(btn, true); });
    });
    var redraw = function () {
      if (!mobile.matches && panel.parentNode !== body) body.appendChild(panel);
      drawSchema(fig);
    };
    if (window.ResizeObserver) new ResizeObserver(redraw).observe(fig.querySelector('.dg__canvas'));
    else window.addEventListener('resize', redraw);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
    redraw();
  });

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('nav');
  if (toggle && nav) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? T.close : T.menu;
  });

  // Recherche dans le texte
  var index = null, loading = null;
  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = fetch(EN ? '/en/search.json' : '/search.json').then(function (r) { return r.json(); }).then(function (d) {
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
        }).join('') : '<li class="search__empty">' + T.none + '</li>';
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
      btn.textContent = open ? T.hide : T.comment;
      if (!open || box.dataset.loaded) return;
      box.dataset.loaded = '1';
      if (!ready) {
        box.innerHTML = '<p class="comments__note">' + T.soon + '</p>';
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
        'data-theme': dark ? 'noborder_dark' : 'noborder_light', 'data-lang': EN ? 'en' : 'fr', 'data-loading': 'lazy'
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

  // Formulaire de contact : envoi sans quitter la page.
  document.querySelectorAll('.contact-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var status = f.querySelector('.contact-form__status'), btn = f.querySelector('button');
      btn.disabled = true; status.textContent = T.sending;
      fetch(f.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) { f.reset(); status.textContent = T.sent; }
          else { status.textContent = T.failed; }
        })
        .catch(function () { status.textContent = T.failed; })
        .then(function () { btn.disabled = false; });
    });
  });

  // Lien vers l'article : copie l'adresse.
  document.querySelectorAll('.js-permalink').forEach(function (a) {
    a.addEventListener('click', function () {
      var url = location.origin + location.pathname + a.getAttribute('href');
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () {
        var t = a.textContent; a.textContent = T.copied; setTimeout(function () { a.textContent = t; }, 1600);
      });
    });
  });
})();
