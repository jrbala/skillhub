# Audit heuristique — FUN-MOOC

## Plateforme auditée

FUN-MOOC  
https://www.fun-mooc.fr/

## Tâches à accomplir

1. Trouver une formation ouverte aux inscriptions dans la catégorie « Informatique et programmation ».

2. Vérifier sa durée, ses prérequis, son prix et comprendre comment s’inscrire.

**Cours analysé :** Sécurité des Réseaux Informatiques

## Grille des heuristiques

| Nº | Heuristique | Observation | Preuve | Sévérité |
|---:|---|---|---|---:|
| 1 | Visibilité de l’état du système | Le nom et la date de début sont visibles dans les résultats. La fiche du cours présente ensuite les informations complètes. | La date de début apparaît sous le nom du cours dans les résultats. | 0 |
| 2 | Correspondance entre le système et le monde réel | Le vocabulaire, les dates, les prérequis et les indications d’inscription sont présentés de manière claire et compréhensible. | Aucun code interne ni terme incompréhensible n’a été rencontré pendant le parcours. | 0 |
| 3 | Contrôle et liberté de l’utilisateur | La fiche du cours ne propose aucun lien visible pour revenir aux résultats. Le retour reste possible uniquement avec le bouton du navigateur. | [Capture de la fiche sans lien de retour](preuves/heuristique-3.png) | 2 |
| 4 | Cohérence et standards | Le logo renvoie à l’accueil, les liens et les boutons sont reconnaissables, et la navigation conserve les mêmes styles et libellés entre les pages. | Les conventions habituelles du Web et l’identité visuelle restent cohérentes pendant le parcours. | 0 |
| 5 | Prévention des erreurs | Une faute de frappe dans la recherche n’est ni corrigée ni accompagnée d’une suggestion. La plateforme affiche seulement zéro résultat. | [Capture de la recherche sans suggestion](preuves/heuristique-5.png) | 2 |
| 6 | Reconnaître plutôt que se souvenir | Après l’ouverture du cours et le retour aux résultats, le terme recherché, les résultats et la position dans la page sont conservés. | L’utilisateur retrouve son parcours sans devoir mémoriser ni saisir à nouveau sa recherche. | 0 |
| 7 | Souplesse et efficacité | Le catalogue propose une recherche directe, plusieurs filtres combinables et une option permettant de les retirer rapidement. | Les résultats sont actualisés selon les critères choisis, ce qui accélère la recherche d’une formation. | 0 |
| 8 | Design esthétique et minimaliste | La section « Archived » affiche plusieurs périodes anciennes sans expliquer clairement qu’il s’agit des éditions précédentes du cours. Cette information secondaire alourdit la page. | [Capture de la liste des éditions archivées](preuves/heuristique-8.png) | 1 |
| 9 | Reconnaître, diagnostiquer et réparer les erreurs | En cas de recherche sans résultat, le message n’explique pas la cause possible et ne propose aucune correction. La formulation « Showing 1 to 0 of 0 courses » est incohérente. | [Capture du message sans aide à la correction](preuves/heuristique-5.png) | 2 |
| 10 | Aide et documentation | La FAQ est visible et facile à trouver, mais elle ne possède pas de recherche interne, n’explique pas comment rechercher un cours et ne fournit pas de contact technique. | [Capture de la FAQ sans champ de recherche](preuves/heuristique-10.png) | 2 |

## Trois recommandations vérifiables

1. Ajouter en haut de chaque fiche de cours un lien « Retour aux résultats » qui ramène au catalogue en conservant le terme recherché et la position précédente.

2. Lorsqu’une recherche ne retourne aucun cours, afficher un message cohérent et proposer une correction orthographique ou des termes proches.

3. Ajouter dans la FAQ un champ de recherche et un lien clairement identifié permettant de contacter l’assistance technique.

## Défaut également présent dans SkillHub

FUN-MOOC ne propose pas de contact technique clairement identifiable dans sa FAQ. SkillHub présente le même défaut : aucun moyen de contacter une assistance ou d’obtenir de l’aide n’est actuellement disponible.