/**
 * 212 Club — app.js
 */

/* -----------------------------------------------
   Precios por producto
   ----------------------------------------------- */
const BOTTLE_PRICES = {
  johnnie_black: 85,
  johnnie_blue: 280,
  jack_daniels: 70,
  chivas_12: 90,
  chivas_18: 160,
  grey_goose: 110,
  absolut: 65,
  ciroc: 120,
  bacardi: 60,
  diplomatico: 130,
  zacapa: 150,
  moet: 180,
  veuve: 220,
  dom_perignon: 400,
  patron: 95,
  don_julio: 210,
  otro: 0,
};

/* -----------------------------------------------
   Total
   ----------------------------------------------- */
function recalculateTotal() {
  const rows = document.querySelectorAll('.bottle-row');
  let total = 0;
  rows.forEach(row => {
    const product = row.querySelector('.bottle-product')?.value || '';
    const qty = parseInt(row.querySelector('.bottle-qty')?.value || 1, 10);
    const price = BOTTLE_PRICES[product] || 0;
    total += price * qty;
  });
  const el = document.getElementById('totalDisplay');
  if (el) el.textContent = `$${total.toFixed(2)}`;
}

/* -----------------------------------------------
   Bottle rows
   ----------------------------------------------- */
let bottleIndex = 1;

function buildBottleRow(index) {
  const row = document.createElement('div');
  row.className = 'bottle-row';
  row.dataset.index = index;
  row.innerHTML = `
    <div class="field bottle-product-field">
      <label>Producto <span class="req">*</span></label>
      <div class="select-wrap">
        <select class="bottle-product" required>
          <option value="">Seleccionar…</option>
          <optgroup label="Whisky">
            <option value="johnnie_black" data-price="85">Johnnie Walker Black — $85</option>
            <option value="johnnie_blue" data-price="280">Johnnie Walker Blue — $280</option>
            <option value="jack_daniels" data-price="70">Jack Daniel's — $70</option>
            <option value="chivas_12" data-price="90">Chivas Regal 12 — $90</option>
            <option value="chivas_18" data-price="160">Chivas Regal 18 — $160</option>
          </optgroup>
          <optgroup label="Vodka">
            <option value="grey_goose" data-price="110">Grey Goose — $110</option>
            <option value="absolut" data-price="65">Absolut — $65</option>
            <option value="ciroc" data-price="120">Cîroc — $120</option>
          </optgroup>
          <optgroup label="Ron">
            <option value="bacardi" data-price="60">Bacardí Premium — $60</option>
            <option value="diplomatico" data-price="130">Diplomático — $130</option>
            <option value="zacapa" data-price="150">Ron Zacapa 23 — $150</option>
          </optgroup>
          <optgroup label="Champagne">
            <option value="moet" data-price="180">Moët &amp; Chandon — $180</option>
            <option value="veuve" data-price="220">Veuve Clicquot — $220</option>
            <option value="dom_perignon" data-price="400">Dom Pérignon — $400</option>
          </optgroup>
          <optgroup label="Tequila">
            <option value="patron" data-price="95">Patrón Silver — $95</option>
            <option value="don_julio" data-price="210">Don Julio 1942 — $210</option>
          </optgroup>
          <option value="otro" data-price="0">Otro (indicar en notas)</option>
        </select>
      </div>
    </div>
    <div class="field bottle-qty-field">
      <label>Cantidad</label>
      <div class="qty-control">
        <button type="button" class="qty-btn qty-minus">−</button>
        <input type="number" class="bottle-qty" value="1" min="1" max="20" readonly />
        <button type="button" class="qty-btn qty-plus">+</button>
      </div>
    </div>
    <button type="button" class="remove-row-btn" title="Quitar">✕</button>
  `;
  return row;
}

function updateRemoveButtons() {
  const rows = document.querySelectorAll('.bottle-row');
  rows.forEach(row => {
    const btn = row.querySelector('.remove-row-btn');
    if (btn) btn.style.display = rows.length > 1 ? 'flex' : 'none';
  });
}

function attachRowEvents(row) {
  // product change → recalculate
  row.querySelector('.bottle-product')?.addEventListener('change', recalculateTotal);

  // qty buttons
  row.querySelector('.qty-minus')?.addEventListener('click', () => {
    const inp = row.querySelector('.bottle-qty');
    if (inp && parseInt(inp.value) > 1) {
      inp.value = parseInt(inp.value) - 1;
      recalculateTotal();
    }
  });
  row.querySelector('.qty-plus')?.addEventListener('click', () => {
    const inp = row.querySelector('.bottle-qty');
    if (inp && parseInt(inp.value) < 20) {
      inp.value = parseInt(inp.value) + 1;
      recalculateTotal();
    }
  });

  // remove
  row.querySelector('.remove-row-btn')?.addEventListener('click', () => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(12px)';
    row.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(() => {
      row.remove();
      updateRemoveButtons();
      recalculateTotal();
    }, 200);
  });
}

// Init first row events
document.querySelectorAll('.bottle-row').forEach(row => attachRowEvents(row));

document.getElementById('addBottleBtn')?.addEventListener('click', () => {
  const container = document.getElementById('bottleContainer');
  const row = buildBottleRow(bottleIndex++);
  container.appendChild(row);
  attachRowEvents(row);
  updateRemoveButtons();
  // animate in
  row.style.opacity = '0';
  row.style.transform = 'translateY(-6px)';
  requestAnimationFrame(() => {
    row.style.transition = 'opacity 0.25s, transform 0.25s';
    row.style.opacity = '1';
    row.style.transform = 'translateY(0)';
  });
});

/* -----------------------------------------------
   Notes char counter
   ----------------------------------------------- */
document.getElementById('notes')?.addEventListener('input', function () {
  const c = document.getElementById('notesCount');
  if (c) c.textContent = this.value.length;
});

/* -----------------------------------------------
   Validation
   ----------------------------------------------- */
function setError(inputId, errorId, msg) {
  const el = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (el) el.classList.toggle('invalid', !!msg);
  if (err) err.textContent = msg || '';
}

function clearErrors() {
  document.querySelectorAll('.err').forEach(e => e.textContent = '');
  document.querySelectorAll('.invalid').forEach(e => e.classList.remove('invalid'));
}

function validateForm() {
  clearErrors();
  let ok = true;

  const name = document.getElementById('clientName');
  const table = document.getElementById('tableNumber');

  if (!name?.value.trim()) {
    setError('clientName', 'clientNameError', 'Ingresa tu nombre.');
    ok = false;
  }
  if (!table?.value || parseInt(table.value) < 1) {
    setError('tableNumber', 'tableNumberError', 'Ingresa el número de mesa.');
    ok = false;
  }
  return ok;
}

/* -----------------------------------------------
   Submit
   ----------------------------------------------- */
document.getElementById('orderForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.textContent = 'Enviando…';

  setTimeout(() => {
    const toast = document.getElementById('successToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    }
    btn.classList.remove('loading');
    btn.textContent = 'Enviar Pedido';
  }, 1200);
});

/* -----------------------------------------------
   Reset
   ----------------------------------------------- */
document.getElementById('resetBtn')?.addEventListener('click', () => {
  clearErrors();
  setTimeout(() => {
    recalculateTotal();
    const nc = document.getElementById('notesCount');
    if (nc) nc.textContent = '0';
    // keep only first bottle row
    const container = document.getElementById('bottleContainer');
    const rows = container.querySelectorAll('.bottle-row');
    rows.forEach((r, i) => { if (i > 0) r.remove(); });
    updateRemoveButtons();
  }, 50);
});
