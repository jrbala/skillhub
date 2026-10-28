// Menu et modale partagent leur état, comme au TP1.
(() => {
  const navigationPrincipale = document.querySelector<HTMLElement>('#navigation-principale');
  const boutonMenu = navigationPrincipale?.querySelector<HTMLButtonElement>('.menu-toggle');
  const liensNavigation = document.querySelector<HTMLElement>('#liens-navigation');
  const affichageLarge = window.matchMedia('(min-width: 45em)');
  const boutonOuvrirModale = document.querySelector<HTMLButtonElement>('.ouvrir-modale');
  const boutonFermerModale = document.querySelector<HTMLButtonElement>('.fermer-modale');
  const modaleAtelier = document.querySelector<HTMLDialogElement>('#modale-atelier');

  if (!navigationPrincipale || !boutonMenu || !liensNavigation) return;

  // L’état est indépendant des attributs du DOM.
  const etatInterface = { menuOuvert: false, sousMenusOuverts: new Set<string>(), modaleOuverte: false };
  let declencheurModale: HTMLButtonElement | null = null;

  const afficherInterface = () => {
    const navigationVisible = affichageLarge.matches || etatInterface.menuOuvert;
    boutonMenu.setAttribute('aria-expanded', String(navigationVisible));
    liensNavigation.hidden = !navigationVisible;
    navigationPrincipale.querySelectorAll<HTMLButtonElement>('button[data-sous-menu][aria-controls]').forEach(bouton => {
      const panneau = document.getElementById(bouton.getAttribute('aria-controls') ?? '');
      if (!panneau || !liensNavigation.contains(panneau)) return;
      const ouvert = navigationVisible && etatInterface.sousMenusOuverts.has(panneau.id);
      bouton.setAttribute('aria-expanded', String(ouvert));
      panneau.hidden = !ouvert;
    });
    if (modaleAtelier) {
      if (etatInterface.modaleOuverte && !modaleAtelier.open) modaleAtelier.showModal();
      if (!etatInterface.modaleOuverte && modaleAtelier.open) modaleAtelier.close();
    }
  };

  function fermerMenu() {
    etatInterface.menuOuvert = false;
    etatInterface.sousMenusOuverts.clear();
    afficherInterface();
  }

  // Un seul écouteur de clic, y compris pour de futurs boutons de sous-menu.
  navigationPrincipale.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const bouton = event.target.closest<HTMLButtonElement>('button[aria-controls]');
    if (bouton && navigationPrincipale.contains(bouton)) {
      if (bouton === boutonMenu) {
        etatInterface.menuOuvert = !etatInterface.menuOuvert;
        if (!etatInterface.menuOuvert) etatInterface.sousMenusOuverts.clear();
      } else if (bouton.matches('[data-sous-menu]')) {
        const panneau = document.getElementById(bouton.getAttribute('aria-controls') ?? '');
        if (!panneau || !liensNavigation.contains(panneau)) return;
        if (etatInterface.sousMenusOuverts.has(panneau.id)) {
          etatInterface.sousMenusOuverts.delete(panneau.id);
          panneau.querySelectorAll<HTMLButtonElement>('button[data-sous-menu]').forEach(enfant => {
            etatInterface.sousMenusOuverts.delete(enfant.getAttribute('aria-controls') ?? '');
          });
        } else {
          etatInterface.sousMenusOuverts.add(panneau.id);
        }
      }
      afficherInterface();
      return;
    }
    const lien = event.target.closest('a');
    if (lien && navigationPrincipale.contains(lien)) {
      const boutonParent = [...navigationPrincipale.querySelectorAll<HTMLButtonElement>('button[data-sous-menu]')].find(bouton =>
        document.getElementById(bouton.getAttribute('aria-controls') ?? '')?.contains(lien));
      fermerMenu();
      if (!affichageLarge.matches) boutonMenu.focus();
      else boutonParent?.focus();
      // Le lien garde son action native : ancre ou changement de page.
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || etatInterface.modaleOuverte || document.querySelector('dialog[open]')) return;
    const boutonSousMenu = [...navigationPrincipale.querySelectorAll<HTMLButtonElement>('button[data-sous-menu]')].reverse().find(bouton => {
      const panneau = document.getElementById(bouton.getAttribute('aria-controls') ?? '');
      return panneau && etatInterface.sousMenusOuverts.has(panneau.id) &&
        (panneau.contains(document.activeElement) || bouton === document.activeElement);
    });
    if (boutonSousMenu) {
      event.preventDefault();
      boutonSousMenu.click();
      boutonSousMenu.focus();
    } else if (etatInterface.menuOuvert || etatInterface.sousMenusOuverts.size) {
      event.preventDefault();
      fermerMenu();
      if (!affichageLarge.matches) boutonMenu.focus();
    }
  });

  affichageLarge.addEventListener('change', () => {
    const focusDansLiens = liensNavigation.contains(document.activeElement);
    const focusSurBouton = document.activeElement === boutonMenu;
    const boutonParent = [...navigationPrincipale.querySelectorAll<HTMLButtonElement>('button[data-sous-menu]')].find(bouton =>
      document.getElementById(bouton.getAttribute('aria-controls') ?? '')?.contains(document.activeElement));
    fermerMenu();
    if (!affichageLarge.matches && focusDansLiens) boutonMenu.focus();
    if (affichageLarge.matches && focusSurBouton) liensNavigation.querySelector('a')?.focus();
    if (affichageLarge.matches && boutonParent) boutonParent.focus();
  });

  boutonOuvrirModale?.addEventListener('click', event => {
    if (!(event.currentTarget instanceof HTMLButtonElement)) return;
    declencheurModale = event.currentTarget;
    etatInterface.modaleOuverte = true;
    afficherInterface();
  });
  boutonFermerModale?.addEventListener('click', () => {
    etatInterface.modaleOuverte = false;
    afficherInterface();
  });
  modaleAtelier?.addEventListener('cancel', event => {
    event.preventDefault();
    etatInterface.modaleOuverte = false;
    afficherInterface();
  });
  modaleAtelier?.addEventListener('close', () => {
    if (modaleAtelier.open) return;
    etatInterface.modaleOuverte = false;
    afficherInterface();
    if (declencheurModale?.isConnected && !declencheurModale.disabled) {
      declencheurModale.focus();
    } else {
      // Après inscription, le déclencheur peut être désactivé (« Déjà inscrit »).
      const titre = document.querySelector<HTMLHeadingElement>('main h1');
      titre?.setAttribute('tabindex', '-1');
      titre?.focus();
    }
  });
  afficherInterface();

})();
