<?php
session_start();

// Si la page est chargée avec l'url "index.php?disconnect=1", arrête la session
// en cours et recharge la page
if (!empty($_GET["disconnect"])) {
  session_destroy();
  header("Location: index.php");
}

// hide_if_unknown : output "hidden" dans le fichier si aucun utilisateur n'est
// connecté. Permet de masquer certaines balises utiles uniquement si une
// session à été ouverte
function hide_if_unknown() {
  if (!isset($_SESSION["user_email"])) {
    echo "hidden";
  }
}
?>

<!DOCTYPE html>

<html lang="fr">

  <head>
    <title>mem.io</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" media="screen" href="https://fontlibrary.org/face/comfortaa" type="text/css"/>
  </head>

  <body>
    <header>
      <a href="index.php" id="page-title">mem.io</a>
      <div id="user-authentification">
        <?php
        // Si une session est définie, affiche un mesage de bienvenue et un
        // bouton de déconnexion. Sinon, affiche les boutons usuels de connexion
        // et de création de nouveau compte.
        if (isset($_SESSION["user_email"])) {
          echo "<a href=\"index.php?disconnect=1\">Déconnexion</a>";
        } else {
          echo "<a href=\"login.php\">Connexion</a>";
          echo "<a href=\"register.php\">Nouveau compte</a>";
        }
        ?>
      </div>
    </header>

    <div id="main-content">

      <div id="ui-container">
        <div id="ui-inner">

          <div id="ui-side-menu">
            <div id="ui-side-menu-info">
              <?php
                if (isset($_SESSION["user_email"])) {
                  echo "<p>".$_SESSION["user_email"]."</p>";
                } else {
                  echo "<p>Connectez vous pour sauvegarder votre partie</p>";
                }
              ?>
              <p id="ui-side-menu-info-on-game"></p>
            </div>
            <div id="ui-side-menu-buttons">
              <button <?php hide_if_unknown(); ?> class="control-button" id ="load">Charger la dernière partie</button>
              <button <?php hide_if_unknown(); ?> class="control-button" id ="save">Sauvegarder la partie en cours</button>
            </div>
          </div>

          <div id="ui-main-menu" class="hidden">
            <button class="control-button" id ="play">Nouvelle partie</button>
            <button class="control-button" id ="difficulty">Nombre de paires : 3</button>
            <button class="control-button" id ="nPlayers">Nombre de joueurs : 1</button>
          </div>

          <div id="ui-players" class="hidden">
          </div>

          <div id="ui-end" class="hidden">
            <div id="ui-end-replay-button">
              <button class="control-button" id ="replay">Rejouer</button>
            </div>
            <table id="stats-table">
              <tr>
                <th id="winner" colspan="6"></th>
              </tr>
              <tr>
                <th>Player</th><th>Score</th><th>Nombre de tours</th><th>Win Streak</th><th>Temps de jeu par tour</th><th>Temps de jeu total</th>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div id="memory-game">
        <script src="memory.js"></script>
      </div>

    </div>

    <footer>
      <p>"Memory.io" par Rémi Durieu et Thomas Evrard sous licence MIT
        <a target="_blank" href="https://github.com/tef76/memory_web">
          <img id="github-logo" src="img/GitHub-Mark-Light-32px.png" alt="GitHub Logo">
        </a>
      </p>
      <p>Set de cartes <a target="_blank" href="http://www.ironstarmedia.co.uk/resources/free-game-assets/?drawer=assets*graphics*sprites*Playing%20Cards">"Playing Cards"</a> par Iron Star Media sous licence CC-BY 3.0 modifié par Rémi Durieu</p>
      <p>Police <a target="_blank" href="https://fontlibrary.org/en/font/comfortaa">"Comfortaa"</a> par Johan Aakerlund sous licence OFL</p>
    </footer>
  </body>
</html>
