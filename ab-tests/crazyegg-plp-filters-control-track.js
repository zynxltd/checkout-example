<script>
/**
 * GTM Custom HTML - Control PLP filter tracking (simple)
 *
 * Any click on Magento filters → same push as the working console test.
 * Skips drawer Variant (#ce-ff-apply).
 *
 * Triggers (OR): Window Loaded, cookie_consent_statistics, cookie_consent_update
 * GA4 plp_filter_apply ← Custom Event ce_plp_filter_apply
 */
(function () {
  'use strict';

  if (window.__ceYgPlpFilterControlTrack) return;
  window.__ceYgPlpFilterControlTrack = true;

  var last = 0;

  function drawerLive() {
    return !!(
      document.documentElement.classList.contains('ce-yg-plp-filters') ||
      document.getElementById('ce-ff-apply')
    );
  }

  function isFilterTouch(target) {
    if (!target) return false;
    if (target.nodeType === 3) target = target.parentElement;
    if (!target || !target.closest) return false;
    return !!target.closest(
      '#filterForm, .category-filters, .display-filters-wrapper, .filterHead, .filterBlock, label.checkbox-container'
    );
  }

  function fire() {
    var now = Date.now();
    if (now - last < 400) return; // one push per gesture
    last = now;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'ce_plp_filter_apply',
        page_path: location.pathname + location.search
      });
      if (window.console && console.log) {
        console.log('pushed ce_plp_filter_apply');
      }
    } catch (err) { /* ignore */ }
  }

  document.addEventListener(
    'click',
    function (e) {
      if (drawerLive()) return;
      if (!isFilterTouch(e.target)) return;
      fire();
    },
    true
  );
})();
</script>
