chrome.tabs.onUpdated.addListener(function(tabID, change, tab){ 
    start(tab);
});

chrome.tabs.onActivated.addListener(function(evt){
    chrome.tabs.get(evt.tabId, function(tab){
        start(tab);
    });
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get("tabs", function(val) {
        var tabName = tab.url.split('/')[2];
        var tabData = search_tabs(tabName, val.tabs);
        alert("You've spent " + tabData.sum/(1000*60) + " minutes on " +
              tabData.name + " site");
    });
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
