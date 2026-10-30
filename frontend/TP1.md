# TP1 — La carte d’atelier et la liste, en composants React

Depuis `frontend/` : `npm install`, `npm run build`, `npm run lint`, puis `npm run preview`.

## Organisation

- `src/components/CarteAtelier.tsx` : carte sans état d’inscription ; props typées et rappel `onInscrire`.
- `src/views/Catalogue.tsx` : chargement, recherche par titre et inscriptions locales.
- `src/services/ateliers.ts` : copie du chargement FM03, avec chemins adaptés à Vite et cause des erreurs conservée pour ESLint. Validation, messages et signature inchangés.
- `src/types.ts` : réexportation des types FM03 depuis `../src/ts/types.ts` à la racine du projet.
- `src/router/` et `src/hooks/` : dossiers réservés, sans routeur ni abstraction supplémentaire pour ce TP.
- `src/jetons.css` : polices et couleurs du FM02 reprises de `src/css/base.css` à la racine ; le fichier original `src/css/jetons.css` est vide.
- `tailwind.config.js` : correspondance des couleurs, police, largeur, rayons, ombre et seuils responsive du FM02. Chargé explicitement par `@config` dans `src/index.css` avec Tailwind 4 et le plugin Vite.

Les 12 ateliers proviennent directement de `../src/ateliers.json`. Vite inclut ce JSON et les polices locales dans la production. Aucun fichier du projet original n’est modifié.

`catalogue.ts` du FM03 a été étudié : il manipule directement le DOM. Ses principes de présentation, de normalisation de recherche et de formatage des prix sont repris en React, sans importer ses effets de bord ni ses filtres supplémentaires.

## Comportement

La recherche utilise `useState`, puis `filter()` sur le titre. Les cartes utilisent `map()` et l’identifiant comme clé. Aucune liste filtrée n’est stockée dans un état.

Les inscriptions restent dans `Catalogue`. Une inscription diminue d’une unité les places affichées, affiche « Déjà inscrit » et empêche une seconde inscription. Elles sont réinitialisées au rechargement. Aucun compte, stockage persistant, contexte global ou React Router n’est ajouté.

Les boutons indisponibles utilisent `aria-disabled` avec une garde dans le gestionnaire : ils restent accessibles au clavier et conservent le focus après l’inscription. Une région de statut annonce les inscriptions. Le compteur utilise `aria-live="polite"`. Un lien d’évitement, les labels et un contour de focus de 3 px complètent la navigation clavier.

## Vérification manuelle

1. Ouvrir l’adresse indiquée par `npm run preview` et vérifier les 12 ateliers.
2. Rechercher « HTML », puis un titre inexistant : vérifier la liste et le compteur.
3. Naviguer avec Tab depuis « Aller au contenu » jusqu’au champ et aux boutons ; vérifier le focus et activer avec Entrée ou Espace.
4. S’inscrire à un atelier ouvert : vérifier « Déjà inscrit », la place décomptée et l’absence de doublon.
5. Vérifier « Atelier complet » pour CSS et React.
6. Vérifier une, deux et trois colonnes aux largeurs 375, 800 et 1280 px.
7. Recharger : les inscriptions de cette visite disparaissent.

Le fichier `App.css` initial et les images du modèle Vite restent présents mais ne sont pas importés.

## Résultats de validation

- `npm run build` : réussi (TypeScript et Vite).
- `npm run lint` : réussi.
- Chrome sur `npm run preview` : 12 cartes, recherche, compteur, navigation Tab/Entrée, focus visible, inscription unique, diminution des places, ateliers complets, polices locales et réinitialisation au rechargement vérifiés.
- Grille vérifiée à 375, 800 et 1280 px : respectivement 1, 2 et 3 colonnes, sans débordement horizontal.
- Aucun message d’erreur de l’application dans la console pendant ce parcours.

Configuration Tailwind 4 : https://tailwindcss.com/docs/upgrade-guide#using-a-javascript-config-file
