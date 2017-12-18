console.log("I am popup.js");
hello();

function hello() {
    console.log("hello");
    chrome.runtime.sendMessage({
        request: "get_stat"
    },
    function(response) {
        console.log(document.getElementById("msg"));
        document.getElementById("msg").textContent = response.response;
    });
}
