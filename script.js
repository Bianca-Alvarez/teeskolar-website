const products = [
  {
    id: 1,
    name: "Don't Be Late",
    style: "(Semi-Ringer Tee)",
    sizes: "S, M, L, XL",
    color: "Maroon",
    price: 399,
    image: "images/shirt1.png",
    description: "Maroon semi-ringer tee featuring a classic coffee cup graphic inspired by scholars rushing to make their morning class."
  },
  {
    id: 2,
    name: "Everyday Comfort",
    style: "(Crew Neck T-Shirt)",
    sizes: "S, M, L, XL",
    color: "Sunset Tie-Dye",
    price: 349,
    image: "images/shirt2.png",
    description: "Soft sunset-gradient crew neck t-shirt made for relaxed everyday campus wear and long study sessions."
  },
  {
    id: 3,
    name: "Do Good Work",
    style: "(Baggy T-Shirt)",
    sizes: "S, M, L, XL",
    color: "Pastel Yellow",
    price: 449,
    image: "images/shirt3.png",
    description: "Oversized pastel yellow baggy t-shirt with a cheerful mascot reminder to always do good work."
  }
];

const quantities = { 1: 1, 2: 1, 3: 1 };
let selectedProductForOrder = null;

// Arched card + Size & Price pills (Matches all Figma product cards)
function buildArchCard(item) {
  return `
    <div class="arch-card" onclick="openSingleProduct(${item.id})">
      <div class="arch-inner">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <h3>${item.name}</h3>
      <p>${item.style}</p>
    </div>
    <div class="card-pills">
      <div class="pill">Size: ${item.sizes}</div>
      <div class="pill">Price: ₱${item.price}</div>
    </div>
  `;
}

// Render Home & Shop Grids
function renderGrids(list = products) {
  const homeGrid = document.getElementById("homeProductGrid");
  const shopGrid = document.getElementById("shopProductGrid");

  if (homeGrid) {
    homeGrid.innerHTML = list.map(item => `
      <div class="product-col-item">
        ${buildArchCard(item)}
      </div>
    `).join("");
  }

  if (shopGrid) {
    shopGrid.innerHTML = list.map(item => `
      <div class="product-col-item">
        ${buildArchCard(item)}
        <div class="shop-card-controls">
          <div class="desc-box">${item.description}</div>
          <div class="options-qty-row">
            <button type="button" class="options-info-btn" onclick="openOrderModal(${item.id})">
              This button shows available quantities, sizes, and colors
            </button>
            <div class="qty-control">
              <button type="button" class="qty-btn" onclick="changeQty(${item.id}, -1, 'shop')">−</button>
              <span class="qty-display" id="shop-qty-${item.id}">${quantities[item.id]}</span>
              <button type="button" class="qty-btn" onclick="changeQty(${item.id}, 1, 'shop')">+</button>
            </div>
          </div>
          <button type="button" class="order-btn" onclick="openOrderModal(${item.id})">Order Button</button>
        </div>
      </div>
    `).join("");
  }
}

// Open Individual Product Slide (Bottom-Middle & Bottom-Right Figma Frames)
function openSingleProduct(productId) {
  const item = products.find(p => p.id === productId);
  if (!item) return;

  document.getElementById("singleProductContainer").innerHTML = `
    <div class="single-product-layout">
      <div class="product-col-item">
        ${buildArchCard(item)}
      </div>
      <div class="single-product-right">
        <div class="desc-box">${item.description}</div>
        <div class="options-qty-row">
          <button type="button" class="options-info-btn" onclick="openOrderModal(${item.id})">
            This button shows available quantities, sizes, and colors
          </button>
          <div class="qty-control">
            <button type="button" class="qty-btn" onclick="changeQty(${item.id}, -1, 'detail')">−</button>
            <span class="qty-display" id="detail-qty-${item.id}">${quantities[item.id]}</span>
            <button type="button" class="qty-btn" onclick="changeQty(${item.id}, 1, 'detail')">+</button>
          </div>
        </div>
        <button type="button" class="order-btn" onclick="openOrderModal(${item.id})">Order Button</button>
      </div>
    </div>
  `;

  navigateTo("detail");
}

// Quantity Stepper
function changeQty(productId, delta, prefix) {
  quantities[productId] = Math.max(1, quantities[productId] + delta);
  const shopEl = document.getElementById(`shop-qty-${productId}`);
  const detailEl = document.getElementById(`detail-qty-${productId}`);
  if (shopEl) shopEl.textContent = quantities[productId];
  if (detailEl) detailEl.textContent = quantities[productId];
}

// Order Request Modal
function openOrderModal(productId) {
  selectedProductForOrder = products.find(p => p.id === productId);
  const qty = quantities[productId];
  const total = selectedProductForOrder.price * qty;

  document.getElementById("modalSummaryText").textContent =
    `${qty}x ${selectedProductForOrder.name} — Total: ₱${total} (Available Sizes: ${selectedProductForOrder.sizes})`;
  document.getElementById("modalColor").value = selectedProductForOrder.color;
  document.getElementById("orderModal").classList.add("open");
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.remove("open");
}

function closeModalOnOutside(event) {
  if (event.target.id === "orderModal") closeOrderModal();
}

function submitOrder(event) {
  event.preventDefault();
  const size = document.getElementById("modalSize").value;
  const buyer = document.getElementById("buyerName").value;
  const qty = quantities[selectedProductForOrder.id];

  closeOrderModal();
  showToast(`Order submitted! ${qty}x ${selectedProductForOrder.name} (Size ${size}) for ${buyer}.`);
  document.getElementById("orderForm").reset();
}

// Page Navigation
function navigateTo(pageId) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(`page-${pageId}`).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Search Bar Filter
function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.style.toLowerCase().includes(query)
  );
  renderGrids(filtered);
}

// Contact Form Submission
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value;
  showToast(`Thank you, ${name}! Your message has been sent to TEESKOLAR.`);
  document.getElementById("contactForm").reset();
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

// Initialize
renderGrids();
