"use strict"

// =============================================================================
// === DEFINITION DE PLAYER ====================================================
// =============================================================================

// --- Objet Player ------------------------------------------------------------
function Player(name) {
  this.name = name;
  this.score = 0;
  this.winStreak = 0;
  this.numberOfTurn = 0;
  this.turnDurationAverage = 0;
  this.turnDurationTotal = 0;
}

// =============================================================================
// === DEFINITION DE CARD ======================================================
// =============================================================================

// --- Objet Card --------------------------------------------------------------
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

// --- Fonctions liées à l'objet Card ------------------------------------------

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

// addEventToCard : ajoute à card l'évènement chargé de la retourner
function addEvent(card) {
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

// flip : modifie la classe de this.inner et ajuste this.isFlipped en fonction
// de state
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
  this.currentPlayer = 1;
  this.cardsOnBoard = new Array();
  this.flippedCards = new Array();
  this.currentWinStreak = 0;
}

// --- Fonctions liées à l'objet Memory ----------------------------------------

// fillBoard : créé les cartes du memory et les affiche
function fillBoard() {
  let nCards = memory.nPairs * 2;
  let cardRank = "";
  let newCard = null;
  while (nCards != 0 ) {
    cardRank = availableCards.splice(Math.floor(Math.random() * nCards), 1)[0];
    newCard = new Card(cardRank);
    memory.cardsOnBoard.push(newCard);
    summon(newCard);
    addEvent(newCard);
    nCards--;
  }
}

// oneTurn : lance un nouveau tour de jeu lorsque deux cartes ont été révélées
function oneTurn() {
  if (memory.flippedCards.length % 2 == 0) {

    // Si toutes les cartes sont retournées, met fin au jeu
    if (hasGameEnded()) {
      memory.currentWinStreak += 1;
      updateScore();
      setTimeout(endOfGame, 750);
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
      memory.players[memory.currentPlayer - 1].numberOfTurn += 1;
      updateScore();
    }
  }
}

// nextPlayerTurn : lance le tour du prochain joueur
function nextPlayerTurn() {
  let x = document.getElementById("P" + memory.currentPlayer);
  x.classList.remove("active-player");
  if (memory.currentPlayer == memory.nPlayers) {
    memory.currentPlayer = 1;
  } else {
    memory.currentPlayer++;
  }
  memory.players[memory.currentPlayer - 1].numberOfTurn += 1;
  x = document.getElementById("P" + memory.currentPlayer);
  x.classList.add("active-player");
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

// updateScore : met à jour le score du joueur en cours
function updateScore() {
  let player = memory.players[memory.currentPlayer - 1];
  player.score += 100;
  document.getElementById("P" + memory.currentPlayer).textContent =
      "P" + memory.currentPlayer + " : " + player.score;
  if (memory.currentWinStreak > player.winStreak) {
    player.winStreak = memory.currentWinStreak;
  }
}

// endOfGame : met fin au jeu
function endOfGame() {
  toggleMenu("ui-end");
  let winnerPlayer = winnerIndex();
  document.getElementById("winner").textContent =
      "P" + (winnerPlayer + 1) + " a gagné";
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

// timeOfPlayer : calcule le temps de jeu de chaque joueurs
function timeOfPlayer() {
  let timer = setInterval(function() {
    memory.players[memory.currentPlayer - 1].turnDurationTotal += 1;
    if (hasGameEnded()) {
        clearInterval(timer);
    }
  }, 1000);
}

// =============================================================================
// === INTERFACE UTILISATEUR ===================================================
// =============================================================================

// toggleMenu : affiche/cache le menu passé en paramètre (id HTML de la forme
// "ui-*nom-du-menu*")
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
    document.getElementById("memory-game").classList.add("hidden");
  }
}

// statistics : affiche les statistiques de fin de partie
function statistics() {
  let container = document.getElementById("stats-table");
  let tab;
  let td;
  for (let i = 1; i <= memory.nPlayers; i++) {
    if(memory.players[i - 1].turnDurationTotal != 0){
      memory.players[i - 1].turnDurationAverage =
        memory.players[i - 1].turnDurationTotal /
          memory.players[i - 1].numberOfTurn;
    }

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
    td.textContent = memory.players[i-1].numberOfTurn;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].winStreak;
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].turnDurationAverage.toFixed(2) + "s";
    tab.appendChild(td);

    container.appendChild(tab);
    td = document.createElement("td")
    td.textContent = memory.players[i-1].turnDurationTotal + "s";
    tab.appendChild(td);
  }
}

