/*!
 * Eventur – site JavaScript
 *
 * Ingen afhængigheder. Håndterer menu, header ved scroll, afsløring af indhold,
 * lysboks til billeder og video, galleri-filtre og formularer, der åbner
 * brugerens e-mailklient (sitet har ingen backend).
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ICONS = {
    luk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    venstre: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    hoejre: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>'
  };

  // ---------- Menu ----------
  function initMenu() {
    var burger = document.querySelector('.burger');
    if (!burger) return;
    var body = document.body;

    function saet(aaben) {
      body.classList.toggle('menu-aaben', aaben);
      burger.setAttribute('aria-expanded', String(aaben));
      burger.setAttribute('aria-label', aaben ? 'Luk menu' : 'Åbn menu');
    }
    burger.addEventListener('click', function () { saet(!body.classList.contains('menu-aaben')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') saet(false); });
    document.querySelectorAll('.menu a').forEach(function (a) { a.addEventListener('click', function () { saet(false); }); });

    // Marker den aktive side ud fra body[data-section]
    var section = body.getAttribute('data-section');
    if (section) {
      var aktiv = document.querySelector('.menu a[data-nav="' + section + '"]');
      if (aktiv) aktiv.setAttribute('aria-current', 'page');
    }
  }

  // ---------- Header skifter udseende, når man scroller ----------
  function initHeader() {
    var top = document.querySelector('.top');
    if (!top) return;
    var opdater = function () { top.classList.toggle('er-scrollet', window.scrollY > 40); };
    opdater();
    window.addEventListener('scroll', opdater, { passive: true });
  }

  // ---------- Afsløring ved scroll ----------
  function initAfsloer() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.afsloer'));
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('vist'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('vist');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { obs.observe(el); });
  }

  // ---------- Lysboks ----------
  function lavLysboks() {
    var dlg = document.createElement('dialog');
    dlg.className = 'lysboks';
    dlg.setAttribute('aria-label', 'Billedvisning');
    dlg.innerHTML =
      '<figure><div class="lysboks__indhold"></div><figcaption></figcaption></figure>' +
      '<button type="button" class="luk" aria-label="Luk">' + ICONS.luk + '</button>' +
      '<button type="button" class="forrige" aria-label="Forrige billede">' + ICONS.venstre + '</button>' +
      '<button type="button" class="naeste" aria-label="Næste billede">' + ICONS.hoejre + '</button>';
    document.body.appendChild(dlg);
    return dlg;
  }

  function initLysboks() {
    var links = document.querySelectorAll('[data-lysboks], [data-video]');
    if (!links.length || typeof HTMLDialogElement !== 'function') return;

    var dlg = lavLysboks();
    var indhold = dlg.querySelector('.lysboks__indhold');
    var tekst = dlg.querySelector('figcaption');
    var forrige = dlg.querySelector('.forrige');
    var naeste = dlg.querySelector('.naeste');
    var gruppe = [];
    var idx = 0;

    function synlige(navn) {
      return Array.prototype.slice.call(document.querySelectorAll('[data-lysboks="' + navn + '"]'))
        .filter(function (a) { return !a.hidden; });
    }

    function vis(i) {
      idx = (i + gruppe.length) % gruppe.length;
      var a = gruppe[idx];
      var img = a.querySelector('img');
      var alt = img ? img.getAttribute('alt') : '';
      indhold.innerHTML = '';
      var stort = document.createElement('img');
      stort.src = a.getAttribute('href');
      stort.alt = alt || '';
      indhold.appendChild(stort);
      tekst.textContent = a.getAttribute('data-note') || '';
    }

    function luk() {
      var v = indhold.querySelector('video');
      if (v) v.pause();
      dlg.close();
    }

    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-lysboks], [data-video]');
      if (!a) return;
      e.preventDefault();

      if (a.hasAttribute('data-video')) {
        gruppe = [];
        forrige.hidden = naeste.hidden = true;
        indhold.innerHTML = '';
        var v = document.createElement('video');
        v.src = a.getAttribute('data-video');
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        indhold.appendChild(v);
        tekst.textContent = a.getAttribute('data-note') || '';
      } else {
        gruppe = synlige(a.getAttribute('data-lysboks'));
        forrige.hidden = naeste.hidden = gruppe.length < 2;
        vis(gruppe.indexOf(a));
      }
      dlg.showModal();
    });

    forrige.addEventListener('click', function () { vis(idx - 1); });
    naeste.addEventListener('click', function () { vis(idx + 1); });
    dlg.querySelector('.luk').addEventListener('click', luk);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) luk(); });
    dlg.addEventListener('close', function () { indhold.innerHTML = ''; });
    dlg.addEventListener('keydown', function (e) {
      if (!gruppe.length) return;
      if (e.key === 'ArrowLeft') vis(idx - 1);
      if (e.key === 'ArrowRight') vis(idx + 1);
    });
  }

  // ---------- Galleri-filtre ----------
  function initFiltre() {
    var knapper = document.querySelectorAll('.filtre button');
    if (!knapper.length) return;
    var billeder = document.querySelectorAll('.galleri [data-emne]');
    knapper.forEach(function (knap) {
      knap.addEventListener('click', function () {
        var emne = knap.getAttribute('data-filter');
        knapper.forEach(function (k) { k.setAttribute('aria-pressed', String(k === knap)); });
        billeder.forEach(function (b) {
          b.hidden = emne !== 'alle' && b.getAttribute('data-emne').split(' ').indexOf(emne) === -1;
        });
      });
    });
  }

  // ---------- Formularer (mailto) ----------
  function initFormularer() {
    document.querySelectorAll('form[data-mailto-form]').forEach(function (form) {
      var status = form.querySelector('.formular__status');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var mangler = [];
        Array.prototype.forEach.call(form.elements, function (el) {
          if (!el.name) return;
          var ugyldig = !el.checkValidity();
          el.setAttribute('aria-invalid', String(ugyldig));
          if (ugyldig) mangler.push(el);
        });
        if (mangler.length) {
          if (status) {
            status.className = 'formular__status fejl';
            status.textContent = 'Udfyld lige de markerede felter – så er vi klar.';
          }
          mangler[0].focus();
          return;
        }
        var linjer = [];
        Array.prototype.forEach.call(form.elements, function (el) {
          if (el.name && el.value) linjer.push(el.name + ': ' + el.value);
        });
        var til = form.getAttribute('data-mailto-form');
        var emne = form.getAttribute('data-subject') || 'Henvendelse fra eventur';
        window.location.href = 'mailto:' + til + '?subject=' + encodeURIComponent(emne) +
          '&body=' + encodeURIComponent(linjer.join('\n'));
        if (status) {
          status.className = 'formular__status ok';
          status.textContent = 'Din mailklient åbner nu med beskeden. Tryk send dér – så ses vi i skoven!';
        }
      });
    });
  }

  function initAarstal() {
    document.querySelectorAll('[data-current-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHeader();
    initAfsloer();
    initLysboks();
    initFiltre();
    initFormularer();
    initAarstal();
  });
})();
