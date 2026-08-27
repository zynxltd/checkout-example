(function () {
    const STORAGE_KEY = 'yg_demo_prototype_stack_collapsed';
    const MINI_BASKET_KEY = 'yg-mini-basket-dropdown-v1';

    function isMiniBasketOn() {
        try {
            return localStorage.getItem(MINI_BASKET_KEY) === 'on';
        } catch {
            return false;
        }
    }

    function setMiniBasketEnabled(enabled) {
        document.documentElement.classList.toggle('yg-mini-basket-on', enabled);

        try {
            localStorage.setItem(MINI_BASKET_KEY, enabled ? 'on' : 'off');
        } catch {
            /* ignore */
        }

        document.querySelectorAll('[data-mini-basket-toggle]').forEach((input) => {
            input.checked = enabled;
        });

        document.dispatchEvent(
            new CustomEvent('yg:mini-basket-toggle', { detail: { enabled } })
        );
    }

    function ensureMiniBasketToggle(stack) {
        const content = stack.querySelector('.demo-prototype-stack__content');
        if (!content || content.querySelector('[data-mini-basket-toggle]')) {
            return;
        }

        const aside = document.createElement('aside');
        aside.className = 'demo-controls';
        aside.setAttribute('aria-label', 'Mini basket dropdown');
        aside.innerHTML =
            '<h3>Mini basket</h3>' +
            '<label class="demo-toggle">' +
            '<input type="checkbox" data-mini-basket-toggle>' +
            '<span>Show dropdown mini basket</span>' +
            '</label>' +
            '<p class="demo-controls__hint">Desktop hover preview under Your Basket. Off by default — basket click still opens the drawer.</p>';

        content.insertBefore(aside, content.firstChild);

        const input = aside.querySelector('[data-mini-basket-toggle]');
        input.checked = isMiniBasketOn();
        input.addEventListener('change', () => {
            setMiniBasketEnabled(!!input.checked);
        });
    }

    function initStack(stack) {
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

        ensureMiniBasketToggle(stack);

        dock?.addEventListener('click', () => setCollapsed(false));
        minimize?.addEventListener('click', () => setCollapsed(true));
        applySavedState();
    }

    // Apply before paint where possible (default OFF — class only when on)
    setMiniBasketEnabled(isMiniBasketOn());

    function boot() {
        document.querySelectorAll('.demo-prototype-stack').forEach(initStack);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
