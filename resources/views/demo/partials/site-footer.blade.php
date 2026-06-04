{{-- YouGarden-style footer (TV Live + optional pages) --}}
<section class="demo-footer-reviews" aria-label="Customer reviews">
    <div class="demo-footer-reviews__inner">
        <div class="demo-footer-reviews__score">
            <span class="demo-footer-reviews__rating">4.8/5</span>
            <span class="demo-footer-reviews__brand">Feefo</span>
            <span class="demo-footer-reviews__award">Platinum Trusted Service Award</span>
        </div>
        <div class="demo-footer-reviews__quotes">
            <blockquote>
                <p>&ldquo;Excellent quality plants and fast delivery.&rdquo;</p>
                <footer>— Verified buyer</footer>
            </blockquote>
            <blockquote>
                <p>&ldquo;Love the Thursday live show — easy to order on my phone.&rdquo;</p>
                <footer>— Club member</footer>
            </blockquote>
        </div>
    </div>
</section>

<footer class="demo-footer" id="demo-site-footer">
    <div class="demo-footer__grid">
        <div class="demo-footer__col">
            <h2 class="demo-footer__title">Help</h2>
            <ul>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Delivery information</a></li>
                <li><a href="#">Returns &amp; refunds</a></li>
                <li><a href="#">FAQs</a></li>
            </ul>
        </div>
        <div class="demo-footer__col">
            <h2 class="demo-footer__title">Garden tips</h2>
            <ul>
                <li><a href="#">Planting guides</a></li>
                <li><a href="#">How to grow</a></li>
                <li><a href="#">Seasonal advice</a></li>
            </ul>
        </div>
        <div class="demo-footer__col">
            <h2 class="demo-footer__title">Shopping</h2>
            <ul>
                <li><a href="{{ route('demo.pdp') }}">Shop plants</a></li>
                <li><a href="{{ route('demo.tv-live') }}">TV Live shows</a></li>
                <li><a href="#">Special offers</a></li>
            </ul>
        </div>
        <div class="demo-footer__col demo-footer__col--newsletter">
            <h2 class="demo-footer__title">Sign up to our newsletter</h2>
            <form class="demo-footer__newsletter" action="#" method="post" onsubmit="return false;">
                <label class="visually-hidden" for="demo-footer-email">Email address</label>
                <input type="email" id="demo-footer-email" name="email" placeholder="Email address" autocomplete="email">
                <button type="submit">Sign up</button>
            </form>
        </div>
    </div>
    <div class="demo-footer__payments" aria-label="Payment methods">
        <span>Visa</span>
        <span>Mastercard</span>
        <span>PayPal</span>
        <span>Apple Pay</span>
        <span>Klarna</span>
    </div>
    <p class="demo-footer__legal">
        &copy; {{ date('Y') }} YouGarden. Prototype demo — not the production yougarden.com site.
    </p>
</footer>
