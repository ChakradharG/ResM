let tagDatalist = document.getElementById('tags');
let projDatalist = document.getElementById('projects');
let inp1 = document.getElementsByClassName('dropdown')[0];
let wrap1 = document.getElementsByClassName('outer-wrapper')[0];
let inp2 = document.getElementsByClassName('dropdown')[1];
let wrap2 = document.getElementsByClassName('outer-wrapper')[1];
let Tags = null;
let Proj = null;


(async () => {
	const response = await fetch('/api/tags', {method: 'GET'});
	Tags = await response.json();
	for (t of Tags) {
		let opt = document.createElement('option');
		opt.value = t.name;
		tagDatalist.appendChild(opt);
	}
})();

(async () => {
	const response = await fetch('/api/proj', {method: 'GET'});
	Proj = await response.json();
	for (p of Proj) {
		let opt = document.createElement('option');
		opt.value = p.name;
		projDatalist.appendChild(opt);
	}
})();

function newElem(elemType, clsName, inhtml) {
	let element = document.createElement(elemType);
	element.className = clsName;
	if (inhtml) element.innerHTML = inhtml;
	return element;
}

inp1.addEventListener('keyup', (event) => {
	if (event.keyCode == 13 && inp1.value != '') {
		let tag1 = newElem('a', 'tag1', inp1.value);
		tag1.onclick = () => {
			wrap1.removeChild(tag1);
		}
		wrap1.appendChild(tag1);
		inp1.value = '';
	}
});

inp2.addEventListener('keyup', (event) => {
	if (event.keyCode == 13 && inp2.value != '') {
		let tag2 = newElem('a', 'tag2', inp2.value);
		tag2.onclick = () => {
			wrap2.removeChild(tag2);
		}
		wrap2.appendChild(tag2);
		inp2.value = '';
	}
});

async function addNew() {
	let res = {
	name : document.getElementById('title').value,
	link : document.getElementById('link').value,
	cont : document.getElementById('content').value,
	tags : [],
	proj : []
	};

	for (let t of document.getElementsByClassName('tag1')) {
		for (let i of Tags) {
			if (t.innerText === i.name)
				res.tags.push(i);
		}
	}

	for (let p of document.getElementsByClassName('tag2')) {
		for (let i of Proj) {
			if (p.innerText === i.name)
				res.proj.push(i);
		}
	}

	res.link = res.link.includes('http') ? res.link : encodeURIComponent(res.link);

	let response = await fetch('/api/data', {
		method: 'POST',
		body: JSON.stringify(res),
		headers: { 'Content-type': 'application/json' }
	});
	let msg = await response.json();
	window.location.href = '/';
}


function cancel() {
	window.location.href = '/';
}
