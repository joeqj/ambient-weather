-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.1.2
--
-- https://tableplus.com/
--
-- Database: ambient-weather
-- Generation Time: 2024-03-05 10:42:55.659438
-- -------------------------------------------------------------

CREATE TABLE `weather` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `text` varchar(25) DEFAULT NULL,
  `description` varchar(35) DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `pressure` smallint(6) DEFAULT NULL,
  `humidity` tinyint(4) DEFAULT NULL,
  `visibility` smallint(6) DEFAULT NULL,
  `windSpeed` float DEFAULT NULL,
  `windDirection` varchar(5) DEFAULT NULL,
  `rain` float DEFAULT NULL,
  `cloudCoverage` tinyint(4) DEFAULT NULL,
  `sunrise` datetime DEFAULT NULL,
  `sunset` datetime DEFAULT NULL,
  `timezone` char(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `ambient-weather`.`weather` (`id`, `createdAt`, `text`, `description`, `temperature`, `pressure`, `humidity`, `visibility`, `windSpeed`, `windDirection`, `rain`, `cloudCoverage`, `sunrise`, `sunset`, `timezone`) VALUES (1, '2024-03-05 10:23:49', 'Mist', 'mist', 6.14, 1011, 92, 4000, 2.06, 'south', 0, 75, '2024-03-05 06:44:36', '2024-03-05 17:51:15', 'GB');

