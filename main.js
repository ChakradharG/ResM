import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = '5500';


(async () => {
	const db = await mysql.createConnection({
		host : process.env.DB_HOST,
		user : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : 'ResM'
	});

	app.use('/', express.static('Frontend/'));
	app.use('/Assets', express.static('Assets/'));
	app.use('/Local_Resources', express.static('Local_Resources/'));
	app.use('/Add', express.static('Frontend/Add/'));
	app.use('/Edit', express.static('Frontend/Edit/'));
	app.use(express.json());

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
			await db.query('INSERT INTO resources SET ?', resource);
			let [id, fields] = await db.query(`SELECT id FROM resources WHERE name = '${resource.name}';`);

			for (let i of req.body.tags) {
				let [tag_id, fields] = await db.query(`SELECT id FROM tags WHERE name = '${i.name}';`);
				db.query(`INSERT INTO res2tag_map VALUE(${id[0].id}, ${tag_id[0].id});`);
			}

			for (let i of req.body.proj) {
				let [pro_id, fields] = await db.query(`SELECT id FROM projects WHERE name = '${i.name}';`);
				db.query(`INSERT INTO res2pro_map VALUE(${id[0].id}, ${pro_id[0].id});`);
			}
		} catch(error) {
			res.send(error);
		}
	});
	

})();

app.listen(PORT, () => {
	console.log(`Server started on port http://localhost:${PORT}`)
});
