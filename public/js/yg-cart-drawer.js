(function () {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;

    function post(url, body) {
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body || {}),
        });
    }

    function del(url, body) {
        return fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body || {}),
        });
    }

    function markRecoAdded(btn) {
        btn.textContent = 'Added to basket';
        btn.classList.add('is-added');
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
    }

    function unmarkRecoAdded(btn) {
        btn.textContent = 'Add';
        btn.classList.remove('is-added');
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
    }

    const Drawer = {
        mount: null,
        activeExtend: null,
        extendCloseTimer: null,
        recoStorageKey: 'yg_demo_hide_recommendations',
        returningNoteStorageKey: 'yg_demo_dismiss_returning_note',

        init() {
            this.mount = document.getElementById('yg-drawer-mount');
            this.bindGlobal();
            if (this.mount) {
                this.wireDrawer(this.mount);
            }
            this.initMiniBasket();
        },

        isRecoHidden() {
            try {
                return window.localStorage.getItem(this.recoStorageKey) === '1';
            } catch (e) {
                return false;
            }
        },

        setRecoHidden(hidden) {
            try {
                if (hidden) {
                    window.localStorage.setItem(this.recoStorageKey, '1');
                } else {
                    window.localStorage.removeItem(this.recoStorageKey);
                }
            } catch (e) {
                // ignore
            }
        },

        isReturningNoteDismissed() {
            try {
                return window.localStorage.getItem(this.returningNoteStorageKey) === '1';
            } catch (e) {
                return false;
            }
        },

        setReturningNoteDismissed(dismissed) {
            try {
                if (dismissed) {
                    window.localStorage.setItem(this.returningNoteStorageKey, '1');
                } else {
                    window.localStorage.removeItem(this.returningNoteStorageKey);
                }
            } catch (e) {
                // ignore
            }
        },

        applyReturningNoteState(root = document) {
            const note = root.querySelector('.yg-drawer__returning-note');
            if (!note) {
                return;
            }

            if (this.isReturningNoteDismissed()) {
                note.remove();
            }
        },

        bindReturningNoteDismiss(root) {
            root.querySelectorAll('[data-dismiss-returning-note]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.setReturningNoteDismissed(true);
                    btn.closest('.yg-drawer__returning-note')?.remove();
                });
            });
        },

        applyRecoHiddenState() {
            const drawer = document.getElementById('yg-cart-drawer');
            if (!drawer) {
                return;
            }

            const hidden = this.isRecoHidden();
            drawer.classList.toggle('yg-drawer--no-reco', hidden);

            if (hidden) {
                const panel = document.getElementById('yg-reco-panel');
                if (panel) {
                    panel.hidden = true;
                    panel.classList.remove('is-open');
                }
                document.querySelectorAll('[data-extend-open="reco"]').forEach((tab) => {
                    tab.classList.remove('is-active');
                    tab.setAttribute('aria-expanded', 'false');
                    tab.hidden = true;
                });
                document.querySelectorAll('.yg-reco-mobile-entry').forEach((el) => {
                    el.classList.remove('is-active');
                    el.hidden = true;
                });
                this.updateRecoTabLabel(false);
                if (this.activeExtend === 'reco') {
                    this.activeExtend = null;
                }
            } else {
                document.querySelectorAll('[data-extend-open="reco"]').forEach((tab) => {
                    tab.hidden = false;
                });
                document.querySelectorAll('.yg-reco-mobile-entry').forEach((el) => {
                    el.hidden = false;
                });
            }
        },

        bindGlobal() {
            document.addEventListener('click', (e) => {
                const openBtn = e.target.closest('[data-open-drawer]');
                if (openBtn) {
                    e.preventDefault();
                    this.open(openBtn.id === 'demo-view-basket' ? 'view_basket' : 'header');
                    return;
                }

                const atb = e.target.closest('#demo-add-to-basket');
                if (atb) {
                    e.preventDefault();
                    this.handleAddToBasket(atb);
                }
            });

            document.getElementById('toggle-drawer-mode')?.addEventListener('change', async (e) => {
                window.__YG_CART_DRAWER_ENABLED = e.target.checked;
                await post(window.YG_DEMO_ROUTES.toggleDrawer, { enabled: e.target.checked });
            });

            document.querySelectorAll('[data-option]').forEach((input) => {
                input.addEventListener('change', async (e) => {
                    const res = await post(window.YG_DEMO_ROUTES.toggleOption, {
                        key: e.target.dataset.option,
                        enabled: e.target.checked,
                    });
                    const data = await res.json().catch(() => ({}));
                    const onCheckout = document.body.classList.contains('demo-checkout-page');
                    const checkoutReloadOptions = new Set(['apple_pay', 'clearpay', 'klarna']);
                    const needsReload = data.reload
                        || (onCheckout && checkoutReloadOptions.has(e.target.dataset.option));
                    if (needsReload) {
                        window.location.reload();
                        return;
                    }
                    await this.refresh();
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (this.activeExtend) {
                        this.closeExtend();
                    } else {
                        this.close();
                    }
                }
            });
        },

        drawerEnabled() {
            return window.__YG_CART_DRAWER_ENABLED !== false
                && window.__YG_CART_DRAWER_ENABLED !== 'false';
        },

        async handleAddToBasket(btn) {
            if (!this.drawerEnabled()) {
                alert('Control: would go to full basket page (vieword.csp)');
                return;
            }

            const sku = btn.getAttribute('data-pdp-sku') || '510317';
            const variant = btn.getAttribute('data-pdp-variant') || '';
            const qtyInput = document.getElementById('demo-pdp-qty');
            const qty = Math.max(1, parseInt(qtyInput?.textContent || '1', 10));

            try {
                const body = { sku, qty };
                if (variant) {
                    body.variant = variant;
                }
                const res = await post(window.YG_DEMO_ROUTES.add, body);
                const data = await res.json();

                if (!res.ok) {
                    console.error('[demo] add to basket failed', data);
                    alert(data.error || 'Could not add to basket.');
                    return;
                }

                if (this.mount && data.html) {
                    this.mount.innerHTML = data.html;
                    this.wireDrawer(this.mount);
                }

                this.updateCartBadges(data.cart);
                this.open('add_to_basket');
            } catch (err) {
                console.error('[demo] add to basket error', err);
                alert('Could not add to basket. Check the console.');
            }
        },

        open(source) {
            if (!this.drawerEnabled()) {
                alert('Control: would navigate to basket page');
                return;
            }

            this.closeMiniBasket();

            const drawer = document.getElementById('yg-cart-drawer');
            if (!drawer) {
                console.error('[demo] drawer element #yg-cart-drawer not found');
                return;
            }

            drawer.hidden = false;
            this.applyRecoHiddenState();
            this.primeRecoForDrawerOpen();

            requestAnimationFrame(() => {
                drawer.classList.add('is-open');
                document.body.classList.add('yg-drawer-open');

                requestAnimationFrame(() => {
                    document.getElementById('yg-reco-panel')?.classList.remove('yg-extend--no-transition');
                });
            });
            console.info('[demo] drawer open', source);
        },

        close() {
            const drawer = document.getElementById('yg-cart-drawer');
            if (!drawer) {
                return;
            }

            drawer.classList.remove('is-open');
            document.body.classList.remove('yg-drawer-open');
            this.closeExtend();

            setTimeout(() => {
                if (!drawer.classList.contains('is-open')) {
                    drawer.hidden = true;
                }
            }, 220);
        },

        isMobileDrawer() {
            return window.matchMedia('(max-width: 767px)').matches;
        },

        shouldDefaultRecoOpen() {
            const drawer = document.getElementById('yg-cart-drawer');

            return Boolean(
                drawer
                && !drawer.classList.contains('yg-drawer--no-reco')
                && !this.isRecoHidden()
                && document.getElementById('yg-reco-panel')
                && !this.isMobileDrawer()
            );
        },

        primeRecoForDrawerOpen() {
            const panel = document.getElementById('yg-reco-panel');
            if (!panel || !this.shouldDefaultRecoOpen()) {
                return;
            }

            if (this.extendCloseTimer) {
                clearTimeout(this.extendCloseTimer);
                this.extendCloseTimer = null;
            }

            panel.hidden = false;
            panel.classList.add('is-open', 'yg-extend--no-transition');
            this.activeExtend = 'reco';

            document.querySelectorAll('[data-extend-open="reco"]').forEach((tab) => {
                tab.classList.add('is-active');
                tab.setAttribute('aria-expanded', 'true');
            });
            this.updateRecoTabLabel(true);
        },

        openDefaultReco() {
            if (!this.shouldDefaultRecoOpen() || this.activeExtend === 'reco') {
                return;
            }

            const drawer = document.getElementById('yg-cart-drawer');
            if (drawer?.classList.contains('is-open')) {
                this.openExtend('reco');
            }
        },

        updateRecoTabLabel(isOpen) {
            document.querySelectorAll('.yg-side-tab--reco .yg-side-tab__label').forEach((el) => {
                el.textContent = isOpen ? 'Hide recommendations' : 'Recommendations';
            });
        },

        setSheetOpen(open) {
            document.getElementById('yg-cart-drawer')?.classList.toggle('yg-drawer--sheet-open', open);
        },

        closeExtend() {
            if (this.extendCloseTimer) {
                clearTimeout(this.extendCloseTimer);
                this.extendCloseTimer = null;
            }

            if (this.activeExtend === 'reco') {
                // User explicitly hid recommendations; persist this choice.
                this.setRecoHidden(true);
            }

            document.querySelectorAll('.yg-extend.is-open').forEach((el) => {
                el.classList.remove('is-open');
            });
            document.querySelectorAll('.yg-side-tab.is-active, .yg-reco-mobile-entry.is-active').forEach((el) => {
                el.classList.remove('is-active');
                el.setAttribute('aria-expanded', 'false');
            });
            this.setSheetOpen(false);
            this.extendCloseTimer = setTimeout(() => {
                this.extendCloseTimer = null;
                document.querySelectorAll('.yg-extend').forEach((el) => {
                    if (!el.classList.contains('is-open')) {
                        el.hidden = true;
                    }
                });
            }, 220);
            if (this.activeExtend === 'reco') {
                this.updateRecoTabLabel(false);
            }
            this.activeExtend = null;

            this.applyRecoHiddenState();
        },

        restoreExtend(id) {
            const panelId = id === 'club' ? 'yg-club-panel' : 'yg-reco-panel';
            const panel = document.getElementById(panelId);

            if (!panel) {
                return;
            }

            if (this.extendCloseTimer) {
                clearTimeout(this.extendCloseTimer);
                this.extendCloseTimer = null;
            }

            this.activeExtend = id;
            panel.hidden = false;
            panel.classList.add('is-open', 'yg-extend--no-transition');

            document.querySelectorAll(`[data-extend-open="${id}"]`).forEach((tab) => {
                tab.classList.add('is-active');
                tab.setAttribute('aria-expanded', 'true');
            });

            if (this.isMobileDrawer()) {
                this.setSheetOpen(true);
            }

            requestAnimationFrame(() => {
                panel.classList.remove('yg-extend--no-transition');
            });

            if (id === 'reco') {
                this.updateRecoTabLabel(true);
            }
        },

        applyMountHtml(html, { preserveExtend = null } = {}) {
            if (!this.mount || !html) {
                return;
            }

            // Cancel a pending extend-close hide so a freshly mounted club/reco
            // panel is not immediately hidden by a stale timer from add-club.
            if (this.extendCloseTimer) {
                clearTimeout(this.extendCloseTimer);
                this.extendCloseTimer = null;
            }

            this.mount.innerHTML = html;
            this.wireDrawer(this.mount, { preserveExtend });

            if (preserveExtend) {
                this.restoreExtend(preserveExtend);
            }
        },

        applyCartResponse(data, { preserveExtend = null, keepOpen = false } = {}) {
            if (!data?.html) {
                return false;
            }

            this.applyMountHtml(data.html, { preserveExtend });
            this.updateCartBadges(data.cart);

            if (keepOpen) {
                const drawer = document.getElementById('yg-cart-drawer');
                if (drawer) {
                    drawer.hidden = false;
                    drawer.classList.add('is-open');
                    document.body.classList.add('yg-drawer-open');
                }
            }

            return true;
        },

        reopenExtend(id) {
            this.restoreExtend(id);
        },

        openExtend(id) {
            if (id === 'reco' && this.isMobileDrawer()) {
                return;
            }

            const panelId = id === 'club' ? 'yg-club-panel' : 'yg-reco-panel';
            const panel = document.getElementById(panelId);

            if (this.activeExtend === id && panel?.classList.contains('is-open')) {
                this.closeExtend();
                return;
            }

            this.closeExtend();

            if (!panel) {
                return;
            }

            if (id === 'reco') {
                // User is choosing to view recommendations again.
                this.setRecoHidden(false);
                this.applyRecoHiddenState();
            }

            document.querySelectorAll(`[data-extend-open="${id}"]`).forEach((tab) => {
                tab.classList.add('is-active');
                tab.setAttribute('aria-expanded', 'true');
            });

            panel.hidden = false;
            if (this.isMobileDrawer()) {
                this.setSheetOpen(true);
            }
            requestAnimationFrame(() => {
                panel.classList.add('is-open');
            });
            this.activeExtend = id;

            if (id === 'reco') {
                this.updateRecoTabLabel(true);
            }
        },

        updateCartBadges(cart) {
            const count = cart?.item_count;
            if (count == null) {
                return;
            }

            document.querySelectorAll('#header-cart-count, #topbar-cart-count').forEach((el) => {
                el.textContent = count;
            });

            const total = cart?.basket_total;
            if (total != null) {
                const formatted = Number(total).toFixed(2);
                document.querySelectorAll('#topbar-cart-total, [data-mini-basket-total]').forEach((el) => {
                    el.textContent = formatted;
                });
            }

            const viewBasket = document.getElementById('demo-view-basket');
            if (viewBasket) {
                viewBasket.textContent = `View basket (${count})`;
            }

            this.renderMiniBasket(cart);
        },

        escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        renderMiniBasket(cart) {
            const root = document.querySelector('[data-mini-basket]');
            if (!root || !cart) {
                return;
            }

            const scroll = root.querySelector('[data-mini-basket-scroll]');
            const trigger = root.querySelector('[data-mini-basket-trigger]');
            const items = Array.isArray(cart.items) ? cart.items : [];
            const count = cart.item_count ?? 0;
            const total = Number(cart.basket_total ?? 0).toFixed(2);

            if (trigger) {
                const totalLabel = Number(cart.basket_total ?? 0).toFixed(2);
                trigger.setAttribute('aria-label', `Your basket, ${count} item(s), £${totalLabel}`);
            }

            const countLabel = root.querySelector('#yg-mini-basket-count-label');
            if (countLabel) {
                countLabel.textContent = String(count);
            }

            if (!scroll) {
                return;
            }

            if (!items.length || count < 1) {
                scroll.innerHTML = '<p class="yg-mini-basket__empty" data-mini-basket-empty>Your basket is empty</p>';
                return;
            }

            const rows = items
                .map((item) => {
                    const price = Number(item.unit_price ?? item.price ?? 0).toFixed(2);
                    const imgSrc = (() => {
                        const raw = String(item.image || '');
                        if (!raw) return '';
                        if (raw.startsWith('http') || raw.startsWith('/')) return this.escapeHtml(raw);
                        return '/' + this.escapeHtml(raw.replace(/^\//, ''));
                    })();
                    const name = this.escapeHtml(item.name || '');
                    const sku = this.escapeHtml(item.sku || '');
                    const qty = this.escapeHtml(item.qty ?? 1);
                    const href = this.escapeHtml(item.url || '/pdp');

                    return `<li class="yg-mini-basket__item" data-sku="${sku}">
                        <a class="yg-mini-basket__img-link" href="${href}" aria-label="${name}">
                            <img class="yg-mini-basket__img" src="${imgSrc}" alt="" width="56" height="56" loading="lazy">
                        </a>
                        <div class="yg-mini-basket__meta">
                            <p class="yg-mini-basket__name">
                                <a class="yg-mini-basket__name-link" href="${href}">${name}</a>
                            </p>
                            <p class="yg-mini-basket__sku">Product No. ${sku}</p>
                        </div>
                        <div class="yg-mini-basket__pricing">
                            <span class="yg-mini-basket__price">£${price}</span>
                            <span class="yg-mini-basket__qty">Qty ${qty}</span>
                        </div>
                    </li>`;
                })
                .join('');

            scroll.innerHTML = `<ul class="yg-mini-basket__list" data-mini-basket-list>${rows}</ul>`;
        },

        initMiniBasket() {
            const root = document.querySelector('[data-mini-basket]');
            if (!root || root.dataset.miniBasketReady === '1') {
                return;
            }
            root.dataset.miniBasketReady = '1';

            const trigger = root.querySelector('[data-mini-basket-trigger]');
            const panel = root.querySelector('[data-mini-basket-panel]');
            if (!trigger || !panel) {
                return;
            }

            let closeTimer = null;

            const open = () => {
                clearTimeout(closeTimer);
                closeTimer = null;
                root.classList.add('is-open');
                panel.hidden = false;
                trigger.setAttribute('aria-expanded', 'true');
            };

            const close = () => {
                clearTimeout(closeTimer);
                closeTimer = null;
                root.classList.remove('is-open');
                panel.hidden = true;
                trigger.setAttribute('aria-expanded', 'false');
            };

            const scheduleClose = () => {
                clearTimeout(closeTimer);
                closeTimer = setTimeout(close, 180);
            };

            root.addEventListener('mouseenter', open);
            root.addEventListener('mouseleave', scheduleClose);
            root.addEventListener('focusin', open);
            root.addEventListener('focusout', (e) => {
                if (!root.contains(e.relatedTarget)) {
                    scheduleClose();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && root.classList.contains('is-open')) {
                    close();
                    trigger.focus();
                }
            });

            // Keep preview open when interacting with scroll area
            panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

            this._closeMiniBasket = close;
        },

        closeMiniBasket() {
            if (typeof this._closeMiniBasket === 'function') {
                this._closeMiniBasket();
                return;
            }
            const root = document.querySelector('[data-mini-basket]');
            if (!root) return;
            const trigger = root.querySelector('[data-mini-basket-trigger]');
            const panel = root.querySelector('[data-mini-basket-panel]');
            root.classList.remove('is-open');
            if (panel) panel.hidden = true;
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        },

        preserveExtendOnRefresh() {
            if (this.isMobileDrawer()) {
                return null;
            }

            return this.activeExtend;
        },

        async refresh() {
            const wasOpen = document.getElementById('yg-cart-drawer')?.classList.contains('is-open');
            const preserveExtend = this.preserveExtendOnRefresh();

            try {
                const res = await fetch(window.YG_DEMO_ROUTES.fragment, {
                    cache: 'no-store',
                    credentials: 'same-origin',
                    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await res.json();

                this.applyCartResponse(data, { preserveExtend, keepOpen: wasOpen });
            } catch (err) {
                console.error('[demo] cart refresh failed', err);
            }
        },

        wireDrawer(root, { preserveExtend = null } = {}) {
            if (!preserveExtend && !root.querySelector('.yg-extend.is-open')) {
                this.activeExtend = null;
            }

            this.applyRecoHiddenState();
            this.applyReturningNoteState(root);
            this.bindReturningNoteDismiss(root);

            root.querySelectorAll('[data-drawer-close]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    if (this.activeExtend && this.isMobileDrawer()) {
                        this.closeExtend();
                        return;
                    }
                    this.close();
                });
            });

            root.querySelectorAll('[data-extend-open]').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openExtend(btn.getAttribute('data-extend-open'));
                });
            });

            root.querySelectorAll('[data-extend-close]').forEach((btn) => {
                btn.addEventListener('click', () => this.closeExtend());
            });

            root.querySelectorAll('[data-reco-checkout]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.closeExtend();
                    this.goToCheckout();
                });
            });

            root.querySelectorAll('[data-club-add]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const sku = btn.getAttribute('data-club-sku');
                    const body = sku ? { sku } : {};
                    const res = await post(window.YG_DEMO_ROUTES.club, body);
                    const data = await res.json();
                    if (!res.ok) {
                        alert(data.error || 'Could not add membership.');
                        return;
                    }
                    // Remount replaces the club panel; skip closeExtend() so its
                    // delayed hide timer cannot race a later remove/refresh.
                    this.applyCartResponse(data, { keepOpen: true });
                    this.activeExtend = null;
                    this.setSheetOpen(false);
                });
            });

            root.querySelectorAll('[data-reco-add]').forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (btn.disabled || btn.classList.contains('is-added')) {
                        return;
                    }

                    const sku = btn.getAttribute('data-reco-add');
                    if (!sku) {
                        return;
                    }

                    markRecoAdded(btn);

                    try {
                        const res = await post(window.YG_DEMO_ROUTES.add, { sku, qty: 1 });
                        const data = await res.json();

                        if (!res.ok) {
                            unmarkRecoAdded(btn);
                            alert(data.error || 'Could not add to basket.');
                            return;
                        }

                        this.applyCartResponse(data, {
                            preserveExtend: this.preserveExtendOnRefresh(),
                            keepOpen: true,
                        });
                    } catch (err) {
                        unmarkRecoAdded(btn);
                        console.error('[demo] reco add failed', err);
                        alert('Could not add to basket.');
                    }
                });
            });

            const commitQty = async (sku, rawQty) => {
                const input = root.querySelector(`.yg-item[data-sku="${sku}"] .yg-qty__input`);
                const parsed = parseInt(String(rawQty), 10);
                const qty = Number.isFinite(parsed) ? Math.min(999, Math.max(0, parsed)) : null;

                if (qty === null) {
                    if (input) {
                        input.value = input.defaultValue;
                    }
                    return;
                }

                const res = await post(window.YG_DEMO_ROUTES.qty, { sku, qty });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    alert(data.error || 'Could not update quantity.');
                    if (input) {
                        input.value = input.defaultValue;
                    }
                    return;
                }

                await this.refresh();
            };

            root.querySelectorAll('[data-qty-plus]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const sku = btn.getAttribute('data-qty-plus');
                    const input = root.querySelector(`.yg-item[data-sku="${sku}"] .yg-qty__input`);
                    const qty = parseInt(input?.value || '1', 10) + 1;
                    await commitQty(sku, qty);
                });
            });

            root.querySelectorAll('[data-qty-minus]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const sku = btn.getAttribute('data-qty-minus');
                    const input = root.querySelector(`.yg-item[data-sku="${sku}"] .yg-qty__input`);
                    const qty = Math.max(0, parseInt(input?.value || '1', 10) - 1);
                    await commitQty(sku, qty);
                });
            });

            root.querySelectorAll('[data-qty-input]').forEach((input) => {
                input.addEventListener('focus', () => {
                    input.dataset.qtyOnFocus = input.value;
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        input.blur();
                    }
                });

                input.addEventListener('blur', async () => {
                    const sku = input.getAttribute('data-qty-input');
                    if (!sku || input.readOnly) {
                        return;
                    }
                    if (input.value === input.dataset.qtyOnFocus) {
                        return;
                    }
                    await commitQty(sku, input.value);
                });
            });

            root.querySelectorAll('[data-remove]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const sku = btn.getAttribute('data-remove');
                    const wasOpen = document.getElementById('yg-cart-drawer')?.classList.contains('is-open');
                    // Don't preserve the club panel after removing membership — the
                    // join-club bar must remount cleanly from the remove response.
                    const preserveExtend = this.activeExtend === 'club'
                        ? null
                        : this.preserveExtendOnRefresh();

                    try {
                        const res = await post(window.YG_DEMO_ROUTES.remove, { sku });
                        const data = await res.json().catch(() => ({}));

                        if (!res.ok) {
                            alert(data.error || 'Could not remove item.');
                            return;
                        }

                        if (!this.applyCartResponse(data, { preserveExtend, keepOpen: wasOpen })) {
                            await this.refresh();
                        }
                    } catch (err) {
                        console.error('[demo] cart remove failed', err);
                        await this.refresh();
                    }
                });
            });

            root.querySelectorAll('[data-apply-code]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const type = btn.getAttribute('data-apply-code');
                    const row = btn.closest('.yg-code-row');
                    const input = row?.querySelector('input');
                    const err = root.querySelector('#yg-code-error');
                    const res = await post(window.YG_DEMO_ROUTES.code, {
                        type,
                        code: input?.value || '',
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        if (err) {
                            err.textContent = data.error || 'Could not apply code.';
                            err.hidden = false;
                        }
                        return;
                    }
                    if (err) {
                        err.hidden = true;
                    }

                    await this.refresh();
                });
            });

            root.querySelectorAll('[data-remove-code]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    await del(window.YG_DEMO_ROUTES.removeCode, {
                        type: btn.getAttribute('data-remove-code'),
                    });
                    await this.refresh();
                });
            });

            root.querySelector('.yg-checkout')?.addEventListener('click', () => {
                this.goToCheckout();
            });

            window.YGDrawerTheme?.apply();
        },

        goToCheckout() {
            const url = window.YG_DEMO_ROUTES?.checkout || '/checkout';
            this.close();
            window.location.href = url;
        },

    };

    window.YGCartDrawer = {
        open: (s) => Drawer.open(s),
        close: () => Drawer.close(),
        refresh: () => Drawer.refresh(),
        isOpen: () => document.getElementById('yg-cart-drawer')?.classList.contains('is-open'),
        closeMiniBasket: () => Drawer.closeMiniBasket(),
        init: () => Drawer.init(),
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Drawer.init());
    } else {
        Drawer.init();
    }
})();
