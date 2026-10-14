document.addEventListener('DOMContentLoaded', function () {

    const finder = document.querySelector('[data-finder]');

    if (!finder) {
        return;
    }


    const drawer =
        finder.querySelector('[data-filter-drawer]');

    const overlay =
        finder.querySelector('[data-filter-overlay]');

    const openButtons =
        finder.querySelectorAll('[data-filter-open]');

    const form =
        finder.querySelector('[data-finder-form]');


    let lastFocusedElement = null;


    function setOpenButtonsExpanded(expanded) {

        openButtons.forEach(function (button) {
            button.setAttribute(
                'aria-expanded',
                expanded ? 'true' : 'false'
            );
        });

    }


    /* =========================================================
       DRAWER
       ========================================================= */

    function openDrawer() {

        if (!drawer) {
            return;
        }

        lastFocusedElement =
            document.activeElement;

        finder.classList.add('drawer-open');
        sessionStorage.setItem('yg-plant-finder-drawer', 'open');

        drawer.setAttribute(
            'aria-hidden',
            'false'
        );

        if (overlay) {

            overlay.setAttribute(
                'aria-hidden',
                'false'
            );

        }

        setOpenButtonsExpanded(true);

        document.body.style.overflow = 'hidden';


        requestAnimationFrame(function () {

            const closeButton =
                drawer.querySelector(
                    '[data-filter-close]'
                );

            if (closeButton) {
                closeButton.focus();
            }

        });

    }


    function closeDrawer(
        restoreFocus = true
    ) {

        if (!drawer) {
            return;
        }

        finder.classList.remove('drawer-open');
        sessionStorage.removeItem('yg-plant-finder-drawer');

        drawer.setAttribute(
            'aria-hidden',
            'true'
        );

        if (overlay) {

            overlay.setAttribute(
                'aria-hidden',
                'true'
            );

        }

        setOpenButtonsExpanded(false);

        document.body.style.overflow = '';


        if (
            restoreFocus &&
            lastFocusedElement &&
            typeof lastFocusedElement.focus === 'function'
        ) {

            lastFocusedElement.focus();

        }

    }


    openButtons.forEach(function (button) {

        button.addEventListener(
            'click',
            openDrawer
        );

    });


    finder.addEventListener(
        'click',
        function (event) {

            const closeButton =
                event.target.closest(
                    '[data-filter-close]'
                );

            if (!closeButton || !finder.contains(closeButton)) {
                return;
            }

            closeDrawer();

        }
    );


    if (overlay) {

        overlay.addEventListener(
            'click',
            function () {
                closeDrawer();
            }
        );

    }


    /* =========================================================
       ESCAPE KEY
       ========================================================= */

    document.addEventListener(
        'keydown',
        function (event) {

            if (event.key !== 'Escape') {
                return;
            }

            if (finder.classList.contains('drawer-open')) {
                event.preventDefault();
                closeDrawer();
            }

        }
    );


    /* =========================================================
       DRAWER FOCUS TRAP
       ========================================================= */

    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key !== 'Tab' ||
                !finder.classList.contains('drawer-open') ||
                !drawer
            ) {
                return;
            }


            const focusableElements =
                drawer.querySelectorAll(
                    'button:not([disabled]), ' +
                    'a[href], ' +
                    'input:not([disabled]), ' +
                    'select:not([disabled]), ' +
                    'textarea:not([disabled]), ' +
                    '[tabindex]:not([tabindex="-1"])'
                );


            if (!focusableElements.length) {
                return;
            }


            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                    focusableElements.length - 1
                ];


            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {

                event.preventDefault();

                lastElement.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {

                event.preventDefault();

                firstElement.focus();

            }

        }
    );


    /* =========================================================
       FILTER FORM
       ========================================================= */

    if (form) {

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            submitFilters();
        });

        form.querySelectorAll('select').forEach(function (select) {
            select.addEventListener('change', function () {
                submitFilters();
            });
        });

        form.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
            input.addEventListener('change', function () {
                updateCheckboxState(input);
                submitFilters();
            });
        });

    }


    /* =========================================================
       FILTER SUBMISSION (AJAX — keep drawer open)
       ========================================================= */

    let submitting = false;
    let pendingSubmit = false;

    const heroMeta =
        finder.querySelector('[data-finder-hero-meta]');

    const chipsContainer =
        finder.querySelector('[data-finder-chips]');

    const resultsContainer =
        finder.querySelector('[data-finder-results]');

    const drawerFooter =
        finder.querySelector('[data-finder-drawer-footer]');


    function buildFilterUrl(page) {
        const params = new URLSearchParams();

        params.set('partial', '1');

        if (form) {
            form.querySelectorAll('select').forEach(function (select) {
                if (select.value !== '') {
                    params.set(select.name, select.value);
                }
            });

            form.querySelectorAll(
                'input[type="checkbox"]:checked'
            ).forEach(function (input) {
                params.append(input.name, input.value);
            });
        }

        const sortSelect = finder.querySelector('[data-finder-sort]');

        if (sortSelect && sortSelect.value) {
            params.set('sort', sortSelect.value);
        }

        if (page && page > 1) {
            params.set('page', String(page));
        }

        const query = params.toString();

        return window.location.pathname + (query ? '?' + query : '');
    }


    function publicFilterUrl(requestUrl) {
        const url = new URL(
            requestUrl || buildFilterUrl(),
            window.location.origin
        );

        url.searchParams.delete('partial');

        const query = url.searchParams.toString();

        return url.pathname + (query ? '?' + query : '');
    }


    async function loadFinder(requestUrl) {

        if (submitting) {
            pendingSubmit = requestUrl || true;
            return;
        }

        submitting = true;
        pendingSubmit = false;

        finder.classList.add('is-loading');

        const fetchUrl = requestUrl || buildFilterUrl();
        const historyUrl = publicFilterUrl(fetchUrl);

        try {

            const response = await fetch(fetchUrl, {
                headers: {
                    'Accept': 'application/json',
                    'X-Finder-Partial': '1',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            const contentType =
                response.headers.get('content-type') || '';

            if (!response.ok || !contentType.includes('application/json')) {
                throw new Error('Unexpected finder response');
            }

            const data = await response.json();

            if (resultsContainer) {
                resultsContainer.innerHTML = data.results;
            }

            if (chipsContainer) {
                chipsContainer.innerHTML = data.chips;
            }

            if (heroMeta) {
                heroMeta.innerHTML = data.heroMeta || '';
            }

            if (drawerFooter) {
                drawerFooter.innerHTML = data.drawerFooter;
            }

            window.history.replaceState(
                { finderFilters: true },
                '',
                historyUrl
            );

            document.dispatchEvent(new CustomEvent('yg-plant-finder:updated', {
                detail: { total: data.total },
            }));

            if (sessionStorage.getItem('yg-plant-finder-drawer') === 'open') {
                finder.classList.add('drawer-open');
                setOpenButtonsExpanded(true);
                document.body.style.overflow = 'hidden';
            }

        } catch (error) {

            console.error('Plant finder update failed', error);

            if (requestUrl) {
                window.location.assign(publicFilterUrl(fetchUrl));
            }

        } finally {

            finder.classList.remove('is-loading');
            submitting = false;

            if (pendingSubmit) {
                const next = pendingSubmit === true
                    ? null
                    : pendingSubmit;

                pendingSubmit = false;
                loadFinder(next);
            }

        }

    }


    function submitFilters() {
        if (!form) {
            return;
        }

        loadFinder(buildFilterUrl());
    }


    function queryValues(params, field) {
        const values = [];

        params.forEach(function (value, key) {
            if (
                key === field ||
                key === field + '[]' ||
                key.indexOf(field + '[') === 0
            ) {
                values.push(value);
            }
        });

        return values;
    }


    function syncFormFromUrl(requestUrl) {
        if (!form) {
            return;
        }

        const url = new URL(
            requestUrl || window.location.href,
            window.location.origin
        );
        const params = url.searchParams;

        form.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
            const field = input.name.replace(/\[\]$/, '');
            const selected = queryValues(params, field);

            input.checked = selected.indexOf(input.value) !== -1;
            updateCheckboxState(input);
        });

        form.querySelectorAll('select').forEach(function (select) {
            select.value = params.get(select.name) || '';
        });

        finder.querySelectorAll('[data-finder-sort]').forEach(function (sortSelect) {
            sortSelect.value = params.get('sort') || 'name_asc';
        });
    }


    finder.addEventListener('change', function (event) {
        const sortSelect = event.target.closest('[data-finder-sort]');

        if (!sortSelect || !finder.contains(sortSelect)) {
            return;
        }

        loadFinder(buildFilterUrl());
    });


    /*
     * Chips, reset/clear links, and pagination should update via AJAX —
     * never full-page navigate (or land on a partial=1 URL).
     */
    finder.addEventListener('click', function (event) {
        const link = event.target.closest(
            [
                '.yg-pf-chips a[href]',
                '.yg-pf-results-bar__clear[href]',
                'a.drawer-clear[href]',
                '.yg-pf-empty a[href]',
                '.finder-pagination a[href]',
            ].join(', ')
        );

        if (!link || !finder.contains(link)) {
            return;
        }

        const url = new URL(link.href, window.location.origin);

        if (url.origin !== window.location.origin) {
            return;
        }

        event.preventDefault();

        url.searchParams.delete('partial');
        url.searchParams.set('partial', '1');

        const requestUrl = url.pathname + url.search;

        syncFormFromUrl(url);
        loadFinder(requestUrl);

        if (link.closest('.finder-pagination') && resultsContainer) {
            resultsContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });


    /* =========================================================
       CHECKBOX VISUAL STATE
       ========================================================= */

    function updateCheckboxState(input) {

        const label =
            input.closest('.characteristic');

        if (!label) {
            return;
        }

        if (input.checked) {

            label.classList.add(
                'is-selected'
            );

        } else {

            label.classList.remove(
                'is-selected'
            );

        }

    }


    /* =========================================================
       INITIALISE CHECKBOX STATES
       ========================================================= */

    if (form) {

        form.querySelectorAll(
            'input[type="checkbox"]'
        ).forEach(function (input) {

            updateCheckboxState(
                input
            );

        });

    }


    /* =========================================================
       RESTORE DRAWER / CLEAN UP
       ========================================================= */

    if (sessionStorage.getItem('yg-plant-finder-drawer') === 'open') {
        openDrawer();
    }


    window.addEventListener(
        'popstate',
        function () {
            window.location.reload();
        }
    );


    window.addEventListener(
        'pageshow',
        function () {

            submitting = false;

            if (sessionStorage.getItem('yg-plant-finder-drawer') === 'open') {
                openDrawer();
            } else {
                document.body.style.overflow = '';
            }

        }
    );


    window.addEventListener(
        'beforeunload',
        function () {

            document.body.style.overflow = '';

        }
    );

});

