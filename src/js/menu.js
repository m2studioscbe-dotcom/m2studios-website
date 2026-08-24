const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
    const dropdownLinks = [...nav.querySelectorAll('.nav-dropdown > .nav-link')];

    const closeDropdowns = () => {
        dropdownLinks.forEach(link => {
            const dropdown = link.closest('.nav-dropdown');
            dropdown?.classList.remove('open');
            link.setAttribute('aria-expanded', 'false');
        });
    };

    const closeMenu = () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        closeDropdowns();
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) nav.querySelector('.nav-link')?.focus();
    });

    dropdownLinks.forEach(link => {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');

        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const dropdown = link.closest('.nav-dropdown');
                if (!dropdown) return;

                const willOpen = !dropdown.classList.contains('open');
                closeDropdowns();
                dropdown.classList.toggle('open', willOpen);
                link.setAttribute('aria-expanded', String(willOpen));
            }
        });
    });

    nav.querySelectorAll('.nav-link, .dropdown-item, .nav-cta a').forEach(link => {
        if (!dropdownLinks.includes(link)) link.addEventListener('click', closeMenu);
    });

    nav.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            toggle.focus();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
            toggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeMenu();
    });
}
