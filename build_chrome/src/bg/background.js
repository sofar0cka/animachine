"use strict";

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58968347-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.browserAction.onClicked.addListener(function (tab) {

    console.log('clicked', tab.id);

    chrome.tabs.executeScript(tab.id, {code: "if (this.am) {am.toggle();console.log('have am');} else { chrome.runtime.sendMessage({subject:\'embed\', id:"+tab.id+"});console.log('no am'); }"});

});

chrome.browserAction.setBadgeText({text: 'α'});
chrome.browserAction.setBadgeBackgroundColor({color: isDevMode() ? '#F00' : '#000'});

chrome.runtime.onMessage.addListener(function (request) {

    if (request.subject === 'embed') {

        chrome.tabs.executeScript(request.id, {file: "js/content_script.js"});
        chrome.tabs.insertCSS(request.id, {file: "assets/fontello/css/amgui-embedded.css"});
        chrome.tabs.insertCSS(request.id, {file: "assets/dialog-polyfill.css"});
    }
    if (request.subject === 'track') {

        _gaq.push(['_trackEvent', request.evtName, request.value]);
    }
});


function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}
