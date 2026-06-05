(function () {
    const root = document.querySelector('[data-pdp-info]');
    if (!root) {
        return;
    }

    const cards = [...root.querySelectorAll('[data-pdp-info-card]')];

    function setCardOpen(card, open) {
        const toggle = card.querySelector('.demo-pdp-info-card__toggle');
        const panel = card.querySelector('.demo-pdp-info-card__panel');
        const label = card.querySelector('[data-pdp-info-label]');
        if (!toggle || !panel) {
            return;
        }

        card.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.hidden = !open;
        if (label) {
            label.textContent = open ? 'Hide' : 'Show';
        }
    }

    function setActiveChip(id) {
        root.querySelectorAll('[data-pdp-info-jump]').forEach((chip) => {
            chip.classList.toggle('is-active', chip.getAttribute('data-pdp-info-jump') === id);
        });
    }

    cards.forEach((card) => {
        const toggle = card.querySelector('.demo-pdp-info-card__toggle');
        if (!toggle) {
            return;
        }

        toggle.addEventListener('click', () => {
            const open = !card.classList.contains('is-open');
            setCardOpen(card, open);
            if (open) {
                setActiveChip(card.id.replace('pdp-info-', ''));
            }
        });
    });

    root.querySelectorAll('[data-pdp-info-jump]').forEach((chip) => {
        chip.addEventListener('click', () => {
            const id = chip.getAttribute('data-pdp-info-jump');
            const card = root.querySelector(`#pdp-info-${id}`);
            if (!card) {
                return;
            }

            setCardOpen(card, true);
            setActiveChip(id);
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    const firstOpen = cards.find((card) => card.classList.contains('is-open'));
    if (firstOpen) {
        setActiveChip(firstOpen.id.replace('pdp-info-', ''));
    }
})();
