let cart = [];

// Adiciona um item ao carrinho
function addToCart(item, price) {
  let existingItem = cart.find((product) => product.name === item);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: item, price: price, quantity: 1 });
  }
  updateCart();
}

// Remove um item do carrinho
function removeFromCart(item) {
  cart = cart.filter((product) => product.name !== item);
  updateCart();
}

// Atualiza o carrinho na tela
function updateCart() {
  const cartElement = document.getElementById("cart");
  const totalElement = document.getElementById("total");
  cartElement.innerHTML = "";
  let total = 0;

  cart.forEach((product) => {
    cartElement.innerHTML += `<li>${product.name} - ${product.quantity} x R$${product.price} 
            <button onclick="removeFromCart('${product.name}')">Remover</button></li>`;
    total += product.price * product.quantity;
  });

  totalElement.innerText = `Total: R$ ${total.toFixed(2)}`;
}

// Finaliza o pedido
function finalizeOrder() {
  if (cart.length === 0) {
    alert("O carrinho está vazio!");
  } else {
    window.location.href = "pagamento.html";
  }
}

// Confirma o pedido
function confirmOrder() {
  window.location.href = "confirmacao.html";
}
