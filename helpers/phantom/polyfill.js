function HTMLVideoElement() {}
HTMLVideoElement.prototype.canPlayType = function(t){
	return true;
}

function HTMLAudioElement() {}
HTMLAudioElement.prototype.canPlayType = function(t){
	return true;
}


var __createElement = document.createElement.bind(document);
document.createElement = function(e){
	if(e == 'video'){
		return new HTMLVideoElement();
	}	else if(e == 'audio'){
		return new HTMLAudioElement();
	}else{
		return __createElement(e);
	}
}


navigator.userLanguage = navigator.language = "en-US";
navigator.doNotTrack = false;

window.__polyfill = true;