DROP DATABASE IF EXISTS `ResM`;
CREATE DATABASE `ResM`;
USE `ResM`;

DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `link` varchar(200) DEFAULT NULL,
  `cont` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
);

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `link` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
);

DROP TABLE IF EXISTS `res2pro_map`;
CREATE TABLE `res2pro_map` (
  `res_id` int NOT NULL,
  `pro_id` int NOT NULL,
  PRIMARY KEY (`res_id`,`pro_id`),
  KEY `pro_id` (`pro_id`),
  CONSTRAINT `res2pro_map_ibfk_1` FOREIGN KEY (`res_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  CONSTRAINT `res2pro_map_ibfk_2` FOREIGN KEY (`pro_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `res2tag_map`;
CREATE TABLE `res2tag_map` (
  `res_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`res_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `res2tag_map_ibfk_1` FOREIGN KEY (`res_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  CONSTRAINT `res2tag_map_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
);
