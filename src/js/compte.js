(() => {
  const app = window.SkillHub;
  const pageProfil = document.body.dataset.page === 'profil';
  const zoneNavigation = document.querySelector('[data-navigation-compte]');
  function annoncer(zone, texte, erreur = false) {
    if (!zone) return;
    zone.textContent = texte;
    zone.classList.toggle('est-erreur', erreur);
  }
  function element(tag, texte, classe) {
    const noeud = document.createElement(tag);
    noeud.textContent = texte;
    if (classe) noeud.className = classe;
    return noeud;
  }
  // Le stockage seul ne suffit pas : une visite ordinaire ne reprend pas un ancien choix.
  function atelierDuParcours() {
    const id = new URLSearchParams(location.search).get('atelier');
    const attente = app.atelierEnAttente();
    return attente?.id === id ? attente : null;
  }
  function cheminCompte(page, params = new URLSearchParams()) {
    const atelier = atelierDuParcours();
    if (atelier) params.set('atelier', atelier.id);
    const recherche = params.toString();
    return page + (recherche ? `?${recherche}` : '');
  }
  function navigation() {
    zoneNavigation.replaceChildren();
    const connecte = app.utilisateurConnecte();
    const lien = element('a', connecte ? 'Mon espace' : 'Se connecter', 'bouton bouton-secondaire');
    lien.href = connecte ? 'profil.html' : 'connexion.html';
    zoneNavigation.append(lien);
    if (connecte) {
      const bouton = element('button', 'Se déconnecter', 'bouton');
      bouton.type = 'button';
      bouton.dataset.deconnexion = '';
      zoneNavigation.append(bouton);
    } else {
      const creation = element('a', 'Créer mon compte', 'bouton');
      creation.href = 'inscription.html';
      zoneNavigation.append(creation);
    }
  }
  const messageGlobal = element('p', '', 'message-statut');
  messageGlobal.setAttribute('role', 'status');
  messageGlobal.setAttribute('aria-live', 'polite');
  document.querySelector('main').prepend(messageGlobal);
  const inscriptionsEnCours = new Set();
  function actualiserBoutonsAteliers() {
    const utilisateur = app.utilisateurConnecte();
    document.querySelectorAll('[data-atelier], [data-reserver-atelier]').forEach(bouton => {
      const isReserver = bouton.hasAttribute('data-reserver-atelier');
      const id = isReserver ? bouton.dataset.reserverAtelier : bouton.dataset.atelier;
      const enCours = inscriptionsEnCours.has(id);
      const inscrit = utilisateur && app.dejaInscrit(utilisateur.id, id);
      bouton.disabled = enCours || Boolean(inscrit);
      bouton.classList.toggle('est-inscrit', Boolean(inscrit));
      if (enCours) bouton.setAttribute('aria-busy', 'true');
      else bouton.removeAttribute('aria-busy');
      
      const texteNormal = isReserver ? 'Réserver ma place' : 'S’inscrire';
      bouton.textContent = enCours ? 'Inscription en cours…' : inscrit ? 'Déjà inscrit' : texteNormal;
    });
  }
  document.addEventListener('click', async event => {
    if (event.target.closest('[data-deconnexion]')) {
      try { app.fermerSession(); window.location.href = 'index.html'; }
      catch (erreur) { annoncer(messageGlobal, erreur.message, true); }
    }
    const bouton = event.target.closest('[data-atelier]');
    if (!bouton || bouton.disabled || inscriptionsEnCours.has(bouton.dataset.atelier)) return;
    const atelier = app.ateliers.find(a => a.id === bouton.dataset.atelier);
    if (!atelier) return;
    const zone = bouton.closest('dialog')
      ? document.querySelector('#message-modale')
      : document.getElementById(`message-${atelier.id}`);
    inscriptionsEnCours.add(atelier.id);
    actualiserBoutonsAteliers();
    annoncer(zone, 'Inscription en cours…');
    try {
      if (!app.utilisateurConnecte()) {
        app.ecrireJSON(app.cles.attente, atelier.id);
        annoncer(zone, 'Connectez-vous pour confirmer votre inscription.');
        window.location.href = `connexion.html?atelier=${encodeURIComponent(atelier.id)}`;
        return;
      }
      const inscrit = await app.inscrire(atelier.id);
      annoncer(zone, inscrit ? `Votre inscription à « ${atelier.nom} » est confirmée (${atelier.prix}). Retrouvez-la dans « Mon espace ». Aucun paiement n’est effectué.` : `Vous êtes déjà inscrit à « ${atelier.nom} ». Retrouvez cet atelier dans « Mon espace ».`);
      zone.tabIndex = -1;
      zone.focus({ preventScroll: true });
      zone.scrollIntoView({ block: 'nearest' });
    } catch (erreur) {
      annoncer(zone, erreur.message, true);
      zone.tabIndex = -1;
      zone.focus({ preventScroll: true });
      zone.scrollIntoView({ block: 'nearest' });
    } finally {
      inscriptionsEnCours.delete(atelier.id);
      actualiserBoutonsAteliers();
    }
  });
  actualiserBoutonsAteliers();
  navigation();

  const formulaire = document.querySelector('#formulaire-compte');
  if (formulaire) {
    const creation = formulaire.dataset.mode === 'creation';
    const champs = [...formulaire.querySelectorAll('input')];
    const message = document.querySelector('#message-compte');
    function actualiserParcours() {
      const attente = atelierDuParcours();
      const resume = document.querySelector('#atelier-en-attente');
      resume.hidden = !attente;
      resume.textContent = attente ? `Votre atelier : ${attente.nom} · ${attente.prix}. Vous confirmerez votre inscription après la connexion.` : '';
      document.querySelectorAll('[data-poursuivre-compte]').forEach(lien => {
        lien.href = cheminCompte(creation ? 'connexion.html' : 'inscription.html');
      });
    }
    actualiserParcours();
    window.addEventListener('pageshow', actualiserParcours);
    window.addEventListener('storage', actualiserParcours);
    if (!creation && new URLSearchParams(location.search).has('compte')) annoncer(message, 'Votre compte a été créé. Connectez-vous pour continuer.');
    function erreurChamp(champ, texte) {
      document.getElementById(`erreur-${champ.id}`).textContent = texte;
      champ.setAttribute('aria-invalid', String(Boolean(texte)));
      return !texte;
    }
    function valider(champ) {
      let texte = '';
      if (!champ.value || (champ.type !== 'password' && !champ.value.trim())) {
        texte = { nom: 'Veuillez saisir votre nom.', email: 'Veuillez saisir votre adresse e-mail.', 'mot-de-passe': 'Veuillez saisir votre mot de passe.', confirmation: 'Veuillez confirmer votre mot de passe.' }[champ.id];
      } else if (champ.id === 'email' && (champ.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value.trim()))) {
        texte = 'Veuillez saisir une adresse e-mail valide.';
      } else if (creation && champ.id === 'mot-de-passe' && champ.value.length < 8) {
        texte = 'Le mot de passe doit contenir au moins 8 caractères.';
      } else if (champ.id === 'confirmation' && champ.value !== document.querySelector('#mot-de-passe').value) {
        texte = 'Les deux mots de passe doivent être identiques.';
      }
      return erreurChamp(champ, texte);
    }
    champs.forEach(champ => {
      champ.addEventListener('blur', () => valider(champ));
      champ.addEventListener('input', () => {
        if (champ.getAttribute('aria-invalid') === 'true') valider(champ);
      });
    });
    let enCours = false;
    formulaire.addEventListener('submit', async event => {
      event.preventDefault();
      if (enCours) return;
      const valides = champs.map(valider);
      if (valides.includes(false)) {
        annoncer(message, 'Veuillez corriger les champs indiqués.', true);
        champs.find(champ => champ.getAttribute('aria-invalid') === 'true').focus();
        return;
      }
      enCours = true;
      const bouton = formulaire.querySelector('[type="submit"]');
      bouton.disabled = true;
      formulaire.setAttribute('aria-busy', 'true');
      annoncer(message, 'Vérification en cours…');
      try {
        const email = document.querySelector('#email').value;
        const motDePasse = document.querySelector('#mot-de-passe').value;
        if (creation) {
          await app.creerCompte(document.querySelector('#nom').value, email, motDePasse);
          window.location.href = cheminCompte('connexion.html', new URLSearchParams({ compte: 'cree' }));
        } else {
          await app.authentifier(email, motDePasse);
          window.location.href = cheminCompte('profil.html');
        }
      } catch (erreur) {
        annoncer(message, erreur.message, true);
        if (erreur.champ) {
          const champ = document.getElementById(erreur.champ);
          erreurChamp(champ, erreur.message);
          champ.focus();
        } else if (!creation) {
          erreurChamp(document.querySelector('#email'), erreur.message);
          document.querySelector('#email').focus();
        }
      } finally {
        enCours = false;
        bouton.disabled = false;
        formulaire.removeAttribute('aria-busy');
      }
    });
  }
  function afficherProfil() {
    const utilisateur = app.utilisateurConnecte();
    if (!utilisateur) {
      document.querySelector('#profil').hidden = true;
      window.location.replace(cheminCompte('connexion.html'));
      return;
    }
    document.querySelector('#profil').hidden = false;
    document.querySelector('#profil-nom').textContent = utilisateur.nom;
    document.querySelector('#profil-email').textContent = utilisateur.email;
    document.querySelector('#profil-initiale').textContent = utilisateur.nom.trim().charAt(0).toUpperCase();
    const liste = document.querySelector('#mes-ateliers');
    liste.replaceChildren();
    const ateliers = app.ateliers.filter(a => app.dejaInscrit(utilisateur.id, a.id));
    document.querySelector('#aucune-inscription').hidden = ateliers.length > 0;
    document.querySelector('#nombre-ateliers').textContent = ateliers.length;
    ateliers.forEach(atelier => {
      const carte = element('article', '', 'carte carte-atelier');
      const entete = element('div', '', 'atelier-entete');
      const icone = element('span', atelier.id === 'html' ? '</>' : 'JS', 'atelier-code');
      icone.setAttribute('aria-hidden', 'true');
      entete.append(icone, element('span', 'Inscription confirmée', 'atelier-categorie'));
      const titre = element('h3', atelier.nom, 'titre');
      titre.id = `inscription-${atelier.id}`;
      const infos = element('dl', '', 'informations-atelier');
      [['Niveau', atelier.niveau], ['Durée', atelier.duree], ['Horaires', atelier.horaires], ['Modalité', atelier.modalite]].forEach(([label, valeur]) => {
        const ligne = element('div', '');
        ligne.append(element('dt', label), element('dd', valeur));
        infos.append(ligne);
      });
      const pied = element('div', '', 'atelier-pied');
      const prix = element('p', '', 'atelier-prix');
      prix.append(element('span', 'Prix de l’atelier'), element('strong', atelier.prix));
      const retirer = element('button', 'Se désinscrire', 'bouton bouton-danger-secondaire');
      retirer.type = 'button';
      retirer.dataset.desinscrire = atelier.id;
      retirer.setAttribute('aria-describedby', titre.id);
      pied.append(prix, retirer);
      carte.append(entete, titre, infos, pied);
      liste.append(carte);
    });
    const attente = atelierDuParcours();
    document.querySelector('#confirmation-atelier').hidden = !attente;
    if (attente) document.querySelector('#detail-attente').textContent = `${attente.nom} — ${attente.prix}. ${attente.horaires}. ${attente.modalite}. Démonstration sans paiement.`;
  }
  if (pageProfil) {
    afficherProfil();
    const message = document.querySelector('#message-profil');
    const dialog = document.querySelector('#dialog-desinscription');
    const confirmer = document.querySelector('#confirmer-desinscription');
    const erreurSuppression = document.querySelector('#erreur-desinscription');
    let selectionSuppression = null;
    let declencheurSuppression = null;
    document.querySelector('#mes-ateliers').addEventListener('click', event => {
      const bouton = event.target.closest('[data-desinscrire]');
      if (!bouton) return;
      const utilisateur = app.utilisateurConnecte();
      if (!utilisateur) { afficherProfil(); return; }
      const atelier = app.ateliers.find(a => a.id === bouton.dataset.desinscrire);
      if (!atelier) return;
      selectionSuppression = { atelier, utilisateurId: utilisateur.id };
      declencheurSuppression = bouton;
      document.querySelector('#detail-desinscription').textContent = `Vous allez vous désinscrire de « ${atelier.nom} » (${atelier.prix}).`;
      erreurSuppression.textContent = '';
      dialog.showModal();
    });
    document.querySelector('#garder-inscription').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      selectionSuppression = null;
      if (declencheurSuppression?.isConnected) declencheurSuppression.focus();
      else message.focus();
    });
    confirmer.addEventListener('click', () => {
      if (!selectionSuppression || confirmer.disabled) return;
      confirmer.disabled = true;
      confirmer.setAttribute('aria-busy', 'true');
      try {
        const utilisateur = app.utilisateurConnecte();
        if (utilisateur?.id !== selectionSuppression.utilisateurId) {
          throw new Error('Votre session a changé. Fermez cette fenêtre et réessayez depuis votre espace.');
        }
        const atelier = selectionSuppression.atelier;
        app.desinscrire(atelier.id);
        afficherProfil();
        annoncer(message, `Votre inscription à « ${atelier.nom} » a été annulée.`);
        dialog.close();
      } catch (erreur) { annoncer(erreurSuppression, erreur.message, true); }
      finally {
        confirmer.disabled = false;
        confirmer.removeAttribute('aria-busy');
      }
    });

    document.querySelector('#confirmer-atelier').addEventListener('click', async event => {
      const bouton = event.currentTarget;
      if (bouton.disabled) return;
      bouton.disabled = true;
      bouton.setAttribute('aria-busy', 'true');
      bouton.textContent = 'Inscription en cours…';
      try {
        if (!app.utilisateurConnecte()) { afficherProfil(); return; }
        const attente = atelierDuParcours();
        if (!attente) { afficherProfil(); return; }
        const inscrit = await app.inscrire(attente.id);
        app.effacerAttente();
        afficherProfil();
        annoncer(message, inscrit ? `Votre inscription à « ${attente.nom} » est confirmée (${attente.prix}). Aucun paiement n’est effectué.` : `Vous êtes déjà inscrit à « ${attente.nom} ». Aucune inscription supplémentaire n’a été créée.`);
        message.tabIndex = -1;
        message.focus();
      } catch (erreur) { annoncer(message, erreur.message, true); }
      finally {
        bouton.disabled = false;
        bouton.removeAttribute('aria-busy');
        bouton.textContent = 'Confirmer mon inscription';
      }
    });
    document.querySelector('#annuler-atelier').addEventListener('click', () => {
      try {
        app.effacerAttente();
        afficherProfil();
        annoncer(message, 'La demande d’inscription a été annulée.');
        message.tabIndex = -1;
        message.focus();
      } catch (erreur) { annoncer(message, erreur.message, true); }
    });
  }
  // Revalider aussi après un retour arrière et une déconnexion dans un autre onglet.
  function synchroniser() {
    navigation();
    actualiserBoutonsAteliers();
    if (pageProfil) afficherProfil();
  }
  window.addEventListener('pageshow', synchroniser);
  window.addEventListener('storage', synchroniser);
})();
