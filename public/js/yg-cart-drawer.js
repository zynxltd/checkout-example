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

        init() {
            this.mount = document.getElementById('yg-drawer-mount');
            this.bindGlobal();
            if (this.mount) {
                this.wireDrawer(this.mount);
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
                    await post(window.YG_DEMO_ROUTES.toggleOption, {
                        key: e.target.dataset.option,
                        enabled: e.target.checked,
                    });
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

            const drawer = document.getElementById('yg-cart-drawer');
            if (!drawer) {
                console.error('[demo] drawer element #yg-cart-drawer not found');
                return;
            }

            drawer.hidden = false;
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

            this.mount.innerHTML = html;
            this.wireDrawer(this.mount, { preserveExtend });

            if (preserveExtend) {
                this.restoreExtend(preserveExtend);
            }
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

            const viewBasket = document.getElementById('demo-view-basket');
            if (viewBasket) {
                viewBasket.textContent = `View basket (${count})`;
            }
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
                    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await res.json();

                this.applyMountHtml(data.html, { preserveExtend });

                this.updateCartBadges(data.cart);

                if (wasOpen) {
                    const drawer = document.getElementById('yg-cart-drawer');
                    if (drawer) {
                        drawer.hidden = false;
                        drawer.classList.add('is-open');
                        document.body.classList.add('yg-drawer-open');
                    }
                }
            } catch (err) {
                console.error('[demo] cart refresh failed', err);
            }
        },

        wireDrawer(root, { preserveExtend = null } = {}) {
            if (!preserveExtend && !root.querySelector('.yg-extend.is-open')) {
                this.activeExtend = null;
            }

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
                    if (data.html) {
                        this.applyMountHtml(data.html);
                        this.updateCartBadges(data.cart);
                        const drawer = document.getElementById('yg-cart-drawer');
                        if (drawer) {
                            drawer.hidden = false;
                            drawer.classList.add('is-open');
                            document.body.classList.add('yg-drawer-open');
                        }
                    }
                    this.closeExtend();
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

                        if (data.html) {
                            this.applyMountHtml(data.html, {
                                preserveExtend: this.preserveExtendOnRefresh(),
                            });
                            this.updateCartBadges(data.cart);

                            const drawer = document.getElementById('yg-cart-drawer');
                            if (drawer) {
                                drawer.hidden = false;
                                drawer.classList.add('is-open');
                                document.body.classList.add('yg-drawer-open');
                            }
                        }
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
                    await post(window.YG_DEMO_ROUTES.remove, { sku: btn.getAttribute('data-remove') });
                    await this.refresh();
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
        init: () => Drawer.init(),
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Drawer.init());
    } else {
        Drawer.init();
    }
})();
