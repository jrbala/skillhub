# Rapport de performance avant / après

## Conditions de mesure

Les deux mesures ont été réalisées avec Lighthouse, en mode mobile et dans une fenêtre privée.

## Résultats

| Métrique | Avant | Après | Écart |
|---|---:|---:|---:|
| LCP | 0,6 s | 1,4 s | +0,8 s |
| CLS | 0 | 0 | 0 |
| TBT | 0 ms | 0 ms | 0 ms |

## Analyse

### LCP

Le LCP passe de 0,6 s à 1,4 s. Le rapport identifie le titre principal comme élément LCP. La police Inter 700 doit maintenant être téléchargée avant son affichage définitif. Elle est préchargée et utilise `font-display: swap` afin de limiter ce délai. Malgré cette augmentation, la valeur reste inférieure à 2,5 secondes.

### CLS

Le CLS reste à 0. Les attributs `width` et `height` réservent l’espace nécessaire avant le chargement des images, ce qui évite les déplacements de contenu.

### TBT

Le TBT reste à 0 ms. La page ne contient aucun script JavaScript et aucune tâche longue ne bloque le thread principal.