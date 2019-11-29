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
$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
if ($mysqli->connect_errno) {
  echo "Connection failed :".$mysqli->connect_error;
}

// Si l'action demandée est la sauvegarde de la partie en cours, met à jour le
// champ "last_game" de l'utilisateur connecté avec $json_game
if ($action == "save") {
  $query = "UPDATE ".DB_TABLE."
            SET last_game = '$json_game'
            WHERE email = '$user_email'";
  // En cas d'échec, affiche un message d'erreur. Sinon affiche la chaîne JSON.
  // Le message d'erreur sera mal interprété par le parser JSON et ce dernier
  // déclenchera une erreur.
  if ($mysqli->query($query) !== TRUE) {
    $mysqli->close();
    echo "SQL query failed:".$query;
  } else {
    echo $json_game;
  }
}

// Si l'acion demandée est le chargement de la partie précédente, affiche en
// sortie cette dernière au format JSON
if ($action == "load") {
  $query = "SELECT last_game FROM ".DB_TABLE." WHERE email = '$user_email'";
  if ($result = $mysqli->query($query)) {
    echo $result->fetch_assoc()["last_game"];
    $result->free();
  }
}

// Ferme la connexion
$mysqli->close();

?>
