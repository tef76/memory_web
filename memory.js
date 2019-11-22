"use strict"

// =============================================================================
// === DEFINITION DE PLAYER ====================================================
// =============================================================================

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.winStreak = 0;
    this.turnDurationAverage = 0;
    this.turnDurationTotal = 0;
  }
}

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
// === DEFINITION DE MEMORY ====================================================
// =============================================================================

class Memory {
  constructor(nPairs, nPlayers) {
    this.currentwinStreak = 0;
    this.nPairs = nPairs;
    this.nPlayers = nPlayers;
    this.players = new Array();
    this.numberOfTurn = 0;
    this.currentPlayer = 1;
    this.cardsOnBoard = new Array();
    this.flippedCards = new Array();
  }

  fillBoard() {
    let nCards = this.nPairs * 2;
    let cardRank = "";
    let newCard = null;
    while (nCards != 0 ) {
      cardRank = availableCards.splice(Math.floor(Math.random() * nCards), 1)[0];
      newCard = new Card(cardRank);
      this.cardsOnBoard.push(newCard);
      newCard.summon();
      this.addEventToCard(newCard, this);
      nCards--;
    }
  }

  addEventToCard(card, memoryObject) {
    card.container.addEventListener("click", function() {
    if (isCardsClickable) {
        if (!card.isFlipped) {
          card.flip(true);
          memoryObject.flippedCards.push(card);
          memoryObject.oneTurn();
        }
      }
    });
  }

  // oneTurn : lance un nouveau tour de jeu lorsque deux cartes ont été révélées
  oneTurn() {
    if (this.flippedCards.length % 2 == 0) {

      this.numberOfTurn++;

      // Si toutes les cartes sont retournées, met fin au jeu
      if (this.hasGameEnded()) {
        this.currentwinStreak += 1;
        this.updateScore();
        this.endOfGame();
        return;
      }

      // Si les deux cartes retournées ne forment pas une paire, bloque le
      // plateau pendant les animations de retournement face visible puis face
      // caché, et, si le nombre de joueurs est supérieur à 1, lance le tour du
      // prochain joueur. Sinon, augmente le score du joueur et fait rejouer ce
      // dernier
      if (!this.isMatching()) {
        setTimeout(this.resetTurn, 500);
        switchCardClick(false);
        setTimeout(function() { switchCardClick(true); }, 500);
        if (this.nPlayers > 1) {
          this.nextPlayerTurn();
          this.currentwinStreak = 0;
        }
      } else {
        this.currentwinStreak += 1;
        this.updateScore();
      }
    }
  }

  // nextPlayerTurn : lance le tour du prochain joueur
  nextPlayerTurn() {
    let x = document.getElementById("P" + this.currentPlayer);
    x.classList.remove("multiplayer-button");
    if (this.currentPlayer == this.nPlayers) {
      this.currentPlayer = 1;
    } else {
      this.currentPlayer++;
    }
    x.classList.add("multiplayer-button");
  }

  // resetTurn : retourne face cachée les deux dernières cartes révélées
  resetTurn() {
    this.flippedCards[this.flippedCards.length - 1].flip(false);
    this.flippedCards[this.flippedCards.length - 2].flip(false);
    this.flippedCards.pop();
    this.flippedCards.pop();
  }

  // hasGameEnded : renvoie "true" si le nombre de retournées est égal au nombre
  //    de cartes total (c-à-d le jeu est terminé) et renvoie "false" sinon
  hasGameEnded() {
    return this.flippedCards.length == this.cardsOnBoard.length;
  }

  // isMatching : renvoie "true" si les deux dernières cartes retournées sont
  //    identiques et "false" sinon
  isMatching() {
    return this.flippedCards[this.flippedCards.length - 1].rank ==
        this.flippedCards[this.flippedCards.length - 2].rank;
  }

  // updateScore : met à jour le score des joueurs
  updateScore() {
    this.players[this.currentPlayer - 1].score += 100;
    document.getElementById("P" + this.currentPlayer).textContent =
        "P" + this.currentPlayer + " : " +
        this.players[this.currentPlayer - 1].score;
    if(this.currentwinStreak > this.players[this.currentPlayer - 1].winStreak){
      this.players[this.currentPlayer - 1].winStreak = this.currentwinStreak;
    }
  }

