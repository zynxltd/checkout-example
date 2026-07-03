@php
    $payImg = fn (string $file) => asset('images/payments/footer/' . $file);
    $footerLegal = \App\Services\DemoCart::siteFooter()['legal'] ?? [];
@endphp

<footer class="demo-account-secure-footer" role="contentinfo">
    <div class="demo-account-secure-footer__top">
        <div class="demo-account-secure-footer__inner">
            <span class="demo-account-secure-footer__item">Contact us</span>
            <span class="demo-account-secure-footer__item">Lifetime guarantee</span>
            <span class="demo-account-secure-footer__item">
                <a href="mailto:cs@yougarden.com">CS@YOUGARDEN.COM</a>
            </span>
        </div>
    </div>

    <div class="demo-account-secure-footer__bottom">
        <div class="demo-account-secure-footer__payments">
            <ul class="demo-account-secure-footer__pay-cards" aria-label="Payment methods">
                <li><img src="{{ $payImg('amazonpayments.png') }}" alt="Amazon Pay" width="44" height="28" loading="lazy"></li>
                <li><img src="{{ $payImg('paypal.png') }}" alt="PayPal" width="44" height="28" loading="lazy"></li>
                <li><img src="{{ $payImg('mastercard.png') }}" alt="Mastercard" width="44" height="28" loading="lazy"></li>
                <li><img src="{{ $payImg('visa.png') }}" alt="Visa" width="44" height="28" loading="lazy"></li>
                <li><img src="{{ $payImg('amex.png') }}" alt="American Express" width="44" height="28" loading="lazy"></li>
                <li><img src="{{ $payImg('apple_pay.png') }}" alt="Apple Pay" width="44" height="28" loading="lazy"></li>
                <li class="demo-account-secure-footer__pay-amo" aria-label="Powered by AMO">powered by AMO</li>
            </ul>
        </div>

        <div class="demo-account-secure-footer__legal">
            <div class="demo-account-secure-footer__legal-inner">
                @foreach ($footerLegal as $line)
                    <p>{{ $line }}</p>
                @endforeach
                <p>Copyright &copy; YouGarden {{ date('Y') }}</p>
                <p class="demo-account-secure-footer__source">(source: WEB)</p>
            </div>
        </div>
    </div>
</footer>
