class User {
  constructor(deck, name) {
    this.name = name;
    this.deck = deck.giveDeck();
    this.firstForteen = [];
  }

  assignFirstForteen($domRow) {
    let cards = this.firstForteen;

    // Take 14 cards from the user deck and add them to another array
    for (let i = 0; i < 14; i++) {
      let random = Math.floor(Math.random() * 100);

      if (random < 33) cards.push(this.deck.shift());
      else cards.push(this.deck.pop());
    }

    // Show the card in front of him
    for (let j = 0; j < 4; j++) {
      let div = $("<div></div>")
        .addClass(cards[j][1])
        .addClass("single-card card-user p-2 h-100")
        .text(cards[j][0])
      $domRow.append(div);
    }
    this.updateDeckCard($domRow);
  }

  doubleClickDeck($domRow) {
    if ($domRow.children().length < 5) {
      let card = this.firstForteen.pop();
      this.firstForteen.unshift(card);

      let div = $("<div></div>")
        .addClass(card[1])
        .addClass("single-card card-user p-2 h-100")
        .text(card[0])

      $domRow.children().eq(0).after(div);
    }
    this.updateDeckCard($domRow);
  }

  updateDeckCard($domRow) {
    let count = this.firstForteen.length - ($domRow.children().length-1)

    if(count <= 0 ) {
      $domRow
      .children()
      .eq(0)
      .text(0);
    } else {
      $domRow
      .children()
      .eq(0)
      .text(count);
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
        cardArr = this.deck.splice(index, 1).pop();
        this.showDeck($("#deck"));
        $('.slot-table').removeClass('selected')
        card.remove();
        console.log(where)
        socket.emit('fromRest', cardArr, where.id);
      }

    } else {
      index = this.firstForteen.indexOfForArrays(cardRec);
      cardArr = this.firstForteen[index];

      // If card is rejected from table put it back
      if (table.addOnTop(cardArr, $(where))) {
        console.log(true)
        cardArr = this.firstForteen.splice(index, 1).pop();
        console.log(where)
        socket.emit('from14', cardArr, where.id);
        $('.slot-table').removeClass('selected')
        card.remove();

        // Everytime a card is added check if user win game
        
        if(this.firstForteen.length === 3) {
          socket.emit('winner', this.name);
        }

      //  this.checkWin();
      }
    }
  }

  showDeck($domRow) {
    let deck = this.deck;
    $domRow.text(deck.length);
  }

  fromDeck($domCol) {
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
          .addClass("single-card card-user p-2 h-100")
          .text(card[0])
          .css("margin-left", "-30px");
        $domCol.append(div);
      }
    }, 200);
  }

  checkWin() {
    if(this.firstForteen.length === 3) alert('You Win')
  }
}
