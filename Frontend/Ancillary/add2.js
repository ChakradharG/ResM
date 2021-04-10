async function sendTagToServer(method) {
	let tag = { name : document.getElementById('title').value.replace(/</g, '&lt;') || null };

	if (method === 'PUT') {
		tag.id = parseInt(document.getElementById('tag_id').innerText);
	}

	let response = await window.api.invoke(`${method.toLowerCase()}-tags`, tag);

	if (response.ok) {
		window.api.send('home');
	} else {
		alert(response.code);
	}
}

async function sendProToServer(method) {
	let pro = {
		name : document.getElementById('title').value.replace(/</g, '&lt;') || null,
		link : document.getElementById('link').value.replace(/ /g, '%20') || null
	};

	if (method === 'PUT') {
		pro.id = parseInt(document.getElementById('pro_id').innerText);
	}

	let response = await window.api.invoke(`${method.toLowerCase()}-proj`, pro);

	if (response.ok) {
		window.api.send('home');
	} else {
		alert(response.code);
	}
}

function cancel() {
	window.api.send('home');
}
