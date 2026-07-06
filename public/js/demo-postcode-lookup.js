(function (window) {
    const DEMO_POSTCODE_ADDRESSES = [
        {
            postcode: 'PE6 8FD',
            address1: '12 Garden Lane',
            address2: '',
            city: 'Market Deeping',
        },
        {
            postcode: 'PE6 7AA',
            address1: '3 Church Street',
            address2: '',
            city: 'Market Deeping',
        },
        {
            postcode: 'M1 4GH',
            address1: '12 Guest Lane',
            address2: '',
            city: 'Manchester',
        },
        {
            postcode: 'PE1 1AA',
            address1: '10 Bridge Street',
            address2: 'Flat 2',
            city: 'Peterborough',
        },
        {
            postcode: 'PE11 3TL',
            address1: '3 Fallowfields',
            address2: 'Deeping St. Nicholas',
            city: 'Spalding',
        },
        {
            postcode: 'M20 2AB',
            address1: '27 Meadow View',
            address2: 'Didsbury',
            city: 'Manchester',
        },
    ];

    function normalizePostcode(value) {
        return String(value || '')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '');
    }

    function searchDemoAddresses(query) {
        const normalized = normalizePostcode(query);
        if (normalized.length < 2) {
            return [];
        }

        return DEMO_POSTCODE_ADDRESSES.filter((entry) => {
            const pc = normalizePostcode(entry.postcode);
            return pc.includes(normalized) || pc.startsWith(normalized);
        });
    }

    function formatLabel(entry) {
        const line2 = entry.address2 ? `, ${entry.address2}` : '';
        return `${entry.address1}${line2}, ${entry.city}, ${entry.postcode}`;
    }

    function bind(root) {
        if (!root || root.dataset.postcodeBound === '1') {
            return;
        }

        const fieldMap = (() => {
            try {
                return JSON.parse(root.dataset.postcodeFields || '{}');
            } catch {
                return {};
            }
        })();

        const input = root.querySelector('[data-postcode-input]');
        const findBtn = root.querySelector('[data-postcode-find]');
        const list = root.querySelector('[data-postcode-suggest]');

        if (!input || !findBtn || !list) {
            return;
        }

        const resolveField = (key) => {
            const selector = fieldMap[key];
            if (!selector) {
                return null;
            }

            if (selector.startsWith('#') || selector.startsWith('.')) {
                return document.querySelector(selector);
            }

            return document.querySelector(`[name="${selector}"]`);
        };

        const setField = (key, value) => {
            const el = resolveField(key);
            if (el) {
                el.value = value;
            }
        };

        const hideList = () => {
            list.hidden = true;
            list.innerHTML = '';
            input.setAttribute('aria-expanded', 'false');
        };

        const applyAddress = (entry) => {
            setField('postcode', entry.postcode);
            setField('line1', entry.address1);
            setField('line2', entry.address2);
            setField('town', entry.city);
            hideList();
            root.dispatchEvent(new CustomEvent('demo:postcode-selected', { detail: entry }));
        };

        const renderMatches = (matches) => {
            list.innerHTML = '';

            if (!matches.length) {
                const empty = document.createElement('li');
                empty.className = 'demo-postcode-suggest__empty';
                empty.textContent = 'No addresses found — try PE6, M1 or enter manually.';
                list.appendChild(empty);
                list.hidden = false;
                input.setAttribute('aria-expanded', 'true');
                return;
            }

            matches.forEach((entry, index) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'demo-postcode-suggest__item';
                item.setAttribute('role', 'option');
                item.id = `${root.id || 'postcode'}-opt-${index}`;
                item.innerHTML = `<strong>${entry.postcode}</strong><span>${formatLabel(entry)}</span>`;
                item.addEventListener('click', () => applyAddress(entry));
                const li = document.createElement('li');
                li.appendChild(item);
                list.appendChild(li);
            });

            list.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        };

        let typeTimer;

        const runSearch = () => {
            renderMatches(searchDemoAddresses(input.value));
        };

        input.addEventListener('input', () => {
            clearTimeout(typeTimer);
            typeTimer = setTimeout(runSearch, 200);
        });

        input.addEventListener('focus', () => {
            if (normalizePostcode(input.value).length >= 2) {
                runSearch();
            }
        });

        findBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const matches = searchDemoAddresses(input.value);
            if (matches.length === 1) {
                applyAddress(matches[0]);
                return;
            }
            renderMatches(matches);
        });

        document.addEventListener('click', (event) => {
            if (!root.contains(event.target)) {
                hideList();
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideList();
            }
        });

        root.dataset.postcodeBound = '1';
    }

    function bindAll(scope) {
        (scope || document).querySelectorAll('[data-postcode-lookup]').forEach(bind);
    }

    window.DemoPostcodeLookup = {
        addresses: DEMO_POSTCODE_ADDRESSES,
        search: searchDemoAddresses,
        bind,
        bindAll,
    };
})(window);
