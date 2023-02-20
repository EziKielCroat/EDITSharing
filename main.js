
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

  // Ulogiranje korisnika I izrada novog računa korisnika

loginButton.addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username.length > 0 && password.length > 0) {
        db.collection("Korisnici").where("username", "==", `${username}`).where("password", "==", `${password}`).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                let obj = doc.data(); // obj je objekt koji nije prazan ako je nasa korisnika koji se podudara u db
                if (Object.keys(obj).length > 0) {
                    glavnaAplikacija();
                    console.log(obj); // ovdje ide logika za nastavit aplikaciju u dio di mos djelit dokumente
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
            glavnaAplikacija();
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    } else {
        alert("Upišite validno korisničko ime i lozinku.")
    }
});

// Glavne funkcije

function glavnaAplikacija() {
    alert("OK!"); // ovdje ide glavna aplikacija
}

  // Otvaranje Question Modala ako korisnika zanima što i kako naša aplikacija osoba.
function questionModal() {
    const elem = document.getElementById('modal1');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

