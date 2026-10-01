const boutonMenu = document.querySelector(".menu-toggle");

boutonMenu.addEventListener("click", () => {
  const menuOuvert =
    boutonMenu.getAttribute("aria-expanded") === "true";
    boutonMenu.setAttribute("aria-expanded", String(!menuOuvert));
});

const boutonOuvrirModale = document.querySelector(".ouvrir-modale");
const boutonFermerModale = document.querySelector(".fermer-modale");
const modaleAtelier = document.querySelector("#modale-atelier");

boutonOuvrirModale.addEventListener("click", () => {
  modaleAtelier.showModal();
});

boutonFermerModale.addEventListener("click", () => {
  modaleAtelier.close();
});

modaleAtelier.addEventListener("close", () => {
  boutonOuvrirModale.focus();
});

//Validação do nome
const champNom = document.querySelector("#nom");
const erreurNom = document.querySelector("#erreur-nom");

function validerNom() {
  if (champNom.validity.valueMissing) {
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

//Validação do e-mail
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

//Validação do formulário
const formulaire = document.querySelector("#formulaire-inscription");
const messageFormulaire = document.querySelector("#message-formulaire");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  const nomValide = validerNom();
  const emailValide = validerEmail();

  if (!nomValide || !emailValide) {
    messageFormulaire.textContent = "";

    const premierChampInvalide =
      formulaire.querySelector('[aria-invalid="true"]');

    premierChampInvalide.focus();
    return;
  }

  messageFormulaire.textContent =
    "Votre inscription a bien été enregistrée.";
});