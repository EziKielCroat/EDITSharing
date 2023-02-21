
const firebaseConfig = {
    apiKey: "AIzaSyBynaVPHtPVT2u33R9Du3wJaWs694Cvi4w",
    authDomain: "editsharing-38e1f.firebaseapp.com",
    projectId: "editsharing-38e1f",
    storageBucket: "editsharing-38e1f.appspot.com",
    messagingSenderId: "137256725440",
    appId: "1:137256725440:web:d2e074d22b10ffe3a9f625",
    measurementId: "G-40DV23GZLC"
};
const app = firebase.initializeApp(firebaseConfig)

// let button = document.getElementById("anyFile")
// button.addEventListener("click",uploadImage())


function uploadImage() {
    const ref = firebase.storage().ref()

    const file = document.querySelector("#anyFile").files[0]

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