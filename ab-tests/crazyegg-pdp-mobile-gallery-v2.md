# Crazy Egg — PDP Mobile Gallery v2

**Files:** `crazyegg-pdp-mobile-gallery-v2.css` + `crazyegg-pdp-mobile-gallery-v2.js`  
**Example:** https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection  
**Audience:** Mobile (CE). JS injects CSS (self-contained).

## Layout

1. Hero gallery  
2. Title (centered, full width)  
3. Reviews (centered)  
4. Price / Club / Add to Basket  
5. PayPal text  
6. **Key Features rail** (3 visible + peek, lime green band, swipe/drag)  
7. Bullet points  

## Crazy Egg setup

1. Matching URL: `yougarden.com/item-*`
2. Audience: **Mobile**
3. Custom CSS → `crazyegg-pdp-mobile-gallery-v2.css`
4. Custom JS → `crazyegg-pdp-mobile-gallery-v2.js`
5. Replace both, hard-refresh preview

## QA

- [ ] Title + reviews centered
- [ ] KF icons sit **below PayPal**, above bullets
- [ ] Max ~3 icons visible; 4th peeks
- [ ] Lime green band behind icons (Magento-style)
- [ ] Swipe / drag scrolls through icons
- [ ] Mid-page Key Features gone
