(function () {
    'use strict';

    function money(n) {
        return '£' + Number(n).toFixed(2);
    }

    /* —— Main gallery + thumbs —— */
    var mainTrack = document.querySelector('[data-live-main-track]');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-live-main-slide]'));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-live-thumb]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-live-main-dot]'));
    var current = 0;

    function goTo(index) {
        if (!slides.length) {
            return;
        }
        if (index < 0) {
            index = slides.length - 1;
        }
        if (index >= slides.length) {
            index = 0;
        }
        current = index;

        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        thumbs.forEach(function (thumb, i) {
            thumb.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot) {
            var li = dot.closest('li');
            var active = Number(dot.getAttribute('data-live-main-dot')) === current;
            if (li) {
                li.classList.toggle('slick-active', active);
            }
        });

        var activeThumb = thumbs[current];
        if (activeThumb && activeThumb.scrollIntoView) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }

    document.querySelector('[data-live-main-prev]')?.addEventListener('click', function () {
        goTo(current - 1);
    });
    document.querySelector('[data-live-main-next]')?.addEventListener('click', function () {
        goTo(current + 1);
    });
    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            goTo(Number(thumb.getAttribute('data-live-thumb')));
        });
    });
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goTo(Number(dot.getAttribute('data-live-main-dot')));
        });
    });
    document.querySelector('[data-live-watch-videos]')?.addEventListener('click', function () {
        var videoIndex = slides.findIndex(function (slide) {
            return slide.hasAttribute('data-live-video');
        });
        if (videoIndex >= 0) {
            goTo(videoIndex);
        }
    });

    /* —— Options dropdown —— */
    var optionsHead = document.querySelector('[data-live-options-toggle]');
    var optionsLabel = document.querySelector('[data-live-options-label]');
    var optionsBox = document.querySelector('[data-live-options-box]');
    var fromPriceWrap = document.querySelector('[data-live-from-price]');
    var fromAmount = document.querySelector('[data-live-from-amount]');
    var selectedWrap = document.querySelector('[data-live-selected-price]');
    var selectedTitle = document.querySelector('[data-live-selected-title]');
    var selectedAmount = document.querySelector('[data-live-selected-amount]');
    var selectedRrp = document.querySelector('[data-live-selected-rrp]');
    var selectedSaving = document.querySelector('[data-live-selected-saving]');
    var clubAmount = document.querySelector('[data-live-club-amount]');
    var payIn3 = document.querySelector('[data-live-pay-in-3]');
    var atb = document.getElementById('demo-add-to-basket');

    function setOptionsOpen(open) {
        if (!optionsHead || !optionsBox) {
            return;
        }
        optionsHead.classList.toggle('active', open);
        optionsBox.hidden = !open;
        optionsBox.classList.toggle('active', open);
        if (open) {
            optionsBox.style.display = 'block';
        } else {
            optionsBox.style.display = '';
        }
    }

    optionsHead?.addEventListener('click', function () {
        setOptionsOpen(!!optionsBox.hidden);
    });

    function selectOption(row) {
        if (!row || row.classList.contains('discont')) {
            return;
        }

        document.querySelectorAll('[data-live-option]').forEach(function (el) {
            el.classList.toggle('active', el === row);
        });

        var price = Number(row.getAttribute('data-variant-price'));
        var was = Number(row.getAttribute('data-variant-was') || 0);
        var club = Number(row.getAttribute('data-variant-club'));
        var label = row.getAttribute('data-variant-label') || '';
        var sku = row.getAttribute('data-variant-sku') || '';
        var displaySku = row.getAttribute('data-variant-display-sku') || sku;

        if (optionsLabel) {
            optionsLabel.textContent = label + ' - SKU ' + displaySku;
        }
        if (fromPriceWrap) {
            fromPriceWrap.hidden = true;
            fromPriceWrap.classList.add('hide');
        }
        if (selectedWrap) {
            selectedWrap.hidden = false;
            selectedWrap.classList.remove('hide');
        }
        if (selectedTitle) {
            selectedTitle.textContent = label + ' | SKU: ' + displaySku;
        }
        if (selectedAmount) {
            selectedAmount.innerHTML = 'Just <span class="price-text">' + money(price) + '</span>';
        }
        if (selectedRrp) {
            selectedRrp.textContent = was > price ? ('RRP ' + money(was)) : '';
        }
        if (selectedSaving) {
            selectedSaving.innerHTML = was > price
                ? ('You Save - <span>' + money(was - price) + '</span>')
                : '';
        }
        if (clubAmount && !Number.isNaN(club)) {
            clubAmount.textContent = money(club);
        }
        if (payIn3 && !Number.isNaN(price)) {
            payIn3.textContent = money(price / 3);
        }
        if (fromAmount && !Number.isNaN(price)) {
            fromAmount.textContent = money(price);
        }
        if (atb) {
            atb.setAttribute('data-pdp-sku', sku);
            atb.setAttribute('data-pdp-variant', label);
        }

        setOptionsOpen(false);
    }

    document.querySelectorAll('[data-live-option]').forEach(function (row) {
        row.addEventListener('click', function () {
            selectOption(row);
        });
        row.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(row);
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!optionsBox || optionsBox.hidden) {
            return;
        }
        if (e.target.closest('[data-live-options]')) {
            return;
        }
        setOptionsOpen(false);
    });

    /* —— Qty —— */
    var qtyInput = document.querySelector('[data-live-qty-input]');
    var qtyMirror = document.querySelector('[data-live-qty-mirror]');

    function setQty(next) {
        next = Math.max(1, Math.min(99, next));
        if (qtyInput) {
            qtyInput.value = String(next);
        }
        if (qtyMirror) {
            qtyMirror.textContent = String(next);
        }
    }

    document.querySelectorAll('[data-live-qty-delta]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var currentQty = parseInt(qtyInput?.value || '1', 10) || 1;
            setQty(currentQty + Number(btn.getAttribute('data-live-qty-delta')));
        });
    });
    qtyInput?.addEventListener('change', function () {
        setQty(parseInt(qtyInput.value, 10) || 1);
    });

    /* —— Features scroll —— */
    var featuresTrack = document.querySelector('[data-live-features-track]');
    document.querySelector('[data-live-features-prev]')?.addEventListener('click', function () {
        featuresTrack?.scrollBy({ left: -120, behavior: 'smooth' });
    });
    document.querySelector('[data-live-features-next]')?.addEventListener('click', function () {
        featuresTrack?.scrollBy({ left: 120, behavior: 'smooth' });
    });

    document.querySelector('[data-scroll-to-reviews]')?.addEventListener('click', function () {
        var reviewsHeading = document.querySelector('[data-live-tab="reviews"]');
        var reviewsPanel = document.querySelector('[data-live-tab-panel="reviews"]');
        if (reviewsHeading && reviewsPanel) {
            reviewsHeading.classList.add('active');
            reviewsHeading.setAttribute('aria-expanded', 'true');
            var arrow = reviewsHeading.querySelector('.arrow');
            if (arrow) {
                arrow.textContent = '⌃';
            }
            reviewsPanel.classList.add('active');
            reviewsPanel.hidden = false;
        }
        document.getElementById('tab-content-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('pdp-feefo-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* —— Care tabs (below-fold) —— */
    var careTabs = document.querySelector('[data-care-tabs]');
    if (careTabs) {
        careTabs.querySelectorAll('[data-care-tab]').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var id = tab.getAttribute('data-care-tab');
                careTabs.querySelectorAll('[data-care-tab]').forEach(function (t) {
                    var on = t === tab;
                    t.classList.toggle('is-active', on);
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                });
                careTabs.querySelectorAll('[data-care-panel]').forEach(function (panel) {
                    var on = panel.getAttribute('data-care-panel') === id;
                    panel.hidden = !on;
                    panel.classList.toggle('is-active', on);
                });
            });
        });
    }

    /* —— Live accordion tabs (Plant Calendar / Description / etc.) —— */
    var tabsRoot = document.querySelector('[data-live-tabs]');
    if (tabsRoot) {
        function setTab(id, open) {
            var heading = tabsRoot.querySelector('[data-live-tab="' + id + '"]');
            var panel = tabsRoot.querySelector('[data-live-tab-panel="' + id + '"]');
            if (!heading || !panel) {
                return;
            }
            heading.classList.toggle('active', open);
            heading.setAttribute('aria-expanded', open ? 'true' : 'false');
            var arrow = heading.querySelector('.arrow');
            if (arrow) {
                arrow.textContent = open ? '⌃' : '⌄';
            }
            panel.classList.toggle('active', open);
            panel.hidden = !open;
        }

        tabsRoot.querySelectorAll('[data-live-tab]').forEach(function (heading) {
            heading.addEventListener('click', function () {
                var id = heading.getAttribute('data-live-tab');
                var isOpen = heading.classList.contains('active');
                setTab(id, !isOpen);
            });
            heading.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    heading.click();
                }
            });
        });
    }

    /* Auto-select default option so club price / ATC match live selected state */
    var defaultOption = document.querySelector('[data-live-option].active') || document.querySelector('[data-live-option]');
    if (defaultOption) {
        selectOption(defaultOption);
    }

    /* Avoid unused lint on mainTrack */
    void mainTrack;
})();
