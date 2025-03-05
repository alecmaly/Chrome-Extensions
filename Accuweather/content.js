// Listen for the custom event dispatched by the injected script
window.addEventListener('myCustomEvent', (event) => {
    // send message to background script
    chrome.runtime.sendMessage({data: event.detail}, (response) => {
        // When the background script responds, dispatch a custom event with the response data
        window.dispatchEvent(new CustomEvent('extensionResponse', {
            detail: response
        })); 
    });
});

// Inject the injectedScript.js into the page context
var script = document.createElement('script');
script.src = chrome.runtime.getURL('injectedScript.js');
(document.head || document.documentElement).appendChild(script);
script.remove();