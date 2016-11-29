/*! addEvent.js */
var addEvent = (function(){
	if(window.addEventListener) {
		return function(el, type, fn) {
			el.addEventListener(type, fn, false);
		};
	} else if(window.attachEvent) {
		return function(el, type, fn) {
			el.attachEvent('on'+type, fn);
		};
	} else {
		return function(el, type, fn) {
			el['on'+type] = fn;
		};
	}
})();