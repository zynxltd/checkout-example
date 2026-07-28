/**
 * Listing Quick View — gallery, variants, trust, quick add (CRO)
 */
(function () {
    var root = document.getElementById('listing-quick-view');
    if (!root) return;

    var img = root.querySelector('[data-qv-img]');
    var badge = root.querySelector('[data-qv-badge]');
    var thumbs = root.querySelector('[data-qv-thumbs]');
    var skuLabel = root.querySelector('[data-qv-sku-label]');
    var title = root.querySelector('[data-qv-title]');
    var priceEl = root.querySelector('[data-qv-price]');
    var wasEl = root.querySelector('[data-qv-was]');
    var saveEl = root.querySelector('[data-qv-save]');
    var clubEl = root.querySelector('[data-qv-club]');
    var ratingEl = root.querySelector('[data-qv-rating]');
    var blurb = root.querySelector('[data-qv-blurb]');
    var desc = root.querySelector('[data-qv-desc]');
    var featuresEl = root.querySelector('[data-qv-features]');
    var trustEl = root.querySelector('[data-qv-trust]');
    var variantsWrap = root.querySelector('[data-qv-variants-wrap]');
    var variantsEl = root.querySelector('[data-qv-variants]');
    var viewsEl = root.querySelector('[data-qv-views]');
    var stockEl = root.querySelector('[data-qv-stock]');
    var actions = root.querySelector('[data-qv-actions]');
    var oosMsg = root.querySelector('[data-qv-oos-msg]');
    var qtyEl = root.querySelector('[data-qv-qty]');
    var addBtn = root.querySelector('[data-qv-add]');
    var pdpLink = root.querySelector('[data-qv-pdp]');
    var lastFocus = null;
    var current = null;
    var galleryIndex = 0;
    var selectedVariant = null;

    function csrf() {
        return document.querySelector('meta[name="csrf-token"]')?.content || '';
    }

    function post(url, body) {
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body || {}),
        });
    }

    function money(value) {
        var n = Number(value);
        if (!isFinite(n)) return '';
        return '£' + n.toFixed(2);
    }

    function parseCard(card) {
        var raw = card.getAttribute('data-qv-json');
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('[listing qv] bad json', e);
            return null;
        }
    }

    function starsHtml(rating, reviews) {
        var full = Math.round(Number(rating) || 0);
        var out = '<span class="yg-qv__stars" aria-hidden="true">';
        for (var i = 1; i <= 5; i++) {
            out += '<span class="yg-qv__star' + (i <= full ? ' is-on' : '') + '">★</span>';
        }
        out += '</span>';
        out += '<span class="yg-qv__rating-copy"><strong>' + Number(rating).toFixed(1) + '</strong> · ';
        out += Number(reviews || 0).toLocaleString('en-GB') + ' reviews</span>';
        return out;
    }

    function setGallery(index) {
        if (!current || !current.gallery || !current.gallery.length) return;
        galleryIndex = (index + current.gallery.length) % current.gallery.length;
        var item = current.gallery[galleryIndex];
        if (img) {
            img.src = item.image;
            img.alt = item.alt || current.name;
        }
        if (thumbs) {
            thumbs.querySelectorAll('[data-qv-thumb]').forEach(function (btn, i) {
                btn.classList.toggle('is-active', i === galleryIndex);
                btn.setAttribute('aria-selected', i === galleryIndex ? 'true' : 'false');
            });
        }
    }

    function renderThumbs() {
        if (!thumbs) return;
        thumbs.innerHTML = '';
        (current.gallery || []).forEach(function (item, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'yg-qv__thumb' + (i === 0 ? ' is-active' : '');
            btn.setAttribute('data-qv-thumb', String(i));
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.setAttribute('aria-label', 'Image ' + (i + 1));
            btn.innerHTML = '<img src="' + item.image + '" alt="" width="72" height="72" loading="lazy">';
            btn.addEventListener('click', function () {
                setGallery(i);
            });
            thumbs.appendChild(btn);
        });
    }

    function renderFeatures() {
        if (!featuresEl) return;
        var list = current.features || [];
        if (!list.length) {
            featuresEl.hidden = true;
            featuresEl.innerHTML = '';
            return;
        }
        featuresEl.hidden = false;
        featuresEl.innerHTML = list.map(function (f) {
            return '<span class="yg-qv__feature">' + escapeHtml(f.label || f) + '</span>';
        }).join('');
    }

    function renderTrust() {
        if (!trustEl) return;
        var list = current.trust || [];
        if (!list.length) {
            trustEl.hidden = true;
            trustEl.innerHTML = '';
            return;
        }
        trustEl.hidden = false;
        trustEl.innerHTML = list.map(function (t) {
            return '<li>' + escapeHtml(t) + '</li>';
        }).join('');
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function applyVariant(variant) {
        selectedVariant = variant || null;
        var price = variant ? Number(variant.price) : Number(current.price);
        var was = variant && variant.was_price != null ? Number(variant.was_price) : Number(current.was || 0);
        var save = was > price ? round2(was - price) : Number(current.save || 0);
        var club = round2(price * 0.85);
        var label = current.price_label || 'Just';

        if (priceEl) priceEl.textContent = (label + ' ' + money(price)).trim();
        if (wasEl) {
            if (was > price) {
                wasEl.hidden = false;
                wasEl.textContent = money(was);
            } else {
                wasEl.hidden = true;
            }
        }
        if (saveEl) {
            if (save > 0) {
                saveEl.hidden = false;
                saveEl.textContent = 'Save ' + money(save);
            } else {
                saveEl.hidden = true;
            }
        }
        if (clubEl) {
            clubEl.hidden = false;
            clubEl.innerHTML = 'Club members pay <strong>' + money(club) + '</strong> — save 15%';
        }
        if (variantsEl) {
            variantsEl.querySelectorAll('[data-qv-variant]').forEach(function (btn) {
                var active = selectedVariant && btn.getAttribute('data-qv-variant') === selectedVariant.id;
                btn.classList.toggle('is-active', !!active);
                btn.setAttribute('aria-checked', active ? 'true' : 'false');
            });
        }
        if (variant && variant.qty) {
            setQty(Number(variant.qty));
        }
    }

    function round2(n) {
        return Math.round(Number(n) * 100) / 100;
    }

    function renderVariants() {
        if (!variantsWrap || !variantsEl) return;
        var list = current.variants || [];
        if (list.length < 2) {
            variantsWrap.hidden = true;
            variantsEl.innerHTML = '';
            applyVariant(list[0] || null);
            return;
        }
        variantsWrap.hidden = false;
        variantsEl.innerHTML = '';
        list.forEach(function (v) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'yg-qv__variant' + (v.default ? ' is-active' : '');
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', v.default ? 'true' : 'false');
            btn.setAttribute('data-qv-variant', v.id);
            btn.innerHTML =
                '<span class="yg-qv__variant-label">' + escapeHtml(v.label) + '</span>' +
                '<span class="yg-qv__variant-price">' + money(v.price) + '</span>' +
                (v.badge ? '<span class="yg-qv__variant-badge">' + escapeHtml(v.badge) + '</span>' : '');
            btn.addEventListener('click', function () {
                applyVariant(v);
            });
            variantsEl.appendChild(btn);
        });
        applyVariant(list.find(function (v) { return v.default; }) || list[0]);
    }

    function openFromCard(card) {
        current = parseCard(card);
        if (!current) return;

        lastFocus = document.activeElement;
        galleryIndex = 0;
        selectedVariant = null;

        if (title) title.textContent = current.name || '';
        if (skuLabel) skuLabel.textContent = current.sku ? 'Item ' + current.sku : '';
        if (blurb) blurb.textContent = current.blurb || '';
        if (desc) desc.textContent = current.description || '';
        if (pdpLink) pdpLink.href = current.url || '#';
        if (qtyEl) qtyEl.textContent = '1';
        if (addBtn) {
            addBtn.disabled = false;
            addBtn.classList.remove('is-added');
            addBtn.textContent = 'Add to basket';
        }
        if (actions) actions.hidden = !!current.oos;
        if (oosMsg) oosMsg.hidden = !current.oos;

        if (badge) {
            if (current.oos) {
                badge.hidden = false;
                badge.textContent = 'OUT OF STOCK';
                badge.classList.add('is-oos');
            } else if (current.discount) {
                badge.hidden = false;
                badge.textContent = current.discount + '% OFF';
                badge.classList.remove('is-oos');
            } else {
                badge.hidden = true;
            }
        }

        if (ratingEl) {
            ratingEl.innerHTML = starsHtml(current.rating, current.reviews);
            ratingEl.setAttribute(
                'aria-label',
                current.rating + ' out of 5 stars, ' + current.reviews + ' reviews'
            );
        }

        if (viewsEl) {
            if (current.popular_views) {
                viewsEl.hidden = false;
                viewsEl.textContent = current.popular_views + ' people viewed this today';
            } else {
                viewsEl.hidden = true;
            }
        }

        if (stockEl) {
            if (current.low_stock && !current.oos) {
                stockEl.hidden = false;
                stockEl.textContent = 'Selling fast — limited stock';
            } else {
                stockEl.hidden = true;
            }
        }

        if (!current.gallery || !current.gallery.length) {
            current.gallery = [{ image: current.image, alt: current.name }];
        }

        renderThumbs();
        setGallery(0);
        renderFeatures();
        renderTrust();
        renderVariants();

        root.hidden = false;
        root.setAttribute('aria-hidden', 'false');
        document.body.classList.add('yg-qv-open');
        window.setTimeout(function () {
            if (current?.oos) {
                root.querySelector('.yg-qv__close')?.focus?.();
            } else {
                addBtn?.focus?.();
            }
        }, 10);
    }

    function close() {
        root.hidden = true;
        root.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('yg-qv-open');
        current = null;
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    function setQty(next) {
        if (!qtyEl) return;
        qtyEl.textContent = String(Math.max(1, Math.min(99, next)));
    }

    document.querySelectorAll('[data-qv-open]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var card = btn.closest('[data-qv-card]');
            if (card) openFromCard(card);
        });
    });

    root.querySelectorAll('[data-qv-close]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            close();
        });
    });

    root.querySelector('[data-qv-gallery-prev]')?.addEventListener('click', function () {
        setGallery(galleryIndex - 1);
    });
    root.querySelector('[data-qv-gallery-next]')?.addEventListener('click', function () {
        setGallery(galleryIndex + 1);
    });

    root.querySelectorAll('[data-qv-qty-delta]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var delta = Number(btn.getAttribute('data-qv-qty-delta') || 0);
            var currentQty = parseInt(qtyEl?.textContent || '1', 10);
            setQty(currentQty + delta);
        });
    });

    addBtn?.addEventListener('click', async function () {
        if (!current || current.oos || addBtn.disabled) return;
        if (!window.YG_DEMO_ROUTES?.add) {
            alert('Cart add route unavailable.');
            return;
        }

        var qty = Math.max(1, parseInt(qtyEl?.textContent || '1', 10));
        var sku = (selectedVariant && selectedVariant.sku) || current.sku;
        var variantLabel = (selectedVariant && selectedVariant.label) || current.variant || '';

        addBtn.disabled = true;
        addBtn.textContent = 'Adding…';

        try {
            var res = await post(window.YG_DEMO_ROUTES.add, {
                sku: sku,
                qty: qty,
                variant: variantLabel,
            });
            var data = await res.json();
            if (!res.ok) {
                addBtn.disabled = false;
                addBtn.textContent = 'Add to basket';
                alert(data.error || 'Could not add to basket.');
                return;
            }

            addBtn.classList.add('is-added');
            addBtn.textContent = 'Added ✓';

            if (window.YGCartDrawer?.refresh) {
                await window.YGCartDrawer.refresh();
                window.YGCartDrawer.open?.('quick_view');
            }

            window.setTimeout(function () {
                close();
            }, 650);
        } catch (err) {
            console.error('[listing qv] add failed', err);
            addBtn.disabled = false;
            addBtn.textContent = 'Add to basket';
            alert('Could not add to basket.');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (root.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') setGallery(galleryIndex - 1);
        if (e.key === 'ArrowRight') setGallery(galleryIndex + 1);
    });
})();
