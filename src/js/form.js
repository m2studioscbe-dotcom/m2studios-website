const form = document.getElementById('contactForm');
const status = document.getElementById('form-status');

if (form) {
    const fields = {
        name: { el: document.getElementById('name'), test: (v) => v.trim().length >= 2 },
        phone: { el: document.getElementById('phone'), test: (v) => /^\+?[\d\s\-]{10,15}$/.test(v.trim()) },
        email: { el: document.getElementById('email'), test: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
        service: { el: document.getElementById('service'), test: (v) => v !== '' },
        message: { el: document.getElementById('message'), test: (v) => v.trim().length >= 5 },
    };

    const setError = (field, bad) => {
        field.el.classList.toggle('error', bad);
        if (bad) field.el.setAttribute('aria-invalid', 'true');
        else field.el.removeAttribute('aria-invalid');
    };

    const clearErrors = () => Object.values(fields).forEach(f => setError(f, false));

    const validate = () => Object.entries(fields).map(([key, f]) => {
        const ok = f.test(f.el.value);
        setError(f, !ok);
        return ok;
    }).every(Boolean);

    Object.values(fields).forEach(f => f.el.addEventListener('input', clearErrors));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validate()) {
            status.textContent = 'Please check the highlighted fields and try again.';
            status.className = 'form-status error';
            return;
        }

        const name = fields.name.el.value.trim();
        const phone = fields.phone.el.value.trim();
        const email = fields.email.el.value.trim();
        const service = fields.service.el.value;
        const message = fields.message.el.value.trim();

        const text = [
            "Hi M\u00B2 Studios! I'd like to enquire.",
            'Name: ' + name,
            'Phone: ' + phone,
            email ? 'Email: ' + email : null,
            'Interested in: ' + service,
            'Message: ' + message,
        ].filter(Boolean).join('\n');

        const btn = document.getElementById('form-submit-btn');
        if (btn) btn.classList.add('btn-loading');
        status.textContent = 'Opening WhatsApp to send your enquiry...';
        status.className = 'form-status success';

        window.open('https://wa.me/919790825751?text=' + encodeURIComponent(text), '_blank', 'noopener');

        setTimeout(() => {
            form.reset();
            clearErrors();
            if (btn) btn.classList.remove('btn-loading');
            status.textContent = 'Enquiry ready! If WhatsApp did not open, message us directly at +91 97908 25751.';
        }, 1400);
    });
}
