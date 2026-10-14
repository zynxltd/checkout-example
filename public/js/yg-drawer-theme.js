(function () {
    const STORAGE_KEY = 'yg_drawer_theme_v10';

    const FIELDS = [
        { key: 'headerBg', var: '--yg-theme-header-bg', label: 'Header background', default: '#264f1c' },
        { key: 'headerText', var: '--yg-theme-header-text', label: 'Header text', default: '#ffffff' },
        { key: 'headerBadgeBg', var: '--yg-theme-header-badge-bg', label: 'Item count badge', default: '#ffffff' },
        { key: 'headerBadgeText', var: '--yg-theme-header-badge-text', label: 'Count badge text', default: '#264f1c' },
        { key: 'panelBg', var: '--yg-theme-panel-bg', label: 'Drawer background', default: '#f2e7d8' },
        { key: 'bodyText', var: '--yg-theme-body-text', label: 'Body text', default: '#483f3a' },
        { key: 'mutedText', var: '--yg-theme-muted-text', label: 'Muted text', default: '#7a726c' },
        { key: 'accentText', var: '--yg-theme-accent-text', label: 'Accent text', default: '#264f1c' },
        { key: 'price', var: '--yg-theme-price', label: 'Prices', default: '#e3185d' },
        { key: 'itemBg', var: '--yg-theme-item-bg', label: 'Product cards', default: '#ffffff' },
        { key: 'qtyBg', var: '--yg-theme-qty-bg', label: 'Quantity buttons', default: '#fafafa' },
        { key: 'qtyIcon', var: '--yg-theme-qty-icon', label: 'Quantity text', default: '#264f1c' },
        { key: 'clubBg', var: '--yg-theme-club-bg', label: 'Club banner', default: '#812881' },
        { key: 'clubText', var: '--yg-theme-club-text', label: 'Club banner text', default: '#ffffff' },
        { key: 'clubBtn', var: '--yg-theme-club-btn', label: 'Club button', default: '#e3185d' },
        { key: 'applyBtnBg', var: '--yg-theme-apply-btn-bg', label: 'Apply code button', default: '#264f1c' },
        { key: 'applyBtnText', var: '--yg-theme-apply-btn-text', label: 'Apply code text', default: '#ffffff' },
        { key: 'checkoutBg', var: '--yg-theme-checkout-bg', label: 'Checkout button', default: '#53b71d' },
        { key: 'checkoutText', var: '--yg-theme-checkout-text', label: 'Checkout text', default: '#ffffff' },
        { key: 'recoHeading', var: '--yg-theme-reco-heading', label: 'Recommendations title', default: '#264f1c' },
        { key: 'summaryBg', var: '--yg-theme-summary-bg', label: 'Summary area', default: '#ffffff' },
    ];

    const defaults = Object.fromEntries(FIELDS.map((f) => [f.key, f.default]));

    function drawerEl() {
        return document.getElementById('yg-cart-drawer');
    }

    function loadSaved() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return { ...defaults };
            }
            const headerBg = String(parsed.headerBg || '').toLowerCase();
            const headerText = String(parsed.headerText || '').toLowerCase();
            if (!parsed.headerBg || headerBg === '#ffffff' || headerBg === '#fff') {
                if (!parsed.headerText || headerText === '#264f1c') {
                    parsed.headerBg = '#264f1c';
                    parsed.headerText = '#ffffff';
                }
            }
            const badgeBg = String(parsed.headerBadgeBg || '').toLowerCase();
            const badgeText = String(parsed.headerBadgeText || '').toLowerCase();
            if (!parsed.headerBadgeBg || badgeBg === '#264f1c') {
                if (!parsed.headerBadgeText || badgeText === '#ffffff' || badgeText === '#fff') {
                    parsed.headerBadgeBg = '#ffffff';
                    parsed.headerBadgeText = '#264f1c';
                }
            }
            if (!parsed.checkoutBg || String(parsed.checkoutBg).toLowerCase() === '#f2e7d8') {
                parsed.checkoutBg = '#53b71d';
                parsed.checkoutText = '#ffffff';
            }
            return { ...defaults, ...parsed };
        } catch {
            return { ...defaults };
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
        } catch {
            /* ignore quota */
        }
    }

    function closeIconFilter(color) {
        const hex = String(color || '').replace('#', '').trim();
        if (hex.length !== 6) {
            return 'none';
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if ([r, g, b].some((n) => Number.isNaN(n))) {
            return 'none';
        }
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.7 ? 'brightness(0) invert(1)' : 'none';
    }

    function applyTheme(theme) {
        const drawer = drawerEl();
        if (!drawer) {
            return;
        }

        FIELDS.forEach((field) => {
            const value = theme[field.key] ?? field.default;
            drawer.style.setProperty(field.var, value);
        });

        drawer.style.setProperty(
            '--yg-theme-close-icon-filter',
            closeIconFilter(theme.headerText),
        );
    }

    const DrawerTheme = {
        defaults,
        apply() {
            applyTheme(loadSaved());
        },
        reset() {
            saveTheme(defaults);
            applyTheme(defaults);
            document.querySelectorAll('[data-drawer-theme]').forEach((input) => {
                const field = FIELDS.find((f) => f.key === input.getAttribute('data-drawer-theme'));
                if (field) {
                    input.value = field.default;
                }
            });
        },
        init() {
            const root = document.getElementById('yg-drawer-theme');
            if (!root) {
                return;
            }

            const theme = loadSaved();
            applyTheme(theme);

            const panel = root.querySelector('.yg-drawer-theme__panel');
            const toggle = root.querySelector('[data-drawer-theme-toggle]');

            toggle?.addEventListener('click', () => {
                const open = root.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });

            root.querySelector('[data-drawer-theme-reset]')?.addEventListener('click', () => {
                this.reset();
            });

            FIELDS.forEach((field) => {
                const input = root.querySelector(`[data-drawer-theme="${field.key}"]`);
                if (!input) {
                    return;
                }

                input.value = theme[field.key] ?? field.default;

                input.addEventListener('input', () => {
                    const next = { ...loadSaved(), [field.key]: input.value };
                    saveTheme(next);
                    applyTheme(next);
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && root.classList.contains('is-open')) {
                    root.classList.remove('is-open');
                    toggle?.setAttribute('aria-expanded', 'false');
                }
            });
        },
    };

    window.YGDrawerTheme = DrawerTheme;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DrawerTheme.init());
    } else {
        DrawerTheme.init();
    }
})();
