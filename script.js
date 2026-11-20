// Product Data matching your 3 TEESKOLAR Figma shirts
const products = [
  {
    id: 1,
    name: "Don't Be Late",
    style: "(Semi-Ringer Tee)",
    sizes: "S, M, L, XL",
    price: 399,
    description: "Maroon semi-ringer tee featuring a classic coffee cup graphic for 7:00 AM lecture survivors.",
    svg: `<svg viewBox="0 0 200 180" width="165" height="165">
            <path d="M55,25 L75,20 Q100,32 125,20 L145,25 L175,55 L155,75 L140,60 L140,160 L60,160 L60,60 L45,75 L25,55 Z" fill="#6b2323"/>
            <path d="M75,20 Q100,34 125,20" fill="none" stroke="#f3e5ab" stroke-width="4"/>
            <text x="100" y="65" text-anchor="middle" fill="#f3e5ab" font-size="11" font-weight="bold">DON'T</text>
            <text x="100" y="78" text-anchor="middle" fill="#f3e5ab" font-size="11" font-weight="bold">BE LATE</text>
            <rect x="85" y="92" width="30" height="24" rx="4" fill="#d2a679"/>
            <ellipse cx="100" cy="118" rx="22" ry="4" fill="#ffffff"/>
          </svg>`
  },
  {
    id: 2,
    name: "Everyday Comfort",
    style: "(Crew Neck T-Shirt)",
    sizes: "S, M, L, XL",
    price: 349,
    description: "Soft tie-dye inspired sunset gradient crew neck made for all-day library study sessions.",
    svg: `<svg viewBox="0 0 200 180" width="165" height="165">
            <defs>
              <radialGradient id="sunsetGrad" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="#ff6b6b"/>
                <stop offset="60%" stop-color="#ffa94d"/>
                <stop offset="100%" stop-color="#f1f3f5"/>
              </radialGradient>
            </defs>
            <path d="M55,25 L75,20 Q100,32 125,20 L145,25 L175,55 L155,75 L140,60 L140,160 L60,160 L60,60 L45,75 L25,55 Z" fill="url(#sunsetGrad)"/>
            <text x="100" y="88" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">EVERYDAY</text>
            <text x="100" y="101" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">COMFORT</text>
          </svg>`
  },
  {
    id: 3,
    name: "Do Good Work",
    style: "(Baggy T-Shirt)",
    sizes: "S, M, L, XL",
    price: 449,
    description: "Relaxed pastel yellow oversized tee with a cheerful mascot reminder to keep pushing forward.",
    svg: `<svg viewBox="0 0 200 180" width="165" height="165">
            <path d="M50,25 L75,20 Q100,32 125,20 L150,25 L182,60 L160,82 L144,65 L144,162 L56,162 L56,65 L40,82 L18,60 Z" fill="#f7e396"/>
            <circle cx="100" cy="95" r="22" fill="#f5b041"/>
            <text x="100" y="65" text-anchor="middle" fill="#b7791f" font-size="10" font-weight="bold">DO GOOD WORK</text>
          </svg>`
  }
];

let selectedProduct = null;
let currentQty = 1;

// Render product cards into both Home and Shop grids
function renderProducts(list) {
  const grids = [document.getElementById("homeProductGrid"), document.getElementById("shopProductGrid")];

  grids.forEach(grid => {
    if (!grid) return;
    grid.innerHTML = list.map(item => `
      <div class="product-card-wrapper" onclick="openOrderModal(${item.id})">
        <div class="arch-card">
          <div class="arch-inner">${item.svg}</div>
          <h3>${item.name}</h3>
          <p>${item.style}</p>
        </div>
        <div class="card-pills">
          <div class="pill">Size: ${item.sizes}</div>
          <div class="pill">Price: ₱${item.price}</div>
        </div>
      </div>
    `).join("");
  });
}

// Navigation between Home, Shop, Privacy, and Contact Us
function navigateTo(pageId) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(`page-${pageId}`).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Live Search Filter
function filterProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) || p.style.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}

// Interactive Order Modal
function openOrderModal(productId) {
  selectedProduct = products.find(p => p.id === productId);
  currentQty = 1;

  document.getElementById("modalTitle").textContent = selectedProduct.name;
  document.getElementById("modalSubtitle").textContent = selectedProduct.style;
  document.getElementById("modalDesc").textContent = selectedProduct.description;
  document.getElementById("orderQty").textContent = currentQty;
  updateModalTotal();

  document.getElementById("orderModal").classList.add("open");
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.remove("open");
}

function closeModalOnOutside(event) {
  if (event.target.id === "orderModal") closeOrderModal();
}

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById("orderQty").textContent = currentQty;
  updateModalTotal();
}

function updateModalTotal() {
  if (!selectedProduct) return;
  document.getElementById("modalTotal").textContent = `₱${selectedProduct.price * currentQty}`;
}

function submitOrder(event) {
  event.preventDefault();
  const size = document.getElementById("orderSize").value;
  const buyer = document.getElementById("buyerName").value;
  closeOrderModal();
  showToast(`Order placed! ${currentQty}x ${selectedProduct.name} (${size}) for ${buyer}.`);
  document.getElementById("orderForm").reset();
}

// Contact Form Submission
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value;
  showToast(`Thank you, ${name}! Your message has been sent to TEESKOLAR.`);
  document.getElementById("contactForm").reset();
}

// Toast Notification Helper
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

// Initialize products on load
renderProducts(products);
