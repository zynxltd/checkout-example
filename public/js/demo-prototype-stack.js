(function () {
    const STORAGE_KEY = 'yg_demo_prototype_stack_collapsed';
    const HIDDEN_KEY = 'yg_demo_prototype_stack_hidden';

    function ensureDockLabel(dock) {
        if (!dock) {
            return;
        }

        const cogSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2.5M12 20.5V23M4.22 4.22l1.77 1.77M17.99 17.99l1.77 1.77M1 12h2.5M20.5 12H23M4.22 19.78l1.77-1.77M17.99 6.01l1.77-1.77"/></svg>';

        if (!dock.getAttribute('aria-label')) {
            dock.setAttribute('aria-label', 'Prototype tools');
        }

        dock.querySelector('.demo-prototype-stack__dock-label')?.remove();

        let icon = dock.querySelector('.demo-prototype-stack__dock-icon');
        if (!icon) {
            icon = document.createElement('span');
            icon.className = 'demo-prototype-stack__dock-icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.innerHTML = cogSvg;
            dock.textContent = '';
            dock.appendChild(icon);
            return;
        }

        // Clear leftover text nodes; keep icon only
        Array.from(dock.childNodes).forEach((node) => {
            if (node !== icon) {
                node.remove();
            }
        });
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

        function pageWasReloaded() {
            const navigation = performance.getEntriesByType('navigation')[0];

            return navigation && navigation.type === 'reload';
        }

        function applySavedState() {
            try {
                const wasHidden = sessionStorage.getItem(HIDDEN_KEY) === '1';

                if (wasHidden && pageWasReloaded()) {
                    sessionStorage.removeItem(HIDDEN_KEY);
                } else if (wasHidden) {
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
