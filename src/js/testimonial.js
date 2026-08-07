const slider = document.getElementById('testimonial-slider');
const track = document.getElementById('testimonial-track');
const nav = document.getElementById('testimonial-nav');

if (slider && track && nav) {
    const cards = track.querySelectorAll('.testimonial-card');
    const card = cards[0];
    const gap = 24;
    let index = 0;
    let auto = null;

    const buildDots = () => {
        cards.forEach((c, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
            dot.addEventListener('click', () => {
                go(i);
                restart();
            });
            nav.appendChild(dot);
        });
    };

    const update = () => {
        const width = card.getBoundingClientRect().width + gap;
        track.style.transform = `translateX(-${index * width}px)`;
        nav.querySelectorAll('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    };

    const go = (i) => {
        index = (i + cards.length) % cards.length;
        update();
    };

    const restart = () => {
        if (auto) clearInterval(auto);
        auto = setInterval(() => go(index + 1), 5000);
    };

    buildDots();
    update();
    restart();

    window.addEventListener('resize', update);
}
