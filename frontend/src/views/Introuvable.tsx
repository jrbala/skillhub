import { Link } from 'react-router-dom'
import { useTitre } from '../hooks/useTitre'
export default function Introuvable() { useTitre('Page introuvable'); return <div className="mx-auto max-w-contenu px-6 py-16"><h1 className="text-3xl font-bold">Page introuvable</h1><p className="my-5">Cette page ou cet atelier n’existe pas.</p><Link to="/ateliers" className="text-accent-sombre underline">Explorer les ateliers</Link></div> }
