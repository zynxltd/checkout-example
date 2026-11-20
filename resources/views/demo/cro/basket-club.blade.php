<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Basket Club CRO — {{ strtoupper($variant) }}</title>
    <link rel="stylesheet" href="https://use.typekit.net/hrf1tkz.css">
    <link rel="stylesheet" href="{{ $assetBase }}/{{ $variant }}.css">
    <style>
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 24px 16px 48px;
            background: #ececec;
            font-family: Arial, Helvetica, sans-serif;
            color: #222;
        }
        .cro-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 0 0 16px;
            max-width: 980px;
        }
        .cro-nav a {
            display: inline-block;
            padding: 6px 12px;
            border: 1px solid #bbb;
            background: #fff;
            color: #222;
            text-decoration: none;
            font-size: 13px;
        }
        .cro-nav a.is-active {
            background: #570e57;
            border-color: #570e57;
            color: #fff;
        }
        h1 {
            margin: 0 0 6px;
            font-size: 18px;
            font-weight: 700;
        }
        .cro-meta {
            margin: 0 0 16px;
            font-size: 13px;
            color: #555;
            max-width: 980px;
        }
        .cro-meta code {
            font-size: 12px;
            background: #fff;
            padding: 1px 5px;
            border: 1px solid #ddd;
        }
        .cro-basket {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 220px;
            gap: 20px;
            max-width: 980px;
            align-items: start;
        }
        @media (max-width: 760px) {
            .cro-basket { grid-template-columns: 1fr; }
        }
        .cro-main {
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px 14px 24px;
            overflow: visible;
        }
        .cro-fake-table {
            margin: 0 0 14px;
            padding: 12px;
            border: 1px dashed #ccc;
            color: #777;
            font-size: 13px;
        }
        .buttonPromoWrapper {
            margin: 0 0 8px;
            min-height: 1px;
        }
        .cro-side {
            background: #fff;
            border: 1px solid #ddd;
            padding: 14px;
        }
        .cro-side h2 {
            margin: 0 0 10px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #666;
        }
        .clubSavingWrapper { margin: 0; }
    </style>
