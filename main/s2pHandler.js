
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
        console.log(url)
        successDisplay('Uspješan prijenos datoteke', url);
    });
}

// prikazuje sve u modalu
function successDisplay(msg, url) {
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
    }).catch(error => {console.log(error);});
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
            let object =  imageRef.getMetadata().then(metadata => { metadata.downloadURL = downloadURLForFile
             filesArray.push(metadata)
            }).then(() => { num === filesArray.length ? displayFiles(filesArray): ""})
            
          // And finally display them
        //   console.log(imageRef)
        });
 
    
    }).catch(function(error) {
        // Handle any errors
    });
    
}

function displayFiles(filesArray) {
    let divFiles = document.createElement("div")
    divFiles.setAttribute("class", "divFiles")
    
    for (let i = 0; i < filesArray.length; i++){
        console.log(filesArray[i])

        let fileHolder = document.createElement("div")
        fileHolder.setAttribute("class", "driveFileHolder")

        let heading = document.createElement("h3")
        heading.innerText = filesArray[i].name.split("--")[1]

        let sizeParagraph = document.createElement("p")
        sizeParagraph.innerText = Math.floor((filesArray[i].size) / 1024)+"KB"


        fileHolder.append(heading)
        fileHolder.append(sizeParagraph)
        divFiles.append(fileHolder)
        
    }
    document.getElementsByTagName("body")[0].append(divFiles)
}
    function showFiles(userID1){
    let filesArray = []
    var storageRef = firebase.storage().ref(`${userID1}`);
    storageRef.listAll().then(function(result) {
        result.items.forEach(function(imageRef) {
            
            let object = imageRef.getMetadata().then(metadata => {filesArray.push(metadata)})

          // And finally display them
        //   console.log(imageRef)
        });
        console.log(filesArray)
    }).catch(function(error) {
        // Handle any errors
    });
}