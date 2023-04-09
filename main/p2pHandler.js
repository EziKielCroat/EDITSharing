
let connGlobal;
let longIDGlobal;

function p2pHandler(file) {
    // inicijalizacija PeerJS konekcije
    const peer = new Peer( {debug: 1});

    peer.on('open', (id) => {
        const shortID = generateWord(); // ovo je kratki id koji prikazujemo korisniku
        const data = {
            shortID: shortID,
            longID: id
        };
        longIDGlobal = id;
        db.collection("AktivneKonekcije").doc().set(data).then(() => {

            // otvori modal i prikazi kratki id korisniku
            let connectionModal = document.createElement("div");

            connectionModal.setAttribute('class', 'connection-modal');
            connectionModal.setAttribute('id', 'connection-modal');
            connectionModal.innerHTML = `<div id="modalConnection" class="modal"><div class="modal-content"><h4>Početak djeljenja</h4><p>Kako bi ste uspostavili konekciju između druge osobe, mora te im prosljediti svoj ID. Nakon toga, osobi će se pokazati žele li primiti datoteku koju šaljete. Molimo Vas da ne zatvarate prozor jer će prekinuti vašu konekciju.</p> <p>Vaš ID: ${shortID}</p></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">Dobro</a></div></div>`
            document.getElementsByTagName('body')[0].appendChild(connectionModal);

            openModal('modalConnection');

            let cancelConnection = document.createElement('button');
            cancelConnection.setAttribute('class', 'btn waves-effect red lighten-1');
            cancelConnection.setAttribute('id', 'cancelConnection');
            cancelConnection.innerText = "Otkaži konekciju"

            document.getElementsByClassName('input-holder')[0].appendChild(cancelConnection);
            
            cancelConnection.addEventListener('click', () => {
                peer.destroy(); // zatvaranje otvorene konekcije
                cancelConnection.remove();
                makniKonekciju(id);
                resetInput();
            });
            // console.log("Uspješno upisana konkecije!");
          })
          .catch((error) => {
            errorDisplay('Pogreska pri pisanju datoteke: ', error);
          });
    });

    // PEER EVENTOVI

    // peer.on('connnection') se upali kad se uspostavi konekcija sa peerom
    peer.on('connection', (conn) => {
        // Kad se konekcija otvorit(sad mos slat i primat poruke u sigurnosti da se upalilo)
        conn.on('open', function() {
            const sendingFile = window.file; // file iz index.js koji djelimo
            const typeOf = sendingFile.type; 
            let sendingBlob;

            connGlobal = conn;
            //tribalo bi pogledat ponovno

            if(sendingFile.type) { // ako sendingFile.type je truthy stavit ce typeOf (nemoze sendingFile.type jer bude [object Object] (CORRUPTA FILE))
                sendingBlob = new Blob([sendingFile], {type: typeOf});
            } else { // generalni mime type
                sendingBlob = new Blob([sendingFile], {type: "application/octet-stream"});
            }

            conn.on('data', function(data) {
                 console.log('Primljeno: ', data);
            });

            // slanje objekta koji sadržava sve potrebno za file transfer
            conn.send({data: sendingBlob, sending: 'file', fileName: sendingFile.name});
            document.getElementsByClassName('chatbox-wrapper')[0].style.display = 'block'; // prikazivanje chat
          });

          conn.on('data', (data) => {
            if(data.sending === 'message') {
                prikaziPoruku(data);
            }
          });

          conn.on('close', () => {
            errorDisplay('Konekcija sa korisnikom je zatvorena. Stranica će se osvježit za 2 sekunde.');
            makniKonekciju(longIDGlobal);
            setTimeout(() => {
                window.location.reload();
              }, 2000); 
          });
    });

    peer.on('error', (err) => {
        errorDisplay(err);
    });
}

