import type { AtelierCatalogue, FiltresAteliers } from './types.js';
import { chargerAteliers } from './ateliers.js';

function element<T extends HTMLElement>(id: string): T {
  const cible = document.getElementById(id);
  if (!cible) throw new Error(`Élément manquant : ${id}`);
  return cible as T;
}
const liste = element<HTMLDivElement>('liste-ateliers-demo');
const compteur = element<HTMLParagraphElement>('compteur-ateliers');
const chargement = element<HTMLDivElement>('chargement-ateliers');
const erreurPanneau = element<HTMLDivElement>('erreur-ateliers');
const vide = element<HTMLParagraphElement>('vide-ateliers');
const recherche = element<HTMLInputElement>('recherche-ateliers');
const niveau = element<HTMLSelectElement>('niveau-ateliers');
const tri = element<HTMLSelectElement>('tri-ateliers');
const fiche = element<HTMLDialogElement>('fiche-atelier');
const filtres: FiltresAteliers = { recherche: '', niveau: '', tri: 'defaut' };
let ateliers: AtelierCatalogue[] = [];
let statut: 'chargement' | 'erreur' | 'succes' = 'chargement';
let controleur: AbortController | null = null;
let delaiFiltres: number | null = null;
let declencheur: HTMLButtonElement | null = null;
const formaterPrix = (prix: number): string => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
const normaliser = (texte: string): string => texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();

function ouvrirFiche(atelier: AtelierCatalogue, bouton: HTMLButtonElement): void {
  declencheur = bouton;
  element('titre-fiche').textContent = atelier.nom;
  element('description-fiche').textContent = atelier.description;
  const informations = element('informations-fiche');
  informations.replaceChildren();
  const details: Record<string, string> = { Niveau: atelier.niveau, Prix: formaterPrix(atelier.prix), 'Places disponibles': String(atelier.places), Formateur: atelier.formateur, Durée: atelier.duree, Horaires: atelier.horaires, Modalité: atelier.modalite };
  for (const [nom, valeur] of Object.entries(details)) {
    const ligne = document.createElement('div');
    const terme = document.createElement('dt');
    const description = document.createElement('dd');
    terme.textContent = nom;
    description.textContent = valeur;
    ligne.append(terme, description);
    informations.append(ligne);
  }
  const programme = element<HTMLAnchorElement>('programme-fiche');
  // Seuls ces six programmes disposent déjà d’une page et du parcours d’inscription.
  programme.hidden = !['html', 'javascript', 'css', 'ux', 'react', 'a11y'].includes(atelier.id);
  if (!programme.hidden) programme.href = `cours-${atelier.id}.html`;
  else programme.removeAttribute('href');
  fiche.showModal();
}
element('retour-catalogue').addEventListener('click', () => fiche.close());
fiche.addEventListener('close', () => declencheur?.focus());
function creerCarteAtelier(atelier: AtelierCatalogue): HTMLElement {
  function creerElement<K extends keyof HTMLElementTagNameMap>(balise: K, texte: string = '', classe: string = ''): HTMLElementTagNameMap[K] {
    const element = document.createElement(balise);
    element.textContent = texte;
    if (classe) element.className = classe;
    return element;
  }

  const carte = creerElement('article', '', 'carte carte-atelier');
  const entete = creerElement('div', '', 'atelier-entete');
  const code = creerElement('span', atelier.code, 'atelier-code');
  code.setAttribute('aria-hidden', 'true');
  entete.append(code, creerElement('span', atelier.categorie, 'atelier-categorie'));

  const titre = creerElement('h3', atelier.nom, 'titre');
  titre.id = `titre-${atelier.id}`;
  const description = creerElement('p', atelier.description);
  const apercu = creerElement('ul', '', 'atelier-apercu');
  // Les cartes affichent les versions courtes des informations détaillées.
  apercu.append(
    creerElement('li', atelier.ouvert ? 'Ouvert' : 'Fermé', atelier.ouvert ? 'statut-ouvert' : 'statut-ferme'),
    creerElement('li', atelier.niveau.split(' — ')[0]),
    creerElement('li', atelier.duree),
    creerElement('li', `${atelier.places} place(s) disponible(s)`),
    creerElement('li', atelier.formateur),
    creerElement('li', atelier.modalite.split(', ')[0])
  );

  const pied = creerElement('div', '', 'atelier-pied');
  const prix = creerElement('p', '', 'atelier-prix');
  prix.append(creerElement('span', 'Prix'), creerElement('strong', formaterPrix(atelier.prix)));
  const lien = creerElement('button', 'Voir la fiche ', 'lien-programme');
  lien.type = 'button';
  lien.setAttribute('aria-label', `Voir la fiche : ${atelier.nom}`);
  lien.addEventListener('click', () => ouvrirFiche(atelier, lien));
  const fleche = creerElement('span', '→');
  fleche.setAttribute('aria-hidden', 'true');
  lien.append(fleche);
  pied.append(prix, lien);
  carte.append(entete, titre, description, apercu, pied);
  return carte;
}


