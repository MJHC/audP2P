const socket = io()

//get the audio container 
const audioContainer = document.getElementById('audio-container')

//connect to the pper server with "undefined" ID (generates uuid instead)
const myPeer = new Peer(undefined, {

})

//userID and call storage
const peers = {}

//get users audio 
navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true

  //stream audio 
}).then(stream => {

  //? when somebody sends data then this / already connected users
  myPeer.on('call', call => {

    //? call must be answered or no connection / answers with own audio stream
    call.answer(stream)

    //creates new audio object 
    const audio = document.createElement('audio')
    audio.setAttribute("controls", "0");

    //when recieving old stream add it to audio container
    call.on('stream', userAudioStream => {
      addAudioStream(audio, userAudioStream)
    })
  })

  //when a new user connects. make audio object of that user.
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

//close connection 
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

//when connected to the peer server do this
myPeer.on('open', id => {
  socket.emit('voice', id)
})

//Make audio object and get new user connection
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)

  const audio = document.createElement('audio')
  audio.setAttribute("controls", "0");

  //when recieving new stream add it to audio container
  call.on('stream', userAudioStream => {
    addAudioStream(audio, userAudioStream)
  })

  //delete audio object
  call.on('close', () => {
    audio.remove()
  })

  // connect id to call
  peers[userId] = call
}

//add audio object to audio container
function addAudioStream(audio, stream) {
  audio.srcObject = stream
  audio.addEventListener('loadedmetadata', () => {
    audio.play()
  })
  audioContainer.append(audio)
}