function predSpajanjeKorisnika() { 
    // prije spajanje korisnika moramo izvuci longID iz firebasea
    const shortID = document.getElementById('upisaniID').value;

    // uzimam shortID i nalazi doc u kojen se nalazi, pa iz tog doc-a izvlaci longID(peer.id) pošiljatelja
    db.collection('AktivneKonekcije').where('shortID', '==', shortID).get().then((querySnapshot) => {
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
    // inicijalizacija PeerJS konekcije
    const peer = new Peer({debug: 1});

    peer.on('open', () => {
        const conn = peer.connect(longID); // spajanje na longID povućen iz firebasea

        conn.on('open', () => {
            connGlobal = conn;
            conn.send('spojen'); // cisto za debugging

            conn.on('data', (data) => {
                if(data.sending === 'file') { // prikazivanje primljene datoteke(objekta(nije blob))
                    prikaziDatoteku(data, peer, longID);
                } else if(data.sending == 'message') {
                    prikaziPoruku(data);
                }
            });

            document.getElementsByClassName('chatbox-wrapper')[0].style.display = 'block'; // prikazivanje chata
        });

        conn.on('close', () => {
         // zatvarnje konekcije
         makniKonekciju(longID);
        });
    });

    peer.on('error', (err) => {
        errorDisplay(err);
    });
}

function prikaziPoruku(data) {
    const today = new Date();
	let message = `<div class="chatbox-message-item received"><span class="chatbox-message-item-text">${data.data} </span><span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span></div>`

	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message);
    document.querySelector('.chatbox-message-no-message').style.display = "none"; // makni no messages
	scrollBottom();

    document.getElementsByClassName('chatbox-message-input')[0].value = ""; // resetiraj textarea
}

function prikaziDatoteku(data, peer, longID) {
    const container = document.getElementsByClassName('input-holder')[0]; // ovdje ide fileholder
    const fileType = data.data.type || getMimeType(data.fileName); // pokusavan skuzit tip datoteke // reformatat mozda je redundant
    let file = new Blob([data.data], {type: fileType}); // pretvaranje primljene datoteke u blob
    let fileHolder = document.createElement('div');

    fileHolder.setAttribute('class', "file-holder");
    fileHolder.setAttribute('id', "fileHolder");

    // fileholder innerhtml
    fileHolder.innerHTML = `<div id="drag-drop2">Korisnik vam želi poslati datoteku: ${data.fileName}</div> <button class="btn waves-effect waves-green red lighten-1" id="downloadButton">Preuzmi datoteku</button> <br><button id="cancelConnection" class="btn waves-effect waves-green red lighten-1">Otkaži konekciju</button>`
    container.innerHTML = "";
    container.appendChild(fileHolder);

    const downloadButton = document.getElementById('downloadButton');

    // ako korisnik prihvati datoteku pocni skidanje 
    downloadButton.addEventListener('click', () => {
        downloadFile(file, data.fileName, peer);
    });

    document.getElementById('cancelConnection').addEventListener('click', () => {
        peer.destroy(); // zatvaranje otvorene konekcije
        cancelConnection.remove();
        makniKonekciju(longID);
        resetInput();
    });
}


function downloadFile(fileObj, fileName, peer) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // ako je za mobitel opali downloadBlob
    if (isMobile) {
      downloadBlob(fileObj, fileName, peer);
    } else {
    // pocinje skidanje za desktop
      const fileType = fileObj.type || getMimeType(fileName); // mozda redundant provjerit posli
      downloadFileDesktop(fileObj, fileName, fileType, peer);
    }
  }
  
  function downloadFileDesktop(fileObj, fileName, fileType) {
    const url = URL.createObjectURL(fileObj);

    fetch(url).then(response => {
        if (response.ok) {
          response.blob().then(blob => {
            const url = URL.createObjectURL(blob);
  
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.type = fileType;
            a.click();
  
            URL.revokeObjectURL(url);
          });
        } else {
          errorDisplay('Download nije uspio sa statusom: ' + response.status);
        }
      })
      .catch(error => {
        errorDisplay('2, Download nije uspio sa statusom:' + error);
      });
}
  

function downloadBlob(blob, filename, peer) {
    const link = document.createElement('a');
  
    if ('download' in link) { // ako mozemo priko istog nacina za skidanje za desktop mozemo i ovdi
    // uglavnom za chrome
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } else {
      // fallback ako download attribute nije podrzan u browseru(uglavnom za safari i ponekad firefox)
      const reader = new FileReader();

      reader.onloadend = function() {
        const url = reader.result;
        const iframe = document.createElement('iframe');

        iframe.src = url;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        setTimeout(() => document.body.removeChild(iframe), 333);
      };

      reader.readAsDataURL(blob);
    }
}

function makniKonekciju(longID) {
    db.collection('AktivneKonekcije').where('longID', '==', longID).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
            const obj = doc.data();
            const id = doc.id;

            if (Object.keys(obj).length !== 0) {
                db.collection('AktivneKonekcije').doc(id).delete();
                errorDisplay('Konekcija sa korisnikom je zatvorena. Stranica će se osvježit za 2 sekunde.');
                setTimeout(() => {
                    window.location.reload();
                }, 2000); 
            } else {
             errorDisplay('Konekcija već pomaknuta, resetiranje stranice.');
             window.location.reload();
            }
        });
      });
}

// sve pomocne funkcije se nalaze u helper.js
// pomocne funkcije koristene u ovoj datoteci su: openModal, closeModal, errorDisplay, resetInput, generateWord, getMimeType;