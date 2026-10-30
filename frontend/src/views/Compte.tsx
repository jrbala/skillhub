import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { connecter, creerCompte } from '../services/compte'
import { bouton, surtitre } from '../components/styles'
import { useTitre } from '../hooks/useTitre'
export default function Compte({ creation = false }: { creation?: boolean }) {
  const [params] = useSearchParams()
  const atelier = params.get('atelier')
  const suite = atelier ? `?atelier=${encodeURIComponent(atelier)}` : ''
  const naviguer = useNavigate()
  const [erreurs, definirErreurs] = useState<Record<string, string>>({})
  const [message, definirMessage] = useState(params.has('compte') ? 'Votre compte a été créé. Connectez-vous pour continuer.' : '')
  const [enCours, definirEnCours] = useState(false)
  const verrou = useRef(false)
  const statut = useRef<HTMLParagraphElement>(null)
  const titre = creation ? 'Créer mon compte' : 'Se connecter'
  useTitre(titre)
  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (verrou.current) return
    const formulaire = e.currentTarget
    const donnees = new FormData(formulaire)
    const valeur = (cle: string) => String(donnees.get(cle) ?? '')
    const fautes: Record<string, string> = {}
    for (const champ of Array.from(formulaire.querySelectorAll('input'))) {
      if (!champ.value.trim()) fautes[champ.name] = 'Ce champ est obligatoire.'
      else if (!champ.checkValidity()) fautes[champ.name] = champ.type === 'email' ? 'Saisissez une adresse e-mail valide.' : 'Utilisez au moins 8 caractères.'
    }
    if (creation && valeur('confirmation') !== valeur('motDePasse')) fautes.confirmation = 'Les deux mots de passe doivent être identiques.'
    definirErreurs(fautes)
    if (Object.keys(fautes).length) { formulaire.querySelector<HTMLInputElement>(`[name="${Object.keys(fautes)[0]}"]`)?.focus(); return }
    verrou.current = true; definirEnCours(true)
    try {
      if (creation) { await creerCompte(valeur('nom'), valeur('email'), valeur('motDePasse')); naviguer(`/connexion${suite}${suite ? '&' : '?'}compte=cree`) }
      else { await connecter(valeur('email'), valeur('motDePasse')); naviguer(atelier ? `/ateliers/${encodeURIComponent(atelier)}?confirmation=1` : '/profil', { replace: true }) }
    } catch (cause) { definirMessage(cause instanceof Error ? cause.message : 'Opération impossible.'); statut.current?.focus() }
    finally { verrou.current = false; definirEnCours(false) }
  }
  const champs = [...(creation ? [{ nom: 'nom', label: 'Nom', type: 'text', auto: 'name' }] : []), { nom: 'email', label: 'Adresse e-mail', type: 'email', auto: 'email' }, { nom: 'motDePasse', label: 'Mot de passe', type: 'password', auto: creation ? 'new-password' : 'current-password' }, ...(creation ? [{ nom: 'confirmation', label: 'Confirmation du mot de passe', type: 'password', auto: 'new-password' }] : [])]
  return <section className={`mx-auto w-full max-w-contenu px-6 grid gap-8 py-10 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-10 md:py-16 lg:gap-20`}>
    <div className="self-center">
      <p className={surtitre}>LA COMMUNAUTÉ SKILLHUB</p><h1 className="my-4 leading-[1.15] md:max-w-[12ch]">{creation ? 'Créez votre compte' : 'Heureux de vous retrouver'}</h1>
      <p className="!max-w-[38ch] text-[#53576a]">{creation ? 'Rejoignez SkillHub et faites place à de nouvelles compétences.' : 'Connectez-vous pour retrouver vos ateliers et poursuivre votre apprentissage.'}</p>
      <ul className="my-8 hidden list-none gap-3 p-0 md:grid">{['Des ateliers pour apprendre par la pratique', 'Des formateurs pour vous accompagner', 'Vos inscriptions réunies au même endroit'].map(texte => <li key={texte} className="flex gap-[0.65rem] text-[0.9375rem]"><span aria-hidden="true" className="font-bold text-accent-sombre">✓</span>{texte}</li>)}</ul>
      <Link to="/" className="text-accent-sombre underline underline-offset-[3px]">← Retour à l’accueil</Link>
    </div>
    <div className="min-w-0 rounded-[20px] border border-bordure bg-surface p-6 shadow-[0_12px_40px_rgb(37_40_58/6%)] md:p-8 lg:p-10">
      <h2 className="m-0 text-[1.5rem]">{titre}</h2><p className="mt-[0.4rem] mb-6 text-[#53576a]">{creation ? 'Quelques informations pour commencer.' : 'Bienvenue dans votre espace personnel.'}</p>
      {atelier && <p className="rounded-[10px] bg-lavande p-4 text-[0.875rem] text-accent-sombre">Vous confirmerez votre inscription à l’atelier après la connexion.</p>}
      <form noValidate onSubmit={envoyer} aria-busy={enCours}>
        <p className="mb-5 text-[0.8125rem] text-[#53576a]">Tous les champs sont obligatoires.</p>
        {champs.map(c => <div key={c.nom} className="mb-5">
          <label htmlFor={c.nom} className="mb-2 block text-[0.875rem] font-bold">{c.label}</label>
          <input id={c.nom} name={c.nom} type={c.type} autoComplete={c.auto} required minLength={creation && c.nom === 'motDePasse' ? 8 : undefined} aria-invalid={Boolean(erreurs[c.nom])} aria-describedby={`erreur-${c.nom}`} className="w-full rounded-[9px] border border-[#85899a] bg-[#fcfcfe] px-4 py-[0.8rem] aria-invalid:border-erreur focus-visible:bg-surface focus-visible:outline-accent focus-visible:outline-offset-2" />
          <p id={`erreur-${c.nom}`} className="mt-2 mb-0 text-[0.875rem] text-erreur empty:m-0">{erreurs[c.nom]}</p>
          {creation && c.nom === 'motDePasse' && <p className="mt-[0.4rem] mb-0 text-[0.8125rem] text-[#53576a]">Au moins 8 caractères.</p>}
        </div>)}
        <button disabled={enCours} className={`${bouton} mt-6 !block w-full font-bold`}>{enCours ? 'Traitement en cours…' : titre}</button><p ref={statut} tabIndex={-1} role="status" className="font-bold text-accent-sombre empty:m-0">{message}</p>
      </form>
      <p className="mt-6 border-t border-bordure pt-5 text-center text-[0.875rem]">{creation ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}<Link className="text-accent-sombre underline underline-offset-[3px]" to={`${creation ? '/connexion' : '/inscription'}${suite}`}>{creation ? 'Se connecter' : 'Créer mon compte'}</Link></p>
      <p className="mt-5 mb-0 text-center text-[0.75rem] text-[#53576a]" title="Les comptes sont conservés dans ce navigateur. Cette authentification scolaire locale n’est pas sécurisée pour la production.">Espace de démonstration : utilisez des informations fictives.</p>
    </div>
  </section>
}
