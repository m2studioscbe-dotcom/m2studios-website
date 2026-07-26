const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '\u2191';
    button.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;border-radius:50%;background-color:#ff6b6b;color:white;border:none;font-size:24px;cursor:pointer;display:none;z-index:1000;box-shadow:0 5px 15px rgba(255,107,107,0.3);transition:all 0.3s ease;';
    button.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    button.addEventListener('mouseenter', () => { button.style.transform = 'translateY(-5px)'; button.style.boxShadow = '0 8px 20px rgba(255,107,107,0.4)'; });
    button.addEventListener('mouseleave', () => { button.style.transform = 'translateY(0)'; button.style.boxShadow = '0 5px 15px rgba(255,107,107,0.3)'; });
    document.body.appendChild(button);
    window.addEventListener('scroll', () => { button.style.display = window.scrollY > 300 ? 'block' : 'none'; });
};

createBackToTopButton();
