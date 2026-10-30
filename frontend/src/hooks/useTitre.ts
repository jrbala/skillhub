import { useEffect } from 'react'
export function useTitre(titre: string, description = 'Développez vos compétences avec les ateliers SkillHub et retrouvez vos inscriptions dans votre espace personnel.') {
  useEffect(() => {
    document.title = `${titre} — SkillHub`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [titre, description])
}
