(function () {
    var root = document.getElementById('listing-filters');
    var openBtn = document.getElementById('listing-filters-open');
    var closeBtn = document.getElementById('listing-filters-close');
    var overlay = document.getElementById('listing-filters-overlay');
    var form = document.getElementById('listing-filters-form');
    var resetBtn = document.getElementById('listing-filters-reset');
    var applyBtn = document.getElementById('listing-filters-apply');

    if (!root || !openBtn) {
        return;
    }

    function openFilters() {
        root.hidden = false;
        requestAnimationFrame(function () {
            root.classList.add('is-open');
        });
        document.body.classList.add('demo-listing-filters-open');
        openBtn.setAttribute('aria-expanded', 'true');
        closeBtn?.focus();
    }

    function closeFilters() {
        root.classList.remove('is-open');
        document.body.classList.remove('demo-listing-filters-open');
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();

        window.setTimeout(function () {
            if (!root.classList.contains('is-open')) {
                root.hidden = true;
            }
        }, 280);
    }

    openBtn.addEventListener('click', openFilters);
    closeBtn?.addEventListener('click', closeFilters);
    overlay?.addEventListener('click', closeFilters);
    applyBtn?.addEventListener('click', closeFilters);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && root.classList.contains('is-open')) {
            closeFilters();
        }
    });

    resetBtn?.addEventListener('click', function () {
        if (!form) {
            return;
        }

        window.setTimeout(function () {
            var sort = document.getElementById('listing-sort');
            if (sort) {
                sort.value = 'popularity';
            }
        }, 0);
    });
})();
