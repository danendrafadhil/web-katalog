const STORE_WHATSAPP = "+62-838-7996-1309";

const products = [
  {
    id: "ps5-pro",
    name: "PlayStation 5 Pro",
    category: "console",
    categoryLabel: "Konsol",
    image: "ps5 pro.jpg",
    price: 13_599_000,
    badge: "PERFORMA MAKSIMAL",
    description: "Konsol PlayStation generasi terbaru dengan detail visual lebih tajam dan pengalaman bermain yang makin imersif.",
    features: ["Penyimpanan SSD 2 TB", "Mendukung fitur visual PlayStation terbaru", "Termasuk kontroler DualSense"]
  },
  {
    id: "ps5-slim-disc",
    name: "PS5 Slim Disc Edition",
    category: "console",
    categoryLabel: "Konsol",
    image: "ps5 slim disc.jpg",
    price: 8_699_000,
    badge: "BEST SELLER",
    description: "Pengalaman bermain PlayStation 5 dalam desain lebih ringkas, lengkap dengan drive untuk koleksi game fisik.",
    features: ["Drive Blu-ray Ultra HD", "Penyimpanan SSD 1 TB", "Kontroler DualSense termasuk"]
  },
  {
    id: "ps5-digital",
    name: "PS5 Slim Digital Edition",
    category: "console",
    categoryLabel: "Konsol",
    image: "ps5 digital.jpg",
    price: 7_299_000,
    badge: "DIGITAL EDITION",
    description: "Konsol ringkas untuk menikmati game digital dengan waktu loading cepat dan visual yang memukau.",
    features: ["Desain ramping dan modern", "Penyimpanan SSD 1 TB", "Bisa menambah drive disc terpisah"]
  },
  {
    id: "ps5-wolverine",
    name: "PS5 Edisi Wolverine",
    category: "special",
    categoryLabel: "Edisi spesial",
    image: "ps5 wolverine.jpg",
    price: 13_999_000,
    badge: "EDISI SPESIAL",
    description: "Tampilan konsol dengan desain bertema Wolverine untuk melengkapi koleksi dan setup gaming-mu.",
    features: ["Desain konsol bertema Wolverine", "Termasuk kontroler senada", "Ketersediaan dan isi paket perlu dikonfirmasi"]
  },
  {
    id: "ps-vr2",
    name: "PlayStation VR2",
    category: "accessory",
    categoryLabel: "Aksesori",
    image: "ps5 vr.jpg",
    price: 7_999_000,
    badge: "MASUK KE DALAM GAME",
    description: "Headset realitas virtual untuk menjelajahi dunia game dengan sensasi yang terasa lebih dekat.",
    features: ["Visual OLED beresolusi tinggi", "Pelacakan mata dan fitur sensor gerak", "Termasuk dua kontroler PS VR2 Sense"]
  },
  {
    id: "ps-portal",
    name: "PlayStation Portal",
    category: "accessory",
    categoryLabel: "Aksesori",
    image: "ps portal.jpg",
    price: 3_799_000,
    badge: "MAIN LEBIH FLEKSIBEL",
    description: "Perangkat remote player dengan layar dan kontroler menyatu untuk menikmati game PS5 lewat Wi-Fi.",
    features: ["Layar LCD 8 inci", "Kontroler dengan fitur DualSense", "Memerlukan PS5 dan koneksi Wi-Fi"]
  },
  {
    id: "pulse-3d",
    name: "Pulse 3D Wireless Headset",
    category: "accessory",
    categoryLabel: "Aksesori",
    image: "pulse 3d.jpg",
    price: 1_599_000,
    badge: "DENGAR TIAP DETAIL",
    description: "Headset nirkabel yang dirancang untuk menemani sesi bermain dan membantu menangkap detail audio game.",
    features: ["Desain over-ear yang nyaman", "Mikrofon ganda dengan peredam bising", "Koneksi nirkabel untuk PS5"]
  },
  {
    id: "dualsense",
    name: "DualSense Wireless Controller",
    category: "accessory",
    categoryLabel: "Aksesori",
    image: "dualsense controller.jpg",
    price: 1_099_000,
    badge: "GEAR ESENSIAL",
    description: "Kontroler dengan umpan balik haptik dan adaptive trigger untuk merasakan aksi game dengan cara berbeda.",
    features: ["Haptic feedback imersif", "Adaptive trigger yang responsif", "Mikrofon dan speaker terintegrasi"]
  },
  {
    id: "vertical-stand",
    name: "Vertical Stand PS5",
    category: "accessory",
    categoryLabel: "Aksesori",
    image: "stand ps5.jpg",
    price: 399_000,
    badge: "SETUP LEBIH RAPI",
    description: "Dudukan untuk menempatkan konsol PS5 secara vertikal sekaligus menjaga tampilan setup tetap rapi.",
    features: ["Membantu menopang konsol secara vertikal", "Desain minimalis warna hitam", "Pastikan kompatibilitas dengan model konsol"]
  }
];

const money = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});
const productGrid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#product-search");
const sortSelect = document.querySelector("#sort-products");
const cartDrawer = document.querySelector("#cart-drawer");
const cartItemsElement = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const overlay = document.querySelector("#overlay");
const productDialog = document.querySelector("#product-dialog");
const orderDialog = document.querySelector("#order-dialog");
const toast = document.querySelector("#toast");
const cart = new Map();
let activeFilter = "all";
let toastTimer;

