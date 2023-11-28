// Declaración de variables
let container_login_register = document.querySelector(".container__login-register");
let form_Login = document.querySelector(".form__login");
let form_register = document.querySelector(".form__register");
let box_back_login = document.querySelector(".box__back-login");
let box_back_register = document.querySelector(".box__back-register");

window.addEventListener("resize", anchoPagina = () => {
    // Evento que se ejecuta cuando se redimensiona la pantalla
    if (window.innerWidth > 850) {
        box_back_login.style.display = "block";
        box_back_register.style.display = "block";
    } else {
        box_back_register.style.display = "block";
        box_back_register.style.opacity = "1";
        box_back_login.style.display = "none";
        form_Login.style.display = "block";
        form_register.style.display = "none";
        container_login_register.style.left = "0px";
    }
});

anchoPagina(); // Se ejecuta la función anchoPagina

document.getElementById("btn__iniciar-sesion").addEventListener("click", login = () => {
    // Evento que se ejecuta cuando se hace click en el botón de iniciar sesión
    if (window.innerWidth > 850) {
        form_register.style.display = "none";
        container_login_register.style.left = "10px";
        form_Login.style.display = "block";
        box_back_register.style.opacity = "1";
        box_back_login.style.opacity = "0";
    } else {
        form_register.style.display = "none";
        container_login_register.style.left = "0px";
        form_Login.style.display = "block";
        box_back_register.style.display = "block";
        box_back_login.style.display = "none";
    }
});

document.getElementById("btn__registrarse").addEventListener("click", register = () => {
    // Evento que se ejecuta cuando se hace click en el botón de registrarse
    if (window.innerWidth > 850) {
        form_register.style.display = "block";
        container_login_register.style.left = "410px";
        form_Login.style.display = "none";
        box_back_register.style.opacity = "0";
        box_back_login.style.opacity = "1";
    } else {
        form_register.style.display = "block";
        container_login_register.style.left = "0px";
        form_Login.style.display = "none";
        box_back_register.style.display = "none";
        box_back_login.style.display = "block";
        box_back_login.style.opacity = "1";
    }
});

/////////////////////////////////////////////////////////////
let modalError = document.getElementById("myModal");
let span = document.getElementById("close");
let text_modal = document.getElementById("text-modal");

span.onclick = function () {
    modalError.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modalError) {
        modalError.style.display = "none";
    }
};

//////////////////////////////////////////////////////////////
let instruction_login = document.querySelector("#inst-login");
let instruction_register = document.querySelector("#inst-register");

instruction_login.addEventListener("click", () => {
    text_modal.innerHTML =
        "Puede usar cualquiera de los nombres de user y passwords de los users disponibles en la API de los users para obtener el token. cualquier otro nombre de user devuelve un error.";
    modalError.style.display = "block";
});

instruction_register.addEventListener("click", () => {
    text_modal.innerHTML =
        "Si envía un objeto como el código anterior, le devolverá un objeto con una nueva identificación. recuerde que nada real se insertará en la base de datos. entonces, si desea acceder a la nueva identificación, obtendrá un error 404.";
    modalError.style.display = "block";
});

/////////////////////////////////////////////////////////////
// Modal de registro
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');

closeModal.addEventListener('click', (e) => {
    modal.classList.remove('modal--show');
    setTimeout(reload, 850);
});

function reload () {
    window.location = "../index.html";
}

/////////////////////////////////////////////////////
let btn_ready_register = document.querySelector("#btn__ready-register"); // Botón de ready del register
let mail_register = document.querySelector("#mail-register"); // Input del mail del register
let user_register = document.querySelector("#user-register"); // Input del user del register
/* let nombre_register = document.querySelector("#nombre-register"); // Input del nombre del register
let apellido_register = document.querySelector("#apellido-register"); // Input del apellido del register */

let password_register = document.getElementById("password_register");
let password_confirm = document.getElementById("password_confirm");

