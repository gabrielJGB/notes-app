const firebaseConfig = {
    apiKey: "AIzaSyCn9XYetl-5xelpiRMou8Z81RtnGGZKOYo",
    authDomain: "notes-94b21.firebaseapp.com",
    projectId: "notes-94b21",
    storageBucket: "notes-94b21.appspot.com",
    messagingSenderId: "238939350494",
    appId: "1:238939350494:web:79a3109cd59343c7ca294f"
};

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

firebase.initializeApp(firebaseConfig);

const logInButton = document.querySelector('.log-in');
logInButton.addEventListener('click',showLogInForm);

function showLogInForm(){
    const accessForm = document.querySelector('.access-form');
    const closeButton = document.querySelector('.close-button');
    
    accessForm.style.top = "12vh";
    closeButton.addEventListener('click',()=>{
        accessForm.style.top = "-100vh";
    });
}

const accessButton = document.querySelector('.access-button');
accessButton.addEventListener('click', accessUser);

function accessUser(e) {
    e.preventDefault();
    const emailInput = document.querySelector('#email-input').value;
    const passwordInput = document.querySelector('#password-input').value;

    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
        .then((user) => {
            console.log("logged");
	        location.assign(`./main.html`);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });

}
let x = 32;

function userState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
	    location.assign(`./main.html#${x}`);
        }
    });
}

userState();

