(function () {
    if (!document.body.classList.contains('demo-basket-page')) return;

    const routes = window.YG_DEMO_ROUTES || {};
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';

    async function post(url, body) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body || {}),
        });
        return res;
    }

    async function del(url, body) {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body || {}),
        });
        return res;
    }

    function reload() {
        window.location.reload();
    }

    async function setQty(sku, qty) {
        if (!routes.qty || !sku) return;
        qty = Math.max(0, parseInt(qty, 10) || 0);
        const res = await post(routes.qty, { sku, qty });
        if (res.ok) reload();
    }

    async function removeItem(sku) {
        if (!routes.remove || !sku) return;
        const res = await post(routes.remove, { sku });
        if (res.ok) reload();
    }

    document.addEventListener('click', (e) => {
        const deltaEl = e.target.closest('[data-basket-qty-delta]');
        if (deltaEl) {
            e.preventDefault();
            const sku = deltaEl.getAttribute('data-sku');
            const delta = parseInt(deltaEl.getAttribute('data-basket-qty-delta'), 10) || 0;
            const input = document.querySelector(`[data-basket-qty][data-sku="${CSS.escape(sku)}"]`);
            const current = parseInt(input?.value || '1', 10) || 1;
            setQty(sku, current + delta);
            return;
        }

        const removeEl = e.target.closest('[data-basket-remove]');
        if (removeEl) {
            e.preventDefault();
            removeItem(removeEl.getAttribute('data-basket-remove'));
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const deltaEl = e.target.closest('[data-basket-qty-delta]');
        if (!deltaEl) return;
        e.preventDefault();
        deltaEl.click();
    });

    document.addEventListener('change', (e) => {
        const input = e.target.closest('[data-basket-qty]');
        if (!input) return;
        setQty(input.getAttribute('data-sku'), input.value);
    });

    const OFFER_JUST_APPLIED_KEY = 'yg-basket-offer-just-applied';

    function setCodeFieldError(form, msgEl, message) {
        const input = form?.querySelector('.offerInput, input[type="text"]');
        form?.classList.add('is-code-invalid');
        input?.setAttribute('aria-invalid', 'true');
        if (msgEl) {
            msgEl.textContent = message;
            msgEl.classList.remove('valid');
            msgEl.classList.add('is-error');
        }
        input?.focus();
    }

    function clearCodeFieldError(form, msgEl) {
        const input = form?.querySelector('.offerInput, input[type="text"]');
        form?.classList.remove('is-code-invalid');
        input?.removeAttribute('aria-invalid');
        if (msgEl?.classList.contains('is-error')) {
            msgEl.textContent = '';
            msgEl.classList.remove('is-error');
        }
    }

    function playOfferValidAnimation(wrap, msg) {
        if (!wrap) return;
        const formEl = wrap.querySelector('[data-basket-offer-form]');
        wrap.classList.add('is-offer-valid-anim');
        formEl?.classList.add('is-offer-valid-anim');
        msg?.classList.add('is-offer-valid-anim');
        window.setTimeout(() => {
            wrap.classList.remove('is-offer-valid-anim');
            formEl?.classList.remove('is-offer-valid-anim');
            msg?.classList.remove('is-offer-valid-anim');
        }, 1200);
    }

    document.querySelectorAll('[data-basket-offer-form]').forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const wrap = form.closest('.mediaSelectWrapper') || form.parentElement;
            const msg = wrap?.querySelector('[data-basket-offer-msg]');
            const actionBtn = form.querySelector('.codeApply');
            const isRemove = form.getAttribute('data-code-state') === 'applied'
                || actionBtn?.getAttribute('data-basket-code-action') === 'remove';

            if (actionBtn) actionBtn.disabled = true;

            if (isRemove) {
                if (!routes.removeCode) {
                    if (actionBtn) actionBtn.disabled = false;
                    return;
                }
                const res = await del(routes.removeCode, { type: 'offer' });
                if (res.ok) {
                    reload();
                    return;
                }
                if (actionBtn) actionBtn.disabled = false;
                try {
                    const data = await res.json();
                    if (msg && data?.error) {
                        msg.textContent = data.error;
                        msg.classList.remove('valid');
                    }
                } catch (_) { /* ignore */ }
                return;
            }

            const code = (form.querySelector('[name="PromotionCode"]')?.value || '').trim();
            if (!code) {
                if (actionBtn) actionBtn.disabled = false;
                setCodeFieldError(form, msg, 'Please enter an offer code.');
                return;
            }
            if (!routes.code) {
                if (actionBtn) actionBtn.disabled = false;
                return;
            }
            clearCodeFieldError(form, msg);
            const res = await post(routes.code, { type: 'offer', code });
            if (res.ok) {
                try {
                    sessionStorage.setItem(OFFER_JUST_APPLIED_KEY, code.toUpperCase());
                } catch (_) { /* ignore */ }
                reload();
                return;
            }
            if (actionBtn) actionBtn.disabled = false;
            try {
                const data = await res.json();
                if (msg && data?.error) {
                    setCodeFieldError(form, msg, data.error);
                }
            } catch (_) { /* ignore */ }
        });

        form.querySelector('[name="PromotionCode"]')?.addEventListener('input', () => {
            clearCodeFieldError(form, form.closest('.mediaSelectWrapper')?.querySelector('[data-basket-offer-msg]'));
        });
    });

    /* After reload — celebrate a freshly applied offer code */
    (function celebrateOfferIfJustApplied() {
        let justApplied = '';
        try {
            justApplied = sessionStorage.getItem(OFFER_JUST_APPLIED_KEY) || '';
            if (justApplied) sessionStorage.removeItem(OFFER_JUST_APPLIED_KEY);
        } catch (_) { /* ignore */ }
        if (!justApplied) return;
        const wrap = document.querySelector('.mediaSelectWrapper');
        const msg = wrap?.querySelector('[data-basket-offer-msg].valid');
        if (!wrap || !msg) return;
        playOfferValidAnimation(wrap, msg);
    })();

    document.querySelectorAll('[data-basket-voucher-form]').forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const wrap = form.closest('.voucherWrapper') || form.parentElement;
            const msg = wrap?.querySelector('[data-basket-voucher-msg]');
            const actionBtn = form.querySelector('.codeApply');
            const isRemove = form.getAttribute('data-code-state') === 'applied'
                || actionBtn?.getAttribute('data-basket-code-action') === 'remove';

            if (actionBtn) actionBtn.disabled = true;

            if (isRemove) {
                const url = routes.checkoutVoucherRemove;
                if (!url) {
                    if (actionBtn) actionBtn.disabled = false;
                    return;
                }
                const res = await del(url, {});
                if (res.ok) {
                    reload();
                    return;
                }
                if (actionBtn) actionBtn.disabled = false;
                try {
                    const data = await res.json();
                    if (msg && data?.error) msg.textContent = data.error;
                } catch (_) { /* ignore */ }
                return;
            }

            const code = (form.querySelector('[name="voucherCode"]')?.value || '').trim();
            const url = routes.checkoutVoucher;
            if (!code) {
                if (actionBtn) actionBtn.disabled = false;
                setCodeFieldError(form, msg, 'Please enter a voucher code.');
                return;
            }
            if (!url) {
                if (actionBtn) actionBtn.disabled = false;
                return;
            }
            clearCodeFieldError(form, msg);
            const res = await post(url, { code });
            if (res.ok) {
                reload();
                return;
            }
            if (actionBtn) actionBtn.disabled = false;
            try {
                const data = await res.json();
                if (msg && data?.error) setCodeFieldError(form, msg, data.error);
            } catch (_) { /* ignore */ }
        });

        form.querySelector('[name="voucherCode"]')?.addEventListener('input', () => {
            clearCodeFieldError(form, form.closest('.voucherWrapper')?.querySelector('[data-basket-voucher-msg]'));
        });
    });

    async function addSku(sku, btn) {
        if (!routes.add || !sku) return;
        if (btn) btn.disabled = true;
        try {
            const res = await post(routes.add, { sku, qty: 1 });
            if (res.ok) reload();
            else if (btn) btn.disabled = false;
        } catch (_) {
            if (btn) btn.disabled = false;
        }
    }

    document.addEventListener('click', (e) => {
        const spf = e.target.closest('[data-basket-spf-add]');
        if (spf) {
            e.preventDefault();
            addSku(spf.getAttribute('data-basket-spf-add'), spf);
            return;
        }

        const upsell = e.target.closest('[data-basket-upsell-add]');
        if (upsell) {
            e.preventDefault();
            addSku(upsell.getAttribute('data-basket-upsell-add'), upsell);
        }
    });

    /* Drag / swipe for You May Also Like carousel (mouse + touch + pen) */
    document.querySelectorAll('[data-basket-ymal-carousel]').forEach((track) => {
        let pointerId = null;
        let startX = 0;
        let startScroll = 0;
        let moved = false;
        let dragging = false;

        const endDrag = (e) => {
            if (!dragging || (e && e.pointerId !== pointerId)) return;
            dragging = false;
            track.classList.remove('is-dragging');
            try {
                if (e) track.releasePointerCapture(e.pointerId);
            } catch (_) { /* ignore */ }
            pointerId = null;
        };

        track.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if (e.target.closest('button, input, select, textarea')) return;
            pointerId = e.pointerId;
            startX = e.clientX;
            startScroll = track.scrollLeft;
            moved = false;
            dragging = true;
            track.classList.add('is-dragging');
            try {
                track.setPointerCapture(e.pointerId);
            } catch (_) { /* ignore */ }
        });

        track.addEventListener('pointermove', (e) => {
            if (!dragging || e.pointerId !== pointerId) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) moved = true;
            track.scrollLeft = startScroll - dx;
            if (moved) e.preventDefault();
        });

        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
        track.addEventListener('lostpointercapture', () => {
            dragging = false;
            track.classList.remove('is-dragging');
            pointerId = null;
        });

        /* Don't follow links / fire ATC if the gesture was a drag */
        track.addEventListener('click', (e) => {
            if (!moved) return;
            e.preventDefault();
            e.stopPropagation();
            moved = false;
        }, true);

        track.addEventListener('dragstart', (e) => e.preventDefault());
    });

    /*
     * Mobile / stacked layout: park SPF + club + YMAL under the last
     * checkout CTA (right column), order: SPF → club → You May Also Like.
     */
    (function relocatePromosUnderCheckout() {
        const right = document.querySelector('#section2ScrollWrapper');
        if (!right) return;

        const spf = document.querySelector('#ygspf-root');
        const club = document.querySelector('#ygbc3-root, [data-basket-club-promo]');
        const ymal = document.querySelector('.upsellsWrapper');
        if (!spf && !club && !ymal) return;

        function markHome(el, name) {
            if (!el || !el.parentNode) return null;
            const marker = document.createComment(name);
            el.parentNode.insertBefore(marker, el);
            return marker;
        }

        const spfHome = markHome(spf, 'spf-home');
        const clubHome = markHome(club, 'club-home');
        const ymalHome = markHome(ymal, 'ymal-home');

        const mq = window.matchMedia('(max-width: 1000px)');
        const sync = () => {
            if (mq.matches) {
                if (spf) {
                    right.appendChild(spf);
                    spf.classList.add('ygspf-root--after-checkout');
                }
                if (club) {
                    right.appendChild(club);
                    club.classList.add('ygbc3-root--after-checkout');
                }
                if (ymal) {
                    right.appendChild(ymal);
                    ymal.classList.add('upsellsWrapper--after-checkout');
                }
            } else {
                if (spf && spfHome && spfHome.parentNode) {
                    spfHome.parentNode.insertBefore(spf, spfHome.nextSibling);
                    spf.classList.remove('ygspf-root--after-checkout');
                }
                if (club && clubHome && clubHome.parentNode) {
                    clubHome.parentNode.insertBefore(club, clubHome.nextSibling);
                    club.classList.remove('ygbc3-root--after-checkout');
                }
                if (ymal && ymalHome && ymalHome.parentNode) {
                    ymalHome.parentNode.insertBefore(ymal, ymalHome.nextSibling);
                    ymal.classList.remove('upsellsWrapper--after-checkout');
                }
            }
        };

        sync();
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', sync);
        else if (typeof mq.addListener === 'function') mq.addListener(sync);
    })();

    const visualButtons = document.querySelectorAll('[data-basket-visual]');
    visualButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const variant = btn.getAttribute('data-basket-visual') || '1';
            visualButtons.forEach((el) => {
                const active = el === btn;
                el.classList.toggle('is-active', active);
                el.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            if (!routes.toggleOption) return;
            try {
                const res = await post(routes.toggleOption, {
                    key: 'basket_visual',
                    variant,
                });
                const data = await res.json().catch(() => ({}));
                if (data.reload || res.ok) reload();
            } catch (err) {
                console.error('[demo] basket visual failed', err);
            }
        });
    });

    async function addClub(sku, btn) {
        if (!sku) return;
        const url = routes.club || routes.add;
        if (!url) return;
        if (btn) btn.disabled = true;
        try {
            const body = routes.club ? { sku } : { sku, qty: 1 };
            const res = await post(url, body);
            if (res.ok) reload();
            else if (btn) btn.disabled = false;
        } catch (_) {
            if (btn) btn.disabled = false;
        }
    }

    function selectedClubSku(root) {
        const checked = root.querySelector('input[type="radio"]:checked');
        return checked ? checked.value : '';
    }

    document.querySelectorAll('[data-basket-club-promo]').forEach((root) => {
        if (root.matches('button')) return;

        const cards = root.querySelectorAll(
            '.ce-yg-club-promo__opt, .ce-yg-club-promo__card, #ygbc3-opt-auto, #ygbc3-opt-one'
        );
        cards.forEach((lab) => {
            lab.addEventListener('click', () => {
                const input = lab.querySelector('input');
                if (input) input.checked = true;
                cards.forEach((o) => {
                    const on = !!(o.querySelector('input') && o.querySelector('input').checked);
                    o.classList.toggle('is-selected', on);
                    o.classList.toggle('ygbc3-is-selected', on);
                });
            });
        });
    });

    document.addEventListener('click', (e) => {
        const direct = e.target.closest('[data-basket-club-add]');
        if (direct) {
            e.preventDefault();
            addClub(direct.getAttribute('data-basket-club-add'), direct);
            return;
        }

        const atc = e.target.closest('[data-basket-club-atc]');
        if (atc) {
            e.preventDefault();
            const root = atc.closest('[data-basket-club-promo]');
            addClub(selectedClubSku(root || document), atc);
        }
    });
})();
