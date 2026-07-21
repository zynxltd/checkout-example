(function () {
    var STORAGE_KEY = 'yg_listing_prototype_v3';
    var defaults = {
        hideFindOutMore: true,
        hideEmailWhenAvailable: true,
        inlineFilters: false,
    };

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return Object.assign({}, defaults);
            }
            return Object.assign({}, defaults, JSON.parse(raw));
        } catch (e) {
            return Object.assign({}, defaults);
        }
    }

    function save(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            /* ignore */
        }
    }

    function closeDrawerIfOpen() {
        var root = document.getElementById('listing-filters');
        var openBtn = document.getElementById('listing-filters-open');
        if (!root || !root.classList.contains('is-open')) {
            return;
        }
        root.classList.remove('is-open');
        document.body.classList.remove('demo-listing-filters-open');
        openBtn?.setAttribute('aria-expanded', 'false');
        window.setTimeout(function () {
            if (!root.classList.contains('is-open')) {
                root.hidden = true;
            }
        }, 280);
    }

    function apply(state) {
        document.body.classList.toggle('demo-listing-hide-cta-more', !!state.hideFindOutMore);
        document.body.classList.toggle('demo-listing-hide-cta-oos', !!state.hideEmailWhenAvailable);
        document.body.classList.toggle('demo-listing-inline-filters', !!state.inlineFilters);

        if (state.inlineFilters) {
            closeDrawerIfOpen();
        }
    }

    function boot() {
        var moreToggle = document.getElementById('toggle-listing-hide-find-out-more');
        var oosToggle = document.getElementById('toggle-listing-hide-email-when-available');
        var inlineToggle = document.getElementById('toggle-listing-inline-filters');
        if (!moreToggle && !oosToggle && !inlineToggle) {
            return;
        }

        var state = load();
        if (moreToggle) {
            moreToggle.checked = !!state.hideFindOutMore;
            moreToggle.addEventListener('change', function () {
                state.hideFindOutMore = moreToggle.checked;
                save(state);
                apply(state);
            });
        }
        if (oosToggle) {
            oosToggle.checked = !!state.hideEmailWhenAvailable;
            oosToggle.addEventListener('change', function () {
                state.hideEmailWhenAvailable = oosToggle.checked;
                save(state);
                apply(state);
            });
        }
        if (inlineToggle) {
            inlineToggle.checked = !!state.inlineFilters;
            inlineToggle.addEventListener('change', function () {
                state.inlineFilters = inlineToggle.checked;
                save(state);
                apply(state);
            });
        }

        apply(state);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
