
function openModal(modal) {
    const elem = document.getElementById(modal);
    const instance = M.Modal.init(elem, {
        dismissible: false
    });
    instance.open();
}

function closeModal(modal) {
    const elem = document.getElementById(modal);
    const instance = M.Modal.init(elem, {
        dismissible: false
    });
    instance.close();
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

function promjeniIme() { // mjenja ime korisnika ulogiranog
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

// mjenja lozinku korisnika ulogiranog
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


function getMimeType(fileName) { // ako datoteka nema tip usere se sve pa ono mali fiks
    const types = {
        ".aac": "audio/aac",
        ".abw": "application/x-abiword",
        ".arc": "application/x-freearc",
        ".avif": "image/avif",
        ".avi": "video/x-msvideo",
        ".azw": "application/vnd.amazon.ebook",
        ".bin": "application/octet-stream",
        ".bmp": "image/bmp",
        ".bz": "application/x-bzip",
        ".bz2": "application/x-bzip2",
        ".cda": "application/x-cdf",
        ".csh": "application/x-csh",
        ".css": "text/css",
        ".csv": "text/csv",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".eot": "application/vnd.ms-fontobject",
        ".epub": "application/epub+zip",
        ".gz": "application/gzip",
        ".gif": "image/gif",
        ".htm": "text/html",
        ".html": "text/html",
        ".ico": "image/vnd.microsoft.icon",
        ".ics": "text/calendar",
        ".jar": "application/java-archive",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "text/javascript",
        ".json": "application/json",
        ".jsonld": "application/ld+json",
        ".mid": "audio/midi",
        ".midi": "audio/midi",
        ".mjs": "text/javascript",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".mpeg": "video/mpeg",
        ".mpkg": "application/vnd.apple.installer+xml",
        ".odp": "application/vnd.oasis.opendocument.presentation",
        ".ods": "application/vnd.oasis.opendocument.spreadsheet",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".oga": "audio/ogg",
        ".ogv": "video/ogg",
        ".ogx": "application/ogg",
        ".opus": "audio/opus",
        ".otf": "font/otf",
        ".png": "image/png",
        ".pdf": "application/pdf",
        ".php": "application/x-httpd-php",
        ".ppt": "application/vnd.ms-powerpoint",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".rar": "application/vnd.rar",
        ".rtf": "application/rtf",
        ".sh": "application/x-sh",
        ".svg": "image/svg+xml",
        ".tar": "application/x-tar",
        ".tif": "image/tiff",
        ".tiff": "image/tiff",
        ".ts": "video/mp2t",
        ".ttf": "font/ttf",
        ".txt": "text/plain",
        ".vsd": "application/vnd.visio",
        ".wav": "audio/wav",
        ".weba": "audio/webm",
        ".webm": "video/webm",
        ".webp": "image/webp",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".xhtml": "application/xhtml+xml",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
        const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        return types[extension] || 'application/octet-stream';
}