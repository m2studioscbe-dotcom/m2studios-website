import { gsap } from 'gsap';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  const curtain = document.createElement('div');
  curtain.className = 'page-transition-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.append(curtain);

  gsap.fromTo(curtain, { scaleY: 1, transformOrigin: 'top' }, {
    scaleY: 0,
    duration: .48,
    ease: 'power3.inOut',
    clearProps: 'transformOrigin',
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

    event.preventDefault();
    document.documentElement.classList.add('is-page-leaving');
    gsap.set(curtain, { transformOrigin: 'bottom' });
    gsap.to(curtain, {
      scaleY: 1,
      duration: .38,
      ease: 'power3.inOut',
      onComplete: () => window.location.assign(url.href),
    });
  });
}
