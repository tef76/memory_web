<?php
include "db_infos.php";

$json_game = ($_GET["game"]);
$action = ($_GET["action"]);


$connection = mysqli_connect($db_server, $db_username, $db_password, $db_database);
if (!$connection) {
  exit ("Connection failed :".mysqli_connect_error());
}

if ($action == "save") {
  $request = "INSERT INTO $db_table last_game WHERE email = '$_SESSION["user_email"]' VALUES '$json_game ";
}

if ($action == "load") {
  $request = "SELECT last_game FROM $db_table WHERE email = '$_SESSION["user_email"]'";
}

$result = mysqli_query($connect, $request);
echo mysqli_fetch_assoc($result)["last_game"];

mysqli_close($connection);
?>
