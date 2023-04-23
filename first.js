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

document.getElementById("switchRegister").addEventListener("click", () => {
    switchToRegister();

    const registerButton = document.getElementById('registerButton');

    registerButton.addEventListener('click', () => {

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob').value;
        const password = document.getElementById('password').value;
        
    
        checkForDuplicateUser(username).then(duplicateExists => {
        if (duplicateExists) {
          errorDisplay(`Korisničko ime ${username} već postoji.`);
        } else {
          if (username.length > 0 && email.length > 0 && dob.length > 0 && password.length > 0 ) {
            db.collection('Korisnici').add({
                    username: `${username}`,
                    email: `${email}`,
                    dob: `${dob}`,
                    password: `${password}`
                }).then((docRef) => {
                    console.log('Račun upisani u DB sa id: ', docRef.id);
                    glavnaAplikacija(docRef.id);
                })
                .catch((error) => {
                    errorDisplay('Error adding document: ', error);
                });
        } else {
            errorDisplay('Upišite validno korisničko podatke')
        }
        }
        })
         .catch(error => {
             errorDisplay("Problem sa provjeravanjem postojanja korisničkog imena:", error);
        });
    });
})

function switchToRegister() {
    console.log("switchToRegister")
    let body = document.getElementsByClassName("container")[0];

    body.innerHTML = `<h4>Napravite novi račun</h4><label for="username">Korisničko ime:</label><br><input type="text" id="username" name="username"><br><label for="email">Vaš kontakt email:</label><br><input type="email" id="email" name="email"><br><label for="dob">Datum rođenja:</label><br><input type="date" min="1900-01-01" id="dob" name="dob"><br><label for="password">Lozinka:</label><br><input type="password" id="password" name="password"><br><button class="waves-effect red darken-1 btn" id="registerButton">Napravi račun</button> <br><a class="register-link" id="switchLogin">Imaš korisnički račun? Ulogiraj se!</a>`

    document.getElementById("switchLogin").addEventListener("click", () => {
        switchToLogin();
    })
}

function switchToLogin() {
    console.log("switchToLogin");
    let body = document.getElementsByClassName("container")[0];

    body.innerHTML = `<h4>Ulogiraj se u svoj račun</h4><label for="username">Korisničko ime:</label><br><input type="text" id="username" name="username"><br><label for="password">Lozinka:</label><br><input type="password" id="password" name="password"><button class="waves-effect red darken-1 btn" id="loginButton">Ulogiraj se</button> <br><a class="register-link" id="switchRegister">Nemaš korisnički račun? Napravi svoj!</a>`;
    document.getElementById("switchRegister").addEventListener("click", () => {
        switchToRegister();
    })
}

function glavnaAplikacija(idKorisnika) {
    localStorage.setItem('idkorisnika', idKorisnika); // u localstorage je spremljen id korisnika koji se posli korsiti za pregled jel korisnik ulogiran

    window.location.href = '/main/index.html'; // redirect na glavni app
}

// sve pomocne funkcije se nalaze u ./main/helper.js
// pomocne funkcije koristene u ovoj datoteci su: errorDisplay, checkForDuplicateUser i switchToRegister