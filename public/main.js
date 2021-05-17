let Person; // Player Name
let Playlerlist;
let PlayerListVar;
let user,
  table,
  round = 0;
let socket = io();
let code;

socket.on("gameCode", handleGameCode);

socket.on("changeEnemies", (name, cards) => {
  if (name !== Person) {
    table.updateMove(name, cards);
  }
});

// Server Place Card from 14 deck

socket.on("placeFrom14", (card, where, fire, name) => {
  console.log("fire " + fire)

  // Show card on Table & prepend class
  let where1 = $(document).find(`#${where}`);
  let classes = where1.attr("class");
  console.log(name + 'made move')

  where1.removeClass().addClass(card[1]).addClass(classes).text(card[0]);

  if (card[0] === 10) table.lockTen(where1);
});

// Server Place Card from normal deck

socket.on("placeFromRest", (card, where, fire, name) => {
  console.log("fire " + fire)

  // Show card on Table & prepend class
  let where1 = $(document).find(`#${where}`);
  let classes = where1.attr("class");
  console.log(name + 'made move')

  where1.removeClass().addClass(card[1]).addClass(classes).text(card[0]);

  if (card[0] === 10) this.lockTen(where1);

 
    user.onFire(fire,name)
  
});

function handleGameCode(gameCode) {
  $("#gameCodeDisplay").html(gameCode);
  code = gameCode;
}

socket.on("startGame", (data, Players) => {
  PlayerListVar = Players;

  $("#new-game-div").fadeOut();
  setTimeout(() => {
    $("#PlayersDiv").fadeIn();
  }, 500);

  let rommMusic = document.getElementById("elevet-music");
  rommMusic.play(); // Start playing
  rommMusic.currentTime = 0; // Reset time

  var newHTML = $.map(PlayerListVar, function (value) {
    return `<dl style='margin-bottom:0px !important;'><i style='margin-right:5px;' class='fas fa-user-astronaut' style='font-size:36px'></i>${value}</dl>`;
  });
  $("#Playerlist").html(newHTML);
});

socket.on("noRoomFound", (name, room) => {
  alert(`No room found with code: ${room}. Sorry ${name}! `)
});

$("#joinGameButton").click(function () {
  $("#gameCodeDiv").hide();
  $("#start-btn").hide();

  code = gameCodeInput.value;
  Person = prompt("Please enter your name", "");
  if (Person === "") Person = "Guest";

  socket.emit("joinGame", code, Person);
});

// Start Button
$("#new-game-btn").click(function () {
  Person = prompt("Please enter your name", "");
  if (Person === "") {
    Person = "Guest";
  }
  socket.emit("startGameOne", Person);

  $("#Playerlist").html(
    `<dl style='margin-bottom:0px !important;'><i style='margin-right:5px;' class='fas fa-user-astronaut' style='font-size:36px'></i>${Person}</dl>`
  );
  PlayerNumber = 1;
  $("#new-game-div").fadeOut();

  setTimeout(() => {
    $("#PlayersDiv").fadeIn();
  }, 500);

  let rommMusic = document.getElementById("elevet-music");
  rommMusic.play(); // Start playing
  rommMusic.currentTime = 0; // Reset time
});

$("#start-btn").click(function () {
  socket.emit("startGameTogether", code);

  // Stop Music
  $("#elevet-music").animate({ volume: 0 }, 2000, function () {
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
  });
});

$("#repeat-btn").click(function () {
  socket.emit("startGameTogether", code);
});

socket.on("startGameNow", () => {
  if (round > 0) {
    console.log("Clearing DOM");
    clearDOM();
  } else {
    // Stop Music
    $("#elevet-music").animate({ volume: 0 }, 2000, function () {
      this.pause(); // Stop playing
      this.currentTime = 0; // Reset time
    });
  }

  if (PlayerListVar) {
    OtherPlayers = PlayerListVar.slice();
    OtherPlayers.splice($.inArray(Person, OtherPlayers), 1);
    OtherPlayers[0]
      ? $("#nameOne").html(OtherPlayers[0])
      : $("#nameOne").hide();
    OtherPlayers[1]
      ? $("#nameTwo").html(OtherPlayers[1])
      : $("#nameTwo").hide();
    OtherPlayers[2]
      ? $("#nameThree").html(OtherPlayers[2])
      : $("#nameThree").hide();
  }

  $("#start-div").fadeOut();
  user = new User(new Deck(), Person, code);

  // If there are other Players pass the number and the array
  if (PlayerListVar) {
    table = new Table(PlayerListVar.length, OtherPlayers);
    table.showOpponents($("#enemies-div"));
  } else {
    table = new Table(1);
  }

  setTimeout(() => {
    user.assignFirstForteen($("#user-cards"));
    user.showDeck($("#deck"));
    table.addSlots($("#slots-1"), $("#slots-2"));

    $(".fade-together").fadeIn();
  }, 500);

  round += 1;
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

// Click deck
$(document).on('click', '.deckImp', function () {
  console.log(user)
  user.doubleClickDeck($("#user-cards"));
});

// Send Point to server
socket.on("getPoints", (name) => {
  let points = 26 - user.deck.length - user.firstForteen.length * 2;
  socket.emit(
    "points",
    points,
    user.name,
    user.room,
    name
  );
});

// Show points on client
let count = 0;
socket.on("winner", (pointsArr, winnerName) => {
  if (count === PlayerListVar.length - 1) {
    $("#overlay").show();
    console.log(pointsArr);
    $("#name-winner").text(`${winnerName} won!`);

    pointsArr.forEach((val) => {
      let span = $("<span></span>")
        .addClass("badge badge-pill")
        .text(val[1]);
      let li = $("<li></li>")
        .addClass(
          "points-color list-group-item d-flex justify-content-between align-items-center"
        )
        .text(val[0]);
      li.append(span);

      if ($("#players-points").children().length === 0)
        $("#players-points").append(li);
      else {
        $("#players-points")
          .children()
          .each((i, valIn) => {
            let pointsToParse = $(valIn).children().eq(0).text();
            let points = Number.parseInt(pointsToParse);

            if (points >= val[1]) $(valIn).after(li);
            else $(valIn).before(li);
          });
      }
    });
    $("#points-div").show();
  }
  count++;
});

// Clear DOM
function clearDOM() {

  let userTableClasses = $("#user").attr("class").split(" ");
  $("#user").removeClass();
  userTableClasses.shift();
  $("#user").addClass("removable").addClass(userTableClasses.join(" "));

  $("#enemies-div").empty();
  $('#bonus-point').text(0)
  $("#overlay").hide();
  $("#points-div").hide();
  $("#players-points").empty();
  $("#deck-col-add").empty();
  $("#slots-1").empty();
  $("#slots-2").empty();

  let deck14 = $("<div></div>").addClass('deck-cards text-center h-100 deckImp');
  $("#user-cards").empty();
  $("#user-cards").append(deck14);
  count = 0;
}
