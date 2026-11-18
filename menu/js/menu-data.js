/*
 * Données du menu — Maison Garance
 * ---------------------------------------------------------------
 * C'EST LE SEUL FICHIER À MODIFIER pour changer la carte.
 *
 * Ajouter un plat : copier un bloc { ... } dans la bonne catégorie,
 * changer l'id (unique, sans espace ni accent) et déposer les photos :
 *   img/plats/photo-<id>.webp   → vignette sur le menu (carré, fond transparent)
 *   img/plats/fiche-<id>.webp   → grande photo de la fiche (carré, fond transparent)
 *   img/ingredients/<image>.webp → une image par ingrédient
 */
window.MENU_DATA = {
  restaurant: {
    nom: 'Maison Garance',
    sousTitre: 'Cuisine française de saison · Le Havre',
    horaires: ['Du mardi au samedi', '12h – 14h30 · 19h – 22h30'],
    // TODO : numéro et adresse à confirmer avec le client
    telephoneAffiche: '01 42 00 00 00',
    telephoneLien: '+33142000000',
    adresse: '12 rue des Martyrs, 76610 Le Havre',
    // TODO : remplacer par le lien direct d'avis Google (fiche Google Business → « Demander des avis »)
    lienAvis: 'https://www.google.com/search?q=Maison+Garance+Le+Havre+avis',
    credit: 'Réalisé par Fidélys'
  },

  affichage: {
    // Afficher la ligne « Allergènes : … » sous chaque plat du menu
    allergenesSurMenu: true,
    // 'pastilles' (badges verts clairs) ou 'bandeau' (encart vert plein)
    styleAllergenes: 'pastilles'
  },

  categories: [
    {
      id: 'entrees',
      onglet: 'Entrées',
      titre: ['Les', 'Entrées'], // [article, mot souligné]
      plats: [
        {
          id: 'veloute',
          nom: 'Velouté de potimarron',
          accroche: 'Huile de noisette',
          prix: 9,
          kcal: 280,
          vegetarien: true,
          description: "Le potimarron est rôti au four puis mixé longuement avec un trait de crème, jusqu'à obtenir un velouté soyeux au goût de châtaigne. Quelques gouttes d'huile de noisette, versées au dernier moment, lui donnent une note grillée et profonde.",
          ingredients: [
            ['ing-veloute-potimarron', 'Potimarron'],
            ['ing-veloute-creme', 'Crème'],
            ['ing-veloute-noisette', 'Huile de noisette'],
            ['ing-veloute-oignon', 'Oignon']
          ],
          allergenes: ['Lait', 'Fruits à coque'],
          options: []
        },
        {
          id: 'oeuf',
          nom: 'Œuf parfait',
          accroche: 'Lard fumé, crème de champignons',
          prix: 11,
          kcal: 390,
          vegetarien: false,
          description: "Un œuf cuit une heure à 64 °C, au jaune coulant et au blanc à peine pris. Il repose sur une crème de champignons de Paris, relevée de lardons fumés juste croustillants. On le crève à la cuillère et tout se mélange.",
          ingredients: [
            ['ing-oeuf-oeuf', 'Œuf'],
            ['ing-oeuf-lard', 'Lard fumé'],
            ['ing-oeuf-champignons', 'Champignons'],
            ['ing-oeuf-creme', 'Crème']
          ],
          allergenes: ['Œuf', 'Lait'],
          options: []
        }
      ]
    },
    {
      id: 'plats',
      onglet: 'Plats',
      titre: ['Les', 'Plats'],
      plats: [
        {
          id: 'supreme',
          nom: 'Suprême de volaille fermière',
          accroche: "Jus corsé, purée à l'huile d'olive",
          prix: 22,
          kcal: 640,
          vegetarien: false,
          description: "Une volaille fermière rôtie côté peau jusqu'à ce qu'elle croustille, la chair restée tendre et juteuse. On la nappe d'un jus corsé, longuement réduit avec les sucs de cuisson et une garniture aromatique. À côté, une purée lisse montée à l'huile d'olive, avec ce qu'il faut de beurre pour être réconfortante.",
          ingredients: [
            ['ing-volaille', 'Volaille'],
            ['ing-pdt', 'Pomme de terre'],
            ['ing-huile', "Huile d'olive"],
            ['ing-celeri', 'Céleri'],
            ['ing-thym', 'Thym']
          ],
          allergenes: ['Lait', 'Céleri'],
          options: [
            ['Cuisson', 'Rosée ou à cœur'],
            ['Accompagnement', 'Purée ou légumes rôtis']
          ]
        },
        {
          id: 'risotto',
          nom: 'Risotto de courge butternut',
          accroche: 'Noisettes torréfiées, parmesan',
          prix: 18,
          kcal: 590,
          vegetarien: true,
          description: "Un riz carnaroli cuit lentement dans un bouillon de légumes, déglacé au vin blanc, puis lié au beurre et au parmesan. La courge butternut y fond en partie et lui donne sa douceur ; des noisettes torréfiées apportent le croquant.",
          ingredients: [
            ['ing-risotto-riz', 'Riz carnaroli'],
            ['ing-risotto-butternut', 'Butternut'],
            ['ing-risotto-noisettes', 'Noisettes'],
            ['ing-risotto-parmesan', 'Parmesan'],
            ['ing-risotto-vin', 'Vin blanc']
          ],
          allergenes: ['Lait', 'Fruits à coque', 'Sulfites'],
          options: [
            ['Parmesan', 'Sans parmesan sur demande']
          ]
        }
      ]
    },
    {
      id: 'desserts',
      onglet: 'Desserts',
      titre: ['Le', 'Dessert'],
      plats: [
        {
          id: 'tarte',
          nom: 'Tarte fine aux pommes',
          accroche: 'Glace vanille',
          prix: 8,
          kcal: 420,
          vegetarien: false,
          description: "Une pâte feuilletée très fine, couverte de lamelles de pommes disposées en rosace et caramélisées au four. Elle arrive tiède, avec une boule de glace vanille qui fond doucement dessus.",
          ingredients: [
            ['ing-tarte-pommes', 'Pommes'],
            ['ing-tarte-pate', 'Pâte feuilletée'],
            ['ing-tarte-vanille', 'Glace vanille'],
            ['ing-tarte-beurre', 'Beurre']
          ],
          allergenes: ['Gluten', 'Lait', 'Œuf'],
          options: []
        }
      ]
    }
  ]
};
