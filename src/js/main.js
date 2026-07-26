import './styles.js';
import './menu.js';
import './scroll.js';
import './gallery.js';
import './form.js';
import './counters.js';
import './animations.js';
import './back-to-top.js';

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('M\u00B2 Studios website loaded successfully!');
