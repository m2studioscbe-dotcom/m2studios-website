import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('v3-enhanced');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const context = gsap.context(() => {
  const hero = document.querySelector('[data-mo3-hero]');
  if (hero && !reducedMotion) {
    const frame = hero.querySelector('.mo3-focus-frame');
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.mo3-hero-copy .v2-kicker', { y: 18, autoAlpha: 0, duration: .55 }, 0)
      .from('.mo3-hero-copy h1 span', { clipPath: 'inset(0 0 100% 0)', yPercent: 35, duration: .95 }, .08)
      .from('.mo3-hero-copy h1 em', { clipPath: 'inset(100% 0 0 0)', yPercent: 30, duration: 1 }, .16)
      .from('.mo3-hero-copy > p, .mo3-hero-copy .v2-primary-actions', { y: 22, autoAlpha: 0, duration: .65, stagger: .08 }, .34)
      .from(frame.querySelectorAll('i'), { scale: .25, autoAlpha: 0, duration: .7, stagger: .05 }, .2)
      .from('.mo3-hero-caption', { x: 25, autoAlpha: 0, duration: .7 }, .45);

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
    })
      .to('.mo3-hero-media img', { scale: 1.1, xPercent: 2 }, 0)
      .to(frame, { scale: .9, xPercent: 3, yPercent: -2, transformOrigin: 'center', }, 0)
      .to('.mo3-hero-copy', { yPercent: -12, autoAlpha: .25 }, 0);

    if (window.matchMedia('(pointer: fine)').matches) {
      const moveX = gsap.quickTo(frame, 'x', { duration: .7, ease: 'power3.out' });
      const moveY = gsap.quickTo(frame, 'y', { duration: .7, ease: 'power3.out' });
      hero.addEventListener('pointermove', (event) => {
        const bounds = hero.getBoundingClientRect();
        moveX((((event.clientX - bounds.left) / bounds.width) - .5) * 18);
        moveY((((event.clientY - bounds.top) / bounds.height) - .5) * 12);
      }, { passive: true });
    }
  }

  const gallery = document.querySelector('[data-mo3-gallery]');
  const track = gallery?.querySelector('[data-mo3-gallery-track]');
  const meter = gallery?.querySelector('[data-mo3-gallery-progress]');
  const media = gsap.matchMedia();
  media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    if (!gallery || !track) return;
    const travel = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * .08);
    gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: gallery,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.05,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => { if (meter) meter.style.width = `${progress * 100}%`; },
      },
    });
    gsap.utils.toArray('.mo3-gallery-frame').forEach((frame, index) => {
      gsap.fromTo(frame, { y: index % 2 ? 54 : -22, rotate: index % 2 ? 1.2 : -.7 }, {
        y: index % 2 ? -32 : 20,
        rotate: 0,
        ease: 'none',
        scrollTrigger: { trigger: gallery, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      gsap.fromTo(frame.querySelector('img'), { scale: 1.08 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: gallery, start: `${index * 8}% top`, end: 'bottom bottom', scrub: 1 },
      });
    });
  });

  const services = document.querySelector('[data-mo3-services]');
  if (services) {
    const stage = services.querySelector('.mo3-service-stage');
    services.querySelectorAll('[data-v2-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        services.dataset.mode = tab.dataset.v2Tab;
        requestAnimationFrame(() => {
          const panel = stage.querySelector('.mo3-service-panel.is-active');
          if (!panel || reducedMotion) return;
          gsap.fromTo(panel, { autoAlpha: .15 }, { autoAlpha: 1, duration: .65, ease: 'power2.out', overwrite: true });
          gsap.fromTo(panel.querySelector('img, .mo3-type-canvas'), { scale: 1.035 }, { scale: 1, duration: .9, ease: 'power3.out', overwrite: true });
          gsap.fromTo(panel.querySelector('div:last-child'), { y: 22, autoAlpha: .2 }, { y: 0, autoAlpha: 1, duration: .65, ease: 'power3.out', overwrite: true });
        });
      });
    });
  }
}, document.body);

window.addEventListener('pagehide', () => context.revert(), { once: true });
