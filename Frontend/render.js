const resultsDiv = document.getElementById('results');
let data = null;


(async () => {
	const response = await fetch('/api/data', {method: 'GET'});
	data = await response.json();
})();

function newElem(elemType, clsName, inhtml) {
	let element = document.createElement(elemType);
	element.className = clsName;
	if (inhtml) element.innerHTML = inhtml;
	return element;
}

function searchQ() {
	resultsDiv.innerHTML = "";
	let inp = document.getElementById('search').value;

	if (inp != '') {
		for (let d of data) {
			if (d.name.toLowerCase().includes(inp.toLowerCase())) {
				let card = newElem('div', 'card');
				card.style.maxHeight = '59px';
				resultsDiv.appendChild(card);

				let link = (d.link === null) ? `` : `href=${d.link}`;
				let title = newElem('div', 'title-wrapper', `<a ${link} target="_blank">${d.name}</a>`);
				title.onclick = () => {
					let tempCard = title.parentElement;
					tempCard.style.maxHeight = (tempCard.style.maxHeight == '59px') ? (tempCard.scrollHeight + 'px') : '59px';
				}
				card.appendChild(title);
				
				if (d.cont?.length != 0)
					card.appendChild(newElem('div', 'cont', d.cont));

				let outer = newElem('div', 'outer-wrapper');
				card.appendChild(outer);
				let wrapper = newElem('div', 'wrapper');
				outer.appendChild(wrapper);
				for (let t of d.tags)
					wrapper.appendChild(newElem('a', 'tag1', t.name));

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
		}
	}
}
