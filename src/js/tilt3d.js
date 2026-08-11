const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const noHover = window.matchMedia('(hover: none)').matches;

const initTilt = () => {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add('tilt3d');

    let glare = card.querySelector('.tilt3d-glare');
    if (!glare) {
      glare = document.createElement('span');
      glare.className = 'tilt3d-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }

    if (noHover || reducedMotion) return;

    let raf = null;
    let active = false;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const lerp = (a, b, n) => a + (b - a) * n;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tx = (px - 0.5) * 2;
      ty = (py - 0.5) * 2;
      if (glare) {
        glare.style.setProperty('--gx', `${px * 100}%`);
        glare.style.setProperty('--gy', `${py * 100}%`);
      }
      if (!active) {
        active = true;
        cx = tx; cy = ty;
        loop();
      }
    };

    const onLeave = () => { active = false; tx = 0; ty = 0; };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      cx = lerp(cx, tx, 0.12);
      cy = lerp(cy, ty, 0.12);
      const rx = cy * -8;
      const ry = cx * 10;
      const lift = active ? -6 : 0;
      card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(${lift.toFixed(1)}px)`;
      if (!active && Math.abs(cx) < 0.01 && Math.abs(cy) < 0.01) {
        cancelAnimationFrame(raf);
        raf = null;
        card.style.transform = '';
      }
    };

    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTilt);
} else {
  initTilt();
}
