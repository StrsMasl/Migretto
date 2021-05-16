let Person; // Player Name
let Playlerlist;
let PlayerListVar;
let user, table;

let socket = io();

let code;
socket.on('gameCode', handleGameCode);



socket.on("changeEnemies", (name, cards) => {
  if (name !== Person) {
    table.updateMove(name, cards)
  }
});
// Server Place Card from 14 deck
socket.on("placeFrom14", (card, where) => {
  
  // Show card on Table & prepend class
  let where1 = $(document).find(`#${where}`);
  let classes = where1.attr("class");

  where1
    .removeClass()
    .addClass(card[1])
    .addClass(classes)
    .text(card[0])

  if (card[0] === 10) this.lockTen(where1);
});

// Server Place Card from normal deck
socket.on("placeFromRest", (card, where) => {

  // Show card on Table & prepend class
  let where1 = $(document).find(`#${where}`);
  let classes = where1.attr("class");

  where1
    .removeClass()
    .addClass(card[1])
    .addClass(classes)
    .text(card[0])

  if (card[0] === 10) this.lockTen(where1);
});

function handleGameCode(gameCode) {
  $('#gameCodeDisplay').html(gameCode);
  code = gameCode;
}

socket.on("startGame", (data, Players) => {
  PlayerListVar = Players;


  var newHTML = $.map(PlayerListVar, function (value) {
    return `<dl style='margin-bottom:0px !important;'><i style='margin-right:5px;' class='fas fa-user-astronaut' style='font-size:36px'></i>${value}</dl>`;
  });
  $("#Playerlist").html(newHTML);
});

$("#joinGameButton").click(function () {
  $("#gameCodeDiv").hide();
  $("#start-btn").hide();

  code = gameCodeInput.value;
  Person = prompt("Please enter your name", "");
  if(Person === '') Person = 'Guest'
  socket.emit("joinGame", code, Person);
  $("#new-game-div").fadeOut();
  setTimeout(() => {
    $("#PlayersDiv").fadeIn();
  }, 500);
});

// Start Button
$("#new-game-btn").click(function () {
  Person = prompt("Please enter your name", "");
  if(Person === '') {
    Person = 'Guest'
  }
  socket.emit("startGameOne", Person);

  $("#Playerlist").html(`<dl style='margin-bottom:0px !important;'><i style='margin-right:5px;' class='fas fa-user-astronaut' style='font-size:36px'></i>${Person}</dl>`);
  PlayerNumber = 1;
  $("#new-game-div").fadeOut();

  setTimeout(() => {
    $("#PlayersDiv").fadeIn();
  }, 500);
});

$("#start-btn").click(function () {
  socket.emit('startGameTogether', code);
});

$("#repeat-btn").click(function () {
  socket.emit('startGameTogether', code);
});


socket.on('startGameNow', () => {
 $("#enemies-div").empty(); 
 

  
  if (PlayerListVar){
    OtherPlayers = PlayerListVar.slice();
    OtherPlayers.splice( $.inArray(Person,OtherPlayers) ,1 );
    OtherPlayers[0] ? $('#nameOne').html(OtherPlayers[0]) : $('#nameOne').hide();
    OtherPlayers[1] ? $('#nameTwo').html(OtherPlayers[1]) : $('#nameTwo').hide();
    OtherPlayers[2] ? $('#nameThree').html(OtherPlayers[2]) : $('#nameThree').hide();
  }

  $("#start-div").fadeOut();
  user = new User(new Deck(),Person, code);

  // If there are other Players pass the number and the array
  if(PlayerListVar){
    table = new Table(PlayerListVar.length, OtherPlayers);
    table.showOpponents($('#enemies-div'))
  } else {
    table = new Table(1);
  }

  setTimeout(() => {
    user.assignFirstForteen($("#user-cards"));
    user.showDeck($("#deck"));
    table.addSlots($("#slots-1"), $("#slots-2"));

    $(".fade-together").fadeIn();
  }, 500);
});

// Click deck get new card
$("#deck").click(function () {
  user.fromDeck($("#deck-col-add"));
});

// Put Card when slot on table is selected 
$(".center-table").on("click", ".slot-table", function () {
  $(".slot-table").removeClass("selected");

  // Check if user selected one of his cards
  let selection = $(".user-cards").find(".selected-user");
  if (selection.length > 0) {
    $(this).addClass("selected");
    let userCard = selection.eq(0);
    user.putCard(userCard, this);
    $(".slot-table").removeClass("selected"); // remove class again prevent bugs
  }
  $(".slot-table").removeClass("selected"); // remove class again prevent bugs
});

// Select User card
$(".user-cards").on("click", ".single-card", function () {
  $(".single-card").removeClass("selected-user");
  $(this).toggleClass("selected-user");
});

// Double click deck
$("#deckImp").click(function () {
  user.doubleClickDeck($("#user-cards"));
});

socket.on("winner", (name) => {
  
  $("#overlay").show()
  $("#repeat-btn").show()
  alert(`${name} won`);

});
