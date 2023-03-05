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
const ref = app.storage().ref();
let sharingMode = '';
let fileGlobal;

let inputHolder = document.createElement('div');
inputHolder.setAttribute("class", "input-holder");


// pregledavanje jeli korisnik 'ulogiran'
window.onload = function () {
    if (userID === null) {
        window.location.href = '/first.html';
    }
}

// logika za input prozor s2p
function inputFunctionsS2P() {

    const dropzone = document.getElementById('drag-drop');
    const submitButton = document.getElementById('submitButton');

    dropzone.addEventListener('click', () => {
        const input = document.createElement('input');
        input.setAttribute('class', 'hidden-element');
        input.type = 'file';
        input.onchange = (e) => {
           const files = e.target.files;
           const file = files[0];
           input.accept = ''; // add this line to specify the accepted file type
           document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
           document.getElementById('submitButton').classList.remove('disabled');
           submitButton.addEventListener('click', () => {
            handleFiles(e.target.files);
           });
        };
        document.body.appendChild(input);
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

function inputFunctionsP2P() {

    const dropzone = document.getElementById('drag-drop');
    const connectButton = document.getElementById("connectButton");
    const submitButton = document.getElementById('submitButton');

    dropzone.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
           const files = e.target.files;
           const file = files[0];

           document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
           document.getElementById('submitButton').classList.remove('disabled');
           document.getElementById('connectButton').classList.remove('disabled');
           submitButton.addEventListener('click', () => {
            handleFiles(files);
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

    connectButton.addEventListener('click', () => {
        postaviSpajanjeModal();
    })
}

// djeli fileove na svoje odredene funkcije(odrene od sharingmode variable)
function handleFiles(files) {
    const file = files[0];

    if (files.length > 0) {
        if (sharingMode === 'p2p') {
            p2pHandler(file);
            window.file = file;
            resetInput();
        } else if (sharingMode === 's2p') {
            s2pHandler(file, ref);
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

    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button><br><p>ili</p><button class="btn waves-effect red lighten-1" type="submit" name="action" id="connectButton">Spoji se s drugima!</button>'
    document.getElementsByClassName('container')[0].appendChild(inputHolder);

    inputFunctionsP2P();

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}

function s2pMode() { // priprema s2p mode i otvara prozor za input datoteka
    sharingMode = 's2p';

    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName("container")[0].appendChild(inputHolder);

    inputFunctionsS2P();

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}


function postaviSpajanjeModal() {
    let connectionModal2 = document.createElement("div");
    connectionModal2.setAttribute('class', 'connection-modal');
    connectionModal2.innerHTML = `<div id="modalConnection2" class="modal"><div class="modal-content"><h4>Početak spajanja</h4><p>Kako bi uspostavili konekciju između druge osobe, mora te upisat ID koji su vam poslali. Nakon što upišete ID i stisnete Spoji se gumb, zatvorit će se modal I moći će te odabrati želi te li skinitu datoteku. Ima te i opciju dopisivanja u desnom kutu.</p> <input id="upisaniID" placeholder="Vaš ID ovdje.."><button class="btn waves-effect waves-green red lighten-1" type="submit" name="action" id="submitIDButton" onclick="predSpajanjeKorisnika();">Spoji se</button></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">Dobro</a></div></div>`
    document.getElementsByClassName("container")[0].appendChild(connectionModal2);
    openModal('modalConnection2');
}

// pomocne funkcije

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

function copyToClipboard() {
  const text = document.getElementById("shortURL").innerText;
  const textarea = document.createElement('textarea');

  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function generateWord() {
    const numbers = '0123456789';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    let word = '';
    
    // bar jedan broj jedno veliko i malo slovo
    word += numbers[Math.floor(Math.random() * numbers.length)];
    word += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    word += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    
    // jos dva random slova/brojeva iz skupa svih
    for (let i = 0; i < 2; i++) {
      const characters = numbers + upperCaseLetters + lowerCaseLetters;
      word += characters[Math.floor(Math.random() * characters.length)];
    }
    
    const shuffledWord = word.split('').sort(() => 0.5 - Math.random()).join('');
    
    return shuffledWord;
  }