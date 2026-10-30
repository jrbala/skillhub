import type { AtelierCatalogue } from '../types'
import { bouton } from './styles'
export default function BoutonInscription({ atelier, inscrit, onInscrire, reservation = false, className = '' }: {
  atelier: AtelierCatalogue; inscrit: boolean; onInscrire: () => void; reservation?: boolean; className?: string
}) {
  const indisponible = inscrit || !atelier.ouvert || atelier.places === 0
  const libelle = inscrit ? 'Déjà inscrit' : atelier.places === 0 ? 'Atelier complet' : !atelier.ouvert ? 'Inscriptions fermées' : reservation ? 'Réserver ma place' : 'S’inscrire'
  return <button type="button" aria-disabled={indisponible} aria-label={`${libelle} : ${atelier.nom}`} onClick={() => { if (!indisponible) onInscrire() }} className={`${bouton} aria-disabled:cursor-default aria-disabled:border-bordure aria-disabled:bg-lavande aria-disabled:text-accent-sombre ${className}`}>{libelle}</button>
}
