/**
 * Temp header search suggestions (stand-in for LuigiBox).
 * Farmer Gracy–style rows with image thumbnails + label.
 */
(function () {
    var IMG = {
        hanging: '/images/products/404220.jpg',
        petunia: '/images/products/401842.jpg',
        calibra: '/images/products/402156.jpg',
        bacopa: '/images/products/403891.jpg',
        geranium: '/images/products/510317.png',
        roses: '/images/home-preview/cats/roses.jpg',
        perennials: '/images/home-preview/cats/perennials.jpg',
        trees: '/images/home-preview/cats/trees.jpg',
        fruit: '/images/home-preview/cats/fruit-trees.jpg',
        house: '/images/home-preview/cats/houseplants.jpg',
        outdoor: '/images/home-preview/cats/outdoor.jpg',
        sale: '/images/home-preview/cat-sale.jpg',
        news: '/images/home-preview/cats/new.jpg',
        veg: '/images/home-preview/cats/fruit-veg.jpg',
        compost: '/images/compost.jpg',
        garden: '/images/home-preview/cats/garden-plants.jpg',
        bedding: '/images/home-preview/cats/autumn-bedding.jpg',
        climbing: '/images/home-preview/cats/climbing.jpg',
    };

    var SUGGESTIONS = [
        { label: 'Hanging baskets', meta: 'Category', image: IMG.hanging, url: 'https://www.yougarden.com/outdoor-living/hanging-baskets' },
        { label: 'Pre-planted hanging baskets', meta: 'Category', image: IMG.hanging, url: 'https://www.yougarden.com/garden-plants/bedding-plants/pre-planted-hanging-baskets' },
        { label: 'Plants for hanging baskets', meta: 'Category', image: IMG.petunia, url: 'https://www.yougarden.com/garden-plants/popular-garden-plants/plants-for-hanging-baskets' },
        { label: 'Summer hanging baskets', meta: 'Category', image: IMG.calibra, url: 'https://www.yougarden.com/garden-plants/bedding-plants/pre-planted-hanging-baskets/summer-pre-planted-hanging-baskets-and-pots' },
        { label: 'Winter hanging baskets', meta: 'Category', image: IMG.bacopa, url: 'https://www.yougarden.com/garden-plants/bedding-plants/pre-planted-hanging-baskets/winter-pre-planted-hanging-baskets-and-pots' },
        { label: "Pre-Planted 'Summer Sensation' Hanging Baskets", meta: 'Product', image: IMG.hanging, url: 'https://www.yougarden.com/' },
        { label: 'Roses', meta: 'Category', image: IMG.roses, url: 'https://www.yougarden.com/garden-plants/roses' },
        { label: 'Patio roses', meta: 'Category', image: IMG.roses, url: 'https://www.yougarden.com/garden-plants/roses' },
        { label: 'Lavender', meta: 'Category', image: IMG.perennials, url: 'https://www.yougarden.com/garden-plants/herbs/lavender' },
        { label: "English Lavender 'Hidcote'", meta: 'Product', image: IMG.perennials, url: 'https://www.yougarden.com/' },
        { label: 'Clematis', meta: 'Category', image: IMG.climbing, url: 'https://www.yougarden.com/garden-plants/climbers/clematis' },
        { label: "Petunia 'Easy Wave' Ultimate Mix", meta: 'Product', image: IMG.petunia, url: 'https://www.yougarden.com/' },
        { label: 'Sicilian Lemon Tree', meta: 'Product', image: IMG.fruit, url: 'https://www.yougarden.com/' },
        { label: 'Fruit trees', meta: 'Category', image: IMG.fruit, url: 'https://www.yougarden.com/fruits-and-veg/fruit-trees' },
        { label: "Apple 'Braeburn' Tree", meta: 'Product', image: IMG.fruit, url: 'https://www.yougarden.com/' },
        { label: "Hydrangea paniculata 'Limelight'", meta: 'Product', image: IMG.trees, url: 'https://www.yougarden.com/' },
        { label: 'Garden plants', meta: 'Category', image: IMG.garden, url: 'https://www.yougarden.com/garden-plants' },
        { label: 'Bedding plants', meta: 'Category', image: IMG.bedding, url: 'https://www.yougarden.com/garden-plants/bedding-plants' },
        { label: 'Perennials', meta: 'Category', image: IMG.perennials, url: 'https://www.yougarden.com/garden-plants/perennials' },
        { label: 'Trees and shrubs', meta: 'Category', image: IMG.trees, url: 'https://www.yougarden.com/trees-and-shrubs' },
        { label: 'Houseplants', meta: 'Category', image: IMG.house, url: 'https://www.yougarden.com/houseplants' },
        { label: 'Compost', meta: 'Product', image: IMG.compost, url: 'https://www.yougarden.com/' },
        { label: 'Plant food', meta: 'Product', image: IMG.compost, url: 'https://www.yougarden.com/' },
        { label: 'Sale', meta: 'Category', image: IMG.sale, url: 'https://www.yougarden.com/sale' },
        { label: 'New arrivals', meta: 'Category', image: IMG.news, url: 'https://www.yougarden.com/new' },
        { label: 'Wallflowers', meta: 'Category', image: IMG.bedding, url: 'https://www.yougarden.com/' },
        { label: 'Fuchsias', meta: 'Category', image: IMG.hanging, url: 'https://www.yougarden.com/' },
        { label: 'Buddleia', meta: 'Category', image: IMG.trees, url: 'https://www.yougarden.com/' },
        { label: 'Geraniums', meta: 'Category', image: IMG.geranium, url: 'https://www.yougarden.com/' },
        { label: 'Olive trees', meta: 'Category', image: IMG.trees, url: 'https://www.yougarden.com/' },
        { label: 'Fruits and veg', meta: 'Category', image: IMG.veg, url: 'https://www.yougarden.com/fruits-and-veg' },
        { label: 'Outdoor living', meta: 'Category', image: IMG.outdoor, url: 'https://www.yougarden.com/outdoor-living' },
    ];

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function highlightMatch(label, query) {
        var safe = escapeHtml(label);
        var q = String(query || '').trim();
        if (!q) return safe;
        var idx = label.toLowerCase().indexOf(q.toLowerCase());
        if (idx < 0) return safe;
        var before = escapeHtml(label.slice(0, idx));
        var match = escapeHtml(label.slice(idx, idx + q.length));
        var after = escapeHtml(label.slice(idx + q.length));
        return before + '<mark>' + match + '</mark>' + after;
    }

    function filterSuggestions(query) {
        var q = String(query || '').trim().toLowerCase();
        if (q.length < 2) return [];
        return SUGGESTIONS.filter(function (item) {
            return item.label.toLowerCase().indexOf(q) !== -1;
        }).slice(0, 8);
    }

    function initSearchSuggest(root) {
        var input = root.querySelector('.demo-header__search-input');
        var panel = root.querySelector('[data-search-suggest-panel]');
        var list = root.querySelector('[data-search-suggest-list]');
        var btn = root.querySelector('.demo-header__search-btn');
        if (!input || !panel || !list) return;

        var activeIndex = -1;
        var currentItems = [];

        function setOpen(open) {
            panel.hidden = !open;
            root.classList.toggle('is-suggest-open', open);
            input.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (!open) {
                activeIndex = -1;
            }
        }

        function render(query) {
            currentItems = filterSuggestions(query);
            if (!currentItems.length) {
                list.innerHTML = '';
                setOpen(false);
                return;
            }

            list.innerHTML = currentItems
                .map(function (item, index) {
                    return (
                        '<li role="option" id="yg-search-opt-' +
                        index +
                        '" class="yg-search-suggest__option" data-index="' +
                        index +
                        '" aria-selected="false">' +
                        '<a class="yg-search-suggest__link" href="' +
                        escapeHtml(item.url) +
                        '" target="_blank" rel="noopener">' +
                        '<img class="yg-search-suggest__thumb" src="' +
                        escapeHtml(item.image) +
                        '" alt="" width="48" height="48" loading="lazy">' +
                        '<span class="yg-search-suggest__copy">' +
                        '<span class="yg-search-suggest__text">' +
                        highlightMatch(item.label, query) +
                        '</span>' +
                        (item.meta
                            ? '<span class="yg-search-suggest__meta">' + escapeHtml(item.meta) + '</span>'
                            : '') +
                        '</span>' +
                        '<span class="yg-search-suggest__chev" aria-hidden="true"></span>' +
                        '</a></li>'
                    );
                })
                .join('');

            activeIndex = -1;
            setOpen(true);
        }

        function setActive(index) {
            var options = list.querySelectorAll('.yg-search-suggest__option');
            options.forEach(function (opt, i) {
                var on = i === index;
                opt.classList.toggle('is-active', on);
                opt.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            activeIndex = index;
            if (index >= 0 && options[index]) {
                input.setAttribute('aria-activedescendant', options[index].id);
            } else {
                input.removeAttribute('aria-activedescendant');
            }
        }

        function goToActiveOrQuery() {
            if (activeIndex >= 0 && currentItems[activeIndex]) {
                window.open(currentItems[activeIndex].url, '_blank', 'noopener');
                setOpen(false);
                return;
            }
            var q = input.value.trim();
            if (!q) return;
            window.open(
                'https://www.yougarden.com/search?q=' + encodeURIComponent(q),
                '_blank',
                'noopener'
            );
            setOpen(false);
        }

        input.setAttribute('autocomplete', 'off');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-controls', panel.id || 'yg-search-suggest');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('role', 'combobox');

        input.addEventListener('input', function () {
            render(input.value);
        });

        input.addEventListener('focus', function () {
            if (input.value.trim().length >= 2) {
                render(input.value);
            }
        });

        input.addEventListener('keydown', function (e) {
            if (panel.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                render(input.value);
            }
            if (panel.hidden) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    goToActiveOrQuery();
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(Math.min(currentItems.length - 1, activeIndex + 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(Math.max(0, activeIndex - 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                goToActiveOrQuery();
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        });

        btn?.addEventListener('click', function (e) {
            e.preventDefault();
            goToActiveOrQuery();
        });

        document.addEventListener('click', function (e) {
            if (!root.contains(e.target)) {
                setOpen(false);
            }
        });
    }

    function boot() {
        document.querySelectorAll('[data-search-suggest]').forEach(initSearchSuggest);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
