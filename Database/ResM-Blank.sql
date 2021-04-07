DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `name` VARCHAR(60) NOT NULL UNIQUE,
  `link` VARCHAR(300),
  `cont` VARCHAR(1000)
);

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `name` VARCHAR(30) NOT NULL UNIQUE,
  `link` VARCHAR(300)
);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `name` VARCHAR(30) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS `res2pro_map`;
CREATE TABLE `res2pro_map` (
  `res_id` INTEGER NOT NULL,
  `pro_id` INTEGER NOT NULL,
  PRIMARY KEY (`res_id`,`pro_id`),
  FOREIGN KEY (`res_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`pro_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `res2tag_map`;
CREATE TABLE `res2tag_map` (
  `res_id` INTEGER NOT NULL,
  `tag_id` INTEGER NOT NULL,
  PRIMARY KEY (`res_id`,`tag_id`),
  FOREIGN KEY (`res_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
);
