# Vérification — Comptes et inscriptions simulés

## Conditions

Vérification locale du 2 octobre 2026 sur Chrome en mode headless, avec un profil temporaire isolé et un serveur HTTP servant `src`. Pilotage par le protocole DevTools avec Node.js natif : aucune bibliothèque installée et aucune dépendance ajoutée au projet. Les comptes de test sont fictifs et ne sont pas intégrés aux fichiers du site.

Deux séries de tests ont validé 55 contrôles fonctionnels. Des contrôles statiques supplémentaires ont vérifié les liens, les identifiants, les références ARIA et les contrastes. Des captures locales de l’accueil et du profil ont servi au contrôle visuel. Les preuves historiques du dépôt restent intactes.

## Résultats

| Parcours ou contrôle | Résultat |
|---|---|
| Deux cartes avec nom, description, niveau, durée, horaires, modalité et prix | Conforme |
| Choix JavaScript sans connexion : redirection et conservation de l’identifiant et du prix | Conforme |
| Création : champs requis, e-mail invalide, mot de passe court, confirmation différente | Erreurs françaises et focus sur le premier champ invalide |
| Création valide | Compte enregistré, SHA-256 de 64 caractères, aucun mot de passe brut dans le stockage |
| Même e-mail avec une casse différente | Doublon refusé, aucun deuxième compte créé |
| Connexion incorrecte | Message accessible, aucune session créée |
| Connexion correcte avec atelier en attente | Profil et demande explicite de confirmation |
| Confirmation et annulation de l’atelier en attente | Bon atelier enregistré ou demande annulée, retour du focus sur le message |
| Connexion sans atelier en attente | Profil et état vide |
| Inscription depuis l’accueil en étant connecté | Enregistrement et confirmation accessibles |
| Inscription depuis le dialog | Même parcours et confirmation dans le dialog |
| Inscription en double, directement ou depuis la demande en attente | Aucun doublon enregistré |
| Profil : nom contenant une balise HTML | Affiché comme texte, aucune balise injectée |
| Profil : ateliers, prix et séparation entre deux comptes | Conforme |
| Actualisation et reconnexion après déconnexion | Inscriptions conservées |
| Déconnexion | Seule la clé de session est supprimée ; retour à l’accueil |
| Profil sans session, JSON de session invalide ou compte inexistant | Redirection vers la connexion |
| JSON invalide, données absentes ou structures inattendues | Pas d’exception ; valeurs de repli |
| Écriture localStorage simulée comme indisponible | Message d’erreur et absence de fausse confirmation |
| Lien d’évitement | Premier lien accessible avec Tab |
| Formulaires au clavier | Ordre nom → e-mail → mot de passe → confirmation → bouton ; création et connexion avec Entrée |
| Menu mobile | Ouverture avec Entrée, Tab vers les liens, fermeture avec Échap, `aria-expanded` et retour du focus corrects |
| Dialog | Tab reste dans le dialog ; Échap et bouton Fermer rendent le focus au bouton d’ouverture |
| Ancien formulaire de démonstration | Validation, premier champ invalide et message de réussite conservés ; aucune réservation implicite |
| Accueil, création, connexion et profil à 375, 768 et 1440 px | Aucun débordement horizontal |
| Console | Aucune exception JavaScript ni appel console.error pendant les parcours |
| Ressources de l’application | Aucun échec HTTP observé pour les pages, scripts, styles, images et polices |
| Liens des quatre pages | Fichiers et ancres présents, chemins relatifs |
| Labels et références ARIA | Identifiants uniques ; toutes les cibles existent |

## Contrastes vérifiés par calcul

- Blanc sur bouton violet `#5b4cf0` : 5,62:1.
- Violet sombre `#4738d1` sur fond `#f6f7fb` : 7,12:1.
- Erreur `#b42318` sur fond `#f6f7fb` : 6,14:1.
- Texte `#25283a` sur blanc : 14,55:1.

Ces combinaisons dépassent le seuil WCAG AA de 4,5:1 pour du texte normal. Les champs utilisent une bordure sombre visible et les contrôles conservent un indicateur de focus.

## GitHub Pages et limites de la vérification

Le workflow publie `src`, qui contient les quatre pages et leurs ressources. Aucun chemin absolu à la racine ni routage serveur n’est nécessaire : les liens restent compatibles avec le préfixe `/skillhub/`. La vérification porte sur les fichiers locaux et la configuration existante ; la nouvelle version n’a pas été déployée et aucun commit ni push n’a été effectué.

La vérification au clavier utilise des événements natifs du navigateur automatisés. Elle ne remplace pas une campagne manuelle avec VoiceOver/NVDA ou des utilisateurs. Safari, Firefox et les appareils physiques n’ont pas été testés. Les anciens résultats Lighthouse/WAVE n’ont pas été recalculés et ne sont pas présentés comme des résultats de cette version.

La simulation dépend de JavaScript, de localStorage et de Web Crypto dans un contexte sécurisé (HTTPS ou localhost). Le hash SHA-256, la session et les contrôles d’accès locaux ne constituent pas une authentification de production. Aucun paiement, e-mail ou réservation réelle n’a lieu. Les écritures entre plusieurs onglets ne sont pas transactionnelles.


## Correction visuelle et contexte d’inscription

Une série complémentaire de 21 contrôles a vérifié la correction du contexte : un ancien atelier en localStorage n’apparaît plus lors d’une connexion ou d’une création de compte ordinaire. Le choix explicite de JavaScript remplace HTML et reste correct pendant la création, la connexion et la confirmation. Les liens sous les formulaires conservent ce parcours ; les actions générales du header ouvrent une page de compte sans sélection.

Les cartes d’atelier présentent maintenant une grille d’informations et un pied de carte avec prix et action. Les accès de compte ont une présentation de boutons. Les pages de connexion et de création disposent d’un panneau de formulaire dédié. Contrôle visuel sur Chrome et absence de débordement à 375, 768 et 1440 px ; validation et focus conservés, aucune erreur JavaScript ni ressource manquante pendant cette série.


## Confirmation et état des boutons d’inscription

La confirmation s’affiche désormais dans le card concerné (ou dans le dialog), avec une région `aria-live` et le focus sur le résultat. Les boutons du même atelier sont bloqués dès le premier clic avec « Inscription en cours… », puis affichent « Déjà inscrit » après réussite, y compris après rechargement. Une erreur rend le bouton à nouveau disponible.

Contrôles ciblés sur Chrome : blocage immédiat des deux boutons HTML, double clic avec traitement volontairement suspendu (un seul appel), confirmation et focus locaux, état persistant après rechargement, erreur puis nouvelle tentative, confirmation dans le dialog et parcours visiteur conservé. Aucune erreur console détectée. Le stockage réel reste synchrone et local ; aucun délai artificiel n’est ajouté.


## Espace utilisateur et désinscription

Le profil présente un panneau d’identité, un compteur et les fiches détaillées des ateliers. « Se désinscrire » ouvre un dialog natif : le focus initial est sur « Garder mon inscription ». Échap et ce bouton conservent les données et rendent le focus au déclencheur. Après confirmation, seule l’inscription du compte connecté est retirée, le compteur est mis à jour et le focus rejoint le message de résultat.

Tests Chrome : profil sans débordement à 375, 768 et 1440 px ; annulation de la suppression ; suppression persistante ; erreur de stockage sans perte de l’inscription et nouvel essai possible ; état vide après la dernière suppression ; inscriptions d’un autre compte intactes ; réinscription disponible et visible dans le profil. Aucune erreur console détectée.
