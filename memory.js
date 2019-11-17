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

// gameRestore : restaure la partie sauvegardée                    --- prototype
function gameRestore() {
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
      setTimeout(switchCardClick(true), 500);
      if(multiplayer) {
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
  alert(playersScore["P1"]);
  alert(playersScore["P2"]);
  alert(playersScore["P3"]);
  alert(playersScore["P4"]);
}

// nextPlayerTurn : lance le tour du prochain joueur
function nextPlayerTurn() {
  if (currentPlayer == nPlayers) {
    currentPlayer = 1;
  } else {
    currentPlayer++;
  }
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
  alert(numberOfTurn);
}

// setDifficulty : change la difficulté et met à jour le bouton en fonction
function setDifficulty() {
  if (difficulty == 6) {
    difficulty = 2;
  } else {
    difficulty += 2;
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
let difficulty = 2;

// === Cartes
let availableCards = ["c01", "c01", "d01", "d01", "s01", "s01", "h01", "h01",
"d02", "d02", "c02", "c02", "h02", "h02", "s02", "s02"];
let cardsOnBoard = [];
let flippedCards = [];

// === Menu princpal (affiché par défaut)
// Bouton "Jouer"
let playButton = document.getElementById("play");
playButton.addEventListener("click", function(){
  if(nPlayers > 1){
    multiplayer = true;
  }
  toggleMenu("ui-players");
  toggleMenu("ui-main-menu");
  initMemory(difficulty);
  createMultiplayerMenu();
});

// Bouton de sélection de la difficulté
let difficultyButton = document.getElementById("difficulty");
difficultyButton.addEventListener("click", setDifficulty);

// Bouton de sélection du nombre de joueurs
let nPlayersButton = document.getElementById("nPlayers");
nPlayersButton.addEventListener("click", setPlayer);
