// Contenus fidèlement repris des six pages cours originales. Les données du catalogue restent dans ateliers.json.
export const programmes: Record<string, { introduction: string; objectifs: string[]; programme: { duree: string; titre: string; description: string }[] }> = {
  "css": {
    "introduction": "Apprenez à styliser vos pages web avec du CSS moderne. De la mise en page à la typographie, donnez vie à vos designs.",
    "objectifs": [
      "Comprendre le modèle de boîte CSS",
      "Maitriser les sélecteurs et la spécificité",
      "Créer des mises en page avec Flexbox et Grid",
      "Rendre un site responsive pour les mobiles"
    ],
    "programme": [
      {
        "duree": "45 min",
        "titre": "Bases et modèle de boîte",
        "description": "Couleurs, typographie, marges, remplissages et bordures."
      },
      {
        "duree": "45 min",
        "titre": "Mise en page moderne",
        "description": "Utilisation de Flexbox pour aligner les éléments facilement."
      },
      {
        "duree": "30 min",
        "titre": "Responsive Design",
        "description": "Media queries et unités relatives pour s'adapter à tous les écrans."
      }
    ]
  },
  "react": {
    "introduction": "Construisez des applications web dynamiques et robustes avec la bibliothèque React. De la création de composants à la gestion de l'état.",
    "objectifs": [
      "Comprendre la philosophie des composants React",
      "Maitriser le JSX et le rendu conditionnel",
      "Gérer l'état local avec le hook useState",
      "Passer des données via les props"
    ],
    "programme": [
      {
        "duree": "1 heure",
        "titre": "Composants et JSX",
        "description": "Définir des composants fonctionnels et écrire des interfaces avec JSX."
      },
      {
        "duree": "1 heure",
        "titre": "Props et données",
        "description": "Passer des informations de parents aux enfants et rendre des listes dynamiques."
      },
      {
        "duree": "1 heure",
        "titre": "État et événements",
        "description": "Gérer les clics, les formulaires et l'état local de l'application."
      }
    ]
  },
  "html": {
    "introduction": "Apprenez à structurer le contenu de vos pages web avec HTML5. Un atelier pratique idéal pour commencer votre parcours dans le développement web.",
    "objectifs": [
      "Comprendre le rôle du HTML dans une page web",
      "Maîtriser les balises de base (titres, paragraphes, liens, images)",
      "Structurer une page de manière sémantique",
      "Créer des formulaires interactifs"
    ],
    "programme": [
      {
        "duree": "30 min",
        "titre": "Introduction au Web et au HTML",
        "description": "Fonctionnement du web, syntaxe des balises et structure globale d'un document."
      },
      {
        "duree": "45 min",
        "titre": "Sémantique et textes",
        "description": "Hiérarchie des titres, paragraphes, citations et formatage de texte."
      },
      {
        "duree": "45 min",
        "titre": "Médias et liens",
        "description": "Intégrer des images, des vidéos et créer des liens internes et externes."
      }
    ]
  },
  "ux": {
    "introduction": "Créez des interfaces intuitives et agréables à utiliser en comprenant les besoins de vos utilisateurs et les bonnes pratiques de design.",
    "objectifs": [
      "Comprendre la différence et la complémentarité entre l'UX et l'UI",
      "Mener une recherche utilisateur basique",
      "Créer des wireframes et des prototypes",
      "Appliquer les principes de hiérarchie visuelle"
    ],
    "programme": [
      {
        "duree": "1 h 30",
        "titre": "Introduction à l'UX Design",
        "description": "Empathie utilisateur, personas, parcours utilisateur et recherche."
      },
      {
        "duree": "1 h 30",
        "titre": "Principes d'UI Design",
        "description": "Théorie des couleurs, typographie, espacements et cohérence visuelle."
      },
      {
        "duree": "1 heure",
        "titre": "Prototypage",
        "description": "Création de wireframes et de maquettes interactives simples."
      }
    ]
  },
  "a11y": {
    "introduction": "Rendez vos sites web utilisables par tous, y compris les personnes en situation de handicap, en appliquant les normes WCAG.",
    "objectifs": [
      "Comprendre les différents types de handicaps",
      "Maitriser les attributs ARIA de base",
      "Structurer l'information de manière sémantique",
      "Tester l'accessibilité avec le clavier et les lecteurs d'écran"
    ],
    "programme": [
      {
        "duree": "45 min",
        "titre": "Sémantique et structure",
        "description": "L'importance des balises natives (nav, main, button) pour la navigation."
      },
      {
        "duree": "45 min",
        "titre": "Couleurs et contrastes",
        "description": "Choisir des palettes accessibles et assurer la lisibilité du contenu."
      },
      {
        "duree": "30 min",
        "titre": "Tests et ARIA",
        "description": "Découvrir les lecteurs d'écran, naviguer au clavier et ajouter les attributs ARIA pertinents."
      }
    ]
  },
  "javascript": {
    "introduction": "Découvrez comment ajouter des interactions à une page web. Un atelier pensé pour ceux qui ont déjà des bases en HTML.",
    "objectifs": [
      "Comprendre les concepts de base (variables, fonctions, boucles)",
      "Manipuler le DOM pour interagir avec la page",
      "Gérer les événements (clics, survols, soumissions)",
      "Créer des animations simples"
    ],
    "programme": [
      {
        "duree": "1 heure",
        "titre": "Introduction et logique",
        "description": "Déclarer des variables, utiliser des conditions et créer des fonctions réutilisables."
      },
      {
        "duree": "1 heure",
        "titre": "Manipulation du DOM",
        "description": "Sélectionner des éléments HTML, modifier leurs styles et leur contenu dynamiquement."
      },
      {
        "duree": "1 heure",
        "titre": "Événements",
        "description": "Rendre la page interactive en répondant aux actions de l'utilisateur."
      }
    ]
  }
}
