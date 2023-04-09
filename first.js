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

// gleda jel korisnik vec ulogiran, ako je prosljedi na glavni app

window.onload = function () {
    if (localStorage.getItem('idkorisnika') !== null) {
        window.location.href = '/main/index.html';
    }
}

// Ulogiranje korisnika

loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username.length > 0 && password.length > 0) {
        db.collection('Korisnici').where('username', '==', `${username}`).where('password', '==', `${password}`).get().then((querySnapshot) => {
            if(querySnapshot.empty) {
                errorDisplay('Račun sa upisanim korisničkim imenom i lozinkom ne postoji.');
            } else {
                querySnapshot.forEach(doc => {
                glavnaAplikacija(doc.id);
            });
            }
        });
    } else {
        errorDisplay('Upišite validno korisničko ime i lozinku.');
    }
});

// Izrada računa 

registerButton.addEventListener('click', () => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    checkForDuplicateUser(username).then(duplicateExists => {
    if (duplicateExists) {
      errorDisplay(`Korisničko ime ${username} već postoji.`);
    } else {
      if (username.length > 0 && password.length > 0 && checkForDuplicateUser(username)) {
        db.collection('Korisnici').add({
                username: `${username}`,
                password: `${password}`,

            }).then((docRef) => {
                console.log('Račun upisani u DB sa id: ', docRef.id);
                glavnaAplikacija(docRef.id);
            })
            .catch((error) => {
                errorDisplay('Error adding document: ', error);
            });
    } else {
        errorDisplay('Upišite validno korisničko ime i lozinku.')
    }
    }
    })
     .catch(error => {
         errorDisplay("Problem sa provjeravanjem postojanja korisničkog imena:", error);
    });
});

function glavnaAplikacija(idKorisnika) {
    localStorage.setItem('idkorisnika', idKorisnika); // u localstorage je spremljen id korisnika koji se posli korsiti za pregled jel korisnik ulogiran

    window.location.href = '/main/index.html'; // redirect na glavni app
}

// sve pomocne funkcije se nalaze u ./main/helper.js
// pomocne funkcije koristene u ovoj datoteci su: errorDisplay, checkForDuplicateUser