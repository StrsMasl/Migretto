Array.prototype.indexOfForArrays = function (search) {
  var searchJson = JSON.stringify(search);
  var arrJson = this.map(JSON.stringify);

  return arrJson.indexOf(searchJson);
};

class Table {
  constructor(totalPlayers, otherPlayersName) {
    this.otherPlayersName = otherPlayersName
    this.maxCards = totalPlayers * 4;
    this.topOnTable = [];
  };

  addSlots($domPar1, $domPar2) {
    let count = Math.floor(this.maxCards / 2);
    let rest = this.maxCards - count;
    let id = 0;

    for (let i = 0; i < count; i++) {
      id++;
      let div = $("<div></div>")
        .attr("id", id)
        .addClass("slot-table h-100")
        .text(0);
      $domPar1.append(div);
      this.topOnTable.push(0);
    }

    for (let i = 0; i < rest; i++) {
      id++;
      let div = $("<div></div>")
        .attr("id", id)
        .addClass("slot-table h-100")
        .text(0);
      $domPar2.append(div);
      this.topOnTable.push(0);
    }
  };

  addOnTop(card, where) {
    if (Number.parseInt(where.text()) + 1 === card[0]) {
      if (
        where.attr("class").split(" ")[0] === card[1] ||
        where.attr("class").split(" ")[0] === "slot-table"
      ) {
        return true;
      } else return false;
    } else return false;
  };

  lockTen(where) {
    where.animate({ opacity: 0.7 }, 1000);
  };

  showOpponents (parent) {
    this.otherPlayersName.forEach( val =>{
      let cards = $('<div></div>').addClass('cards-opponents').attr('id', val)
      let name = $('<h6></h6>').css('color', 'white').text(val)
      let divFinal = $('<div></div>').addClass('oppo-play-div')
      divFinal.append(name)
      divFinal.append(cards)
      parent.append(divFinal)
    });
  };

  updateMove (name, cards) { 
    let parent = $('#enemies-div').find(`#${name}`); // Get parent from DOM
    parent.empty(); // Clean parent for re-build

    cards.forEach(val => {
      if(val[1] === "deck-cards") {
        let card = $('<div></div>').addClass('oppo-cards deck-cards text-center').text(val[0]);
        parent.append(card);
      } else {
        let card = $('<div></div>').addClass(val[1]).addClass('oppo-cards card-user text-center').text(val[0]);
        parent.append(card);
      };
    });
  };
};