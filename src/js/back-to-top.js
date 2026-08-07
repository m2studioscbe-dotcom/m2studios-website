const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'back-to-top';
btn.setAttribute('aria-label', 'Back to top');
btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
document.body.appendChild(btn);

btn.addEventListener('click', () => {
    if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', (window.scrollY || 0) > 400);
}, { passive: true });
