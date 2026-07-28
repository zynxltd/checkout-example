(function () {
    var root = document.getElementById('listing-filters');
    var openBtn = document.getElementById('listing-filters-open');
    var closeBtn = document.getElementById('listing-filters-close');
    var overlay = document.getElementById('listing-filters-overlay');
    var form = document.getElementById('listing-filters-form');
    var resetBtn = document.getElementById('listing-filters-reset');
    var applyBtn = document.getElementById('listing-filters-apply');
    var inlineForm = document.getElementById('listing-inline-filters');
    var inlineReset = document.getElementById('listing-inline-reset');
    var countEl = document.querySelector('.demo-listing-toolbar__count');
    var grid = document.querySelector('.demo-listing__grid');

    if (!openBtn) {
        return;
    }

    function openFilters() {
        if (!root) {
            return;
        }
        root.hidden = false;
        requestAnimationFrame(function () {
            root.classList.add('is-open');
        });
        document.body.classList.add('demo-listing-filters-open');
        openBtn.setAttribute('aria-expanded', 'true');
        closeBtn?.focus();
    }

    function closeFilters() {
        if (!root) {
            return;
        }
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

    function getAvailabilityValue() {
        var drawerSelect = form && form.querySelector('[data-filter="availability"]');
        var inlineSelect = inlineForm && inlineForm.querySelector('[data-filter="availability"]');
        var value = '';

        if (document.body.classList.contains('demo-listing-inline-filters') && inlineSelect) {
            value = inlineSelect.value || '';
        } else if (drawerSelect) {
            value = drawerSelect.value || '';
        }

        return value;
    }

    function syncAvailabilitySelects(value) {
        document.querySelectorAll('[data-filter="availability"]').forEach(function (select) {
            select.value = value;
        });
    }

    function updateCount(visible) {
        if (!countEl) {
            return;
        }
        countEl.textContent = visible + (visible === 1 ? ' item' : ' items');
    }

    function applyAvailabilityFilter() {
        if (!grid) {
            return;
        }

        var availability = getAvailabilityValue();
        var cards = grid.querySelectorAll('.category-box[data-availability]');
        var visible = 0;

        cards.forEach(function (card) {
            var stock = card.getAttribute('data-availability') || 'in-stock';
            var show = !availability || stock === availability;
            card.hidden = !show;
            card.style.display = show ? '' : 'none';
            if (show) {
                visible += 1;
            }
        });

        updateCount(visible);
    }

    if (root) {
        openBtn.addEventListener('click', openFilters);
        closeBtn?.addEventListener('click', closeFilters);
        overlay?.addEventListener('click', closeFilters);

        applyBtn?.addEventListener('click', function () {
            var drawerSelect = form && form.querySelector('[data-filter="availability"]');
            if (drawerSelect) {
                syncAvailabilitySelects(drawerSelect.value || '');
            }
            applyAvailabilityFilter();
            closeFilters();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && root.classList.contains('is-open')) {
                closeFilters();
            }
        });

        resetBtn?.addEventListener('click', function () {
            window.setTimeout(function () {
                var sort = document.getElementById('listing-sort');
                if (sort) {
                    sort.value = 'popularity';
                }
                syncAvailabilitySelects('');
                applyAvailabilityFilter();
            }, 0);
        });
    }

    inlineForm?.querySelectorAll('[data-filter]').forEach(function (select) {
        select.addEventListener('change', function () {
            if (select.getAttribute('data-filter') === 'availability') {
                syncAvailabilitySelects(select.value || '');
                applyAvailabilityFilter();
            }
        });
    });

    inlineReset?.addEventListener('click', function () {
        window.setTimeout(function () {
            syncAvailabilitySelects('');
            applyAvailabilityFilter();
        }, 0);
    });
})();
