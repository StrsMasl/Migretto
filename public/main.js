let Person; // Player Name
let Playlerlist;
let socket = io();

let code;
socket.on('gameCode', handleGameCode);

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

function handleGameCode(gameCode, PlayerOne) {
  console.log(gameCode)
  $('#gameCodeDisplay').html(gameCode);
  code = gameCode;
}

socket.on("startGame", (data, Players) => {
  console.log(data);
  PlayerListVar = Players;
  console.log(PlayerListVar);

  var newHTML = $.map(PlayerListVar, function (value) {
    return "<br/><span>" + value + "</span>";
  });
  $("#Playerlist").html(newHTML.join(""));

  /*    PlayerListVar.forEach(main);
      $('#Playerlist').html = PlayerListVar
  
      function main(arrayItem) {
          return "<br/><span>" + arrayItem + "</span> "
      }
    */
});

$("#joinGameButton").click(function () {
  $("#gameCodeDiv").hide();
  $("#start-btn").hide();

  code = gameCodeInput.value;
  Person = prompt("Please enter your name", "");
  socket.emit("joinGame", code, Person);
  $("#new-game-div").fadeOut();
  setTimeout(() => {
    $("#PlayersDiv").fadeIn();
  }, 500);
});

// Start Button
$("#new-game-btn").click(function () {
  Person = prompt("Please enter your name", "");
  socket.emit("startGameOne", Person);

  $("#Playerlist").html(`<br/><span>${Person}<span>`);
  PlayerNumber = 1;
  $("#new-game-div").fadeOut();

  setTimeout(() => {
    $("#PlayersDiv").fadeIn();
  }, 500);
});

$("#start-btn").click(function () {
  socket.emit('startGameTogether', code);
});

socket.on("startGameNow", () => {
  $("#start-div").fadeOut();
  user = new User(new Deck(),Person, code);
  table = new Table(8);

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
  alert(`${name} won`);
});
