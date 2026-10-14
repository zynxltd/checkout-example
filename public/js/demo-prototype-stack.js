(function () {
    const STORAGE_KEY = 'yg_demo_prototype_stack_collapsed';
    const HIDDEN_KEY = 'yg_demo_prototype_stack_hidden';

    function ensureDockLabel(dock) {
        if (!dock || dock.querySelector('.demo-prototype-stack__dock-label')) {
            return;
        }

        const label = document.createElement('span');
        label.className = 'demo-prototype-stack__dock-label';
        label.textContent = dock.textContent.trim();
        dock.textContent = '';
        dock.appendChild(label);
    }

    function ensureDismiss(stack) {
        const bar = stack.querySelector('.demo-prototype-stack__bar');
        if (!bar || bar.querySelector('[data-prototype-dismiss]')) {
            return null;
        }

        const minimize = bar.querySelector('[data-prototype-minimize]');
        const actions = document.createElement('div');
        actions.className = 'demo-prototype-stack__bar-actions';

        const dismiss = document.createElement('button');
        dismiss.type = 'button';
        dismiss.className = 'demo-prototype-stack__dismiss';
        dismiss.setAttribute('data-prototype-dismiss', '');
        dismiss.setAttribute('aria-label', 'Hide prototype tools');
        dismiss.textContent = '×';

        if (minimize) {
            actions.appendChild(minimize);
        }
        actions.appendChild(dismiss);
        bar.appendChild(actions);

        return dismiss;
    }

    function initStack(stack) {
        const dock = stack.querySelector('[data-prototype-dock]');
        const minimize = stack.querySelector('[data-prototype-minimize]');
        const dismiss = ensureDismiss(stack);
        ensureDockLabel(dock);

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

        function setHidden(hidden) {
            stack.classList.toggle('is-dismissed', hidden);
            stack.setAttribute('aria-hidden', hidden ? 'true' : 'false');

            try {
                sessionStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0');
            } catch {
                /* ignore */
            }
        }

        function applySavedState() {
            try {
                if (sessionStorage.getItem(HIDDEN_KEY) === '1') {
                    setHidden(true);
                    return;
                }

                const saved = sessionStorage.getItem(STORAGE_KEY);
                setCollapsed(saved === null ? true : saved === '1');
            } catch {
                setCollapsed(true);
            }
        }

        dock?.addEventListener('click', () => setCollapsed(false));
        minimize?.addEventListener('click', () => setCollapsed(true));
        dismiss?.addEventListener('click', () => setHidden(true));
        applySavedState();
    }

    function boot() {
        document.querySelectorAll('.demo-prototype-stack').forEach(initStack);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
