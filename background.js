chrome.tabs.onActivated.addListener(function(evt){ 
    chrome.tabs.get(evt.tabId, function(tab){ 
         chrome.storage.sync.get("tabs", function(val) {
             if (Object.keys(val).length === 0) {
                 chrome.storage.sync.set({"tabs": [{'url': tab.url,
                                          'start': Date.now(),
                                          'end': 0,
                                          'sum': 0}]});
             } else {
                 var tabs = val.tabs;
                 var current_tab = search_tabs(tab.url, tabs);
                 var empty_tab = search_empty_tab(tabs);
                 if (typeof(empty_tab) != 'undefined') {
                     var timestamp = Date.now();
                     empty_tab.end = timestamp;
                     empty_tab.sum = empty_tab.sum + timestamp - empty_tab.start;
                     chrome.storage.sync.set({"tabs": tabs});
                 }
                 if (typeof(current_tab) == 'undefined') {
                     console.log("1");
                     tabs.push({'url': tab.url,
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
    }); 
});

function search_tabs(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].url === nameKey) {
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
