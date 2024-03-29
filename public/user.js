let countPutted = 0;

class User {
  constructor(deck, name, room) {
    this.countForShuffle = 0;
    this.room = room;
    this.name = name;
    this.deck = deck.giveDeck();
    this.firstForteen = [];
  }

  assignFirstForteen($domRow, rule = true) {
    let cards = this.firstForteen;

    if (rule) {
      // Take 14 cards from the user deck and add them to another array
      for (let i = 0; i < 14; i++) {
        let random = Math.floor(Math.random() * 100);

        if (random < 33) cards.push(this.deck.shift());
        else cards.push(this.deck.pop());
      }
    }

    // Show the card in front of him
    for (let j = 0; j < 4; j++) {
      let div = $("<div></div>")
        .addClass(cards[j][1])
        .addClass("single-card card-user h-100")
        .text(cards[j][0]);
      $domRow.append(div);
    }
    this.updateDeckCard($domRow);
    let arrSendCard = [];
    
    $("#user-cards")
      .children()
      .each((i, val) => {
        arrSendCard.push([
          Number.parseInt($(val).text()),
          $(val).attr("class").split(" ")[0],
        ]);
      });
    socket.emit("from14", null, null, this.room, this.name, arrSendCard); // Send info to server
  }

  doubleClickDeck($domRow) {
    if ($domRow.children().length < 5) {
      this.countForShuffle = 0;
      let card = this.firstForteen.pop();
      this.firstForteen.unshift(card);

      let div = $("<div></div>")
        .addClass(card[1])
        .addClass("single-card card-user h-100")
        .text(card[0]);

      $domRow.children().eq(0).after(div);

      this.updateDeckCard($domRow);
      // Collect info from DOM before send to Server
      let arrSendCard = [];
      $("#user-cards")
        .children()
        .each((i, val) => {
          arrSendCard.push([
            Number.parseInt($(val).text()),
            $(val).attr("class").split(" ")[0],
          ]);
        });
      socket.emit("from14", null, null, this.room, this.name, arrSendCard); // Send info to server
    }
  }

  updateDeckCard($domRow) {
    let count = this.firstForteen.length - ($domRow.children().length - 1);

    if (count <= 0) {
      $domRow
        .children()
        .eq(0)
        .removeClass()
        .addClass("deck-empty text-center h-100")
        .text(0);
    } else {
      $domRow.children().eq(0).text(count);
    }
  }

  putCard(card, where) {
    let cardRec = [
        Number.parseInt($(card).text()),
        $(card).attr("class").split(" ")[0],
      ],
      index = this.deck.indexOfForArrays(cardRec),
      cardArr;

    // check where to take out the card from the users decks
    if (index !== -1) {
      cardArr = this.deck[index];

      // If card is rejected from table put it back
      if (table.addOnTop(cardArr, $(where))) {
        this.countForShuffle = 0;
        cardArr = this.deck.splice(index, 1).pop();

        // Change color user table
        let userTableClasses = $("#user").attr("class").split(" ");
        $("#user").removeClass();
        if (cardArr[1] === "yellow") {
          userTableClasses.shift();
          $("#user").addClass("yellowSha").addClass(userTableClasses.join(" "));
        } else if (cardArr[1] === "red") {
          userTableClasses.shift();
          $("#user").addClass("redSha").addClass(userTableClasses.join(" "));
        } else if (cardArr[1] === "blue") {
          userTableClasses.shift();
          $("#user").addClass("blueSha").addClass(userTableClasses.join(" "));
        } else {
          userTableClasses.shift();
          $("#user").addClass("greenSha").addClass(userTableClasses.join(" "));
        }

        this.showDeck($("#deck"));
        $(".slot-table").removeClass("selected");
        card.remove();
        socket.emit("fromRest", cardArr, where.id, this.room, this.name); // Send info to server

        this.onFire();
      }
    } else {
      index = this.firstForteen.indexOfForArrays(cardRec);
      cardArr = this.firstForteen[index];

      // If card is rejected from table put it back
      if (table.addOnTop(cardArr, $(where))) {
        this.countForShuffle = 0;
        cardArr = this.firstForteen.splice(index, 1).pop();

        $(".slot-table").removeClass("selected");
        card.remove();

        // Collect info from DOM before send to Server
        let arrSendCard = [];
        $("#user-cards")
          .children()
          .each((i, val) => {
            arrSendCard.push([
              Number.parseInt($(val).text()),
              $(val).attr("class").split(" ")[0],
            ]);
          });

        socket.emit(
          "from14",
          cardArr,
          where.id,
          this.room,
          this.name,
          arrSendCard
        ); // Send info to server

        // Change color user table
        let userTableClasses = $("#user").attr("class").split(" ");
        $("#user").removeClass();
        if (cardArr[1] === "yellow") {
          userTableClasses.shift();
          $("#user").addClass("yellowSha").addClass(userTableClasses.join(" "));
        } else if (cardArr[1] === "red") {
          userTableClasses.shift();
          $("#user").addClass("redSha").addClass(userTableClasses.join(" "));
        } else if (cardArr[1] === "blue") {
          userTableClasses.shift();
          $("#user").addClass("blueSha").addClass(userTableClasses.join(" "));
        } else {
          userTableClasses.shift();
          $("#user").addClass("greenSha").addClass(userTableClasses.join(" "));
        }

        // Everytime a card is added check if user win game
        // WIN FAST: socket.emit("winner", 'name', code);
        if (this.firstForteen.length === 3) {
          socket.emit("winner", this.name, this.room);
        }

        this.onFire();
      }
    }
  }

  showDeck($domRow) {
    let deck = this.deck;
    $domRow.text(deck.length);
  }

  fromDeck($domCol) {
    if (this.countForShuffle >= 10) {
      $('#box').children().eq(0).attr("disabled", false).text('Shuffle?');
      $("#box").fadeIn();
    } else {
      this.countForShuffle++;
    }
    $domCol.empty(); // remove previous card

    // Show card on DOM with delay
    setTimeout(() => {
      $domCol.empty(); // remove previous card, again, prevent bugs

      let deck = this.deck;

      // Take third card from the deck
      for (let i = 0; i < 3; i++) {
        let card = deck.shift();
        deck.push(card);

        let div = $("<div></div>")
          .addClass(card[1])
          .addClass("single-card card-user h-100")
          .text(card[0])
          .css("margin-left", "-30px");
        $domCol.append(div);
      }
    }, 200);
  }

  onFire(fire, name) {
    if (fire < 3 && $("#fire").css("display") !== "none") {
      // <---- THIS NUMBER DECIDE TO ADD FIRE
      $("#bonus-point").fadeOut();
      $("#fire").fadeOut();
    } else if (fire >= 3) {
      // <---- THIS NUMBER DECIDE TO ADD FIRE
      $("#fire").fadeIn();

      // Fire sound
      let fireSound = document.getElementById("fire-sound");
      fireSound.currentTime = 0.5;
      fireSound.play();

      $("#bonus-point").text(name);
      $("#bonus-point").fadeIn();
    }
  }
}
