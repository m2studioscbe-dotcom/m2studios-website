const filterButtons = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.gallery-item');

if (filterButtons.length && items.length) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            items.forEach(item => {
                const show = f === 'all' || (item.dataset.category || '').includes(f);
                item.style.display = show ? '' : 'none';
            });
        });
    });
}

if (items.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
        <button type="button" class="lightbox-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <img class="lightbox-img" alt="" />
        <p class="lightbox-caption"></p>
        <button type="button" class="lightbox-nav lightbox-next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>`;
    document.body.appendChild(lb);

    const img = lb.querySelector('.lightbox-img');
    const caption = lb.querySelector('.lightbox-caption');
    const prevBtn = lb.querySelector('.lightbox-prev');
    const nextBtn = lb.querySelector('.lightbox-next');
    let current = 0;

    const visibleItems = () => Array.from(items).filter(i => i.style.display !== 'none');

    const open = (list, i) => {
        current = i;
        const source = list[i].querySelector('img');
        img.src = source.src;
        img.alt = source.alt || '';
        const title = list[i].querySelector('.gallery-title');
        caption.textContent = title ? title.textContent : '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        lb.classList.remove('open');
        document.body.style.overflow = '';
    };

    items.forEach(item => {
        item.addEventListener('click', () => {
            const list = visibleItems();
            open(list, list.indexOf(item));
        });
    });

    lb.querySelector('.lightbox-close').addEventListener('click', close);

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = visibleItems();
        open(list, (current - 1 + list.length) % list.length);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = visibleItems();
        open(list, (current + 1) % list.length);
    });

    lb.addEventListener('click', (e) => {
        if (e.target === lb) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });
}
