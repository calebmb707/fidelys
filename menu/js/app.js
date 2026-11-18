/*
 * Maison Garance — rendu du menu et des fiches plats.
 * Navigation par ancre : #/          → menu
 *                        #/<id-plat> → fiche du plat
 * Aucune dépendance. Fonctionne aussi en ouvrant index.html en local.
 */
(function () {
  'use strict';

  var DATA = window.MENU_DATA;
  var R = DATA.restaurant;
  var reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var vueMenu = document.getElementById('vue-menu');
  var vueFiche = document.getElementById('vue-fiche');
  var nav = document.querySelector('.onglets');
  var conteneurSections = document.getElementById('sections');

  // Index des plats par id
  var plats = {};
  DATA.categories.forEach(function (c) {
    c.plats.forEach(function (p) { plats[p.id] = p; });
  });

  var scrollMenu = 0;        // position du menu à restaurer au retour
  var ficheDepuisMenu = false; // la fiche a-t-elle été ouverte depuis le menu ?

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Utilitaires ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function prix(n) { return esc(n) + ' €'; }
  function minuscule(s) { return s.toLocaleLowerCase('fr-FR'); }

  var VAGUE = '<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M2 8 C 22 4, 48 10, 70 6 S 92 4, 98 6"/></svg>';
  var VAGUE_ONGLET = '<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M2 7 C 30 3, 60 9, 98 5"/></svg>';

  function souligne(mot) { return '<span class="vague">' + esc(mot) + VAGUE + '</span>'; }

  /* ---------- Menu ---------- */

  function rendreInfos() {
    document.querySelector('[data-champ="sousTitre"]').textContent = R.sousTitre;
    document.querySelector('[data-champ="horaires"]').innerHTML = R.horaires.map(esc).join('<br>');

    var tel = document.querySelector('[data-champ="telephone"]');
    tel.textContent = R.telephoneAffiche;
    tel.href = 'tel:' + R.telephoneLien;

    var adr = document.querySelector('[data-champ="adresse"]');
    adr.textContent = R.adresse;
    adr.href = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(R.nom + ', ' + R.adresse);

    document.querySelector('[data-champ="avis"]').href = R.lienAvis;
    document.querySelector('[data-champ="credit"]').textContent = R.credit;
  }

  function rendreCarte(p, index) {
    // Les 2 premières photos sont visibles dès l'ouverture : pas de lazy-load
    var chargement = index < 2 ? 'eager' : 'lazy';
    var allergenes = DATA.affichage.allergenesSurMenu && p.allergenes.length
      ? '<p class="plat__allergenes">Allergènes : ' + esc(p.allergenes.map(minuscule).join(', ')) + '</p>'
      : '';

    return '<a class="carte plat" href="#/' + esc(p.id) + '">' +
      '<img class="plat__photo" src="img/plats/photo-' + esc(p.id) + '.webp" alt="" width="150" height="150" loading="' + chargement + '">' +
      '<h3 class="plat__nom">' + esc(p.nom) + '</h3>' +
      '<p class="plat__accroche">' + esc(p.accroche) + '</p>' +
      '<div class="plat__ligne">' +
        '<span class="plat__prix">' + prix(p.prix) + '</span>' +
        '<span class="plat__voir" aria-hidden="true">Voir la fiche <span class="plat__fleche">→</span></span>' +
        (p.vegetarien ? '<span class="badge-veg">Végétarien</span>' : '') +
      '</div>' +
      allergenes +
    '</a>';
  }

  function rendreMenu() {
    var compteur = 0;

    nav.innerHTML = DATA.categories.map(function (c, i) {
      return '<button class="onglet" type="button" data-cible="' + esc(c.id) + '"' +
        (i === 0 ? ' aria-current="true"' : '') + '>' + esc(c.onglet) + VAGUE_ONGLET + '</button>';
    }).join('');

    conteneurSections.innerHTML = DATA.categories.map(function (c) {
      return '<section class="section" id="' + esc(c.id) + '" aria-labelledby="titre-' + esc(c.id) + '">' +
        '<h2 class="section__titre" id="titre-' + esc(c.id) + '">' + esc(c.titre[0]) + ' ' + souligne(c.titre[1]) + '</h2>' +
        '<div class="section__liste">' +
          c.plats.map(function (p) { return rendreCarte(p, compteur++); }).join('') +
        '</div>' +
      '</section>';
    }).join('');

    nav.addEventListener('click', function (e) {
      var b = e.target.closest('.onglet');
      if (!b) return;
      var s = document.getElementById(b.dataset.cible);
      var navH = nav.offsetHeight;
      window.scrollTo({
        top: s.getBoundingClientRect().top + window.scrollY - navH + 4,
        behavior: reduireAnimations ? 'auto' : 'smooth'
      });
    });
  }

  /* Onglet actif selon la section visible */
  var sections = [];
  var ongletActif = null;

  function majOngletActif() {
    if (vueMenu.hidden) return;
    var seuil = nav.offsetHeight + 40;
    var actif = sections[0];
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= seuil) actif = s;
    });
    // En bas de page, la dernière section (courte) devient active
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
      actif = sections[sections.length - 1];
    }
    if (actif && actif.id !== ongletActif) {
      ongletActif = actif.id;
      nav.querySelectorAll('.onglet').forEach(function (b) {
        if (b.dataset.cible === actif.id) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }
  }

  var tick = false;
  window.addEventListener('scroll', function () {
    if (tick) return;
    tick = true;
    requestAnimationFrame(function () { tick = false; majOngletActif(); });
  }, { passive: true });

  /* ---------- Fiche plat ---------- */

  function rendreAllergenes(p) {
    if (!p.allergenes.length) {
      return '<p class="bloc__texte">Ce plat ne contient aucun des 14 allergènes majeurs.</p>';
    }
    var note = '<p class="bloc__note">Une allergie ou une intolérance ? Signalez-la au serveur au moment de commander.</p>';

    if (DATA.affichage.styleAllergenes === 'bandeau') {
      return '<div class="allergenes allergenes--bandeau">' +
        '<p class="allergenes__intro">Contient</p>' +
        '<p class="allergenes__texte">' + esc(p.allergenes.join(' · ')) + '</p>' + note +
      '</div>';
    }
    return '<div class="carte allergenes">' +
      '<p class="allergenes__intro">Ce plat contient :</p>' +
      '<ul class="allergenes__liste">' + p.allergenes.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
      note +
    '</div>';
  }

  function rendreFiche(p) {
    var options = p.options.length
      ? '<section class="bloc">' +
          '<h2 class="bloc__titre">Options de la cuisine</h2>' +
          '<dl class="carte options">' + p.options.map(function (o) {
            return '<div class="option"><dt>' + esc(o[0]) + '</dt><dd>' + esc(o[1]) + '</dd></div>';
          }).join('') + '</dl>' +
          '<p class="bloc__note">Indiquez votre préférence au serveur.</p>' +
        '</section>'
      : '';

    vueFiche.innerHTML =
      '<header class="fiche__hero">' +
        '<h1 class="fiche__titre" tabindex="-1">' + esc(p.nom) + '</h1>' +
        '<p class="fiche__kcal">' + esc(p.kcal) + ' kcal</p>' +
        '<img class="fiche__photo" src="img/plats/fiche-' + esc(p.id) + '.webp" alt="' + esc(p.nom) + '" width="270" height="270" fetchpriority="high">' +
      '</header>' +
      '<div class="fiche__corps">' +
        '<div class="fiche__prix-ligne">' +
          '<span class="fiche__prix">' + prix(p.prix) + '</span>' +
          (p.vegetarien ? '<span class="badge-veg">Végétarien</span>' : '') +
        '</div>' +
        '<section class="bloc">' +
          '<h2 class="bloc__titre">Description</h2>' +
          '<p class="bloc__texte">' + esc(p.description) + '</p>' +
        '</section>' +
        '<section class="bloc">' +
          '<h2 class="bloc__titre">Ingrédients</h2>' +
          '<ul class="ingredients">' + p.ingredients.map(function (ing) {
            return '<li class="ingredient">' +
              '<img class="ingredient__image" src="img/ingredients/' + esc(ing[0]) + '.webp" alt="" width="66" height="66" loading="lazy">' +
              '<span class="ingredient__nom">' + esc(ing[1]) + '</span>' +
            '</li>';
          }).join('') + '</ul>' +
        '</section>' +
        '<section class="bloc">' +
          '<h2 class="bloc__titre">' + souligne('Allergènes') + '</h2>' +
          rendreAllergenes(p) +
        '</section>' +
        options +
        '<p class="credit">' + esc(R.credit) + '</p>' +
      '</div>' +
      '<div class="fiche__fondu" aria-hidden="true"></div>' +
      '<button class="retour" type="button" aria-label="Retour au menu"><span></span><span></span><span></span></button>';

    vueFiche.querySelector('.retour').addEventListener('click', retourMenu);
  }

  function retourMenu() {
    // Si on vient du menu, on revient en arrière (le bouton retour du téléphone reste cohérent)
    if (ficheDepuisMenu) history.back();
    else location.hash = '#/';
  }

  /* ---------- Routage ---------- */

  function idDepuisHash() {
    var m = /^#\/([\w-]+)$/.exec(location.hash);
    return m && plats[m[1]] ? m[1] : null;
  }

  function router() {
    var id = idDepuisHash();

    if (id) {
      if (!vueMenu.hidden) {
        scrollMenu = window.scrollY;
        ficheDepuisMenu = true;
      }
      var p = plats[id];
      rendreFiche(p);
      vueMenu.hidden = true;
      vueFiche.hidden = false;
      document.title = p.nom + ' — ' + R.nom;
      window.scrollTo(0, 0);
      vueFiche.querySelector('.fiche__titre').focus({ preventScroll: true });
    } else {
      var depuisFiche = !vueFiche.hidden;
      vueFiche.hidden = true;
      vueFiche.innerHTML = '';
      vueMenu.hidden = false;
      document.title = R.nom + ' — La carte';
      window.scrollTo(0, depuisFiche ? scrollMenu : 0);
      ficheDepuisMenu = false;
      majOngletActif();
    }

    // Prévient js/animations.js (reveal, parallaxe…) qu'une vue vient d'être affichée
    document.dispatchEvent(new CustomEvent('garance:vue', { detail: { vue: id ? 'fiche' : 'menu' } }));
  }

  /* ---------- Démarrage ---------- */

  rendreInfos();
  rendreMenu();
  sections = Array.prototype.slice.call(conteneurSections.querySelectorAll('.section'));
  window.addEventListener('hashchange', router);
  router();
})();
