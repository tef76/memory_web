"use strict"

// =============================================================================
// === DEFINITION DE CARD ======================================================
// =============================================================================
class Card {
  constructor(rank) {
    // Propriétés de la carte
    this.rank = rank;
    this.imgBack = "img/backs/Card-Back-02.png";
    this.imgFront = "img/cards/" + this.rank + ".png";
    this.isFlipped = false;

    // Conteneurs HTML nécesssaires au retournement de la carte
    this.container;
    this.front;
    this.back;
    this.inner;
  }

  // this.summon : insère les conteneurs HTML de la carte courante dans la
  //    balise "memory-game"
  summon() {
    this.container = document.createElement("div");
    this.container.setAttribute("class", "card-container");
    document.getElementById("memory-game").appendChild(this.container);

    this.inner = document.createElement("div");
    this.inner.classList.toggle("card-inner");
    this.container.appendChild(this.inner);

    this.front = document.createElement("img");
    this.front.setAttribute("class", "card-front");
    this.front.setAttribute("src", this.imgFront);
    this.front.setAttribute("alt", "Image Front");
    this.inner.appendChild(this.front);

    this.back = document.createElement("img");
    this.back.setAttribute("class", "card-back");
    this.back.setAttribute("src", this.imgBack);
    this.back.setAttribute("alt", "Image Back");
    this.inner.appendChild(this.back);

    this.addEvent(this);
  }

  // this.addEvent : ajoute un écouteur d'évènement sur le conteneur "inner" de
  //    la carte "card". L'évènement "click" déclenche le retournement de la
  //    carte
  addEvent(card) {
    card.inner.addEventListener("click", function(){
    if(isCardsClickable){
        if (!card.isFlipped) {
          card.flip(true);
          flippedCards.push(card);
          oneTurn();
        }
      }
    });
  }

  // this.flip : modifie la classe de this.inner et ajuste this.isFlipped en
  //    fonction de state
  flip(state) {
    this.inner.classList.toggle("card-inner-flip");
    this.inner.classList.toggle("card-inner");
    this.isFlipped = state;
  }
}

// =============================================================================
// === FONCTIONS DU MEMORY =====================================================
// =============================================================================

// initMemory : initialise le jeu en créant "nPairs" paires de carte
function initMemory(nPairs) {
  let nCards = nPairs * 2;
  let cardRank;
  let newCard;
  while (nCards != 0 ) {
    cardRank = availableCards.splice(Math.floor(Math.random() * nCards), 1)[0];
    newCard = new Card(cardRank);
    cardsOnBoard.push(newCard);
    newCard.summon();
    nCards--;
  }
}

// gameRestore : restaure la partie sauvegardée
function gameRestore(){
    cardsOnBoard.forEach(card => card.summon());
}

// hasGameEnded : renvoie "true" si le nombre de retournées est égal au nombre
//    de cartes total (c-à-d le jeu est terminé) et renvoie "false" sinon
function hasGameEnded() {
  return flippedCards.length == cardsOnBoard.length;
}

// isMatching : renvoie "true" si les deux dernières cartes retournées sont
//    identiques et "false" sinon
function isMatching() {
  return flippedCards[flippedCards.length - 1].rank ==
      flippedCards[flippedCards.length - 2].rank;
}

// updateScore : met à jour le score des joueurs                --- à préciser ?
function updateScore(arrayPlayer, numPlayer) {
  arrayPlayer["P" + numPlayer] += 100;
}

// endOfGame : met fin au jeu                                   --- à préciser ?
function endOfGame() {
  alert(players["P1"]);
  alert(players["P2"]);
  alert(players["P3"]);
  alert(players["P4"]);
}

// oneTurn : un tour de jeu                                     --- à préciser ?
function oneTurn() {
  if (flippedCards.length % 2 == 0) {
    numberOfTurn++;
    if (hasGameEnded()) {
      endOfGame();
      return;
    }
    if (!isMatching()) {
      setTimeout(resetTurn, 500);
      switchCardClick(false);
      setTimeout(switchCardClick(true), 500);
    } else if (multiplayer) {
      updateScore(players, numPlayer);
    }
  }
  else if(multiplayer) {
    nextPlayerTurn();
  }
}

// resetTurn : retourne face cachée les deux dernières cartes révélées
function resetTurn() {
  flippedCards[flippedCards.length - 1].flip(false);
  flippedCards[flippedCards.length - 2].flip(false);
  flippedCards.pop();
  flippedCards.pop();
}

// switchCardClick : active/désactive le clic sur les cartes
function switchCardClick(state) {
  isCardsClickable = state;
}

// statistical : affiche les stats en fin de partie
function statistical(){
  alert(numberOfTurn);
}

// nextPlayerTurn : lance le tour du prochain joueurs
function nextPlayerTurn(){
  if(numPlayer == 4){
    numPlayer = 1;
  } else {
    numPlayer++;
  }
}

// disableButton : désactive les boutons de jeu
function disableButton(){
  difficultyButton.textContent = "";
  playButton.textContent = "";
  multiplayerButton.textContent = "";
}

// setDifficulty : change la difficulter
function setDifficulty(){
  if(difficulty == 6){
    difficulty = 2;
  } else {
    difficulty += 2;
  }
  difficultyButton.textContent = "difficulty : " + difficulty;
}

// =============================================================================
// === PREPARATION DU MEMORY ===================================================
// =============================================================================

let players = { "P1" : 0, "P2" : 0, "P3": 0 ,"P4" : 0 };
let multiplayer = false;
let isCardsClickable = true;
let numberOfTurn = 0;
let numPlayer = 0;
let difficulty = 2;
let availableCards = ["c01", "c01", "d01", "d01", "s01", "s01", "h01", "h01",
"d02", "d02", "c02", "c02", "h02", "h02", "s02", "s02"];
let cardsOnBoard = [];
let flippedCards = [];

// === Discuter du format  =====================================================

let difficultyButton = document.getElementById("difficulty");
difficultyButton.addEventListener("click",setDifficulty);

let playButton = document.getElementById("play");
play.addEventListener("click", function(){
initMemory(difficulty);
disableButton();
});

let multiplayerButton = document.getElementById("multiplayer");
multiplayerButton.addEventListener("click",function(){
multiplayer = true;
initMemory(difficulty);
disableButton();
});
