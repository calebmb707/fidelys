# Menu NFC — Maison Garance

Site statique (HTML/CSS/JS vanilla, aucune dépendance, aucun build).

```
site/
├── index.html          Structure de la page (menu + fiche)
├── css/style.css       Styles (couleurs en variables dans :root)
├── js/menu-data.js     ← LA CARTE : plats, prix, allergènes, horaires, contact
├── js/app.js           Rendu et navigation (#/ = menu, #/<id> = fiche)
├── assets/             Logo + favicon
└── img/
    ├── plats/          photo-<id>.webp (vignette) · fiche-<id>.webp (grande photo)
    └── ingredients/    une image par ingrédient
```

## Modifier la carte
Tout se fait dans `js/menu-data.js`. Pour un nouveau plat : copier un bloc, changer l'`id`,
ajouter `img/plats/photo-<id>.webp` et `img/plats/fiche-<id>.webp` (carré, fond transparent, ~500 px).

Réglages d'affichage (`affichage`) :
- `allergenesSurMenu` : ligne « Allergènes : … » sous chaque plat
- `styleAllergenes` : `'pastilles'` ou `'bandeau'`

## Tester en local
Double-cliquer sur `index.html` suffit.

## Mise en ligne
Déposer le dossier `site/` tel quel sur n'importe quel hébergement statique
(Netlify, Vercel, GitHub Pages, OVH…). La puce NFC pointe vers l'URL racine.
Lien direct vers un plat : `https://…/#/veloute`.
