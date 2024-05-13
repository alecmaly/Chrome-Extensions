chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
        let html = await fetch(request.url)
            .then(resp => resp.text())  // This won't work as expected due to no-cors
            .catch(error => error);
        // let html = "sdf"
        sendResponse(html);
    })()
    return true;  // Important to return true when you send a response asynchronously
});
