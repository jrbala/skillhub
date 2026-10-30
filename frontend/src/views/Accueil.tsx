import { section } from '../components/styles'
import { iconesValeurs } from '../assets/iconesValeurs'
import ReservationAccueil from '../components/ReservationAccueil'
import Catalogue from './Catalogue'
import Contact from '../components/Contact'
import accroche480 from '../../../src/assets/images/accroche-480.webp'
import accroche960 from '../../../src/assets/images/accroche-960.webp'
import accroche1440 from '../../../src/assets/images/accroche-1440.webp'
import fernanda from '../../../src/assets/images/formateur-1-640.webp'
import fernandaPetit from '../../../src/assets/images/formateur-1-320.webp'
import fernandaGrand from '../../../src/assets/images/formateur-1-960.webp'
import joseph from '../../../src/assets/images/formateur-2-640.webp'
import josephPetit from '../../../src/assets/images/formateur-2-320.webp'
import josephGrand from '../../../src/assets/images/formateur-2-960.webp'
import dominique from '../../../src/assets/images/formateur-3-640.webp'
import dominiquePetit from '../../../src/assets/images/formateur-3-320.webp'
import dominiqueGrand from '../../../src/assets/images/formateur-3-960.webp'
const valeurs = [['Partage des connaissances', 'Partagez vos connaissances et apprenez des expériences de chacun.'], ['Entraide', 'Avancez ensemble et trouvez des solutions à plusieurs.'], ['Apprentissage par la pratique', 'Apprenez en réalisant des exercices et des projets concrets.'], ['Accessibilité', 'Des contenus et des ateliers pensés pour être accessibles à tous.'], ['Créativité', 'Explorez vos idées et donnez vie à vos projets.'], ['Progression continue', 'Développez vos compétences, une étape à la fois.']]
const formateurs = [{ nom: 'Fernanda Maria', domaine: 'HTML & CSS', texte: 'Donnez forme à vos premières pages web.', image: fernanda, srcSet: `${fernandaPetit} 320w, ${fernanda} 640w, ${fernandaGrand} 960w` }, { nom: 'Joseph Ricardo', domaine: 'JavaScript', texte: 'Passez des pages statiques aux interactions.', image: joseph, srcSet: `${josephPetit} 320w, ${joseph} 640w, ${josephGrand} 960w` }, { nom: 'Dominique Laurent', domaine: 'Accessibilité web', texte: 'Pensez des interfaces accessibles à tous.', image: dominique, srcSet: `${dominiquePetit} 320w, ${dominique} 640w, ${dominiqueGrand} 960w` }]
export default function Accueil() {
  return <>
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-4">
      <section id="accroche" className="mx-auto w-full max-w-contenu px-6 py-6">
        <h1>Apprenez et partagez vos compétences</h1>
        <p className="!max-w-none">Développez des compétences concrètes grâce à des ateliers accessibles, animés par des formateurs passionnés. Apprenez à votre rythme, pratiquez en groupe et partagez vos connaissances avec la communauté.</p>
      </section>
      <img src={accroche960} srcSet={`${accroche480} 480w, ${accroche960} 960w, ${accroche1440} 1440w`} sizes="(max-width: 960px) 100vw, 960px" alt="Vue de dessus d'une table où plusieurs personnes travaillent sur des ordinateurs" width="960" height="640" className="row-start-2 aspect-[21/9] w-full object-cover lg:col-span-2" fetchPriority="high" />
      <aside className="mx-auto mt-12 w-[calc(100%-3rem)] max-w-contenu border border-l-4 border-bordure border-l-accent bg-[rgb(91_76_240/6%)] p-6 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:mt-16 lg:mr-6 lg:w-[calc(100%-1.5rem)] lg:self-start">
        <h2>Prochain atelier</h2><p>Le prochain atelier est consacré aux bases du HTML.</p><ReservationAccueil />
      </aside>
    </div>
    <section id="valeurs" tabIndex={-1} className={section}>
      <h2>Nos valeurs</h2><p>Apprendre ensemble, progresser à son rythme.</p>
      <ul className="mt-7 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
        {valeurs.map(([titre, texte], index) => <li key={titre} className="rounded-carte border border-bordure bg-surface p-7 shadow-carte hover:border-accent motion-safe:transition-colors">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="box-content h-6 w-6 rounded-xl bg-lavande p-3 text-accent-sombre">{iconesValeurs[index].map(d => <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />)}</svg>
          <h3 className="mt-5 mb-[0.65rem] text-[1.125rem] leading-[1.4]">{titre}</h3><p className="m-0 text-[0.9375rem] text-[#53576a]">{texte}</p>
        </li>)}
      </ul>
    </section>
    <Catalogue accueil />
    <section id="formateurs" tabIndex={-1} className={section}>
      <h2>Nos formateurs</h2><p>Nos formateurs accompagnent les participants pendant les ateliers.</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))] gap-4">
        {formateurs.map(f => <article key={f.nom} className="overflow-hidden rounded-carte border border-bordure bg-surface shadow-carte">
          <img src={f.image} srcSet={f.srcSet} sizes="(max-width: 640px) 100vw, 640px" alt={`Portrait de ${f.nom}`} width="640" height="427" loading="lazy" className="aspect-[4/3] w-full border-b border-bordure object-cover object-[center_35%]" />
          <div className="flex flex-col items-start gap-3 p-6 [&>*]:m-0"><p className="rounded-md bg-lavande px-[0.7rem] py-[0.3rem] text-[0.75rem] font-bold text-accent-sombre">{f.domaine}</p><h3 className="text-[1.25rem] leading-[1.35]">{f.nom}</h3><p className="text-[0.9375rem] text-[#53576a]">{f.texte}</p></div>
        </article>)}
      </div>
    </section>
    <Contact />
  </>
}
