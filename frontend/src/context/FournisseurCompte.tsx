import { useEffect, useState, type ReactNode } from 'react'
import { ContexteCompte } from '../hooks/useCompte'
import { utilisateurConnecte, inscriptions } from '../services/compte'
function lireEtat() {
  try { return { utilisateur: utilisateurConnecte(), inscriptions: inscriptions(), erreur: '' } }
  catch (cause) { return { utilisateur: null, inscriptions: [], erreur: cause instanceof Error ? cause.message : 'Stockage indisponible.' } }
}
export default function FournisseurCompte({ children }: { children: ReactNode }) {
  const [etat, definirEtat] = useState(lireEtat)
  useEffect(() => {
    const actualiser = () => definirEtat(lireEtat())
    window.addEventListener('storage', actualiser)
    window.addEventListener('skillhub:stockage', actualiser)
    window.addEventListener('pageshow', actualiser)
    return () => { window.removeEventListener('storage', actualiser); window.removeEventListener('skillhub:stockage', actualiser); window.removeEventListener('pageshow', actualiser) }
  }, [])
  return <ContexteCompte value={etat}>{children}</ContexteCompte>
}
