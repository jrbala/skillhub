# FM03 — TP1 : comprendre et réécrire les interactions

Travail du 27 octobre 2026. Document pédagogique en français.

## Références consultées et périmètre

- FM03, diapositive 25 : `CDWFS_BC01-FM03_Applications_web_dynamiques_et_interactives.pptx`, trouvé dans Downloads. Les six consignes correspondent à la demande.
- FM02, chapitre 7, pages 117 à 123 ; exemples de menu p. 118, de modale p. 120 et de validation p. 122. Le PDF fourni a été lu avec PDFKit ; le PowerPoint de même nom a permis de vérifier les opérateurs, mal restitués par l’extraction PDF.
- Code réellement présent avant ce TP : `src/js/main.js`, lignes 1 à 141 reproduites ci-dessous. Les cartes dynamiques situées après ce bloc sont conservées sans modification.
- `src/js/compte.js` contient déjà les comptes, la connexion, l’inscription aux ateliers et la désinscription. `src/js/stockage.js` conserve cette logique et les données : aucun changement de ce fichier pendant ce TP.

Les documents de cours servent de référence pédagogique. Le périmètre exécuté est celui demandé : pas de TypeScript, pas de remplacement du système de comptes, pas d’ajout de liens de sous-menu dans le site.

## Exemple du professeur et adaptation SkillHub

| Sujet | FM02 | SkillHub avant ce TP | Évolution TP1 |
|---|---|---|---|
| Menu | `#btn-menu`, `#menu-principal`, `ouvrirFermer`, ARIA et hidden ; Échap et clic extérieur | `.menu-toggle`, `#navigation-principale`, visibilité par CSS ; Échap et fermeture après un lien ; pas de clic extérieur | Un clic délégué sur le nav englobant bouton et liens ; état en variable ; rendu commun et hidden |
| Modale | `#modale-inscription`, `showModal`, retour du focus, clic sur fond sous condition de structure | `#modale-atelier`, réservation d’un atelier, bouton Fermer et Échap ; pas de fermeture sur le fond | Même dialog natif ; état ouvert/fermé centralisé ; retour au titre si le déclencheur est devenu désactivé |
| Validation | Courriel seul, `checkValidity`, formulaire dans un dialog avec `method="dialog"` | Nom/e-mail/message sur l’accueil ; `trim`, `validity.valueMissing`, `typeMismatch`, messages liés ; aucun compte créé par ce formulaire | `checkValidity` d’abord, puis règles ; validation à chaque input ; résultat de démonstration explicite |
| Création de compte | Exemple minimal, pas de stockage de compte | Formulaire séparé, mot de passe, confirmation, Web Crypto, localStorage et redirection | Même parcours ; contraintes natives ajoutées, état d’envoi visible et erreurs conservant les saisies |

On ne peut pas affirmer que le code a été copié du cours : les correspondances ci-dessus portent sur les mécanismes observés. Le clic extérieur et le clic sur le fond ne sont pas ajoutés, car ils ne faisaient pas partie du comportement existant demandé à préserver.

## Code existant annoté ligne par ligne

Copie du bloc **avant réécriture**, avec commentaires pédagogiques ajoutés. `L` désigne la ligne dans cette copie initiale, pas la nouvelle version du fichier. Les lignes vides séparent les blocs ; elles n’exécutent rien. Les commentaires initiaux sont conservés. Aucun exemple inventé n’est présenté comme du code existant.

