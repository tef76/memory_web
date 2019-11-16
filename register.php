<?php
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
  $password_confirm = test_input($_POST["password_confirm"]);
  $email_err_msg = "";
  $password_err_msg = "";
  $validate_msg = "";

  // (TODO : à faire en JS)
  // Stoppe le script si les mots de passes ne correspondent pas
  if ($password != $password_confirm) {
    $password_err_msg = "Les mots de passe ne correspondent pas";
    goto script_exit;
  }

  // Créé une connexion à la base de donnée avec les informations contenues dans
  //    le fichier db_infos.php
  $connection = mysqli_connect($db_server, $db_username, $db_password, $db_database);
  if (!$connection) {
    exit ("Connection failed :".mysqli_connect_error());
  }

  // Vérifie que l'adresse mail ne figure pas déjà dans la base de données
  $request = "SELECT * FROM $db_table WHERE email = '$email'";
  $result = mysqli_query($connection, $request);
  if (mysqli_fetch_assoc($result) != NULL) {
    $email_err_msg = "L'adresse mail est déjà utilisée.";
    goto script_exit;
  }

  // Insère une nouvelle entrée dans la base de données
  $request = "INSERT INTO $db_table (email, password) VALUES ('$email', '$password')";
  if (mysqli_query($connection, $request) === TRUE ){
    $validate_msg =  "Votre inscription a été effectuée avec succès.";
    goto script_exit;
  } else {
    echo "Error: ".$request."<br>".mysqli_connect_error();
    goto script_exit;
  }

  // Ferme la connexion
  script_exit:
  if ($connection) {
    mysqli_close($connection);
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
      <a href="index.html" id="page-title">mem.io</a>
      <div id="user-authentification">
        <a href="login.php">Connexion</a>
        <a href="register.php">Nouveau compte</a>
      </div>
    </header>

    <div id="main-wrapper">
      <h2>Nouveau compte</h2>
      <br>
      <form method="POST" name="register_form" action="<?php echo $_SERVER["PHP_SELF"];?>">
        E-mail :<br>
        <input type="email" name="email" placeholder="jean.dupont@exemple.com" required>
        <?php echo $email_err_msg; ?><br>
        Mot de passe :<br>
        <input type="password" name="password" placeholder="**********" required><br>
        Confirmation du mot de passe :<br>
        <input type="password" name="password_confirm" placeholder="**********" required>
        <?php echo $password_err_msg; ?><br>
        <input type="submit" value="Créer un compte">
      </form>
      <?php echo $validate_msg; ?>
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
