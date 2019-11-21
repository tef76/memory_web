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
// === DEFINITION DU MEMORY ====================================================
// =============================================================================

class Memory {
  constructor(nPairs, nPayers) {
    this.nPairs = nPairs;
    this.nPlayers = nPlayers,
    this.players = [];
    this.numberOfTurn = 0;
    this.currentPlayer = 1;
    this.cardsOnBoard = [];
    this.flippedCards = [];
  }

  // === LOGIQUE DE JEU ========================================================
  // ===========================================================================

  // initMemory : initialise le jeu en créant "nPairs" paires de carte
  initMemory() {
    let nCards = this.nPairs * 2;
    let cardRank;
    let newCard;
    while (nCards != 0 ) {
      cardRank = availableCards.splice(Math.floor(Math.random() * nCards), 1)[0];
      newCard = new Card(cardRank);
      this.cardsOnBoard.push(newCard);
      newCard.summon();
      nCards--;
    }
  }

  // oneTurn : un tour de jeu                      --- à préciser  --- à expliquer
  oneTurn() {
    if (this.flippedCards.length % 2 == 0) {
      this.numberOfTurn++;
      if (this.hasGameEnded()) {
        this.updateScore();
        this.endOfGame();
        return;
      }
      if (!isMatching()) {
        setTimeout(this.resetTurn, 500);
        switchCardClick(false);
        setTimeout(function() { switchCardClick(true); }, 500);
        if (this.nPlayers > 1) {
          this.nextPlayerTurn();
        }
      } else {
        this.updateScore();
      }
    }
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

  // updateScore : met à jour le score des joueurs                  --- à préciser
  updateScore() {
    this.players[this.currentPlayer - 1].score += 100;
    document.getElementById("P" + this.currentPlayer).textContent =
        "P" + this.currentPlayer + " : " + this.players[this.currentPlayer - 1].score;
  }

  // endOfGame : met fin au jeu                      --- prototype  --- à préciser
  endOfGame() {
    this.toggleMenu("memory-game");
    this.toggleMenu("ui-players");
    this.toggleMenu("ui-end");
    let winnerPlayer = this.winner();
    document.getElementById("winner").textContent = winnerPlayer + " à gagné";
  }

  // nextPlayerTurn : lance le tour du prochain joueur
  nextPlayerTurn() {
    document.getElementById("P" + this.currentPlayer).classList.remove("multiplayer-button");
    if (this.currentPlayer == this.nPlayers) {
      this.currentPlayer = 1;
    } else {
      this.currentPlayer++;
    }
    document.getElementById("P" + this.currentPlayer).classList.add("multiplayer-button");
  }

  // winner : Renvoie le numéro du joueur avec le meilleur score
  winner() {
    let winner = 0;
    for (let i = 1; i <= this.nPlayers; i++) {
      if (this.players[i - 1].score > this.players[winner].score) {
        winner = i;
      }
    }
    return winner;
  }
}

class Menu {
  constructor(game) {
    this.game = game;
    // Bouton "Jouer"
    this.playButton = document.getElementById("play");
    this.playButton.addEventListener("click", function(){
      this.toggleMenu("ui-players");
      this.toggleMenu("ui-main-menu");
      this.setPlayers();
      game.initMemory();
      this.createMultiplayerMenu();
      document.getElementById("P1").classList.add("multiplayer-button");
    });

    // Bouton de sélection de la difficulté
    this.difficultyButton = document.getElementById("difficulty");
    this.difficultyButton.addEventListener("click", function() { this.setDifficulty(this); });

    // Bouton de sélection du nombre de joueurs
    this.nPlayersButton = document.getElementById("nPlayers");
    this.nPlayersButton.addEventListener("click", function() { this.selectNumberOfPlayer(this); });

    this.replayButton = document.getElementById("replay");
    this.replayButton.addEventListener("click", function() { location.reload(); });

    this.createMultiplayerMenu();
  }

  // createMultiplayerMenu : créé les boutons d'affichage du score en fonction du
  //    nombre de joueurs
  createMultiplayerMenu() {
    let container = document.getElementById("ui-players");
    let button;
    for (let i = 1; i <= this.game.nPlayers; i++) {
      button = document.createElement("button");
      button.setAttribute("class", "control-button");
      button.setAttribute("id", "P" + i);
      button.innerHTML = "P" + i + " : 0";
      container.appendChild(button);
    }
  }

  // toggleMenu : affiche/cache le menu passé en paramètre (id HTML de la forme
  //    "ui-*nom-du-menu*")
  //    Exemple : toggleMenu("ui-main-menu") --> affiche le menu principal si ce
  //    dernier était caché
  toggleMenu(menu) {
    document.getElementById(menu).classList.toggle("hidden");
  }

  // setDifficulty : change la difficulté et met à jour le bouton en fonction
  setDifficulty(menu) {
    if (menu.game.nPairs == 9) {
      menu.game.nPairs = 3;
    } else {
      menu.game.nPairs += 3;
    }
    menu.difficultyButton.textContent = "Nombre de paires : " + menu.game.nPairs;
  }

  // selectNumberOfPlayer : définit le nombre de joueurs et met à jour le bouton
  //    en fonction
  selectNumberOfPlayer(menu) {
    if (menu.game.nPlayers == 4) {
      menu.game.nPlayers = 1;
    } else {
      menu.game.nPlayers += 1;
    }
    menu.nPlayersButton.textContent = "Nombre de Joueurs : " + menu.game.nPlayers;
  }

  // setPlayers : Crée les joueurs
  setPlayers() {
    let newPlayer;
    for(let i = 1; i <= this.game.nPlayers; i++) {
      newPlayer = new Player("P" + i);
      this.game.players.push(newPlayer);
    }
  }

  // statistics : affiche les statistiques de fin de partie          --- prototype
  statistics() {
    (numberOfTurn);
  }
}

// =============================================================================
// === AUTOUR DU MEMORY ========================================================
// =============================================================================

let isCardsClickable = true;
let availableCards = ["c01", "c01", "d01", "d01", "s01", "s01", "h01", "h01",
    "d02", "d02", "c02", "c02", "h02", "h02", "s02", "s02","d03", "d03", "c03",
    "c03", "h03", "h03", "s03", "s03"];

function saveCurrentGame(game) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("ui-side-menu-info").innerHTML =
          "Partie sauvegardée";
    }
  }
  request.open("GET", "ajax.php?action=save&game=" + JSON.stringify(game), true);
  request.send();
}

function loadLastGame() {
  let request = new XMLHttpRequest();
  rquest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("ui-side-menu-info").innerHTML =
          "Dernière partie restaurée";
      last_game = JSON.parse(this.responseText);
      nPlayers = last_game.nPlayers;
      players = last_game.players;
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
  }
  request.open("GET", "ajax.php?action=load&game=" + JSON.stringify(game), true);
  request.send();
}

// switchCardClick : active/désactive le clic sur les cartes
function switchCardClick(state) {
  isCardsClickable = state;
}

// =============================================================================
// =============================================================================
// =============================================================================

let memory = new Memory(3, 1);
let menu = new Menu(memory);
