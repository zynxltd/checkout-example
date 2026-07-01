(function () {
    var root = document.getElementById('demo-pf-filters');
    var openBtn = document.getElementById('demo-pf-filters-open');
    var closeBtn = document.getElementById('demo-pf-filters-close');
    var overlay = document.getElementById('demo-pf-filters-overlay');
    var applyBtn = document.getElementById('demo-pf-filters-apply');
    var form = document.getElementById('demo-pf-filters-form');
    var resetBtn = document.getElementById('demo-pf-filters-reset');
    var emptyResetBtn = document.getElementById('demo-pf-empty-reset');
    var sortSelect = document.getElementById('demo-pf-sort');
    var countNum = document.getElementById('demo-pf-results-count-num');
    var activeWrap = document.getElementById('demo-pf-active');
    var activeList = document.getElementById('demo-pf-active-list');
    var emptyState = document.getElementById('demo-pf-empty');
    var grid = document.getElementById('demo-pf-grid');
    var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-pf-card]')) : [];

    var quizRoot = document.getElementById('demo-pf-quiz');
    var quizBack = document.getElementById('demo-pf-quiz-back');
    var quizSkip = document.getElementById('demo-pf-quiz-skip');
    var quizResults = document.getElementById('demo-pf-quiz-results');
    var quizRestart = document.getElementById('demo-pf-quiz-restart');
    var quizSummary = document.getElementById('demo-pf-quiz-summary');
    var quizSummaryText = document.getElementById('demo-pf-quiz-summary-text');
    var quizStepLabel = document.getElementById('demo-pf-quiz-step-label');
    var resultsSection = document.getElementById('demo-pf-results-section');
    var quizPanels = quizRoot ? Array.prototype.slice.call(quizRoot.querySelectorAll('[data-quiz-panel]')) : [];
    var quizDots = quizRoot ? Array.prototype.slice.call(quizRoot.querySelectorAll('[data-quiz-dot]')) : [];
    var quizSteps = quizRoot && quizRoot.dataset.quizSteps ? JSON.parse(quizRoot.dataset.quizSteps) : [];
    var currentQuizStep = 0;
    var quizAnswers = {};

    if (!form || !cards.length) {
        return;
    }

    var monthLabels = {};
    form.querySelectorAll('[data-pf-filter="planting"] option').forEach(function (option) {
        if (option.value) {
            monthLabels[option.value] = option.textContent;
        }
    });

    var categoryLabels = {};
    form.querySelector('[data-pf-filter="category"]').querySelectorAll('option').forEach(function (option) {
        categoryLabels[option.value] = option.textContent;
    });

    var traitLabels = {};
    form.querySelectorAll('[data-pf-trait]').forEach(function (input) {
        var pill = input.parentElement.querySelector('.demo-pf-trait__pill');
        traitLabels[input.value] = pill ? pill.textContent : input.value;
    });

    function openFilters() {
        if (!root || window.matchMedia('(min-width: 960px)').matches) {
            return;
        }

        root.classList.add('is-open');
        document.body.classList.add('demo-pf-filters-open');
        openBtn.setAttribute('aria-expanded', 'true');
        closeBtn.focus();
    }

    function closeFilters() {
        if (!root) {
            return;
        }

        root.classList.remove('is-open');
        document.body.classList.remove('demo-pf-filters-open');
        openBtn.setAttribute('aria-expanded', 'false');
    }

    function getSelectedTraits() {
        return Array.prototype.slice
            .call(form.querySelectorAll('[data-pf-trait]:checked'))
            .map(function (input) {
                return input.value;
            });
    }

    function getFilters() {
        return {
            planting: form.querySelector('[data-pf-filter="planting"]').value,
            flowering: form.querySelector('[data-pf-filter="flowering"]').value,
            fruiting: form.querySelector('[data-pf-filter="fruiting"]').value,
            category: form.querySelector('[data-pf-filter="category"]').value,
            traits: getSelectedTraits(),
        };
    }

    function monthMatches(value, csv) {
        if (!value) {
            return true;
        }

        if (!csv) {
            return false;
        }

        return csv.split(',').indexOf(value) !== -1;
    }

    function cardMatches(card, filters) {
        if (filters.category && card.dataset.category !== filters.category) {
            return false;
        }

        if (!monthMatches(filters.planting, card.dataset.planting)) {
            return false;
        }

        if (!monthMatches(filters.flowering, card.dataset.flowering)) {
            return false;
        }

        if (!monthMatches(filters.fruiting, card.dataset.fruiting)) {
            return false;
        }

        if (filters.traits.length) {
            var cardTraits = (card.dataset.traits || '').split(/\s+/);

            var hasAllTraits = filters.traits.every(function (trait) {
                return cardTraits.indexOf(trait) !== -1;
            });

            if (!hasAllTraits) {
                return false;
            }
        }

        return true;
    }

    function pulseCount() {
        countNum.classList.remove('is-pulse');
        void countNum.offsetWidth;
        countNum.classList.add('is-pulse');
    }

    function animateVisibleCards(visibleCards) {
        visibleCards.forEach(function (card, index) {
            card.classList.remove('is-entering');
            card.style.animationDelay = (index * 0.04) + 's';
            void card.offsetWidth;
            card.classList.add('is-entering');
        });
    }

    function sortCards(visibleCards) {
        var sort = sortSelect ? sortSelect.value : 'name-asc';

        visibleCards.sort(function (a, b) {
            if (sort === 'price-asc') {
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            }

            if (sort === 'price-desc') {
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            }

            var nameA = a.dataset.name.toLowerCase();
            var nameB = b.dataset.name.toLowerCase();

            if (sort === 'name-desc') {
                return nameB.localeCompare(nameA);
            }

            return nameA.localeCompare(nameB);
        });

        visibleCards.forEach(function (card) {
            grid.appendChild(card);
        });
    }

    function renderActiveFilters(filters) {
        activeList.innerHTML = '';
        var chips = [];

        if (filters.planting) {
            chips.push({ key: 'planting', label: 'Plant ' + monthLabels[filters.planting] });
        }

        if (filters.flowering) {
            chips.push({ key: 'flowering', label: 'Flower ' + monthLabels[filters.flowering] });
        }

        if (filters.fruiting) {
            chips.push({ key: 'fruiting', label: 'Fruit ' + monthLabels[filters.fruiting] });
        }

        if (filters.category) {
            chips.push({ key: 'category', label: categoryLabels[filters.category] });
        }

        filters.traits.forEach(function (trait) {
            chips.push({ key: 'trait:' + trait, label: traitLabels[trait] });
        });

        if (!chips.length) {
            activeWrap.hidden = true;
            return;
        }

        activeWrap.hidden = false;

        chips.forEach(function (chip) {
            var item = document.createElement('li');
            var button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', 'Remove ' + chip.label);
            button.textContent = '×';
            button.dataset.remove = chip.key;

            var span = document.createElement('span');
            span.className = 'demo-pf-active__chip';
            span.appendChild(document.createTextNode(chip.label + ' '));
            span.appendChild(button);
            item.appendChild(span);
            activeList.appendChild(item);
        });
    }

    function applyFilters() {
        var filters = getFilters();
        var visibleCards = [];

        cards.forEach(function (card) {
            var matches = cardMatches(card, filters);
            card.classList.toggle('is-hidden', !matches);

            if (matches) {
                visibleCards.push(card);
            }
        });

        sortCards(visibleCards);
        countNum.textContent = String(visibleCards.length);
        pulseCount();
        emptyState.hidden = visibleCards.length > 0;
        grid.hidden = visibleCards.length === 0;
        renderActiveFilters(filters);
        animateVisibleCards(visibleCards);

        return visibleCards.length;
    }

    function clearFilter(key) {
        if (key === 'planting' || key === 'flowering' || key === 'fruiting' || key === 'category') {
            form.querySelector('[data-pf-filter="' + key + '"]').value = '';
            return;
        }

        if (key.indexOf('trait:') === 0) {
            var trait = key.slice(6);
            var input = form.querySelector('[data-pf-trait="' + trait + '"]');
            if (input) {
                input.checked = false;
            }
        }
    }

    function resetFilters() {
        form.reset();
        quizAnswers = {};
        if (quizRoot) {
            quizRoot.classList.remove('is-complete');
            quizSummary.hidden = true;
            quizPanels.forEach(function (panel, index) {
                panel.classList.toggle('is-active', index === 0);
                panel.hidden = index !== 0;
            });
            quizDots.forEach(function (dot, index) {
                dot.classList.toggle('is-active', index === 0);
                dot.classList.remove('is-done');
            });
            quizRoot.querySelectorAll('.demo-pf-quiz__option.is-selected').forEach(function (btn) {
                btn.classList.remove('is-selected');
            });
            currentQuizStep = 0;
            updateQuizUi();
        }
        applyFilters();
    }

    function setFormFromMergedFilters(merged) {
        form.reset();

        if (merged.planting) {
            form.querySelector('[data-pf-filter="planting"]').value = merged.planting;
        }

        if (merged.flowering) {
            form.querySelector('[data-pf-filter="flowering"]').value = merged.flowering;
        }

        if (merged.fruiting) {
            form.querySelector('[data-pf-filter="fruiting"]').value = merged.fruiting;
        }

        if (merged.category) {
            form.querySelector('[data-pf-filter="category"]').value = merged.category;
        }

        (merged.traits || []).forEach(function (trait) {
            var input = form.querySelector('[data-pf-trait="' + trait + '"]');
            if (input) {
                input.checked = true;
            }
        });
    }

    function mergeQuizAnswers() {
        var merged = {
            planting: '',
            flowering: '',
            fruiting: '',
            category: '',
            traits: [],
        };

        Object.keys(quizAnswers).forEach(function (stepId) {
            var filters = quizAnswers[stepId];
            if (!filters) {
                return;
            }

            ['planting', 'flowering', 'fruiting', 'category'].forEach(function (key) {
                if (filters[key]) {
                    merged[key] = filters[key];
                }
            });

            if (filters.traits) {
                filters.traits.forEach(function (trait) {
                    if (merged.traits.indexOf(trait) === -1) {
                        merged.traits.push(trait);
                    }
                });
            }
        });

        return merged;
    }

    function showQuizPanel(index) {
        quizPanels.forEach(function (panel, panelIndex) {
            var isActive = panelIndex === index;
            panel.classList.remove('is-exiting');
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;
        });
    }

    function updateQuizUi() {
        if (!quizRoot) {
            return;
        }

        quizStepLabel.textContent = 'Step ' + (currentQuizStep + 1) + ' of ' + quizSteps.length;
        quizBack.hidden = currentQuizStep === 0;
        quizResults.hidden = currentQuizStep !== quizSteps.length - 1;
        quizSkip.hidden = currentQuizStep === quizSteps.length - 1;

        showQuizPanel(currentQuizStep);

        quizDots.forEach(function (dot, index) {
            dot.classList.toggle('is-active', index === currentQuizStep);
            dot.classList.toggle('is-done', index < currentQuizStep);
        });
    }

    function finishQuiz() {
        var merged = mergeQuizAnswers();
        setFormFromMergedFilters(merged);
        var count = applyFilters();

        quizRoot.classList.add('is-complete');
        quizSummary.hidden = false;
        quizSummaryText.textContent = count + ' plant' + (count === 1 ? '' : 's') + ' match your answers. Tweak filters anytime below.';

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function selectQuizOption(button) {
        var stepId = button.dataset.quizStep;
        var panel = button.closest('[data-quiz-panel]');
        panel.querySelectorAll('.demo-pf-quiz__option').forEach(function (option) {
            option.classList.remove('is-selected');
        });
        button.classList.add('is-selected');

        try {
            quizAnswers[stepId] = JSON.parse(button.dataset.quizFilters || '{}');
        } catch (error) {
            quizAnswers[stepId] = {};
        }

        if (currentQuizStep < quizSteps.length - 1) {
            var activePanel = quizPanels[currentQuizStep];
            if (activePanel) {
                activePanel.classList.add('is-exiting');
            }

            window.setTimeout(function () {
                currentQuizStep += 1;
                updateQuizUi();
            }, 280);
        } else {
            quizResults.hidden = false;
        }
    }

    if (quizRoot) {
        quizRoot.addEventListener('click', function (event) {
            var option = event.target.closest('.demo-pf-quiz__option');
            if (option) {
                selectQuizOption(option);
            }
        });

        quizBack.addEventListener('click', function () {
            if (currentQuizStep > 0) {
                currentQuizStep -= 1;
                updateQuizUi();
            }
        });

        quizSkip.addEventListener('click', function () {
            quizAnswers = {};
            finishQuiz();
        });

        quizResults.addEventListener('click', finishQuiz);

        quizRestart.addEventListener('click', function () {
            resetFilters();
            quizRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        updateQuizUi();
    }

    openBtn.addEventListener('click', openFilters);
    closeBtn.addEventListener('click', closeFilters);
    overlay.addEventListener('click', closeFilters);
    applyBtn.addEventListener('click', function () {
        applyFilters();
        closeFilters();
    });
    resetBtn.addEventListener('click', function () {
        window.setTimeout(function () {
            quizAnswers = {};
            applyFilters();
        }, 0);
    });
    emptyResetBtn.addEventListener('click', resetFilters);
    sortSelect.addEventListener('change', applyFilters);

    form.addEventListener('change', function () {
        if (window.matchMedia('(min-width: 960px)').matches) {
            applyFilters();
        }
    });

    activeList.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-remove]');
        if (!button) {
            return;
        }

        clearFilter(button.dataset.remove);
        applyFilters();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && root.classList.contains('is-open')) {
            closeFilters();
        }
    });

    applyFilters();
})();