</head>
<body>
    <nav class="cro-nav" aria-label="Variants">
        @foreach (['v1', 'v2', 'v3'] as $v)
            <a href="{{ route('demo.cro.basket-club', $v) }}" class="{{ $variant === $v ? 'is-active' : '' }}">{{ strtoupper($v) }}</a>
        @endforeach
    </nav>

    <h1>Basket Club promo — {{ strtoupper($variant) }}</h1>
    <p class="cro-meta">
        Design QA using hosted assets from <code>{{ $assetBase }}</code>.
        Crazy Egg should paste only <code>ce-boot-{{ $variant }}.js</code>.
    </p>

    <div class="cro-basket">
        <div class="cro-main">
            <div class="cro-fake-table">Basket line items (placeholder)</div>
            <div class="buttonPromoWrapper"></div>

            @if ($variant === 'v1')
                <div class="ce-yg-club-promo ce-yg-club-promo--v1" data-ce-yg-club-promo="v1">
                    <div class="ce-yg-club-promo__inner">
                        <img class="ce-yg-club-promo__logo" src="{{ $assetBase }}/assets/yg-club-logo-v1.png" alt="YouGarden Discount Club" width="70" height="70">
                        <div class="ce-yg-club-promo__lead">
                            <div class="ce-yg-club-promo__copy">
                                <p class="ce-yg-club-promo__eyebrow">Join our club &amp;</p>
                                <p class="ce-yg-club-promo__save">Save {{ $saving }}</p>
                                <p class="ce-yg-club-promo__sub">on this order</p>
                                <a class="ce-yg-club-promo__more" href="{{ route('demo.club') }}">More Info</a>
                            </div>
                        </div>
                        <div class="ce-yg-club-promo__benefits">
                            <div class="ce-yg-club-promo__benefit">
                                <span class="ce-yg-club-promo__benefit-icon" aria-hidden="true"><img src="{{ $assetBase }}/assets/yg-club-icon-plant.png" alt="" width="34" height="48"></span>
                                <span class="ce-yg-club-promo__benefit-label"><strong>15% Off</strong>All Plants and Accessories</span>
                            </div>
                            <div class="ce-yg-club-promo__benefit">
                                <span class="ce-yg-club-promo__benefit-icon" aria-hidden="true"><img src="{{ $assetBase }}/assets/yg-club-icon-vouchers.png" alt="" width="40" height="33"></span>
                                <span class="ce-yg-club-promo__benefit-label"><strong>£20</strong>In Vouchers</span>
                            </div>
                            <div class="ce-yg-club-promo__benefit">
                                <span class="ce-yg-club-promo__benefit-icon" aria-hidden="true"><img src="{{ $assetBase }}/assets/yg-club-icon-van.png" alt="" width="42" height="25"></span>
                                <span class="ce-yg-club-promo__benefit-label"><strong>2 x Free</strong>P&amp;P Vouchers<br>(Worth £6.99 Each)</span>
                            </div>
                        </div>
                        <div class="ce-yg-club-promo__choose" role="radiogroup" aria-label="Club membership options">
                            <label class="ce-yg-club-promo__opt is-selected">
                                <input type="radio" name="ce-yg-club-v1" value="ST0007014" checked>
                                <span class="ce-yg-club-promo__radio" aria-hidden="true"></span>
                                <span class="ce-yg-club-promo__opt-text">
                                    <span class="ce-yg-club-promo__opt-title">Auto Renewal</span>
                                    <span class="ce-yg-club-promo__opt-price">Now £10</span>
                                    <span class="ce-yg-club-promo__meta">Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>
                                </span>
                            </label>
                            <label class="ce-yg-club-promo__opt ce-yg-club-promo__opt--one">
                                <input type="radio" name="ce-yg-club-v1" value="ST0003182">
                                <span class="ce-yg-club-promo__radio" aria-hidden="true"></span>
                                <span class="ce-yg-club-promo__opt-text">
                                    <span class="ce-yg-club-promo__opt-title">One Year</span>
                                    <span class="ce-yg-club-promo__opt-row">
                                        <span class="ce-yg-club-promo__opt-price">£20</span>
                                        <span class="ce-yg-club-promo__meta">No Auto<br>Renew</span>
                                    </span>
                                </span>
                            </label>
                            <button type="button" class="ce-yg-club-promo__atc">Add to Basket</button>
                        </div>
                    </div>
                </div>
            @elseif ($variant === 'v2')
                <div class="ce-yg-club-promo ce-yg-club-promo--v2" data-ce-yg-club-promo="v2">
                    <div class="ce-yg-club-promo__inner">
                        <div class="ce-yg-club-promo__left">
                            <img class="ce-yg-club-promo__logo" src="{{ $assetBase }}/assets/yg-club-logo-icon-96.png" alt="YouGarden Discount Club" width="96" height="85">
                            <p class="ce-yg-club-promo__title">Join our club &amp; <span class="ce-yg-club-promo__save">Save {{ $saving }}</span> on this order</p>
                            <a class="ce-yg-club-promo__find" href="{{ route('demo.club') }}">More Info Here</a>
                        </div>
                        <div class="ce-yg-club-promo__right">
                            <p class="ce-yg-club-promo__sub">Sign Up Today for 15% Off All Plants &amp; Accessories, £20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>
                            <div class="ce-yg-club-promo__actions">
                                <button type="button" class="ce-yg-club-promo__pill">
                                    <span>Auto Renewal <strong>Now £10</strong> Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>
                                    <svg class="ce-yg-club-promo__plus" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#7cb342"/><path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>
                                </button>
                                <button type="button" class="ce-yg-club-promo__pill">
                                    <span>12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>
                                    <svg class="ce-yg-club-promo__plus" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#7cb342"/><path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            @else
                <div class="ce-yg-club-promo ce-yg-club-promo--v3" data-ce-yg-club-promo="v3">
                    <div class="ce-yg-club-promo__banner">
                        <img class="ce-yg-club-promo__logo" src="{{ $assetBase }}/assets/yg-club-logo-v3.png" alt="YouGarden Discount Club" width="120" height="90">
                        <div class="ce-yg-club-promo__copy">
                            <p class="ce-yg-club-promo__title">Join the YouGarden Club &amp; <span class="ce-yg-club-promo__save">Save {{ $saving }}</span> on this order</p>
                            <p class="ce-yg-club-promo__benefits">
                                <span>15% off all Plants &amp; Accessories</span>
                                <span class="ce-yg-club-promo__sep" aria-hidden="true"></span>
                                <span>£20 in Product Vouchers</span>
                                <span class="ce-yg-club-promo__sep" aria-hidden="true"></span>
                                <span>2 x Free P&amp;P Vouchers</span>
                            </p>
                        </div>
                    </div>
                    <div class="ce-yg-club-promo__body">
                        <div class="ce-yg-club-promo__cards" role="radiogroup" aria-label="Club membership options">
                            <label class="ce-yg-club-promo__card is-selected">
                                <input type="radio" name="ce-yg-club-v3" value="ST0007014" checked>
                                <span class="ce-yg-club-promo__radio" aria-hidden="true"></span>
                                <span class="ce-yg-club-promo__card-text">
                                    <span class="ce-yg-club-promo__card-main">£10 / Year Auto-Renew</span>
                                    <span class="ce-yg-club-promo__card-meta">Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>
                                </span>
                            </label>
                            <label class="ce-yg-club-promo__card">
                                <input type="radio" name="ce-yg-club-v3" value="ST0003182">
                                <span class="ce-yg-club-promo__radio" aria-hidden="true"></span>
                                <span class="ce-yg-club-promo__card-text">
                                    <span class="ce-yg-club-promo__card-main">£20 One-Off</span>
                                    <span class="ce-yg-club-promo__card-meta">12 months | No Renewal</span>
                                </span>
                            </label>
                        </div>
                        <div class="ce-yg-club-promo__cta">
                            <button type="button" class="ce-yg-club-promo__atc">Add to Basket</button>
                            <a class="ce-yg-club-promo__more" href="{{ route('demo.club') }}">More Info</a>
                        </div>
                    </div>
                </div>
            @endif
        </div>

        <aside class="cro-side">
            <h2>Sidebar</h2>
            @if ($variant === 'v1')
                <div class="clubSavingWrapper ce-yg-club-side--v1" data-ce-yg-club-side="1">
                    <a class="ce-yg-club-side__link" href="{{ route('demo.club') }}">
                        <img class="ce-yg-club-side__logo" src="{{ $assetBase }}/assets/yg-club-logo-v1-sm.png" alt="" width="40" height="36">
                        <span class="ce-yg-club-side__text">Join to Save an Extra <strong>{{ $saving }}</strong></span>
                    </a>
                </div>
            @elseif ($variant === 'v2')
                <div class="clubSavingWrapper ce-yg-club-side--v2" data-ce-yg-club-side="1">
                    <a class="ce-yg-club-side__link" href="{{ route('demo.club') }}" aria-label="Save more with the YouGarden Discount Club">
                        <img class="ce-yg-club-side__logo" src="{{ $assetBase }}/assets/yg-club-logo-primary-140.png" alt="YouGarden Discount Club" width="140" height="36">
                        <span class="ce-yg-club-side__save">Save MORE!</span>
                    </a>
                </div>
            @else
                <div class="clubSavingWrapper ce-yg-club-side--v3" data-ce-yg-club-side="1">
                    <a class="ce-yg-club-side__link" href="{{ route('demo.club') }}" aria-label="Save more with the YouGarden Discount Club">
                        <img class="ce-yg-club-side__logo" src="{{ $assetBase }}/assets/yg-club-logo-v3-side.png" alt="" width="160" height="44">
                    </a>
                </div>
            @endif
        </aside>
    </div>

    <script>
        (function () {
            var root = document.querySelector('[data-ce-yg-club-promo]');
            if (!root) return;
            var cards = root.querySelectorAll('.ce-yg-club-promo__opt, .ce-yg-club-promo__card');
            Array.prototype.forEach.call(cards, function (lab) {
                lab.addEventListener('click', function () {
                    var input = lab.querySelector('input');
                    if (input) input.checked = true;
                    Array.prototype.forEach.call(cards, function (o) {
                        o.classList.toggle('is-selected', !!(o.querySelector('input') && o.querySelector('input').checked));
                    });
                });
            });
        })();
    </script>
</body>
</html>
