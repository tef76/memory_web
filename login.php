<?php
// login.php : contient un formulaire de connexion et le traitement de ce
// dernier

// Ouvre la session
session_start();

// Initialise le potentiel message d'erreur à afficher dans le formulaire
$err_msg = "";

// Exécute le script seulement si un formulaire a été envoyé
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Inclus les informations de connexions à la base de données
  include "db_infos.php";

  // Termine le script si les données du formulaires n'existent pas/sont vides
  if (!isset($_POST["email"]) || !isset($_POST["password"])) {
    $info_msg = "Merci de compléter le formulaire";
    goto script_exit;
  }

  if (empty($_POST["email"]) || empty($_POST["password"])) {
    $info_msg = "Merci de compléter le formulaire";
    goto script_exit;
  }

  // Test la validité de l'email fourni
  if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    $email_err_msg = "L'adresse mail n'est pas valide";
    goto script_exit;
  }

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
  $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if ($mysqli->connect_errno) {
    $err_msg = "Connection failed :".$mysqli->connect_error;
    goto script_exit;
  }

  // Envoie une requête à la base de donnée, recherchant l'entrée qui correspond
  // à l'adresse email récupérée
  $request = "SELECT * FROM ".DB_TABLE." WHERE email = '$email'";
  $result = $mysqli->query($request);
  $row = $result->fetch_assoc();

  // Si l'adresse mail n'existe pas, défini un message d'erreur
  if ($row == NULL) {
    $err_msg = "L'adresse email n'existe pas.";
  } else {
    // Compare le mot de passe récupéré avec celui chiffré dans la base de
    // données. Si ils ne correspondent pas, défini un message d'erreur, sinon
    // créé une nouvelle session et recharge la page
    $password_db = $row["password"];
    if (!password_verify($password, $password_db)) {
      $err_msg = "L'adresse email et/ou le mot de passe sont incorrects";
    } else {
      $_SESSION["user_email"] = $email;
      header("Location: index.php");
    }
  }

  // Ferme la connexion
  script_exit:
  if (isset($result)) {
    $result->free();
  }
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
        <br>
        <input type="submit" value="Se connecter" class="control-button">
      </form>
      <?php echo $err_msg; ?>
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
