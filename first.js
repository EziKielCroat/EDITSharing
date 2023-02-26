M.AutoInit();

const firebaseConfig = {
    apiKey: "AIzaSyBynaVPHtPVT2u33R9Du3wJaWs694Cvi4w",
    authDomain: "editsharing-38e1f.firebaseapp.com",
    projectId: "editsharing-38e1f",
    storageBucket: "editsharing-38e1f.appspot.com",
    messagingSenderId: "137256725440",
    appId: "1:137256725440:web:d2e074d22b10ffe3a9f625",
    measurementId: "G-40DV23GZLC"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

// cekiranje jel korisnik već ulogiran ako je prosljedi ga na glavnu app

window.onload = function () {
    if (localStorage.getItem('idkorisnika') !== null) {
        window.location.href = '/main/index.html';
    }
}

// Ulogiranje korisnika

loginButton.addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (username.length > 0 && password.length > 0) {
        db.collection('Korisnici').where('username', '==', `${username}`).where('password', '==', `${password}`).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                let obj = doc.data();
                console.log("a");// obj je objekt koji nije prazan ako je nasa korisnika koji se podudara u db
                if (Object.keys(obj).length > 0) {
                    glavnaAplikacija(doc.id);
                } else {
                    errorDisplay('Račun sa upisanim korisničkim imenom i lozinkom ne postoji.');
                }
            });
        });
    } else {
        errorDisplay('Upišite validno korisničko ime i lozinku.');
    }
});

// izrada računa // mozda dodaj da nemogu bit vise korisnika s istin imenom

registerButton.addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (username.length > 0 && password.length > 0) {
        db.collection('Korisnici').add({
                username: `${username}`,
                password: `${password}`,

            }).then((docRef) => {
                console.log('Document written with ID: ', docRef.id);
                glavnaAplikacija(docRef.id);
            })
            .catch((error) => {
                errorDisplay('Error adding document: ', error);
            });
    } else {
        errorDisplay('Upišite validno korisničko ime i lozinku.')
    }
});

function glavnaAplikacija(idKorisnika) {
    localStorage.setItem('idkorisnika', idKorisnika); // u localstorage je spremljen id korisnika koji se posli korsiti za pregled jel korisnik ulogiran

    window.location.href = '/main/index.html'; // redirect na glavni app
}

function openModal(modal) {
    const elem = document.getElementById(modal);
    const instance = M.Modal.init(elem, {
        dismissible: false
    });
    instance.open();
}

function errorDisplay(msg) {
    let errorHolder = document.createElement("div");

    errorHolder.setAttribute("class", "error-holder");

    errorHolder.innerHTML = `<div id="modalError" class="modal"><div class="modal-content"><h4>Pogreška</h4><p>${msg}</p> </div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-red btn-flat">Dobro</a></div></div>`
    document.getElementsByClassName("container")[0].appendChild(errorHolder);

    openModal('modalError');
}