const main = document.getElementById('main');
const searchBox = document.getElementById('search');
const menu = document.getElementById('menu');
const resultsDiv = document.getElementById('results');
let data = null;
let Tags = null;
let Proj = null;


(async () => {
	data = await window.api.invoke('get-data');
})();

(async () => {
	Tags = await window.api.invoke('get-tags');
})();

(async () => {
	Proj = await window.api.invoke('get-proj');
})();

searchBox.addEventListener('keyup', (event) => {
	if (event.key === 'Escape') {
		searchBox.value = '';
		resultsDiv.innerHTML = '';
	}
});

function newElem(elemType, clsName, inhtml) {
	let element = document.createElement(elemType);
	element.className = clsName;
	if (inhtml) {
		element.innerHTML = inhtml;
	}
	return element;
}

function dispOptions() {
	if (resultsDiv.style.top === '67px') {
		resultsDiv.style.top = '194px';
		menu.style.height = '117px';
		setTimeout(() => {
			menu.innerHTML = `<a href="./Ancillary/add.html">Resource Card</a>
			<a href="./Ancillary/addtag.html">Tag</a>
			<a href="./Ancillary/addpro.html">Project Tag</a>`;
		}, 220);
	} else {
		resultsDiv.style.top = '67px';
		menu.innerHTML = '';
		menu.style.height = '0px';
	}
}

function appendCard(d) {
	let card = newElem('div', 'card');
	card.style.maxHeight = '59px';
	resultsDiv.appendChild(card);

	let link = (d.link === null) ? `` : (d.link.startsWith('/Local_Resources/') ? `href=..${d.link}` : `href=${d.link}`);
	let title = newElem('div', 'title-wrapper', `<a ${link} target="_blank">${d.name}</a>`);
	title.onclick = () => {
		let tempCard = title.parentElement;
		tempCard.style.maxHeight = (tempCard.style.maxHeight === '59px') ? (tempCard.scrollHeight + 'px') : '59px';
	}
	card.appendChild(title);
	
	if (d.cont) card.appendChild(newElem('div', 'cont', d.cont));

	let outer = newElem('div', 'outer-wrapper');
	card.appendChild(outer);
	let wrapper = newElem('div', 'wrapper');
	outer.appendChild(wrapper);
	for (let t of d.tags) {
		let tElem = newElem('a', 'tag1', t.name);
		tElem.onclick = () => {
			searchBox.value = `~:hastag:${t.name}`;
			processInp();
		}
		wrapper.appendChild(tElem);
	}

	if (d.proj.length !== 0) {
		if (d.tags.length !== 0) {
			outer = newElem('div', 'outer-wrapper');
			card.appendChild(outer);
			wrapper = newElem('div', 'wrapper');
			outer.appendChild(wrapper);
		}
		for (let p of d.proj) {
			let pElem = newElem('a', 'tag2', p.name);
			if (p.link !== null) {
				pElem.href = p.link;
				pElem.target = '_blank';
			}
			wrapper.appendChild(pElem);
		}
	}

	let editBtn = newElem('button', 'edit-btn', '<img src="../Assets/edit.svg" alt="edit button">');
	editBtn.title = 'Edit This Card';
	editBtn.onclick = () => {
		window.api.send('edit-data', { id: d.id });
	}
	outer.appendChild(editBtn);
}

function appendTagCard(t) {
	let card = newElem('div', 'card');
	card.style.maxHeight = '59px';
	resultsDiv.appendChild(card);

	let title = newElem('div', 'title-wrapper', t.name);
	title.onclick = () => {
		let tempCard = title.parentElement;
		tempCard.style.maxHeight = (tempCard.style.maxHeight === '59px') ? (tempCard.scrollHeight + 'px') : '59px';
	}
	card.appendChild(title);

	let outer = newElem('div', 'outer-wrapper');
	card.appendChild(outer);
	let wrapper = newElem('div', 'wrapper');
	outer.appendChild(wrapper);

	let editBtn = newElem('button', 'edit-btn', '<img src="../Assets/edit.svg" alt="edit button">');
	editBtn.title = 'Edit This Tag';
	editBtn.onclick = () => {
		window.api.send('edit-tags', { id: t.id });
	}
	outer.appendChild(editBtn);
}

function appendProCard(p) {
	let card = newElem('div', 'card');
	card.style.maxHeight = '59px';
	resultsDiv.appendChild(card);

	let link = (p.link === null) ? `` : `href=${p.link}`;
	let title = newElem('div', 'title-wrapper', `<a ${link} target="_blank">${p.name}</a>`);
	title.onclick = () => {
		let tempCard = title.parentElement;
		tempCard.style.maxHeight = (tempCard.style.maxHeight === '59px') ? (tempCard.scrollHeight + 'px') : '59px';
	}
	card.appendChild(title);

	let outer = newElem('div', 'outer-wrapper');
	card.appendChild(outer);
	let wrapper = newElem('div', 'wrapper');
	outer.appendChild(wrapper);

	let editBtn = newElem('button', 'edit-btn', '<img src="../Assets/edit.svg" alt="edit button">');
	editBtn.title = 'Edit This Project Tag';
	editBtn.onclick = () => {
		window.api.send('edit-proj', { id: p.id });
	}
	outer.appendChild(editBtn);
}

function strToRegEx(str) {
	// str = str.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&'); // Escaping RegEx special characters
	let searchTerm = `.*${str}.*`;
	// let searchTerm = '.*';
	// for (let i  of str) {
	// 	searchTerm += `${i}.*`;
	// }
	return new RegExp(searchTerm, 'i');
}

function tagSearch(inp) {
	if (inp === '') return;
	searchTerm = strToRegEx(inp);
	for (let d of data) {
		for (let t of d.tags) {
			if (searchTerm.test(t.name)) {
				appendCard(d);
				break;
			}
		}
	}
}

function proSearch(inp) {
	if (inp === '') return;
	searchTerm = strToRegEx(inp);
	for (let d of data) {
		for (let p of d.proj) {
			if (searchTerm.test(p.name)) {
				appendCard(d);
				break;
			}
		}
	}
}

function getFromTags(inp) {
	searchTerm = strToRegEx(inp);
	for (let t of Tags) {
		if (searchTerm.test(t.name)) appendTagCard(t);
	}
}

function getFromPros(inp) {
	searchTerm = strToRegEx(inp);
	for (let p of Proj) {
		if (searchTerm.test(p.name)) appendProCard(p);
	}
}

function Search(inp) {
	searchTerm = strToRegEx(inp);
	for (let d of data) {
		if (searchTerm.test(d.name)) appendCard(d);
	}
}

function processInp() {
	resultsDiv.innerHTML = '';
	let inp = searchBox.value;

	if (inp === '') return;
	else if (/^(~:((hastag)|(ht)):)/i.test(inp)) tagSearch(inp.replace(/~:\w*:/, ''));
	else if (/^(~:((haspro)|(hp)):)/i.test(inp)) proSearch(inp.replace(/~:\w*:/, ''));
	else if (/^(~:t(ags)?:)/i.test(inp)) getFromTags(inp.replace(/~:\w*:/, ''));
	else if (/^(~:p(ros)?:)/i.test(inp)) getFromPros(inp.replace(/~:\w*:/, ''));
	else if (/^(~:a(ll)?:)/i.test(inp)) Search('');
	else Search(inp);
}
