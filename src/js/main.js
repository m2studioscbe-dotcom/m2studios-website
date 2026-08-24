import './styles.js';
import './loading.js';
import './menu.js';
if (!document.body.classList.contains('page-v2')) import('./cursor.js');
import './counters.js';
import './testimonial.js';
import './gallery.js';
import './form.js';
import './faq.js';
import './back-to-top.js';
if (document.getElementById('hero-canvas')) import('./hero-canvas.js');
if (document.querySelector('[data-tilt]')) import('./tilt3d.js');
if (document.getElementById('showcase3d')) import('./three-gallery.js');

if (document.body.classList.contains('page-v2')) {
  import('./v2-experience.js');
} else {
  import('./scroll.js');
  import('./animations.js');
}

if (document.body.classList.contains('page-movementz')) {
  import('./movementz-experience.js');
}
