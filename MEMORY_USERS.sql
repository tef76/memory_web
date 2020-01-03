-- phpMyAdmin SQL Dump
-- version 5.0.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  ven. 03 jan. 2020 à 13:12
-- Version du serveur :  10.4.11-MariaDB
-- Version de PHP :  7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `remidb`
--

-- --------------------------------------------------------

--
-- Structure de la table `MEMORY_USERS`
--

CREATE TABLE `MEMORY_USERS` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_game` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `MEMORY_USERS`
--

INSERT INTO `MEMORY_USERS` (`id`, `email`, `password`, `last_game`) VALUES
(23, 'jean@exemple.com', '$2y$10$w2N83kCCjBqONTYhUHFq5.HXMGUiCOt7/Lk4.qaVQyKY1x25QQPqi', '{\"nPairs\":3,\"nPlayers\":1,\"players\":[{\"name\":\"P1\",\"score\":0,\"winStreak\":0,\"numberOfTurn\":1,\"turnDurationAverage\":0,\"turnDurationTotal\":1}],\"currentPlayer\":1,\"cardsOnBoard\":[{\"rank\":\"c01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"s01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/s01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"d01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/d01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"d01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/d01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"s01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/s01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}}],\"flippedCards\":[],\"currentWinStreak\":0}'),
(24, 'luc.durand@gmail.com', '$2y$10$VHXi7apbDgqUUNY2DGxh0.f/zJpFISASZSw7opwtj2rV6m4XT54vG', NULL),
(25, 'remid@test.fr', '$2y$10$6T5FG0o5S9gPYoBQDJTKnu5s26XCICVWr180NX8NULeAnhA8h90ne', '{\"nPairs\":6,\"nPlayers\":2,\"players\":[{\"name\":\"P1\",\"score\":0,\"winStreak\":0,\"numberOfTurn\":5,\"turnDurationAverage\":0,\"turnDurationTotal\":7},{\"name\":\"P2\",\"score\":300,\"winStreak\":2,\"numberOfTurn\":8,\"turnDurationAverage\":0,\"turnDurationTotal\":13}],\"currentPlayer\":2,\"cardsOnBoard\":[{\"rank\":\"c02\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c02.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"s01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/s01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"d01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/d01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c02\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c02.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"d02\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/d02.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"d01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/d01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"h01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/h01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"s01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/s01.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"d02\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/d02.png\",\"isFlipped\":false,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"h01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/h01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}}],\"flippedCards\":[{\"rank\":\"c02\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c02.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c02\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c02.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"c01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/c01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"h01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/h01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}},{\"rank\":\"h01\",\"imgBack\":\"img/backs/Card-Back-Orange.png\",\"imgFront\":\"img/cards/h01.png\",\"isFlipped\":true,\"container\":{},\"front\":{},\"back\":{},\"inner\":{}}],\"currentWinStreak\":1}');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `MEMORY_USERS`
--
ALTER TABLE `MEMORY_USERS`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `MEMORY_USERS`
--
ALTER TABLE `MEMORY_USERS`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

