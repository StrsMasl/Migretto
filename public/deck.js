class Deck {
    constructor(limit = 4) {
      this.cardsLimit = limit;
      this.cards = [];
    }
  
    shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;
  
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
  
      return array;
    }
  
    giveDeck() {
      const count = this.cardsLimit;
      let color = "yellow";
  
      for (let i = 0; i < count; i++) {
        if (i === 1) color = "blue";
        else if (i === 2) color = "red";
        else if (i === 3) color = "green";
  
        for (let j = 1; j <= 10; j++) {
          let random = Math.floor(Math.random() * 100);
  
          if (random < 33) this.cards.push([j, color]);
          else if (random > 33 && random < 66) this.cards.unshift([j, color]);
          else this.cards.splice(this.cards.length / 2, 0, [j, color]);
        }
      }
      this.shuffle(this.cards);
      this.shuffle(this.cards);
      this.shuffle(this.cards);
      return this.cards;
    }
  }