<div class="demo-prototype-stack" id="demo-account-prototype-stack">
    <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-account-prototype-stack-body">Prototype tools</button>
    <div class="demo-prototype-stack__body" id="demo-account-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            <aside class="demo-controls" aria-label="Account prototype controls">
                <h3>Account state</h3>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-account-club-member"
                        data-option="club_member"
                        {{ ! empty($club_member) ? 'checked' : '' }}
                    >
                    <span>Club member</span>
                </label>
                <p class="demo-controls__hint">On: demo club member (Richard Llewellyn) with vouchers, magazine and benefits. Off: standard guest account (John Smith).</p>
            </aside>

            <aside class="demo-controls" aria-label="Club benefits layout">
                <h3>Club benefits</h3>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-club-benefits-compact"
                        data-option="club_benefits_compact"
                        {{ ! empty($club_benefits_compact) ? 'checked' : '' }}
                    >
                    <span>Compact VIP panel</span>
                </label>
                <p class="demo-controls__hint">Tighter logo, discount figures and category badges on the Club Membership benefits hero.</p>
            </aside>
        </div>
    </div>
</div>
