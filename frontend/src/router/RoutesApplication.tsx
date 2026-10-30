import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import Accueil from '../views/Accueil'
import Catalogue from '../views/Catalogue'
import DetailsAtelier from '../views/DetailsAtelier'
import Compte from '../views/Compte'
import Profil from '../views/Profil'
import Introuvable from '../views/Introuvable'
import { useCompte } from '../hooks/useCompte'
function RouteProtegee() { const { utilisateur } = useCompte(); return utilisateur ? <Outlet /> : <Navigate to="/connexion" replace /> }
function AncienneRoute({ vers }: { vers: string }) { const lieu = useLocation(); return <Navigate to={`${vers}${lieu.search}${lieu.hash}`} replace /> }
export default function RoutesApplication() {
  return <Routes><Route element={<Layout />}><Route index element={<Accueil />} /><Route path="ateliers" element={<Catalogue />} /><Route path="ateliers/:id" element={<DetailsAtelier />} /><Route path="connexion" element={<Compte key="connexion" />} /><Route path="inscription" element={<Compte key="inscription" creation />} /><Route element={<RouteProtegee />}><Route path="profil" element={<Profil />} /></Route>{['index', 'connexion', 'inscription', 'profil'].map(page => <Route key={page} path={`${page}.html`} element={<AncienneRoute vers={page === 'index' ? '/' : `/${page}`} />} />)}{['html', 'css', 'javascript', 'react', 'ux', 'a11y'].map(id => <Route key={id} path={`cours-${id}.html`} element={<AncienneRoute vers={`/ateliers/${id}`} />} />)}<Route path="*" element={<Introuvable />} /></Route></Routes>
}
