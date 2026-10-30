import { createContext, useContext } from 'react'
import type { AtelierCatalogue } from '../types'
export const ContexteAteliers = createContext<{ ateliers: AtelierCatalogue[]; chargement: boolean; erreur: string; reessayer: () => void }>({ ateliers: [], chargement: true, erreur: '', reessayer: () => {} })
export const useAteliers = () => useContext(ContexteAteliers)
