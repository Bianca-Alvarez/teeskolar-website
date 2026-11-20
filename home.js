const homeProducts = [
  {
    id: 1,
    name: "Don't Be Late",
    style: "(Semi-Ringer Tee)",
    sizes: "S, M, L, XL",
    price: "₱399",
    image: "images/shirt1.png"
  },
  {
    id: 2,
    name: "Everyday Comfort",
    style: "(Crew Neck T-Shirt)",
    sizes: "S, M, L, XL",
    price: "₱349",
    image: "images/shirt2.png"
  },
  {
    id: 3,
    name: "Do Good Work",
    style: "(Baggy T-Shirt)",
    sizes: "S, M, L, XL",
    price: "₱449",
    image: "images/shirt3.png"
  }
];

function renderHomeProducts(list) {
  const grid = document.getElementById("homeProductGrid");
  if (!grid) return;

  grid.innerHTML = list.map(item => `
    <div class="product-card-wrapper" onclick="selectProduct(${item.id})">
      <div class="arch-card">
        <div class="arch-inner">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <h3>${item.name}</h3>
        <p>${item.style}</p>
      </div>
      <div class="card-pills">
        <div class="pill">Size: ${item.sizes}</div>
        <div class="pill">Price: ${item.price}</div>
      </div>
    </div>
  `).join("");
}

function filterHomeProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = homeProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.style.toLowerCase().includes(query)
  );
  renderHomeProducts(filtered);
}

function selectProduct(productId) {
  window.location.href = `shop.html?product=${productId}`;
}

// Render cards on initial load
renderHomeProducts(homeProducts);