```js
const boutonMenu = document.querySelector(".menu-toggle"); // L1 — Sélectionne le bouton mobile dans le DOM.

boutonMenu.addEventListener("click", () => { // L3 — Enregistre la réaction au clic ; Entrée et Espace activent aussi ce bouton natif.
  const menuOuvert = // L4 — Déclare une variable locale pour lire l’état actuel.
    boutonMenu.getAttribute("aria-expanded") === "true"; // L5 — Compare la chaîne ARIA à « true » pour obtenir un booléen.
    boutonMenu.setAttribute("aria-expanded", String(!menuOuvert)); // L6 — Inverse ce booléen et écrit « true » ou « false » dans ARIA ; le CSS affiche ou cache les liens.
}); // L7 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

const boutonOuvrirModale = document.querySelector(".ouvrir-modale"); // L9 — Sélectionne le premier bouton ouvrant la modale.
const boutonFermerModale = document.querySelector(".fermer-modale"); // L10 — Sélectionne son bouton de fermeture.
const modaleAtelier = document.querySelector("#modale-atelier"); // L11 — Sélectionne le dialog de réservation.

boutonOuvrirModale?.addEventListener("click", () => { // L13 — Écoute l’ouverture seulement si ce bouton existe (opérateur ?. pour les autres pages).
  modaleAtelier.showModal(); // L14 — Ouvre le dialog modal : le navigateur déplace le focus et rend le fond inerte.
}); // L15 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

boutonFermerModale?.addEventListener("click", () => { // L17 — Écoute la fermeture si le bouton existe.
  modaleAtelier.close(); // L18 — Ferme le dialog et déclenche son événement close.
}); // L19 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

modaleAtelier?.addEventListener("close", () => { // L21 — Réagit à toute fermeture du dialog, y compris Échap.
  boutonOuvrirModale.focus(); // L22 — Rend le focus au déclencheur initial.
}); // L23 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

if (document.querySelector("#formulaire-inscription")) { // L25 — N’installe la validation de démonstration que sur une page contenant ce formulaire.
// Validation du formulaire de démonstration
const champNom = document.querySelector("#nom"); // L27 — Récupère le champ du nom.
const erreurNom = document.querySelector("#erreur-nom"); // L28 — Récupère le paragraphe associé à l’erreur du nom.

function validerNom() { // L30 — Déclare la fonction réutilisable qui valide le nom.
  if (!champNom.value.trim()) { // L31 — Refuse un nom vide ou constitué uniquement d’espaces (trim).
    erreurNom.textContent = "Veuillez saisir votre nom."; // L32 — Écrit le message près du champ sans interpréter de HTML.
    champNom.setAttribute("aria-invalid", "true"); // L33 — Annonce le champ invalide aux technologies d’assistance.
    return false; // L34 — Renvoie false pour signaler l’échec.
  } // L35 — Termine ce bloc conditionnel ou cette fonction.

  erreurNom.textContent = ""; // L37 — Efface seulement le message d’erreur, pas la saisie.
  champNom.setAttribute("aria-invalid", "false"); // L38 — Annonce que le nom est maintenant valide.
  return true; // L39 — Renvoie true pour signaler la réussite.
} // L40 — Termine ce bloc conditionnel ou cette fonction.

champNom.addEventListener("blur", validerNom); // L42 — Valide le nom quand le focus quitte le champ (blur).

champNom.addEventListener("input", () => { // L44 — Écoute les changements de saisie du nom.
  if (champNom.getAttribute("aria-invalid") === "true") { // L45 — Ne revérifie pendant la saisie que si une erreur a déjà été annoncée.
    validerNom(); // L46 — Relance la validation du nom.
  } // L47 — Termine ce bloc conditionnel ou cette fonction.
}); // L48 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

const champEmail = document.querySelector("#email"); // L50 — Récupère le champ e-mail.
const erreurEmail = document.querySelector("#erreur-email"); // L51 — Récupère son paragraphe d’erreur.

const champMessage = document.querySelector("#message"); // L53 — Récupère la zone de texte du message.
const erreurMessage = document.querySelector("#erreur-message"); // L54 — Récupère son paragraphe d’erreur.

// Validation de l’adresse e-mail
function validerEmail() { // L57 — Déclare la validation de l’adresse e-mail.
  if (champEmail.validity.valueMissing) { // L58 — Lit la contrainte native required : une valeur manque.
    erreurEmail.textContent = "Veuillez saisir votre adresse e-mail."; // L59 — Explique que l’adresse est obligatoire.
    champEmail.setAttribute("aria-invalid", "true"); // L60 — Marque l’adresse comme invalide.
    return false; // L61 — Renvoie false.
  } // L62 — Termine ce bloc conditionnel ou cette fonction.

  if (champEmail.validity.typeMismatch) { // L64 — Lit la contrainte native type=email : le format ne correspond pas.
    erreurEmail.textContent = "Veuillez saisir une adresse e-mail valide."; // L65 — Explique le problème de format.
    champEmail.setAttribute("aria-invalid", "true"); // L66 — Marque l’adresse comme invalide.
    return false; // L67 — Renvoie false.
  } // L68 — Termine ce bloc conditionnel ou cette fonction.

  erreurEmail.textContent = ""; // L70 — Efface le message d’erreur e-mail.
  champEmail.setAttribute("aria-invalid", "false"); // L71 — Marque l’adresse comme valide.
  return true; // L72 — Renvoie true.
} // L73 — Termine ce bloc conditionnel ou cette fonction.

champEmail.addEventListener("blur", validerEmail); // L75 — Valide l’adresse quand le focus quitte le champ.

champEmail.addEventListener("input", () => { // L77 — Écoute la saisie de l’adresse.
  if (champEmail.getAttribute("aria-invalid") === "true") { // L78 — Ne revalide ici que si le champ était déjà en erreur.
    validerEmail(); // L79 — Relance la validation e-mail.
  } // L80 — Termine ce bloc conditionnel ou cette fonction.
}); // L81 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

function validerMessage() { // L83 — Déclare la validation du message.
  if (!champMessage.value.trim()) { // L84 — Refuse un message vide ou composé uniquement d’espaces.
    erreurMessage.textContent = "Veuillez saisir votre message."; // L85 — Affiche la consigne à côté de la zone de texte.
    champMessage.setAttribute("aria-invalid", "true"); // L86 — Annonce que le message est invalide.
    return false; // L87 — Renvoie false.
  } // L88 — Termine ce bloc conditionnel ou cette fonction.

  erreurMessage.textContent = ""; // L90 — Efface le message d’erreur sans vider la zone de texte.
  champMessage.setAttribute("aria-invalid", "false"); // L91 — Annonce que la zone de texte est valide.
  return true; // L92 — Renvoie true.
} // L93 — Termine ce bloc conditionnel ou cette fonction.

champMessage.addEventListener("blur", validerMessage); // L95 — Valide le message à la perte du focus.

champMessage.addEventListener("input", () => { // L97 — Écoute les modifications du message.
  if (champMessage.getAttribute("aria-invalid") === "true") { // L98 — Ne revalide ici que si une erreur était présente.
    validerMessage(); // L99 — Relance la validation du message.
  } // L100 — Termine ce bloc conditionnel ou cette fonction.
}); // L101 — Termine la fonction de rappel et l’enregistrement de cet écouteur.

// Envoi de démonstration
const formulaire = document.querySelector("#formulaire-inscription"); // L104 — Sélectionne le formulaire historique de contact.
const messageFormulaire = document.querySelector("#message-formulaire"); // L105 — Sélectionne sa région de résultat aria-live.

formulaire.addEventListener("submit", (event) => { // L107 — Écoute submit, que l’envoi provienne du bouton ou du clavier.
  event.preventDefault(); // L108 — Annule l’envoi HTML normal et son rechargement ; ce formulaire n’utilise pas method=dialog.

  const nomValide = validerNom(); // L110 — Valide le nom et mémorise le résultat.
  const emailValide = validerEmail(); // L111 — Valide aussi l’adresse, même si le nom est invalide.
  const messageValide = validerMessage(); // L112 — Valide aussi le message, pour afficher toutes les erreurs.

  if (!nomValide || !emailValide || !messageValide) { // L114 — Entre dans ce bloc dès qu’au moins une des trois validations échoue.
    messageFormulaire.textContent = ""; // L115 — Efface un éventuel ancien résultat global.

    const premierChampInvalide = // L117 — Déclare la référence au premier champ invalide.
      formulaire.querySelector('[aria-invalid="true"]'); // L118 — Cherche le premier champ marqué aria-invalid=true dans l’ordre du formulaire.

    premierChampInvalide.focus(); // L120 — Place le focus sur ce champ pour faciliter sa correction.
    return; // L121 — Arrête le traitement, sans annoncer de réussite.
  } // L122 — Termine ce bloc conditionnel ou cette fonction.

  messageFormulaire.textContent = // L124 — Prépare l’écriture du résultat dans la région live.
    "Votre demande de démonstration a été validée. Aucune donnée n’a été envoyée ni inscription à un atelier effectuée."; // L125 — Annonce uniquement une validation de démonstration : aucune inscription ni donnée envoyée.
}); // L126 — Termine la fonction de rappel et l’enregistrement de cet écouteur.
} // L127 — Termine ce bloc conditionnel ou cette fonction.

const navigation = document.querySelector('#navigation-principale'); // L129 — Sélectionne le conteneur de navigation.
function fermerMenu() { boutonMenu.setAttribute('aria-expanded', 'false'); } // L130 — Déclare une fonction qui ferme le menu en écrivant false dans ARIA ; le CSS suit cet attribut.
navigation.addEventListener('click', event => { // L131 — Délègue déjà les clics des liens à la navigation, mais le bouton mobile a encore son propre écouteur.
  if (event.target.closest('a') && getComputedStyle(boutonMenu).display !== 'none') { // L132 — closest retrouve le lien même si son enfant a été cliqué ; le style calculé vérifie le mode mobile.
    fermerMenu(); // L133 — Ferme le menu après l’activation du lien.
    boutonMenu.focus(); // L134 — Rend le focus au bouton mobile ; l’action native du lien n’est pas annulée.
  } // L135 — Termine ce bloc conditionnel ou cette fonction.
}); // L136 — Termine la fonction de rappel et l’enregistrement de cet écouteur.
document.addEventListener('keydown', event => { // L137 — Écoute les touches au niveau du document.
  if (event.key === 'Escape' && boutonMenu.getAttribute('aria-expanded') === 'true') { // L138 — Ne réagit qu’à Échap quand ARIA indique un menu ouvert.
    fermerMenu(); boutonMenu.focus(); // L139 — Ferme le menu puis rend le focus au bouton.
  } // L140 — Termine ce bloc conditionnel ou cette fonction.
}); // L141 — Termine la fonction de rappel et l’enregistrement de cet écouteur.
```

