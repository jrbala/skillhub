// Jetons FM02 : src/css/jetons.css et valeurs de src/css/base.css.
// Contrastes sur blanc : texte ≈ 14,5:1, accent ≈ 5,6:1,
// accent sombre ≈ 7,2:1 et erreur ≈ 6,6:1 (AA pour le texte).
// La bordure claire est décorative ; les champs utilisent l’accent sombre.
export default {
  theme: {
    extend: {
      colors: {
        fond: 'var(--couleur-fond)',
        texte: 'var(--couleur-texte)',
        accent: 'var(--couleur-accent)',
        'accent-sombre': 'var(--couleur-accent-sombre)',
        surface: 'var(--couleur-surface)',
        erreur: 'var(--couleur-erreur)',
        bordure: 'var(--couleur-bordure)',
        lavande: '#eeecff',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      screens: { md: '45em', lg: '64em' },
      maxWidth: { contenu: '1100px' },
      borderRadius: { carte: '16px' },
      boxShadow: { carte: '0 4px 18px rgb(37 40 58 / 4%)' },
    },
  },
}
