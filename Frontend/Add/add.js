const tagDatalist = document.getElementById('tags');
const projDatalist = document.getElementById('projects');
const [ inp1, inp2 ] = document.getElementsByClassName('dropdown');
const [ wrap1, wrap2 ] = document.getElementsByClassName('outer-wrapper');
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
	if (event.key === 'Enter' && inp1.value != '') {
		let tag1 = newElem('a', 'tag1', inp1.value);
		tag1.onclick = () => {
			wrap1.removeChild(tag1);
		}
		wrap1.appendChild(tag1);
		inp1.value = '';
	}
});

inp2.addEventListener('keyup', (event) => {
	if (event.key === 'Enter' && inp2.value != '') {
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
	name : document.getElementById('title').value || null,
	link : document.getElementById('link').value.replace(/ /g, '%20') || null,
	cont : document.getElementById('content').value || null,
	tags : [],
	proj : []
	};

	let tempSet = new Set();
	for (let t of document.getElementsByClassName('tag1')) {
		if (tempSet.has(t.innerText)) continue;

		tempSet.add(t.innerText);
		for (let i of Tags) {
			if (t.innerText === i.name) {
				res.tags.push(i);
				break;
			}
		}
	}

	tempSet = new Set();
	for (let p of document.getElementsByClassName('tag2')) {
		if (tempSet.has(p.innerText)) continue;

		tempSet.add(p.innerText);
		for (let i of Proj) {
			if (p.innerText === i.name) {
				res.proj.push(i);
				break;
			}
		}
	}

	let response = await fetch('/api/data', {
		method: 'POST',
		body: JSON.stringify(res),
		headers: { 'Content-type': 'application/json' }
	});

	if (response.ok) {
		window.location.href = '/';
	} else {
		let msg = await response.json();
		alert(msg.message)
	}
}


function cancel() {
	window.location.href = '/';
}
