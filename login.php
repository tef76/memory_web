<?php
session_start();

include "db_infos.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

  $email = test_input($_POST["email"]);
  $password = test_input($_POST["password"]);
  $err_msg = "";

  // Créé une connexion à la base de donnée avec les informations contenues dans
  //    le fichier db_infos.php
  $connection = mysqli_connect($db_server, $db_username, $db_password, $db_database);
  if (!$connection) {
    exit ("Connection failed :".mysqli_connect_error());
  }

  // Envoie une requête à la base de données, recherchant l'entrée qui
  //    correspond au couple email/password donnée en entrée
  $request = "SELECT * FROM $db_table WHERE email = '$email' AND password = '$password'";
  $result = mysqli_query($connection, $request);
  if (mysqli_fetch_assoc($result) == NULL) {
    $err_msg = "L'adresse mail et/ou le mot de passe sont incorrects.";
  } else {
    $_SESSION["user_email"] = $email;
    header("Location: index.php");
  }

  // Ferme la connexion
  mysqli_close($connection);
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

    <div id="main-wrapper">
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
        <input type="submit" value="Se connecter">
      </form>
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
