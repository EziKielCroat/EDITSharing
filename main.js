
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

let loginButton = document.getElementById("loginButton");
let registerButton = document.getElementById("registerButton");


// cekiranje jel korisnik već ulogiran ako je prosljedi ga na glavnu app
setTimeout(() => {
    if(localStorage.getItem("idkorisnika") !== null) {
      window.location.href = "/a/index.html";
    }
}, "100");


// Ulogiranje korisnika I izrada novog računa korisnika

loginButton.addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username.length > 0 && password.length > 0) {
        db.collection("Korisnici").where("username", "==", `${username}`).where("password", "==", `${password}`).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                let obj = doc.data(); // obj je objekt koji nije prazan ako je nasa korisnika koji se podudara u db
                if (Object.keys(obj).length > 0) {
                    glavnaAplikacija(doc.id);
                } else {
                    alert("Račun sa upisanim korisničkim imenom i lozinkom ne postoji.")
                }
            })
        });
    } else {
        alert("Upišite validno korisničko ime i lozinku.");
    }
});

registerButton.addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username.length > 0 && password.length > 0) { 
        db.collection("Korisnici").add({
            username: `${username}`,
            password: `${password}`,

        }).then((docRef) => {
            // ovdi dodat logiku za nastavljanje aplikacije
            console.log("Document written with ID: ", docRef.id);
            glavnaAplikacija(docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    } else {
         alert("Upišite validno korisničko ime i lozinku.")
    }
});

// Glavne funkcije

function glavnaAplikacija(idKorisnika) {
    // idKorisnika stavljan u webstorage tako da se moze provjerit u glavnoj app jel korisnik ulogiran
    localStorage.setItem("idkorisnika", idKorisnika);

    window.location.href = "/a/index.html";
}

// Pomoćne funkcije

function questionModal() { // otvara modal definiran u htmlu
    const elem = document.getElementById('modal1');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}
