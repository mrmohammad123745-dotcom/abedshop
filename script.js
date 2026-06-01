const featuredProductsContainer = document.getElementById("featuredProducts");
const allProductsContainer = document.getElementById("allProducts");
const categoryCardsContainer = document.getElementById("categoryCards");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const emptyState = document.getElementById("emptyState");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const goProducts = document.getElementById("goProducts");

const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const backdrop = document.getElementById("backdrop");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatPrice(price) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.images ? product.images[0] : product.image}"
          alt="${product.name}">
        <span class="product-badge">${product.badge || "ویژه"}</span>
      </div>

      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>

        <div class="product-meta">
          <div class="price">${formatPrice(product.price)}</div>
          <div class="rating">★ ${product.rating}</div>
        </div>

        <div class="product-actions">
          <button class="add-btn" onclick="addToCart(${product.id})">افزودن به سبد</button>
          <button class="detail-btn" onclick="viewProduct(${product.id})">جزئیات</button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  const featured = products.filter(item => item.featured).slice(0, 3);
  featuredProductsContainer.innerHTML = featured.map(renderProductCard).join("");
}

function populateCategories() {
  const categories = [...new Set(products.map(item => item.category))];

  categoryFilter.innerHTML = `<option value="all">همه دسته‌بندی‌ها</option>`;
  categoryFilter.innerHTML += categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");

  const icons = {
    "گجت‌های کاربردی": "🔥",
"لوازم دیجیتال": "📱",
"سرمایشی و گرمایشی": "❄️",
"زیبایی و مراقبت شخصی": "💄",
"سلامت و بانوان": "💖",
"ورزش و سفر": "🏋️"
  };

  categoryCardsContainer.innerHTML = categories.map(cat => `
    <div class="category-card" data-category="${cat}">
      <div class="icon">${icons[cat] || "★"}</div>
      <h3>${cat}</h3>
    </div>
  `).join("");

  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      categoryFilter.value = card.dataset.category;
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      renderAllProducts();
    });
  });
}

function getFilteredProducts() {
  let filtered = [...products];
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  if (query) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }

  if (category !== "all") {
    filtered = filtered.filter(item => item.category === category);
  }

  if (sort === "cheap") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "expensive") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

function renderAllProducts() {
  const filtered = getFilteredProducts();
  allProductsContainer.innerHTML = filtered.map(renderProductCard).join("");
  emptyState.hidden = filtered.length !== 0;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
showToast("✅ محصول به سبد خرید اضافه شد");
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<p style="color:#b8c3d9">سبد خرید شما خالی است.</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <div>${item.name}</div>
          <small>${formatPrice(item.price)} × ${item.quantity}</small>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">حذف</button>
      </div>
    `).join("");
  }

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
}

function openCart() {
  cartDrawer.classList.add("open");
  backdrop.classList.add("show");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("show");
}

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

goProducts.addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", renderAllProducts);
categoryFilter.addEventListener("change", renderAllProducts);
sortFilter.addEventListener("change", renderAllProducts);

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
backdrop.addEventListener("click", closeCartDrawer);

renderFeaturedProducts();
populateCategories();
renderAllProducts();
renderCart();
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}
function viewProduct(id){
    window.location.href = `product.html?id=${id}`;
}
window.addEventListener("scroll", () => {

const scrollTop =
document.documentElement.scrollTop;

const scrollHeight =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

const percent =
(scrollTop / scrollHeight) * 100;

document.getElementById("progressBar")
.style.width = percent + "%";

});
function showToast(message){

const toast =
document.getElementById("toast");

toast.textContent = message;

toast.classList.add("show");

setTimeout(() => {
toast.classList.remove("show");
}, 2500);

}
document.addEventListener("mousemove",(e)=>{

document.querySelectorAll(".product-card").forEach(card=>{

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateY = (x - centerX) / 18;
const rotateX = -(y - centerY) / 18;

if(
x >= 0 &&
y >= 0 &&
x <= rect.width &&
y <= rect.height
){

card.style.transform =
`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-8px)`;

}

});

});
document.querySelectorAll(".product-card")
.forEach(card=>{

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});