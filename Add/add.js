function newElem(elemType, clsName, inhtml) {
	let element = document.createElement(elemType);
	element.className = clsName;
	if (inhtml) element.innerHTML = inhtml;
	return element;
}


let tagDatalist = document.getElementById('tags');
for (t of Tags) {
	let opt = document.createElement('option');
	opt.value = t.name;
	tagDatalist.appendChild(opt);
}

let projDatalist = document.getElementById('projects');
for (p of Projs) {
	let opt = document.createElement('option');
	opt.value = p.name;
	projDatalist.appendChild(opt);
}

let inp1 = document.getElementsByClassName('dropdown')[0];
let wrap1 = document.getElementsByClassName('outer-wrapper')[0];
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

let inp2 = document.getElementsByClassName('dropdown')[1];
let wrap2 = document.getElementsByClassName('outer-wrapper')[1];
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


function addNew() {
	let res = {
	name : document.getElementById('title').value,
	link : document.getElementById('link').value,
	cont : document.getElementById('content').value,
	tags : [],
	proj : []
	};

	for (t of document.getElementsByClassName('tag1')) {
		res.tags.push(t.innerText);
	}

	for (p of document.getElementsByClassName('tag2')) {
		res.proj.push(p.innerText);
	}

	res.link.replace(' ', '%20');
	data.push(res); //
	window.location.href = '/';
}


function cancel() {
	return window.location.href = '/';
}
