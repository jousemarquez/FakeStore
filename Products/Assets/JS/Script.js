const state = {
    firstLoad: true,
    currentCategory: "all",
}

const elements = {
    filterItem: document.querySelector(".items"),
    filterImg: document.querySelectorAll(".gallery .image"),
}

const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.clear();
            throw new Error(
                response.status === 404
                    ? "Error 404: Resource not found"
                    : response.status === 500
                        ? "Server Error"
                        : "Unknow Error"
            );
        }
        return response.json();
    } catch (error) {
        console.log("ERROR ---->", error);
        // Timeout para que redirija a 404 en caso de no completar el fetch.
        /* setTimeout(() => {
            window.location.href = "/404.html";
        }, 15000); */
    }
}

// Products

document.getElementById('add-product-button').addEventListener('click', function () {
    const addProductModal = document.getElementById('modal_container');
    addProductModal.style.display = 'block';
})

document.getElementById('close-modal').addEventListener('click', function () {
    const addProductModal = document.getElementById('modal_container');
    addProductModal.style.display = 'none';
})

document.getElementById('add-product-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        image: document.getElementById('image').value,
    }

    // Validar el formulario
    const validationError = validateProductForm(newProduct);

    if (validationError) {
        // Log the error instead of showing it
        console.error(validationError);
    } else {
        // Obtener el último ID de producto de la API
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(apiProducts => {
                const lastApiProductId = apiProducts[apiProducts.length - 1].id;
                const existingProducts = JSON.parse(localStorage.getItem('products')) || [];

                // Obtener el último ID de producto en el localStorage
                const lastLocalProductId = existingProducts.length > 0
                    ? existingProducts[existingProducts.length - 1].id
                    : 0;

                // Asignar un nuevo ID único al producto
                newProduct.id = Math.max(lastApiProductId, lastLocalProductId) + 1;

                // Agregar el nuevo producto a la lista
                existingProducts.push(newProduct);

                // Almacenar la lista actualizada en el localStorage
                localStorage.setItem('products', JSON.stringify(existingProducts));

                console.log('New Product Added:', newProduct);

                // Cerrar el modal después de agregar el producto
                const addProductModal = document.getElementById('modal_container');
                addProductModal.style.display = 'none';
            })
            .catch(error => {
                console.error('Error... Getting the full list of products from the API:', error);
                // Log the error instead of showing it
                console.error('Error... Unable to retrieve products from the API.');
            });
    }
})

// Función para validar el formulario
function validateProductForm(product) {
    if (!product.title || !product.price || !product.category || !product.description || !product.image) {
        return 'Error... All fields are required.';
    }
    return null;
}

const updateFilter = (selectedItem) => {
    if (selectedItem.target.classList.contains("item")) {
        elements.filterItem.querySelector(".active").classList.remove("active");
        selectedItem.target.classList.add("active");

        const filterName = selectedItem.target.getAttribute("data-name");
        if (state.currentCategory !== filterName) {
            state.currentCategory = filterName;
            filterProducts();
        }
    }
}

const filterProducts = () => {
    document.getElementById("loading").style.display = "block";
    const apiUrl =
        state.currentCategory === "all"
            ? "https://fakestoreapi.com/products"
            : `https://fakestoreapi.com/products/category/${state.currentCategory}`;

    const localStorageProducts = JSON.parse(localStorage.getItem('products')) || [];

    Promise.all([
        fetchData(apiUrl),
        Promise.resolve(localStorageProducts)
    ])
        .then(([apiProducts, localProducts]) => {
            const allProducts = [...apiProducts, ...localProducts];
            if (state.firstLoad) {
                initialize(allProducts);
            }
            getData(allProducts);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            // Log the error instead of showing it
            console.error('Error... Unable to retrieve products.');
        })
        .finally(() => {
            document.getElementById("loading").style.display = "none";
        });
}


