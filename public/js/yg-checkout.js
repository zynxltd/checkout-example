(function () {
    'use strict';

    const routes = window.YG_DEMO_ROUTES || {};
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';

    async function post(url, body) {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body),
        });
        return res;
    }

    async function del(url, body) {
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body),
        });
        return res;
    }

    function goToCheckout() {
        window.location.href = routes.checkout || '/checkout';
    }

    function bindExpressButtons() {
        document.querySelectorAll('[data-express]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const method = btn.getAttribute('data-express');
                const labels = {
                    paypal: 'PayPal',
                    gpay: 'Google Pay',
                    apple: 'Apple Pay',
                    amazon: 'Amazon Pay',
                };
                alert(
                    `Prototype: ${labels[method] || method} express checkout would open here (Shopify-style, before sign-in).`,
                );
            });
        });
    }

    function bindPrototypeLinks() {
        document.querySelectorAll('[data-prototype-link]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Prototype: not linked in this demo.');
            });
        });
    }

    function bindLogin() {
        const toggle = document.getElementById('co-login-toggle');
        const panel = document.getElementById('co-login-panel');
        const guest = document.getElementById('co-contact-guest');
        const signedIn = document.getElementById('co-signed-in');
        const guestEmail = document.getElementById('co-guest-email');
        const guestPassword = document.getElementById('co-account-password');
        const guestPasswordConfirm = document.getElementById('co-account-password-confirm');
        const loginEmail = document.getElementById('co-login-email');
        const loginPassword = document.getElementById('co-login-password');
        const submit = document.getElementById('co-login-submit');
        const continueGuest = document.getElementById('co-login-guest');

        if (!toggle || !panel || !guest) {
            return;
        }

        const openLogin = () => {
            if (guestEmail?.value && loginEmail) {
                loginEmail.value = guestEmail.value;
            }
            panel.hidden = false;
            guest.hidden = true;
            toggle.hidden = true;
            loginPassword?.focus();
        };

        const closeLogin = () => {
            panel.hidden = true;
            guest.hidden = false;
            toggle.hidden = false;
        };

        toggle.addEventListener('click', openLogin);
        continueGuest?.addEventListener('click', closeLogin);

        submit?.addEventListener('click', () => {
            const email = loginEmail?.value.trim() || 'customer@yougarden.com';
            if (guestEmail) {
                guestEmail.value = email;
            }
            panel.hidden = true;
            guest.hidden = false;
            toggle.hidden = true;
            if (signedIn) {
                signedIn.textContent = `Signed in as ${email}`;
                signedIn.hidden = false;
            }
            if (guestPassword) {
                guestPassword.value = '';
            }
            if (guestPasswordConfirm) {
                guestPasswordConfirm.value = '';
            }
        });
    }

    function bindCreateAccount() {
        const toggle = document.getElementById('co-create-account');
        const fields = document.getElementById('co-account-fields');
        if (!toggle || !fields) {
            return;
        }

        const setRequired = (required) => {
            fields.querySelectorAll('input, select').forEach((el) => {
                if (required) {
                    el.setAttribute('required', 'required');
                } else {
                    el.removeAttribute('required');
                }
            });
        };

        const sync = () => {
            const on = !!toggle.checked;
            fields.hidden = !on;
            setRequired(on);
            if (!on) {
                fields.querySelectorAll('input').forEach((el) => {
                    el.value = '';
                });
                fields.querySelectorAll('select').forEach((el) => {
                    el.value = '';
                });
            }
        };

        toggle.addEventListener('change', sync);
        sync();
    }

    function bindGift() {
        const toggle = document.getElementById('co-gift-toggle');
        const message = document.getElementById('co-gift-message');
        if (!toggle || !message) {
            return;
        }
        const sync = () => {
            message.hidden = !toggle.checked;
        };
        toggle.addEventListener('change', sync);
        sync();
    }

    const DEMO_POSTCODE_ADDRESSES = [
        {
            postcode: 'PE6 8FD',
            firstName: 'Guest',
            lastName: 'Customer',
            address1: '12 Garden Lane',
            address2: '',
            city: 'Market Deeping',
            phone: '01733 000000',
        },
        {
            postcode: 'PE6 7AA',
            firstName: 'Guest',
            lastName: 'Customer',
            address1: '3 Church Street',
            address2: '',
            city: 'Market Deeping',
            phone: '01733 000001',
        },
        {
            postcode: 'NG31 8FU',
            firstName: 'Guest',
            lastName: 'Customer',
            address1: '45 High Street',
            address2: '',
            city: 'Grantham',
            phone: '01476 000000',
        },
        {
            postcode: 'PE1 1AA',
            firstName: 'Guest',
            lastName: 'Customer',
            address1: '10 Bridge Street',
            address2: 'Flat 2',
            city: 'Peterborough',
            phone: '01733 000002',
        },
    ];

    function normalizePostcode(value) {
        return String(value || '')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '');
    }

    function searchDemoAddresses(query) {
        const normalized = normalizePostcode(query);
        if (normalized.length < 2) {
            return [];
        }

        return DEMO_POSTCODE_ADDRESSES.filter((entry) => {
            const pc = normalizePostcode(entry.postcode);
            return pc.includes(normalized) || pc.startsWith(normalized);
        });
    }

    function bindPostcodeLookup(prefix, options = {}) {
        const root = document.querySelector(`[data-postcode-lookup="${prefix}"]`);
        if (!root) {
            return;
        }

        const input = root.querySelector('.co-postcode-row__input');
        const findBtn = root.querySelector('.co-postcode-row__find');
        const list = root.querySelector('.co-postcode-suggest');
        const manualFields = options.manualFieldsId
            ? document.getElementById(options.manualFieldsId)
            : null;
        const manualToggle = options.manualToggleId
            ? document.getElementById(options.manualToggleId)
            : null;

        if (!input || !findBtn || !list) {
            return;
        }

        const field = (key) => document.getElementById(`co-${prefix}-${key}`);

        const showManual = (open) => {
            if (!manualFields || !manualToggle) {
                return;
            }
            manualFields.hidden = !open;
            manualToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            manualToggle.textContent = open ? 'Hide manual address' : 'Enter address manually';
        };

        const hideList = () => {
            list.hidden = true;
            list.innerHTML = '';
            input.setAttribute('aria-expanded', 'false');
        };

        const formatLabel = (entry) => {
            const line2 = entry.address2 ? `, ${entry.address2}` : '';
            return `${entry.address1}${line2}, ${entry.city}, ${entry.postcode}`;
        };

        const applyAddress = (entry) => {
            const set = (key, value) => {
                const el = field(key);
                if (el) {
                    el.value = value;
                }
            };

            set('postcode', entry.postcode);
            set('first-name', entry.firstName);
            set('last-name', entry.lastName);
            set('address1', entry.address1);
            set('address2', entry.address2);
            set('city', entry.city);
            set('phone', entry.phone);
            showManual(true);
            hideList();
        };

        const renderMatches = (matches) => {
            list.innerHTML = '';

            if (!matches.length) {
                const empty = document.createElement('li');
                empty.className = 'co-postcode-suggest__empty';
                empty.textContent = 'No addresses found — try PE6, NG31 or enter manually.';
                list.appendChild(empty);
                list.hidden = false;
                input.setAttribute('aria-expanded', 'true');
                return;
            }

            matches.forEach((entry, index) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'co-postcode-suggest__item';
                item.setAttribute('role', 'option');
                item.id = `co-${prefix}-postcode-opt-${index}`;
                item.innerHTML = `<strong>${entry.postcode}</strong><span>${formatLabel(entry)}</span>`;
                item.addEventListener('click', () => applyAddress(entry));
                const li = document.createElement('li');
                li.appendChild(item);
                list.appendChild(li);
            });

            list.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        };

        let typeTimer;

        const runSearch = () => {
            renderMatches(searchDemoAddresses(input.value));
        };

        input.addEventListener('input', () => {
            clearTimeout(typeTimer);
            typeTimer = setTimeout(runSearch, 200);
        });

        input.addEventListener('focus', () => {
            if (normalizePostcode(input.value).length >= 2) {
                runSearch();
            }
        });

        findBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const matches = searchDemoAddresses(input.value);
            if (matches.length === 1) {
                applyAddress(matches[0]);
                return;
            }
            renderMatches(matches);
        });

        document.addEventListener('click', (e) => {
            if (!root.contains(e.target)) {
                hideList();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideList();
            }
        });
    }

    function bindBillingAddress() {
        const manualToggle = document.getElementById('co-billing-manual-toggle');
        const manualFields = document.getElementById('co-billing-fields');

        const showManual = (open) => {
            if (!manualFields || !manualToggle) {
                return;
            }
            manualFields.hidden = !open;
            manualToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            manualToggle.textContent = open ? 'Hide manual address' : 'Enter address manually';
        };

        manualToggle?.addEventListener('click', () => {
            showManual(manualFields.hidden);
        });

        bindPostcodeLookup('billing', {
            manualFieldsId: 'co-billing-fields',
            manualToggleId: 'co-billing-manual-toggle',
        });
    }

    function bindDeliveryAddress() {
        const toggle = document.getElementById('co-delivery-toggle');
        const fields = document.getElementById('co-delivery-fields');
        const status = document.getElementById('co-delivery-status');
        const sameInput = document.getElementById('co-delivery-same-as-billing');

        if (!toggle || !fields || !status || !sameInput) {
            return;
        }

        const billingMap = [
            ['co-billing-first-name', 'co-delivery-first-name'],
            ['co-billing-last-name', 'co-delivery-last-name'],
            ['co-billing-address1', 'co-delivery-address1'],
            ['co-billing-address2', 'co-delivery-address2'],
            ['co-billing-city', 'co-delivery-city'],
            ['co-billing-postcode', 'co-delivery-postcode'],
            ['co-billing-phone', 'co-delivery-phone'],
        ];

        const copyBillingToDelivery = () => {
            billingMap.forEach(([fromId, toId]) => {
                const from = document.getElementById(fromId);
                const to = document.getElementById(toId);
                if (from && to) {
                    to.value = from.value;
                }
            });

            const billingRegion = document.querySelector('[name="billing_region"]');
            const deliveryRegion = document.querySelector('[name="delivery_region"]');
            if (billingRegion && deliveryRegion) {
                deliveryRegion.value = billingRegion.value;
            }
        };

        const setAlternative = (useAlternative) => {
            fields.hidden = !useAlternative;
            toggle.setAttribute('aria-expanded', useAlternative ? 'true' : 'false');
            sameInput.value = useAlternative ? '0' : '1';

            if (useAlternative) {
                status.textContent = 'Enter a different delivery address below';
                toggle.textContent = 'Use billing address';
                copyBillingToDelivery();
                fields.querySelector('input, select, textarea')?.focus();
            } else {
                status.textContent = 'Your order will be delivered to your billing address';
                toggle.textContent = 'Choose alternative delivery address';
            }
        };

        toggle.addEventListener('click', () => {
            setAlternative(fields.hidden);
        });

        bindPostcodeLookup('delivery');
    }

    function bindCourierNotes() {
        const input = document.getElementById('co-courier-notes');
        const count = document.getElementById('co-courier-count');
        if (!input || !count) {
            return;
        }
        const sync = () => {
            const left = 50 - input.value.length;
            count.textContent = `(${left} characters left)`;
        };
        input.addEventListener('input', sync);
        sync();
    }

    function bindVoucher() {
        const applyBtn = document.getElementById('co-voucher-apply');
        const input = document.getElementById('co-voucher-input');
        const errorEl = document.getElementById('co-voucher-error');

        if (!applyBtn || !input || !routes.checkoutVoucher) {
            return;
        }

        const apply = async () => {
            const code = input.value.trim();
            if (!code) {
                if (errorEl) {
                    errorEl.textContent = 'Please enter a voucher code.';
                    errorEl.hidden = false;
                }
                return;
            }

            applyBtn.disabled = true;
            const res = await post(routes.checkoutVoucher, { code });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                if (errorEl) {
                    errorEl.textContent = data.error || 'Could not apply voucher.';
                    errorEl.hidden = false;
                }
                applyBtn.disabled = false;
                return;
            }

            window.location.reload();
        };

        applyBtn.addEventListener('click', apply);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                apply();
            }
        });
    }

    function bindRemoveVoucher() {
        document.querySelector('[data-remove-voucher]')?.addEventListener('click', async () => {
            if (!routes.checkoutVoucherRemove) {
                return;
            }
            await del(routes.checkoutVoucherRemove);
            window.location.reload();
        });
    }

    function bindRemoveOffer() {
        document.querySelector('[data-remove-offer]')?.addEventListener('click', async () => {
            if (!routes.removeCode) {
                return;
            }
            await del(routes.removeCode, { type: 'offer' });
            window.location.reload();
        });
    }

    function bindMobileOrderSummary() {
        const summary = document.getElementById('co-summary');
        const toggle = document.getElementById('co-summary-toggle');
        if (!summary || !toggle) {
            return;
        }

        const mq = window.matchMedia('(max-width: 999px)');

        const setExpanded = (expanded) => {
            summary.classList.toggle('is-expanded', expanded);
            toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        };

        const syncViewport = () => {
            if (mq.matches) {
                setExpanded(false);
                return;
            }
            setExpanded(true);
        };

        toggle.addEventListener('click', () => {
            if (!mq.matches) {
                return;
            }
            setExpanded(!summary.classList.contains('is-expanded'));
        });

        mq.addEventListener('change', syncViewport);
        syncViewport();
    }

    function bindPayNow() {
        const form = document.getElementById('co-form');
        const btn = document.getElementById('co-pay-now');
        if (!form || !btn) {
            return;
        }

        form.addEventListener('submit', () => {
            form.classList.add('is-submitting');
            btn.disabled = true;
            btn.setAttribute('aria-busy', 'true');
        });
    }

    function bindPaymentOptions() {
        const stack = document.getElementById('co-paystack');
        if (!stack) {
            return;
        }

        const sync = () => {
            const selected = stack.querySelector('.co-payopt__radio:checked');
            stack.querySelectorAll('.co-payopt').forEach((opt) => {
                const radio = opt.querySelector('.co-payopt__radio');
                opt.classList.toggle('is-selected', radio === selected);
            });
        };

        stack.querySelectorAll('.co-payopt__radio').forEach((radio) => {
            radio.addEventListener('change', sync);
        });
        sync();
    }

    function checkoutNavType() {
        return performance.getEntriesByType('navigation')[0]?.type || 'navigate';
    }

    function revealCheckout(root) {
        root.classList.remove('co--loading');
        root.classList.add('co--ready');
        root.removeAttribute('aria-busy');
        root.querySelectorAll('.co-sk').forEach((el) => el.remove());
    }

    function initCheckoutSkeleton() {
        const root = document.getElementById('co-root');
        if (!root) {
            return;
        }

        if (!root.classList.contains('co--loading')) {
            root.querySelectorAll('.co-sk').forEach((el) => el.remove());
            return;
        }

        if (checkoutNavType() !== 'navigate') {
            revealCheckout(root);
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const minMs = reducedMotion ? 0 : 520;
        const started = performance.now();

        const reveal = () => {
            const wait = Math.max(0, minMs - (performance.now() - started));
            window.setTimeout(() => revealCheckout(root), wait);
        };

        if (document.readyState === 'complete') {
            reveal();
        } else {
            window.addEventListener('load', reveal, { once: true });
        }
    }

    function bindSummaryRemove() {
        document.querySelectorAll('[data-co-remove]').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const sku = btn.getAttribute('data-co-remove');
                if (!sku || !routes.remove) {
                    return;
                }

                btn.disabled = true;
                const res = await post(routes.remove, { sku });
                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data.error || 'Could not remove this item.');
                    btn.disabled = false;
                    return;
                }

                window.location.reload();
            });
        });
    }

    function bindClubJoinModal() {
        const modal = document.getElementById('co-club-modal');
        if (!modal) {
            return;
        }

        const open = () => {
            modal.hidden = false;
            document.body.classList.add('co-club-modal-open');
            modal.querySelector('.co-club-modal__close')?.focus();
        };

        const close = () => {
            modal.hidden = true;
            document.body.classList.remove('co-club-modal-open');
        };

        document.querySelectorAll('[data-co-club-open]').forEach((btn) => {
            btn.addEventListener('click', open);
        });

        modal.querySelectorAll('[data-co-club-close]').forEach((el) => {
            el.addEventListener('click', close);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) {
                close();
            }
        });

        modal.querySelectorAll('[data-club-add]').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const sku = btn.getAttribute('data-club-sku');
                const body = sku ? { sku } : {};
                const expectedLines = parseInt(document.body.dataset.coLineCount || '0', 10);
                btn.disabled = true;

                const res = await post(routes.club, body);
                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data.error || 'Could not add membership.');
                    btn.disabled = false;
                    return;
                }

                const newLines = Array.isArray(data.cart?.items) ? data.cart.items.length : 0;
                if (expectedLines > 0 && newLines <= expectedLines) {
                    console.warn('[checkout] club add response has fewer lines than before', {
                        expectedLines,
                        newLines,
                        cart: data.cart,
                    });
                }

                const checkoutUrl = routes.checkout || '/checkout';
                const separator = checkoutUrl.includes('?') ? '&' : '?';
                window.location.assign(`${checkoutUrl}${separator}updated=${Date.now()}`);
            });
        });
    }

    function bindCheckoutPageshow() {
        window.addEventListener('pageshow', (event) => {
            const root = document.getElementById('co-root');
            if (!root) {
                return;
            }
            if (event.persisted) {
                window.location.reload();
                return;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.querySelector('.co')) {
            return;
        }
        initCheckoutSkeleton();
        bindCheckoutPageshow();
        bindExpressButtons();
        bindMobileOrderSummary();
        bindPrototypeLinks();
        bindLogin();
        bindCreateAccount();
        bindGift();
        bindBillingAddress();
        bindDeliveryAddress();
        bindCourierNotes();
        bindVoucher();
        bindRemoveVoucher();
        bindRemoveOffer();
        bindPaymentOptions();
        bindPayNow();
        bindSummaryRemove();
        bindClubJoinModal();
    });

    window.YGCheckout = { goToCheckout };
})();
