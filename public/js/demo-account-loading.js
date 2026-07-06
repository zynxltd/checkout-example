(function () {
    const MIN_SKELETON_MS = 220;
    const ASYNC_ACTION_MS = 900;

    function navType() {
        return performance.getEntriesByType('navigation')[0]?.type || 'navigate';
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function hidePageSpinner() {
        const spinner = document.getElementById('demo-account-page-spinner');
        spinner?.setAttribute('hidden', '');
        document.body.classList.remove('demo-account--page-loading');
    }

    function revealDash(root) {
        root.classList.remove('demo-account-dash--loading', 'demo-account-dash--nav-loading');
        root.classList.add('demo-account-dash--ready');
        root.removeAttribute('aria-busy');
        root.querySelectorAll('.demo-account-sk').forEach((el) => el.remove());
        document.getElementById('account-dashboard-main')?.removeAttribute('aria-busy');
        hidePageSpinner();
    }

    function scheduleSkeletonReveal(callback) {
        const minMs = prefersReducedMotion() ? 0 : MIN_SKELETON_MS;
        const started = performance.now();

        const reveal = () => {
            const wait = Math.max(0, minMs - (performance.now() - started));
            window.setTimeout(callback, wait);
        };

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            reveal();
        } else {
            document.addEventListener('DOMContentLoaded', reveal, { once: true });
        }
    }

    function initDashSkeleton() {
        const root = document.getElementById('account-dash-root');
        if (!root || !root.classList.contains('demo-account-dash--loading')) {
            hidePageSpinner();
            return;
        }

        if (navType() !== 'navigate') {
            revealDash(root);
            return;
        }

        scheduleSkeletonReveal(() => revealDash(root));
    }

    function setButtonLoading(button, loading) {
        if (!button || button.disabled) {
            return;
        }

        if (loading) {
            if (!button.dataset.demoLabel) {
                button.dataset.demoLabel = button.textContent.trim();
            }

            button.classList.add('is-loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');

            if (!button.querySelector('.demo-spinner')) {
                const spinner = document.createElement('span');
                spinner.className = 'demo-spinner demo-spinner--btn';
                spinner.setAttribute('role', 'status');
                spinner.setAttribute('aria-label', 'Loading');
                button.prepend(spinner);
            }

            return;
        }

        button.classList.remove('is-loading');
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.querySelector('.demo-spinner')?.remove();

        if (button.dataset.demoLabel) {
            button.textContent = button.dataset.demoLabel;
        }
    }

    function bindAsyncButtons() {
        document.querySelectorAll('[data-demo-async]').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                if (button.classList.contains('is-loading')) {
                    return;
                }

                setButtonLoading(button, true);

                const delay = prefersReducedMotion() ? 120 : ASYNC_ACTION_MS;
                window.setTimeout(() => {
                    setButtonLoading(button, false);

                    const applied = document.createElement('span');
                    applied.className = 'demo-account-club-vouchers__applied';
                    applied.textContent = 'APPLIED';
                    button.replaceWith(applied);
                }, delay);
            });
        });
    }

    function bindFormLoading() {
        document.querySelectorAll('form[data-demo-form-loading]').forEach((form) => {
            form.addEventListener('submit', (event) => {
                const submit = form.querySelector('[type="submit"]');
                if (!submit || submit.classList.contains('is-loading')) {
                    event.preventDefault();
                    return;
                }

                const action = (form.getAttribute('action') || '').trim();
                const isDemoOnly = action === '' || action === '#';

                if (isDemoOnly) {
                    event.preventDefault();
                    setButtonLoading(submit, true);

                    const delay = prefersReducedMotion() ? 120 : ASYNC_ACTION_MS;
                    window.setTimeout(() => {
                        setButtonLoading(submit, false);
                    }, delay);
                    return;
                }

                setButtonLoading(submit, true);
            });
        });
    }

    function bindNavLoading() {
        const dash = document.getElementById('account-dash-root');
        const main = document.getElementById('account-dashboard-main');
        if (!dash || !main) {
            return;
        }

        document.querySelectorAll('.demo-account-nav__item[href], .demo-account-nav__actions a[href]').forEach((link) => {
            link.addEventListener('click', () => {
                if (link.getAttribute('href') === window.location.pathname) {
                    return;
                }

                dash.classList.add('demo-account-dash--nav-loading');
                main.setAttribute('aria-busy', 'true');
            });
        });
    }

    function bindInvoiceAddressToggle() {
        const toggle = document.querySelector('[data-invoice-address-toggle]');
        const panel = document.getElementById('invoice-address-fields');
        const openField = document.querySelector('[data-invoice-address-open]');

        if (!toggle || !panel || !openField) {
            return;
        }

        const initPostcodeLookup = () => {
            window.DemoPostcodeLookup?.bindAll(panel);
        };

        toggle.addEventListener('click', () => {
            const isOpen = !panel.hidden;
            panel.hidden = isOpen;
            openField.value = isOpen ? '0' : '1';
            toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            toggle.textContent = isOpen ? 'Change Details' : 'Hide Details';

            if (!isOpen) {
                initPostcodeLookup();
                panel.querySelector('input, select, textarea')?.focus();
            }
        });
    }

    function bindPostcodeLookups() {
        window.DemoPostcodeLookup?.bindAll(document);
    }

    function bindDeleteAddressForms() {
        document.querySelectorAll('[data-demo-delete-address]').forEach((form) => {
            form.addEventListener('submit', (event) => {
                if (form.dataset.demoConfirmed === '1') {
                    return;
                }

                event.preventDefault();
                const confirmed = window.confirm('Delete this delivery address?');
                if (!confirmed) {
                    return;
                }

                form.dataset.demoConfirmed = '1';
                const submit = form.querySelector('[type="submit"]');
                setButtonLoading(submit, true);
                form.submit();
            });
        });
    }

    function boot() {
        initDashSkeleton();
        hidePageSpinner();
        bindAsyncButtons();
        bindFormLoading();
        bindNavLoading();
        bindInvoiceAddressToggle();
        bindPostcodeLookups();
        bindDeleteAddressForms();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