const getData = (data) => {
    let html = "";
    data.forEach((c) => {
        html += `<div class="product" value="${c.id}">`;
        html += `  <div class="product-content">`;
        /* html += `    <a href="/product-details.html?id=${c.id}" class="product-img">`; */
        html += `    <div class="product-img" onclick="comprobar(${c.id})">`;
        html += `      <img src="${c.image}" alt="product image">`;
        html += `    </div>`;
        html += `    <div class="product-btns">`;
        html += `      <button type="button" onclick="addToCart(${c.id}, ${(
            parseFloat(c.price) - (15 * parseFloat(c.price)) / 100
        ).toFixed(2)})" class="btn-cart"> add to cart`;
        html += `        <span><i class="fas fa-plus"></i></span>`;
        html += `      </button>`;
        /* html += `      <button type="button" onclick="individualPurchase(${c.id})" class="btn-buy"> buy now`; */
        html += `      <button type="button" onclick="openEditModal(1)" class="btn-buy"> edit`;
        html += `      <button type="button" onclick="viewmore(${c.id})" class="btn-buy"> view more`;
        html += `        <span><i class="fas fa-shopping-cart"></i></span>`;
        html += `      </button>`;
        html += `    </div>`;
        html += `  </div>`;
        html += `  <div class="product-info">`;
        html += `    <div class="product-info-top">`;
        html += `      <h2 class="sm-title">${c.category}</h2>`;
        html += `      <div class="rating.rate">`;

        // Verificar si la propiedad rating está definida antes de usarla
        if (c.rating && Math.round(c.rating.rate)) {
            if (Math.round(c.rating.rate) === 5) {
                for (let i = 0; i < 5; i++) {
                    html += `   <i class="fas fa-star"></i>`;
                }
            } else if (Math.round(c.rating.rate) === 4) {
                for (let i = 0; i < 4; i++) {
                    html += `   <i class="fas fa-star"></i>`;
                }
                html += `   <span><i class="far fa-star"></i></span>`;
            }
            // Agrega lógica similar para otras calificaciones
        } else {
            // Si rating no está definido, muestra un mensaje o realiza alguna acción predeterminada
            html += `   <span>No rating available</span>`;
        }

        html += `      </div>`;
        html += `    </div>`;
        html += `    <a class="product-name">${c.title}</a>`;
        html += `    <p class="product-price">$ ${c.price}</p>`;
        html +=
            `    <p class="product-price">$ ` +
            (parseFloat(c.price) - (15 * parseFloat(c.price)) / 100).toFixed(2) +
            ` </p>`;
        html += `  </div>`;
        html += `  <div class="off-info">`;
        html += `    <h2 class="sm-title">10% off</h2>`;
        html += `  </div>`;
        html += `</div>`;
    });
    document.getElementById("product-item").innerHTML = html;
}


const initialize = (data) => {
    if (sessionStorage.getItem("cart") !== null) {
        handleCart();
    }

    let uniqueCategories = [];
    let html2 = "";
    data.forEach((c) => {
        if (state.firstLoad) {
            if (!uniqueCategories.includes(c.category)) {
                uniqueCategories.push(c.category);
                html2 = `<span class="item" data-name="${c.category}" id="${c.id}">${c.category}</span>`;
                document.getElementById("items").innerHTML += html2;
            }
        }
    });
    state.firstLoad = false;
}

// Edit Product

// Al abrir el modal para editar un producto
function openEditModal(productId) {
    const editProductModal = document.getElementById('edit_modal_container');
    const editProductForm = document.getElementById('edit-product-form');
    const productIdInput = document.getElementById('edit-product-id');

    // Establecer el ID del producto en el campo oculto del formulario
    productIdInput.value = productId;

    // Obtener el producto actual del localStorage por su ID
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productToEdit = products.find(product => product.id == productId);

    // Llenar el formulario con los datos actuales del producto
    document.getElementById('edit-title').value = productToEdit.title;
    document.getElementById('edit-price').value = productToEdit.price;
    document.getElementById('edit-category').value = productToEdit.category;
    document.getElementById('edit-description').value = productToEdit.description;
    document.getElementById('edit-image').value = productToEdit.image;

    // Mostrar el modal
    editProductModal.style.display = 'block';
}

// Al cerrar el modal de edición
document.getElementById('close-edit-modal').addEventListener('click', function () {
    const editProductModal = document.getElementById('edit_modal_container');
    editProductModal.style.display = 'none';
});

// Al enviar el formulario de edición
document.getElementById('edit-product-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener el ID del producto del campo oculto
    const productId = document.getElementById('edit-product-id').value;

    // Obtener los datos del formulario
    const editedProduct = {
        title: document.getElementById('edit-title').value,
        price: document.getElementById('edit-price').value,
        category: document.getElementById('edit-category').value,
        description: document.getElementById('edit-description').value,
        image: document.getElementById('edit-image').value,
    };

    // Obtener la lista actual de productos del localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Encontrar y actualizar el producto en la lista
    const updatedProducts = products.map(product => {
        if (product.id == productId) {
            return { ...product, ...editedProduct };
        }
        return product;
    });

    // Actualizar la lista de productos en el localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Cerrar el modal después de editar el producto
    const editProductModal = document.getElementById('edit_modal_container');
    editProductModal.style.display = 'none';

    // Actualizar la interfaz de usuario con los datos modificados
    getData(updatedProducts);
});


// Cart

