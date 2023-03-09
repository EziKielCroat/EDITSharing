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
           input.accept = ''; // bez ovog neradi na chromeu

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
        event.preventDefault(); // prilagodi tako da dodamo da neuploda odma
        handleFiles(event.dataTransfer.files);
    });

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
}

// logika za input prozor p2p

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
           submitButton.addEventListener('click', () => {
            handleFiles(files);
           });
        };
        input.click();
    });

    dropzone.addEventListener('drop', (event) => {
        const files = event.dataTransfer.files;
        const file = files[0];

        event.preventDefault(); // prilagodi tako da dodamo da neuploda odma
        document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
        document.getElementById('submitButton').classList.remove('disabled');
        submitButton.addEventListener('click', () => {
            handleFiles(files);
        });
    });

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    connectButton.addEventListener('click', () => {
        postaviSpajanjeModal();
    })
}

// direktira datoteku na odredeni mod oviseći o sharingmodu odabranom
function handleFiles(files) {
    const file = files[0];

    if (files.length > 0) {
        if (sharingMode === 'p2p') {
            p2pHandler(file);
            window.file = file; // za p2pHandler datoteku koju djeli mozda zaminit da passan kao argument nego u window variabli
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

function p2pMode() { 
    // priprema p2p mode i otvara prozor za input datoteka
    // pali se klikom na p2p opciju u dropdownu (+)
    sharingMode = 'p2p';

    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button><br><p>ili</p><button class="btn waves-effect red lighten-1" type="submit" name="action" id="connectButton">Spoji se s drugima!</button> <br>'
    document.getElementsByClassName('container')[0].appendChild(inputHolder);

    inputFunctionsP2P(); // pali funkcije za prozor

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}

function s2pMode() { 
    // priprema s2p mode i otvara prozor za input datoteka
    // pali se klikom na s2p opciju u dropdownu (+)
    sharingMode = 's2p';

    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName("container")[0].appendChild(inputHolder);

    inputFunctionsS2P(); // pali funkcije za prozor

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}


function postaviSpajanjeModal() {
    // modal u kojem se upisuje kratki id druge osobe
    let connectionModal2 = document.createElement("div");
    connectionModal2.setAttribute('class', 'connection-modal');
    connectionModal2.innerHTML = `<div id="modalConnection2" class="modal"><div class="modal-content"><h4>Početak spajanja</h4><p>Kako bi uspostavili konekciju između druge osobe, mora te upisat ID koji su vam poslali. Nakon što upišete ID i stisnete Spoji se gumb, zatvoriti će se modal I moći će te odabrati želi te li skinitu datoteku. U desnom kutu imate opciju izmjenjivanja poruka između druge osobe također preko peer to peer protokola.</p> <input id="upisaniID" placeholder="Vaš ID ovdje.."><button class="btn waves-effect waves-green red lighten-1" type="submit" name="action" id="submitIDButton" onclick="predSpajanjeKorisnika();">Spoji se</button></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">Dobro</a></div></div>`
    document.getElementsByClassName("container")[0].appendChild(connectionModal2);
    openModal('modalConnection2');
}

// pomocne funkcije su u helper.js
