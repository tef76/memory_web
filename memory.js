"use strict"

// =============================================================================
// === DEFINITION DE PLAYER ====================================================
// =============================================================================

function Player(name) {
  this.name = name;
  this.score = 0;
  this.winStreak = 0;
  this.turnDurationAverage = 0;
  this.turnDurationTotal = 0;
}

// =============================================================================
// === DEFINITION DE CARD ======================================================
// =============================================================================

function Card(rank) {
  // Propriétés de la carte
  this.rank = rank;
  this.imgBack = "img/backs/Card-Back-Orange.png";
  this.imgFront = "img/cards/" + this.rank + ".png";
  this.isFlipped = false;

  // Conteneurs HTML nécesssaires au retournement de la carte
  this.container = null;
  this.front = null;
  this.back = null;
  this.inner = null;
}

// summon : insère les conteneurs HTML de la carte courante dans la
// balise "memory-game"
function summon(card) {
  card.container = document.createElement("div");
  card.container.setAttribute("class", "card-container");
  document.getElementById("memory-game").appendChild(card.container);

  card.inner = document.createElement("div");
  card.inner.classList.toggle("card-inner");
  card.container.appendChild(card.inner);

  card.front = document.createElement("img");
  card.front.setAttribute("class", "card-front");
  card.front.setAttribute("src", card.imgFront);
  card.front.setAttribute("alt", "Image Front");
  card.inner.appendChild(card.front);

  card.back = document.createElement("img");
  card.back.setAttribute("class", "card-back");
  card.back.setAttribute("src", card.imgBack);
  card.back.setAttribute("alt", "Image Back");
  card.inner.appendChild(card.back);
}

// unsummon : supprimme le conteneur de la carte
function unsummon(card) {
  document.getElementById("memory-game").removeChild(card.container);
}

// flip : modifie la classe de this.inner et ajuste this.isFlipped en
// fonction de state
function flip(card, state) {
  card.inner.classList.toggle("card-inner-flip");
  card.inner.classList.toggle("card-inner");
  card.isFlipped = state;
}

// =============================================================================
// === DEFINITION DU MEMORY ====================================================
// =============================================================================

// --- Objet Memory ------------------------------------------------------------
function Memory(nPairs, nPlayers) {
  this.nPairs = nPairs;
  this.nPlayers = nPlayers;
  this.players = new Array();
  this.numberOfTurn = 0;
  this.currentPlayer = 1;
  this.cardsOnBoard = new Array();
  this.flippedCards = new Array();
  this.currentWinStreak = 0;
}

// --- Fonctions liées à l'objet Memory ----------------------------------------
function fillBoard() {
  let nCards = memory.nPairs * 2;
  let cardRank = "";
  let newCard = null;
  while (nCards != 0 ) {
    cardRank = availableCards.splice(Math.floor(Math.random() * nCards), 1)[0];
    newCard = new Card(cardRank);
    memory.cardsOnBoard.push(newCard);
    summon(newCard);
    addEventToCard(newCard);
    nCards--;
  }
}

function addEventToCard(card) {
  card.container.addEventListener("click", function() {
  if (isCardsClickable) {
      if (!card.isFlipped) {
        flip(card, true);
        memory.flippedCards.push(card);
        oneTurn();
      }
    }
  });
}

// oneTurn : lance un nouveau tour de jeu lorsque deux cartes ont été révélées
function oneTurn() {
  if (memory.flippedCards.length % 2 == 0) {
    memory.numberOfTurn++;

    // Si toutes les cartes sont retournées, met fin au jeu
    if (hasGameEnded()) {
      memory.currentWinStreak += 1;
      updateScore();
      endOfGame();
      return;
    }

    // Si les deux cartes retournées ne forment pas une paire, bloque le
    // plateau pendant les animations de retournement face visible puis face
    // caché, et, si le nombre de joueurs est supérieur à 1, lance le tour du
    // prochain joueur. Sinon, augmente le score du joueur et fait rejouer ce
    // dernier
    if (!isMatching()) {
      setTimeout(resetTurn, 500);
      switchCardClick(false);
      setTimeout(function() { switchCardClick(true); }, 500);
      if (memory.nPlayers > 1) {
        nextPlayerTurn();
        memory.currentWinStreak = 0;
      }
    } else {
      memory.currentWinStreak += 1;
      updateScore();
    }
  }
}

// nextPlayerTurn : lance le tour du prochain joueur
function nextPlayerTurn() {
  let x = document.getElementById("P" + memory.currentPlayer);
  x.classList.remove("multiplayer-button");
  if (memory.currentPlayer == memory.nPlayers) {
    memory.currentPlayer = 1;
  } else {
    memory.currentPlayer++;
  }
  x.classList.add("multiplayer-button");
}

// resetTurn : retourne face cachée les deux dernières cartes révélées
function resetTurn() {
  flip(memory.flippedCards[memory.flippedCards.length - 1], false);
  flip(memory.flippedCards[memory.flippedCards.length - 2], false);
  memory.flippedCards.pop();
  memory.flippedCards.pop();
}

// hasGameEnded : renvoie "true" si le nombre de retournées est égal au nombre
//    de cartes total (c-à-d le jeu est terminé) et renvoie "false" sinon
function hasGameEnded() {
  return memory.flippedCards.length == memory.cardsOnBoard.length;
}

// isMatching : renvoie "true" si les deux dernières cartes retournées sont
//    identiques et "false" sinon
function isMatching() {
  return memory.flippedCards[memory.flippedCards.length - 1].rank ==
      memory.flippedCards[memory.flippedCards.length - 2].rank;
}