function imagePath(filename) {
  return `../image/${encodeURIComponent(filename)}`;
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("id-ID");
  const filtered = products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.description} ${product.categoryLabel}`
      .toLocaleLowerCase("id-ID")
      .includes(query);
    return matchesFilter && matchesSearch;
  });

  switch (sortSelect.value) {
    case "price-low":
      return filtered.sort((a, b) => a.price - b.price);
    case "price-high":
      return filtered.sort((a, b) => b.price - a.price);
    case "name":
      return filtered.sort((a, b) => a.name.localeCompare(b.name, "id"));
    default:
      return filtered;
  }
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <button class="product-image-wrap" type="button" data-detail="${product.id}" aria-label="Lihat detail ${product.name}">
        <span class="product-badge">${product.badge}</span>
        <img src="${imagePath(product.image)}" alt="${product.name}" loading="lazy">
        <span class="quick-view" aria-hidden="true">↗</span>
      </button>
      <p class="product-category">${product.categoryLabel}</p>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-card-bottom">
        <span class="product-price">${money.format(product.price)}</span>
        <button class="add-button" type="button" data-add="${product.id}" aria-label="Tambah ${product.name} ke keranjang">+</button>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visibleProducts.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
  showToast(`${product.name} ditambahkan ke keranjang.`);
}

function renderCart() {
  const items = [...cart.entries()];
  const totalQuantity = items.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = items.reduce((sum, [productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return sum + product.price * quantity;
  }, 0);

  document.querySelector("#cart-count").textContent = totalQuantity;
  cartEmpty.hidden = items.length > 0;
  cartSummary.hidden = items.length === 0;
  cartItemsElement.innerHTML = items.map(([productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return `
      <article class="cart-item">
        <img src="${imagePath(product.image)}" alt="">
        <div>
          <h3 class="cart-item-name">${product.name}</h3>
          <span class="cart-item-price">${money.format(product.price)}</span>
          <div class="quantity-control" aria-label="Jumlah ${product.name}">
            <button type="button" data-decrease="${product.id}" aria-label="Kurangi jumlah">−</button>
            <span>${quantity}</span>
            <button type="button" data-increase="${product.id}" aria-label="Tambah jumlah">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Hapus ${product.name}">×</button>
      </article>
    `;
  }).join("");
  document.querySelector("#cart-subtotal").textContent = money.format(subtotal);
}

function openCart() {
  overlay.hidden = false;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.querySelector("#open-cart").setAttribute("aria-expanded", "true");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  document.querySelector("#open-cart").setAttribute("aria-expanded", "false");
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains("is-open")) overlay.hidden = true;
  }, 250);
}

function openProductDetails(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  document.querySelector("#dialog-content").innerHTML = `
    <div class="dialog-image"><img src="${imagePath(product.image)}" alt="${product.name}"></div>
    <div class="dialog-info">
      <p class="product-category">${product.categoryLabel} · ${product.badge}</p>
      <h2 id="dialog-title">${product.name}</h2>
      <p class="dialog-description">${product.description}</p>
      <p class="dialog-price">${money.format(product.price)}</p>
      <h3>Detail produk</h3>
      <ul class="dialog-features">${product.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
      <button class="primary-button dialog-add" type="button" data-add="${product.id}">Tambah ke keranjang <span aria-hidden="true">＋</span></button>
    </div>
  `;
  productDialog.showModal();
}

function makeOrderMessage() {
  const lines = [...cart.entries()].map(([productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return `- ${product.name} x${quantity}: ${money.format(product.price * quantity)}`;
  });
  const subtotal = [...cart.entries()].reduce((sum, [productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return sum + product.price * quantity;
  }, 0);
  return [
    "Halo PS Store, saya ingin memesan:",
    "",
    ...lines,
    "",
    `Subtotal: ${money.format(subtotal)}`,
    "",
    "Mohon konfirmasi stok, harga akhir, ongkir, dan cara pembayaran. Terima kasih."
  ].join("\n");
}

function openOrderDialog() {
  const message = makeOrderMessage();
  document.querySelector("#order-message").textContent = message;
  const whatsappLink = document.querySelector("#whatsapp-order");
  const whatsappNote = document.querySelector("#whatsapp-note");
  const storeNumber = STORE_WHATSAPP.replace(/\D/g, "");
  if (storeNumber) {
    whatsappLink.href = `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;
    whatsappLink.hidden = false;
    whatsappNote.textContent = "Harga yang tercantum adalah referensi. Toko akan mengonfirmasi detail pesanan sebelum pembayaran.";
  } else {
    whatsappLink.hidden = true;
    whatsappNote.textContent = "Nomor WhatsApp toko belum diatur. Isi STORE_WHATSAPP di script.js agar tombol pesan langsung membuka chat toko.";
  }
  orderDialog.showModal();
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const detailButton = event.target.closest("[data-detail]");
  if (addButton) addToCart(addButton.dataset.add);
  if (detailButton) openProductDetails(detailButton.dataset.detail);
});
document.querySelector("#dialog-content").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;
  addToCart(addButton.dataset.add);
  productDialog.close();
});
document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#checkout-button").addEventListener("click", openOrderDialog);
document.querySelector("#copy-order").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector("#order-message").textContent);
    showToast("Ringkasan pesanan berhasil disalin.");
  } catch (error) {
    console.error("Tidak dapat menyalin ringkasan pesanan:", error);
    showToast("Gagal menyalin. Silakan salin teks pesanan secara manual.");
  }
});
cartItemsElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const productId = button.dataset.increase || button.dataset.decrease || button.dataset.remove;
  if (!productId || !cart.has(productId)) return;
  if (button.dataset.remove !== undefined) {
    cart.delete(productId);
  } else {
    const quantity = cart.get(productId) + (button.dataset.increase !== undefined ? 1 : -1);
    if (quantity <= 0) cart.delete(productId);
    else cart.set(productId, quantity);
  }
  renderCart();
});
overlay.addEventListener("click", closeCart);
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.closest("dialog")) button.closest("dialog").close();
    else closeCart();
  });
});
[productDialog, orderDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
