import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const __dirname = path.resolve();
const app = express();
const PORT = '5500';


function addCustomStyle(str, title) {
	str = str.replace(/</g, '&lt;');
	return(`<!DOCTYPE HTML>
	<html>
	<head>
	<title>${title}</title>
	<style>
	body {
		background-color: rgb(50, 50, 50);
		color: white;
		font-size: 18px;
	}
	body::-webkit-scrollbar {
		width: 5px;
		height: 5px;
	}
	body::-webkit-scrollbar-track {
		background: black;
	}
	body::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: gray;
	}
	</style>
	</head>
	<body>
	<pre>${str}</pre>
	</body>
	</html>`);
}

(async () => {
	const db = await mysql.createConnection({
		host : process.env.DB_HOST,
		user : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : 'ResM'
	});

	app.use('/', express.static('Frontend/'));
	app.use('/Assets', express.static('Assets/'));
	app.use('/Add', express.static('Frontend/Add/'));
	app.use('/Edit', express.static('Frontend/Edit/'));
	app.use(express.json());

	app.get('/Local_Resources/:name', (req, res) => {
		const { name } = req.params;
		let fileName = __dirname +`/Local_Resources/${name}`;
		if (fs.existsSync(fileName)) {
			if (name.endsWith('.pdf')) {
				res.sendFile(fileName);
			} else {
				fs.readFile(fileName, 'utf8', (err, data) => {
					if (err) {
						res.status(500).send(err);
					} else {
						res.send(addCustomStyle(data, name));
					}
				});
			}
		} else {
			res.status(404).send(`File '${fileName}' not found`)
		}
	});

	app.get('/api/data', async (req, res) => {
		let [data, fields] = await db.query('SELECT * FROM resources;');

		for (let elem of data) {
			elem.tags = [];
			elem.proj = [];

			let [subQueryRes1, field1] = await db.query(`SELECT * FROM res2tag_map JOIN tags ON res2tag_map.tag_id = tags.id where res2tag_map.res_id = ${elem.id};`);
			let [subQueryRes2, field2] = await db.query(`SELECT * FROM res2pro_map JOIN projects ON res2pro_map.pro_id = projects.id where res2pro_map.res_id = ${elem.id};`);
			
			subQueryRes1.forEach(t => elem.tags.push(t));
			subQueryRes2.forEach(p => elem.proj.push(p));
		}

		res.send(data);
	});

	app.get('/api/tags', async (req, res) => {
		let [tags, fields] = await db.query('SELECT * FROM tags;');
		res.send(tags);
	});

	app.get('/api/proj', async (req, res) => {
		let [proj, fields] = await db.query('SELECT * FROM projects;');
		res.send(proj);
	});

	app.post('/api/data', async (req, res) => {
		let resource = {
			name: req.body.name,
			link: req.body.link,
			cont: req.body.cont,
		};

		try {
			let [result, fields] = await db.query('INSERT INTO resources SET ?', resource);

			for (let tag of req.body.tags) {
				await db.query(`INSERT INTO res2tag_map VALUE(${result.insertId}, ${tag.id});`);
			}

			for (let pro of req.body.proj) {
				await db.query(`INSERT INTO res2pro_map VALUE(${result.insertId}, ${pro.id});`);
			}

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});
	

})();

app.listen(PORT, () => {
	console.log(`Server started on port http://localhost:${PORT}`)
});
