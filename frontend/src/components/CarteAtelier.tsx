import type { AtelierCatalogue } from '../types'

interface ProprietesCarteAtelier {
  atelier: AtelierCatalogue
  inscrit: boolean
  onInscrire: (atelier: AtelierCatalogue) => void
}

export default function CarteAtelier({ atelier, inscrit, onInscrire }: ProprietesCarteAtelier) {
  const complet = atelier.places === 0
  const indisponible = inscrit || complet || !atelier.ouvert
  const libelle = inscrit ? 'Déjà inscrit' : complet ? 'Atelier complet' : !atelier.ouvert ? 'Inscriptions fermées' : "S'inscrire"
  const prix = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(atelier.prix)

  return (
    <article aria-labelledby={`titre-${atelier.id}`} className="flex h-full min-w-0 flex-col gap-5 rounded-carte border border-bordure bg-surface p-6 shadow-carte">
      <div className="flex items-center gap-3 text-accent-sombre">
        <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lavande font-bold">{atelier.code}</span>
        <span className="text-sm font-bold">{atelier.categorie}</span>
      </div>
      <h2 id={`titre-${atelier.id}`} className="text-xl font-bold">{atelier.nom}</h2>
      <p>{atelier.description}</p>
      <dl className="space-y-2 text-sm">
        <div><dt className="font-bold">Niveau</dt><dd>{atelier.niveau}</dd></div>
        <div><dt className="font-bold">Places disponibles</dt><dd>{atelier.places}</dd></div>
        <div><dt className="font-bold">Prix</dt><dd className="text-2xl font-bold">{prix}</dd></div>
      </dl>
      <button
        type="button"
        aria-disabled={indisponible}
        aria-label={`${libelle} : ${atelier.nom}`}
        onClick={() => { if (!indisponible) onInscrire(atelier) }}
        className="mt-auto min-h-11 cursor-pointer rounded-lg bg-accent px-4 py-3 font-bold text-surface hover:bg-accent-sombre aria-disabled:cursor-default aria-disabled:bg-lavande aria-disabled:text-accent-sombre"
      >
        {libelle}
      </button>
    </article>
  )
}
