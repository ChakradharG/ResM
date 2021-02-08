const resultsDiv = document.getElementById('results');


function createCustomElement(elemType, clsName, inhtml) {
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
				let card = createCustomElement('div', 'card');
				card.style.maxHeight = '60px';
				resultsDiv.appendChild(card);

				let title = createCustomElement('div', 'title-wrapper', `<a href=${d.link} target="_blank">${d.name}</a>`);
				title.onclick = () => {
					let tempCard = title.parentElement;
					tempCard.style.maxHeight = (tempCard.style.maxHeight == '60px') ? (tempCard.scrollHeight + 'px') : '60px';
				}
				card.appendChild(title);
				
				if (d.cont.length != 0)
					card.appendChild(createCustomElement('div', 'cont', d.cont));

				if (d.tags.length != 0) {
					let tagWrapper = createCustomElement('div', 'wrapper');
					card.appendChild(tagWrapper);
					for (let t of d.tags)
						tagWrapper.appendChild(createCustomElement('a', 'tag1', t));
				}
				
				if (d.proj.length != 0) {
					let projWrapper = createCustomElement('div', 'wrapper');
					card.appendChild(projWrapper);
					for (let p of d.proj)
						projWrapper.appendChild(createCustomElement('a', 'tag2', p));
						// tag.href = 'https://google.com';
				}
			}
		}
	}
}
