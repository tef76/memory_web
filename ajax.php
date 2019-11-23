<?php
// ajax.php : traite les requêtes AJAX en provenance des fonctions loadLastGame
// et saveCurrentGame du fichier memory.js

// Ouvre la session
session_start();

// Inclus les informations de connexions à la base de données
include "db_infos.php";

// Récupère une partie au format JSON si celle-ci est précisée, l'action à
// effectuer, et l'email de l'utilisateur connecté
if (isset($_GET["game"])) {
  $json_game = ($_GET["game"]);
}
$action = ($_GET["action"]);
$user_email = $_SESSION["user_email"];

// Ouvre une nouvelle connexion à la base de données
$mysqli = new mysqli($db_server, $db_username, $db_password, $db_database);
if ($mysqli->connect_errno) {
  exit ("Connection failed :".$mysqli->connect_error);
}

// Si l'action demandée est la sauvegarde de la partie en cours, met à jour le
// champ "last_game" de l'utilisateur connecté avec $json_game
if ($action == "save") {
  $query = "UPDATE $db_table
            SET last_game = '$json_game'
            WHERE email = '$user_email'";
  if ($mysqli->query($query) === TRUE) {
    echo "Database updated successfully";
  }
}

// Si l'acion demandée est le chargement de la partie précédente, affiche en
// sortie cette dernière au format JSON
if ($action == "load") {
  $query = "SELECT last_game FROM $db_table WHERE email = '$user_email'";
  if ($result = $mysqli->query($query)) {
    echo $result->fetch_assoc()["last_game"];
    $result->free();
  }
}

// Ferme la connexion
$mysqli->close();

?>
