"use strict"

let players = { "P1" : 0, "P2" : 0, "P3": 0 ,"P4" : 0 };
let multiplayer = false;

class Card {
  constructor(rank) {
    this.rank = rank;
    this.imgBack = "img/backs/Card-Back-02-custom.png";
    this.imgFront = "img/cardsOnBoard/" + this.rank + ".png";

    this.container;
    this.front;
    this.back;
    this.inner;
  }

  summon() {
    this.container = document.createElement("div");
    this.container.setAttribute("class", "card-this.container");
    document.getElementById("memory-game").appendChild(this.container);

    this.inner = document.createElement("div");
    this.inner.setAttribute("class","card-inner");
    this.container.appendChild(this.inner);

    this.front = document.createElement("img");
    this.front.setAttribute("class", "card-this.front");
    this.front.setAttribute("src", this.imgFront);
    this.front.setAttribute("alt", "Image Front");
    inner.appendChild(this.front);

    this.back = document.createElement("img");
    this.back.setAttribute("class", "card-this.back");
    this.back.setAttribute("src", this.imgBack);
    this.back.setAttribute("alt", "Image Back");
    this.inner.appendChild(this.back);

    this.container.addEventListener("click", function() {
      this.inner.setAttribute("class", "card-inner-flip");

      // mettre carte dans flippedCards;
      //TourDeJeu();
      // si carte doit être retournée
      // inner.setAttribute("class", "card-inner")
    });
  }
}

let possibleCards = ["c01", "c01", "d01", "d01", "s01", "s01", "h01", "h01",
"d02", "d02", "c02", "c02", "h02", "h02", "s02", "s02"];

let cardsOnBoard = [];
let flippedCards = [];

function initGame(numberOfPairs) {
  let nCards = nPairs * 2;
  while (nCards != 0 ) {
    cardRank = possibleCards.splice(Math.floor(Math.random() * nCards), 1);
    newCard = new Card(cardRank);
    cardsOnBoard.push(newCard);
    newCard.summon();
    nCards--;
  }
}

function hasGameEnded(flippedCards, cardsOnBoard) {
  return flippedCards.length == cardsOnBoard.length;
}

function testPair(flippedCards) {
  return flippedCards[flippedCards.length - 1].rank == flippedCards[flippedCards.length - 2].rank;
}

function ajoutePoint(arrayPlayer, nTurn) {
  arrayPlayer["P" + nTurn] += 100;
}

function endOfGame() {
  return "la fin du jeu";
}

function TourDeJeu() {
  if(flippedCards.length % 2 == 0){
    if(TestEndGame(flippedCards,cardsOnBoard)){
      FinDuJeu();
      return;
    }
    if(testPair(!flippedCards)){
      flippedCards[flippedCards.length - 2].inner.setAttribute("class", "card-inner");
      flippedCards[flippedCards.length - 1].inner.setAttribute("class", "card-inner");
      flippedCards.pop();
      flippedCards.pop();
    }
    else if(multiplayer == true){
      AjoutePoint(ArrayPlayer,nTurn);
    }
  }
}
