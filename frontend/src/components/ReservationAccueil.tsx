import { useAteliers } from '../hooks/useAteliers'
import Reservation from './Reservation'
import { bouton } from './styles'
export default function ReservationAccueil() {
  const { ateliers, chargement, erreur, reessayer } = useAteliers()
  const atelier = ateliers.find(a => a.id === 'html')
  if (atelier) return <Reservation atelier={atelier} accueil description="Apprenez à organiser le contenu d’une page web et créez vos premières pages, pas à pas." />
  return <button className={bouton} disabled={chargement} onClick={reessayer}>{erreur ? 'Réessayer' : 'Chargement…'}</button>
}
