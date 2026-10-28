function estAtelier(valeur) {
    if (typeof valeur !== 'object' || valeur === null)
        return false;
    const a = valeur;
    const textes = ['id', 'nom', 'formateur', 'description', 'duree', 'horaires', 'modalite', 'code', 'categorie'];
    const niveaux = ['Débutant', 'Débutant — bases HTML conseillées', 'Tous niveaux', 'Intermédiaire — JavaScript requis', 'Débutant — HTML/CSS conseillés', 'Intermédiaire'];
    return textes.every(cle => typeof a[cle] === 'string' && a[cle].trim().length > 0)
        && typeof a.id === 'string' && /^[a-z0-9-]+$/.test(a.id)
        && typeof a.niveau === 'string' && niveaux.includes(a.niveau)
        && typeof a.prix === 'number' && Number.isFinite(a.prix) && a.prix >= 0
        && typeof a.places === 'number' && Number.isInteger(a.places) && a.places >= 0
        && typeof a.ouvert === 'boolean';
}
export async function chargerAteliers(signal) {
    try {
        const response = await fetch(new URL('../../ateliers.json', import.meta.url), { signal, cache: 'no-store' });
        if (!response.ok)
            throw new Error(`Impossible de charger les ateliers (HTTP ${response.status}).`);
        const donnees = await response.json();
        if (!Array.isArray(donnees) || !donnees.every(estAtelier)
            || new Set(donnees.map(a => a.id)).size !== donnees.length) {
            throw new Error('Le fichier des ateliers contient des données invalides.');
        }
        return donnees;
    }
    catch (erreur) {
        if (signal.aborted)
            throw erreur;
        if (erreur instanceof TypeError)
            throw new Error('Connexion impossible. Vérifiez votre connexion puis réessayez.');
        if (erreur instanceof SyntaxError)
            throw new Error('Le fichier des ateliers est illisible.');
        throw erreur;
    }
}
