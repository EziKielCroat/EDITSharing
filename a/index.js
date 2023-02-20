M.AutoInit();

const dropzone = document.getElementById('drag-drop');
let mode = '';

// postavljanje ondrop i click eventova(da mos i clicknit pa izade prozor i droppat file)

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

function handleFiles(files) { // mode je varijabla koju san stavija cisto da nepisen zasbne funkcije za sve 
if(mode == 'p2p') {
    if (files.length > 0) {
        const file = files[0];
        if (isCompressedFile(file)) {
          document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
          document.getElementById('submitButton').classList.remove('disabled');
          p2pHandler(file);
        } else {
          console.log('Nedozvoljen tip datoteke');
        }
      }
} else if(mode == "s2p") {
    if (files.length > 0) {
        const file = files[0];
        if (isCompressedFile(file)) {
            document.getElementById('drag-drop').innerText = `Odabrana datoteka: ${file.name}`
            document.getElementById('submitButton').classList.remove('disabled');
            s2pHandler(file);
        } else {
          console.log('Nedozvoljen tip datoteke');
        }
      }
} else {
    alert('Kritična pogreška.');
    window.location.reload()
}
}

function isCompressedFile(file) {
  const compressedTypes = [
    'application/octet-stream',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-zip-compressed',
    'application/x-tar',
    'application/gzip',
    'application/x-gzip',
    'application/x-rar-compressed',
    'application/x-compressed',
  ];
  console.log(file);
  return compressedTypes.includes(file.type);
}

// Početak aplikacije

function p2pHandler(file) {

}

function s2pHandler(file) {

}



// Pomoćne funkcije

//Obije funkcije samo daju mode varijabli vrijednost i appenda input stvar
function p2pMode() {
    mode = "p2p";
    let inputHolder = document.createElement('div');
    inputHolder.setAttribute("class", "input-holder");
    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName("container")[0].appendChild(inputHolder);
    document.getElementsByClassName("input-holder")[0].style.display = "block";
}

function s2pMode() {
    mode = "s2p";
    let inputHolder = document.createElement('div');
    inputHolder.setAttribute("class", "input-holder");
    inputHolder.innerHTML = '<div id="drag-drop">Stisni ili ubaci datoteku koju želiš podjeliti</div><button class="btn waves-effect red lighten-1 disabled" type="submit" name="action" id="submitButton">Djeli<i class="material-icons right">send</i></button>'
    document.getElementsByClassName("container")[0].appendChild(inputHolder);
    document.getElementsByClassName("input-holder")[0].style.display = "block";
}

// otvara question modal // refactorat modal mozda
function questionModal() {
    const elem = document.getElementById('modal1');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}