

const textarea = document.querySelector('.chatbox-message-input');

const chatboxForm = document.querySelector('.chatbox-message-form');

const chatboxToggle = document.querySelector('.chatbox-toggle');

const chatboxMessage = document.querySelector('.chatbox-message-wrapper');

const chatboxMessageWrapper = document.querySelector('.chatbox-message-content');

const chatboxNoMessage = document.querySelector('.chatbox-message-no-message');

textarea.addEventListener('input', function () { // da izgleda lijepo tijekom inputa
	let line = textarea.value.split('\n').length

	if(textarea.rows < 6 || line < 6) {
		textarea.rows = line
	}

	if(textarea.rows > 1) {
		chatboxForm.style.alignItems = 'flex-end';
	} else {
		chatboxForm.style.alignItems = 'center';
	}
})


chatboxToggle.addEventListener('click', function () {
	chatboxMessage.classList.toggle('show');
})


chatboxForm.addEventListener('submit', function (e) {
	e.preventDefault();

	if(isValid(textarea.value)) {
		writeMessage(); // prikaze poruku od user1
        sendMessage() // salje poruku od u1 u u2
	}
})

function sendMessage() {
    let sendingMessage = document.getElementsByClassName('chatbox-message-input')[0].value;

    connGlobal.send({sending: 'message', data: sendingMessage}); // slanje poruke drugom korisniku

    connGlobal.on('data', (data) => {
        if(data.message)  {
            writeMessageOfOU(data.message); // ispisivanje primljene poruke u chat
        } else {
            console.error("dupla poruka, undefined data.message"); // nakon prve poruke vrati poruku koju u2 posalje i undefined nakon toga, neznam zasto al san ovo nap da neprikazuje undefined?
        }
    });

    document.getElementsByClassName('chatbox-message-input')[0].value = ''; // resetiranje textarea
}

function writeMessage() {
	const today = new Date();
	// html upisane poruke
	let message = `<div class="chatbox-message-item sent"><span class="chatbox-message-item-text">${textarea.value.trim().replace(/\n/g, '<br>\n')} </span><span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span></div>`

	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message);
	chatboxForm.style.alignItems = 'center';
	textarea.rows = 1;
	textarea.focus();

	chatboxNoMessage.style.display = 'none'
	scrollBottom();
}

function writeMessageOfOU(msg) {
	const today = new Date();
	// html primanje poruke
	let message = `<div class="chatbox-message-item received"><span class="chatbox-message-item-text">${msg} </span><span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span></div>`
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message);
	chatboxNoMessage.style.display = 'none'
	scrollBottom();
}

function scrollBottom() {
	chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight);
}

function isValid(value) { // za cekiranje jel nesto upisano
	let text = value.replace(/\n/g, '');
	text = text.replace(/\s/g, '');

	return text.length > 0
}

function addZero(num) { // da izgleda lijepse datum
	return num < 10 ? '0'+num : num
}