const loadUserProfile = () => {
  // Intenta obtener los datos del usuario desde el localStorage
  const storedUserData = sessionStorage.getItem("users");

  if (storedUserData) {
    const userData = JSON.parse(storedUserData);

    // Muestra la información del usuario en el HTML
    const userInfoContainer = document.querySelector(".user-info");
    userInfoContainer.innerHTML = `
      <p><strong>Name:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <!-- Otros campos de información personal -->
    `;
  } else {
    // Si no hay datos almacenados, muestra un mensaje o realiza alguna acción predeterminada
    const userInfoContainer = document.querySelector(".user-info");
    userInfoContainer.innerHTML = "<p>No user data available.</p>";
  }
};

// Agrega esta función para cargar y mostrar los carritos pasados del usuario
const loadPastCarts = () => {
  // Simula la obtención de carritos pasados desde algún lugar (puede ser una API)
  const pastCarts = [
    { id: 1, date: "2023-01-01", total: 50.0 },
    // Otros carritos pasados
  ];

  // Muestra los carritos pasados en la lista HTML
  const cartListContainer = document.getElementById("cart-list");
  pastCarts.forEach((cart) => {
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `
      <p><strong>Date:</strong> ${cart.date}</p>
      <p><strong>Total:</strong> $${cart.total.toFixed(2)}</p>
      <!-- Otros detalles del carrito -->
    `;
    cartListContainer.appendChild(cartItem);
  });
};

// Llama a estas funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadPastCarts();
});
