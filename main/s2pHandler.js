

function s2pHandler(file,ref) {
    

    const name = new Date() + "-" + file.name

    const metadata = {
        contentType:file.type
    }

    const task = ref.child(name).put(file, metadata)
    
    task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
        console.log(url)
        alert("Image Upload Successful")
    })  
}