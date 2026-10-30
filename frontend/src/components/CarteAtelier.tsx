import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { AtelierCatalogue } from '../types'
import BoutonInscription from './BoutonInscription'
import { bouton, codeAtelier, modale, secondaire } from './styles'
interface ProprietesCarteAtelier {
  atelier: AtelierCatalogue
  inscrit: boolean
  onInscrire: (atelier: AtelierCatalogue) => void
  inscriptionDirecte?: boolean
}
export default function CarteAtelier({ atelier, inscrit, onInscrire, inscriptionDirecte = false }: ProprietesCarteAtelier) {
  const dialogue = useRef<HTMLDialogElement>(null)
  const declencheur = useRef<HTMLButtonElement>(null)
  const prix = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(atelier.prix)
  return <>
    <article aria-labelledby={`titre-${atelier.id}`} className="flex h-full min-w-0 flex-col gap-5 rounded-carte border border-bordure bg-surface p-7 shadow-carte hover:border-accent [&>*]:m-0">
      <div className="flex items-center gap-3"><span aria-hidden="true" className={codeAtelier}>{atelier.code}</span><span className="text-[0.875rem] font-bold text-accent-sombre">{atelier.categorie}</span></div>
      <h3 id={`titre-${atelier.id}`} className="text-[1.375rem] leading-[1.35]">{atelier.nom}</h3><p>{atelier.description}</p>
      <ul className="flex list-none flex-wrap gap-2 p-0 [&>li]:rounded-md [&>li]:px-[0.6rem] [&>li]:py-[0.3rem] [&>li]:text-[0.75rem]">
        <li className={atelier.ouvert ? 'bg-[#e0f2fe] font-bold text-[#0369a1]' : 'bg-[#fee2e2] font-bold text-[#b91c1c]'}>{atelier.ouvert ? 'Ouvert' : 'Fermé'}</li>
        {[atelier.niveau.split(' — ')[0], atelier.duree, `${atelier.places} place(s) disponible(s)`, atelier.formateur, atelier.modalite.split(', ')[0]].map(texte => <li key={texte} className="bg-fond text-[#53576a]">{texte}</li>)}
      </ul>
      <div className="!mt-auto flex items-center justify-between gap-4"><p className="m-0"><span className="block text-[0.75rem] text-[#53576a]">Prix</span><strong className="text-[1.75rem]">{prix}</strong></p><button ref={declencheur} type="button" aria-label={`Voir la fiche : ${atelier.nom}`} className="cursor-pointer border-0 bg-transparent py-2 text-left text-accent-sombre" onClick={() => dialogue.current?.showModal()}>Voir la fiche <span aria-hidden="true">→</span></button></div>
      {inscriptionDirecte && <BoutonInscription atelier={atelier} inscrit={inscrit} onInscrire={() => onInscrire(atelier)} />}
    </article>
    <dialog ref={dialogue} aria-labelledby={`fiche-${atelier.id}`} className={modale} onClose={() => declencheur.current?.focus()}>
      <button autoFocus type="button" className={secondaire} onClick={() => dialogue.current?.close()}>Retour au catalogue</button>
      <h2 id={`fiche-${atelier.id}`} className="mt-6 mb-2 text-[clamp(1.5rem,4vw,1.875rem)] leading-[1.25]">{atelier.nom}</h2><p>{atelier.description}</p>
      <dl className="grid grid-cols-2 gap-4 border-y border-bordure py-5">{[['Niveau', atelier.niveau], ['Prix', prix], ['Places disponibles', String(atelier.places)], ['Formateur', atelier.formateur], ['Durée', atelier.duree], ['Horaires', atelier.horaires], ['Modalité', atelier.modalite]].map(([nom, valeur]) => <div key={nom}><dt className="mb-1 text-[0.75rem] font-bold tracking-[0.04em] text-[#53576a] uppercase">{nom}</dt><dd className="text-[0.875rem]">{valeur}</dd></div>)}</dl>
      <Link className={bouton} to={`/ateliers/${atelier.id}`}>Voir le programme et les inscriptions</Link>
    </dialog>
  </>
}
