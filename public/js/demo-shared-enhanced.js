(function () {
    var animated = document.querySelectorAll('.demo-yg-animate');

    if (!animated.length) {
        return;
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        animated.forEach(function (el) {
            el.classList.add('is-visible');
        });
        return;
    }

    if (!('IntersectionObserver' in window)) {
        animated.forEach(function (el) {
            el.classList.add('is-visible');
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.12 }
    );

    animated.forEach(function (el) {
        observer.observe(el);
    });
})();
