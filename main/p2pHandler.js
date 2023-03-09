
function p2pHandler(file) {
    // inicijalizacija PeerJS konekcije
    const peer = new Peer( {debug: 1});

    peer.on('open', (id) => {
        const shortID = generateWord(); // ovo je kratki id koji prikazujemo korisniku
        const data = {
            shortID: shortID,
            longID: id
        };
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
            console.log("Document successfully written!");
          })
          .catch((error) => {
            errorDisplay("Error writing document: ", error);
          });
    });

    // peer.on('connnection') se upali kad se uspostavi konekcija sa peerom
    peer.on('connection', (conn) => {
        // Kad se konekcija otvorit(sad mos slat i primat poruke u sigurnosti da se upalilo)
        conn.on('open', function() {
            const sendingFile = window.file; // window.file je file koji namjeravan slat u window variabli
            const typeOf = sendingFile.type; 
            let sendingBlob;

            if(sendingFile.type) { // ako sendingFile.type je truthy stavit ce typeOf (nemoze sendingFile.type jer bude [object Object])
                sendingBlob = new Blob([sendingFile], {type: typeOf});
            } else { // generalni mime type
                sendingBlob = new Blob([sendingFile], {type: "application/octet-stream"});
            }

            conn.on('data', function(data) { // mozda dodan chat
                 console.log('Received: ', data);
            });

            // slanje objekta koji sadržava sve potrebno za file transfer
            conn.send({data: sendingBlob, sending: 'file', fileName: sendingFile.name});
          });

          conn.on('close', () => {
            errorDisplay('Konekcija sa korisnikom je zatvorena. Stranica će se osvježit za 2 sekunde.');

            setTimeout(() => {
                window.location.reload();
              }, 2000); 
          });
    });

    peer.on('error', (err) => {
        errorDisplay(err);
    });
}

function predSpajanjeKorisnika() { // prije spajanje korisnika moramo izvuci longID iz firebasea
    const shortID = document.getElementById("upisaniID").value;
    // uzimam shortID i nalazi doc u kojen se nalazi, pa iz tog doc-a izvlaci longID(peer.id) pošiljatelja
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
    // inicijalizacija PeerJS konekcije
    const peer = new Peer({debug: 1});

    peer.on('open', () => {
        const conn = peer.connect(longID); // spajanje na longID povućen iz firebasea

        conn.on('open', () => {

            conn.send("spojen"); // cisto za debugging

            conn.on('data', (data) => {
                if(data.sending === 'file') { // prikazivanje primljene datoteke(objekta(nije blob))
                    prikaziDatoteku(data, peer, longID);
                } else {
                    // mozda dodan chat
                }
                console.log('Recived', data);
            });
        });

        conn.on('close', () => {
         // zatvarnje konekcije, mozda pomaknit na botun
         makniKonekciju(longID);
        });
    });

    peer.on('error', (err) => {
        errorDisplay(err);
    });
}

function prikaziDatoteku(data, peer, longID) {
    const container = document.getElementsByClassName("input-holder")[0]; // ovdje ide fileholder
    const fileType = data.data.type || getMimeType(data.fileName); // pokusavan skuzit tip datoteke
    let file = new Blob([data.data], {type: fileType}); // pretvaranje primljene datoteke u blob
    let fileHolder = document.createElement("div");

    fileHolder.setAttribute('class', 'file-holder');
    fileHolder.setAttribute('id', 'fileHolder');

    // fileholder innerhtml
    fileHolder.innerHTML = `<div id="drag-drop2">Korisnik vam želi poslati datoteku: ${data.fileName}</div> <button class="btn waves-effect waves-green red lighten-1" id="downloadButton">Preuzmi datoteku</button> <br><button id="cancelConnection" class="btn waves-effect waves-green red lighten-1">Otkaži konekciju</button>`
    container.innerHTML = '';
    container.appendChild(fileHolder);

    const downloadButton = document.getElementById('downloadButton');

    // ako korisnik prihvati datoteku pocni skidanje 
    downloadButton.addEventListener('click', () => {
        downloadFile(file, data.fileName, peer);
    });

    document.getElementById("cancelConnection").addEventListener('click', () => {
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
    } else { // pocinje skidanje za desktop
      const fileType = fileObj.type || getMimeType(fileName);
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
          console.error('Download failed with status ' + response.status);
        }
      })
      .catch(error => {
        console.error('Download failed with error ' + error);
      });
}
  

function downloadBlob(blob, filename, peer) { // obvezno napravit da se handlea nakon uspjeha skidanja i ovdi
    // neradi bas dobro al radi polovno
    const link = document.createElement('a');
  
    if ('download' in link) {
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
      // fallback ako download attribute nije podrzan u browseru
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
             errorDisplay('nebi se tribalo ispisat.')
            }
        });
      });

}
