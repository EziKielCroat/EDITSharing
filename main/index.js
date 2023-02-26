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

// incijalizacija svega

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const userID = localStorage.getItem('idkorisnika');
const ref = app.storage().ref()
let sharingMode = '';

// pregledavanje jeli korisnik 'ulogiran'
window.onload = function () {
    if (userID === null) {
        window.location.href = '/first.html';
    }
}

// logika za input prozor
function inputFunctions() {

    const dropzone = document.getElementById('drag-drop');

    dropzone.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
           const files = e.target.files;
           const file = files[0];
           const submitButton = document.getElementById("submitButton");

           document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
           document.getElementById('submitButton').classList.remove('disabled');
           submitButton.addEventListener("click", () => {
            handleFiles(e.target.files);
           });
        };
        input.click();
    });

    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
    });

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
}

// djeli fileove na svoje odredene funkcije(odrene od sharingmode variable)
function handleFiles(files) {
    const file = files[0];

    if (files.length > 0) {
        if (sharingMode === 'p2p') {
            p2pHandler(file);
            resetInput();
        } else if (sharingMode === 's2p') {
            s2pHandler(file,ref);
            resetInput();
        } else { // nebi trebalo fireat al ako se desi eto
            errorDisplay('Kritična pogreška, mode nije definiran.');
            window.location.reload()
        }
    }
}

function promjeniIme() {
    let usernameNew = document.getElementById('promjenaImena').value;

    if (usernameNew.length > 0) {
        db.collection('Korisnici').doc(userID).update({
            username: `${usernameNew}`
        });
        document.getElementById('promjenaImena').value = '';

    } else {
        errorDisplay('Upišite validno ime');
        document.getElementById('promjenaImena').value = '';
    }
}

function promjeniLozinku() {
    let passwordNew = document.getElementById('promjenaLozinke').value;

    if (passwordNew.length > 0) {
        db.collection('Korisnici').doc(userID).update({
            password: `${passwordNew}`
        });
        document.getElementById('promjenaLozinke').value = '';
    } else {
        errorDisplay('Upišite validno prezime');
        document.getElementById('promjenaLozinke').value = '';
    }
}

function p2pMode() { // priprema p2p mode i otvara prozor za input datoteka
    sharingMode = 'p2p';

    let inputHolder = document.createElement('div');
    inputHolder.setAttribute('class', 'input-holder');
    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName('container')[0].appendChild(inputHolder);

    inputFunctions();

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}

function s2pMode() { // priprema s2p mode i otvara prozor za input datoteka
    sharingMode = 's2p';

    let inputHolder = document.createElement('div');
    inputHolder.setAttribute("class", "input-holder");
    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName("container")[0].appendChild(inputHolder);

    inputFunctions();

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}

// pomocne funkcije

// mozda opet napravit question modal

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

function signOut() {
    localStorage.removeItem('idkorisnika');
    window.location.href = '/first.html';
}

function resetInput() {
    document.getElementById("drag-drop").innerText = "Stisni ili ubaci datoteku koju želiš podjeliti";
    document.getElementById('submitButton').classList.add('disabled');
}