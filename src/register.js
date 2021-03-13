const firebaseConfig = {
    apiKey: "AIzaSyCn9XYetl-5xelpiRMou8Z81RtnGGZKOYo",
    authDomain: "notes-94b21.firebaseapp.com",
    projectId: "notes-94b21",
    storageBucket: "notes-94b21.appspot.com",
    messagingSenderId: "238939350494",
    appId: "1:238939350494:web:79a3109cd59343c7ca294f"
};

firebase.initializeApp(firebaseConfig);

const registerButton = document.querySelector('.register-button');
registerButton.addEventListener('click', registerUser);

function registerUser() {

    const emailInput = document.querySelector('#email-input');
    const passwordInput = document.querySelector('#password-input');

    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then((user) => {

            const container = document.querySelector('.container');
            container.innerHTML = `
                <div class="registered-message">Usuario registrado</div>
                <button class="main-button register-button">Ir a la página principal</button>`;
            document.querySelector('.main-button').addEventListener('click', () => {
                window.location.href = "./main.html";
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            console.log(errorCode);
            if (errorCode === 'auth/invalid-email') {
                emailInput.style.border = "solid 2px red";
            }
            else {
                emailInput.style.border = '';
            }
            if (errorCode === 'auth/weak-password') {
                passwordInput.style.border = "solid 2px red";
            }
            else {
                passwordInput.style.border = '';
            }
        });
}