## La nouvelle organisation

### Un état, une fonction de rendu

Dans `main.js`, `etatInterface.menuOuvert` représente le choix mobile, `sousMenusOuverts` contient les identifiants des panneaux ouverts et `modaleOuverte` représente le dialog. `afficherInterface()` est le seul endroit qui écrit l’ouverture dans le DOM : ARIA, hidden, showModal et close. Le format large rend la navigation visible même si le menu mobile est fermé ; le bouton masqué porte alors aria-expanded=true, cohérent avec ses liens visibles.

Les gestionnaires changent cet état, puis appellent le rendu. Ils ne lisent plus aria-expanded pour décider quoi ouvrir. La lecture de `dialog.open` évite seulement de répéter une opération native. `cancel` traite Échap ; `close` synchronise une fermeture native et rend le focus. La modale de désinscription, déjà gérée séparément dans `compte.js`, conserve son fonctionnement.

### Délégation et sous-menus

Le bouton mobile et les liens ont maintenant un ancêtre commun : `nav#navigation-principale`. L’ancien conteneur de liens devient `div#liens-navigation`. `display: contents` conserve les positions des éléments dans la grille du header. Les anciennes règles visuelles de nav sont appliquées à `.liens-navigation` ; aucun nouveau style de carte n’est introduit.

