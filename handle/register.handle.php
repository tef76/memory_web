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

  // Stoppe le script si les mots de passes ne correspondent pas
  if ($password != $password_confirm) {
    exit ("Les mots de passe ne correspondent pas");
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
    echo "L'adresse mail est déjà utilisée.";
  }

  // Insère une nouvelle entrée dans la base de données
  $request = "INSERT INTO $db_table (email, password) VALUES ('$email', '$password')";
  if (mysqli_query($connection, $request) === TRUE ){
    echo "Votre inscription a été effectuée avec succès.";
  } else {
    echo "Error: ".$request."<br>".mysqli_connect_error();
  }

  // Ferme la connexion
  mysqli_close($connection);
}
?>
