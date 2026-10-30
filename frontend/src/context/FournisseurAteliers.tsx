import { useEffect, useState, type ReactNode } from 'react'
import { chargerAteliers } from '../services/ateliers'
import { ContexteAteliers } from '../hooks/useAteliers'
import type { AtelierCatalogue } from '../types'
export default function FournisseurAteliers({ children }: { children: ReactNode }) {
  const [etat, definirEtat] = useState<{ ateliers: AtelierCatalogue[]; chargement: boolean; erreur: string }>({ ateliers: [], chargement: true, erreur: '' })
  const [essai, definirEssai] = useState(0)
  useEffect(() => {
    const controleur = new AbortController()
    chargerAteliers(controleur.signal).then(ateliers => {
      if (!controleur.signal.aborted) definirEtat({ ateliers, chargement: false, erreur: '' })
    }).catch((cause: unknown) => {
      if (!controleur.signal.aborted) definirEtat({ ateliers: [], chargement: false, erreur: cause instanceof Error ? cause.message : 'Chargement impossible.' })
    })
    return () => controleur.abort()
  }, [essai])
  function reessayer() { definirEtat({ ateliers: [], chargement: true, erreur: '' }); definirEssai(v => v + 1) }
  return <ContexteAteliers value={{ ...etat, reessayer }}>{children}</ContexteAteliers>
}
