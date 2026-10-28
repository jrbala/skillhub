// Valeurs réellement présentes dans src/js/stockage.js, sans normaliser les libellés.
export type Niveau =
  | 'Débutant'
  | 'Débutant — bases HTML conseillées'
  | 'Tous niveaux'
  | 'Intermédiaire — JavaScript requis'
  | 'Débutant — HTML/CSS conseillés';

export interface Atelier {
  id: 'html' | 'javascript' | 'css' | 'ux' | 'react' | 'a11y';
  nom: string;
  prix: string; // Texte affiché, par exemple « 25 € ».
  niveau: Niveau;
  duree: string;
  horaires: string;
  modalite: string;
  code: string;
  categorie: string;
  description: string;
  ouvert: boolean;
}

export interface Inscription {
  utilisateurId: string;
  atelierId: Atelier['id'];
  date: string; // Date ISO produite par new Date().toISOString().
}

// Le catalogue utilise un prix numérique pour le tri, sans changer les comptes du TP2.
export interface AtelierCatalogue extends Omit<Atelier, 'id' | 'prix' | 'niveau'> {
  id: string;
  prix: number;
  niveau: Niveau | 'Intermédiaire';
  places: number;
  formateur: string;
}

export interface FiltresAteliers {
  recherche: string;
  niveau: '' | 'Débutant' | 'Intermédiaire' | 'Tous niveaux';
  tri: 'defaut' | 'croissant' | 'decroissant';
}
