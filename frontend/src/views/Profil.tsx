import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompte } from '../hooks/useCompte'
import { useAteliers } from '../hooks/useAteliers'
import { useTitre } from '../hooks/useTitre'
import { desinscrire, deconnecter } from '../services/compte'
import { bouton, secondaire, section, surtitre, codeAtelier, modale } from '../components/styles'
import EtatCatalogue from '../components/EtatCatalogue'
export default function Profil() {
  const { utilisateur, inscriptions } = useCompte()
  const { ateliers, chargement, erreur } = useAteliers()
  const [selection, definirSelection] = useState<{ id: string; nom: string; prix: number; utilisateurId: string } | null>(null)
  const [message, definirMessage] = useState('')
  const dialogue = useRef<HTMLDialogElement>(null)
  const declencheur = useRef<HTMLButtonElement | null>(null)
  const statut = useRef<HTMLParagraphElement>(null)
  const naviguer = useNavigate()
  function sortir() {
    try { deconnecter(); naviguer('/') }
    catch (cause) { definirMessage(cause instanceof Error ? cause.message : 'Déconnexion impossible.') }
  }
  useTitre('Mon espace')
  if (!utilisateur) return null
  const mesAteliers = ateliers.filter(a => inscriptions.some(i => i.utilisateurId === utilisateur.id && i.atelierId === a.id))
  return <section className={section}>
    <p className={surtitre}>VOTRE PARCOURS SKILLHUB</p><h1 className="my-2">Mon espace</h1><p className="mb-8 text-[#53576a]">Retrouvez vos ateliers et préparez votre prochaine étape.</p>
    <div className="mb-6 flex flex-wrap items-center gap-5 rounded-carte border border-bordure bg-surface p-6 md:flex-nowrap">
      <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-carte bg-lavande text-[1.5rem] font-bold text-accent-sombre">{utilisateur.nom.trim().charAt(0).toUpperCase()}</span>
      <div className="min-w-0"><h2 className="m-0 text-[1.25rem]">{utilisateur.nom}</h2><p className="m-0 text-[0.9375rem] text-[#53576a] [overflow-wrap:anywhere]">{utilisateur.email}</p></div>
      <p className="m-0 ml-auto w-full shrink-0 border-t border-bordure pt-4 md:w-auto md:border-t-0 md:border-l md:pt-0 md:pl-6"><strong className="block text-[1.75rem] text-accent-sombre">{mesAteliers.length}</strong><span className="text-[0.8125rem] text-[#53576a]">Inscriptions</span></p>
    </div>
    <p ref={statut} tabIndex={-1} role="status" className="font-bold text-accent-sombre empty:m-0 not-empty:rounded-[10px] not-empty:border not-empty:border-accent not-empty:bg-lavande not-empty:p-4 not-empty:text-[0.875rem]">{message}</p>
    <div className="mt-8 mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="m-0">Mes ateliers</h2><Link to="/ateliers" className={secondaire}>Explorer les ateliers</Link></div>
    <EtatCatalogue />
    {!chargement && !erreur && mesAteliers.length === 0 && <div className="rounded-carte border border-bordure bg-surface px-6 py-10 text-center"><span aria-hidden="true" className={`${codeAtelier} mx-auto`}>{'</>'}</span><h3>Votre prochain atelier vous attend</h3><p className="mx-auto text-[#53576a]">Vous n’êtes encore inscrit à aucun atelier. Choisissez un sujet et commencez à apprendre avec nous.</p><Link to="/ateliers" className={bouton}>Découvrir les ateliers</Link></div>}
    <ul className="m-0 grid auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:auto-cols-[calc(50%-0.5rem)] [&::-webkit-scrollbar]:hidden">
      {mesAteliers.map(a => <li key={a.id} className="min-w-0 snap-start"><article className="flex h-full flex-col gap-5 rounded-carte border border-bordure bg-surface p-7 shadow-carte hover:border-accent [&>*]:m-0"><div className="flex items-center gap-3"><span aria-hidden="true" className={codeAtelier}>{a.code}</span><span className="text-[0.875rem] font-bold text-accent-sombre">Inscription confirmée</span></div><h3 className="text-[1.375rem] leading-[1.35]"><Link to={`/ateliers/${a.id}`}>{a.nom}</Link></h3>
        <dl className="grid grid-cols-2 gap-4 border-y border-bordure py-5">{[['Niveau', a.niveau], ['Durée', a.duree], ['Horaires', a.horaires], ['Modalité', a.modalite]].map(([nom, valeur]) => <div key={nom}><dt className="mb-1 text-[0.75rem] font-bold tracking-[0.04em] text-[#53576a] uppercase">{nom}</dt><dd className="text-[0.875rem]">{valeur}</dd></div>)}</dl>
        <div className="!mt-auto flex flex-wrap items-center justify-between gap-4 md:flex-nowrap"><p className="m-0"><span className="block text-[0.75rem] text-[#53576a]">Prix de l’atelier</span><strong className="text-[1.75rem]">{a.prix} €</strong></p><button aria-label={`Se désinscrire de ${a.nom}`} className="cursor-pointer rounded-lg border border-erreur bg-surface px-4 py-[0.7rem] whitespace-nowrap text-erreur hover:bg-[#fff4f2]" onClick={e => { declencheur.current = e.currentTarget; definirSelection({ id: a.id, nom: a.nom, prix: a.prix, utilisateurId: utilisateur.id }); dialogue.current?.showModal() }}>Se désinscrire</button></div>
      </article></li>)}
    </ul>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-bordure pt-6"><Link to="/" className="text-accent-sombre underline">← Retour à l’accueil</Link><button className={secondaire} onClick={sortir}>Se déconnecter</button></div>
    <dialog ref={dialogue} aria-labelledby="titre-annulation" aria-describedby="detail-annulation" className={modale} onClose={() => { if (declencheur.current?.isConnected) declencheur.current.focus(); else statut.current?.focus() }}>
      <h2 id="titre-annulation" className="mt-6 mb-2 text-[clamp(1.5rem,4vw,1.875rem)] leading-[1.25]">Annuler cette inscription ?</h2><p id="detail-annulation">Vous allez vous désinscrire de « {selection?.nom} » ({selection?.prix} €).</p><p>Vous pourrez vous inscrire à nouveau depuis la liste des ateliers.</p>
      <div className="flex flex-wrap items-center gap-4"><button autoFocus className={secondaire} onClick={() => dialogue.current?.close()}>Garder mon inscription</button><button aria-label={`Se désinscrire de ${a.nom}`} className="cursor-pointer rounded-lg border border-erreur bg-erreur px-6 py-3 text-surface hover:bg-[#861b12]" onClick={() => { if (!selection) return; try { desinscrire(selection.id, selection.utilisateurId); definirMessage(`Votre inscription à « ${selection.nom} » a été annulée.`) } catch (cause) { definirMessage(cause instanceof Error ? cause.message : 'Annulation impossible.') } dialogue.current?.close() }}>Annuler l’inscription</button></div>
    </dialog>
  </section>
}
