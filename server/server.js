const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);

let io = socketIO(server);


app.use(express.static(publicPath));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

const state = {};
const clientRooms = {};
const Players = {}

io.on('connection', socket => {
  console.log(io.sockets.adapter.rooms)

    socket.on('startGameOne', handleNewGame)
    socket.on('joinGame', handleJoinGame)
    socket.on('startGameTogether', startGameNow)

  
   
    socket.on('winner', (name) => {
      io.emit('winner', name);
    })

    socket.on('from14', (cardArr, where) => {
      console.log(cardArr, where)
      io.emit('placeFrom14', cardArr, where);
    })
    

    socket.on('fromRest', (cardArr, where) => {
      console.log(cardArr, where)
      io.emit('placeFromRest', cardArr, where);
    })
    

/*    socket.on('startGame', () => {
        io.emit('startGame');
    }) */

    function handleJoinGame(roomName, Person) {
      Players[roomName].push(Person)
      console.log(Players)
     console.log(io.sockets.adapter.rooms.get(roomName).size)
   const room = io.sockets.adapter.rooms.has(roomName)

     let numClients = 0;
        if (room) {
          numClients = io.sockets.adapter.rooms.get(roomName).size
          
        }
   
        if (numClients === 0) {
          console.log("unknown Code")
            io.emit('unknownCode');
          return;
        } else if (numClients > 4) {
          console.log("tooManyPlayers")
            io.emit('tooManyPlayers');
          return;
        }
        clientRooms[socket.id] = roomName;
    
        socket.join(roomName);
        socket.number = io.sockets.adapter.rooms.get(roomName).size;
    //    io.emit('init', 2);
        io.emit('startGame', io.sockets.adapter.rooms.get(roomName).size, Players[roomName]);
     //io.emit('JoinedPlayer', 2);
        
     //   startGameInterval(roomName);
      }
    

    function handleNewGame(name) {
        let roomName = makeid(5);
        Players[roomName] = []
        Players[roomName].push(name)
        

        clientRooms[socket.id] = roomName;
        
        io.emit('gameCode', roomName, Players);
    
     //   state[roomName] = initGame();
     socket.join(roomName);
     
   
   socket.number = 1;
      //  io.emit('init', 1);
      }
      
      function startGameNow() {
   io.emit('startGameNow');
      }
      

	console.log('A user just connected.');
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    })
   
    socket.on('crazyIsClicked', (data) => {
        io.emit('crazyIsClicked', data);
    });
});





function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
