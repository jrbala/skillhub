# FM03 — TP1 : vérification du 27 octobre 2026

## Conditions réelles

Tests locaux exécutés avec Chrome headless, un profil temporaire isolé et un serveur Python servant `src` sur localhost. Le protocole DevTools, piloté avec Node.js sans bibliothèque ajoutée, envoie Tab, Maj+Tab, Entrée, Espace et Échap. Les champs sont remplis avec du texte fictif. La sélection du texte à remplacer est pilotée par le script ; les déplacements et activations décrits sont effectués par touches, sans clic de souris.

Les comptes de test restent dans ce profil temporaire. Aucun compte réel, envoi de message, paiement ou publication. Les tests temporaires ne sont pas des dépendances du projet. Les anciens rapports restent inchangés.

## Résultats exécutés

| Vérification | Résultat observé |
|---|---|
| `node --check` sur main.js, compte.js et stockage.js | Aucun défaut de syntaxe |
| `git diff --check` | Aucun défaut d’espacement signalé |
| Cartes dynamiques et carrousel | Comparaison du bloc JavaScript avant/après ce TP : strictement identique ; six cartes présentes dans le navigateur |
| Dix fichiers HTML | Pas d’identifiant dupliqué ; toutes les références aria-controls, aria-describedby et aria-labelledby correspondent à un élément présent |
| Menu mobile | Entrée ouvre ; Tab entre dans les liens ; Maj+Tab revient au bouton ; Espace ouvre/ferme ; Échap ferme et rend le focus |
| Lien de navigation | Entrée conserve l’ancre native et ferme le menu mobile |
| Sous-menus | Deux niveaux injectés uniquement dans le DOM de test après chargement ; Entrée et Espace ouvrent ; Échap ferme le niveau enfant puis parent et restitue le focus à chacun |
| Modale d’atelier | Ouverture par Entrée/Espace ; huit Tab puis huit Maj+Tab gardent le focus dans le dialog ; Échap et bouton Fermer rendent le focus au déclencheur |
| Formulaire de contact | Envoi vide : focus sur le nom ; adresse invalide signalée pendant la saisie ; correction puis résultat de démonstration ; saisies conservées, bouton réactivé |
| Création de compte | Champs requis et confirmation différente signalés ; correction possible sans effacer les autres champs |
| Échec de stockage | `Storage.prototype.setItem` remplacé temporairement dans le navigateur de test par une fonction qui lève une erreur, puis restauré ; pas de compte enregistré, pas de redirection de réussite ; message d’erreur focalisé et bouton réactivé |
| État en cours et double envoi | Appel creerCompte suspendu uniquement par le test, puis libéré vers la vraie fonction ; bouton disabled, aria-busy et « Inscription en cours… » présents ; une deuxième soumission n’appelle pas à nouveau creerCompte |
| Parcours complet | Depuis le cours HTML : réservation → connexion → création de compte → connexion → profil → confirmation ; contexte atelier conservé et une inscription enregistrée |
| Atelier déjà réservé | Le bouton du cours HTML est désactivé après inscription |
| Inscription depuis une modale | Pour un deuxième atelier connecté, l’inscription désactive le déclencheur ; à Échap, le focus revient sur le titre visible de la page |
| Désinscription | Ouverture au clavier ; Échap annule et rend le focus au bouton ; confirmation retire seulement l’inscription choisie et place le focus sur le message du profil |
| Responsive | À 375, 768 et 1440 px, visibilité et aria-expanded cohérents ; retour au format mobile ferme les liens |
| Géométrie du header | Positions et dimensions de la marque, du bouton mobile, des liens et des actions de compte comparées au HTML/CSS antérieurs : identiques aux trois largeurs |
| Pages partagées | Ouverture/fermeture du menu au clavier testées sur l’accueil, connexion, inscription et les six cours ; profil testé dans le parcours authentifié |
| Parcours étendu accueil | 55 Tab puis 55 Maj+Tab ; 20 cibles observées ; aucun élément masqué ne reçoit le focus |
| Console | Aucune exception JavaScript ni console.error pendant les parcours finaux |

Les premiers essais du pilote ont nécessité deux ajustements de test : transmettre le caractère d’Entrée au navigateur et attendre le résultat asynchrone au lieu d’un délai fixe trop court. Les résultats ci-dessus correspondent aux exécutions finales réussies, pas aux essais interrompus.

## Correspondance avec les six exigences

1. Code initial annoté ligne par ligne et comparaison FM02/SkillHub : `tp1-fm03-interactions.md`.
2. Menu délégué et sous-menus : un écouteur click sur `#navigation-principale`, vérifié aussi avec des boutons ajoutés après chargement.
3. État indépendant du DOM : `etatInterface` et `afficherInterface`, ARIA et visibilité synchronisés.
4. Validation native et règles métier : checkValidity, messages locaux liés, saisies conservées.
5. Soumission : preventDefault, état en cours, blocage du double envoi, résultat réel ou erreur ; parcours local existant préservé.
6. Clavier : parcours exécutés ci-dessus ; explication orale du focus dans le document d’interactions.

## Refaire le parcours en classe

1. Lancer `python3 -m http.server 8000 --directory src` et ouvrir `http://localhost:8000`.
2. En largeur mobile, rejoindre le bouton Menu avec Tab. Tester Entrée, Espace, Tab, Maj+Tab et Échap. En largeur desktop, les liens restent visibles.
3. Rejoindre le bouton de la modale par Tab, ouvrir avec Entrée, parcourir dans les deux sens et fermer avec Échap. Observer le retour du focus.
4. Soumettre le formulaire d’accueil vide, corriger les champs et vérifier que le résultat dit bien qu’il s’agit d’une démonstration.
5. Depuis un cours, demander une inscription sans session, créer un compte fictif, se connecter et confirmer l’atelier. Vérifier Mon espace, puis annuler/confirmer une désinscription.
6. Présenter l’explication orale du focus dans `tp1-fm03-interactions.md`.

## Limites

Il s’agit de tests automatisés dans Chrome, pas d’un audit WCAG complet ni d’un essai manuel avec lecteur d’écran. La restitution orale en classe reste à faire par l’étudiant. Les sous-menus ont été testés avec une structure temporaire ; aucune rubrique supplémentaire n’a été ajoutée au site. Les comptes restent une simulation locale, sans serveur d’authentification.
