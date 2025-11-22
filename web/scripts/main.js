// main.js — loads behaviors used by the pocket note site
document.addEventListener('DOMContentLoaded', () => {
	initScrollingImages();
});

function initScrollingImages(){
	const listEl = document.querySelector('.scroll-list');
	if(!listEl) return;

	// Path relative to pocketNote-site/index.html
	const manifestPath = '../images/scrollingImages/images.json';

	fetch(manifestPath)
		.then(r => { if(!r.ok) throw new Error('Manifest not found'); return r.json(); })
		.then(files => {
			// build image nodes
			files.forEach(f => {
				const img = document.createElement('img');
				img.src = `../images/scrollingImages/${f}`;
				img.alt = '';
				img.loading = 'lazy';
				listEl.appendChild(img);
			});

			// duplicate nodes for seamless scrolling
			const clone = listEl.cloneNode(true);
			listEl.parentNode.appendChild(clone);
			clone.classList.add('scroll-list-clone');

			startAutoScroll(listEl.parentNode, listEl, clone);
		})
		.catch(err => {
			// manifest missing — do nothing gracefully
			console.warn('Scrolling images manifest load failed:', err);
		});
}

function startAutoScroll(container, listA, listB){
	// container is .scroll-inner which contains listA and listB
		let offset = 0;
	const speed = 80; // px per second — snappier scroll

	// measure total scrollable height (height of one list)
	function frame(time){
		if(!frame.last) frame.last = time;
		const dt = (time - frame.last) / 1000;
		frame.last = time;

		offset += speed * dt;
		const h = listA.scrollHeight || listA.offsetHeight;
		if(!h){
			requestAnimationFrame(frame);
			return;
		}

		// Use modulo to keep offset in-range — prevents snap/jump caused by overshoot
		offset = offset % h;

		// Ensure the second list starts directly after the first for seamless loop
		// listA moves from 0 -> -h, listB moves from h -> 0, both shifted by -offset
		listA.style.transform = `translateY(${-offset}px)`;
		listB.style.transform = `translateY(${-offset + h}px)`;

		requestAnimationFrame(frame);
	}

	// Set initial transforms so there is no visual jump on first frame
	requestAnimationFrame(() => {
		const h = listA.scrollHeight || listA.offsetHeight || 0;
		listA.style.transform = `translateY(0px)`;
		listB.style.transform = `translateY(${h}px)`;
		frame.last = performance.now();
		requestAnimationFrame(frame);
	});
}