// createMultiplayerMenu : créé les boutons d'affichage du score en fonction du
// nombre de joueurs
function createMultiplayerMenu() {
  let container = document.getElementById("ui-players");
  let title = document.createElement("p");
  title.innerHTML = "Score :";
  container.appendChild(title);
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
  document.getElementById("P1").classList.add("active-player");
  memory.players[0].numberOfTurn = 1;
  timeOfPlayer();
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

// saveCurrentGame : sauvegarde la partie actuelle dans la base de données
function saveCurrentGame() {
  // Message d'information
  let info = "";

  // Si aucune partie n'est en cours, affiche un message adéquat et arrête la
  // fonction
  if (memory.cardsOnBoard.length == 0 || hasGameEnded()) {
    info = "Aucune partie à sauvegarder";
    document.getElementById("ui-side-menu-info-on-game").innerHTML = info;
    return;
  }

  // Créé une nouvelle requête AJAX
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      try {
        // Si la partie a bien été sauvegardée, ajax.php renvoie la partie au
        // format JSON. Dans le cas contraire, JSON.parse retourne une erreur et
        // déclenche le bloc catch
        JSON.parse(this.responseText);
        info = "Partie sauvegardée";
      } catch (e) {
        console.error("Parsing error:", e);
        info = "Impossible de sauvegarder la partie";
      }
    } else {
      info = "Impossible de sauvegarder la partie";
    }

    // Affiche le message d'information
    document.getElementById("ui-side-menu-info-on-game").innerHTML = info;
  }

  // Envoie la requête
  request.open("GET", "ajax.php?action=save&game=" + JSON.stringify(memory));
  request.send();
}

// loadLastGame : charge la partie dernière partie sauvegardée de l'utilisateur
function loadLastGame() {
  // Message d'information
  let info = "";

  // Créé une nouvelle requête AJAX
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      try {
        // Charge les propriétés du memory depuis le JSON récupéré
        let response = JSON.parse(this.responseText);

        // Réinitialise les propriétés du memory et supprime les cartes
        memory.players = [];
        memory.cardsOnBoard.forEach(function(card) { unsummon(card); });
        memory.cardsOnBoard = [];
        memory.flippedCards = [];

        // Affecte les propriétés du nouveau memory
        memory = response;
      } catch (e) {
        console.error("Parsing error:", e);

        // Affiche le message d'information
        info = "Impossible de restaurer la partie";
        document.getElementById("ui-side-menu-info-on-game").innerHTML = info;
        return;
      }
      // Active l'affichage du menu multijoueur et de la vue principale
      toggleMenu("ui-players");
      document.getElementById("memory-game").classList.remove("hidden");

      // Efface les boutons multijoueurs de la potentielle partie en cours
      let uiPlayerContainer = document.getElementById("ui-players");
      while (uiPlayerContainer.firstChild != null) {
        uiPlayerContainer.removeChild(uiPlayerContainer.firstChild);
      }

      // Créé les boutons multijoueurs de la nouvelle partie
      createMultiplayerMenu();
      memory.players.forEach(function(player) {
        document.getElementById(player.name).textContent =
            player.name + " : " + player.score;
      });
      let x = document.getElementById("P" + memory.currentPlayer);
      x.classList.add("active-player");

      // Affiche les cartes de la nouvelle partie
      memory.cardsOnBoard.forEach(function(card) {
        summon(card);
        if (card.isFlipped) {
          flip(card, true);
        } else {
          addEvent(card);
        }
      });

      info = "Dernière partie restaurée";
    } else {
      info = "Impossible de restaurer la partie";
    }

    // Affiche le message d'information
    document.getElementById("ui-side-menu-info-on-game").innerHTML = info;
  }

  // Envoie la requête
  request.open("GET", "ajax.php?action=load");
  request.send();
}

saveButton.addEventListener("click", function() { saveCurrentGame(); });
loadButton.addEventListener("click", function() { loadLastGame(); });
