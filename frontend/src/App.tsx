import { BrowserRouter } from 'react-router-dom'
import FournisseurCompte from './context/FournisseurCompte'
import FournisseurAteliers from './context/FournisseurAteliers'
import RoutesApplication from './router/RoutesApplication'
export default function App() {
  return <BrowserRouter><FournisseurCompte><FournisseurAteliers><RoutesApplication /></FournisseurAteliers></FournisseurCompte></BrowserRouter>
}
