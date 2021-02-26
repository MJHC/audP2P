const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000;

//const { PeerServer } = require('peer');
//const peerServer = PeerServer({ port: 443, path: '/' });

//npm i -g peer
// peerjs --port 3001

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', socket => {

  //when a user is connected to the peer server do this
  socket.on('voice', (userId) => {
    socket.broadcast.emit('user-connected', userId)

    //when a user disconnects do this
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
  
    })
  })
  
})

server.listen(port)
