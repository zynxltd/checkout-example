(function () {
    const STORAGE_KEY = 'yg_drawer_theme_v10';

    const FIELDS = [
        { key: 'headerBg', var: '--yg-theme-header-bg', label: 'Header background', default: '#ffffff' },
        { key: 'headerText', var: '--yg-theme-header-text', label: 'Header text', default: '#264f1c' },
        { key: 'headerBadgeBg', var: '--yg-theme-header-badge-bg', label: 'Item count badge', default: '#264f1c' },
        { key: 'headerBadgeText', var: '--yg-theme-header-badge-text', label: 'Count badge text', default: '#ffffff' },
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
        { key: 'checkoutBg', var: '--yg-theme-checkout-bg', label: 'Checkout button', default: '#f2e7d8' },
        { key: 'checkoutText', var: '--yg-theme-checkout-text', label: 'Checkout text', default: '#000000' },
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
            const parsed = JSON.parse(raw);
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

    function applyTheme(theme) {
        const drawer = drawerEl();
        if (!drawer) {
            return;
        }

        FIELDS.forEach((field) => {
            const value = theme[field.key] ?? field.default;
            drawer.style.setProperty(field.var, value);
        });

        drawer.style.setProperty('--yg-theme-close-icon-filter', 'none');
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
