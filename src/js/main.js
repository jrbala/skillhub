const boutonMenu = document.querySelector(".menu-toggle");

boutonMenu.addEventListener("click", () => {
  const menuOuvert =
    boutonMenu.getAttribute("aria-expanded") === "true";
    boutonMenu.setAttribute("aria-expanded", String(!menuOuvert));
});

const boutonOuvrirModale = document.querySelector(".ouvrir-modale");
const boutonFermerModale = document.querySelector(".fermer-modale");
const modaleAtelier = document.querySelector("#modale-atelier");

boutonOuvrirModale?.addEventListener("click", () => {
  modaleAtelier.showModal();
});

boutonFermerModale?.addEventListener("click", () => {
  modaleAtelier.close();
});

modaleAtelier?.addEventListener("close", () => {
  boutonOuvrirModale.focus();
});

if (document.querySelector("#formulaire-inscription")) {
// Validation du formulaire de démonstration
const champNom = document.querySelector("#nom");
const erreurNom = document.querySelector("#erreur-nom");

function validerNom() {
  if (!champNom.value.trim()) {
    erreurNom.textContent = "Veuillez saisir votre nom.";
    champNom.setAttribute("aria-invalid", "true");
    return false;
  }

  erreurNom.textContent = "";
  champNom.setAttribute("aria-invalid", "false");
  return true;
}

champNom.addEventListener("blur", validerNom);

champNom.addEventListener("input", () => {
  if (champNom.getAttribute("aria-invalid") === "true") {
    validerNom();
  }
});

const champEmail = document.querySelector("#email");
const erreurEmail = document.querySelector("#erreur-email");

const champMessage = document.querySelector("#message");
const erreurMessage = document.querySelector("#erreur-message");

// Validation de l’adresse e-mail
function validerEmail() {
  if (champEmail.validity.valueMissing) {
    erreurEmail.textContent = "Veuillez saisir votre adresse e-mail.";
    champEmail.setAttribute("aria-invalid", "true");
    return false;
  }

  if (champEmail.validity.typeMismatch) {
    erreurEmail.textContent = "Veuillez saisir une adresse e-mail valide.";
    champEmail.setAttribute("aria-invalid", "true");
    return false;
  }

  erreurEmail.textContent = "";
  champEmail.setAttribute("aria-invalid", "false");
  return true;
}

champEmail.addEventListener("blur", validerEmail);

champEmail.addEventListener("input", () => {
  if (champEmail.getAttribute("aria-invalid") === "true") {
    validerEmail();
  }
});

function validerMessage() {
  if (!champMessage.value.trim()) {
    erreurMessage.textContent = "Veuillez saisir votre message.";
    champMessage.setAttribute("aria-invalid", "true");
    return false;
  }

  erreurMessage.textContent = "";
  champMessage.setAttribute("aria-invalid", "false");
  return true;
}

champMessage.addEventListener("blur", validerMessage);

champMessage.addEventListener("input", () => {
  if (champMessage.getAttribute("aria-invalid") === "true") {
    validerMessage();
  }
});

// Envoi de démonstration
const formulaire = document.querySelector("#formulaire-inscription");
const messageFormulaire = document.querySelector("#message-formulaire");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  const nomValide = validerNom();
  const emailValide = validerEmail();
  const messageValide = validerMessage();

  if (!nomValide || !emailValide || !messageValide) {
    messageFormulaire.textContent = "";

    const premierChampInvalide =
      formulaire.querySelector('[aria-invalid="true"]');

    premierChampInvalide.focus();
    return;
  }

  messageFormulaire.textContent =
    "Votre demande de démonstration a été validée. Aucune donnée n’a été envoyée ni inscription à un atelier effectuée.";
});
}

const navigation = document.querySelector('#navigation-principale');
function fermerMenu() { boutonMenu.setAttribute('aria-expanded', 'false'); }
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && getComputedStyle(boutonMenu).display !== 'none') {
    fermerMenu();
    boutonMenu.focus();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && boutonMenu.getAttribute('aria-expanded') === 'true') {
    fermerMenu(); boutonMenu.focus();
  }
});

// Logique du carrossel
const carrossel = document.querySelector('#liste-ateliers-demo');
const boutonPrecedent = document.querySelector('.carrossel-precedent');
const boutonSuivant = document.querySelector('.carrossel-suivant');

if (carrossel && boutonPrecedent && boutonSuivant) {
  const updateBoutons = () => {
    // Tolérance de 1px pour les arrondis
    boutonPrecedent.hidden = carrossel.scrollLeft <= 1;
    boutonSuivant.hidden = carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.clientWidth - 1;
  };

  carrossel.addEventListener('scroll', updateBoutons);
  window.addEventListener('resize', updateBoutons);
  
  // Initialiser l'état
  updateBoutons();

  boutonPrecedent.addEventListener('click', () => {
    const cardWidth = carrossel.querySelector('.carte').clientWidth + 16; // 1rem gap
    carrossel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  boutonSuivant.addEventListener('click', () => {
    const cardWidth = carrossel.querySelector('.carte').clientWidth + 16;
    carrossel.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });
}
