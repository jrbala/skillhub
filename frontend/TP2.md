# Travail du 30/10 — Tout en React

Depuis `frontend/` : `npm install`, `npm run dev`. Production : `npm run build`,
puis `npm run preview`. Utiliser le port affiché par Vite. Vérifications :
`npx tsc -b` et `npm run lint`.

## Fichiers et réemploi du TP1

Modifiés : `package.json`, `package-lock.json` (React Router), `index.html`
(description), `vite.config.ts` (images originales), `src/App.tsx`,
`src/components/CarteAtelier.tsx`, `src/views/Catalogue.tsx`.

Créés :
- `src/components/{Layout,EtatCatalogue,Contact}.tsx`.
- `src/views/{Accueil,Compte,DetailsAtelier,Profil,Introuvable}.tsx`.
- `src/router/RoutesApplication.tsx`.
- `src/hooks/{useAteliers,useCompte,useInscription,useTitre}.ts`.
- `src/context/{FournisseurAteliers,FournisseurCompte}.tsx`.
- `src/services/{compte,programmes}.ts`.
- `../tests/react-parcours.mjs`, `../tests/react-erreurs.mjs`, ce document.

CarteAtelier, Catalogue, types, service de validation JSON, recherche normalisée,
polices, couleurs et configuration Tailwind 4 proviennent du TP1. Aucun fichier
original de `../src/` n’est modifié. Les ressources WebP et polices originales sont
importées sans duplication. Les CSS inutilisés du modèle restent non importés.
Toute nouvelle présentation utilise Tailwind.

## Migration fonctionnelle

Accueil avec accroche, prochain atelier, six valeurs, catalogue en carrousel,
formateurs et contact de démonstration. Douze ateliers avec recherche titre/formateur,
suggestions natives, niveau, tri des prix, disponibilité et réinitialisation.
Les cartes affichent prix, places, durée, horaires, modalité, niveau et formateur.
Les six programmes originaux sont préservés dans `programmes.ts` ; les six autres
fiches présentent uniquement les données disponibles dans le JSON.

Les anciennes fenêtres de consultation/réservation deviennent des routes de détails
partageables. La désinscription conserve un dialogue modal. Les suggestions utilisent
`datalist` plutôt qu’une liste ARIA personnalisée. Le filtrage est immédiat.

## Comptes et inscriptions

Les clés et formats `skillhub_utilisateurs`, `skillhub_session`,
`skillhub_inscriptions` sont conservés, y compris les comptes scolaires SHA-256.
Aucun mot de passe en clair n’est ajouté. Cette authentification locale n’est pas
sécurisée pour la production : les données et contrôles sont modifiables par
l’utilisateur. Utiliser des informations fictives.

Le catalogue est public. Sans session, l’inscription mène à `/connexion?atelier=...`,
conserve le contexte pendant la création et revient à la fiche pour confirmation
explicite. Les disponibilités déduisent les inscriptions locales. Les doublons,
ateliers complets et fermés sont bloqués. Le profil permet de consulter et annuler
ses inscriptions. Les erreurs de stockage sont affichées sans faux succès ;
les événements `storage` synchronisent les onglets.

localStorage dépend de l’origine (protocole, hôte, port). Les données d’un ancien
serveur ne sont pas effacées, mais ne sont pas automatiquement accessibles sur un
autre port. Sans backend, aucune disponibilité partagée entre appareils ni
transaction atomique entre onglets n’est garantie.

## JSON, routes et SEO

`FournisseurAteliers` appelle le service du TP1 dans `useEffect`. `fetch` charge
l’unique `../src/ateliers.json` ; validation HTTP, JSON, champs, niveaux, nombres
et IDs uniques. Le contexte partage chargement, erreur et résultat entre les vues.
`AbortController` annule au démontage, et les callbacks ignorent les requêtes
annulées. Réessayer relance le chargement. StrictMode peut lancer un cycle
supplémentaire en développement. Aucun fetch supplémentaire au changement de route.

React Router utilise BrowserRouter, Routes, Route, Link, NavLink, Navigate et Outlet.
Routes : `/`, `/ateliers`, `/ateliers/:id`, `/connexion`, `/inscription`, `/profil`
protégé, et page introuvable. Les anciennes URL `.html` redirigent vers React.
Layout partage menu, pied de page et focus. Documentation officielle :
https://reactrouter.com/start/declarative/routing

Titres et descriptions changent côté client. SPA sans SSR : les robots sans
JavaScript ne voient pas les fiches pré-rendues. Vite dev/preview prennent en charge
les URL directes ; un futur hébergement statique devra servir `index.html` pour
les chemins applicatifs.

## Résultats de vérification

- TypeScript (`npx tsc -b`), build Vite et ESLint : succès.
- Chrome headless, profil temporaire, preview production : 12 ateliers, recherche,
  erreur formulaire, création, mauvais/bon login, retour atelier, inscription unique,
  persistance au rechargement, maintien/annulation, complet, logout, profil protégé.
- URL directes, page introuvable et ancienne URL : succès.
- Menu Entrée/Tab/Échap, lien clavier et focus de navigation : succès.
- Contact invalide/valide et message sans envoi réel : succès.
- Chargement, HTTP 404, JSON malformé, structure invalide, Réessayer et stockage
  bloqué : succès. Aucune exception JavaScript pendant ces parcours.
- Accueil à 375, 800 et 1280 px : aucun débordement horizontal ; capture desktop
  inspectée visuellement.
- Vite dev : URL directe `/ateliers/html`, JSON et images originales : succès.
- `git diff -- src` vide : originaux préservés. Aucun commit/push ni backend ajouté.

Scripts reproductibles : Chrome avec un profil temporaire et
`--remote-debugging-port=9224`, puis depuis la racine (adapter les ports) :

```sh
PREVIEW_URL=http://127.0.0.1:4174 node tests/react-parcours.mjs
PREVIEW_URL=http://127.0.0.1:4174 DEV_URL=http://127.0.0.1:5176 node tests/react-erreurs.mjs
```

`CHROME_URL` est paramétrable. Le premier script efface le stockage de l’origine
de test : ne pas utiliser son profil personnel.

À vérifier manuellement : NVDA/VoiceOver, Safari/Firefox, zoom élevé, toutes les
vues sur appareils physiques et audit d’accessibilité complet. Ces tests ne
constituent pas une certification WCAG.
