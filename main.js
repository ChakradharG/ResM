const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const dotenv = require('dotenv');
const fs = require('fs');
// const path = require('path');

dotenv.config();
// const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5500;

app.use('/', express.static('Frontend/'));
app.use('/Assets/', express.static('Assets/'));
app.use('/Ancillary/', express.static('Frontend/Ancillary/'));
app.use(express.json());
app.set('view engine', 'ejs');


function addCustomStyle(str, title) {
	str = str.replace(/</g, '&lt;');
	return (`<!DOCTYPE HTML>
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
	const db = await open({
		filename: `${__dirname}/Database/${process.env.DB}`,
		driver: sqlite3.Database
	});
	await db.run(`PRAGMA foreign_keys = ON`);	// To enable SQLite Foreign key constraints

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

	app.get('/edit/:id', async (req, res) => {
		try {
			let resource = await db.get(`SELECT * FROM resources WHERE id = ?`, req.params.id);
			if (resource === undefined) throw ('Resource with that ID does not exist');
			resource.tags = [];
			resource.proj = [];

			let subQueryRes1 = await db.all(`SELECT * FROM res2tag_map JOIN tags ON res2tag_map.tag_id = tags.id WHERE res2tag_map.res_id = ?`, resource.id);
			let subQueryRes2 = await db.all(`SELECT * FROM res2pro_map JOIN projects ON res2pro_map.pro_id = projects.id WHERE res2pro_map.res_id = ?`, resource.id);

			subQueryRes1.forEach(t => resource.tags.push(t));
			subQueryRes2.forEach(p => resource.proj.push(p));

			res.render(`${__dirname}/Frontend/Ancillary/edit`, resource);
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.get('/edit/tag/:id', async (req, res) => {
		try {
			let tag = await db.get(`SELECT * FROM tags WHERE id = ?`, req.params.id);
			if (tag === undefined) throw ('Tag with that ID does not exist');

			res.render(`${__dirname}/Frontend/Ancillary/edittag`, tag);
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.get('/edit/pro/:id', async (req, res) => {
		try {
			let pro = await db.get(`SELECT * FROM projects WHERE id = ?`, req.params.id);
			if (pro === undefined) throw ('Project Tag with that ID does not exist');

			res.render(`${__dirname}/Frontend/Ancillary/editpro`, pro);
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.get('/api/data', async (req, res) => {
		let data = await db.all(`SELECT * FROM resources`);

		for (let elem of data) {
			elem.tags = [];
			elem.proj = [];

			let subQueryRes1 = await db.all(`SELECT * FROM res2tag_map JOIN tags ON res2tag_map.tag_id = tags.id WHERE res2tag_map.res_id = ?`, elem.id);
			let subQueryRes2 = await db.all(`SELECT * FROM res2pro_map JOIN projects ON res2pro_map.pro_id = projects.id WHERE res2pro_map.res_id = ?`, elem.id);

			subQueryRes1.forEach(t => elem.tags.push(t));
			subQueryRes2.forEach(p => elem.proj.push(p));
		}

		res.send(data);
	});

	app.get('/api/tags', async (req, res) => {
		let tags = await db.all(`SELECT * FROM tags`);
		res.send(tags);
	});

	app.get('/api/proj', async (req, res) => {
		let proj = await db.all(`SELECT * FROM projects`);
		res.send(proj);
	});

	app.post('/api/data', async (req, res) => {
		let resource = {
			name: req.body.name,
			link: req.body.link,
			cont: req.body.cont
		};

		try {
			let result = await db.run(`INSERT INTO resources('name', 'link', 'cont') VALUES(?, ?, ?)`, resource.name, resource.link, resource.cont);

			for (let tag of req.body.tags) {
				await db.run(`INSERT INTO res2tag_map VALUES(?, ?)`, result.lastID, tag.id);
			}

			for (let pro of req.body.proj) {
				await db.run(`INSERT INTO res2pro_map VALUES(?, ?)`, result.lastID, pro.id);
			}

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.post('/api/tags', async (req, res) => {
		let tag = { name: req.body.name };

		try {
			await db.run(`INSERT INTO tags('name') VALUES(?)`, tag.name);

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.post('/api/proj', async (req, res) => {
		let pro = {
			name: req.body.name,
			link: req.body.link
		};

		try {
			await db.run(`INSERT INTO projects('name', 'link') VALUES(?, ?)`, pro.name, pro.link);

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.put('/api/data', async (req, res) => {
		let resource = {
			id: req.body.id,
			name: req.body.name,
			link: req.body.link,
			cont: req.body.cont
		};

		try {
			await db.run(`DELETE FROM resources WHERE id = ?`, resource.id);

			await db.run(`INSERT INTO resources VALUES(?, ?, ?, ?)`, resource.id, resource.name, resource.link, resource.cont);

			for (let tag of req.body.tags) {
				await db.run(`INSERT INTO res2tag_map VALUES(?, ?)`, resource.id, tag.id);
			}

			for (let pro of req.body.proj) {
				await db.run(`INSERT INTO res2pro_map VALUES(?, ?)`, resource.id, pro.id);
			}

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.put('/api/tags', async (req, res) => {
		let tag = {
			id: req.body.id,
			name: req.body.name
		};

		try {
			await db.run(`UPDATE tags SET name = ? WHERE id = ?`, tag.name, tag.id);

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

	app.put('/api/proj', async (req, res) => {
		let pro = {
			id: req.body.id,
			name: req.body.name,
			link: req.body.link
		};

		try {
			await db.run(`UPDATE projects SET name = ?, link = ? WHERE id = ?`, pro.name, pro.link, pro.id);

			res.status(200).end();
		} catch (err) {
			res.status(400).send(err);
		}
	});

})();

app.listen(PORT, () => {
	console.log(`Server started on port http://localhost:${PORT}`)
});
