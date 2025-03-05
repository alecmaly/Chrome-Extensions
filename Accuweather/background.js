// Background script for handling messages from content script

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from content script:", message);
    
    getCoords(message.data)
        .then(resp => {
            sendResponse(resp)
        })

    // Return true if you want to send a response asynchronously
    return true;
});






async function getCoords(str) {
    try {
        let html = await fetch(`https://www.google.com/maps?q=${str}`).then(r => r.text()).then(h => h)
        
        return html
    } catch (err) {
        console.error(err)
        return null
    }
}
