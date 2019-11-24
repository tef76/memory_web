<?php
// login.php : contient un formulaire de connexion et le traitement de ce
// dernier

// Ouvre la session
session_start();

// Inclus les informations de connexions à la base de données
include "db_infos.php";

// Initialise le potentiel message d'erreur à afficher dans le formulaire
$err_msg = "";

// Exécute le script seulement si un formulaire a été envoyé
if ($_SERVER["REQUEST_METHOD"] == "POST") {

  // test_input : supprime les caractères non désirables de la chaîne $data
  function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

  // Récupère l'email et le mot de passe envoyés par le formulaire
  $email = test_input($_POST["email"]);
  $password = test_input($_POST["password"]);

  // Ouvre une nouvelle connexion à la base de données
  $mysqli = new mysqli($db_server, $db_username, $db_password, $db_database);
  if ($mysqli->connect_errno) {
    exit ("Connection failed :".$mysqli->connect_error);
  }

  // Envoie une requête à la base de données, recherchant l'entrée qui
  // correspond au couple $email/$password donnée en entrée
  $request = "SELECT * FROM $db_table
              WHERE email = '$email' AND password = '$password'";
  $result = $mysqli->query($request);
  if ($result->fetch_assoc() == NULL) {
    $err_msg = "L'adresse mail et/ou le mot de passe sont incorrects.";
  } else {
    $_SESSION["user_email"] = $email;
    header("Location: index.php");
  }

  // Ferme la connexion
  $result->free();
  $mysqli->close();
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
        if (isset($_SESSION["user_email"])) {
          echo "<p>Bienvenue ".$_SESSION["user_email"]."</p>";
        } else {
          echo "<a href=\"login.php\">Connexion</a>";
          echo "<a href=\"register.php\">Nouveau compte</a>";
        }
        ?>
      </div>
    </header>

    <div id="main-content">
      <h2>Connexion</h2>
      <br>
      <form method="POST" name="login_form" action="<?php echo $_SERVER["PHP_SELF"];?>">
        E-mail :
        <br>
        <input type="email" name="email" placeholder="jean.dupont@exemple.com" required>
        <br>
        Mot de passe :
        <br>
        <input type="password" name="password" placeholder="**********" required>
        <br>
        <?php echo $err_msg; ?>
        <br>
        <input type="submit" value="Se connecter" class="control-button">
      </form>
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
