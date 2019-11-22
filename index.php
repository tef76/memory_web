<?php
session_start();

// Si la page est chargée avec l'url "index.php?disconnect=1", arrête la session
//    en cours et recharge la page
if (!empty($_GET["disconnect"])) {
  session_destroy();
  header("Location: index.php");
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
        //    bouton de déconnexion. Sinon, affiche les boutons usuels de
        //    connexion et de création de nouveau compte.
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

          <div id="ui-main-menu">
            <button class="control-button" id ="play">Nouvelle partie</button>
            <button class="control-button" id ="difficulty">Nombre de paires : 3</button>
            <button class="control-button" id ="nPlayers">Nombre de joueurs : 1</button>
          </div>

          <div id="ui-players" class="hidden">
            <p>Score :</p>
          </div>

          <div id="ui-end" class="hidden">
            <div id="ui-end-replay-button">
              <button class="control-button" id ="replay">Rejouer</button>
              <table id="CreateTable">
                <tr>
                  <th>Player</th><th>score</th><th>winStreak</th><th>Temps de jeu par tour</th><th>Temps de jeu total</th>
                </tr>
              </table>
            </div>
            <p id="winner"></p>
          </div>

          <?php
          if (isset($_SESSION["user_email"])) {
            echo "<div id=\"ui-side-menu\">";
            echo "<p>".$_SESSION["user_email"]."</p>";
            echo "<button class=\"control-button\" id =\"load\">Charger la dernière partie</button>";
            echo "<button class=\"control-button\" id =\"save\">Sauvegarder la partie en cours</button>";
            echo "<p id=\"ui-side-menu-info\"></p>";
            echo "</div>";
          }
          ?>

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
      <p>Set de cartes "Playing Cards" par Iron Star Media sous licence CC-B 3.0 modifié par Rémi Durieu</p>
      <p>Police "Comfortaa" par Johan Aakerlund sous licence OFL</p>
    </footer>
  </body>
</html>
