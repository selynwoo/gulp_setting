/*! removeEvent.js */
var removeEvent = (function(){
	if(window.removeEventListener) {
		return function(el, type, fn) {
			el.removeEventListener(type, fn, false);
		};
	} else if(window.detachEvent) {
		return function(el, type, fn) {
			el.detachEvent('on'+type, fn);
		};
	} else {
		return function(el, type, fn) {
			el['on'+type] = null;
		};
	}
})();