// updateScore : met à jour le score des joueurs
function updateScore() {
  memory.players[memory.currentPlayer - 1].score += 100;
  document.getElementById("P" + memory.currentPlayer).textContent =
      "P" + memory.currentPlayer + " : " +
      memory.players[memory.currentPlayer - 1].score;
  if(memory.currentWinStreak > memory.players[memory.currentPlayer - 1].winStreak){
    memory.players[memory.currentPlayer - 1].winStreak = memory.currentWinStreak;
  }
}

// endOfGame : met fin au jeu
function endOfGame() {
  toggleMenu("ui-end");
  let winnerPlayer = winnerIndex();
  document.getElementById("winner").textContent = winnerPlayer + " à gagné";
  statistics();
}

// winnerIndex : renvoie l'index du joueur avec le meilleur score
function winnerIndex() {
  let winnerIndex = 0;
  for (let i = 0; i < memory.nPlayers; i++) {
    if (memory.players[i].score > memory.players[winnerIndex].score) {
      winnerIndex = i;
    }
  }
  return winnerIndex;
}

// =============================================================================
// === INTERFACE UTILISATEUR ===================================================
// =============================================================================

// toggleMenu : affiche/cache le menu passé en paramètre (id HTML de la forme
//    "ui-*nom-du-menu*")
//    Exemple : toggleMenu("ui-main-menu") --> affiche le menu principal si ce
//    dernier était caché
function toggleMenu(menu) {
  if (menu === "ui-main-menu") {
    document.getElementById("ui-main-menu").classList.remove("hidden");
    document.getElementById("ui-players").classList.add("hidden");
    document.getElementById("ui-end").classList.add("hidden");
  }
  if (menu === "ui-players") {
    document.getElementById("ui-main-menu").classList.add("hidden");
    document.getElementById("ui-players").classList.remove("hidden");
    document.getElementById("ui-end").classList.add("hidden");
  }
  if (menu === "ui-end") {
    document.getElementById("ui-main-menu").classList.add("hidden");
    document.getElementById("ui-players").classList.add("hidden");
    document.getElementById("ui-end").classList.remove("hidden");
  }
  // document.getElementById(menu).classList.toggle("hidden");
}

// statistics : affiche les statistiques de fin de partie          --- prototype
function statistics() {
  let container = document.getElementById("CreateTable");
  let tab;
  let td;
  for (let i = 1; i <= memory.nPlayers; i++) {
    tab = document.createElement("tr");
    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].name;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].score;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].winStreak;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].turnDurationAverage;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].turnDurationTotal;
    tab.appendChild(td);
  }
}

// createMultiplayerMenu : créé les boutons d'affichage du score en fonction du
//    nombre de joueurs
function createMultiplayerMenu() {
  let container = document.getElementById("ui-players");
  let button;
  for (let i = 1; i <= memory.nPlayers; i++) {
    button = document.createElement("button");
    button.setAttribute("class", "control-button");
    button.setAttribute("id", "P" + i);
    button.innerHTML = "P" + i + " : 0";
    container.appendChild(button);
  }
}

// setPlayers : Crée les joueurs
function setPlayers() {
  let newPlayer;
  for (let i = 1; i <= memory.nPlayers; i++) {
    newPlayer = new Player("P" + i);
    memory.players.push(newPlayer);
  }
}

// =============================================================================
// === PREPARATION DU JEU ======================================================
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

toggleMenu("ui-main-menu");

// === BOUTONS DU MENU =========================================================

let playButton = document.getElementById("play");
let difficultyButton = document.getElementById("difficulty");
let nPlayersButton = document.getElementById("nPlayers");
let replayButton = document.getElementById("replay");

playButton.addEventListener("click", function() {
  toggleMenu("ui-players");
  setPlayers();
  fillBoard();
  createMultiplayerMenu();
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

// === SAUVEGARDE ET CHARGEMENT ================================================

let saveButton = document.getElementById("save");
let loadButton = document.getElementById("load");

function saveCurrentGame() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      document.getElementById("ui-side-menu-info").innerHTML = "Partie sauvegardée";
    }
  }
  request.open("GET", "ajax.php?action=save&game=" + JSON.stringify(memory), true);
  request.send();
}

// LES CARTES SONT SUMMON DANS CARDSONBOARD ET FLIPPEDCARDS -> DOUBLONS
// Se passer du tableau flippedCards et se référer uniquement à la valeur
// isFlipped des cartes OU prendre en compte ces doublons dans la fonction
// loadLastGame et les supprimer ?
function loadLastGame() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);

      // Réinitialise les propriétés de memory et supprime les cartes
      memory.players = [];
      memory.cardsOnBoard.forEach(function(card) { unsummon(card); });
      memory.cardsOnBoard = [];
      memory.flippedCards = [];

      // Charge les propriétés du memory depuis le JSON récupéré
      memory = JSON.parse(this.responseText);

      // "play"
      toggleMenu("ui-players");
      setPlayers();
      createMultiplayerMenu();
      memory.cardsOnBoard.forEach(function(card) {
        summon(card);
        addEventToCard(card);
      });
      memory.flippedCards.forEach(function(card) {
        summon(card);
        flip(card, true);
      });
      document.getElementById("P1").classList.add("multiplayer-button");

      // Affiche un message de confirmation
      document.getElementById("ui-side-menu-info").innerHTML = "Dernière partie restaurée";
    }
  }
  request.open("GET", "ajax.php?action=load", true);
  request.send();
}

saveButton.addEventListener("click", function() { saveCurrentGame(); });
loadButton.addEventListener("click", function() { loadLastGame(); });
