const formulaireDemo = document.querySelector('#formulaire-inscription');
if (formulaireDemo) {
  const champs = [...formulaireDemo.querySelectorAll('input, textarea')];
  const message = document.querySelector('#message-formulaire');
  const bouton = formulaireDemo.querySelector('[type="submit"]');
  let enCours = false;
  function validerChamp(champ) {
    const valideNatif = champ.checkValidity();
    let erreur = '';
    if (!champ.value.trim()) {
      erreur = { nom: 'Veuillez saisir votre nom.', email: 'Veuillez saisir votre adresse e-mail.', message: 'Veuillez saisir votre message.' }[champ.id];
    } else if (!valideNatif) {
      erreur = champ.type === 'email' ? 'Veuillez saisir une adresse e-mail valide.' : 'Veuillez vérifier ce champ.';
    }
    document.getElementById(`erreur-${champ.id}`).textContent = erreur;
    champ.setAttribute('aria-invalid', String(Boolean(erreur)));
    return !erreur;
  }
  champs.forEach(champ => {
    champ.addEventListener('blur', () => validerChamp(champ));
    champ.addEventListener('input', () => validerChamp(champ));
  });
  formulaireDemo.addEventListener('submit', async event => {
    event.preventDefault();
    if (enCours) return;
    const valides = champs.map(validerChamp);
    if (valides.includes(false)) {
      message.textContent = 'Veuillez corriger les champs indiqués.';
      champs.find(champ => champ.getAttribute('aria-invalid') === 'true').focus();
      return;
    }
    enCours = true;
    const texteInitial = bouton.textContent;
    bouton.disabled = true;
    bouton.textContent = 'Inscription en cours…';
    formulaireDemo.setAttribute('aria-busy', 'true');
    message.textContent = 'Inscription en cours…';
    try {
      // Laisser le navigateur afficher l’état ; aucun appel réseau ni inscription réelle.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      message.textContent = 'Votre demande de démonstration a été validée. Aucune donnée n’a été envoyée ni inscription à un atelier effectuée.';
    } finally {
      enCours = false;
      bouton.disabled = false;
      bouton.textContent = texteInitial;
      formulaireDemo.removeAttribute('aria-busy');
      message.setAttribute('tabindex', '-1');
      message.focus();
    }
  });
}

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
  carrossel.addEventListener('catalogue:actualise', updateBoutons);
  
  // Initialiser l'état
  updateBoutons();

  boutonPrecedent.addEventListener('click', () => {
    const cardWidth = (carrossel.querySelector('.carte')?.clientWidth ?? 0) + 16; // 1rem gap
    carrossel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  boutonSuivant.addEventListener('click', () => {
    const cardWidth = (carrossel.querySelector('.carte')?.clientWidth ?? 0) + 16;
    carrossel.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });
}