const purchaseCart = () => {
    if (sessionStorage.getItem("cart") != null) {
        const fecha = new Date();
        let compra = "";
        let cart = JSON.parse(sessionStorage.getItem("cart"));
        cart.forEach((c, i) => {
            compra += `{productId:${c.id}, quantity:${c.count}}`;
            if (cart.length - 1 !== i) {
                compra += ",";
            }
        });
        document.getElementById("total-Products").innerHTML = 0;
        document.getElementById("total-price").innerHTML = "$ 0";

        document.getElementById("loading").style.display = "block";
        fetchData(`https://fakestoreapi.com/carts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: 1,
                date: fecha.toLocaleDateString(),
                products: [compra],
            }),
        })
            .then((json) => {
                console.log(json);
                sessionStorage.removeItem("cart");
            })
            .catch((error) => console.log("ERROR ---->", error))
            .finally(() => {
                document.getElementById("loading").style.display = "none";
                alert("Purchase completed successfully.");
            });
    } else {
        alert("Error... The Cart is empty");
    }
}

const addToCart = (id, precio) => {
    let count = 1;
    const userId = getUserId();

    if (sessionStorage.getItem("cart") === null) {
        let cart = [];
        cart.push({
            id: id,
            precio: precio,
            count: count,
            userId: userId,
        });
        sessionStorage.setItem("cart", JSON.stringify(cart));
    } else {
        let cart = JSON.parse(sessionStorage.getItem("cart"));
        cart.forEach((c) => {
            if (c.id === id && c.userId === userId) {
                c.count++;
                count++;
            }
        });
        if (count === 1) {
            cart.push({
                id: id,
                precio: precio,
                count: count,
                userId: userId,
            });
        }
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }
    handleCart();
}

const getUserId = () => {
    const usersData = localStorage.getItem("users");
    if (!usersData) {
        return null;
    }
    const users = JSON.parse(usersData);
    const firstUserId = Object.values(users)[0];
    return firstUserId;
}

const handleCart = () => {
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    let contador = 0;
    let total = 0;
    cart.forEach((c) => {
        total += c.precio * c.count;
        contador += c.count;
    });
    document.getElementById("total-Products").innerHTML = contador;
    document.getElementById("total-price").innerHTML = "$ " + total.toFixed(1);
}



const buy_cart = () => {
    const userId = getUserId();

    if (sessionStorage.getItem("cart") != null) {
        const date = new Date();
        let purchase = "";
        let totalPrice = 0;
        let cart = JSON.parse(sessionStorage.getItem("cart"));
        cart.forEach((item, i) => {
            purchase += `{productId:${item.id}, quantity:${item.count}}`;
            totalPrice += item.price * item.count;
            if ((cart.length - 1) !== i) {
                purchase += ",";
            }
        });

        document.getElementById("total-Products").innerHTML = 0;
        document.getElementById("total-price").innerHTML = "$ 0";

        document.getElementById("loading").style.display = "block";
        fetch(`https://fakestoreapi.com/carts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    userId: userId,
                    date: date.toLocaleDateString(),
                    products: [purchase],
                }
            ),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    console.clear();
                    throw new Error("Error 404: Resource not found");
                } else if (response.status === 500) {
                    console.clear();
                    throw new Error("Server error");
                } else {
                    console.clear();
                    throw new Error("Unknown error");
                }
            })
            .then((json) => {
                console.log(json);
                sessionStorage.removeItem("cart");

                // Store additional information in localStorage
                const cartPurchased = {
                    cartId: json.id,
                    userId: userId,
                    productIds: cart.map(item => item.id),
                    totalPrice: totalPrice,
                }
                sessionStorage.setItem("cart_purchased", JSON.stringify(cartPurchased));
            })
            .catch((error) => console.log("ERROR ---->", error))
            .finally(() => {
                document.getElementById("loading").style.display = "none";
                alert("Purchase successful");
            });
    } else {
        alert("Error...No products in the cart");
    }
}

const check = (id) => {
    if (sessionStorage.getItem("cart") !== null) {
        let cart = JSON.parse(sessionStorage.getItem("cart"));
        let encontrado = false;
        cart.forEach((c) => {
            if (c.id === id) {
                encontrado = true;
            }
        });
        if (encontrado) {
            alert("El producto ya está en el cart");
        } else {
            let data = JSON.parse(sessionStorage.getItem("cart"));
            data.push({
                id: id,
                count: 0,
                precio: 0,
            });
            sessionStorage.setItem("cart", JSON.stringify(data));
            handleCart();
            individualPurchase(id);
        }
    } else {
        alert("No hay productos en el cart");
    }
}

elements.filterItem.addEventListener("click", updateFilter);
filterProducts();

// Menú Hamburger
document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menu = document.querySelector(".menu");

    hamburgerMenu.addEventListener("click", function () {
        menu.classList.toggle("show");
    });
});