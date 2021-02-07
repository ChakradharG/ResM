const resultsDiv = document.getElementById('results');


function searchQ() {
	resultsDiv.innerHTML = "";
	let inp = document.getElementById('search').value;

	if (inp != '') {
		for (let d of data) {
			if (d.name.toLowerCase().includes(inp.toLowerCase())) {
				let card = document.createElement('div');
				card.className = 'card';
				card.style.maxHeight = '60px';
				resultsDiv.appendChild(card);

				let titleWrapper = document.createElement('div');
				titleWrapper.className = 'title-wrapper';
				titleWrapper.onclick = () => {
					titleWrapper.parentElement.style.maxHeight = (titleWrapper.parentElement.style.maxHeight == '60px') ? (titleWrapper.parentElement.scrollHeight + 'px') : '60px';
				}
				titleWrapper.innerHTML = `<a href=${d.link} target="_blank">${d.name}</a>`;
				card.appendChild(titleWrapper);
				
				if (d.cont.length != 0) {
					let cont = document.createElement('div');
					cont.className = 'cont';
					cont.innerHTML = d.cont;
					card.appendChild(cont);
				}

				if (d.tags.length != 0) {
					let tagWrapper = document.createElement('div');
					tagWrapper.className = 'wrapper';
					for (let t of d.tags) {
						let tag = document.createElement('a');
						tag.className = 'tag1';
						tag.innerHTML = t;
						tagWrapper.appendChild(tag)
					}
					card.appendChild(tagWrapper);
				}
				
				if (d.proj.length != 0) {
					let projWrapper = document.createElement('div');
					projWrapper.className = 'wrapper';
					for (let p of d.proj){
						let tag = document.createElement('a');
						tag.className = 'tag2';
						tag.innerHTML = p;
						// tag.href = 'https://google.com';
						projWrapper.appendChild(tag)
					}
					card.appendChild(projWrapper);
				}
			}
		}
	}
}
