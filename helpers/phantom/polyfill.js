function __extend(o1, o2){
				o1 = o1 || {};
        for(var name in o2) {        	 
        	if(typeof(o2[name]) == "function"){
        		o1[name] = o2[name].bind(o2);
        	}else{
        		o1[name] = o2[name];
        	}
        }
        return o1;
        
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

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


navigator.userLanguage = navigator.systemLanguage = "en-US";
//Object.defineProperty( "language", { get: function () { return 'en-US' } });
//navigator.__defineGetter__( "language", function () { return 'en-US' });
//Object.defineProperty(screen, "availWidth", { get: function () { return screen.width + 1 } });
//Object.defineProperty( screen, 'availWidth', { value: 1, writable: true });
//navigator.oscpu = navigator.cpuClass = 'WindowsNT6.1;Win32;x86'


var __screen = screen; screen = {};
__extend(screen, __screen);

screen.availWidth = screen.width;
screen.availHeight = screen.height - 40;


var __navigator = navigator; navigator = {}; 
__extend(navigator, __navigator);
navigator.language = 'en-US';

var __prodsub = "";
var __yea = randomIntFromInterval(2003, 2010);

__yea = ("" + __yea).length == 1 ? "0" + __yea: __yea;

var __mon = randomIntFromInterval(1,12); 
__mon = ("" + __mon).length == 1 ? "0" + __mon: __mon;

var __day = randomIntFromInterval(1,28); 
__day = ("" + __day).length == 1 ? "0" + __day: __day;

navigator.productSub = __yea + __mon + __day; 
navigator.doNotTrack = false;

//window.__polyfill = true;
