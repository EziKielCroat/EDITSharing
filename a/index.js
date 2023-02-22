M.AutoInit();

console.log(localStorage.getItem('idkorisnika'));

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

setTimeout(() => {
  if(localStorage.getItem('idkorisnika') == null) {
    window.location.href = '/';
  }
}, '100');

let mode = '';

function inputFunctions() {
  // sva logika za input prozor
const dropzone = document.getElementById('drag-drop');

dropzone.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.zip,.rar,.7z,.tar,.gz,.gzip';
  input.onchange = (e) => {
    handleFiles(e.target.files);
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


function handleFiles(files) { // mode je varijabla koju san stavija cisto da nepisen zasbne funkcije za sve 
if(mode == 'p2p') {
    if (files.length > 0) {
        const file = files[0];
          document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
          document.getElementById('submitButton').classList.remove('disabled');
          p2pHandler(file);
      }
} else if(mode == 's2p') {
    if (files.length > 0) {
        const file = files[0];
            document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
            document.getElementById('submitButton').classList.remove('disabled');
            s2pHandler(file);
      }
} else {
    alert('Kritična pogreška.');
    window.location.reload()
}
}

// Početak aplikacije

function p2pHandler(file) {

}

function s2pHandler(file) {

}

// Pomoćne funkcije

//Obije funkcije samo daju mode varijabli vrijednost i appenda input stvar
function p2pMode() {
    mode = 'p2p';
    let inputHolder = document.createElement('div');
    inputHolder.setAttribute('class', 'input-holder');
    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName('container')[0].appendChild(inputHolder);

    inputFunctions();

    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}

function s2pMode() {
    mode = 's2p';
    let inputHolder = document.createElement('div');
    inputHolder.setAttribute("class", "input-holder");
    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName("container")[0].appendChild(inputHolder);
    inputFunctions();
    document.getElementsByClassName('input-holder')[0].style.display = 'block';
}

// otvara question modal // refactorat modal mozda
function questionModal() {
  const elem = document.getElementById('modal1');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.open();
}


function accountModal() {
  const elem = document.getElementById('modal2');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.open();
}

function signOut() {
  localStorage.removeItem('idkorisnika');
  window.location.href = '/';
}

function promjeniIme() {
  let usernameNew = document.getElementById('promjenaImena').value;

  if(usernameNew.length > 0) {
    db.collection('Korisnici').doc(localStorage.getItem('idkorisnika')).update({
      username: `${usernameNew}`
    });
    document.getElementById('promjenaImena').value == '';

  }else {
    alert('Upišite validno ime');
    document.getElementById('promjenaImena').value == '';
  }
}

function promjeniLozinku() {
  let passwordNew = document.getElementById('promjenaLozinke').value;

  if(passwordNew.length > 0) {
    db.collection('Korisnici').doc(localStorage.getItem('idkorisnika')).update({
      password: `${passwordNew}`
    });
    document.getElementById('promjenaLozinke').value == '';
    
  }else {
    alert('Upišite validno prezime');
    document.getElementById('promjenaLozinke').value == '';
  }
}

