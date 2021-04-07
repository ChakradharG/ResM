import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


(async () => {
	const db = await open({
		filename: 'ResM.db',
		driver: sqlite3.Database
	});

	await db.run('DROP TABLE IF EXISTS `resources`');
	await db.run('CREATE TABLE `resources` (`id` INTEGER PRIMARY KEY NOT NULL, `name` VARCHAR(60) NOT NULL UNIQUE, `link` VARCHAR(300), `cont` VARCHAR(1000))');
	await db.run('DROP TABLE IF EXISTS `projects`');
	await db.run('CREATE TABLE `projects` (`id` INTEGER PRIMARY KEY NOT NULL,`name` VARCHAR(30) NOT NULL UNIQUE,`link` VARCHAR(300))');
	await db.run('DROP TABLE IF EXISTS `tags`');
	await db.run('CREATE TABLE `tags` (`id` INTEGER PRIMARY KEY NOT NULL,`name` VARCHAR(30) NOT NULL UNIQUE)');
	await db.run('DROP TABLE IF EXISTS `res2pro_map`');
	await db.run('CREATE TABLE `res2pro_map` (`res_id` INTEGER NOT NULL,`pro_id` INTEGER NOT NULL,PRIMARY KEY (`res_id`,`pro_id`),FOREIGN KEY (`res_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,FOREIGN KEY (`pro_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE)');
	await db.run('DROP TABLE IF EXISTS `res2tag_map`');
	await db.run('CREATE TABLE `res2tag_map` (`res_id` INTEGER NOT NULL,`tag_id` INTEGER NOT NULL,PRIMARY KEY (`res_id`,`tag_id`),FOREIGN KEY (`res_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE)');

	db.close();
})();
