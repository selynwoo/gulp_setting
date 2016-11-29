/* domhelper-nextEl.js */
function nextEl(el) {
	if (!el.nextElementSibling) {
		el = el.nextElementSibling;
	} else {
		do { el = el.nextSibling; }
		while(el && el.nodeType != 1);
	}
	return el;
}