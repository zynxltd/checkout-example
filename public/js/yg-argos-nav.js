/**
 * Argos header: Shop + Trending dropdowns and shop mega-menu tabs.
 * Used on homepage and /sale (and any page with site-chrome-argos).
 */
(function () {
    var navDropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dropdown]'));
    if (!navDropdowns.length) return;

    var pageOverlay = document.querySelector('[data-nav-page-overlay]');

    function syncNavPageOverlay() {
        if (!pageOverlay) return;
        var open = navDropdowns.some(function (item) {
            return item.classList.contains('is-open');
        });
        var top = 0;
        var usp = document.getElementById('usp-wrapper');
        var header = document.querySelector('.demo-header--argos');
        if (usp) {
            top = usp.getBoundingClientRect().bottom;
        } else if (header) {
            top = header.getBoundingClientRect().bottom;
        }
        pageOverlay.style.top = Math.max(0, Math.round(top)) + 'px';
        pageOverlay.classList.toggle('is-active', open);
        pageOverlay.hidden = !open;
        pageOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.classList.toggle('yg-nav-dropdown-open', open);
    }

    function closeAllNavDropdowns(except) {
        navDropdowns.forEach(function (item) {
            if (except && item === except) return;
            var trigger = item.querySelector('.yg-argos-nav__link--btn');
            var panel = item.querySelector('.yg-argos-nav__panel');
            if (!trigger || !panel) return;
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
        });
        syncNavPageOverlay();
    }

    navDropdowns.forEach(function (item) {
        var trigger = item.querySelector('.yg-argos-nav__link--btn');
        var panel = item.querySelector('.yg-argos-nav__panel');
        if (!trigger || !panel) return;

        var closeTimer = null;

        function closeDropdown() {
            clearTimeout(closeTimer);
            closeTimer = null;
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
            syncNavPageOverlay();
        }

        function openDropdown() {
            clearTimeout(closeTimer);
            closeTimer = null;
            closeAllNavDropdowns(item);
            var mini = document.querySelector('[data-mini-basket]');
            if (mini) {
                mini.classList.remove('is-open');
                var miniPanel = mini.querySelector('[data-mini-basket-panel]');
                var miniTrigger = mini.querySelector('[data-mini-basket-trigger]');
                if (miniPanel) miniPanel.hidden = true;
                if (miniTrigger) miniTrigger.setAttribute('aria-expanded', 'false');
            }
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            panel.hidden = false;
            syncNavPageOverlay();
        }

        function scheduleClose() {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(closeDropdown, 240);
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (panel.hidden) openDropdown();
            else closeDropdown();
        });
        item.addEventListener('mouseenter', openDropdown);
        item.addEventListener('mouseleave', scheduleClose);
        item.addEventListener('focusin', openDropdown);
        item.addEventListener('focusout', function (e) {
            if (!item.contains(e.relatedTarget)) scheduleClose();
        });
    });

    if (pageOverlay) {
        pageOverlay.addEventListener('click', function () {
            closeAllNavDropdowns();
        });
    }
    window.addEventListener('resize', function () {
        if (document.body.classList.contains('yg-nav-dropdown-open')) syncNavPageOverlay();
    });
    window.addEventListener('scroll', function () {
        if (document.body.classList.contains('yg-nav-dropdown-open')) syncNavPageOverlay();
    }, { passive: true });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-nav-dropdown]')) closeAllNavDropdowns();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllNavDropdowns();
    });

    var shopPanel = document.getElementById('yg-shop-panel');
    if (!shopPanel) return;

    var mega = shopPanel.querySelector('[data-shop-mega]');
    if (!mega) return;

    function activateDept(index) {
        mega.querySelectorAll('[data-mega-dept]').forEach(function (btn) {
            var on = btn.getAttribute('data-mega-dept') === String(index);
            btn.classList.toggle('is-active', on);
            btn.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        mega.querySelectorAll('[data-mega-dept-panel]').forEach(function (panel) {
            var on = panel.getAttribute('data-mega-dept-panel') === String(index);
            panel.classList.toggle('is-active', on);
            panel.hidden = !on;
        });
    }

    function activateCat(panel, catId) {
        panel.querySelectorAll('[data-mega-cat]').forEach(function (cat) {
            cat.classList.toggle('is-active', cat.getAttribute('data-mega-cat-id') === catId);
        });
        panel.querySelectorAll('[data-mega-sub]').forEach(function (sub) {
            var on = sub.getAttribute('data-mega-sub') === catId;
            sub.classList.toggle('is-active', on);
            sub.hidden = !on;
        });
    }

    mega.querySelectorAll('[data-mega-dept]').forEach(function (btn) {
        btn.addEventListener('mouseenter', function () {
            activateDept(btn.getAttribute('data-mega-dept'));
        });
        btn.addEventListener('focus', function () {
            activateDept(btn.getAttribute('data-mega-dept'));
        });
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            activateDept(btn.getAttribute('data-mega-dept'));
        });
    });

    mega.querySelectorAll('[data-mega-dept-panel]').forEach(function (panel) {
        panel.querySelectorAll('[data-mega-cat]').forEach(function (cat) {
            cat.addEventListener('mouseenter', function () {
                activateCat(panel, cat.getAttribute('data-mega-cat-id'));
            });
            cat.addEventListener('focus', function () {
                activateCat(panel, cat.getAttribute('data-mega-cat-id'));
            });
        });
    });
})();
