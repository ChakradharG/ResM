async function sendTagToServer(method) {
	let tag = { name : document.getElementById('title').value.replace(/</g, '&lt;') || null };

	if (method === 'PUT') {
		tag.id = parseInt(document.getElementById('tag_id').innerText);
	}

	let response = await fetch('/api/tags', {
		method: method,
		body: JSON.stringify(tag),
		headers: { 'Content-type': 'application/json' }
	});

	if (response.ok) {
		window.location.href = '/';
	} else {
		let msg = await response.json();
		alert(msg.code);
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

	let response = await fetch('/api/proj', {
		method: method,
		body: JSON.stringify(pro),
		headers: { 'Content-type': 'application/json' }
	});

	if (response.ok) {
		window.location.href = '/';
	} else {
		let msg = await response.json();
		alert(msg.code);
	}
}

function cancel() {
	window.location.href = '/';
}
