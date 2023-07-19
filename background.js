console.log("inside background")
chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
    console.log("func", tabId, changeInfo)
    console.log(tab);
    if( tab.status === "complete" && tab.url && tab.url.includes('youtube.com/watch')){
        const queryParameters = tab.url.split("?")[1];
        console.log(queryParameters);
        const urlParameters = new URLSearchParams(queryParameters);
        console.log(urlParameters.get('v'))

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"),
        });
    }
} )
