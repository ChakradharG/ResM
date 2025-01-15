const { app, BrowserWindow, ipcMain, shell, globalShortcut } = require('electron');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const ejse = require('ejs-electron');

let db = null;
let win;


function createWindow() {
	win = new BrowserWindow({
		width: 620,
		height: 520,
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.loadFile('./Frontend/index.html');
	win.webContents.on('new-window', (e, url) => {
		e.preventDefault();
		shell.openExternal(url);
	});
	// win.webContents.openDevTools();
}

(async () => {
	db = await open({
		filename: path.join(__dirname, 'Database', 'ResM.db'),
		driver: sqlite3.Database
	});
	await db.run(`PRAGMA foreign_keys = ON`);	// To enable SQLite Foreign key constraints
})();

app.whenReady().then(() => {
	globalShortcut.register('CmdOrCtrl+Q', () => {
		app.quit();
	});
}).then(() => createWindow());

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('home', () => {
	win.loadFile(path.join(__dirname, 'Frontend', 'index.html'));
});

ipcMain.handle('get-data', async () => {
	let data = await db.all(`SELECT * FROM resources`);

	for (let elem of data) {
		elem.tags = [];
		elem.proj = [];

		let subQueryRes1 = await db.all(`SELECT * FROM res2tag_map JOIN tags ON res2tag_map.tag_id = tags.id WHERE res2tag_map.res_id = ?`, elem.id);
		let subQueryRes2 = await db.all(`SELECT * FROM res2pro_map JOIN projects ON res2pro_map.pro_id = projects.id WHERE res2pro_map.res_id = ?`, elem.id);

		subQueryRes1.forEach(t => elem.tags.push(t));
		subQueryRes2.forEach(p => elem.proj.push(p));
	}

	return data;
});

ipcMain.handle('get-tags', async () => {
	let tags = await db.all(`SELECT * FROM tags`);
	return tags;
});

ipcMain.handle('get-proj', async () => {
	let proj = await db.all(`SELECT * FROM projects`);
	return proj;
});

ipcMain.on('edit-data', async (event, payLoad) => {
	try {
		let resource = await db.get(`SELECT * FROM resources WHERE id = ?`, payLoad.id);
		if (resource === undefined) throw ('Resource with that ID does not exist');
		resource.tags = [];
		resource.proj = [];

		let subQueryRes1 = await db.all(`SELECT * FROM res2tag_map JOIN tags ON res2tag_map.tag_id = tags.id WHERE res2tag_map.res_id = ?`, resource.id);
		let subQueryRes2 = await db.all(`SELECT * FROM res2pro_map JOIN projects ON res2pro_map.pro_id = projects.id WHERE res2pro_map.res_id = ?`, resource.id);

		subQueryRes1.forEach(t => resource.tags.push(t));
		subQueryRes2.forEach(p => resource.proj.push(p));

		ejse.data(resource);
		win.loadFile(path.join(__dirname, '/Frontend/Ancillary/edit.ejs'));
	} catch (err) {
		ejse.data({message: err});
		win.loadFile(path.join(__dirname, 'Frontend', 'error.ejs'));
	}
});

ipcMain.on('edit-tags', async (event, payLoad) => {
	try {
		let tag = await db.get(`SELECT * FROM tags WHERE id = ?`, payLoad.id);
		if (tag === undefined) throw ('Tag with that ID does not exist');

		ejse.data(tag);
		win.loadFile(path.join(__dirname, '/Frontend/Ancillary/edittag.ejs'));
	} catch (err) {
		ejse.data({message: err});
		win.loadFile(path.join(__dirname, 'Frontend', 'error.ejs'));
	}
});

ipcMain.on('edit-proj', async (event, payLoad) => {
	try {
		let pro = await db.get(`SELECT * FROM projects WHERE id = ?`, payLoad.id);
		if (pro === undefined) throw ('Project Tag with that ID does not exist');

		ejse.data(pro);
		win.loadFile(path.join(__dirname, '/Frontend/Ancillary/editpro.ejs'));
	} catch (err) {
		ejse.data({message: err});
		win.loadFile(path.join(__dirname, 'Frontend', 'error.ejs'));
	}
});

ipcMain.handle('post-data', async (event, payLoad) => {
	try {
		let result = await db.run(`INSERT INTO resources('name', 'link', 'cont') VALUES(?, ?, ?)`, payLoad.name, payLoad.link, payLoad.cont);

		for (let tag of payLoad.tags) {
			await db.run(`INSERT INTO res2tag_map VALUES(?, ?)`, result.lastID, tag.id);
		}

		for (let pro of payLoad.proj) {
			await db.run(`INSERT INTO res2pro_map VALUES(?, ?)`, result.lastID, pro.id);
		}

		return { ok: true };
	} catch (err) {
		return { ok: false, code: err };
	}
});

ipcMain.handle('post-tags', async (event, payLoad) => {
	try {
		await db.run(`INSERT INTO tags('name') VALUES(?)`, payLoad.name);

		return { ok: true };
	} catch (err) {
		return { ok: false, code: err };
	}
});

ipcMain.handle('post-proj', async (event, payLoad) => {
	try {
		await db.run(`INSERT INTO projects('name', 'link') VALUES(?, ?)`, payLoad.name, payLoad.link);

		return { ok: true };
	} catch (err) {
		return { ok: false, code: err };
	}
});

ipcMain.handle('put-data', async (event, payLoad) => {
	try {
		await db.run(`DELETE FROM resources WHERE id = ?`, payLoad.id);

		await db.run(`INSERT INTO resources VALUES(?, ?, ?, ?)`, payLoad.id, payLoad.name, payLoad.link, payLoad.cont);

		for (let tag of payLoad.tags) {
			await db.run(`INSERT INTO res2tag_map VALUES(?, ?)`, payLoad.id, tag.id);
		}

		for (let pro of payLoad.proj) {
			await db.run(`INSERT INTO res2pro_map VALUES(?, ?)`, payLoad.id, pro.id);
		}

		return { ok: true };
	} catch (err) {
		return { ok: false, code: err };
	}
});

ipcMain.handle('put-tags', async (event, payLoad) => {
	try {
		await db.run(`UPDATE tags SET name = ? WHERE id = ?`, payLoad.name, payLoad.id);

		return { ok: true };
	} catch (err) {
		return { ok: false, code: err };
	}
});

ipcMain.handle('put-proj', async (event, payLoad) => {
	try {
		await db.run(`UPDATE projects SET name = ?, link = ? WHERE id = ?`, payLoad.name, payLoad.link, payLoad.id);

		return { ok: true };
	} catch (err) {
		return { ok: false, code: err };
	}
});
