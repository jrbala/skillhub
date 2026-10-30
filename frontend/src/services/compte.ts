import type { AtelierCatalogue } from '../types'
export interface Utilisateur { id: string; nom: string; email: string; hash: string }
export interface Inscription { utilisateurId: string; atelierId: string; date?: string }
const cles = { utilisateurs: 'skillhub_utilisateurs', session: 'skillhub_session', inscriptions: 'skillhub_inscriptions' }
function lire(cle: string): unknown {
  try { return JSON.parse(localStorage.getItem(cle) ?? 'null') }
  catch { throw new Error('Le stockage local est indisponible ou contient des données illisibles.') }
}
function ecrire(cle: string, valeur: unknown) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)) }
  catch { throw new Error('Le stockage local est indisponible ou plein. Aucune modification enregistrée.') }
  window.dispatchEvent(new Event('skillhub:stockage'))
}
function utilisateurs(): Utilisateur[] {
  const valeur = lire(cles.utilisateurs)
  if (valeur === null) return []
  if (!Array.isArray(valeur) || !valeur.every(u => u && typeof u.id === 'string' && typeof u.nom === 'string' && typeof u.email === 'string' && /^[a-f0-9]{64}$/.test(u.hash))) throw new Error('Les comptes enregistrés sont invalides.')
  return valeur
}
export function inscriptions(): Inscription[] {
  const valeur = lire(cles.inscriptions)
  if (valeur === null) return []
  if (!Array.isArray(valeur) || !valeur.every(i => i && typeof i.utilisateurId === 'string' && typeof i.atelierId === 'string')) throw new Error('Les inscriptions enregistrées sont invalides.')
  return valeur.filter((i, index) => valeur.findIndex(a => a.utilisateurId === i.utilisateurId && a.atelierId === i.atelierId) === index)
}
export function utilisateurConnecte() {
  const session = lire(cles.session) as { utilisateurId?: string } | null
  return utilisateurs().find(u => u.id === session?.utilisateurId) ?? null
}
async function hacher(motDePasse: string) {
  if (!crypto.subtle) throw new Error('Utilisez HTTPS ou localhost pour cette démonstration.')
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(motDePasse))
  return Array.from(new Uint8Array(hash), octet => octet.toString(16).padStart(2, '0')).join('')
}
// Compatibilité avec les comptes scolaires précédents ; ceci n’est pas une authentification de production.
export async function creerCompte(nom: string, email: string, motDePasse: string) {
  email = email.trim().toLowerCase()
  if (!nom.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || motDePasse.length < 8) throw new Error('Vérifiez les informations du compte.')
  const hash = await hacher(motDePasse)
  const comptes = utilisateurs()
  if (comptes.some(u => u.email === email)) throw new Error('Un compte existe déjà avec cette adresse e-mail.')
  ecrire(cles.utilisateurs, [...comptes, { id: crypto.randomUUID(), nom: nom.trim(), email, hash }])
}
export async function connecter(email: string, motDePasse: string) {
  const hash = await hacher(motDePasse)
  const utilisateur = utilisateurs().find(u => u.email === email.trim().toLowerCase() && u.hash === hash)
  if (!utilisateur) throw new Error('Adresse e-mail ou mot de passe incorrect.')
  ecrire(cles.session, { utilisateurId: utilisateur.id })
}
export function deconnecter() { ecrire(cles.session, null) }
export function placesDisponibles(atelier: AtelierCatalogue, liste: Inscription[]) {
  return Math.max(0, atelier.places - liste.filter(i => i.atelierId === atelier.id).length)
}
export function inscrire(atelier: AtelierCatalogue) {
  const utilisateur = utilisateurConnecte()
  if (!utilisateur) throw new Error('Connectez-vous pour vous inscrire.')
  const liste = inscriptions()
  if (liste.some(i => i.utilisateurId === utilisateur.id && i.atelierId === atelier.id)) return false
  if (placesDisponibles(atelier, liste) === 0) throw new Error('Cet atelier est complet.')
  if (!atelier.ouvert) throw new Error('Les inscriptions sont fermées.')
  ecrire(cles.inscriptions, [...liste, { utilisateurId: utilisateur.id, atelierId: atelier.id, date: new Date().toISOString() }])
  return true
}
export function desinscrire(atelierId: string, utilisateurId: string) {
  if (utilisateurConnecte()?.id !== utilisateurId) throw new Error('Votre session a changé. Réessayez depuis votre espace.')
  ecrire(cles.inscriptions, inscriptions().filter(i => !(i.utilisateurId === utilisateurId && i.atelierId === atelierId)))
}
