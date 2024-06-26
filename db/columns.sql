-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.1.2
--
-- https://tableplus.com/
--
-- Database: ambient-weather
-- Generation Time: 2024-03-05 10:02:07.859579
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

