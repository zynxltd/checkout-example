(function () {
    var carousel = document.getElementById('usp-carousel');
    var track = document.getElementById('usp-track');
    if (!carousel || !track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.usp-box'));
    if (!slides.length) return;

    // Match live yougarden.com slick breakpoints
    function slidesToShow() {
        var w = window.innerWidth;
        if (w <= 700) return 1;
        if (w <= 1100) return 2;
        if (w <= 1400) return 3;
        return 4;
    }

    var index = 0;
    var timer = null;
    var visible = slidesToShow();

    function maxIndex() {
        return Math.max(0, slides.length - visible);
    }

    function layout() {
        visible = slidesToShow();
        var pct = 100 / visible;
        slides.forEach(function (slide) {
            slide.style.flex = '0 0 ' + pct + '%';
            slide.style.width = pct + '%';
            slide.style.maxWidth = pct + '%';
        });
        if (index > maxIndex()) {
            index = 0;
        }
        go(index, false);
    }

    function go(i, animate) {
        index = i;
        if (animate === false) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.35s ease';
        }
        track.style.transform = 'translate3d(-' + (index * (100 / visible)) + '%, 0, 0)';
        if (animate === false) {
            void track.offsetWidth;
            track.style.transition = 'transform 0.35s ease';
        }
    }

    function next() {
        if (slides.length <= visible) {
            return;
        }
        var nextIndex = index + 1;
        if (nextIndex > maxIndex()) {
            nextIndex = 0;
        }
        go(nextIndex, true);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function start() {
        stop();
        layout();
        // Autoplay like live (even when all 4 fit — no-ops via next())
        timer = setInterval(next, 4000);
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(start, 120);
    });

    start();
})();
