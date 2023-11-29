let images = ["./img/img1.jpg", "./img/img2.jpg", "./img/img3.jpg", "./img/img4.jpg", "./img/img5.jpg", "./img/img6.jpg", "./img/img7.jpg", "./img/img8.jpg", "./img/img9.jpg", "./img/img10.jpg", "./img/img11.jpg", "./img/img12.jpg"];
let default_image = "./img/default.jpg";


document.getElementById("box").addEventListener("keyup", (e) => {
    if (document.getElementById("box").value != "") {

        if (!isNaN(e.key) || e.key == "Backspace") {
            getDataID(document.getElementById("box").value);
        }
        if (isNaN(e.key) && e.key != "Backspace") {
            document.getElementById("box").value = "";
        }
    } else {
        getData();
    }


});

const getDataID = (id) => {
    document.getElementById("loading").style.display = "block";
    fetch(`https://fakestoreapi.com/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                console.clear();
                document.getElementById('product-item').innerHTML = `<h1 class="text-center" style="font-size: 10em; color: white; padding: 3em;">No results found</h1>`;
                throw new Error("No se encontraron resultados");
            } else if (response.status === 500) {
                console.clear();
                throw new Error("Error del servidor");
            } else {
                console.clear();
                document.getElementById('product-item').innerHTML = `<h1 class="text-center" style="font-size: 10em; color: white; padding: 3em;">Server error</h1>`;
                throw new Error("Error en el servidor");
            }
        })
        .then(json => {
            if (json == null) {
                document.getElementById('product-item').innerHTML = `<h1 class="text-center" style="font-size: 10em; color: white; padding: 3em;">No results found</h1>`;
            } else {
                printDataID(json);
            }
        })
        .catch(error => console.log('ERROR ---->', error))
        .finally(() => {
            document.getElementById("loading").style.display = "none";
        });
}

const printDataID = (data) => {
    let html = "";
    let num = Math.floor(Math.random() * (images.length));
    html += `    <div class = "product" value="${data.id}"  onclick="comprobar(${data.id})">`;
    html += `                     <div class = "product-content">`;
    html += `                        <div class = "product-img">`;
    //html += `                            <img id="imagencliente" src = "${images[num]}" alt = "product image">`;
    html += `                            <img id="imagencliente" src = "${default_image}" alt = "product image">`;
    html += `                        </div>`;
    html += `                    </div>`;
    html += `                    <div class = "product-info">`;
    html += `                        <div class = "product-info-top">`;
    html += `                            <h2 class = "sm-title">${data.id}</h2>`;
    html += `                        </div>`;
    html += `                        <a class = "product-name">` + Cambiarletra(data.name.firstname) + ` ` + Cambiarletra(data.name.lastname) + `</a>`;
    html += `                    </div>`;
    html += `           </div>`;
    //////////////////////////////////
    document.getElementById("product-item").innerHTML = html;
}


const getData = () => {
    document.getElementById("loading").style.display = "block";
    fetch(`https://fakestoreapi.com/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                console.clear();
                document.getElementById('product-item').innerHTML = `<h1 class="text-center" style="font-size: 10em; color: white; padding: 3em;">No results found</h1>`;
                throw new Error("No se encontraron resultados");
            } else if (response.status === 500) {
                console.clear();
                throw new Error("Error del servidor");
            } else {
                console.clear();
                throw new Error("Error desconocido");
            }
        })
        .then(json => {
            printData(json);
        })
        .catch(error => console.log('ERROR ---->', error))
        .finally(() => {
            document.getElementById("loading").style.display = "none";
        });
}

const printData = (data) => {
    let html = "";
    let num;
    let randoms = [];
    data.forEach((c, i) => {
        do {
            num = Math.floor(Math.random() * (images.length));
            if (randoms.indexOf(num) == -1) {
                randoms.push(num);
                break;
            }
        } while (randoms.indexOf(num) != -1);

        html += `    <div class = "product" value="${c.id}" onclick="comprobar(${c.id})">`;
        html += `                     <div class = "product-content">`;
        html += `                        <div class = "product-img">`;
        //html += `                            <img id="imagencliente" src = "${images[num]}" alt = "product image">`;
        html += `                            <img id="imagencliente" src = "${default_image}" alt = "product image">`;
        html += `                        </div>`;
        html += `                    </div>`;
        html += `                    <div class = "product-info">`;
        html += `                        <div class = "product-info-top">`;
        html += `                            <h2 class = "sm-title">${c.id}</h2>`;
        html += `                        </div>`;
        html += `                        <a class = "product-name">` + Cambiarletra(c.name.firstname) + ` ` + Cambiarletra(c.name.lastname) + `</a>`;
        html += `                    </div>`;
        html += `           </div>`;
        //////////////////////////////////
    });
    document.getElementById("product-item").innerHTML = html;
};


function Cambiarletra(word) {
    return word[0].toUpperCase() + word.slice(1);
}
getData();

function comprobar(id) {
    document.getElementById("loading").style.display = "block";
    fetch(`https://fakestoreapi.com/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                console.clear();
                throw new Error("Error 404: No se encontró el recurso");
            } else if (response.status === 500) {
                console.clear();
                throw new Error("Error del servidor");
            } else {
                console.clear();
                throw new Error("Error desconocido");
            }
        })
        .then((json) => {
            Details(json);
        })
        .catch((error) => console.log("ERROR ---->", error))
        .finally(() => {
            document.getElementById("loading").style.display = "none";
        });
}



const Details = (data) => {
    document.getElementById("modal_container").style.display = "block";

    let html = "";
    html += `<div class = "card-wrapper2">`;
    html += `<div class = "card2">`;
    html += `  <div class = "product-content2">`;
    html += `        <div class="container-x"><span id="close" class="close">&times;</span></div>`;
    html += `    <h2 class = "product-title2">` + Cambiarletra(data.name.firstname) + ` ` + Cambiarletra(data.name.lastname) + `</h2>`;
    html += `    <a class = "product-link2">${data.phone}</a>`;
    html += `    <div class = "product-rating2">`;
    html += `      <span>${data.address.city}   (${data.address.street})</span>`;
    html += `    </div>`;
    html += `    <div class = "product-price2">`;
    html += `      <p class = "new-price2">Email: <span>$${data.email}</span></p>`;
    html += `      <p class = "new-price2">Username: <span>${data.username}</span></p>`;
    html += `      <p class = "last-price2">Password: <span>${data.password}</span></p>`;
    html += `    </div>`;
    html += `    <div class = "product-detail2">`;
    html += `    </div>`;
    html += `  </div>`;
    html += `</div>`;
    html += `</div>`;

    document.getElementById("modal_container").innerHTML = html;

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById("modal_container").style.display = "none";
    });
};

// Menú Hamburger
document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menu = document.querySelector(".menu");

    hamburgerMenu.addEventListener("click", function () {
        menu.classList.toggle("show");
    });
});