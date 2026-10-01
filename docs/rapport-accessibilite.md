# Rapport d’accessibilité — SkillHub

## Conditions de mesure

Les tests avant et après ont été réalisés dans les mêmes conditions, avec Lighthouse dans l’onglet Accessibilité et avec l’extension WAVE.

## Résultats Lighthouse

| Mesure | Avant | Après |
|---|---:|---:|
| Score d’accessibilité | 100/100 | 100/100 |

Le score Lighthouse n’a pas changé, car la page ne présentait déjà aucune erreur automatiquement détectable. Les modifications ont néanmoins amélioré le comportement réel au clavier et avec les technologies d’assistance.

## Résultats WAVE

| Mesure | Avant | Après |
|---|---:|---:|
| Errors | 0 | 0 |
| Contrast Errors | 0 | 0 |
| Alerts | 0 | 0 |
| Features | 7 | 7 |
| Structure | 23 | 24 |
| ARIA | 8 | 17 |
| AIM Score | 10/10 | 10/10 |

L’augmentation du nombre d’éléments ARIA correspond aux informations ajoutées pour le menu, la fenêtre modale et la validation du formulaire.

## Modifications réalisées

- Ajout d’un bouton de menu accessible avec `aria-expanded` et `aria-controls`.
- Ouverture et fermeture du menu au clavier.
- Ajout d’une fenêtre modale native avec l’élément `<dialog>` et `showModal()`.
- Fermeture de la modale avec son bouton ou avec la touche Échap.
- Retour du focus vers le bouton ayant ouvert la modale.
- Ajout d’un focus visible sur les liens, les boutons et les champs.
- Conservation d’un lien d’évitement visible lorsqu’il reçoit le focus.
- Association des messages d’erreur aux champs avec `aria-describedby`.
- Mise à jour de `aria-invalid` selon l’état des champs.
- Validation du formulaire pendant la correction des données.
- Déplacement du focus vers le premier champ invalide lors de l’envoi.
- Annonce des erreurs et de la confirmation avec `aria-live`.
- Vérification des ratios de contraste des couleurs utilisées.

## Améliorations encore possibles

- Tester la page avec de vrais lecteurs d’écran, notamment VoiceOver et NVDA.
- Faire tester le parcours par plusieurs utilisateurs en situation réelle.
- Vérifier le comportement sur davantage de navigateurs et d’appareils.
- Fermer automatiquement le menu mobile après la sélection d’un lien.
- Ajouter une validation côté serveur, car la validation JavaScript seule ne garantit pas la sécurité des données.
- Ajouter un véritable traitement de l’inscription et une confirmation envoyée à l’utilisateur.

## Conclusion

Les scores automatiques restent identiques, mais la page possède désormais des interactions accessibles au clavier, une gestion correcte du focus et des messages de formulaire compréhensibles. Les tests automatiques doivent toujours être complétés par des vérifications manuelles.