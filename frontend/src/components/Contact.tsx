import { section, champ, bouton } from './styles'
import { useRef, useState, type FormEvent } from 'react'
export default function Contact() {
  const [message, definirMessage] = useState('')
  const [erreurs, definirErreurs] = useState<Record<string, string>>({})
  const statut = useRef<HTMLParagraphElement>(null)
  function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const champs = Array.from(e.currentTarget.querySelectorAll('input, textarea')) as (HTMLInputElement | HTMLTextAreaElement)[]
    const fautes = Object.fromEntries(champs.filter(c => !c.value.trim() || !c.checkValidity()).map(c => [c.name, c.name === 'email' ? 'Veuillez saisir une adresse e-mail valide.' : 'Veuillez remplir ce champ.']))
    definirErreurs(fautes)
    if (Object.keys(fautes).length) { champs.find(c => fautes[c.name])?.focus(); return }
    definirMessage('Votre demande de démonstration a été validée. Aucune donnée n’a été envoyée ni inscription à un atelier effectuée.')
    statut.current?.focus()
  }
  const classeChamp = champ
  return <section id="inscription" className={section}>
    <h2 className="text-center">Découvrir SkillHub</h2>
    <p className="mx-auto text-center">Essayez le formulaire de contact de démonstration. Pour réserver un atelier, utilisez son bouton « S’inscrire ».</p>
    <form noValidate onSubmit={envoyer} className="mx-auto w-full max-w-[42rem] border-l-4 border-accent bg-[rgba(221,224,235,0.231)] p-6">
      {[{ nom: 'nom', label: 'Nom', type: 'text' }, { nom: 'email', label: 'Adresse e-mail', type: 'email' }].map(c => <div key={c.nom} className="mb-4">
        <label className="mb-2 block font-bold" htmlFor={`contact-${c.nom}`}>{c.label}</label>
        <input id={`contact-${c.nom}`} required name={c.nom} type={c.type} autoComplete={c.nom === 'nom' ? 'name' : 'email'} aria-invalid={Boolean(erreurs[c.nom])} aria-describedby={`contact-erreur-${c.nom}`} className={classeChamp} />
        <p id={`contact-erreur-${c.nom}`} className="mt-2 mb-0 min-h-[1.5em] text-[0.875rem] text-erreur">{erreurs[c.nom]}</p>
      </div>)}
      <div className="mb-4"><label className="mb-2 block font-bold" htmlFor="contact-message">Message</label><textarea rows={4} id="contact-message" required name="message" aria-invalid={Boolean(erreurs.message)} aria-describedby="contact-erreur-message" className={classeChamp} /><p id="contact-erreur-message" className="mt-2 mb-0 min-h-[1.5em] text-[0.875rem] text-erreur">{erreurs.message}</p></div>
      <button className={`${bouton} mx-auto !block`}>Envoyer ma demande</button>
      <p ref={statut} tabIndex={-1} role="status" className="text-center font-bold text-accent-sombre">{message}</p>
    </form>
  </section>
}
