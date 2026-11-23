// EXERCISE 9 Path A — fetch products from Web API (no full page reload)

async function loadProducts() {
  const root = document.getElementById('products-root');
  root.textContent = 'Loading…';

  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();

    if (!items.length) {
      root.innerHTML = '<p class="text-muted">No products.</p>';
      return;
    }

    const rows = items.map((p) => `
      <tr>
        <td><code>${escapeHtml(p.sku)}</code></td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td class="text-end">£${Number(p.price).toFixed(2)}</td>
        <td class="text-end">${p.stock}</td>
      </tr>`).join('');

    root.innerHTML = `
      <table class="table table-sm table-hover">
        <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th class="text-end">Price</th><th class="text-end">Stock</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  } catch (err) {
    root.innerHTML = `<p class="text-danger">Failed to load: ${escapeHtml(String(err))}</p>`;
  }
}

async function createProduct(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    sku: form.sku.value,
    name: form.name.value,
    category: form.category.value,
    price: Number(form.price.value),
    stock: Number(form.stock.value),
  };

  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    alert(`Create failed (${res.status}): ${body}`);
    return;
  }

  form.reset();
  await loadProducts();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  const form = document.getElementById('create-form');
  if (form) form.addEventListener('submit', createProduct);
});
