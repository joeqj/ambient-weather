-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.1.2
--
-- https://tableplus.com/
--
-- Database: ambient-weather
-- Generation Time: 2024-03-05 13:15:48.277055
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
  `gust` float DEFAULT NULL,
  `rain` float DEFAULT NULL,
  `cloudCoverage` tinyint(4) DEFAULT NULL,
  `sunrise` datetime DEFAULT NULL,
  `sunset` datetime DEFAULT NULL,
  `timezone` char(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `ambient-weather`.`weather` (`id`, `createdAt`, `text`, `description`, `temperature`, `pressure`, `humidity`, `visibility`, `windSpeed`, `windDirection`, `rain`, `cloudCoverage`, `sunrise`, `sunset`, `timezone`, `gust`) VALUES (10, '2024-03-05 13:13:55', 'Clouds', 'scattered clouds', 9.42, 1013, 81, 10000, 2.06, 'east', 0, 0, 40, '2024-03-05 06:44:36', '2024-03-05 17:51:15', 'GB');

