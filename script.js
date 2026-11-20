const products = [
  {
    id: 1,
    name: "Don't Be Late",
    style: "(Semi-Ringer Tee)",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon"],
    price: 399,
    image: "images/shirt1.png",
    description: "Maroon semi-ringer tee featuring a classic coffee cup graphic inspired by early-morning UP Diliman classes. Made with breathable cotton blend for everyday campus wear."
  },
  {
    id: 2,
    name: "Everyday Comfort",
    style: "(Crew Neck T-Shirt)",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sunset Tie-Dye"],
    price: 349,
    image: "images/shirt2.png",
    description: "Soft sunset-gradient crew neck t-shirt built for maximum comfort during long library study sessions and casual campus walks."
  },
  {
    id: 3,
    name: "Do Good Work",
    style: "(Baggy T-Shirt)",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pastel Yellow"],
    price: 449,
    image: "images/shirt3.png",
    description: "Relaxed oversized pastel yellow t-shirt with a cheerful mascot reminder to keep doing good work every day."
  }
];



const itemQuantities = { 1: 1, 2: 1, 3: 1 };
let activeOrderSummary = "";

function buildArchCardHTML(item, clickable = true) {
  const clickAttr = clickable ? `onclick="openProductDetail(${item.id})"` : "";
  return `
    <div class="product-card-wrapper" ${clickAttr}>
      <div class="arch-card">
        <div class="arch-inner">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <h3>${item.name}</h3>
        <p>${item.style}</p>
      </div>
      <div class="card-pills">
        <div class="pill">Size: ${item.sizes.join(", ")}</div>
        <div class="pill">Price: ₱${item.price}</div>
      </div>
    </div>
  `;
}

function buildShopRowHTML(item, prefix) {
  const qty = itemQuantities[item.id] || 1;
  return `
    <div class="shop-item-row">
      ${buildArchCardHTML(item, false)}
      <div class="shop-right-panel">
        <div class="desc-box">
          <strong>Product description:</strong><br>
          ${item.description}
        </div>

        <div class="options-bar-row">
          <div class="options-teal-box">
            <span>Select size and color:</span>
            <div class="select-group">
              <select id="${prefix}-size-${item.id}">
                ${item.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
              </select>
              <select id="${prefix}-color-${item.id}">
                ${item.colors.map(c => `<option value="${c}">${c}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="qty-control">
            <button type="button" class="qty-btn" onclick="updateItemQty(${item.id}, -1, '${prefix}')">−</button>
            <span class="qty-display" id="${prefix}-qty-${item.id}">${qty}</span>
            <button type="button" class="qty-btn" onclick="updateItemQty(${item.id}, 1, '${prefix}')">+</button>
          </div>
        </div>

        <button type="button" class="order-action-btn" onclick="triggerOrderModal(${item.id}, '${prefix}')">
          Order Button
        </button>
      </div>
    </div>
  `;
}



function renderAllViews(list = products) {
  const homeGrid = document.getElementById("homeProductGrid");
  const shopList = document.getElementById("shopVerticalList");

  if (homeGrid) {
    homeGrid.innerHTML = list.map(item => buildArchCardHTML(item, true)).join("");
  }
  if (shopList) {
    shopList.innerHTML = list.map(item => buildShopRowHTML(item, "shop")).join("");
  }
}



function openProductDetail(productId) {
  const item = products.find(p => p.id === productId);
  if (!item) return;

  document.getElementById("singleProductContainer").innerHTML = buildShopRowHTML(item, "detail");
  navigateTo("detail");
}



function updateItemQty(productId, delta, prefix) {
  itemQuantities[productId] = Math.max(1, (itemQuantities[productId] || 1) + delta);
  const qtyEl = document.getElementById(`${prefix}-qty-${productId}`);
  if (qtyEl) qtyEl.textContent = itemQuantities[productId];
}


function triggerOrderModal(productId, prefix) {
  const item = products.find(p => p.id === productId);
  const size = document.getElementById(`${prefix}-size-${productId}`).value;
  const color = document.getElementById(`${prefix}-color-${productId}`).value;
  const qty = itemQuantities[productId] || 1;
  const total = item.price * qty;

  activeOrderSummary = `${qty}x ${item.name} (${size}, ${color}) — Total: ₱${total}`;
  document.getElementById("modalSummaryText").textContent = activeOrderSummary;
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
  const buyer = document.getElementById("buyerName").value;
  closeOrderModal();
  showToast(`Order request submitted for ${buyer}! (${activeOrderSummary})`);
  document.getElementById("orderForm").reset();
}


function navigateTo(pageId) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(`page-${pageId}`).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}


function filterProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) || p.style.toLowerCase().includes(query)
  );
  renderAllViews(filtered);
}


function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value;
  showToast(`Thank you, ${name}! Your message has been sent to TEESKOLAR.`);
  document.getElementById("contactForm").reset();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}


renderAllViews();
