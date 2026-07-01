(function () {
    'use strict';

    var formatMoney = function (n) {
        return '£' + Number(n).toFixed(2);
    };

    /* —— Gallery —— */
    var gallery = document.querySelector('[data-pdp-gallery]');
    if (gallery) {
        var slides = gallery.querySelectorAll('[data-gallery-slide]');
        var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
        var dots = gallery.querySelectorAll('[data-gallery-dot]');
        var thumbsTrack = gallery.querySelector('[data-gallery-thumbs]');
        var zoomBtn = gallery.querySelector('[data-gallery-zoom]');
        var current = 0;
        var total = slides.length;

        function activeSlide() {
            return slides[current];
        }

        function isVideoSlide(slide) {
            return slide && slide.hasAttribute('data-gallery-video');
        }

        function updateZoomVisibility() {
            if (!zoomBtn) {
                return;
            }
            var slide = activeSlide();
            var hide = !slide || isVideoSlide(slide);
            zoomBtn.hidden = hide;
            zoomBtn.style.visibility = hide ? 'hidden' : 'visible';
        }

        function goTo(index) {
            if (index < 0) {
                index = total - 1;
            }
            if (index >= total) {
                index = 0;
            }
            current = index;

            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            thumbs.forEach(function (thumb, i) {
                thumb.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });

            var activeThumb = thumbs[current];
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }

            updateZoomVisibility();
        }

        gallery.querySelector('[data-gallery-prev]')?.addEventListener('click', function () {
            goTo(current - 1);
        });
        gallery.querySelector('[data-gallery-next]')?.addEventListener('click', function () {
            goTo(current + 1);
        });
        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                goTo(Number(thumb.dataset.galleryThumb));
            });
        });
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                goTo(Number(dot.dataset.galleryDot));
            });
        });

        var thumbScrollStep = 76;
        gallery.querySelector('[data-gallery-thumb-up]')?.addEventListener('click', function () {
            if (!thumbsTrack) {
                return;
            }
            var ygLayout = gallery.classList.contains('demo-pdp-gallery--yg');
            var vertical = !ygLayout && window.matchMedia('(min-width: 600px)').matches;
            thumbsTrack.scrollBy({
                top: vertical ? -thumbScrollStep : 0,
                left: vertical ? 0 : -thumbScrollStep,
                behavior: 'smooth',
            });
        });
        gallery.querySelector('[data-gallery-thumb-down]')?.addEventListener('click', function () {
            if (!thumbsTrack) {
                return;
            }
            var ygLayout = gallery.classList.contains('demo-pdp-gallery--yg');
            var vertical = !ygLayout && window.matchMedia('(min-width: 600px)').matches;
            thumbsTrack.scrollBy({
                top: vertical ? thumbScrollStep : 0,
                left: vertical ? 0 : thumbScrollStep,
                behavior: 'smooth',
            });
        });

        gallery.querySelectorAll('[data-gallery-video-play]').forEach(function (playBtn) {
            playBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var videoSlide = playBtn.closest('[data-gallery-video]');
                if (!videoSlide) {
                    return;
                }
                var poster = videoSlide.querySelector('.demo-pdp-gallery__video-poster');
                var label = document.createElement('p');
                label.className = 'demo-pdp-gallery__video-message';
                label.textContent = 'Product video preview — embed would play here in production.';
                playBtn.replaceWith(label);
                if (poster) {
                    poster.style.opacity = '0.35';
                }
            });
        });

        var touchStartX = 0;
        gallery.querySelector('[data-gallery-main]')?.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        gallery.querySelector('[data-gallery-main]')?.addEventListener('touchend', function (e) {
            var diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) > 50) {
                goTo(diff > 0 ? current - 1 : current + 1);
            }
        }, { passive: true });

        var lightbox = document.getElementById('demo-pdp-lightbox');
        var lightboxImg = document.getElementById('demo-pdp-lightbox-img');
        zoomBtn?.addEventListener('click', function () {
            var active = gallery.querySelector('.demo-pdp-gallery__slide.is-active');
            if (!active || !lightbox || !lightboxImg) {
                return;
            }
            lightboxImg.src = active.src;
            lightboxImg.alt = active.alt;
            lightbox.hidden = false;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        lightbox?.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
        lightbox?.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            if (!lightbox) {
                return;
            }
            lightbox.hidden = true;
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        updateZoomVisibility();
    }

    /* —— Variants + pricing —— */
    var pricingCard = document.querySelector('[data-pdp-pricing]');
    var priceEl = document.querySelector('[data-pdp-price]');
    var payIn3El = document.querySelector('[data-pdp-pay-in-3]');
    var stickyPrice = document.querySelector('[data-sticky-price]');
    var atb = document.getElementById('demo-add-to-basket');
    var variantSelect = document.querySelector('[data-pdp-variant-select]');

    function applyVariantFromOption(option) {
        if (!option || !option.value) {
            return;
        }

        var price = Number(option.dataset.variantPrice);
        var sku = option.dataset.variantSku;
        var label = option.dataset.variantLabel;

        if (priceEl && !Number.isNaN(price)) {
            priceEl.textContent = formatMoney(price);
        }
        if (payIn3El && !Number.isNaN(price)) {
            payIn3El.textContent = formatMoney(price / 3);
        }
        if (stickyPrice && !Number.isNaN(price)) {
            stickyPrice.textContent = formatMoney(price);
        }
        if (atb) {
            atb.dataset.pdpSku = sku || '';
            atb.dataset.pdpVariant = label || '';
        }
    }

    function updatePricing(input) {
        if (input && input.tagName === 'OPTION') {
            applyVariantFromOption(input);
            return;
        }

        var price = Number(input.dataset.variantPrice);
        var was = Number(input.dataset.variantWas);
        var save = was - price;
        var pct = was > 0 ? Math.round((save / was) * 100) : 0;

        if (priceEl) {
            priceEl.textContent = formatMoney(price);
        }
        if (payIn3El && !Number.isNaN(price)) {
            payIn3El.textContent = formatMoney(price / 3);
        }
        if (stickyPrice) {
            stickyPrice.textContent = formatMoney(price);
        }
        if (atb) {
            atb.dataset.pdpSku = input.dataset.variantSku;
            atb.dataset.pdpVariant = input.dataset.variantLabel;
        }

        document.querySelectorAll('.demo-pdp-variant').forEach(function (label) {
            var checked = label.querySelector('input')?.checked;
            label.classList.toggle('is-selected', !!checked);
        });
    }

    if (variantSelect) {
        var initialOption = variantSelect.options[variantSelect.selectedIndex];
        if (initialOption && initialOption.value) {
            applyVariantFromOption(initialOption);
        }
        variantSelect.addEventListener('change', function () {
            applyVariantFromOption(variantSelect.options[variantSelect.selectedIndex]);
        });
    }

    document.querySelectorAll('[data-pdp-variants] input').forEach(function (input) {
        input.addEventListener('change', function () {
            updatePricing(input);
        });
    });

    /* —— Bulk tiers —— */
    var qtyEl = document.getElementById('demo-pdp-qty');
    document.querySelectorAll('[data-bulk-qty]').forEach(function (tier) {
        tier.addEventListener('click', function () {
            var qty = Number(tier.dataset.bulkQty);
            if (qtyEl) {
                qtyEl.textContent = String(qty);
            }
            document.querySelectorAll('.demo-pdp-bulk__tier').forEach(function (t) {
                t.classList.toggle('is-active', t === tier);
            });
            if (priceEl && tier.dataset.bulkPrice) {
                priceEl.textContent = formatMoney(tier.dataset.bulkPrice) + ' each';
            }
        });
    });

    /* —— Quantity —— */
    document.querySelectorAll('[data-qty-delta]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (!qtyEl) {
                return;
            }
            var next = Math.max(1, Math.min(99, parseInt(qtyEl.textContent, 10) + Number(btn.getAttribute('data-qty-delta'))));
            qtyEl.textContent = String(next);
            document.querySelectorAll('.demo-pdp-bulk__tier').forEach(function (t) {
                t.classList.toggle('is-active', Number(t.dataset.bulkQty) === next);
            });
        });
    });

    /* —— Add to basket feedback —— */
    function atbFeedback(button) {
        if (!button) {
            return;
        }
        button.classList.add('is-added');
        var label = button.textContent;
        button.textContent = 'Added ✓';
        window.setTimeout(function () {
            button.classList.remove('is-added');
            button.textContent = label;
        }, 1600);
    }

    if (atb) {
        atb.addEventListener('click', function () {
            atbFeedback(atb);
        });
    }

    document.querySelector('[data-sticky-atb]')?.addEventListener('click', function () {
        atb?.click();
    });

    document.querySelectorAll('[data-addon-sku]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.classList.add('is-added');
            btn.textContent = 'Added';
            window.setTimeout(function () {
                btn.classList.remove('is-added');
                btn.textContent = 'Add';
            }, 1400);
        });
    });

    var alsoAdd = document.querySelector('.demo-pdp__also-add');
    if (alsoAdd) {
        alsoAdd.addEventListener('click', function () {
            atbFeedback(alsoAdd);
        });
    }

    /* —— Carousels —— */
    function scrollCarousel(name, direction) {
        var track = document.querySelector('[data-carousel-track="' + name + '"]');
        if (!track) {
            return;
        }
        var amount = direction * (track.clientWidth * 0.75);
        track.scrollBy({ left: amount, behavior: 'smooth' });
    }

    document.querySelectorAll('[data-carousel-prev]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            scrollCarousel(btn.dataset.carouselPrev, -1);
        });
    });
    document.querySelectorAll('[data-carousel-next]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            scrollCarousel(btn.dataset.carouselNext, 1);
        });
    });

    /* —— Care tabs —— */
    var careTabs = document.querySelector('[data-care-tabs]');
    if (careTabs) {
        careTabs.querySelectorAll('[data-care-tab]').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var id = tab.dataset.careTab;
                careTabs.querySelectorAll('[data-care-tab]').forEach(function (t) {
                    var active = t.dataset.careTab === id;
                    t.classList.toggle('is-active', active);
                    t.setAttribute('aria-selected', active ? 'true' : 'false');
                });
                careTabs.querySelectorAll('[data-care-panel]').forEach(function (panel) {
                    var active = panel.dataset.carePanel === id;
                    panel.classList.toggle('is-active', active);
                    panel.hidden = !active;
                });
            });
        });
    }

    /* —— Sticky ATC bar —— */
    var sticky = document.getElementById('demo-pdp-sticky');
    var buyPanel = document.querySelector('[data-pdp-buy-panel]');
    if (sticky && buyPanel) {
        sticky.hidden = false;
        var stickyObserver = new IntersectionObserver(
            function (entries) {
                var visible = entries[0].isIntersecting;
                sticky.classList.toggle('is-visible', !visible);
                sticky.setAttribute('aria-hidden', visible ? 'true' : 'false');
            },
            { root: null, threshold: 0, rootMargin: '0px 0px 0px 0px' }
        );
        stickyObserver.observe(buyPanel);
    }
})();
