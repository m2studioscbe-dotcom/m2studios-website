const numbers = document.querySelectorAll('[data-target]');

if (numbers.length) {
    const format = (n) => (n >= 1000 ? n.toLocaleString('en-IN') : String(n));

    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = format(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    numbers.forEach(n => io.observe(n));
}
