import { useRef } from 'react'
import type { AtelierCatalogue } from '../types'
import { useCompte } from '../hooks/useCompte'
import { useInscription } from '../hooks/useInscription'
import { placesDisponibles } from '../services/compte'
import BoutonInscription from './BoutonInscription'
import { codeAtelier, modale } from './styles'
export default function Reservation({ atelier, description, accueil = false }: { atelier: AtelierCatalogue; description?: string; accueil?: boolean }) {
  const dialogue = useRef<HTMLDialogElement>(null)
  const declencheur = useRef<HTMLDivElement>(null)
  const { utilisateur, inscriptions } = useCompte()
  const { reserver, message } = useInscription()
  const inscrit = inscriptions.some(i => i.utilisateurId === utilisateur?.id && i.atelierId === atelier.id)
  const disponible = { ...atelier, places: placesDisponibles(atelier, inscriptions) }
  return <>
    <div ref={declencheur} className={accueil ? '' : 'my-4'}><BoutonInscription atelier={disponible} inscrit={inscrit} reservation onInscrire={() => dialogue.current?.showModal()} className={accueil ? '' : 'w-full font-bold'} /></div>
    <dialog ref={dialogue} aria-labelledby={`reservation-${atelier.id}`} className={modale} onClose={() => declencheur.current?.querySelector('button')?.focus()}>
      <button autoFocus type="button" aria-label="Fermer la fenêtre de réservation" onClick={() => dialogue.current?.close()} className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-bordure bg-fond hover:border-accent hover:bg-lavande"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      <div className="flex items-center gap-2 pr-12 md:gap-3"><span className={codeAtelier} aria-hidden="true">{atelier.code}</span><span className="text-[0.75rem] font-bold text-accent-sombre md:text-[0.875rem]">{accueil ? 'Votre prochain atelier' : atelier.categorie}</span></div>
      <h2 id={`reservation-${atelier.id}`} className="mt-6 mb-2 text-[clamp(1.5rem,4vw,1.875rem)] leading-[1.25]">Réserver votre place</h2><h3 className="m-0 text-[1.125rem] text-accent-sombre">{atelier.nom}</h3>
      <p className="mt-3 mb-6 text-[#53576a]">{description ?? atelier.description}</p>
      <dl className="grid grid-cols-2 gap-4 border-y border-bordure py-5">{[['Niveau', atelier.niveau.split(' — ')[0]], ['Durée', atelier.duree], ['Horaires', atelier.horaires], ['Modalité', atelier.modalite]].map(([nom, valeur]) => <div key={nom}><dt className="mb-1 text-[0.75rem] font-bold tracking-[0.04em] text-[#53576a] uppercase">{nom}</dt><dd className="text-[0.875rem]">{valeur}</dd></div>)}</dl>
      <div className="mt-6 flex items-center justify-between gap-4"><p className="m-0"><span className="block text-[0.75rem] text-[#53576a]">Prix de l’atelier</span><strong className="text-[1.75rem]">{atelier.prix} €</strong></p><BoutonInscription atelier={disponible} inscrit={inscrit} onInscrire={() => reserver(atelier)} /></div>
      <p role="status" className="font-bold text-accent-sombre empty:m-0 not-empty:rounded-[10px] not-empty:bg-lavande not-empty:p-4">{message}</p><p className="mt-5 mb-0 text-center text-[0.75rem] text-[#53576a]">Inscription de démonstration. Aucun paiement n’est effectué.</p>
    </dialog>
  </>
}
