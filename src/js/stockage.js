/* Démonstration locale uniquement : aucune frontière de sécurité. */
window.SkillHub = (() => {
  const cles = {
    utilisateurs: 'skillhub_utilisateurs', session: 'skillhub_session',
    inscriptions: 'skillhub_inscriptions', attente: 'skillhub_atelier_en_attente'
  };
  const ateliers = [
    { id: 'html', nom: 'Découvrir le HTML', prix: '25 €', niveau: 'Débutant', duree: '2 heures', horaires: 'Chaque samedi, de 10 h à 12 h (heure de Paris)', modalite: 'À distance, en direct' },
    { id: 'javascript', nom: 'Premiers pas en JavaScript', prix: '40 €', niveau: 'Débutant — bases HTML conseillées', duree: '3 heures', horaires: 'Chaque mercredi, de 14 h à 17 h (heure de Paris)', modalite: 'À distance, en direct' },
    { id: 'css', nom: 'Maitriser le CSS', prix: '30 €', niveau: 'Débutant — bases HTML conseillées', duree: '2 heures', horaires: 'Chaque lundi, de 18 h à 20 h (heure de Paris)', modalite: 'À distance, en direct' },
    { id: 'ux', nom: 'Fondamentaux UX/UI', prix: '55 €', niveau: 'Tous niveaux', duree: '4 heures', horaires: 'Chaque jeudi, de 14 h à 18 h (heure de Paris)', modalite: 'À distance, en direct' },
    { id: 'react', nom: 'Introduction à React', prix: '45 €', niveau: 'Intermédiaire — JavaScript requis', duree: '3 heures', horaires: 'Chaque mardi, de 10 h à 13 h (heure de Paris)', modalite: 'À distance, en direct' },
    { id: 'a11y', nom: 'Web Accessible', prix: '35 €', niveau: 'Débutant — HTML/CSS conseillés', duree: '2 heures', horaires: 'Chaque vendredi, de 16 h à 18 h (heure de Paris)', modalite: 'À distance, en direct' }
  ];
  function lireJSON(cle, defaut = null) {
    try {
      const valeur = localStorage.getItem(cle);
      return valeur === null ? defaut : JSON.parse(valeur);
    } catch {
      return defaut;
    }
  }
  function ecrireJSON(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); }
    catch { throw new Error('Le stockage local est indisponible ou plein. Autorisez-le dans votre navigateur puis réessayez.'); }
  }
  function retirer(cle) {
    try { localStorage.removeItem(cle); }
    catch { throw new Error('Impossible de modifier le stockage local. Vérifiez les réglages de votre navigateur.'); }
  }
  function liste(cle, valide) {
    const valeur = lireJSON(cle, []);
    return Array.isArray(valeur) ? valeur.filter(item => item && valide(item)) : [];
  }
  const utilisateurs = () => liste(cles.utilisateurs, u => typeof u.id === 'string' && typeof u.nom === 'string' && typeof u.email === 'string' && /^[a-f0-9]{64}$/.test(u.hash));
  const inscriptions = () => liste(cles.inscriptions, i => typeof i.utilisateurId === 'string' && ateliers.some(a => a.id === i.atelierId));
  const normaliserEmail = email => email.trim().toLowerCase();
  async function hacher(motDePasse) {
    if (!window.crypto?.subtle) throw new Error('Cette démonstration nécessite HTTPS ou localhost pour protéger le stockage du mot de passe.');
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(motDePasse));
    return Array.from(new Uint8Array(hash), octet => octet.toString(16).padStart(2, '0')).join('');
  }
  async function creerCompte(nom, email, motDePasse) {
    email = normaliserEmail(email);
    if (!nom.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || motDePasse.length < 8) throw new Error('Vérifiez les informations de votre compte.');
    const hash = await hacher(motDePasse);
    const comptes = utilisateurs();
    if (comptes.some(u => u.email === email)) {
      const erreur = new Error('Un compte existe déjà avec cette adresse e-mail. Connectez-vous.');
      erreur.champ = 'email';
      throw erreur;
    }
    const utilisateur = { id: crypto.randomUUID(), nom: nom.trim(), email, hash };
    ecrireJSON(cles.utilisateurs, [...comptes, utilisateur]);
    return utilisateur;
  }
  async function authentifier(email, motDePasse) {
    const hash = await hacher(motDePasse);
    const utilisateur = utilisateurs().find(u => u.email === normaliserEmail(email) && u.hash === hash);
    if (!utilisateur) throw new Error('Adresse e-mail ou mot de passe incorrect.');
    ecrireJSON(cles.session, { utilisateurId: utilisateur.id });
    return utilisateur;
  }
  function utilisateurConnecte() {
    const session = lireJSON(cles.session);
    return utilisateurs().find(u => u.id === session?.utilisateurId) || null;
  }
  function dejaInscrit(utilisateurId, atelierId) {
    return inscriptions().some(i => i.utilisateurId === utilisateurId && i.atelierId === atelierId);
  }
  function inscrire(atelierId) {
    const utilisateur = utilisateurConnecte();
    if (!utilisateur) throw new Error('Connectez-vous pour vous inscrire.');
    if (!ateliers.some(a => a.id === atelierId)) throw new Error('Cet atelier est introuvable.');
    if (dejaInscrit(utilisateur.id, atelierId)) return false;
    ecrireJSON(cles.inscriptions, [...inscriptions(), { utilisateurId: utilisateur.id, atelierId, date: new Date().toISOString() }]);
    return true;
  }
  function desinscrire(atelierId) {
    const utilisateur = utilisateurConnecte();
    if (!utilisateur) throw new Error('Connectez-vous pour gérer vos inscriptions.');
    const avant = inscriptions();
    const apres = avant.filter(i => !(i.utilisateurId === utilisateur.id && i.atelierId === atelierId));
    if (avant.length === apres.length) return false;
    ecrireJSON(cles.inscriptions, apres);
    return true;
  }
  function atelierEnAttente() {
    const id = lireJSON(cles.attente);
    return ateliers.find(a => a.id === id) || null;
  }
  return { cles, ateliers, lireJSON, ecrireJSON, creerCompte, authentifier, utilisateurConnecte,
    fermerSession: () => retirer(cles.session), inscriptions, dejaInscrit, inscrire, desinscrire,
    atelierEnAttente, effacerAttente: () => retirer(cles.attente) };
})();
