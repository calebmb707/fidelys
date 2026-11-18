/*
 * Maison Garance — animations (couche optionnelle)
 * ---------------------------------------------------------------
 * Le site fonctionne entièrement sans ce fichier. Il ajoute :
 *  1. Reveal au scroll      → les cartes et blocs apparaissent quand on les atteint
 *  2. Parallaxe             → logo / titre de fiche qui s'effacent, assiettes qui flottent
 *  3. Suivi du curseur      → l'assiette d'une carte suit légèrement la souris
 *  4. Boutons « aimantés »  → « Laisser un avis » et le bouton retour attirent le curseur
 * Le survol (hover) est géré en CSS (section ANIMATIONS de style.css).
 *
 * Désactivé si « réduire les animations » est demandé par le système.
 * Les effets liés au curseur ne s'activent qu'avec une souris (pas au toucher).
 * Doit être chargé AVANT app.js (il écoute l'événement « garance:vue »).
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var avecSouris = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.documentElement.classList.add('anim');

  /* ---------- 1. Reveal au scroll ---------- */

  var observateur = new IntersectionObserver(function (entrees) {
    // Les éléments qui apparaissent ensemble sont échelonnés (70 ms d'écart, plafonné)
    var rang = 0;
    entrees.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--delai', Math.min(rang++, 4) * 0.07 + 's');
      e.target.classList.add('est-visible');
      observateur.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  function preparerReveal(racine, selecteur) {
    racine.querySelectorAll(selecteur).forEach(function (el) {
      if (el.classList.contains('est-visible')) return;
      el.classList.add('reveal');
      observateur.observe(el);
    });
  }

  /* ---------- 2. Parallaxe ---------- */

  var vue = 'menu';
  var logo = null;
  var photosCartes = [];
  var photoFiche = null;
  var enteteFiche = [];
  var enAttente = false;

  function fixe(n, d) { return n.toFixed(d); }

  function majParallaxe() {
    enAttente = false;
    var y = window.scrollY;
    var h = window.innerHeight;

    if (vue === 'menu') {
      // Le logo remonte plus lentement que la page et s'efface sous les onglets
      if (logo) {
        var t = Math.min(y, 320);
        logo.style.translate = '0 ' + fixe(t * 0.25, 1) + 'px';
        logo.style.opacity = fixe(1 - t / 320, 3);
      }
      // Chaque assiette flotte de ±8 px selon sa position dans l'écran
      photosCartes.forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.bottom < -40 || r.top > h + 40) return;
        var position = (r.top + r.height / 2) / h - 0.5; // -0,5 en haut … +0,5 en bas
        img.style.translate = '0 ' + fixe(-position * 16, 1) + 'px';
      });
    } else if (photoFiche) {
      // L'assiette tourne doucement et recule ; le titre glisse et s'efface
      var s = Math.min(y, 360);
      photoFiche.style.rotate = fixe(s * 0.06, 2) + 'deg';
      photoFiche.style.scale = fixe(1 - (s / 360) * 0.06, 3);
      enteteFiche.forEach(function (el) {
        el.style.translate = '0 ' + fixe(s * 0.3, 1) + 'px';
        el.style.opacity = fixe(Math.max(0, 1 - s / 220), 3);
      });
    }
  }

  function demanderMaj() {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(majParallaxe);
  }
  window.addEventListener('scroll', demanderMaj, { passive: true });
  window.addEventListener('resize', demanderMaj);

  /* ---------- 3. Suivi du curseur sur les cartes ---------- */

  function suivreCurseur(carte) {
    var img = carte.querySelector('.plat__photo');
    if (!img) return;
    carte.addEventListener('pointermove', function (e) {
      var r = carte.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = 'translate(' + fixe(x * 12, 1) + 'px,' + fixe(y * 10, 1) + 'px)';
    });
    carte.addEventListener('pointerleave', function () { img.style.transform = ''; });
  }

  /* ---------- 4. Boutons aimantés ---------- */

  function aimanter(el, force) {
    if (!el) return;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) * force;
      var dy = (e.clientY - (r.top + r.height / 2)) * force;
      el.style.translate = fixe(Math.max(-8, Math.min(8, dx)), 1) + 'px ' +
                           fixe(Math.max(-6, Math.min(6, dy)), 1) + 'px';
    });
    el.addEventListener('pointerleave', function () { el.style.translate = ''; });
  }

  /* ---------- Branchement sur les changements de vue ---------- */

  var menuPret = false;

  document.addEventListener('garance:vue', function (e) {
    vue = e.detail.vue;

    if (vue === 'menu' && !menuPret) {
      var menu = document.getElementById('vue-menu');
      preparerReveal(menu, '.section__titre, .plat, .infos, .bouton-avis');
      logo = menu.querySelector('.entete'); // tout l'en-tête bouge d'un bloc (pas de chevauchement)
      photosCartes = Array.prototype.slice.call(menu.querySelectorAll('.plat__photo'));
      if (avecSouris) {
        menu.querySelectorAll('.plat').forEach(suivreCurseur);
        aimanter(menu.querySelector('.bouton-avis'), 0.12);
      }
      menuPret = true;
    }

    if (vue === 'fiche') {
      // La fiche est reconstruite à chaque ouverture : on rebranche tout
      var fiche = document.getElementById('vue-fiche');
      photoFiche = fiche.querySelector('.fiche__photo');
      enteteFiche = Array.prototype.slice.call(fiche.querySelectorAll('.fiche__titre, .fiche__kcal'));
      fiche.querySelectorAll('.ingredient').forEach(function (li, i) { li.style.setProperty('--i', i); });
      preparerReveal(fiche, '.fiche__prix-ligne, .bloc, .ingredients, .fiche__corps > .credit');
      if (avecSouris) aimanter(fiche.querySelector('.retour'), 0.25);
    }

    majParallaxe();
  });
})();
