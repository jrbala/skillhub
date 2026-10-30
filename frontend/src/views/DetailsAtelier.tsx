import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAteliers } from '../hooks/useAteliers'
import { useTitre } from '../hooks/useTitre'
import { programmes } from '../services/programmes'
import EtatCatalogue from '../components/EtatCatalogue'
import Reservation from '../components/Reservation'
import { surtitre } from '../components/styles'
import Introuvable from './Introuvable'
import fernanda from '../../../src/assets/images/formateur-1-320.webp'
import joseph from '../../../src/assets/images/formateur-2-320.webp'
import dominique from '../../../src/assets/images/formateur-3-320.webp'
const portraits: Record<string, string> = { 'Fernanda Maria': fernanda, 'Joseph Ricardo': joseph, 'Dominique Laurent': dominique }
const specialites: Record<string, string> = { html: 'Spécialiste HTML & CSS', css: 'Spécialiste HTML & CSS', javascript: 'Développeur Frontend', react: 'Développeur React', ux: 'Product Designer', a11y: 'Expert Accessibilité' }
export default function DetailsAtelier() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { ateliers, chargement, erreur } = useAteliers()
  const atelier = ateliers.find(a => a.id === id)
  useTitre(atelier?.nom ?? 'Détails de l’atelier', atelier?.description)
  if (chargement || erreur) return <div className="mx-auto max-w-contenu p-6"><EtatCatalogue /></div>
  if (!atelier) return <Introuvable />
  const contenu = programmes[atelier.id]
  return <div className="mx-auto max-w-contenu px-6 pt-8 pb-16">
    <div className="py-8">
      <span className={surtitre}>{atelier.categorie}</span><h1 className="my-4 max-w-[24ch] leading-[1.15]">{atelier.nom}</h1><p className="text-[1.125rem] text-[#53576a]">{contenu?.introduction ?? atelier.description}</p>
    </div>
    {params.has('confirmation') && <p role="status" className="rounded-[10px] bg-lavande p-4 text-accent-sombre">Vérifiez les informations, puis choisissez « Réserver ma place » pour confirmer votre inscription. <Link to="/ateliers" className="underline">Annuler</Link></p>}
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
      <div className="min-w-0">
        {contenu ? <>
          <section className="mb-8 border-b border-bordure pb-8"><h2 className="mt-0">Objectifs de l'atelier</h2><ul className="list-disc pl-5 marker:text-accent-sombre">{contenu.objectifs.map(o => <li key={o} className="my-3 pl-[0.4rem]">{o}</li>)}</ul></section>
          <section className="mb-8 border-b border-bordure pb-8"><h2 className="mt-0">Programme détaillé</h2><ol className="grid list-none gap-4 p-0">{contenu.programme.map(p => <li key={p.titre} className="flex flex-col items-start gap-2 rounded-xl border border-bordure bg-surface p-5 md:flex-row md:gap-4"><span className="shrink-0 rounded-md bg-lavande px-2 py-1 text-[0.75rem] font-bold text-accent-sombre">{p.duree}</span><div><h3 className="m-0 text-[1.0625rem]">{p.titre}</h3><p className="mb-0 text-[0.9375rem] text-[#53576a]">{p.description}</p></div></li>)}</ol></section>
        </> : <p>Retrouvez ci-contre les informations disponibles pour cet atelier.</p>}
      </div>
      <aside aria-label="Informations et inscription" className="self-start rounded-carte border border-bordure bg-surface p-6 shadow-carte lg:sticky lg:top-6">
        <h2 className="mt-0 text-[1.25rem]">S'inscrire</h2>
        <dl>{[['Niveau', atelier.niveau.split(' — ')[0]], ['Durée', atelier.duree], ['Horaires', atelier.id === 'html' ? atelier.horaires : atelier.horaires.replace(' (heure de Paris)', '')], ['Modalité', atelier.modalite]].map(([nom, valeur]) => <div key={nom} className="mb-2"><dt className="font-bold">{nom}</dt><dd>{valeur}</dd></div>)}</dl>
        <p className="mt-6 mb-0"><span className="block text-[0.75rem] text-[#53576a]">Prix de l’atelier</span><strong className="text-[1.75rem]">{atelier.prix} €</strong></p>
        <Reservation atelier={atelier} description={contenu?.introduction} />
        <p className="mt-9 mb-0 text-center text-[0.75rem] text-[#53576a]">Ceci est une démonstration. Aucun paiement réel.</p>
        <hr className="my-6 border-0 border-t border-bordure" />
        <div className="flex items-start gap-4"><img src={portraits[atelier.formateur]} alt={`Portrait de ${atelier.formateur}`} width="80" height="80" className="h-20 w-20 shrink-0 rounded-xl object-cover" /><div><h3 className="mt-0 text-[1rem]">{atelier.formateur}</h3><p className="m-0 text-[0.875rem] text-[#53576a]">{specialites[atelier.id] ?? atelier.categorie}</p></div></div>
      </aside>
    </div>
  </div>
}
