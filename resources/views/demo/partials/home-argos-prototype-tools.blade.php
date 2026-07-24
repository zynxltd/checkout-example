{{-- Homepage Argos layout — prototype tools (TV Live placement) --}}
<div class="demo-prototype-stack" id="demo-home-argos-prototype-stack">
    <button
        type="button"
        class="demo-prototype-stack__dock"
        data-prototype-dock
        aria-expanded="false"
        aria-controls="demo-home-argos-prototype-stack-body"
    >Prototype tools</button>
    <div class="demo-prototype-stack__body" id="demo-home-argos-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            <aside class="demo-controls" aria-label="Homepage prototype controls">
                <h3>Homepage layout</h3>
                <p class="demo-controls__label">Above-the-fold order</p>
                <p class="demo-controls__hint">Default keeps category carousel above the hero.</p>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-above-layout" value="cats-first" data-above-layout-option checked>
                    <span>Categories → hero + buttons</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-above-layout" value="hero-first" data-above-layout-option>
                    <span>Hero + buttons → categories</span>
                </label>

                <p class="demo-controls__label">Hero slider timing</p>
                <p class="demo-controls__hint">Autoplay interval between slides.</p>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-hero-interval" value="3000" data-hero-interval-option>
                    <span>3 seconds</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-hero-interval" value="4000" data-hero-interval-option>
                    <span>4 seconds</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-hero-interval" value="5000" data-hero-interval-option checked>
                    <span>5 seconds</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-hero-interval" value="6000" data-hero-interval-option>
                    <span>6 seconds</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-hero-interval" value="8000" data-hero-interval-option>
                    <span>8 seconds</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-hero-interval" value="10000" data-hero-interval-option>
                    <span>10 seconds</span>
                </label>

                <p class="demo-controls__label">TV Live entry</p>
                <p class="demo-controls__hint">Original site puts Live / TV in the green nav. Hidden by default — pick a placement to show it.</p>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-tv-live" value="menu" data-tv-live-option checked>
                    <span>Hidden (Shop menu only)</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-tv-live" value="header" data-tv-live-option>
                    <span>Header — Live now</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="yg-argos-tv-live" value="float" data-tv-live-option>
                    <span>Floating chip</span>
                </label>
                <p class="demo-controls__hint">Mobile menu always keeps YouGarden TV.</p>
            </aside>
        </div>
    </div>
</div>

<a
    class="yg-argos-live-float"
    href="{{ route('demo.tv-live') }}"
    data-tv-live-placement="float"
    hidden
    aria-label="YouGarden TV — Live now"
>
    <span class="yg-argos-live-float__dot" aria-hidden="true"></span>
    <span class="yg-argos-live-float__copy">
        <strong>Live now</strong>
        <span>YouGarden TV</span>
    </span>
</a>
