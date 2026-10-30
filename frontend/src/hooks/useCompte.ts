import { useContext, createContext } from 'react'
import type { Utilisateur, Inscription } from '../services/compte'
export const ContexteCompte = createContext<{ utilisateur: Utilisateur | null; inscriptions: Inscription[]; erreur: string }>({ utilisateur: null, inscriptions: [], erreur: '' })
export const useCompte = () => useContext(ContexteCompte)
