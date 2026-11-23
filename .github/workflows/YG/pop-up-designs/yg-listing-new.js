/**
 * YouGarden PLP A/B — price left, stars right, one row.
 * Pair with yg-listing-new.css
 *
 * Wraps each card's .priceWrapper + .rating in .yg-plp-meta
 * so CSS can keep them on a single row. Re-runs when
 * more products load (pagination / filters).
 */
(function () {
    var ROW = 'yg-plp-meta';
    var scheduled = false;

    function styleFeefo(box) {
        var hosts = box.querySelectorAll('.feefo-product-stars-widget');
        for (var i = 0; i < hosts.length; i++) {
            var root = hosts[i].shadowRoot;
            if (!root || root.querySelector('#yg-plp-feefo')) {
                continue;
            }
            var style = document.createElement('style');
            style.id = 'yg-plp-feefo';
            style.textContent =
                '.summary-rating{display:inline-flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:4px!important}' +
                '.feefo-rating-stars{display:inline-flex!important;align-items:center!important;flex-wrap:nowrap!important}' +
                '@media (min-width: 1024px){' +
                '.summary-rating{height:20px!important;line-height:0!important}' +
                '.feefo-rating-stars{line-height:0!important}' +
                '.feefo-rating-stars svg{display:block!important}' +
                '.reviews-count{display:inline-flex!important;align-items:center!important;line-height:20px!important;margin:0!important}' +
                '}';
            root.appendChild(style);
        }
    }

    function wrapCard(box) {
        if (!box) {
            return;
        }

        styleFeefo(box);

        if (box.querySelector('.' + ROW)) {
            return;
        }

        var price = box.querySelector(':scope > .priceWrapper');
        var rating = box.querySelector(':scope > .rating');

        if (!price && !rating) {
            return;
        }

        var row = document.createElement('div');
        row.className = ROW;

        box.insertBefore(row, price || rating);
        if (price) {
            row.appendChild(price);
        }
        if (rating) {
            row.appendChild(rating);
        }
    }

    function apply() {
        var cards = document.querySelectorAll('.category-box');
        for (var i = 0; i < cards.length; i++) {
            wrapCard(cards[i]);
        }
    }

    function schedule() {
        if (scheduled) {
            return;
        }
        scheduled = true;
        window.requestAnimationFrame(function () {
            scheduled = false;
            apply();
        });
    }

    apply();

    var root =
        document.querySelector('.category-item-wrapper') ||
        document.getElementById('category-items') ||
        document.body;

    if (root && window.MutationObserver) {
        new MutationObserver(schedule).observe(root, {
            childList: true,
            subtree: true
        });
    }
})();
