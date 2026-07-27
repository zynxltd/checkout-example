(function () {
    var root = document.getElementById('demo-mobile-nav');
    var openBtn = document.getElementById('demo-mobile-nav-open');
    var closeBtn = document.getElementById('demo-mobile-nav-close');
    var overlay = document.getElementById('demo-mobile-nav-overlay');

    if (!root || !openBtn) return;

    var isCurrys = root.classList.contains('demo-mobile-nav--currys');
    var views = isCurrys ? Array.prototype.slice.call(root.querySelectorAll('[data-nav-view]')) : [];
    var navStack = ['root'];

    function getView(id) {
        return root.querySelector('[data-nav-view="' + id + '"]');
    }

    function showView(id) {
        if (!isCurrys) return;
        views.forEach(function (view) {
            var on = view.getAttribute('data-nav-view') === id;
            view.classList.toggle('is-active', on);
            view.hidden = !on;
        });
    }

    function resetNavStack() {
        if (!isCurrys) return;
        navStack = ['root'];
        showView('root');
    }

    function openSubView(id) {
        if (!isCurrys || !getView(id)) return;
        navStack.push(id);
        showView(id);
    }

    function navBack() {
        if (!isCurrys || navStack.length <= 1) return;
        navStack.pop();
        showView(navStack[navStack.length - 1]);
    }

    function openMenu() {
        root.hidden = false;
        void root.offsetWidth;
        root.classList.add('is-open');
        document.body.classList.add('demo-mobile-nav-open');
        openBtn.setAttribute('aria-expanded', 'true');
        if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
        root.classList.remove('is-open');
        document.body.classList.remove('demo-mobile-nav-open');
        openBtn.setAttribute('aria-expanded', 'false');
        window.setTimeout(function () {
            if (!root.classList.contains('is-open')) {
                root.hidden = true;
                resetNavStack();
            }
        }, 220);
        openBtn.focus();
    }

    function toggleMenu() {
        if (root.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    openBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    root.addEventListener('click', function (event) {
        if (isCurrys) {
            var openTrigger = event.target.closest('[data-nav-open]');
            if (openTrigger) {
                event.preventDefault();
                openSubView(openTrigger.getAttribute('data-nav-open'));
                return;
            }

            var backTrigger = event.target.closest('[data-nav-back]');
            if (backTrigger) {
                event.preventDefault();
                navBack();
                return;
            }

            var link = event.target.closest('a.demo-mobile-nav__row--link, a.demo-mobile-nav__view-all, a.demo-mobile-nav__footer-link');
            if (link) closeMenu();
            return;
        }

        var legacyLink = event.target.closest('a');
        if (legacyLink) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
        if (!root.classList.contains('is-open')) return;

        if (event.key === 'Escape') {
            if (isCurrys && navStack.length > 1) {
                navBack();
            } else {
                closeMenu();
            }
        }
    });

    window.addEventListener('resize', function () {
        if (window.matchMedia('(min-width: 992px)').matches && root.classList.contains('is-open')) {
            closeMenu();
        }
    });

    if (isCurrys) {
        resetNavStack();
    }
})();
