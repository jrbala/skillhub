# Rapport FM02 — Ergonomie, UX/UI et accessibilité

## Présentation

Ce rapport présente les travaux réalisés autour de l’expérience utilisateur, de la conception de l’interface, de l’accessibilité et des interactions JavaScript du projet SkillHub.

Les exercices ont permis d’analyser une interface existante, de préparer une maquette dans Figma, de vérifier l’accessibilité de SkillHub et d’ajouter des interactions utilisables au clavier.

## TP1 — Personas et parcours utilisateur

Deux personas ont été définis à partir d’hypothèses assumées.

Le premier persona est un apprenant qui utilise principalement son téléphone et dont le français n’est pas la langue maternelle. Il a besoin d’un vocabulaire simple, d’un niveau de formation clairement indiqué et d’un processus d’inscription facile à comprendre.

Le second persona est un formateur qui utilise principalement son ordinateur et navigue régulièrement au clavier. Il souhaite publier une formation sans remplir un formulaire long et complexe.

Le parcours de l’apprenant a ensuite été étudié en cinq étapes : découverte, exploration, décision, inscription et confirmation. Cette analyse a mis en évidence plusieurs améliorations possibles :

- préciser le public et le rôle de SkillHub ;
- afficher le niveau, la durée et les horaires des ateliers ;
- indiquer l’atelier sélectionné dans le formulaire ;
- afficher une confirmation après l’inscription ;
- rendre les fonctions principales accessibles au clavier.

## TP2 — Audit heuristique

Un audit heuristique de la plateforme FUN-MOOC a été réalisé à partir des dix heuristiques de Nielsen.

Le parcours testé consistait à rechercher une formation ouverte aux inscriptions dans la catégorie « Informatique et programmation », puis à vérifier sa durée, ses prérequis, son prix et les modalités d’inscription.

L’audit a notamment identifié les problèmes suivants :

- absence de lien visible pour revenir aux résultats depuis la fiche du cours ;
- absence de correction ou de suggestion lors d’une recherche incorrecte ;
- message incohérent lorsqu’aucun résultat n’est trouvé ;
- présentation peu claire des anciennes éditions dans la section « Archived » ;
- FAQ sans recherche interne ni contact technique clairement identifié.

Trois recommandations principales ont été proposées : ajouter un retour vers les résultats, améliorer l’aide en cas de recherche sans résultat et compléter la FAQ avec une recherche et un contact d’assistance.

## TP3 — Maquette et composants Figma

La maquette de SkillHub a été préparée dans Figma avant l’intégration des interactions.

Les couleurs principales ont été enregistrées sous forme de variables afin de conserver une identité visuelle cohérente. Des composants réutilisables ont été créés pour les boutons, les champs de formulaire et les cartes.

Cette organisation permet de modifier un composant principal et de répercuter plus facilement les changements dans la maquette. Les états visuels importants, notamment le focus et l’erreur, ont également été pris en compte.

## TP4 — Accessibilité

L’accessibilité de SkillHub a été vérifiée avec Lighthouse, WAVE et une navigation complète au clavier.

Les principales améliorations mises en place sont :

- utilisation d’éléments HTML sémantiques ;
- lien d’évitement vers le contenu principal ;
- ordre de tabulation logique ;
- focus visible sur les éléments interactifs ;
- libellés associés aux champs du formulaire ;
- textes alternatifs adaptés aux images ;
- icônes décoratives masquées avec `aria-hidden="true"` ;
- contrôle du contraste des couleurs ;
- messages dynamiques annoncés aux technologies d’assistance.

Le test final WAVE ne signale aucune erreur, aucune erreur de contraste et aucune alerte. Le contrôle Lighthouse obtient un score d’accessibilité de 100.

## Interactions JavaScript natives

Deux interactions principales ont été intégrées en JavaScript natif.

### Menu responsive

Un bouton permet d’afficher ou de masquer la navigation sur les petits écrans. L’attribut `aria-expanded` est mis à jour afin d’indiquer aux technologies d’assistance si le menu est ouvert ou fermé.

### Formulaire et fenêtre de confirmation

Le formulaire utilise une validation personnalisée. Lorsqu’un champ est invalide, `aria-invalid` est mis à jour, un message compréhensible est affiché et le focus est dirigé vers le premier champ concerné.

Après une validation correcte, une fenêtre native `<dialog>` confirme l’inscription. Elle peut être fermée au clavier avec la touche Échap. À sa fermeture, le focus revient sur l’élément qui l’avait ouverte.

## Preuves et livrables

- [Personas et parcours utilisateur](tp1-ux.md)
- [Capture annotée du parcours utilisateur](screenshot-ux.png)
- [Audit heuristique de FUN-MOOC](audit-heuristique.md)
- [Captures de l’audit heuristique](preuves/)
- [Maquette réalisée dans Figma](../maquettes/maquette-skillhub.png)
- [Vérification des contrastes](contrastes.md)
- [Parcours de navigation au clavier](parcours-clavier.md)
- [Rapport d’accessibilité](rapport-accessibilite.md)
- [Lighthouse avant les améliorations](rapports/accessibilite-avant-lighthouse.html)
- [Lighthouse après les améliorations](rapports/accessibilite-apres-lighthouse.html)
- [WAVE avant les améliorations](rapports/accessibilite-avant-wave.png)
- [WAVE après les améliorations](rapports/accessibilite-apres-wave.png)

## Difficultés rencontrées et solutions

### Validation personnalisée du formulaire

La validation native du navigateur empêchait l’affichage de mes propres messages d’erreur. J’ai ajouté l’attribut `novalidate` au formulaire, puis réalisé la validation en JavaScript. Les champs invalides utilisent `aria-invalid`, et le focus est placé sur le premier champ contenant une erreur.

### Menu mobile accessible

Le menu devait pouvoir être utilisé au clavier et indiquer s’il était ouvert ou fermé. J’ai utilisé un bouton natif et mis à jour l’attribut `aria-expanded` avec JavaScript à chaque ouverture ou fermeture.

### Gestion du focus dans la fenêtre de confirmation

Après la fermeture de la fenêtre `<dialog>`, le focus devait revenir sur l’élément qui l’avait ouverte. J’ai donc enregistré cet élément avant l’ouverture, puis replacé le focus dessus après la fermeture.

## Conclusion

Les travaux réalisés dans le cadre du module FM02 m’ont permis d’améliorer l’ergonomie et l’accessibilité de SkillHub. Les personas, le parcours utilisateur, l’audit heuristique et les tests d’accessibilité ont guidé les décisions d’interface. Les interactions JavaScript ont également été conçues pour fonctionner au clavier et communiquer clairement leur état aux technologies d’assistance.