function afficherCatalogue(): void {
  chargement.hidden = statut !== 'chargement';
  erreurPanneau.hidden = statut !== 'erreur';
  liste.setAttribute('aria-busy', String(statut === 'chargement'));
  const resultats = statut === 'succes' ? ateliers.filter(a =>
    normaliser(`${a.nom} ${a.description} ${a.formateur}`).includes(normaliser(filtres.recherche))
    && (!filtres.niveau || a.niveau.split(' — ')[0] === filtres.niveau)) : [];
  if (filtres.tri !== 'defaut') resultats.sort((a, b) => filtres.tri === 'croissant' ? a.prix - b.prix : b.prix - a.prix);
  vide.hidden = statut !== 'succes' || resultats.length > 0;
  compteur.textContent = statut === 'chargement' ? 'Chargement des ateliers…' : statut === 'erreur' ? 'Catalogue indisponible.' : `${resultats.length} atelier${resultats.length === 1 ? '' : 's'} trouvé${resultats.length === 1 ? '' : 's'}.`;
  liste.replaceChildren(...resultats.map(creerCarteAtelier));
  liste.scrollLeft = 0;
  liste.dispatchEvent(new Event('catalogue:actualise'));
}

function mettreAJourFiltres(modifications: Partial<FiltresAteliers>): void {
  Object.assign(filtres, modifications);
  if (modifications.recherche !== undefined) recherche.value = filtres.recherche;
  niveau.value = filtres.niveau;
  tri.value = filtres.tri;
  afficherCatalogue();
}
const suggestions = element<HTMLUListElement>('suggestions-ateliers');
let choixSuggestions: AtelierCatalogue[] = [];
let suggestionActive: number = -1;
let suggestionsAutorisees: boolean = false;

function fermerSuggestions(): void {
  suggestions.hidden = true;
  recherche.setAttribute('aria-expanded', 'false');
  recherche.removeAttribute('aria-activedescendant');
  suggestionActive = -1;
}

function afficherSuggestions(): void {
  fermerSuggestions();
  const texte = normaliser(recherche.value);
  choixSuggestions = texte && statut === 'succes'
    ? ateliers.filter(a => normaliser(a.nom).includes(texte)).slice(0, 6) : [];
  suggestions.replaceChildren(...choixSuggestions.map((atelier, index) => {
    const option = document.createElement('li');
    option.id = `suggestion-${index}`;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.textContent = atelier.nom;
    // Le focus reste dans le champ pour les lecteurs d’écran et le clavier.
    option.addEventListener('pointerdown', event => event.preventDefault());
    option.addEventListener('click', () => choisirSuggestion(index));
    return option;
  }));
  if (suggestionsAutorisees && choixSuggestions.length && document.activeElement === recherche) {
    suggestions.hidden = false;
    recherche.setAttribute('aria-expanded', 'true');
  }
}

function choisirSuggestion(index: number): void {
  const atelier = choixSuggestions[index];
  if (!atelier) return;
  annulerDelaiFiltres();
  fermerSuggestions();
  mettreAJourFiltres({ recherche: atelier.nom });
  fermerSuggestions();
  recherche.focus();
}

