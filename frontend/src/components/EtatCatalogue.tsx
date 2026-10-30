import { useAteliers } from '../hooks/useAteliers'
export default function EtatCatalogue() {
  const { chargement, erreur, reessayer } = useAteliers()
  return <>{chargement && <p role="status">Chargement des ateliers…</p>}{erreur && <div role="alert"><p className="text-erreur">{erreur}</p><button className="my-4 rounded-lg border px-4 py-3" onClick={reessayer}>Réessayer</button></div>}</>
}
