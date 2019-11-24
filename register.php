<?php
// register.php : contient un formulaire d'inscription et le traitement de ce
// dernier

// Ouvre la session
session_start();

// Inclus les informations de connexions à la base de données
include "db_infos.php";

// Initialise les potentiels messages d'erreurs à afficher dans le formulaire
$email_err_msg = "";
$password_err_msg = "";
$validate_msg = "";

// Exécute le script seulement si un formulaire a été envoyé
if ($_SERVER["REQUEST_METHOD"] == "POST") {

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

  // Affiche un message d'erreur dans le formulaire et stoppe le script sans
  // ouvir de connexion à la base de données si le mot de passe et la
  // confirmation du mot de passe ne correspondent pas
  if ($password != $password_confirm) {
    $password_err_msg = "Les mots de passe ne correspondent pas";
    goto script_exit;
  }

  // Ouvre une nouvelle connexion à la base de données
  $mysqli = new mysqli($db_server, $db_username, $db_password, $db_database);
  if ($mysqli->connect_errno) {
    exit ("Connection failed :".$mysqli->connect_error);
  }

  // Si l'adresse mail figure déjà dans la base de données, affiche le message
  // d'erreur correspondant dans le formulaire et arrête le script
  $request = "SELECT * FROM $db_table
              WHERE email = '$email'";
  $result = $mysqli->query($request);
  if ($result->fetch_assoc() != NULL) {
    $email_err_msg = "L'adresse mail est déjà utilisée.";
    goto script_exit;
  }

  // Insère une nouvelle entrée dans la base de données et affiche le message
  // de validation dans le formulaire
  $request = "INSERT INTO $db_table (email, password)
              VALUES ('$email', '$password')";
  if ($mysqli->query($request) === TRUE ) {
    $validate_msg =  "Votre inscription a été effectuée avec succès.";
  } else {
    echo "Error: ".$request."<br>".$mysqli->connect_error;
  }

  // Ferme la connexion
  script_exit:
  if (isset($mysqli)) {
    $result->free();
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
      <h2>Nouveau compte</h2>
      <br>
      <form method="POST" name="register_form" action="<?php echo $_SERVER["PHP_SELF"];?>">
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
      <?php echo $validate_msg; ?>
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