btn_ready_register.addEventListener('click', function () {
    let msg = "";

    // Username validation
    if (user_register.value.length < 8) {
        msg += "<br>- Error... Username must have 8 characters at least";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail_register.value)) {
        msg += "<br>- Error... Email is not valid.";
    }

    // Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password_register.value)) {
        msg += "<br>- Error... The password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one special character.";
    }

    // Checking users has filled all the fields
    if (mail_register.value == "" || user_register.value == "" || /* nombre_register.value == "" || apellido_register.value == "" ||  */password_register.value == "" || password_confirm.value == "") {
        msg = "Error... All fields are required";
    } else {
        if (password_register.value != password_confirm.value) {
            msg += "<br>- Error... Passwords do not match";
        }

        // Check if a user already exists with the same username or email address
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userWithSameUsername = existingUsers.find(user => user.username === user_register.value);
        const userWithSameEmail = existingUsers.find(user => user.email === mail_register.value);

        if (userWithSameUsername) {
            msg += "<br>- Error... A user with this username already exists";
        }

        if (userWithSameEmail) {
            msg += "<br>- Error... There is already a user with this email";
        }
    }

    if (msg != "") {
        text_modal.innerHTML = msg;
        modalError.style.display = "block";
    } else {
        document.getElementById("loading").style.display = "block";

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        // New user generator
        const newUser = {
            id: generateUserId(),
            username: user_register.value,
            email: mail_register.value,
            password: password_confirm.value,
        };

        // Adding the new user to the list if a user with the same username or email does not exist
        const userWithSameUsername = existingUsers.find(user => user.username === user_register.value);
        const userWithSameEmail = existingUsers.find(user => user.email === mail_register.value);

        if (!userWithSameUsername && !userWithSameEmail) {
            // Adding the new user to LocalStorage
            existingUsers.push(newUser);

            // Storing the updated list in localStorage
            localStorage.setItem('users', JSON.stringify(existingUsers));
        } else {
            // User with the same username or email already exists
            text_modal.innerHTML = "Error... A user with this username or email already exists";
            modalError.style.display = "block";
        }
        document.getElementById("loading").style.display = 'none';
    }
});

function generateUserId() {
    return Date.now().toString();
}

const PostData = (data) => {
    let msg__modal = "";
    msg__modal += `<b>User:</b> ${data.username}<br>`;
    msg__modal += `<b>E-mail:</b> ${data.email}<br>`;
    msg__modal += `<b>Password:</b> ${data.password}<br>`;
    /* msg__modal += `<b>Address:</b> ${data.address.street}<br>`;
    msg__modal += `<b>City:</b> ${data.address.city}<br>`;
    msg__modal += `<b>Phone:</b> ${data.phone}<br>`; */

    document.querySelector('.modal__paragraph').innerHTML = msg__modal;
    modal.classList.add('modal--show');
};

// Hidden passowrd
document.getElementById('hidden-password').addEventListener('change', (e) => {
    if (document.getElementById('hidden-password').checked) {
        password_register.type = 'password';
        password_confirm.type = 'password';
    } else {
        password_register.type = 'text';
        password_confirm.type = 'text';
    }
});

// Login
////////////////////////////////////////////////////////////
let btn_ready_login = document.querySelector("#btn__ready-login");
let user_login = document.querySelector("#user-login");
let password_login = document.querySelector("#password-login");

btn_ready_login.addEventListener('click', () => {
    let msg = "";
    if (user_login.value == "" || password_login.value == "") {
        msg = "Error... All fields are required";
    }
    if (msg != "") {
        text_modal.innerHTML = msg;
        modalError.style.display = "block";
    } else {
        document.getElementById("loading").style.display = 'block';

        // Getting the list of users stored in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Searching for the user with the provided credentials
        const matchingUser = users.find(user => user.username === user_login.value && user.password === password_login.value);

        if (matchingUser) {
            // Valid user, showing the modal window or other actions
            document.querySelector('.modal__title').innerHTML = "You have successfully logged in!";
            modal.classList.add('modal--show');
        } else {
            // Incorrect user or password
            text_modal.innerHTML = "Error... Username of Password are wrong. Try again.";
            modalError.style.display = "block";
        }
        document.getElementById("loading").style.display = 'none';
    }
});
