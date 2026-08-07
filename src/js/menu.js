const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
    const closeMenu = () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-link, .dropdown-item, .nav-cta a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    nav.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const dd = link.closest('.nav-dropdown');
                if (dd) dd.classList.toggle('open');
            }
        });
    });
}
