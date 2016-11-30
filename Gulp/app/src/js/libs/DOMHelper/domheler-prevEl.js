/*! domhelper-prevEl.js */
function prevEl(el) {
	if (!el.previousElementSibling) {
		el = el.previousElementSibling;
	} else {
		do { el = el.previousSibling; }
		while(el && el.nodeType != 1);
	}
	return el;
}