Un seul écouteur **click** sur ce nav appelle `closest('button[aria-controls]')` pour retrouver le bouton activé, même depuis son icône. Pour un futur sous-menu, utiliser un bouton natif `type="button"`, `data-sous-menu`, `aria-controls` vers un panneau identifié situé dans les liens, et `aria-expanded="false"` ; le panneau commence avec `hidden`. Ce contrat accepte aussi les boutons ajoutés après le chargement, sans nouvel écouteur. Les panneaux peuvent être imbriqués. Fermer un parent ferme ses descendants ; Échap ferme d’abord le niveau contenant le focus.

Aucun menu ARIA de type application n’est créé : ce sont des liens de navigation et des boutons natifs. Entrée/Espace déclenchent déjà le clic des boutons ; aucun keydown supplémentaire n’est nécessaire pour ces touches. Entrée suit les liens ; Espace conserve le comportement natif d’un lien (défilement), sans être transformé artificiellement en activation. L’écouteur keydown existant est remplacé, pas doublonné. Les événements de modale, input, blur et submit gardent leurs fonctions distinctes.

### Validation et résultat

Dans les deux formulaires, chaque validation commence par `champ.checkValidity()` pour vérifier les contraintes HTML. Les règles particulières restent : nom non blanc, format d’adresse existant, mot de passe d’au moins huit caractères à la création et confirmation identique. Modifier le mot de passe revérifie une confirmation déjà remplie. `novalidate` permet au gestionnaire submit d’afficher les messages personnalisés ; il n’empêche pas l’appel explicite à checkValidity.

