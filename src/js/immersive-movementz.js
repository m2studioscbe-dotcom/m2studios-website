import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('v3-enhanced');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const context = gsap.context(() => {
  const hero = document.querySelector('[data-mv3-hero]');
  if (hero && !reducedMotion) {
    const words = {
      move: hero.querySelector('[data-mv3-word="move"]'),
      perform: hero.querySelector('[data-mv3-word="perform"]'),
      become: hero.querySelector('[data-mv3-word="become"]'),
    };
    const slice = hero.querySelector('.mv3-hero-slice');
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from(words.move, { xPercent: -24, opacity: 0, duration: .75 }, 0)
      .from(words.perform, { xPercent: 20, opacity: 0, duration: .8 }, .12)
      .from(words.become, { yPercent: 70, opacity: 0, duration: .85 }, .24)
      .from('.mv3-hero-copy > p, .mv3-hero-copy .v2-primary-actions', { y: 24, opacity: 0, duration: .65, stagger: .08 }, .38)
      .from(slice, { xPercent: 45, rotate: 8, opacity: 0, duration: 1 }, .18);

    gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      defaults: { ease: 'none' },
    })
      .to(words.move, { xPercent: -16 }, 0)
      .to(words.perform, { xPercent: 13 }, 0)
      .to(words.become, { scale: 1.12, transformOrigin: 'left center' }, 0)
      .to(slice, { yPercent: 18, rotate: -1 }, 0)
      .to('.mv3-hero-main img', { scale: 1.08 }, 0);
  }

  const performance = document.querySelector('[data-mv3-performance]');
  if (performance && !reducedMotion) {
    const scenes = [...performance.querySelectorAll('[data-mv3-scene]')];
    const labels = [...performance.querySelectorAll('.mv3-performance-nav span')];
    const meter = performance.querySelector('[data-mv3-performance-progress]');
    let current = 0;

    const activate = (index) => {
      if (index === current && scenes[index]?.classList.contains('is-active')) return;
      current = index;
      scenes.forEach((scene, sceneIndex) => {
        const active = sceneIndex === index;
        scene.classList.toggle('is-active', active);
        scene.setAttribute('aria-hidden', String(!active));
        if (active) {
          gsap.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: .55, ease: 'power2.out', overwrite: true });
          gsap.fromTo(scene.querySelector('img'), { scale: 1.12, xPercent: sceneIndex % 2 ? 4 : -4 }, { scale: 1.03, xPercent: 0, duration: 1.4, ease: 'power2.out', overwrite: true });
          gsap.fromTo(scene.querySelector('div'), { y: 42, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7, ease: 'power3.out', overwrite: true });
        } else {
          gsap.set(scene, { autoAlpha: 0 });
        }
      });
      labels.forEach((label, labelIndex) => label.classList.toggle('is-active', labelIndex === index));
    };
    activate(0);

    ScrollTrigger.create({
      trigger: performance,
      start: 'top top',
      end: 'bottom bottom',
      scrub: .65,
      onUpdate: ({ progress }) => {
        activate(Math.min(scenes.length - 1, Math.floor(progress * scenes.length)));
        if (meter) meter.style.width = `${progress * 100}%`;
      },
    });
  }

  const services = document.querySelector('[data-mv3-services]');
  if (services) {
    const stage = services.querySelector('.mv3-service-stage');
    services.querySelectorAll('[data-v2-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        services.dataset.mode = tab.dataset.v2Tab;
        requestAnimationFrame(() => {
          const activePanel = stage.querySelector('.mv3-service-panel.is-active');
          if (!activePanel || reducedMotion) return;
          gsap.fromTo(activePanel, { autoAlpha: .2, y: 18 }, { autoAlpha: 1, y: 0, duration: .55, ease: 'power3.out', overwrite: true });
        });
      });
    });

    if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      const moveX = gsap.quickTo(stage, '--service-x', { duration: .45, ease: 'power2.out' });
      const moveY = gsap.quickTo(stage, '--service-y', { duration: .45, ease: 'power2.out' });
      stage.addEventListener('pointermove', (event) => {
        const bounds = stage.getBoundingClientRect();
        moveX(`${(((event.clientX - bounds.left) / bounds.width) - .5) * 12}px`);
        moveY(`${(((event.clientY - bounds.top) / bounds.height) - .5) * 8}px`);
      }, { passive: true });
      stage.addEventListener('pointerleave', () => { moveX('0px'); moveY('0px'); });
    }
  }

  const film = document.querySelector('[data-mv3-film]');
  const track = film?.querySelector('[data-mv3-film-track]');
  const filmMeter = film?.querySelector('[data-mv3-film-progress]');
  const media = gsap.matchMedia();
  media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    if (!film || !track) return;
    const travel = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * .08);
    gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: film,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => { if (filmMeter) filmMeter.style.width = `${progress * 100}%`; },
      },
    });
    gsap.utils.toArray('.mv3-film-frame').forEach((frame, index) => {
      gsap.fromTo(frame.querySelector('img'), { scale: 1.08 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: film, start: `${index * 8}% top`, end: 'bottom bottom', scrub: 1 },
      });
    });
  });
}, document.body);

window.addEventListener('pagehide', () => context.revert(), { once: true });
