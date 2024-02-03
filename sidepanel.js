// when recieve the message from the content page, call the function
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "updateSidePanel") {
        call(prompt=request.text, url=request.url);
    }
  });

chrome.storage.onChanged.addListener((changes, namespace) => {
    setting = getSetting();
    setting.then(
        (value) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                document.getElementById('level').innerHTML = " <small>(" + value + ")</small>";
            }        
        },
        (error) => {console.log("cannot get settings:" + error);}
    );
});  

document.addEventListener("DOMContentLoaded", function() {  
    setting = getSetting();
    setting.then(
        (value) => {
            document.getElementById('level').innerHTML = " <span>[" + value + "]</span>";
        },
        (error) => {console.log("cannot get settings:" + error);}
    );
});

// call the server and display the response
async function call(prompt, url, action="https://simplerd-euvvzoahoq-as.a.run.app/call/gpt") {    
    // get the settings first
    setting = await getSetting();
    // call the server
    response = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({input: prompt, setting: setting}),
    });
    // create a new paragraph
    document.getElementById('output').append(document.createElement("p"));
    document.getElementById('output').innerHTML += "<span>[" + setting + "]</span> ";
    // read data from the server until it's completed
    decoder = new TextDecoder();
    reader = response.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // add to the output element and scroll to the end of the window
        document.getElementById('output').innerHTML += decoder.decode(value);
        window.scrollTo({top: document.body.scrollHeight, behavior:'smooth' });
    }    
    // add a citation to the page's site
    document.getElementById('output').innerHTML +="<br/><cite><a href='" + url + "'>" + url + "</a></cite>"; 
}

// Function to retrieve the setting
function getSetting() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['selectedOption'], function(result) {
            if (result.selectedOption) {
                resolve(result.selectedOption);
            } else {
                resolve("L2"); // Default value if no option selected
            }
        });
    });
}