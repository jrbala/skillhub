import { useState } from 'react'
import type { AtelierCatalogue } from '../types'
import { champ } from './styles'
function normaliser(texte: string) { return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim() }
export default function RechercheAteliers({ ateliers, recherche, modifier }: { ateliers: AtelierCatalogue[]; recherche: string; modifier: (valeur: string) => void }) {
  const [ouvert, definirOuvert] = useState(false)
  const [actif, definirActif] = useState(-1)
  const suggestions = recherche.trim() ? ateliers.filter(a => normaliser(a.nom).includes(normaliser(recherche))).slice(0, 6) : []
  const visible = ouvert && suggestions.length > 0
  function choisir(nom: string) { modifier(nom); definirOuvert(false); definirActif(-1) }
  return <div className="relative mb-4 min-w-0 flex-[1_1_12rem]" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) definirOuvert(false) }}>
    <label htmlFor="recherche" className="mb-2 block font-bold">Rechercher un atelier ou un formateur</label>
    <input id="recherche" type="search" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls="suggestions" aria-activedescendant={visible && actif >= 0 && actif < suggestions.length ? `suggestion-${suggestions[actif].id}` : undefined} value={recherche} onFocus={() => definirOuvert(true)} onChange={e => { modifier(e.target.value); definirActif(-1); definirOuvert(true) }} className={champ} onKeyDown={e => {
      if (e.key === 'Escape') { definirOuvert(false); definirActif(-1) }
      if (suggestions.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault(); definirOuvert(true); definirActif(index => (index + (e.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length)
      }
      if (visible && e.key === 'Enter' && actif >= 0 && actif < suggestions.length) { e.preventDefault(); choisir(suggestions[actif].nom) }
    }} />
    <ul id="suggestions" role="listbox" aria-label="Suggestions d’ateliers" hidden={!visible} className="absolute top-full right-0 left-0 z-20 mt-[0.35rem] mb-0 max-h-72 list-none overflow-y-auto rounded-xl border border-[#d6d6e0] bg-surface p-[0.35rem] shadow-[0_8px_24px_rgb(37_40_58/15%)]">
      {suggestions.map((a, index) => <li key={a.id} id={`suggestion-${a.id}`} role="option" aria-selected={index === actif} className="cursor-pointer rounded-lg p-3 [overflow-wrap:anywhere] hover:bg-[#ececf7] aria-selected:bg-[#ececf7] aria-selected:outline-2 aria-selected:outline-[#555080] aria-selected:-outline-offset-2" onMouseDown={e => e.preventDefault()} onClick={() => choisir(a.nom)}>{a.nom}</li>)}
    </ul>
  </div>
}
