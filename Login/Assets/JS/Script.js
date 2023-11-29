// Delete all LS and SS data. BEWARE!
function nuke() {
    localStorage.clear();
    sessionStorage.clear();
}

// Selectors
const containerLoginRegister = document.querySelector(".container__login-register");
const formLogin = document.querySelector(".form__login");
const formRegister = document.querySelector(".form__register");
const boxBackLogin = document.querySelector(".box__back-login");
const boxBackRegister = document.querySelector(".box__back-register");
const modalError = document.getElementById("myModal");
const span = document.getElementById("close");
const textModal = document.getElementById("text-modal");
const instructionLogin = document.querySelector("#inst-login");
const instructionRegister = document.querySelector("#inst-register");
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');
const btnReadyRegister = document.querySelector("#btn__ready-register");
const mailRegister = document.querySelector("#mail-register");
const userRegister = document.querySelector("#user-register");
const passwordRegister = document.getElementById("password_register");
const passwordConfirm = document.getElementById("password_confirm");
const btnReadyLogin = document.querySelector("#btn__ready-login");
const userLogin = document.querySelector("#user-login");
const passwordLogin = document.querySelector("#password-login");

// Event Listeners
window.addEventListener("resize", handleResize);
document.getElementById("btn__iniciar-sesion").addEventListener("click", handleLoginClick);
document.getElementById("btn__registrarse").addEventListener("click", handleRegisterClick);
span.onclick = () => modalError.style.display = "none";
window.onclick = (event) => {
    if (event.target == modalError) {
        modalError.style.display = "none";
    }
};
instructionLogin.addEventListener("click", showLoginInstructions);
instructionRegister.addEventListener("click", showRegisterInstructions);
closeModal.addEventListener('click', handleCloseModal);
btnReadyRegister.addEventListener('click', handleRegister);
document.getElementById('hidden-password').addEventListener('change', handleTogglePassword);
btnReadyLogin.addEventListener('click', handleLogin);

// Functions
function handleResize() {
    if (window.innerWidth > 850) {
        boxBackLogin.style.display = "block";
        boxBackRegister.style.display = "block";
    } else {
        boxBackRegister.style.display = "block";
        boxBackRegister.style.opacity = "1";
        boxBackLogin.style.display = "none";
        formLogin.style.display = "block";
        formRegister.style.display = "none";
        containerLoginRegister.style.left = "0px";
    }
}

function handleLoginClick() {
    if (window.innerWidth > 850) {
        formRegister.style.display = "none";
        containerLoginRegister.style.left = "10px";
        formLogin.style.display = "block";
        boxBackRegister.style.opacity = "1";
        boxBackLogin.style.opacity = "0";
    } else {
        formRegister.style.display = "none";
        containerLoginRegister.style.left = "0px";
        formLogin.style.display = "block";
        boxBackRegister.style.display = "block";
        boxBackLogin.style.display = "none";
    }
}

function handleRegisterClick() {
    if (window.innerWidth > 850) {
        formRegister.style.display = "block";
        containerLoginRegister.style.left = "410px";
        formLogin.style.display = "none";
        boxBackRegister.style.opacity = "0";
        boxBackLogin.style.opacity = "1";
    } else {
        formRegister.style.display = "block";
        containerLoginRegister.style.left = "0px";
        formLogin.style.display = "none";
        boxBackRegister.style.display = "none";
        boxBackLogin.style.display = "block";
        boxBackLogin.style.opacity = "1";
    }
}

function showLoginInstructions() {
    textModal.innerHTML =
        "You can use any of the usernames and passwords from the available users in the user API. New users will be temporarily stored in LocalStorage.";
    modalError.style.display = "block";
}

function showRegisterInstructions() {
    textModal.innerHTML =
    "Due to the absence of a POST option in this API, a provisional save is performed in LocalStorage to enable the use of the web application.";
    modalError.style.display = "block";
}

function handleCloseModal() {
    modal.classList.remove('modal--show');
    setTimeout(reload, 850);
}

function reload() {
    window.location = "../index.html";
}

// Async await function for singup.
async function handleRegister() {
    let msg = validateRegistration();
    if (msg) {
        textModal.innerHTML = msg;
        modalError.style.display = "block";
    } else {
        document.getElementById("loading").style.display = "block";
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        const newUserId = await getUserMaxId();

        const newUser = {
            id: newUserId,
            username: userRegister.value,
            email: mailRegister.value,
            password: passwordConfirm.value,
        };
        handleExistingUserCheck(existingUsers, newUser);
        handleLoginClick();
        document.getElementById("loading").style.display = "none";
    }
}

function validateRegistration() {
    let msg = "";
    if (userRegister.value.length < 8) {
        msg += "<br>Error... Username must have at least 8 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailRegister.value)) {
        msg += "<br>Error... Email is not valid.";
    }
    const passwordRegex = /^[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordRegister.value)) {
        msg += "<br>Error... The password must have at least 8 characters";
    }
    if (mailRegister.value == "" || userRegister.value == "" || passwordRegister.value == "" || passwordConfirm.value == "") {
        msg = "<br>Error... All fields are required";
    } else if (passwordRegister.value != passwordConfirm.value) {
        msg += "<br>Error... Passwords do not match";
    }
    return msg;
}

function handleExistingUserCheck(existingUsers, newUser) {
    const userWithSameUsername = existingUsers.find(user => user.username === newUser.username);
    const userWithSameEmail = existingUsers.find(user => user.email === newUser.email);

    if (userWithSameUsername || userWithSameEmail) {
        textModal.innerHTML = "Error... A user with this username or email already exists";
        modalError.style.display = "block";
        document.getElementById("loading").style.display = 'none';
    } else {
        addNewUser(existingUsers, newUser);
    }
}

function addNewUser(existingUsers, newUser) {
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    document.getElementById("loading").style.display = 'none';
}

async function getUserMaxId() {
    const apiUrl = 'https://fakestoreapi.com/users';
    try {
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (json.length > 0) {
            const lastClientId = json[json.length - 1].id;
            return lastClientId + 1;
        }
    } catch (error) {
        console.error('Error... Getting the Full Client List:', error);
    }
}

function handleTogglePassword() {
    const isHidden = document.getElementById('hidden-password').checked;
    passwordRegister.type = isHidden ? 'password' : 'text';
    passwordConfirm.type = isHidden ? 'password' : 'text';
}

function handleLogin() {
    let msg = validateLogin();
    if (msg) {
        textModal.innerHTML = msg;
        modalError.style.display = "block";
    } else {
        document.getElementById("loading").style.display = 'block';
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchingUser = users.find(user => user.username === userLogin.value && user.password === passwordLogin.value);
        sessionStorage.setItem('loggedInUser', matchingUser.username);
        handleLoginResult(matchingUser);
        reload();
        document.getElementById("loading").style.display = 'none';
    }
}

function validateLogin() {
    let msg = "";
    if (userLogin.value == "" || passwordLogin.value == "") {
        msg = "Error... All fields are required";
    }
    return msg;
}

function handleLoginResult(matchingUser) {
    if (matchingUser) {
        document.querySelector('.modal__title').innerHTML = "You have successfully logged in!";
        modal.classList.add('modal--show');
    } else {
        textModal.innerHTML = "Error... Username or Password are wrong. Try again.";
        modalError.style.display = "block";
    }
    document.getElementById("loading").style.display = 'none';
}