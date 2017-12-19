console.log("I am popup.js");
hello();

function hello() {
    console.log("hello");
    chrome.runtime.sendMessage({
        request: "get_stat"
    },
    function(response) {
        document.getElementById("msg").textContent = response.response.msg;
        var tabs = sortByKey(response.response.tabs, "sum").slice(0, 10);
        insertResults(tabs);
    });
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

function insertResults(tabs) {
    for (i = 0; i < tabs.length; i++) { 
        var time = msToMin(tabs[i].sum);
        var div = document.createElement("div");
        div.className = "singleResult";
        div.innerHTML = "<h3>You've spent " + time + " minutes on <span class='site'>" +
            tabs[i].name + "</span> site.</h3> <h4>In that time: " +
            alternative(time) + "</h4>";
        document.getElementById("results").appendChild(div);
    } 
}

function msToMin(ms) {
    return Math.round(ms/(1000*60));
}

function alternative(time) {
    var converter = getConverter();
    var msg = Math.round(time/converter.time) + converter.msg;
    return msg;
}

function getConverter() {
    var converters = [
        {
            id: 1,
            time: 840,
            msg: " book read"
        },
        {
            id: 2,
            time: 6,
            msg: " kilometers run"
        },
        {
            id: 3,
            time: 0.1,
            msg: " burned kcal playing tennis"
        },
        {
            id: 4,
            time: 15,
            msg: " eaten pizzas"
        },
        {
            id: 5,
            time: 7,
            msg: " drunk beers"
        },
        {
            id: 6,
            time: 20,
            msg: " drunk botles of vodka with your brother in law"
        },
        {
            id: 7,
            time: 1,
            msg: " swam olympic swimming pools"
        },
        {
            id: 8,
            time: 90,
            msg: " watched films"
        },
        {
            id: 9,
            time: 30,
            msg: " walks with your dog"
        },
        {
            id: 10,
            time: 10,
            msg: " walks with your girl"
        },
    ];
    var item = converters[Math.floor(Math.random()*converters.length)];
    return item;
}