recherche.addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (event.key === 'Escape') {
    suggestionsAutorisees = false;
    event.preventDefault();
    event.stopPropagation();
    fermerSuggestions();
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (delaiFiltres !== null) return;
    suggestionsAutorisees = true;
    if (suggestions.hidden) afficherSuggestions();
    if (!choixSuggestions.length) return;
    event.preventDefault();
    suggestionActive = event.key === 'ArrowDown'
      ? (suggestionActive + 1) % choixSuggestions.length
      : (suggestionActive <= 0 ? choixSuggestions.length : suggestionActive) - 1;
    [...suggestions.children].forEach((option, index) => {
      option.setAttribute('aria-selected', String(index === suggestionActive));
      if (index === suggestionActive) {
        recherche.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  } else if (event.key === 'Enter' && !suggestions.hidden && suggestionActive >= 0) {
    event.preventDefault();
    choisirSuggestion(suggestionActive);
  }
});
recherche.addEventListener('blur', () => {
  suggestionsAutorisees = false;
  fermerSuggestions();
});
document.addEventListener('pointerdown', event => {
  if (event.target instanceof Node && !recherche.parentElement?.contains(event.target)) fermerSuggestions();
});

// Debounce : chaque saisie relance les 500 ms, sans masquer les résultats actuels.
recherche.addEventListener('input', () => {
  suggestionsAutorisees = true;
  fermerSuggestions();
  annulerDelaiFiltres();
  delaiFiltres = window.setTimeout(() => {
    delaiFiltres = null;
    mettreAJourFiltres({ recherche: recherche.value });
    afficherSuggestions();
  }, 500);
});
niveau.addEventListener('change', () => {
  const valeur = niveau.value;
  if (valeur === '' || valeur === 'Débutant' || valeur === 'Intermédiaire' || valeur === 'Tous niveaux') mettreAJourFiltres({ niveau: valeur });
});
tri.addEventListener('change', () => {
  const valeur = tri.value;
  if (valeur === 'defaut' || valeur === 'croissant' || valeur === 'decroissant') mettreAJourFiltres({ tri: valeur });
});
const formulaire = element<HTMLFormElement>('filtres-ateliers');
formulaire.addEventListener('submit', event => event.preventDefault());

function annulerDelaiFiltres(): void {
  if (delaiFiltres !== null) window.clearTimeout(delaiFiltres);
  delaiFiltres = null;
}
formulaire.addEventListener('reset', event => {
  event.preventDefault();
  annulerDelaiFiltres();
  fermerSuggestions();
  mettreAJourFiltres({ recherche: '', niveau: '', tri: 'defaut' });
});

async function chargerCatalogue(): Promise<void> {
  annulerDelaiFiltres();
  fermerSuggestions();
  controleur?.abort();
  const requete = new AbortController();
  controleur = requete;
  const restaurerFocus = document.activeElement === element('reessayer-ateliers');
  statut = 'chargement';
  afficherCatalogue();
  if (restaurerFocus) recherche.focus();
  try {
    const donnees = await chargerAteliers(requete.signal);
    if (requete.signal.aborted || controleur !== requete) return;
    ateliers = donnees;
    statut = 'succes';
  } catch (erreur: unknown) {
    if (requete.signal.aborted || controleur !== requete) return;
    statut = 'erreur';
    element('texte-erreur-ateliers').textContent = erreur instanceof Error ? erreur.message : 'Une erreur inattendue est survenue. Réessayez.';
  } finally {
    if (controleur === requete && !requete.signal.aborted) {
      controleur = null;
      afficherCatalogue();
    }
  }
}
element('reessayer-ateliers').addEventListener('click', () => void chargerCatalogue());
// Les filtres sont locaux : aucune nouvelle requête à chaque frappe.
window.addEventListener('pagehide', () => {
  annulerDelaiFiltres();
  fermerSuggestions();
  controleur?.abort();
  controleur = null;
  chargement.hidden = true;
  liste.setAttribute('aria-busy', 'false');
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  mettreAJourFiltres({ recherche: recherche.value });
  if (statut === 'chargement') void chargerCatalogue();
});
void chargerCatalogue();
