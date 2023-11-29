// producto.js

document.addEventListener("DOMContentLoaded", function () {
    // Obtener el producto desde localStorage o la API
    const productId = getProductIdFromURL();
    const product = getProductById(productId);

    if (product) {
        // Actualizar la información en la página de detalle
        updateProductDetail(product);
    } else {
        // Manejar el caso en que el producto no se encuentre
        alert("Producto no encontrado");
        window.location.href = "index.html"; // Redirigir a la página principal
    }
});

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function getProductById(productId) {
    // Intentar obtener el producto de localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('products')) || [];
    const productFromLocalStorage = localStorageProducts.find(product => product.id === parseInt(productId));

    if (productFromLocalStorage) {
        return productFromLocalStorage;
    }

    // Si el producto no se encuentra en localStorage, buscar en la API
    const apiUrl = `https://fakestoreapi.com/products/${productId}`;
    return fetchData(apiUrl);
}

function updateProductDetail(product) {
    // Actualizar la información en la página de detalle
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-title").innerText = product.title;
    document.getElementById("product-price").innerText = `$ ${product.price}`;
    document.getElementById("product-description").innerText = product.description;
    // Puedes agregar más actualizaciones según sea necesario
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}
