/* =====================================================================
   FIDÉLYS — script commun à toutes les pages
   ===================================================================== */

// ---------- Menu déroulant « Services » (desktop) ----------
(function () {
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;
  const bouton = dropdown.querySelector('.nav-dropdown-btn');

  bouton.addEventListener('click', (e) => {
    e.stopPropagation();
    const ouvert = dropdown.classList.toggle('open');
    bouton.setAttribute('aria-expanded', ouvert);
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      bouton.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      bouton.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ---------- Menu burger (mobile) ----------
(function () {
  const burger = document.querySelector('.nav-burger');
  const panneau = document.querySelector('.nav-mobile');
  if (!burger || !panneau) return;

  burger.addEventListener('click', () => {
    const ouvert = panneau.classList.toggle('open');
    burger.setAttribute('aria-expanded', ouvert);
  });

  // Fermer le menu après un clic sur un lien (utile pour les ancres)
  panneau.querySelectorAll('a').forEach((lien) => {
    lien.addEventListener('click', () => {
      panneau.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------- Barres animées du hero (accueil uniquement) ----------
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const nbBarres = 9;
  const conteneur = document.createElement('div');
  conteneur.className = 'hero-bars';

  for (let i = 0; i < nbBarres; i++) {
    const position = i / (nbBarres - 1);
    const distance = Math.abs(position - 0.5);
    const echelle = (30 + 70 * Math.pow(distance * 2, 1.2)) / 100;
    const barre = document.createElement('div');
    barre.className = 'hero-bar';
    barre.style.setProperty('--s', echelle);
    barre.style.animationDelay = (i * 0.12) + 's';
    conteneur.appendChild(barre);
  }

  hero.querySelector('.hero-bg').insertAdjacentElement('afterend', conteneur);
})();

// ---------- Apparition au scroll ----------
(function () {
  // .annotated : les annotations apparaissent une par une (délai en CSS via --i)
  const elements = document.querySelectorAll('.fade-up, .annotated, .iphone-annote');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  elements.forEach((el) => observer.observe(el));
})();

// ---------- Contact : pré-sélection du service via ?service=xxx ----------
(function () {
  const select = document.querySelector('select[name="service"]');
  if (!select) return;
  const service = new URLSearchParams(window.location.search).get('service');
  if (!service) return;
  const option = select.querySelector('option[data-slug="' + service + '"]');
  if (option) option.selected = true;
})();

// ---------- Formulaires Netlify : envoi sans rechargement + confirmation ----------
(function () {
  document.querySelectorAll('form[data-netlify="true"]').forEach((formulaire) => {
    formulaire.addEventListener('submit', async (e) => {
      e.preventDefault();
      const bouton = formulaire.querySelector('[type="submit"]');
      const erreur = formulaire.querySelector('.form-error');
      const succes = document.getElementById(formulaire.dataset.success);
      const texteBouton = bouton.textContent;

      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';
      if (erreur) erreur.classList.remove('visible');

      try {
        const donnees = new URLSearchParams(new FormData(formulaire)).toString();
        const reponse = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: donnees,
        });
        if (!reponse.ok) throw new Error('Statut ' + reponse.status);

        formulaire.style.display = 'none';
        if (succes) {
          succes.classList.add('visible');
          succes.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        if (erreur) erreur.classList.add('visible');
        bouton.disabled = false;
        bouton.textContent = texteBouton;
      }
    });
  });
})();
