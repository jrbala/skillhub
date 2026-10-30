import { useEffect, useState } from 'react'
import CarteAtelier from '../components/CarteAtelier'
import { chargerAteliers } from '../services/ateliers'
import type { AtelierCatalogue } from '../types'

function normaliser(texte: string) {
  return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim()
}

export default function Catalogue() {
  const [ateliers, definirAteliers] = useState<AtelierCatalogue[]>([])
  const [recherche, definirRecherche] = useState('')
  const [inscriptions, definirInscriptions] = useState<string[]>([])
  const [chargement, definirChargement] = useState(true)
  const [erreur, definirErreur] = useState('')

  useEffect(() => {
    const controleur = new AbortController()
    chargerAteliers(controleur.signal)
      .then(donnees => { if (!controleur.signal.aborted) definirAteliers(donnees) })
      .catch((cause: unknown) => {
        if (!controleur.signal.aborted) definirErreur(cause instanceof Error ? cause.message : 'Impossible de charger les ateliers.')
      })
      .finally(() => { if (!controleur.signal.aborted) definirChargement(false) })
    return () => controleur.abort()
  }, [])

  // La liste filtrée est calculée à chaque rendu, sans état supplémentaire.
  const resultats = ateliers.filter(atelier => normaliser(atelier.nom).includes(normaliser(recherche)))

  function inscrire(atelier: AtelierCatalogue) {
    if (!atelier.ouvert || atelier.places === 0) return
    definirInscriptions(actuelles => actuelles.includes(atelier.id) ? actuelles : [...actuelles, atelier.id])
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Les ateliers SkillHub</h1>
      <p className="mt-3 mb-8">Développez vos compétences et apprenez ensemble, un atelier à la fois.</p>
      <div className="mb-5 max-w-xl">
        <label htmlFor="recherche" className="mb-2 block font-bold">Rechercher un atelier par titre</label>
        <input id="recherche" type="search" value={recherche} onChange={evenement => definirRecherche(evenement.target.value)} className="min-h-11 w-full rounded-lg border border-accent-sombre bg-surface px-4 py-3" />
      </div>
      <p aria-live="polite" aria-atomic="true" className="mb-6">
        {chargement ? 'Chargement des ateliers…' : erreur ? 'Catalogue indisponible.' : `${resultats.length} atelier${resultats.length === 1 ? '' : 's'} trouvé${resultats.length === 1 ? '' : 's'}.`}
      </p>
      <p role="status" className="mb-6 text-accent-sombre">
        {inscriptions.length > 0 ? `${inscriptions.length} inscription${inscriptions.length === 1 ? '' : 's'} confirmée${inscriptions.length === 1 ? '' : 's'} pour cette visite.` : ''}
      </p>
      {erreur && <p role="alert" className="text-erreur">{erreur}</p>}
      {!chargement && !erreur && resultats.length === 0 && <p>Aucun atelier ne correspond à votre recherche.</p>}
      <ul aria-label="Ateliers" aria-busy={chargement} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resultats.map(atelier => {
          const inscrit = inscriptions.includes(atelier.id)
          return (
            <li key={atelier.id}>
              <CarteAtelier atelier={{ ...atelier, places: Math.max(0, atelier.places - (inscrit ? 1 : 0)) }} inscrit={inscrit} onInscrire={inscrire} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
