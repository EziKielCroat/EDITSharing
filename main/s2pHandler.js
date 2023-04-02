
const userID1 = localStorage.getItem('idkorisnika');


// pripremi dokument za slanje
function s2pHandler(file, ref) {
    const name = new Date() + "--" + file.name

    const metadata = {
        contentType:file.type
    }

    // var uploadTask = storageRef.child('images/user1234/file.txt').put(file, metadata);

    const task = ref.child(`${userID1}/${name}`).put(file, metadata)
    
    task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
        console.log(url);
        successDisplayBitly('Uspješan prijenos datoteke', url);
    });
}

// prikazuje sve u modalu
function successDisplayBitly(msg, url) {
    let successDisplay = document.createElement('div');
    shortURL(url).then(shortURL => {
        successDisplay.setAttribute('class', 'success-display')
            successDisplay.innerHTML = `<div id="successDisplay" class="modal"><div class="modal-content"><h4>${msg}</h4> <p>Želiš li podjeliti datoteku? Samo podjeli ovaj link:</p><p><span id="shortURL">${shortURL}</span><button  onclick="copyToClipboard()"class="btn waves-effect red lighten-1" type="submit" name="action" id="copyClipboardButton"><i class="material-icons right">content_paste</i></button></p></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">Dobro</a></div></div>`
            document.getElementsByClassName("container")[0].appendChild(successDisplay);
            const elem = document.getElementById('successDisplay');
            const instance = M.Modal.init(elem, {
                dismissible: false
            });
            instance.open();
    }).catch(error => {errorDisplay(error);});
}

// bitly implementacija, sa njihove dokumentacije
async function shortURL(url) {
    const accessToken = 'b097faaca4bd6dae524691db898d7d534386e6f7';
    const apiUrl = `https://api-ssl.bitly.com/v4/shorten`;
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        long_url: url
      })
    });
  
    const responseData = await response.json();
    const shortURL = responseData.link;
  
    return shortURL;
}

async function showFiles(userID1){
    let filesArray = []
    var storageRef =  firebase.storage().ref(`${userID1}`);
    storageRef.listAll().then(function (result) {
        let num = result.items.length
        result.items.forEach(function (imageRef) {
            let downloadURLForFile;
            imageRef.getDownloadURL().then((v) => { downloadURLForFile = v; })
            imageRef.getMetadata().then(metadata => { metadata.downloadURL = downloadURLForFile
             filesArray.push(metadata)
            }).then(() => { num === filesArray.length ? displayFiles(filesArray): ""})
        });
 
    
    }).catch(function(error) {
        errorDisplay(error);
    });
    
}

function displayFiles(filesArray) {
    const divFiles = document.createElement("div");
    divFiles.setAttribute("class", "divFiles");
    divFiles.classList.add("inline");
    
    for (let i = 0; i < filesArray.length; i++){
        let headingText = filesArray[i].name.split("--")[1];
        let sizeText = Math.floor((filesArray[i].size) / 1024)+"KB";
        let downloadURL = filesArray[i].downloadURL;

        const fileHolder = document.createElement("div");

        fileHolder.setAttribute("class", "driveFileHolder");
        fileHolder.classList.add('downloadHover');
        fileHolder.setAttribute('title', headingText);

        const heading = document.createElement("h3");
        heading.innerText = headingText;

        const sizeParagraph = document.createElement("p");
        
        if(sizeText == "0KB") {
            sizeParagraph.innerText = "?? KB"
        } else {
            sizeParagraph.innerText = sizeText
        }

        if(downloadURL) {
            fileHolder.addEventListener('click', () => { // download handleing
                location.href = downloadURL;
            });
        } else {
            console.error(`Preuzimanje dokumenta ${headingText} nije dostupno.`)
        }

        if(heading.innerText.length < 25) {
            fileHolder.append(heading);
            fileHolder.append(sizeParagraph);
            divFiles.append(fileHolder);
        } else {
            let newHeading = truncate(heading.innerText, 20); // iskreno nemogu puno objasnit.. smanjiva ako je predug string
            heading.innerText= newHeading;

            fileHolder.append(heading);
            fileHolder.append(sizeParagraph);
            divFiles.append(fileHolder);
        }
    }
    document.getElementsByClassName("container")[0].append(divFiles);
}