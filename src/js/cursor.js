const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.innerWidth > 1024 && !reducedMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.innerHTML = '<div class="cursor-ring"></div><div class="cursor-dot"></div>';
    document.body.appendChild(cursor);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    document.addEventListener('mousemove', (e) => {
        x = e.clientX;
        y = e.clientY;
    }, { passive: true });

    const lerp = (a, b, n) => a + (b - a) * n;
    const loop = () => {
        rx = lerp(rx, x, 0.18);
        ry = lerp(ry, y, 0.18);
        cursor.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
        requestAnimationFrame(loop);
    };
    loop();

    const isInteractive = (t) => t && t.closest('a, button, .gallery-item, .faq-question, .filter-btn, .division-card, input, select, textarea');

    document.addEventListener('mouseover', (e) => {
        cursor.classList.toggle('text-hover', !!isInteractive(e.target));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click-hover'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click-hover'));
}
