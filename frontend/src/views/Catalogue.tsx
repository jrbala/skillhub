import { useEffect, useRef, useState } from 'react'
import { champ, secondaire, section } from '../components/styles'
import RechercheAteliers from '../components/RechercheAteliers'
import CarteAtelier from '../components/CarteAtelier'
import EtatCatalogue from '../components/EtatCatalogue'
import { useAteliers } from '../hooks/useAteliers'
import { useCompte } from '../hooks/useCompte'
import { useInscription } from '../hooks/useInscription'
import { useTitre } from '../hooks/useTitre'
import { placesDisponibles } from '../services/compte'
function normaliser(texte: string) { return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim() }
export default function Catalogue({ accueil = false }: { accueil?: boolean }) {
  const { ateliers, chargement, erreur } = useAteliers()
  const { utilisateur, inscriptions } = useCompte()
  const { reserver, message } = useInscription()
  const [recherche, definirRecherche] = useState('')
  const [niveau, definirNiveau] = useState('')
  const [tri, definirTri] = useState('')
  const [disponible, definirDisponible] = useState(false)
  const [bords, definirBords] = useState({ debut: true, fin: false })
  const carrousel = useRef<HTMLUListElement>(null)
  useTitre(accueil ? 'Ateliers et partage de compétences' : 'Les ateliers')
  const resultats = ateliers.filter(a => normaliser(`${a.nom} ${a.description} ${a.formateur}`).includes(normaliser(recherche)) && (!niveau || a.niveau.startsWith(niveau)) && (!disponible || (a.ouvert && placesDisponibles(a, inscriptions) > 0))).sort((a, b) => tri === 'croissant' ? a.prix - b.prix : tri === 'decroissant' ? b.prix - a.prix : 0)
  const signature = resultats.map(a => a.id).join(',')
  useEffect(() => {
    const liste = carrousel.current
    if (!liste || !accueil) return
    const actualiser = () => definirBords({ debut: liste.scrollLeft <= 1, fin: liste.scrollLeft >= liste.scrollWidth - liste.clientWidth - 1 })
    liste.scrollLeft = 0
    const observateur = new ResizeObserver(actualiser)
    observateur.observe(liste)
    liste.addEventListener('scroll', actualiser)
    return () => { observateur.disconnect(); liste.removeEventListener('scroll', actualiser) }
  }, [accueil, signature])
  function defiler(direction: number) {
    const liste = carrousel.current
    if (liste) liste.scrollBy({ left: direction * ((liste.firstElementChild?.clientWidth ?? 0) + 16), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const Titre = accueil ? 'h2' : 'h1'
  return <section id="ateliers" tabIndex={-1} className={section}>
    <Titre>{accueil ? 'Nos ateliers' : 'Les ateliers SkillHub'}</Titre>
    <p>Ateliers de démonstration : aucune réservation réelle ni aucun paiement.</p>
    <p role="status" className="font-bold text-accent-sombre empty:m-0">{message}</p>
    <form role="search" aria-label="Filtrer les ateliers" className="mx-auto flex w-full max-w-[42rem] flex-wrap items-end gap-4 border-l-4 border-accent bg-[rgba(221,224,235,0.231)] p-6" onSubmit={e => e.preventDefault()} onReset={() => { definirRecherche(''); definirNiveau(''); definirTri(''); definirDisponible(false) }}>
      <RechercheAteliers ateliers={ateliers} recherche={recherche} modifier={definirRecherche} />
      <div className="mb-4 flex-[1_1_12rem]"><label htmlFor="niveau" className="mb-2 block font-bold">Niveau</label><select id="niveau" value={niveau} onChange={e => definirNiveau(e.target.value)} className={champ}><option value="">Tous les niveaux</option>{['Débutant', 'Intermédiaire', 'Tous niveaux'].map(n => <option key={n}>{n}</option>)}</select></div>
      <div className="mb-4 flex-[1_1_12rem]"><label htmlFor="tri" className="mb-2 block font-bold">Trier par prix</label><select id="tri" value={tri} onChange={e => definirTri(e.target.value)} className={champ}><option value="">Ordre du catalogue</option><option value="croissant">Prix croissant</option><option value="decroissant">Prix décroissant</option></select></div>
      {!accueil && <label className="mb-2 flex items-center gap-3 font-bold"><input type="checkbox" checked={disponible} onChange={e => definirDisponible(e.target.checked)} />Places disponibles uniquement</label>}
      <button type="reset" className={`${secondaire} mx-auto block`}>Réinitialiser les filtres</button>
    </form>
    <EtatCatalogue />
    {!chargement && !erreur && <p aria-live="polite">{resultats.length} atelier{resultats.length !== 1 ? 's' : ''} trouvé{resultats.length !== 1 ? 's' : ''}.</p>}
    {!chargement && !erreur && resultats.length === 0 && <p>Aucun atelier trouvé. Essayez un autre mot ou réinitialisez les filtres.</p>}
    <div className="relative flex items-center">
      {accueil && <button hidden={bords.debut || !resultats.length} aria-label="Voir les ateliers précédents" className="absolute top-1/2 -left-4 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-bordure bg-surface shadow-[0_4px_18px_rgb(37_40_58/10%)] hover:border-accent hover:text-accent-sombre" onClick={() => defiler(-1)}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" /></svg></button>}
      <ul ref={carrousel} aria-label="Ateliers" aria-busy={chargement} className={accueil ? 'm-0 grid w-full auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:auto-cols-[calc(50%-0.5rem)] [&::-webkit-scrollbar]:hidden' : 'm-0 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3'}>
        {resultats.map(atelier => <li key={atelier.id} className="min-w-0 snap-start"><CarteAtelier atelier={{ ...atelier, places: placesDisponibles(atelier, inscriptions) }} inscrit={inscriptions.some(i => i.utilisateurId === utilisateur?.id && i.atelierId === atelier.id)} onInscrire={() => reserver(atelier)} inscriptionDirecte={!accueil} /></li>)}
      </ul>
      {accueil && <button hidden={bords.fin || !resultats.length} aria-label="Voir les ateliers suivants" className="absolute top-1/2 -right-4 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-bordure bg-surface shadow-[0_4px_18px_rgb(37_40_58/10%)] hover:border-accent hover:text-accent-sombre" onClick={() => defiler(1)}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" /></svg></button>}
    </div>
  </section>
}
