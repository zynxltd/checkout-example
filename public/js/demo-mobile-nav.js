(function () {
    var root = document.getElementById('demo-mobile-nav');
    var openBtn = document.getElementById('demo-mobile-nav-open');
    var closeBtn = document.getElementById('demo-mobile-nav-close');
    var overlay = document.getElementById('demo-mobile-nav-overlay');

    if (!root || !openBtn) return;

    function openMenu() {
        root.hidden = false;
        // Force reflow so the slide-in transition runs after un-hiding
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
        var link = event.target.closest('a');
        if (link) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && root.classList.contains('is-open')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.matchMedia('(min-width: 992px)').matches && root.classList.contains('is-open')) {
            closeMenu();
        }
    });
})();
