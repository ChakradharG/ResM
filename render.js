const resultsDiv = document.getElementById('results');


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

				let link = (d.link.length === 0) ? `` : `href=${d.link}`;
				let title = newElem('div', 'title-wrapper', `<a ${link} target="_blank">${d.name}</a>`);
				title.onclick = () => {
					let tempCard = title.parentElement;
					tempCard.style.maxHeight = (tempCard.style.maxHeight == '59px') ? (tempCard.scrollHeight + 'px') : '59px';
				}
				card.appendChild(title);
				
				if (d.cont.length != 0)
					card.appendChild(newElem('div', 'cont', d.cont));

				let outer = newElem('div', 'outer-wrapper');
				card.appendChild(outer);
				let wrapper = newElem('div', 'wrapper');
				outer.appendChild(wrapper);
				for (let t of d.tags)
					wrapper.appendChild(newElem('a', 'tag1', t));

				if (d.proj.length != 0) {
					if (d.tags.length != 0) {
						outer = newElem('div', 'outer-wrapper');
						card.appendChild(outer);
						wrapper = newElem('div', 'wrapper');
						outer.appendChild(wrapper);
					}
					for (let p of d.proj)
						wrapper.appendChild(newElem('a', 'tag2', p));
				}

				let editBtn = newElem('button', 'edit-btn', `<img src="./Assets/edit.svg" alt="edit button">`);
				outer.appendChild(editBtn);
			}
		}
	}
}
