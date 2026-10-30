import Catalogue from './views/Catalogue'

export default function App() {
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded-lg focus:bg-surface focus:p-4 focus:text-accent-sombre">
        Aller au contenu
      </a>
      <header className="border-b border-bordure bg-surface px-6 py-4">
        <p className="mx-auto max-w-contenu text-xl font-bold">SkillHub</p>
      </header>
      <main id="contenu" tabIndex={-1} className="mx-auto max-w-contenu px-6 py-10">
        <Catalogue />
      </main>
      <footer className="border-t border-bordure bg-surface px-6 py-4 text-center">
        SkillHub — Apprendre et partager ensemble.
      </footer>
    </>
  )
}
