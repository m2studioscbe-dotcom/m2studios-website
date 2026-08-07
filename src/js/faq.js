document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;

    q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(o => {
            o.classList.remove('open');
            const other = o.querySelector('.faq-answer');
            if (other) other.style.maxHeight = null;
            const qEl = o.querySelector('.faq-question');
            if (qEl) qEl.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('open');
            a.style.maxHeight = a.scrollHeight + 'px';
            q.setAttribute('aria-expanded', 'true');
        }
    });
});