Les paragraphes d’erreur restent près des champs et sont référencés par aria-describedby. `aria-invalid` suit chaque résultat ; les messages de compte disposent aussi d’aria-live=polite. Aucun reset du formulaire n’efface les saisies.

À l’envoi : preventDefault évite l’action HTML par défaut ; un booléen enCours protège contre les doubles soumissions ; le bouton est désactivé et annonce « Inscription en cours… » pour la création (ou « Connexion en cours… » pour le login). `finally` rétablit le bouton, son texte et aria-busy. Les appels existants à creerCompte/authentifier continuent d’effectuer le travail. La réussite de création est annoncée sur la page de connexion ; une erreur reste sur place. Une erreur générale de création reçoit le focus sur le message ; une erreur de champ reçoit le focus sur le champ concerné.

Le formulaire d’accueil reste une **démonstration de contact**. Deux requestAnimationFrame laissent afficher son état temporaire, sans inventer de requête serveur. Son résultat précise qu’aucune donnée ni inscription n’a été envoyée. La réservation d’un atelier continue de passer par compte.js et stockage.js.

## Explication orale du focus

« Tab me fait avancer et Maj+Tab me fait reculer dans les éléments utilisables. Entrée et Espace activent les boutons natifs. Quand je ferme le menu avec Échap, je retrouve son bouton ; dans un sous-menu, je retrouve d’abord le bouton de ce sous-menu. Quand j’ouvre la modale, le navigateur place le focus dedans et empêche de partir sur la page derrière. À la fermeture, je retrouve le bouton d’ouverture. S’il est devenu désactivé après une inscription, je retrouve le titre de la page. Si le formulaire contient une erreur, le focus va au premier champ à corriger sans effacer mes réponses. »

Le titre ou le résultat reçoit tabindex=-1 seulement pour un focus programmatique : il ne crée pas une étape permanente dans la tabulation. La modale de désinscription conserve son retour au bouton si celui-ci existe encore, sinon au message du profil. Lors d’une navigation vers une autre page, le contexte du document change normalement ; aucun ancien élément de la page quittée ne reçoit de focus.

## Vérification

Les résultats exécutés et les limites sont consignés dans `docs/tp1-fm03-verification.md`. Les anciens rapports ne sont pas modifiés et ne prouvent pas les tests de ce TP.
