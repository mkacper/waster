chrome.tabs.onUpdated.addListener(function(tabID, change, tab){ 
    start(tab);
});

chrome.tabs.onActivated.addListener(function(evt){
    chrome.tabs.get(evt.tabId, function(tab){
        start(tab);
    });
});

chrome.browserAction.onClicked.addListener(function(tab) {
});


function start(tab){
    var tabName = tab.url.split('/')[2];
         chrome.storage.sync.get("tabs", function(val) {
             if (Object.keys(val).length === 0) {
                 chrome.storage.sync.set({"tabs": [{'name': tabName,
                                          'start': Date.now(),
                                          'end': 0,
                                          'sum': 0}]});
             } else {
                 var tabs = val.tabs;
                 var current_tab = search_tabs(tabName, tabs);
                 var empty_tab = search_empty_tab(tabs);
                 if (typeof(empty_tab) != 'undefined') {
                     var timestamp = Date.now();
                     empty_tab.end = timestamp;
                     empty_tab.sum = empty_tab.sum + timestamp - empty_tab.start;
                     chrome.storage.sync.set({"tabs": tabs});
                 }
                 if (typeof(current_tab) == 'undefined') {
                     console.log("1");
                     tabs.push({'name': tabName,
                                'start': Date.now(),
                                'end': 0,
                                'sum': 0});
                     chrome.storage.sync.set({"tabs": tabs});
                 } else {
                     console.log("2");
                     current_tab.start = Date.now();
                     current_tab.end = 0;
                     chrome.storage.sync.set({"tabs": tabs});
                 }
             };
        });
}

function search_tabs(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
};

function search_empty_tab(myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].end === 0) {
            return myArray[i];
        }
    }
};

var query = { active: true, currentWindow: true };
function callback(tabs) {
}
console.log("I am background.js");
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.request == "get_stat"){
            chrome.tabs.query(query, function(tabs){
                var tab = tabs[0];
                chrome.storage.sync.get("tabs", function(val) {
                    var tabName = tab.url.split('/')[2];
                    var tabData = search_tabs(tabName, val.tabs);
                    var message = "You've spent " +
                        Math.round(tabData.sum/(1000*60)) + " minutes on " +
                        tabData.name + " site";
                    sendResponse({
                        response: {'msg': message, 'tabs': val.tabs}
                    });
                });
            });
        }
        return true;
    });
