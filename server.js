const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000;

const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: port, path: '/' });

//npm i -g peer
// peerjs --port 3001
server.listen(port, () => {
  console.log(`@ ${port}`);
});
