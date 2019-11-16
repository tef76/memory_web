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
      <h2>Connexion</h2>
      <br>
      <form method="POST" name="login_form" action="<?php echo $_SERVER["PHP_SELF"];?>">
        E-mail :<br>
        <input type="email" name="email" placeholder="jean.dupont@exemple.com" required>
        <br>
        Mot de passe :<br>
        <input type="password" name="password" placeholder="**********" required><br>
        <br>
        <input type="submit" value="Se connecter">
      </form>
    </div>

    <footer>
      <p>"Memory.io" par Rémi Durieu et Thomas Evrard sous licence MIT
        <a target="_blank" href="https://github.com/tef76/memory_web">
        <img id="github-logo"
          src="img/GitHub-Mark-Light-32px.png"
          alt="GitHub Logo">
        </a>
      </p>
      <p>Set de cartes "Playing Cards" par Iron Star Media sous licence CC-BY
        3.0 modifié par Rémi Durieu</p>
      <p>Police "Comfortaa" par Johan Aakerlund sous licence OFL</p>
    </footer>
  </body>
</html>
