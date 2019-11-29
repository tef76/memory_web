<?php
// register.php : contient un formulaire d'inscription et le traitement de ce
// dernier

// Ouvre la session
session_start();

// Initialise les potentiels messages d'erreurs à afficher dans le formulaire
$email_err_msg = "";
$password_err_msg = "";
$info_msg = "";

// Exécute le script d'inscription seulement si un formulaire a été envoyé
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Inclus les informations de connexions à la base de données
  include "db_infos.php";

  // Termine le script si les données du formulaires n'existent pas/sont vides
  if (!isset($_POST["email"])
      || !isset($_POST["password"])
      || !isset($_POST["password_confirm"])) {
    $info_msg = "Merci de compléter le formulaire";
    goto script_exit;
  }

  if (empty($_POST["email"])
      || empty($_POST["password"])
      || empty($_POST["password_confirm"])) {
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

  // Récupère l'email, le mot de passe et la confirmation de mot de passe
  // envoyés par le formulaire
  $email = test_input($_POST["email"]);
  $password = test_input($_POST["password"]);
  $password_confirm = test_input($_POST["password_confirm"]);

  // Stoppe le script sans ouvir de connexion à la base de données si le mot de
  // passe et la confirmation du mot de passe ne correspondent pas
  if ($password != $password_confirm) {
    $password_err_msg = "Les mots de passe ne correspondent pas";
    goto script_exit;
  } else {
    $password = password_hash($password, PASSWORD_DEFAULT);
  }

  // Ouvre une nouvelle connexion à la base de données
  $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if ($mysqli->connect_errno) {
    $info_msg = "Connection failed :".$mysqli->connect_error;
    goto script_exit;
  }

  // Si l'adresse mail figure déjà dans la base de données, affiche le message
  // d'erreur correspondant dans le formulaire et arrête le script
  $request = "SELECT * FROM ".DB_TABLE."
              WHERE email = '$email'";
  $result = $mysqli->query($request);
  if ($result->fetch_assoc() != NULL) {
    $email_err_msg = "L'adresse mail est déjà utilisée.";
    goto script_exit;
  }

  // Insère une nouvelle entrée dans la base de données et affiche le message
  // de validation dans le formulaire
  $request = "INSERT INTO ".DB_TABLE." (email, password)
              VALUES ('$email', '$password')";
  if ($mysqli->query($request) === TRUE ) {
    $info_msg =  "Votre inscription a été effectuée avec succès.";
  } else {
    $info_msg = "Error: ".$request."<br>".$mysqli->connect_error;
  }

  // Ferme la connexion
  script_exit:
  if (isset($mysqli)) {
    if (isset($result)) {
      $result->free();
    }
    $mysqli->close();
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
      <h2>Nouveau compte</h2>
      <br>
      <form method="POST" name="register_form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        E-mail :
        <br>
        <input type="email" name="email" placeholder="jean.dupont@exemple.com" required>
        <?php echo $email_err_msg; ?>
        <br>
        Mot de passe :
        <br>
        <input type="password" name="password" placeholder="**********" required>
        <br>
        Confirmation du mot de passe :
        <br>
        <input type="password" name="password_confirm" placeholder="**********" required>
        <?php echo $password_err_msg; ?>
        <br>
        <br>
        <input type="submit" value="Créer un compte" class="control-button">
      </form>
      <?php echo $info_msg; ?>
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
