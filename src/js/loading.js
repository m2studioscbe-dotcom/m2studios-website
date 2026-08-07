const screen = document.getElementById('loading-screen');
const bar = document.getElementById('loading-bar');

if (screen) {
    let progress = 0;
    const tick = () => {
        progress = Math.min(progress + Math.random() * 16, 88);
        if (bar) bar.style.width = progress + '%';
        if (progress < 88) setTimeout(tick, 110);
    };
    tick();

    const hide = () => {
        if (bar) bar.style.width = '100%';
        setTimeout(() => {
            screen.classList.add('hidden');
            document.body.classList.add('loaded');
        }, 250);
    };

    window.addEventListener('load', hide);

    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) hide();
    }, 3500);
}
