# SkillHub

SkillHub est une application front-end statique consacrée à la découverte et au partage de compétences à travers des ateliers. Ce projet fil rouge a été réalisé en HTML, CSS et JavaScript, avec une attention particulière portée à la performance, au responsive design et à l’accessibilité.

## Objectifs du projet

- Structurer une page avec du HTML sémantique.
- Créer une interface responsive adaptée aux différentes tailles d’écran.
- Optimiser les images, les polices et les performances.
- Respecter les principales règles d’accessibilité.
- Ajouter des interactions accessibles en JavaScript natif.

## Fonctionnalités

- Navigation vers les différentes sections de la page.
- Menu responsive contrôlé en JavaScript.
- Fenêtre modale créée avec l’élément HTML `<dialog>`.
- Création de compte et connexion avec validation personnalisée.
- Session simulée, inscription protégée aux ateliers et espace utilisateur.
- Formulaire de contact de démonstration conservé sur l’accueil.
- Messages d’erreur accessibles aux lecteurs d’écran.
- Navigation complète au clavier.

## Technologies utilisées

- HTML5 pour la structure sémantique.
- CSS3 pour la mise en page, le responsive design et les états visuels.
- JavaScript natif pour les interactions.
- Figma pour la préparation de la maquette et des composants.
- Git et GitHub pour le suivi des versions et la publication.

## Consulter le projet

Le site est disponible en ligne à l’adresse suivante :

[Voir SkillHub en ligne](https://jrbala.github.io/skillhub/)

## Organisation du projet

```text
skillhub/
├── .github/
│   └── workflows/
├── docs/
│   ├── preuves/
│   ├── rapports/
│   ├── rapport-fm01.md
│   ├── rapport-fm02.md
│   └── tp1-ux.md
├── maquettes/
│   └── maquette-skillhub.png
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   ├── css/
│   │   └── base.css
│   ├── js/
│   │   ├── main.js
│   │   ├── stockage.js
│   │   └── compte.js
│   ├── index.html
│   ├── inscription.html
│   ├── connexion.html
│   └── profil.html
└── README.md
```

## Rapports

- [Rapport FM01 — Développement d’interfaces front-end](docs/rapport-fm01.md)
- [Rapport FM02 — Ergonomie, UX/UI et accessibilité](docs/rapport-fm02.md)

## Utiliser les comptes de démonstration

1. Consultez les deux ateliers : nom, description, niveau, durée, horaires, modalité et prix sont affichés sur chaque carte.
2. Cliquez sur « S’inscrire ». Sans session, l’atelier est mémorisé et vous arrivez sur `connexion.html`.
3. Utilisez le lien « Créer mon compte » sous le formulaire si nécessaire. Nom, adresse e-mail, mot de passe d’au moins huit caractères et confirmation sont obligatoires. Les adresses sont normalisées en minuscules et les doublons sont refusés.
4. Après la création du compte, connectez-vous. Le profil propose de confirmer ou d’annuler l’atelier en attente en rappelant son nom et son prix. Sans atelier en attente, il affiche simplement votre espace.
5. Si vous êtes déjà connecté, « S’inscrire » enregistre directement l’atelier et affiche une confirmation accessible. Une seconde inscription au même atelier est refusée.
6. « Mon espace » présente votre nom, votre adresse, le nombre d’inscriptions et vos ateliers avec leurs prix. « Se désinscrire » ouvre une confirmation avant de retirer uniquement votre inscription à cet atelier. Vous pouvez ensuite vous inscrire à nouveau. « Se déconnecter » supprime seulement la session et revient à l’accueil. Les comptes et inscriptions restent disponibles après une nouvelle connexion.

Le contexte d’inscription est transmis par le paramètre relatif `?atelier=html` ou `?atelier=javascript` et vérifié avec le choix enregistré. Une visite directe de la connexion ou de la création de compte, notamment par le menu du site, ne reprend pas un ancien atelier conservé dans localStorage. Les liens sous les formulaires conservent le parcours en cours.

Le formulaire historique de l’accueil reste une démonstration de validation : il ne crée ni compte ni inscription à un atelier. Le dialog du prochain atelier est conservé et permet désormais de rejoindre le même parcours d’inscription.

## Stockage local et limites de sécurité

| Clé localStorage | Valeur JSON |
|---|---|
| `skillhub_utilisateurs` | Liste `{ id, nom, email, hash }` ; `hash` contient le SHA-256 hexadécimal du mot de passe. |
| `skillhub_session` | Objet `{ utilisateurId }` qui référence un compte existant. |
| `skillhub_inscriptions` | Liste `{ utilisateurId, atelierId, date }` ; date ISO, ateliers `html` ou `javascript`. |
| `skillhub_atelier_en_attente` | Identifiant de l’atelier choisi avant connexion ; retiré après confirmation ou annulation. |

Les fonctions réutilisables sont regroupées dans `src/js/stockage.js`. Les données absentes, le JSON invalide et les structures inattendues sont traités sans interrompre la page. Une écriture impossible affiche une erreur au lieu d’annoncer une réussite. Les données utilisateur sont affichées avec `textContent`, jamais avec `innerHTML`.

**Il ne s’agit pas d’une authentification sécurisée pour la production.** Le mot de passe n’est pas stocké en clair : la Web Crypto API calcule son hash SHA-256 avant l’enregistrement. Cependant, un SHA-256 simple, sans sel ni fonction de dérivation adaptée aux mots de passe, ne protège pas suffisamment les mots de passe. Tout le stockage et tout le code restent consultables et modifiables dans le navigateur. La session peut être falsifiée et la protection du profil est uniquement une simulation d’interface. Un backend avec validation serveur, stockage adapté des mots de passe et gestion sécurisée des sessions est nécessaire pour une véritable authentification.

Utilisez exclusivement des données fictives et un mot de passe jetable. Aucun e-mail, paiement ou réservation réelle n’est envoyé. Les données appartiennent au navigateur et à l’origine du site, pas à un compte distant : elles ne sont pas synchronisées entre appareils, peuvent disparaître à l’effacement du stockage et sont accessibles aux autres pages de la même origine. La session persiste jusqu’à la déconnexion ; elle ne dispose pas d’expiration. Les écritures simultanées de plusieurs onglets ne sont pas transactionnelles.

## Exécution locale et GitHub Pages

Aucune installation, dépendance ou étape de compilation n’est nécessaire. Depuis la racine du dépôt :

```sh
python3 -m http.server 8000 --directory src
```

Ouvrez `http://localhost:8000/`. Utilisez localhost ou HTTPS : la Web Crypto API nécessite un contexte sécurisé. L’ouverture directe en `file://` n’est pas le mode de test pris en charge. JavaScript et localStorage doivent être disponibles.

Le workflow existant `.github/workflows/static.yml` publie directement `src`. Les liens entre pages, scripts, CSS et médias sont relatifs : ils fonctionnent sous le préfixe `/skillhub/` de GitHub Pages, sans routeur ni règle de réécriture. Les modifications locales ne seront visibles en ligne qu’après une publication ultérieure ; aucun commit ni push n’a été effectué pour cette évolution.

## Vérification de cette évolution

Voir [le compte rendu des tests de la simulation](docs/verification-comptes.md). Les anciens rapports Lighthouse, WAVE, captures et preuves sont conservés et décrivent leurs versions historiques ; ils ne constituent pas une nouvelle certification de cette version.
