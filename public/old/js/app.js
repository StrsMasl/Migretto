let socket = io();
let PlayerNumber;
let Person;
let Playerlist;
socket.on('gameCode', handleGameCode);
socket.on('JoinedPlayer', JoinedPlayer, Number);

const startingSection = document.querySelector('.starting-section');

const homeBtn = document.querySelector('.home-btn');

let crazyButton = document.getElementById('crazyButton');
const joinGameBtn = document.getElementById('joinGameButton');
let newGame = document.getElementById('newGameButton');
let YourCode = document.getElementById('YourCode');
const gameCodeInput = document.getElementById('gameCodeInput');
const LastPressedCode = document.getElementById('LastPressedCode');
const PlayerNumberCode = document.getElementById('PlayerNumberCode');
const PersonCode = document.getElementById('PersonCode');
const PlayerlistCode = document.getElementById('Playerlist');
const PlayersDiv = document.getElementById('PlayersDiv');






joinGameBtn.addEventListener('click', joinGame);

startButton.addEventListener('click', () => {
    socket.emit('startGame');
});

function JoinedPlayer(number) {
    
}

socket.on('startGame', (data, Players) => {
   console.log(data)
    if(!PlayerNumber) {
        PlayerNumber = data;
        PlayerNumberCode.innerText = data;
    }
    PlayersDiv.style.display = "block";
    Playerlist = Players;
   
    Playerlist.forEach(main);
    PlayerlistCode.innerHTML = Playerlist

    function main(arrayItem) {
        return "<br/><span>" + arrayItem + "</span> "
    }
    
    hideStartButton();
    
});



function joinGame() {
    const code = gameCodeInput.value;
    newGame.style.display = "none"; //hide.
    JoinDiv.style.display = "none"
    
    Person = prompt("Please enter your name", "Test");
    PersonCode.innerText = Person;
    socket.emit('joinGame', code, Person);
  }

newGame.addEventListener('click', () => {
    Person = prompt("Please enter your name", "Test");
    newGame.style.display = "none"; //hide.
    JoinDiv.style.display = "none"
    YourCode.style.display = "block"
    socket.emit('startGameOne', Person);
    PlayerNumber = 1;
    
    
    
});




function hideStartButton() {
    YourCode.style.display = "none";
    startButton.style.display = "none";
    crazyButton.style.display = "block";
    startingSection.style.display = "none";
}


function handleGameCode(gameCode, PlayerOne) {
  //  PlayerNumber = PlayerOne
    gameCodeDisplay.innerText = gameCode;
    if (PlayerNumber) {
        PlayerNumberCode.innerText = PlayerNumber;
        PersonCode.innerText = Person;
    }
   
  }

crazyButton.addEventListener('click', () => {
    socket.emit('crazyIsClicked', {
        offsetLeft: Math.random() * ((window.innerWidth - crazyButton.clientWidth) - 100),
        offsetTop: Math.random() * ((window.innerHeight - crazyButton.clientHeight) - 50),
        Player: PlayerNumber

    });
})

socket.on('crazyIsClicked', (data) => {
    console.log(data)
    goCrazy(data.offsetLeft, data.offsetTop);
    LastPressedCode.innerText = data.Player
});

function goCrazy(offLeft, offTop) {
    let top, left;

    left = offLeft;
    top = offTop;

    crazyButton.style.top = top + 'px';
    crazyButton.style.left = left + 'px';
    crazyButton.style.animation = "none";
}

