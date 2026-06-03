(function () {
    const stack = document.getElementById('demo-prototype-stack');
    if (!stack) {
        return;
    }

    const STORAGE_KEY = 'yg_demo_prototype_stack_collapsed';
    const dock = stack.querySelector('[data-prototype-dock]');
    const minimize = stack.querySelector('[data-prototype-minimize]');

    function closeDrawerThemePanel() {
        const theme = document.getElementById('yg-drawer-theme');
        const toggle = stack.querySelector('[data-drawer-theme-toggle]');

        theme?.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
    }

    function setCollapsed(collapsed) {
        stack.classList.toggle('is-collapsed', collapsed);
        dock?.setAttribute('aria-expanded', collapsed ? 'false' : 'true');

        if (collapsed) {
            closeDrawerThemePanel();
        }

        try {
            sessionStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
        } catch {
            /* ignore */
        }
    }

    function applySavedState() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            setCollapsed(saved === null ? true : saved === '1');
        } catch {
            setCollapsed(true);
        }
    }

    dock?.addEventListener('click', () => setCollapsed(false));
    minimize?.addEventListener('click', () => setCollapsed(true));

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySavedState);
    } else {
        applySavedState();
    }
})();
