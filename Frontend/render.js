const resultsDiv = document.getElementById('results');
const searchBox = document.getElementById('search');
let data = null;


(async () => {
	const response = await fetch('/api/data', {method: 'GET'});
	data = await response.json();
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
			searchBox.value = `~:tag:${t.name}`;
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
	editBtn.onclick = () => {
		window.location.href = '/Edit/edit.html'
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
			if (searchTerm.test(t.name)) appendCard(d);
		}
	}
}

function proSearch(inp) {
	if (inp === '') return;
	searchTerm = strToRegEx(inp);
	for (let d of data) {
		for (let p of d.proj) {
			if (searchTerm.test(p.name)) appendCard(d);
		}
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
	if (inp.startsWith('~:tag:')) tagSearch(inp.slice(6,));
	else if (inp.startsWith('~:pro:')) proSearch(inp.slice(6,));
	else Search(inp);
}
