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

    function formatClock(totalSeconds) {
        const s = Math.max(0, Math.floor(totalSeconds));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) {
            return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    function initCountdown() {
        const el = document.querySelector('[data-tv-schedule]');
        const countdownEl = document.querySelector('[data-tv-countdown]');
        const labelEl = document.querySelector('[data-tv-countdown-label]');
        if (!el || !countdownEl) {
            return;
        }

        const targetIso = el.getAttribute('data-countdown-target');
        const status = el.getAttribute('data-status');
        const target = targetIso ? Date.parse(targetIso) : NaN;
        if (!Number.isFinite(target)) {
            return;
        }

        const tick = () => {
            const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
            countdownEl.textContent = formatClock(left);
            if (labelEl) {
                labelEl.textContent = status === 'live' ? 'Ends in' : 'Starts in';
            }
        };

        tick();
        window.setInterval(tick, 1000);
    }

    function initFilters() {
        const search = document.querySelector('[data-tv-search]');
        const cards = document.querySelectorAll('[data-tv-card]');
        const results = document.querySelector('[data-tv-results]');
        const empty = document.querySelector('[data-tv-empty]');
        let activeFilter = 'all';

        function applyFilters() {
            const q = (search?.value || '').trim().toLowerCase();
            let visible = 0;

            cards.forEach((card) => {
                const cat = card.getAttribute('data-category');
                const hay = card.getAttribute('data-search') || '';
                const show = (activeFilter === 'all' || cat === activeFilter) && (q === '' || hay.includes(q));
                card.classList.toggle('is-hidden', !show);
                if (show) {
                    visible += 1;
                }
            });

            if (results) {
                results.textContent =
                    visible === 1
                        ? '1 item · Add any product straight to your basket'
                        : `${visible} items · Add any product straight to your basket`;
            }
            if (empty) {
                empty.hidden = visible > 0;
            }
        }

        document.querySelectorAll('[data-tv-filter]').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-tv-filter]').forEach((b) => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                activeFilter = btn.getAttribute('data-tv-filter') || 'all';
                applyFilters();
            });
        });

        search?.addEventListener('input', applyFilters);
        applyFilters();
    }

    function initVideo() {
        const screen = document.querySelector('[data-tv-screen]');
        const iframe = document.getElementById('tv-live-iframe');
        const loadBtn = document.querySelector('[data-tv-load-video]');

        loadBtn?.addEventListener('click', () => {
            const src = iframe?.getAttribute('data-src');
            const channelUrl = iframe?.getAttribute('data-channel-url');
            if (iframe && src) {
                iframe.src = src;
                screen?.classList.add('is-playing');
                return;
            }
            if (channelUrl) {
                window.open(channelUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }

    function drawerEnabled() {
        return (
            document.body.classList.contains('demo-tv-live')
            || (window.__YG_CART_DRAWER_ENABLED !== false
                && window.__YG_CART_DRAWER_ENABLED !== 'false')
        );
    }

    function initStickyBar() {
        const bar = document.querySelector('[data-tv-sticky]');
        const cinema = document.querySelector('.tv-live__watch') || document.querySelector('.tv-shop__cinema');
        if (!bar || !cinema) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                bar.hidden = entry.isIntersecting;
            },
            { threshold: 0, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(cinema);
    }

    async function addToBasket(btn) {
        if (!window.YG_DEMO_ROUTES?.add) {
            return;
        }
        if (!drawerEnabled()) {
            alert('Cart drawer is off — enable it from the PDP prototype tools.');
            return;
        }

        const sku = btn.getAttribute('data-sku');
        const variant = btn.getAttribute('data-variant') || '';
        const body = { sku, qty: 1 };
        if (variant) {
            body.variant = variant;
        }

        btn.disabled = true;
        try {
            const res = await post(window.YG_DEMO_ROUTES.add, body);
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Could not add to basket.');
                btn.disabled = false;
                return;
            }

            btn.textContent = 'Added';
            btn.classList.add('is-added');
            window.setTimeout(function () {
                btn.textContent = 'Add to basket';
                btn.classList.remove('is-added');
                btn.disabled = false;
            }, 1600);

            const stickyCount = document.getElementById('tv-sticky-count');
            if (stickyCount && data.cart?.item_count != null) {
                stickyCount.textContent = String(data.cart.item_count);
            }

            if (window.YGCartDrawer?.refresh) {
                await window.YGCartDrawer.refresh();
            }
            if (window.YGCartDrawer?.open) {
                window.YGCartDrawer.open('tv_live');
            }
        } catch (err) {
            console.error('[tv-live] add failed', err);
            alert('Could not add to basket.');
            btn.disabled = false;
        }
    }

    function initAddButtons() {
        document.querySelectorAll('[data-tv-add]').forEach((btn) => {
            btn.addEventListener('click', () => addToBasket(btn));
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initCountdown();
        initFilters();
        initVideo();
        initStickyBar();
        initAddButtons();
    });
})();
