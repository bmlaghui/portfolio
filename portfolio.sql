-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  jeu. 17 mai 2018 à 15:19
-- Version du serveur :  10.1.29-MariaDB
-- Version de PHP :  7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `portfolio`
--

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_article`
--

CREATE TABLE `portfolio_article` (
  `id_article` int(11) NOT NULL,
  `lib_article` varchar(32) NOT NULL,
  `description_article` text NOT NULL,
  `image_article` varchar(50) NOT NULL,
  `date_article` date NOT NULL,
  `nb_vus_article` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_categorie`
--

CREATE TABLE `portfolio_categorie` (
  `id_categorie` int(11) NOT NULL,
  `reference_categorie` int(11) NOT NULL,
  `lib_categorie` varchar(32) NOT NULL,
  `note_categorie` float(2,2) NOT NULL,
  `progressbar-from` varchar(10) NOT NULL,
  `progressbar-to` varchar(10) NOT NULL,
  `etat_categorie` int(11) DEFAULT NULL,
  `description_categorie` text NOT NULL,
  `abbreviation_categorie` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_categorie`
--

INSERT INTO `portfolio_categorie` (`id_categorie`, `reference_categorie`, `lib_categorie`, `note_categorie`, `progressbar-from`, `progressbar-to`, `etat_categorie`, `description_categorie`, `abbreviation_categorie`) VALUES
(1, 0, 'Développement Web', 0.70, '3498db', '51f2ec', 1, '', 'devweb'),
(2, 0, 'Développement Desktop', 0.60, '3498db', 'ffd200', 1, '', 'devdesk'),
(3, 0, 'Développement Mobile', 0.20, 'F09C88', '3498db', 1, '', 'devmob'),
(4, 0, 'Conception graphique', 0.90, 'F09C88', 'FFFFFF', 0, '', 'concgraph');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_client`
--

CREATE TABLE `portfolio_client` (
  `id_client` int(11) NOT NULL,
  `raison_sociale_client` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_client`
--

INSERT INTO `portfolio_client` (`id_client`, `raison_sociale_client`) VALUES
(1, 'Tesla Technologies'),
(2, 'Anonyme');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_formation`
--

CREATE TABLE `portfolio_formation` (
  `id_formation` int(11) NOT NULL,
  `lib_formation` varchar(256) NOT NULL,
  `id_institut` int(11) NOT NULL,
  `annee_debut_formation` varchar(4) NOT NULL,
  `annee_fin_formation` varchar(4) NOT NULL,
  `abbreviation_formation` varchar(10) NOT NULL,
  `description_formation` varchar(256) NOT NULL,
  `ordre_formation` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_formation`
--

INSERT INTO `portfolio_formation` (`id_formation`, `lib_formation`, `id_institut`, `annee_debut_formation`, `annee_fin_formation`, `abbreviation_formation`, `description_formation`, `ordre_formation`) VALUES
(1, 'Master professionnel en Informatique de gestion', 1, '2012', '2014', 'M2', 'Spécialité : E-commerce', 1),
(2, 'Licence Appliquée en Technologies de l\'informatique', 2, '2009', '2012', 'L3', 'Spécialité : Développement des Systèmes d\'Information', 2),
(3, 'Baccalauréat', 4, '2009', '2009', 'BAC', 'Section : Sciences de l\'informatique', 1),
(4, 'BTS Services Informatiques aux Organisations', 3, '2017', '', 'BTS1', '', 1);

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_information`
--

CREATE TABLE `portfolio_information` (
  `id_info` int(11) NOT NULL,
  `nom` varchar(32) NOT NULL,
  `prenom` varchar(32) NOT NULL,
  `date_naissance` date NOT NULL,
  `adresse` varchar(256) NOT NULL,
  `telephone` int(11) NOT NULL,
  `email` varchar(32) NOT NULL,
  `description` text NOT NULL,
  `occupation` varchar(32) NOT NULL,
  `specialite` varchar(32) NOT NULL,
  `langues` varchar(256) NOT NULL,
  `hobbies` varchar(256) NOT NULL,
  `image` varchar(100) NOT NULL,
  `autres` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_information`
--

INSERT INTO `portfolio_information` (`id_info`, `nom`, `prenom`, `date_naissance`, `adresse`, `telephone`, `email`, `description`, `occupation`, `specialite`, `langues`, `hobbies`, `image`, `autres`) VALUES
(0, 'MLAGHUI', 'BRAHIM', '1990-05-09', '25 Avenue Jean Jaures 93300 Aubervilliers', 767510038, 'bmlaghui@gmail.com', 'Un jeune tunisien ', 'gérant, étudiant', 'informatique (Développement)', 'Français, Arabe, Anglais', 'Football, Voyages, Cinéma', 'images/user/user-pic.jpg', '');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_institut`
--

CREATE TABLE `portfolio_institut` (
  `id_institut` int(11) NOT NULL,
  `lib_institut` varchar(100) NOT NULL,
  `photo_institut` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_institut`
--

INSERT INTO `portfolio_institut` (`id_institut`, `lib_institut`, `photo_institut`) VALUES
(1, 'Ecole Supérieure de l\'Economie Numérique, Manouba , Tunisie', 'images/layouts/timeline/02.jpg'),
(2, 'Institut Supérieur des Etudes Technologiques, Charguia, Tunisie', 'images/layouts/timeline/01.jpg'),
(3, 'ITIC Paris', 'images/layouts/timeline/03.jpg'),
(4, 'Lycée Secondaire Hamoubda Bêcha , Manouba, Tunisie', 'images/layouts/timeline/04.jpg'),
(5, 'MULTISERV PLUS', 'images/layouts/timeline/06.jpg'),
(6, 'PIXEL SERVICES', '');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_projet`
--

CREATE TABLE `portfolio_projet` (
  `id_projet` int(11) NOT NULL,
  `lib_projet` varchar(32) NOT NULL,
  `description_projet` text NOT NULL,
  `url_projet` varchar(32) NOT NULL,
  `id_categorie` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `date_projet` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_projet`
--

INSERT INTO `portfolio_projet` (`id_projet`, `lib_projet`, `description_projet`, `url_projet`, `id_categorie`, `id_client`, `date_projet`) VALUES
(1, 'Projet 1', 'Hello Modif', 'http://www.multiserv-tn.Com', 1, 1, '0000-00-00'),
(2, 'Projet 2', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 2, '2018-05-01'),
(3, 'Projet 3', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 1, '2018-05-01'),
(4, 'Projet 4', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 2, '2018-05-01'),
(5, 'Projet 5', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 2, '2018-05-01'),
(6, 'Projet 6', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 2, '2018-05-01'),
(7, 'Projet 7', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 2, '2018-05-01'),
(8, 'Projet 8', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 4, 2, '2018-05-01'),
(9, 'Projet 9', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles, mais s\'est aussi adapté à la bureautique informatique, sans que son contenu n\'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\r\n\r\n', 'http://www.multiserv-tn.Com', 2, 2, '2018-05-01'),
(14, 'test', 'testtttt', 'aaa.fr', 1, 1, '0000-00-00');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_projet_technologie`
--

CREATE TABLE `portfolio_projet_technologie` (
  `id_projet_technologie` int(11) NOT NULL,
  `id_projet` int(11) NOT NULL,
  `id_technologie` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_projet_technologie`
--

INSERT INTO `portfolio_projet_technologie` (`id_projet_technologie`, `id_projet`, `id_technologie`) VALUES
(3, 2, 10),
(4, 2, 11),
(5, 14, 1),
(6, 14, 2),
(7, 14, 3),
(8, 14, 4),
(9, 14, 5),
(37, 1, 1),
(38, 1, 2),
(39, 1, 3),
(40, 1, 4);

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_qualite`
--

CREATE TABLE `portfolio_qualite` (
  `id_qualite` int(11) NOT NULL,
  `lib_qualite` varchar(32) NOT NULL,
  `icone_qualite` varchar(32) NOT NULL,
  `description_qualite` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_qualite`
--

INSERT INTO `portfolio_qualite` (`id_qualite`, `lib_qualite`, `icone_qualite`, `description_qualite`) VALUES
(1, 'Optimiste', 'flaticon-pie-graph', 'En ces périodes de troubles économiques, dites que vous voyez les choses du bon côté, que s’il y a des problèmes, ils sont toujours marginaux et qu’il y a toujours une solution. « Invoquer cette qualité en entretien d\'embauche permet au candidat de suggérer qu\'il est capable d’avoir un effet de levier constructif sur les choses, qu’il est capable de s’automotiver», souligne Catherine de Verdière, administrateur du Syntec conseil en recrutement et dirigeante de Bonnel Conseils Associés.\r\n'),
(2, 'Curiosité', 'flaticon-pie-graph', 'Cette qualité là montre que vous savez élargir votre horizon et que vous êtes en capacité d’apprentissage. Une aubaine pour les employeurs qui recherchent des collaborateurs susceptibles d’évoluer au gré des réorganisations. Attention cependant à ne pas faire dériver cette qualité en défaut notamment lorsque l\'entretien d\'embauche porte sur un poste qui requiert la plus grande confidentialité de la part du salarié.\r\n\r\n'),
(3, 'Bon relationnel', 'flaticon-pie-graph', 'En ces périodes de troubles économiques, dites que vous voyez les choses du bon côté, que s’il y a des problèmes, ils sont toujours marginaux et qu’il y a toujours une solution. « Invoquer cette qualité en entretien d\'embauche permet au candidat de suggérer qu\'il est capable d’avoir un effet de levier constructif sur les choses, qu’il est capable de s’automotiver», souligne Catherine de Verdière, administrateur du Syntec conseil en recrutement et dirigeante de Bonnel Conseils Associés.\r\n'),
(4, 'Adaptable', 'flaticon-pie-graph', 'Cette qualité là montre que vous savez élargir votre horizon et que vous êtes en capacité d’apprentissage. Une aubaine pour les employeurs qui recherchent des collaborateurs susceptibles d’évoluer au gré des réorganisations. Attention cependant à ne pas faire dériver cette qualité en défaut notamment lorsque l\'entretien d\'embauche porte sur un poste qui requiert la plus grande confidentialité de la part du salarié.\r\n\r\n');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_screenshoot`
--

CREATE TABLE `portfolio_screenshoot` (
  `id_screenshoot` int(11) NOT NULL,
  `url_screenshoot` varchar(50) NOT NULL,
  `id_projet` int(11) NOT NULL,
  `etat_screenshoot` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_screenshoot`
--

INSERT INTO `portfolio_screenshoot` (`id_screenshoot`, `url_screenshoot`, `id_projet`, `etat_screenshoot`) VALUES
(1, 'images/layouts/samuel/portfolio/4-columns/15.jpg', 1, 1),
(2, 'images/layouts/samuel/portfolio/4-columns/02.jpg', 2, 1),
(3, 'images/layouts/samuel/portfolio/4-columns/03.jpg', 3, 1),
(4, 'images/layouts/samuel/portfolio/4-columns/04.jpg', 4, 1),
(5, 'images/layouts/samuel/portfolio/4-columns/05.jpg', 5, 1),
(6, 'images/layouts/samuel/portfolio/4-columns/06.jpg', 6, 1),
(7, 'images/layouts/samuel/portfolio/4-columns/07.jpg', 7, 1),
(8, 'images/layouts/samuel/portfolio/4-columns/08.jpg', 8, 1),
(9, 'images/layouts/samuel/portfolio/4-columns/09.jpg', 9, 1),
(10, 'images/layouts/samuel/portfolio/4-columns/11.jpg', 1, 0),
(11, 'images/layouts/samuel/portfolio/4-columns/01.jpg', 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_technologie`
--

CREATE TABLE `portfolio_technologie` (
  `id_technologie` int(11) NOT NULL,
  `lib_technologie` varchar(32) NOT NULL,
  `id_categorie` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_technologie`
--

INSERT INTO `portfolio_technologie` (`id_technologie`, `lib_technologie`, `id_categorie`) VALUES
(1, 'HTML', 1),
(2, 'PHP', 1),
(3, 'CSS', 1),
(4, 'JQUERY', 1),
(5, 'AJAX', 1),
(6, 'JAVA', 2),
(7, 'C#', 2),
(8, 'C', 2),
(9, 'PASCAL', 2),
(10, 'ADOBE PHOTOSHOP', 4),
(11, 'ADOBE ILLUSTRATOR', 4);

-- --------------------------------------------------------

--
-- Structure de la table `portfolio_user`
--

CREATE TABLE `portfolio_user` (
  `id_user` int(11) NOT NULL,
  `nom_prenom_user` varchar(50) NOT NULL,
  `login_user` varchar(32) NOT NULL,
  `mdp_user` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portfolio_user`
--

INSERT INTO `portfolio_user` (`id_user`, `nom_prenom_user`, `login_user`, `mdp_user`) VALUES
(1, 'MLAGHUI BRAHIM', 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997');

-- --------------------------------------------------------

--
-- Structure de la table `portolio_experience`
--

CREATE TABLE `portolio_experience` (
  `id_experience` int(11) NOT NULL,
  `lib_experience` varchar(32) NOT NULL,
  `id_institut` int(11) NOT NULL,
  `annee_debut_experience` varchar(4) NOT NULL,
  `annee_fin_experience` varchar(4) NOT NULL,
  `ordre_experience` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `portolio_experience`
--

INSERT INTO `portolio_experience` (`id_experience`, `lib_experience`, `id_institut`, `annee_debut_experience`, `annee_fin_experience`, `ordre_experience`) VALUES
(1, 'Gérant', 5, '2016', '', 0),
(2, 'Webmaster', 6, '2015', '2015', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `portfolio_article`
--
ALTER TABLE `portfolio_article`
  ADD PRIMARY KEY (`id_article`);

--
-- Index pour la table `portfolio_categorie`
--
ALTER TABLE `portfolio_categorie`
  ADD PRIMARY KEY (`id_categorie`);

--
-- Index pour la table `portfolio_client`
--
ALTER TABLE `portfolio_client`
  ADD PRIMARY KEY (`id_client`);

--
-- Index pour la table `portfolio_formation`
--
ALTER TABLE `portfolio_formation`
  ADD PRIMARY KEY (`id_formation`),
  ADD KEY `id_institut` (`id_institut`);

--
-- Index pour la table `portfolio_information`
--
ALTER TABLE `portfolio_information`
  ADD PRIMARY KEY (`id_info`),
  ADD KEY `id_info` (`id_info`);

--
-- Index pour la table `portfolio_institut`
--
ALTER TABLE `portfolio_institut`
  ADD PRIMARY KEY (`id_institut`);

--
-- Index pour la table `portfolio_projet`
--
ALTER TABLE `portfolio_projet`
  ADD PRIMARY KEY (`id_projet`);

--
-- Index pour la table `portfolio_projet_technologie`
--
ALTER TABLE `portfolio_projet_technologie`
  ADD PRIMARY KEY (`id_projet_technologie`),
  ADD KEY `id_projet` (`id_projet`),
  ADD KEY `id_technologie` (`id_technologie`);

--
-- Index pour la table `portfolio_qualite`
--
ALTER TABLE `portfolio_qualite`
  ADD PRIMARY KEY (`id_qualite`);

--
-- Index pour la table `portfolio_screenshoot`
--
ALTER TABLE `portfolio_screenshoot`
  ADD PRIMARY KEY (`id_screenshoot`);

--
-- Index pour la table `portfolio_technologie`
--
ALTER TABLE `portfolio_technologie`
  ADD PRIMARY KEY (`id_technologie`),
  ADD KEY `id_categorie` (`id_categorie`);

--
-- Index pour la table `portfolio_user`
--
ALTER TABLE `portfolio_user`
  ADD PRIMARY KEY (`id_user`);

--
-- Index pour la table `portolio_experience`
--
ALTER TABLE `portolio_experience`
  ADD PRIMARY KEY (`id_experience`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `portfolio_article`
--
ALTER TABLE `portfolio_article`
  MODIFY `id_article` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `portfolio_categorie`
--
ALTER TABLE `portfolio_categorie`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `portfolio_client`
--
ALTER TABLE `portfolio_client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `portfolio_formation`
--
ALTER TABLE `portfolio_formation`
  MODIFY `id_formation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `portfolio_institut`
--
ALTER TABLE `portfolio_institut`
  MODIFY `id_institut` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `portfolio_projet`
--
ALTER TABLE `portfolio_projet`
  MODIFY `id_projet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `portfolio_projet_technologie`
--
ALTER TABLE `portfolio_projet_technologie`
  MODIFY `id_projet_technologie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT pour la table `portfolio_qualite`
--
ALTER TABLE `portfolio_qualite`
  MODIFY `id_qualite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `portfolio_screenshoot`
--
ALTER TABLE `portfolio_screenshoot`
  MODIFY `id_screenshoot` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `portfolio_technologie`
--
ALTER TABLE `portfolio_technologie`
  MODIFY `id_technologie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `portfolio_user`
--
ALTER TABLE `portfolio_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `portolio_experience`
--
ALTER TABLE `portolio_experience`
  MODIFY `id_experience` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `portfolio_projet_technologie`
--
ALTER TABLE `portfolio_projet_technologie`
  ADD CONSTRAINT `portfolio_projet_technologie_ibfk_1` FOREIGN KEY (`id_projet`) REFERENCES `portfolio_projet` (`id_projet`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `portfolio_projet_technologie_ibfk_2` FOREIGN KEY (`id_technologie`) REFERENCES `portfolio_technologie` (`id_technologie`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `portfolio_technologie`
--
ALTER TABLE `portfolio_technologie`
  ADD CONSTRAINT `portfolio_technologie_ibfk_1` FOREIGN KEY (`id_categorie`) REFERENCES `portfolio_categorie` (`id_categorie`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
