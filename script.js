// NovaCart — Project 05: Mini E-Commerce App
// Product data is stored as JavaScript objects, as required by the project guide.
const products = [
  { id: 1, name: "Everyday Notebook", price: 180, category: "Desk", emoji: "📓", bg: "#e9e6d9", tag: "BESTSELLER" },
  { id: 2, name: "Studio Pen Set", price: 120, category: "Desk", emoji: "🖊️", bg: "#e8e9df", tag: "DESK FAVOURITE" },
  { id: 3, name: "Sunday Ceramic Mug", price: 320, category: "Home", emoji: "☕", bg: "#eee1d5", tag: "MADE FOR SLOW MORNINGS" },
  { id: 4, name: "Soft Glow Lamp", price: 850, category: "Home", emoji: "💡", bg: "#e6e9dc", tag: "JUST ARRIVED" },
  { id: 5, name: "Daily Tote Bag", price: 450, category: "Accessories", emoji: "👜", bg: "#e9e2d8", tag: "EVERYDAY ESSENTIAL" },
  { id: 6, name: "Pocket Planner", price: 150, category: "Desk", emoji: "📔", bg: "#e7e9e1", tag: "SMALL & MIGHTY" },
  { id: 7, name: "Cloud Cushion", price: 690, category: "Home", emoji: "🛋️", bg: "#e9e4dc", tag: "COMFORT PICK" },
  { id: 8, name: "Classic Bottle", price: 280, category: "Accessories", emoji: "🧴", bg: "#e0e9e5", tag: "ON THE GO" }
];

const CART_KEY = "novacart-project-05-cart";
const money = amount => amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
let cart = loadCart();
let activeCategory = "All";

const productGrid = document.getElementById("product-grid");
const cartDrawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const toast = document.getElementById("toast");

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function renderProducts() {
  const sort = document.getElementById("sort-select").value;
  let visible = products.filter(product => activeCategory === "All" || product.category === activeCategory);
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-visual" style="--product-bg:${product.bg}">
        <span class="product-tag">${product.tag}</span>
        <span class="product-art" aria-hidden="true">${product.emoji}</span>
        <button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button>
      </div>
      <div class="product-info">
        <div><p class="product-category">${product.category}</p><h3 class="product-name">${product.name}</h3></div>
        <p class="product-price">${money(product.price)}</p>
      </div>
    </article>
  `).join("");
  document.getElementById("all-count").textContent = products.length;
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  showToast(`${product.name} added to your cart`);
}

function changeQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  showToast("Item removed from your cart");
}

function calculateTotals() {
  const subtotal = Object.keys(cart).reduce((sum, id) => {
    const product = products.find(item => item.id === Number(id));
    return sum + (product ? product.price * cart[id] : 0);
  }, 0);
  // Project guide rule: ₹40 delivery for orders below ₹500; free above that.
  const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;
  return { subtotal, delivery, total: subtotal + delivery };
}

function renderCart() {
  const entries = Object.entries(cart).filter(([id, quantity]) =>
    products.some(product => product.id === Number(id)) && Number.isInteger(quantity) && quantity > 0
  );
  cart = Object.fromEntries(entries);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  document.getElementById("cart-count").textContent = itemCount;
  document.getElementById("drawer-count").textContent = `(${itemCount})`;

  if (!entries.length) {
    cartItems.innerHTML = `<div class="empty-cart"><div class="empty-icon">▢</div><strong>Your cart is taking a little break.</strong><br>Add something lovely from the collection.</div>`;
  } else {
    cartItems.innerHTML = entries.map(([id, quantity]) => {
      const product = products.find(item => item.id === Number(id));
      return `<div class="cart-row">
        <div class="cart-thumb" style="--product-bg:${product.bg}">${product.emoji}</div>
        <div><div class="cart-product-name">${product.name}</div><div class="cart-product-price">${money(product.price)} each</div>
          <div class="quantity-control"><button data-quantity="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${quantity}</span><button data-quantity="${id}" data-delta="1" aria-label="Increase quantity">+</button></div>
          <button class="remove-button" data-remove="${id}">Remove</button>
        </div>
        <strong class="cart-product-price">${money(product.price * quantity)}</strong>
      </div>`;
    }).join("");
  }

  const totals = calculateTotals();
  document.getElementById("subtotal").textContent = money(totals.subtotal);
  document.getElementById("delivery").textContent = totals.delivery === 0 && totals.subtotal > 0 ? "FREE" : money(totals.delivery);
  document.getElementById("grand-total").textContent = money(totals.total);
  document.getElementById("delivery-hint").textContent = totals.subtotal === 0
    ? "Add an item to see your delivery estimate."
    : totals.subtotal < 500
      ? `You're ${money(500 - totals.subtotal)} away from free delivery.`
      : "You've unlocked free delivery. Lovely!";
  document.getElementById("checkout-button").disabled = itemCount === 0;
  document.getElementById("checkout-button").style.opacity = itemCount === 0 ? ".45" : "1";
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2100);
}

function openCheckoutPreview() {
  if (!Object.keys(cart).length) return;
  const totals = calculateTotals();
  const lines = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(item => item.id === Number(id));
    return `<div class="preview-line"><span>${product.name} × ${quantity}</span><strong>${money(product.price * quantity)}</strong></div>`;
  }).join("");
  document.getElementById("order-preview").innerHTML = `${lines}
    <div class="preview-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
    <div class="preview-line"><span>Delivery</span><strong>${totals.delivery ? money(totals.delivery) : "FREE"}</strong></div>`;
  document.getElementById("preview-total").textContent = money(totals.total);
  closeCart();
  document.getElementById("checkout-dialog").showModal();
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.delta));
  if (removeButton) removeItem(removeButton.dataset.remove);
});
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});
document.getElementById("sort-select").addEventListener("change", renderProducts);
document.getElementById("cart-trigger").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout-button").addEventListener("click", openCheckoutPreview);
document.getElementById("close-dialog").addEventListener("click", () => document.getElementById("checkout-dialog").close());
document.getElementById("finish-demo").addEventListener("click", () => document.getElementById("checkout-dialog").close());
document.getElementById("checkout-dialog").addEventListener("click", event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

renderProducts();
renderCart();
