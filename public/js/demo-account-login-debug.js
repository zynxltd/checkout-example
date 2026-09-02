(function () {
    const NS = '[YG account login]';
    const debug = window.__YG_ACCOUNT_LOGIN_DEBUG || {};

    function log(message, data) {
        if (data === undefined) {
            console.info(NS, message);
            return;
        }

        console.info(NS, message, data);
    }

    function warn(message, data) {
        if (data === undefined) {
            console.warn(NS, message);
            return;
        }

        console.warn(NS, message, data);
    }

    log('debug boot', {
        action: debug.action,
        appUrl: debug.appUrl,
        pageUrl: window.location.href,
        sessionDriver: debug.sessionDriver,
        securePage: window.location.protocol === 'https:',
        hasCsrfMeta: Boolean(document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')),
        errors: debug.errors || [],
        status: debug.status || null,
    });

    if (debug.errors?.length) {
        warn('server returned validation/auth errors', debug.errors);
    }

    if (debug.status) {
        log('server status flash', debug.status);
    }

    const form = document.querySelector('.demo-account-form');
    if (!form) {
        warn('login form not found');
        return;
    }

    const action = (form.getAttribute('action') || '').trim();
    const tokenInput = form.querySelector('input[name="_token"]');

    if (!action) {
        warn('form action is empty');
    } else if (action.startsWith('http://') && window.location.protocol === 'https:') {
        warn('form action is HTTP on an HTTPS page — session cookies may not persist', { action });
    }

    if (!tokenInput?.value) {
        warn('CSRF token input missing or empty — POST may return 419');
    }

    form.addEventListener('submit', (event) => {
        const email = form.querySelector('[name="email"]')?.value || '';
        const passwordField = form.querySelector('[name="password"]');
        const isSubmitting = form.classList.contains('is-submitting');

        log('submit event', {
            action,
            method: form.getAttribute('method') || 'get',
            email,
            hasPassword: Boolean(passwordField?.value),
            isSubmitting,
            defaultPrevented: event.defaultPrevented,
        });

        if (isSubmitting) {
            warn('submit blocked — form already marked is-submitting');
        }
    });

    form.addEventListener(
        'invalid',
        (event) => {
            warn('native validation blocked submit', {
                field: event.target?.name || event.target?.id || 'unknown',
            });
        },
        true,
    );

    window.addEventListener('pageshow', (event) => {
        log('pageshow', {
            persisted: event.persisted,
            path: window.location.pathname,
            errors: Array.from(document.querySelectorAll('.demo-account-errors li')).map((el) => el.textContent?.trim()),
        });
    });
})();
