const resultsDiv = document.getElementById('results');
const searchBox = document.getElementById('search');
let data = null;
let Tags = null;
let Proj = null;


(async () => {
	const response = await fetch('/api/data', {method: 'GET'});
	data = await response.json();
})();

(async () => {
	const response = await fetch('/api/tags', {method: 'GET'});
	Tags = await response.json();
})();

(async () => {
	const response = await fetch('/api/proj', {method: 'GET'});
	Proj = await response.json();
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
	if (inhtml) element.innerHTML = inhtml;
	return element;
}

function appendCard(d) {
	let card = newElem('div', 'card');
	card.style.maxHeight = '59px';
	resultsDiv.appendChild(card);

	let link = (d.link === null) ? `` : `href=${d.link}`;
	let title = newElem('div', 'title-wrapper', `<a ${link} target="_blank">${d.name}</a>`);
	title.onclick = () => {
		let tempCard = title.parentElement;
		tempCard.style.maxHeight = (tempCard.style.maxHeight === '59px') ? (tempCard.scrollHeight + 'px') : '59px';
	}
	card.appendChild(title);
	
	if (d.cont?.length != 0)
		card.appendChild(newElem('div', 'cont', d.cont));

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

	if (d.proj.length != 0) {
		if (d.tags.length != 0) {
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

	let editBtn = newElem('button', 'edit-btn', '<img src="/Assets/edit.svg" alt="edit button">');
	editBtn.title = 'Edit This Card';
	editBtn.onclick = () => {
		window.location.href = `/Edit/${d.id}`
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

	let editBtn = newElem('button', 'edit-btn', '<img src="/Assets/edit.svg" alt="edit button">');
	editBtn.title = 'Edit This Tag';
	editBtn.onclick = () => {
		window.location.href = `/Edit/Tag/${t.id}`
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

	let editBtn = newElem('button', 'edit-btn', '<img src="/Assets/edit.svg" alt="edit button">');
	editBtn.title = 'Edit This Project Tag';
	editBtn.onclick = () => {
		window.location.href = `/Edit/Pro/${p.id}`
	}
	outer.appendChild(editBtn);
}

function strToRegEx(str) {
	str = str.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&'); // Escaping RegEx special characters
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
