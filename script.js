let cart = [];

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
  updateProductCardQuantity(name);
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><span class="item-quantity">${item.quantity}</span>${
      item.name
    }</span>
      <span class="item-price">R$ ${(item.price * item.quantity).toFixed(
        2
      )}</span>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.innerHTML = `
    <div id="cart-total-container">
      <span id="cart-total-label">Total</span>
      <span id="cart-total-value">R$ ${total.toFixed(2)}</span>
    </div>
  `;
}

function createProductCard(product, container) {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
    <div class="image-container">
      <img src="../${product.imagem}" alt="${product.nome}" onerror="this.src='../image/placeholder.png'">
      <div class="cart-controls">
        <button class="cart-button" onclick="handleAddToCart('${product.nome}', '${product.preco}')">
          <img src="../image/icons/carrinho.png" alt="Carrinho" class="cart-icon">
        </button>
      </div>
    </div>
    <div class="product-info">
      <h3>${product.nome}</h3>
      <p class="price">${product.preco}</p>
    </div>
  `;
  container.appendChild(card);
}

function handleAddToCart(name, price) {
  // Certifique-se de que o preço seja um número
  const numericPrice = parseFloat(
    price.toString().replace("R$", "").replace(",", ".")
  );
  addToCart(name, numericPrice);
  updateProductCardQuantity(name);
}

function toggleCartControls(button, name, price) {
  const controls = button.nextElementSibling;
  if (controls.style.display === "none") {
    controls.style.display = "flex";
    addToCart(name, price);
  } else {
    controls.style.display = "none";
    removeAllFromCart(name);
  }
}

function updateQuantity(name, change) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.name !== name);
    }
    updateCart();
    updateProductCardQuantity(name);
  }
}

function updateProductCardQuantity(name) {
  const cards = document.querySelectorAll(".product-card");
  for (const card of cards) {
    const productName = card.querySelector("h3").textContent;
    if (productName === name) {
      const cartControls = card.querySelector(".cart-controls");
      const item = cart.find((item) => item.name === name);
      if (item && item.quantity > 0) {
        cartControls.innerHTML = `
          <button class="quantity-button minus" onclick="updateQuantity('${name}', -1)">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-button plus" onclick="updateQuantity('${name}', 1)">+</button>
        `;
      } else {
        cartControls.innerHTML = `
          <button class="cart-button" onclick="handleAddToCart('${name}', ${
          item ? item.price : 0
        })">
            <img src="../image/icons/carrinho.png" alt="Carrinho" class="cart-icon">
          </button>
        `;
      }
      break;
    }
  }
}

function removeAllFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCart();
  const cards = document.querySelectorAll(".product-card");
  for (const card of cards) {
    const productName = card.querySelector("h3").textContent;
    if (productName === name) {
      const cartControls = card.querySelector(".cart-controls");
      cartControls.innerHTML = `
        <button class="cart-button" onclick="handleAddToCart('${name}', ${0})">
          <img src="../image/icons/carrinho.png" alt="Carrinho" class="cart-icon">
        </button>
      `;
      break;
    }
  }
}

// Carregar bebidas
fetch("../bebidas.json")
  .then((response) => response.json())
  .then((data) => {
    const bebidasContainer = document.getElementById("bebidas-cards");
    data.bebidas.forEach((bebida) =>
      createProductCard(bebida, bebidasContainer)
    );
  })
  .catch((error) => console.error("Erro ao carregar bebidas:", error));

// Carregar porções
fetch("../pocoes.json")
  .then((response) => response.json())
  .then((data) => {
    const porcoesContainer = document.getElementById("porcoes-cards");
    data.produtos.forEach((porcao) =>
      createProductCard(porcao, porcoesContainer)
    );
  })
  .catch((error) => console.error("Erro ao carregar porções:", error));

document.getElementById("finalizar-pedido").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
  } else {
    alert(
      "Pedido finalizado! Total: R$ " +
        document.getElementById("cart-total").textContent.split("R$")[1]
    );
    cart = [];
    updateCart();
  }
});

let currentCategory = "bebidas-porcoes";

function toggleCategory() {
  const categoryTitle = document.getElementById("category-title");
  const toggleIcon = document.getElementById("toggle-icon");

  if (currentCategory === "bebidas-porcoes") {
    currentCategory = "pratos-sobremesas";
    categoryTitle.textContent = "Pratos e Sobremesas";
    toggleIcon.src = "../image/icons/bebidas-e-batata.png";
    loadPratosESobremesas();
  } else {
    currentCategory = "bebidas-porcoes";
    categoryTitle.textContent = "Bebidas e Porções";
    toggleIcon.src = "../image/icons/prato-e-sobremesa.png";
    loadBebidasEPorcoes();
  }
}

function loadBebidasEPorcoes() {
  const productsContainer = document.getElementById("products-grid");
  productsContainer.innerHTML = "";

  const bebidasPorcoesContainer = document.createElement("div");
  bebidasPorcoesContainer.className = "category-container";

  // Carregar bebidas
  fetch("../bebidas.json")
    .then((response) => response.json())
    .then((data) => {
      const bebidasSection = document.createElement("div");
      bebidasSection.className = "product-section";
      bebidasSection.innerHTML = "<h2>Bebidas</h2>";
      const bebidasGrid = document.createElement("div");
      bebidasGrid.className = "product-grid";
      data.bebidas.forEach((bebida) => createProductCard(bebida, bebidasGrid));
      bebidasSection.appendChild(bebidasGrid);
      bebidasPorcoesContainer.appendChild(bebidasSection);
    })
    .catch((error) => console.error("Erro ao carregar bebidas:", error));

  // Carregar porções
  fetch("../pocoes.json")
    .then((response) => response.json())
    .then((data) => {
      const porcoesSection = document.createElement("div");
      porcoesSection.className = "product-section";
      porcoesSection.innerHTML = "<h2>Porções</h2>";
      const porcoesGrid = document.createElement("div");
      porcoesGrid.className = "product-grid";
      data.produtos.forEach((porcao) => createProductCard(porcao, porcoesGrid));
      porcoesSection.appendChild(porcoesGrid);
      bebidasPorcoesContainer.appendChild(porcoesSection);
    })
    .catch((error) => console.error("Erro ao carregar porções:", error));

  productsContainer.appendChild(bebidasPorcoesContainer);
}

function loadPratosESobremesas() {
  const productsContainer = document.getElementById("products-grid");
  productsContainer.innerHTML = "";

  const pratosSobremesasContainer = document.createElement("div");
  pratosSobremesasContainer.className = "category-container";

  // Carregar pratos
  fetch("../pratos.json")
    .then((response) => response.json())
    .then((data) => {
      const pratosSection = document.createElement("div");
      pratosSection.className = "product-section";
      pratosSection.innerHTML = "<h2>Pratos</h2>";
      const pratosGrid = document.createElement("div");
      pratosGrid.className = "product-grid";
      data.produtos.forEach((prato) => createProductCard(prato, pratosGrid));
      pratosSection.appendChild(pratosGrid);
      pratosSobremesasContainer.appendChild(pratosSection);
    })
    .catch((error) => console.error("Erro ao carregar pratos:", error));

  // Carregar sobremesas
  fetch("../sobremesas.json")
    .then((response) => response.json())
    .then((data) => {
      const sobremesasSection = document.createElement("div");
      sobremesasSection.className = "product-section";
      sobremesasSection.innerHTML = "<h2>Sobremesas</h2>";
      const sobremesasGrid = document.createElement("div");
      sobremesasGrid.className = "product-grid";
      data.produtos.forEach((sobremesa) =>
        createProductCard(sobremesa, sobremesasGrid)
      );
      sobremesasSection.appendChild(sobremesasGrid);
      pratosSobremesasContainer.appendChild(sobremesasSection);
    })
    .catch((error) => console.error("Erro ao carregar sobremesas:", error));

  productsContainer.appendChild(pratosSobremesasContainer);
}

// Inicializar a página
document.addEventListener("DOMContentLoaded", () => {
  loadBebidasEPorcoes();
  document
    .getElementById("toggle-category")
    .addEventListener("click", toggleCategory);
});
