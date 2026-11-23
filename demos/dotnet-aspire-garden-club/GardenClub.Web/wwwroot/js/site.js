(() => {
    const body = document.body;
    const clubToggle = document.getElementById("club-member");
    const dialog = document.getElementById("interest-dialog");
    const form = document.getElementById("interest-form");
    const emailInput = document.getElementById("interest-email");
    const statusEl = document.getElementById("dialog-status");
    const plantNameEl = document.getElementById("dialog-plant-name");
    let activeSku = null;

    function syncClubMode() {
        body.classList.toggle("is-club", Boolean(clubToggle?.checked));
    }

    clubToggle?.addEventListener("change", syncClubMode);
    syncClubMode();

    document.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter") || "all";
            document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
            document.querySelectorAll(".plant-card").forEach((card) => {
                const cat = card.getAttribute("data-category");
                card.hidden = filter !== "all" && cat !== filter;
            });
        });
    });

    document.querySelectorAll("[data-interest]").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeSku = btn.getAttribute("data-interest");
            const card = btn.closest(".plant-card");
            plantNameEl.textContent = card?.querySelector(".plant-card__name")?.textContent || activeSku;
            statusEl.hidden = true;
            statusEl.textContent = "";
            emailInput.value = "";
            dialog?.showModal();
            emailInput.focus();
        });
    });

    form?.addEventListener("submit", async (event) => {
        const submitter = event.submitter;
        const value = submitter?.getAttribute("value");
        if (value === "cancel" || !activeSku) {
            return;
        }

        event.preventDefault();
        const email = emailInput.value.trim();
        if (!email) {
            return;
        }

        try {
            const res = await fetch("/api/interest", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    email,
                    sku: activeSku,
                    clubMember: Boolean(clubToggle?.checked),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                statusEl.hidden = false;
                statusEl.textContent = data.error || "Could not save interest.";
                return;
            }
            statusEl.hidden = false;
            statusEl.textContent = data.message || "Saved.";
            setTimeout(() => dialog?.close(), 1200);
        } catch {
            statusEl.hidden = false;
            statusEl.textContent = "Network error — try again.";
        }
    });
})();
