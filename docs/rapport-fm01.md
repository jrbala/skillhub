# Rapport FM01 — Développement d’interfaces front-end

## Présentation du projet

SkillHub est une landing page permettant de présenter des ateliers, les valeurs de la plateforme, les formateurs et un formulaire d’inscription. Le projet a été développé progressivement à travers les différents travaux pratiques du module FM01.

## TP1 — Structure HTML sémantique

La structure de la page a d’abord été préparée sous la forme d’un arbre de titres. Cette étape a permis de vérifier la hiérarchie du contenu avant d’ajouter la mise en forme.

La page contient cinq sections principales :

- accroche ;
- valeurs ;
- ateliers ;
- formateurs ;
- inscription.

Les fiches d’atelier utilisent l’élément `<article>`. Le formulaire possède des éléments `<label>` associés à leurs champs avec les attributs `for` et `id`. La langue du document, le titre, la description, la viewport et un lien d’évitement vers le contenu principal ont également été ajoutés.

Le document HTML a été contrôlé avec le validateur W3C et ne contient aucune erreur.

## TP2 — Médias et performance

Une image d’accroche, trois photographies de formateurs et six icônes SVG en ligne ont été ajoutées à la page.

Les photographies ont été converties au format WebP et exportées en plusieurs largeurs. Les attributs `srcset` et `sizes` permettent au navigateur de choisir le fichier adapté à la taille de l’écran. Les dimensions `width` et `height` ont été indiquées pour réserver l’espace avant le chargement.

Les images situées hors de la zone visible utilisent `loading="lazy"`. L’image d’accroche n’utilise pas le chargement différé, car elle est visible dès l’ouverture de la page.

La police Inter est auto-hébergée en deux graisses avec `font-display: swap`. La graisse utilisée par le titre est préchargée.

| Métrique | Avant | Après | Explication |
|---|---:|---:|---|
| LCP | 0,6 s | 1,4 s | Le LCP a augmenté après l’ajout de l’image réelle d’accroche. L’image reste optimisée en WebP et proposée en plusieurs tailles. |
| CLS | 0 | 0 | Les dimensions des images réservent leur emplacement et évitent les déplacements de contenu. |
| TBT | 0 ms | 0 ms | La page utilise peu de JavaScript et ne bloque pas le thread principal. |

## Mise en forme CSS et responsive design

La feuille de style utilise une approche mobile first : les règles de base sont écrites pour les petits écrans, puis adaptées aux écrans plus larges avec des media queries.

Les couleurs sont centralisées dans des propriétés personnalisées CSS afin de conserver une interface cohérente. Les espacements et les tailles de texte utilisent principalement des unités relatives comme `rem` et `em`.

Flexbox est utilisé pour organiser la navigation et certains groupes d’éléments. CSS Grid est utilisé pour les listes de valeurs, d’ateliers, de formateurs et pour la disposition de la zone d’accroche.

Les images sont fluides grâce à `max-width: 100%`. Les propriétés `aspect-ratio` et `object-fit: cover` permettent de conserver des dimensions régulières sans déformer les photographies.

## Preuves et livrables

- [Rapport Lighthouse avant optimisation](lighthouse-avant.html)
- [Rapport Lighthouse après ajout des médias](lighthouse-apres.html)
- [Rapport Lighthouse après mise en forme CSS](lighthouse-apres-css.html)
- [Analyse comparative avant/après](rapport-avant-apres.md)
- [Liste des textes alternatifs](textes-alternatifs.md)
- [Test responsive — mobile 375 px](mobile-375.png)
- [Test responsive — tablette 768 px](mobile-768.png)
- [Test responsive — ordinateur 1440 px](desktop-1440.png)
- [Validation W3C — zéro erreur](validation-w3c.png)

## Difficultés rencontrées et solutions

### Chargement des polices

Les fichiers de police étaient initialement enregistrés au format TTF alors que le CSS cherchait des fichiers WOFF2. Cela provoquait des erreurs 404. Les fichiers et les chemins déclarés dans les règles `@font-face` ont été corrigés.

### Proportions des images

Les photographies des formateurs possédaient des proportions différentes. L’utilisation de `aspect-ratio` avec `object-fit: cover` a permis d’obtenir des cartes régulières sans déformer les images.

### Mise en page responsive

Une erreur de saisie dans la fonction CSS `minmax()` empêchait la grille des valeurs de fonctionner correctement. Après correction, les cartes se répartissent automatiquement selon la largeur disponible.

## Conclusion

Le projet SkillHub m’a permis de mettre en pratique la structuration sémantique d’une page, l’intégration de médias optimisés, la création d’une mise en page responsive et la mesure des performances. Les tests réalisés montrent une page stable, légère et utilisable sur différentes tailles d’écran.