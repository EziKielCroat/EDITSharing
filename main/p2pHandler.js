
function p2pHandler(file) {
    // uspostavit p2p konekciju nekako
    let peer = new Peer( {debug: 1});
    peer.on('open', (id) => {
        const shortID = generateWord(); // ovo je id koji ce se prikazat korisniku, a ovaj id je povezan u firebaseu sa dugin idon
        const data = {
            shortID: shortID,
            longID: id
        };
        db.collection("AktivneKonekcije").doc().set(data).then(() => {
            // otvori modal i podjeli kratki id korisniku
            let connectionModal = document.createElement("div");
            connectionModal.setAttribute('class', 'connection-modal');
            connectionModal.setAttribute('id', 'connection-modal');
            connectionModal.innerHTML = `<div id="modalConnection" class="modal"><div class="modal-content"><h4>Početak djeljenja</h4><p>Kako bi ste uspostavili konekciju između druge osobe, mora te im prosljediti svoj ID. Nakon toga, osobi će se pokazati žele li primiti datoteku koju šaljete. Molimo Vas da ne zatvarate prozor jer će prekinuti vašu konekciju.</p> <p>Vaš ID: ${shortID}</p></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">Dobro</a></div></div>`
            document.getElementsByTagName('body')[0].appendChild(connectionModal);

            openModal('modalConnection');
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    });

    peer.on('connection', (conn) => {
        conn.on('open', function() {
            // Receive messages
            const sendingFile = window.file;
            let sendingBlob;

            if(sendingFile.type) {
                sendingBlob = new Blob([sendingFile], {type: sendingFile.type});
            }else {
                sendingBlob = new Blob([sendingFile], {type: "application/octet-stream"});
            }

            conn.on('data', function(data) {
                 console.log('Received', data);
            });
            
            conn.send({data: sendingBlob, sending: 'file', fileName: sendingFile.name});
          });
    });
}

function predSpajanjeKorisnika() {
    // uzmi short id i nadi long
    const shortID = document.getElementById("upisaniID").value;

    db.collection('AktivneKonekcije').where("shortID", "==", shortID).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
            let obj = doc.data();
            if (Object.keys(obj).length > 0) {
                spojiKorisnika(obj.longID);
            } else {
                errorDisplay('Veza ne postoji.');
            }
        });
    });

    closeModal('modalConnection2');
}

function spojiKorisnika(longID) {
    const peer = new Peer();

    peer.on('open', () => {
        const conn = peer.connect(longID);
        conn.on('open', () => {
            // ovdi pocinje slanje izmedu peera
            
            conn.send("radi pls");
        });

        conn.on('data', (data) => {
            if(data.sending === 'file') {
                prikaziDatoteku(data);
            } else {
                // mozda dodan chat
            }
            console.log('Recived', data);
        });
    });
}

function prikaziDatoteku(data) {
    const container = document.getElementsByClassName("input-holder")[0];
    let file = new File([data], data.fileName, {type: data.type});
    let fileHolder = document.createElement("div");

    fileHolder.setAttribute('class', 'file-holder');
    fileHolder.setAttribute('id', 'fileHolder');

    fileHolder.innerHTML = `<div id="drag-drop2">Korisnik vam želi poslati datoteku: ${file.name}</div> <button class="btn waves-effect waves-green red lighten-1" id="downloadButton">Preuzmi datoteku</button>`
    container.innerHTML = '';
    container.appendChild(fileHolder);
    const downloadButton = document.getElementById('downloadButton');

    downloadButton.addEventListener('click', () => {
        downloadFile(file, file.name);
    });
}

function downloadFile(fileObj, fileName) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      downloadFileMobile(fileObj, fileName);
    } else {
      console.log(getMimeType(fileName));
      const fileType = fileObj.type || getMimeType(fileName);
      console.log(fileType);
      downloadFileDesktop(fileObj, fileName, fileType);
    }
  }
  
  function downloadFileDesktop(fileObj, fileName, fileType) {
    const url = URL.createObjectURL(fileObj);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.type = fileType;
    
    document.body.appendChild(a);
    
    a.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log(`File ${fileName} downloaded successfully.`);
    });
    
    a.click();
  }
  
  function downloadFileMobile(fileObj, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(fileObj, fileName);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const tempLink = document.createElement('a');
        tempLink.href = reader.result;
        tempLink.setAttribute('download', fileName);
        tempLink.click();
      };
      reader.readAsDataURL(fileObj);
    }
  }

function getMimeType(fileName) {
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
  
  
  
function closeModal(modal) {
    const elem = document.getElementById(modal);
    const instance = M.Modal.init(elem, {
        dismissible: false
    });
    instance.close();
}