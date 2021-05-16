const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

const state = {};
const clientRooms = {};
const Players = {};
let pointsArr = []

io.on("connection", (socket) => {
  console.log(io.sockets.adapter.rooms);

  socket.on("startGameOne", handleNewGame);
  socket.on("joinGame", handleJoinGame);
  socket.on("startGameTogether", startGameNow);

  socket.on("winner", (name, room) => {
    io.to(room).emit("getPoints", name); // Collect Point
  });

  socket.on('points', (firstForteen, deck, name, room, winnerName) => {
    pointsArr.push([name, firstForteen, deck])
    io.to(room).emit("winner", pointsArr, winnerName);
  })

  socket.on("showPoints", (name, room) => {
    io.to(room).emit("winner", name);
  });

  socket.on("from14", (cardArr, where, room, name, cards) => {
    console.log(cardArr, where);
    if (cardArr !== null) {
      io.to(room).emit("placeFrom14", cardArr, where);
    }

    io.to(room).emit("changeEnemies", name, cards);
  });

  socket.on("fromRest", (cardArr, where, room) => {
    console.log(cardArr, where);
    io.to(room).emit("placeFromRest", cardArr, where);
  });

  /*    socket.on('startGame', () => {
        io.emit('startGame');
    }) */

  function handleJoinGame(roomName, Person) {
    if(Players[roomName] !== undefined) {
      Players[roomName].push(Person);
      console.log(Players);
      console.log(io.sockets.adapter.rooms.get(roomName).size);
      const room = io.sockets.adapter.rooms.has(roomName);
  
      let numClients = 0;
      if (room) {
        numClients = io.sockets.adapter.rooms.get(roomName).size;
      }
  
      if (numClients === 0) {
        console.log("unknown Code");
        io.emit("unknownCode");
        return;
      } else if (numClients > 4) {
        console.log("tooManyPlayers");
        io.emit("tooManyPlayers");
        return;
      }
      clientRooms[socket.id] = roomName;
  
      socket.join(roomName);
      socket.number = io.sockets.adapter.rooms.get(roomName).size;
  
      io.to(roomName).emit(
        "startGame",
        io.sockets.adapter.rooms.get(roomName).size,
        Players[roomName]
      );  
    }
  }

  function handleNewGame(name) {
    let roomName = makeid(5);
    Players[roomName] = [];
    Players[roomName].push(name);

    clientRooms[socket.id] = roomName;

    //   state[roomName] = initGame();
    socket.join(roomName);
    io.to(roomName).emit("gameCode", roomName, Players);

    socket.number = 1;
    //  io.emit('init', 1);
  }

  function startGameNow(code) {
    console.log(code);
    io.to(code).emit("startGameNow");
  }

  console.log("A user just connected.");
  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
