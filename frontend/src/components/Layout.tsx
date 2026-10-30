import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCompte } from '../hooks/useCompte'
import { deconnecter } from '../services/compte'
import { bouton as classeBouton, secondaire } from './styles'

export default function Layout() {
  const { utilisateur, erreur } = useCompte()
  const [menu, definirMenu] = useState(false)
  const [large, definirLarge] = useState(() => window.matchMedia('(min-width: 45em)').matches)
  const [message, definirMessage] = useState('')
  const bouton = useRef<HTMLButtonElement>(null)
  const navigation = useRef<HTMLDivElement>(null)
  const lieu = useLocation()
  const naviguer = useNavigate()
  const authentification = ['/connexion', '/inscription'].includes(lieu.pathname)
  useEffect(() => {
    const cible = lieu.hash ? document.getElementById(lieu.hash.slice(1)) : document.getElementById('contenu')
    cible?.focus()
    if (lieu.hash) cible?.scrollIntoView(); else window.scrollTo(0, 0)
  }, [lieu.pathname, lieu.hash])
  useEffect(() => {
    const media = window.matchMedia('(min-width: 45em)')
    function adapter() {
      if (!media.matches && navigation.current?.contains(document.activeElement)) bouton.current?.focus()
      if (media.matches && document.activeElement === bouton.current) navigation.current?.querySelector('a')?.focus()
      definirLarge(media.matches); definirMenu(false)
    }
    media.addEventListener('change', adapter)
    return () => media.removeEventListener('change', adapter)
  }, [])
  function sortir() {
    try { deconnecter(); naviguer('/') }
    catch (cause) { definirMessage(cause instanceof Error ? cause.message : 'Déconnexion impossible.') }
  }
  const compteClasse = 'flex-1 overflow-hidden text-ellipsis whitespace-nowrap !px-2 !py-2 !text-[0.8125rem] font-bold md:flex-none md:!px-4 md:!py-[0.65rem] md:!text-[0.9375rem]'
  const lienClasse = 'border-b-[3px] border-transparent pb-1 text-texte no-underline hover:border-accent hover:text-accent focus-visible:border-accent'
  return <div className={authentification ? 'flex min-h-screen flex-col' : ''}>
    <a href="#contenu" className="absolute -top-12 left-0 z-50 bg-surface px-4 py-2 focus:top-0">Aller au contenu principal</a>
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 border border-bordure bg-surface px-6 py-4 md:flex md:flex-wrap">
      <Link to="/" className="col-start-2 row-start-1 justify-self-center border-b-[3px] border-transparent pb-1 font-bold text-texte no-underline">SkillHub</Link>
      <nav aria-label="Menu principal" className="contents" onKeyDown={e => {
        if (e.key === 'Escape' && !large) { definirMenu(false); bouton.current?.focus() }
      }}>
        <button ref={bouton} aria-expanded={large || menu} aria-controls="navigation" onClick={() => definirMenu(!menu)} className="col-start-3 row-start-1 inline-flex h-11 w-11 items-center justify-center justify-self-end border border-bordure bg-surface text-[1.5rem] md:hidden"><span aria-hidden="true">☰</span><span className="sr-only">Menu principal</span></button>
        <div ref={navigation} id="navigation" hidden={!large && !menu} className="col-span-full flex flex-wrap justify-center gap-8 border-b border-bordure pb-4 md:gap-6 md:border-0 md:pb-0" onClick={e => {
          if ((e.target as HTMLElement).closest('a')) { definirMenu(false); if (!large) bouton.current?.focus() }
        }}>
          <Link to="/#valeurs" className={lienClasse}>Valeurs</Link><NavLink to="/ateliers" className={lienClasse}>Ateliers</NavLink><Link to="/#formateurs" className={lienClasse}>Formateurs</Link>
        </div>
      </nav>
      <div className="col-span-full flex w-full flex-wrap items-center justify-center gap-3 px-4 py-2 md:ml-auto md:w-auto">
        {utilisateur ? <><NavLink to="/profil" className={`${secondaire} ${compteClasse}`}>Mon espace</NavLink><button onClick={sortir} className={`${classeBouton} ${compteClasse}`}>Se déconnecter</button></> : <><Link to="/connexion" className={`${secondaire} ${compteClasse}`}>Se connecter</Link><Link to="/inscription" className={`${classeBouton} ${compteClasse}`}>Créer mon compte</Link></>}
      </div>
    </header>
    <main id="contenu" tabIndex={-1} className={`${authentification ? 'flex-1' : ''} ${lieu.pathname.startsWith('/ateliers/') ? 'grid grid-cols-[minmax(0,1fr)]' : ''} min-w-0 [&_p]:max-w-[65ch]`}>
      {(erreur || message) && <p role="alert" className="mx-auto px-6 text-erreur">{erreur || message}</p>}<Outlet />
    </main>
    <footer className="border-t border-bordure bg-surface px-6 py-4 text-center"><p className="m-0">© 2026 SkillHub. Tous droits réservés.</p></footer>
  </div>
}
