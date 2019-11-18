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
          echo "<p>Bienvenue ".$_SESSION["user_email"]."</p>";
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
            <?php
            if (isset($_SESSION["user_email"])) {
              echo "<button class=\"control-button\" id =\"load\">Charger la dernière partie</button>";

              include "db_infos.php";

              $json_last_game;
              $last_game_err_msg = "";

              // Créé une connexion à la base de donnée avec les informations contenues dans
              //    le fichier db_infos.php
              $connection = mysqli_connect($db_server, $db_username, $db_password, $db_database);
              if (!$connection) {
                exit ("Connection failed :".mysqli_connect_error());
              }

              $request = "SELECT last_game FROM $db_table WHERE email = '".$_SESSION["user_email"]."'";
              $result = mysqli_query($connection, $request);
              $row = mysqli_fetch_assoc($result);
              if ($row == NULL) {
                $last_game_err_msg = "Impossible de récupérer la dernière partie.";
              } else {
                $json_last_game = $row["last_game"];
                echo "<div hidden id=\"json-last-game\">".htmlspecialchars($json_last_game)."</div>";
              }

              // Ferme la connexion
              mysqli_close($connection);
            }
            ?>
            <button class="control-button" id ="play">Nouvelle partie</button>
            <button class="control-button" id ="difficulty">Nombre de paires : 3</button>
            <button class="control-button" id ="nPlayers">Nombre de joueurs : 1</button>
          </div>
          <div id="ui-players" class="hidden">
            <p>Score :</p>
          </div>
          <div id="ui-end" class="hidden">
            <p id="winner"></p>
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
      <p>Set de cartes "Playing Cards" par Iron Star Media sous licence CC-B 3.0 modifié par Rémi Durieu</p>
      <p>Police "Comfortaa" par Johan Aakerlund sous licence OFL</p>
    </footer>
  </body>
</html>
