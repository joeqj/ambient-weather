-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.0.3
--
-- https://tableplus.com/
--
-- Database: ambient-weather
-- Generation Time: 2024-02-15 22:20:47.253926
-- -------------------------------------------------------------

CREATE TABLE `weather` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

