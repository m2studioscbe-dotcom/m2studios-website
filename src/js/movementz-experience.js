const selector = document.querySelector('[data-movementz-selector]');

if (selector) {
  const tabs = [...selector.querySelectorAll('[data-service-tab]')];
  const panels = [...selector.querySelectorAll('[data-service-panel]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const activateService = (service, focusTab = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.serviceTab === service;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;

      if (active) {
        tab.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center',
        });
        if (focusTab) tab.focus();
      }
    });

    panels.forEach((panel) => {
      const active = panel.dataset.servicePanel === service;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };

  selector.classList.add('is-enhanced');
  activateService(tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.serviceTab || tabs[0]?.dataset.serviceTab);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateService(tab.dataset.serviceTab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      activateService(tabs[nextIndex].dataset.serviceTab, true);
    });
  });
}

const mobileActions = document.querySelector('[data-movementz-mobile-actions]');
const footer = document.querySelector('.footer');

if (mobileActions && footer && 'IntersectionObserver' in window) {
  const footerObserver = new IntersectionObserver(([entry]) => {
    mobileActions.classList.toggle('is-docked-away', entry.isIntersecting);
  }, { threshold: 0.01 });

  footerObserver.observe(footer);
}
