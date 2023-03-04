
function p2pHandler(file) {
    // uspostavit p2p konekciju nekako
    let peer = new Peer( {debug: 3});

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
            connectionModal.innerHTML = `<div id="modalConnection" class="modal"><div class="modal-content"><h4>Početak djeljenja</h4><p>Kako bi ste uspostavili konekciju između druge osobe, mora te im prosljediti svoj ID. Nakon toga, osobi će se pokazati žele li primiti datoteku koju šaljete. Molimo Vas da ne zatvarate prozor jer će prekinuti vašu konekciju.</p> <p>Vaš ID: ${shortID}</p></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">Dobro</a></div></div>`
            document.getElementsByClassName("container")[0].appendChild(connectionModal);

            openModal('modalConnection');
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    });

    peer.on('connection', (conn) => {
        console.log(2);
        conn.on('open', function() {
            // Receive messages
            conn.on('data', function(data) {
              console.log('Received', data);
            });
        
            // Send messages
            conn.send('Hello!');
          });
          conn.send('Hello!');
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
}

function spojiKorisnika(longID) {
    const peer = new Peer();

    peer.on('open', () => {
        const conn = peer.connect(longID);
        conn.on('open', () => {
            conn.send("radi pls");
        })

        conn.on('data', (data) => {
            console.log('Recived', data);
        });
    })
}