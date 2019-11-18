"use strict"

// =============================================================================
// === DEFINITION DE CARD ======================================================
// =============================================================================

class Card {
  constructor(rank) {
    // Propriétés de la carte
    this.rank = rank;
    this.imgBack = "img/backs/Card-Back-Orange.png";
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
    if (isCardsClickable) {
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

// === Logique de jeu ==========================================================

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

// loadLastGame : restaure la dernière partie sauvegardée dans la base de donées
function loadLastGame() {
  let jsonLastGame = document.getElementById("json-last-game").innerHTML;
  let last_game = JSON.parse(jsonLastGame);

  nPlayers = last_game.nPlayers;
  playersScore = last_game.playersScore;
  currentPlayer = last_game.currentPlayer;
  difficulty = last_game.difficulty;
  numberOfTurn = last_game.numberOfTurn;

  toggleMenu("ui-players");
  toggleMenu("ui-main-menu");
  createMultiplayerMenu();
  document.getElementById("P1").classList.add("multiplayer-button");
  cardsOnBoard = last_game.cardsOnBoard;
  flippedCards = last_game.flippedCards;
  cardsOnBoard.forEach(card => function() { card.summon(); });
  flippedCards.forEach(card => function() { card.flip(true); });
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

// updateScore : met à jour le score des joueurs                  --- à préciser
function updateScore() {
  playersScore["P" + currentPlayer] += 100;
  document.getElementById("P" + currentPlayer).textContent =
      "P" + currentPlayer + " : " + playersScore["P" + currentPlayer];
}

// oneTurn : un tour de jeu                      --- à préciser  --- à expliquer
function oneTurn() {
  if (flippedCards.length % 2 == 0) {
    numberOfTurn++;
    if (hasGameEnded()) {
      updateScore();
      endOfGame();
      return;
    }
    if (!isMatching()) {
      setTimeout(resetTurn, 500);
      switchCardClick(false);
      setTimeout(function(){switchCardClick(true);}, 500);
      if (multiplayer) {
        nextPlayerTurn();
      }
    } else {
      updateScore();
    }
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

// endOfGame : met fin au jeu                      --- prototype  --- à préciser
function endOfGame() {
  toggleMenu("ui-players");
  toggleMenu("ui-end");
  let winnerPlayer = winner();
  document.getElementById("winner").textContent = winnerPlayer + " à gagné";
}

// nextPlayerTurn : lance le tour du prochain joueur
function nextPlayerTurn() {
  document.getElementById("P" + currentPlayer).classList.remove("multiplayer-button");
  if (currentPlayer == nPlayers) {
    currentPlayer = 1;
  } else {
    currentPlayer++;
  }
  document.getElementById("P" + currentPlayer).classList.add("multiplayer-button");
}

// === Boutons / interface / statistiques ======================================

// toggleMenu : affiche/cache le menu passé en paramètre (id HTML de la forme
//    "ui-*nom-du-menu*")
//    Exemple : toggleMenu("ui-main-menu") --> affiche le menu principal si ce
//    dernier était caché
function toggleMenu(menu) {
  document.getElementById(menu).classList.toggle("hidden");
}

// createMultiplayerMenu : créé les boutons d'affichage du score en fonction du
//    nombre de joueurs
function createMultiplayerMenu() {
  let container = document.getElementById("ui-players");
  let button;
  for (let i = 1; i <= nPlayers; i++) {
    button = document.createElement("button");
    button.setAttribute("class", "control-button");
    button.setAttribute("id", "P" + i);
    button.innerHTML = "P" + i + " : 0";
    container.appendChild(button);
  }
}

// statistics : affiche les statistiques de fin de partie          --- prototype
function statistics() {
  (numberOfTurn);
}

// setDifficulty : change la difficulté et met à jour le bouton en fonction
function setDifficulty() {
  if (difficulty == 9) {
    difficulty = 3;
  } else {
    difficulty += 3;
  }
  difficultyButton.textContent = "Nombre de paires : " + difficulty;
}

// setPlayer : définit le nombre de joueurs et met à jour le bouton en fonction
function setPlayer() {
  if (nPlayers == 4) {
    nPlayers = 1;
  } else {
    nPlayers += 1;
  }
  nPlayersButton.textContent = "Nombre de Joueurs : " + nPlayers;
}

function winner() {
  let winner = "P1";
  for (let i = 1; i <= nPlayers; i++) {
    if(playersScore["P" + i] > playersScore[winner]){
      winner = "P" + i;
    }
  }
  return winner;
}

// =============================================================================
// === PREPARATION DU MEMORY ===================================================
// =============================================================================

// === Éléments de jeu
let playersScore = { "P1" : 0, "P2" : 0, "P3": 0 ,"P4" : 0 };
let multiplayer = false;
let isCardsClickable = true;
let numberOfTurn = 0;
let currentPlayer = 1;
let nPlayers = 1;
let difficulty = 3;

// === Cartes
let availableCards = ["c01", "c01", "d01", "d01", "s01", "s01", "h01", "h01",
    "d02", "d02", "c02", "c02", "h02", "h02", "s02", "s02","d03", "d03", "c03",
    "c03", "h03", "h03", "s03", "s03"];
let cardsOnBoard = [];
let flippedCards = [];

// === Menu princpal (affiché par défaut)
// Bouton "Jouer"
let playButton = document.getElementById("play");
playButton.addEventListener("click", function(){
  if (nPlayers > 1){
    multiplayer = true;
  }
  toggleMenu("ui-players");
  toggleMenu("ui-main-menu");
  initMemory(difficulty);
  createMultiplayerMenu();
  document.getElementById("P1").classList.add("multiplayer-button");
});

// Bouton de sélection de la difficulté
let difficultyButton = document.getElementById("difficulty");
difficultyButton.addEventListener("click", setDifficulty);

// Bouton de sélection du nombre de joueurs
let nPlayersButton = document.getElementById("nPlayers");
nPlayersButton.addEventListener("click", setPlayer);
