const state = {
    firstLoad: true,
    currentCategory: "all",
};

const elements = {
    filterItem: document.querySelector(".items"),
    filterImg: document.querySelectorAll(".gallery .image"),
};

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
};

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
};

const filterProducts = () => {
    document.getElementById("loading").style.display = "block";
    const url =
        state.currentCategory === "all"
            ? "https://fakestoreapi.com/products"
            : `https://fakestoreapi.com/products/category/${state.currentCategory}`;

    fetchData(url)
        .then((json) => {
            if (state.firstLoad) {
                initialize(json);
            }
            getData(json);
        })
        .finally(() => {
            document.getElementById("loading").style.display = "none";
        });
};

const getData = (data) => {
    let html = "";
    data.forEach((c) => {
        html += `<div class="product" value="${c.id}">`;
        html += `  <div class="product-content">`;
        html += `    <div class="product-img" onclick="comprobar(${c.id})">`;
        html += `      <img src="${c.image}" alt="product image">`;
        html += `    </div>`;
        html += `    <div class="product-btns">`;
        html += `      <button type="button" onclick="addToCart(${c.id}, ${(
            parseFloat(c.price) - (15 * parseFloat(c.price)) / 100
        ).toFixed(2)})" class="btn-cart"> add to cart`;
        html += `        <span><i class="fas fa-plus"></i></span>`;
        html += `      </button>`;
        html += `      <button type="button" onclick="individualPurchase(${c.id})" class="btn-buy"> buy now`;
        html += `        <span><i class="fas fa-shopping-cart"></i></span>`;
        html += `      </button>`;
        html += `    </div>`;
        html += `  </div>`;
        html += `  <div class="product-info">`;
        html += `    <div class="product-info-top">`;
        html += `      <h2 class="sm-title">${c.category}</h2>`;
        html += `      <div class="rating.rate">`;
        if (Math.round(c.rating.rate) === 5) {
            for (let i = 0; i < 5; i++) {
                html += `                                <i class = "fas fa-star"></i>`;
            }
        } else if (Math.round(c.rating.rate) === 4) {
            for (let i = 0; i < 4; i++) {
                html += `                                <i class = "fas fa-star"></i>`;
            }
            html += `                                <span><i class = "far fa-star"></i></span>`;
        } else if (Math.round(c.rating.rate) === 3) {
            for (let i = 0; i < 3; i++) {
                html += `                                <i class = "fas fa-star"></i>`;
            }
            for (let i = 0; i < 2; i++) {
                html += `                                <span><i class = "far fa-star"></i></span>`;
            }
        } else if (Math.round(c.rating.rate) === 2) {
            for (let i = 0; i < 2; i++) {
                html += `                                <i class = "fas fa-star"></i>`;
            }
            for (let i = 0; i < 3; i++) {
                html += `                                <span><i class = "far fa-star"></i></span>`;
            }
        } else if (Math.round(c.rating.rate) === 1) {
            for (let i = 0; i < 1; i++) {
                html += `                                <i class = "fas fa-star"></i>`;
            }
            for (let i = 0; i < 4; i++) {
                html += `                                <span><i class = "far fa-star"></i></span>`;
            }
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
};

const initialize = (data) => {
    if (localStorage.getItem("cart") !== null) {
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
};

const purchaseCart = () => {
    if (localStorage.getItem("cart") != null) {
        const fecha = new Date();
        let compra = "";
        let cart = JSON.parse(localStorage.getItem("cart"));
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
                localStorage.removeItem("cart");
            })
            .catch((error) => console.log("ERROR ---->", error))
            .finally(() => {
                document.getElementById("loading").style.display = "none";
                alert("Compra realizada con éxito");
            });
    } else {
        alert("Error... The Cart is empty");
    }
};

const addToCart = (id, precio) => {
    let count = 1;
    const userId = getUserId();

    if (localStorage.getItem("cart") === null) {
        let cart = [];
        cart.push({
            id: id,
            precio: precio,
            count: count,
            userId: userId,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        let cart = JSON.parse(localStorage.getItem("cart"));
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
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    handleCart();
};

const getUserId = () => {
    const usersData = localStorage.getItem("users");
    if (!usersData) {
        return null;
    }
    const users = JSON.parse(usersData);
    const firstUserId = Object.values(users)[0];
    return firstUserId;
};

const handleCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let contador = 0;
    let total = 0;
    cart.forEach((c) => {
        total += c.precio * c.count;
        contador += c.count;
    });
    document.getElementById("total-Products").innerHTML = contador;
    document.getElementById("total-price").innerHTML = "$ " + total.toFixed(1);
};

const individualPurchase = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let fecha = new Date();
    cart.forEach((c) => {
        if (c.id === id) {
            document.getElementById("loading").style.display = "block";
            fetchData(`https://fakestoreapi.com/carts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: 1,
                    date: fecha.toLocaleDateString(),
                    products: [
                        {
                            productId: c.id,
                            quantity: c.count,
                        },
                    ],
                }),
            })
                .then((json) => {
                    console.log(json);
                })
                .catch((error) => console.log("ERROR ---->", error))
                .finally(() => {
                    document.getElementById("loading").style.display = "none";
                    alert("Compra realizada con éxito");
                });
        }
    });
    localStorage.removeItem("cart");
    handleCart();
    filterProducts();
};

const buy_cart = () => {
    const userId = getUserId();

    if (localStorage.getItem("cart") != null) {
        const date = new Date();
        let purchase = "";
        let totalPrice = 0;
        let cart = JSON.parse(localStorage.getItem("cart"));
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
                localStorage.removeItem("cart");

                // Store additional information in localStorage
                const cartPurchased = {
                    cartId: json.id,
                    userId: userId,
                    productIds: cart.map(item => item.id),
                    totalPrice: totalPrice,
                };
                localStorage.setItem("cart_purchased", JSON.stringify(cartPurchased));
            })
            .catch((error) => console.log("ERROR ---->", error))
            .finally(() => {
                document.getElementById("loading").style.display = "none";
                alert("Purchase successful");
            });
    } else {
        alert("Error...No products in the cart");
    }
};

const check = (id) => {
    if (localStorage.getItem("cart") !== null) {
        let cart = JSON.parse(localStorage.getItem("cart"));
        let encontrado = false;
        cart.forEach((c) => {
            if (c.id === id) {
                encontrado = true;
            }
        });
        if (encontrado) {
            alert("El producto ya está en el cart");
        } else {
            let data = JSON.parse(localStorage.getItem("cart"));
            data.push({
                id: id,
                count: 0,
                precio: 0,
            });
            localStorage.setItem("cart", JSON.stringify(data));
            handleCart();
            individualPurchase(id);
        }
    } else {
        alert("No hay productos en el cart");
    }
};

elements.filterItem.addEventListener("click", updateFilter);
filterProducts();