  // endOfGame : met fin au jeu
  endOfGame() {
    toggleMenu("memory-game");
    toggleMenu("ui-players");
    toggleMenu("ui-end");
    let winnerPlayer = this.winnerIndex();
    document.getElementById("winner").textContent = winnerPlayer + " à gagné";
    statistics(this);
  }

  // winnerIndex : renvoie l'index du joueur avec le meilleur score
  winnerIndex() {
    let winnerIndex = 0;
    for (let i = 0; i < this.nPlayers; i++) {
      if (this.players[i].score > this.players[winnerIndex].score) {
        winnerIndex = i;
      }
    }
    return winnerIndex;
  }
}

// =============================================================================
// === INTERFACE UTILISATEUR ===================================================
// =============================================================================

// toggleMenu : affiche/cache le menu passé en paramètre (id HTML de la forme
//    "ui-*nom-du-menu*")
//    Exemple : toggleMenu("ui-main-menu") --> affiche le menu principal si ce
//    dernier était caché
function toggleMenu(menu) {
  document.getElementById(menu).classList.toggle("hidden");
}

// statistics : affiche les statistiques de fin de partie          --- prototype
function statistics(game) {
  let container = document.getElementById("CreateTable");
  let tab;
  let td;
  for (let i = 1; i <= game.nPlayers; i++) {
    tab = document.createElement("tr");
    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = game.players[i-1].name;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = game.players[i-1].score;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = game.players[i-1].winStreak;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = game.players[i-1].turnDurationAverage;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = game.players[i-1].turnDurationTotal;
    tab.appendChild(td);
  }
}

// createMultiplayerMenu : créé les boutons d'affichage du score en fonction du
//    nombre de joueurs
function createMultiplayerMenu(game) {
  let container = document.getElementById("ui-players");
  let button;
  for (let i = 1; i <= game.nPlayers; i++) {
    button = document.createElement("button");
    button.setAttribute("class", "control-button");
    button.setAttribute("id", "P" + i);
    button.innerHTML = "P" + i + " : 0";
    container.appendChild(button);
  }
}
// setPlayers : Crée les joueurs
function setPlayers(game) {
  let newPlayer;
  for (let i = 1; i <= game.nPlayers; i++) {
    newPlayer = new Player("P" + i);
    game.players.push(newPlayer);
  }
}

// =============================================================================

let availableCards = ["c01", "c01", "d01", "d01", "s01", "s01", "h01", "h01",
"d02", "d02", "c02", "c02", "h02", "h02", "s02", "s02","d03", "d03", "c03",
"c03", "h03", "h03", "s03", "s03"];

let isCardsClickable = true;
function switchCardClick(state) {
  isCardsClickable = state;
}

let nPlayersDefault = 1;
let nPairsDefault = 3;

let memory = new Memory(nPairsDefault, nPlayersDefault);

let playButton = document.getElementById("play");
let difficultyButton = document.getElementById("difficulty");
let nPlayersButton = document.getElementById("nPlayers");
let replayButton = document.getElementById("replay");

playButton.addEventListener("click", function() {
  toggleMenu("ui-players");
  toggleMenu("ui-main-menu");
  setPlayers(memory);
  memory.fillBoard();
  createMultiplayerMenu(memory);
  document.getElementById("P1").classList.add("multiplayer-button");
});

difficultyButton.addEventListener("click", function() {
  if (memory.nPairs == 9) {
    memory.nPairs = 3;
  } else {
    memory.nPairs += 3;
  }
  difficultyButton.textContent = "Nombre de paires : " + memory.nPairs;
});

nPlayersButton.addEventListener("click", function() {
  if (memory.nPlayers == 4) {
    memory.nPlayers = 1;
  } else {
    memory.nPlayers += 1;
  }
  nPlayersButton.textContent = "Nombre de Joueurs : " + memory.nPlayers;
});

replayButton.addEventListener("click", function() {
  location.reload();
});


function saveCurrentGame(game) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      document.getElementById("ui-side-menu-info").innerHTML = "Partie sauvegardée";
    }
  }
  request.open("GET", "ajax.php?action=save&game=" + JSON.stringify(game), true);
  request.send();
}

function loadLastGame(game) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      // memory = JSON.parse(this.responseText);
      document.getElementById("ui-side-menu-info").innerHTML = "Dernière partie restaurée";
    }
  }
  request.open("GET", "ajax.php?action=load", true);
  request.send();
}
