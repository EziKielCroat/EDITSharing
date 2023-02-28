

function s2pHandler(file,ref) {
    const name = new Date() + "-" + file.name

    const metadata = {
        contentType:file.type
    }

    const task = ref.child(name).put(file, metadata)
    
    task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
        console.log(url)
        successDisplay('Uspješan prijenos datoteke', url);
    });
}

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