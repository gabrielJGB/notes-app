const firebaseConfig = {
    apiKey: "AIzaSyCn9XYetl-5xelpiRMou8Z81RtnGGZKOYo",
    authDomain: "notes-94b21.firebaseapp.com",
    projectId: "notes-94b21",
    storageBucket: "notes-94b21.appspot.com",
    messagingSenderId: "238939350494",
    appId: "1:238939350494:web:79a3109cd59343c7ca294f"
};

// console.log(location.hash.replace("#", ""));
firebase.initializeApp(firebaseConfig);
let currentUser = '';
var db = firebase.firestore();

checkUserState();

function checkUserState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const username = document.querySelector('.user');
            username.textContent = user.email;
            currentUser = user.email;
            //get data form database
            getDataFromDatabase();
        }
        else {
            window.location.href = "./index.html";
        }
    });
}


function getDataFromDatabase() {
    const itemContainer = document.querySelector('.item-container');

    db.collection(currentUser).onSnapshot((querySnapshot) => {
        itemContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {

            if (!querySnapshot.empty) {
                console.log("if")
                const itemContainer = document.querySelector('.item-container');
                let item = document.createElement('FORM');
                item.setAttribute('data-id', doc.id);
                item.className = "item";
                item.innerHTML += `
            
            <div class="item-header">
                <div class="left">
                    <div class="back-button"> &#129128;</div>
                    <input class="item-title" placeholder="Título" value="${doc.data().title}">
                    <div class="delete-button" onlclick="deleteNote()">&#128465;</div>
                </div>
                
                <div class="date">${doc.data().date}</div>
            </div>
            <textarea class="item-content" placeholder="Vacío">${doc.data().content}</textarea>
        
            <div class="item-footer">
                <button class="accept-button">Guardar</button>
            </div>
            `;

                item.addEventListener('click', itemClick);
                item.addEventListener('input', () => {
                    dataChanged = true;
                });

                itemContainer.appendChild(item);
                newItem = false;
            }
            else{
                console.log("else")
                itemContainer.innerHTML = 'Vacío';
            }
        });

    });
}


function logOut() {
    firebase.auth().signOut().then(() => {
        console.log("deslogeado");
        window.location.href = "./index.html";

    }).catch((error) => {
        console.log(error);
    })
}



let dataChanged = false;
let newItem = false;




function itemClick(e) {
    e.preventDefault();
    if (!this.classList.contains("item-open")) {
        toggleItem(this);
    }
    else {
        if (e.target.classList.contains("back-button")) { //si se cierra el item
            toggleItem(this);

            if (dataChanged) { //checkear si hay cambios -> actualizar date -> guardar info en database
                //actualizar los input                
                let title = this.children[0].children[0].children[1].value;
                let content = this.children[1].value;
                let id = this.attributes[0].value;
                let date = new Date().toLocaleString();
                // this.children[0].children[1].textContent = date;

                if (!newItem) { //editando item
                    editItemInDatabase(title, content, id, date) //aca le tengo que mandar  la id

                }
                else { //creando item. Necesito tomar los datos de los inputs y dsps recien guardarlos en la db. 
                    createItemInDatabase(title, content, date);
                }
                dataChanged = false;

            }

        }
    }
}

function toggleItem(item) {
    item.classList.toggle("item-open");
    item.children[0].children[0].children[0].classList.toggle("back-button-open");
    item.children[1].classList.toggle("item-content-open");
    // item.children[1].disabled ? item.children[1].disabled = false : item.children[1].disabled = true;
    item.children[0].classList.toggle('item-header-open');
    item.children[2].classList.toggle('item-footer-open');
    // item.parentNode.parentNode.children[1].classList.toggle('modal-open');
    item.children[0].children[0].children[2].classList.toggle('delete-button-open');

    // if (document.querySelector('body').style.overflow === "hidden") {
    //     document.querySelector('body').style.overflow = "";
    // }
    // else {
    //     document.querySelector('body').style.overflow = "hidden";
    // }
}

function createItemInDatabase(title, content, date) {

    db.collection(currentUser).add({
        title: title,
        content: content,
        date: date
    }).then((docRef) => {
        console.log("saved");
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}


function editItemInDatabase(title, content, id, date) {


    var note = db.collection(currentUser).doc(id);
    return note.update({
        title: title,
        content: content,
        date: date
    })
        .then(() => {
            console.log("Edit ok");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });


}

const addItemButton = document.querySelector('.add-item-button');
addItemButton.addEventListener('click', () => {
    addNewItem()
});

function addNewItem(title = "", content = "") {
    const itemContainer = document.querySelector('.item-container');
    let item = document.createElement('FORM');

    item.className = "item item-open";
    item.innerHTML += `
    
    <div class="item-header item-header-open">
        <div class="left">
            <div class="back-button back-button-open"> &#129128;</div>
            <input class="item-title" placeholder="Título" value="${title}">
            <div class="delete-button" onclick="deleteNote()" >&#128465;</div>
        </div>
        
        <div class="date">${new Date().toLocaleString()}</div>
    </div>
    <textarea class="item-content item-content-open" placeholder="Vacío">${content}</textarea>

    <div class="item-footer">
        <button class="accept-button">Guardar</button>
    </div>
    `;

    item.addEventListener('click', itemClick);
    item.addEventListener('input', () => {
        dataChanged = true;
    });

    itemContainer.appendChild(item);
    newItem = true;
}


function deleteNote() {

    if (confirm("Confirmar borrado")) {
        let id = this.attributes[0].value;
        db.collection(currentUser).doc(id).delete().then(() => {
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    else {
        return;
    }
}

 const logOutButton = document.querySelector('.log-out');
 logOutButton.addEventListener('click',logOut);

function logOut() {
    firebase.auth().signOut().then(() => {
        console.log("deslogeado");
        window.location.href = "./index.html";

    }).catch((error) => {
        console.log(error)
    })
}

