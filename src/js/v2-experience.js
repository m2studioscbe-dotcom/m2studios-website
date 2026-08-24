const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('v2-enhanced');

const siteHeader = document.getElementById('site-header');
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

const intentStage = document.querySelector('[data-intent-stage]');
if (intentStage) {
  const intents = [...intentStage.querySelectorAll('[data-intent]')];
  const activate = (intent) => {
    intents.forEach((item) => {
      const active = item === intent;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  intents.forEach((intent) => {
    intent.addEventListener('pointerenter', () => activate(intent));
    intent.addEventListener('focusin', () => activate(intent));
    intent.addEventListener('click', () => activate(intent));
  });
}

const revealItems = document.querySelectorAll('[data-v2-reveal]');
if (revealItems.length) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-v2-depth]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty('--depth-x', `${(x * 12).toFixed(2)}px`);
      element.style.setProperty('--depth-y', `${(y * 8).toFixed(2)}px`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--depth-x', '0px');
      element.style.setProperty('--depth-y', '0px');
    });
  });
}

const serviceSelectors = document.querySelectorAll('[data-v2-selector]');
serviceSelectors.forEach((selector) => {
  const tabs = [...selector.querySelectorAll('[data-v2-tab]')];
  const panels = [...selector.querySelectorAll('[data-v2-panel]')];
  if (!tabs.length || !panels.length) return;

  const activate = (key, shouldFocus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.v2Tab === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && shouldFocus) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.dataset.v2Panel === key;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };

  selector.classList.add('is-enhanced');
  activate(tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.v2Tab || tabs[0].dataset.v2Tab);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.v2Tab));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activate(tabs[next].dataset.v2Tab, true);
    });
  });
});

const dialogs = [...document.querySelectorAll('[data-enquiry-dialog]')];
const resetDialog = (dialog) => {
  const steps = [...dialog.querySelectorAll('[data-enquiry-step]')];
  steps.forEach((step, index) => {
    step.hidden = index !== 0;
    step.classList.toggle('is-active', index === 0);
  });
  dialog.dataset.currentStep = '0';
  dialog.querySelectorAll('[data-step-dot]').forEach((dot, index) => {
    dot.classList.toggle('is-active', index === 0);
    dot.setAttribute('aria-current', index === 0 ? 'step' : 'false');
  });
};

document.querySelectorAll('[data-enquiry-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.enquiryOpen);
    if (!dialog) return;
    resetDialog(dialog);
    const preset = trigger.dataset.enquiryService;
    if (preset) {
      const input = dialog.querySelector(`[name="service"][value="${CSS.escape(preset)}"]`);
      if (input) input.checked = true;
    }
    dialog.showModal();
  });
});

dialogs.forEach((dialog) => {
  const form = dialog.querySelector('form');
  const steps = [...dialog.querySelectorAll('[data-enquiry-step]')];
  const dots = [...dialog.querySelectorAll('[data-step-dot]')];

  const showStep = (next) => {
    const safeStep = Math.max(0, Math.min(next, steps.length - 1));
    steps.forEach((step, index) => {
      step.hidden = index !== safeStep;
      step.classList.toggle('is-active', index === safeStep);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index <= safeStep);
      dot.setAttribute('aria-current', index === safeStep ? 'step' : 'false');
    });
    dialog.dataset.currentStep = String(safeStep);
    steps[safeStep]?.querySelector('input, select, textarea, button')?.focus({ preventScroll: true });
  };

  const currentFieldsValid = () => {
    const current = Number(dialog.dataset.currentStep || 0);
    const fields = [...steps[current].querySelectorAll('input, select, textarea')];
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      invalid.focus();
      return false;
    }
    return true;
  };

  dialog.querySelectorAll('[data-enquiry-next]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!currentFieldsValid()) return;
      showStep(Number(dialog.dataset.currentStep || 0) + 1);
    });
  });
  dialog.querySelectorAll('[data-enquiry-back]').forEach((button) => {
    button.addEventListener('click', () => showStep(Number(dialog.dataset.currentStep || 0) - 1));
  });
  dialog.querySelectorAll('[data-enquiry-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    form?.reset();
    resetDialog(dialog);
  });
  form?.addEventListener('submit', (event) => event.preventDefault());
});

const mobileActions = document.querySelector('[data-v2-mobile-actions]');
const footer = document.querySelector('.footer');
if (mobileActions && footer && 'IntersectionObserver' in window) {
  const footerObserver = new IntersectionObserver(([entry]) => {
    mobileActions.classList.toggle('is-docked-away', entry.isIntersecting);
  }, { threshold: 0.01 });
  footerObserver.observe(footer);
}
