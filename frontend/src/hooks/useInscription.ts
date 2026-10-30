import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompte } from './useCompte'
import { inscrire } from '../services/compte'
import type { AtelierCatalogue } from '../types'
export function useInscription() {
  const { utilisateur } = useCompte()
  const naviguer = useNavigate()
  const [message, definirMessage] = useState('')
  function reserver(atelier: AtelierCatalogue) {
    if (!utilisateur) { naviguer(`/connexion?atelier=${encodeURIComponent(atelier.id)}`); return }
    try { definirMessage(inscrire(atelier) ? `Votre inscription à « ${atelier.nom} » est confirmée. Aucun paiement n’est effectué.` : 'Vous êtes déjà inscrit à cet atelier.') }
    catch (cause) { definirMessage(cause instanceof Error ? cause.message : 'Inscription impossible.') }
  }
  return { reserver, message }
}
