import Lenis from 'lenis';

const header = document.getElementById('site-header');

let lenis = null;
try {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    window.__lenis = lenis;
} catch (err) {
    console.warn('Smooth scroll disabled:', err);
}

const headerOffset = () => (header ? header.offsetHeight : 80);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(target, { offset: -headerOffset() + 8 });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const onScroll = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    if (header) header.classList.toggle('scrolled', y > 40);

    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.offsetTop - headerOffset() - 140;
        if (y >= top) current = sec.id;
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === '#' + current) link.classList.add('active');
        else if (href !== '#' && !href.includes('.html')) link.classList.remove('active');
    });
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
