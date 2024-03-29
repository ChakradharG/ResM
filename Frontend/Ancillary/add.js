const tagDatalist = document.getElementById('tags');
const projDatalist = document.getElementById('projects');
const [ inp1, inp2 ] = document.getElementsByClassName('dropdown');
const [ wrap1, wrap2 ] = document.getElementsByClassName('outer-wrapper');
let Tags = null;
let Proj = null;


(async () => {
	Tags = await window.api.invoke('get-tags');
	for (t of Tags) {
		let opt = document.createElement('option');
		opt.value = t.name;
		tagDatalist.appendChild(opt);
	}
})();

(async () => {
	Proj = await window.api.invoke('get-proj');
	for (p of Proj) {
		let opt = document.createElement('option');
		opt.value = p.name;
		projDatalist.appendChild(opt);
	}
})();

function newElem(elemType, clsName, inhtml) {
	let element = document.createElement(elemType);
	element.className = clsName;
	if (inhtml) {
		element.innerHTML = inhtml;
	}
	return element;
}

inp1.addEventListener('keyup', (event) => {
	if (event.key === 'Enter' && inp1.value !== '') {
		let tag1 = newElem('a', 'tag1', inp1.value);
		tag1.onclick = () => {
			wrap1.removeChild(tag1);
		}
		wrap1.appendChild(tag1);
		inp1.value = '';
	}
});

inp2.addEventListener('keyup', (event) => {
	if (event.key === 'Enter' && inp2.value !== '') {
		let tag2 = newElem('a', 'tag2', inp2.value);
		tag2.onclick = () => {
			wrap2.removeChild(tag2);
		}
		wrap2.appendChild(tag2);
		inp2.value = '';
	}
});

async function sendToServer(method) {
	let res = {
	name : document.getElementById('title').value.replace(/</g, '&lt;') || null,
	link : document.getElementById('link').value.replace(/ /g, '%20') || null,
	cont : document.getElementById('content').value.replace(/<(?!(\/?)(pre( +class ?= ?("|')code("|'))?|code)\s*>)/g, '&lt;') || null,
	// Replacing < with &lt; everywhere except pre (with or without class="code" attribute) and code tags in content
	tags : [],
	proj : []
	};

	if (method === 'PUT') {
		res.id = parseInt(document.getElementById('res_id').innerText);
	}

	let tempSet = new Set();
	for (let t of document.getElementsByClassName('tag1')) {
		if (tempSet.has(t.innerText)) continue;

		tempSet.add(t.innerText);
		let isNew = true;
		for (let i of Tags) {
			if (t.innerText === i.name) {
				res.tags.push(i);
				isNew = false;
				break;
			}
		}

		if (isNew) {
			let redirect = confirm(`Tag '${t.innerText}' is not in the database, would you like to add it?\n(Note: Data entered on the current page will be lost)`);
			return { redirect: redirect, redTo: './addtag.html' };
		}
	}

	tempSet = new Set();
	for (let p of document.getElementsByClassName('tag2')) {
		if (tempSet.has(p.innerText)) continue;

		tempSet.add(p.innerText);
		let isNew = true;
		for (let i of Proj) {
			if (p.innerText === i.name) {
				res.proj.push(i);
				isNew = false;
				break;
			}
		}

		if (isNew) {
			let redirect = confirm(`Project Tag '${p.innerText}' is not in the database, would you like to add it?\n(Note: Data entered on the current page will be lost)`);
			return { redirect: redirect, redTo: './addpro.html' };
		}
	}

	let response = await window.api.invoke(`${method.toLowerCase()}-data`, res);

	if (response.ok) {
		window.api.send('home');
	} else {
		alert(response.code);
	}
}

async function STSWrapper(method) {
	let resp = await sendToServer(method);
	if (resp?.redirect) {
		window.location.href = resp.redTo;
	}
}

function cancel() {
	window.api.send('home');
}
