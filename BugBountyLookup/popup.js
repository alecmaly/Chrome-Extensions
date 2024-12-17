// Form submission handler
document.getElementById("domainForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const domain = document.getElementById("domain").value.trim();
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<p>Searching...</p>";
    // Send a message to the background script
    chrome.runtime.sendMessage({
        action: "searchPrograms",
        domain: domain
    }, (resp) => {
        if (resp.status === "success") {
            results = resp.results;

            if (results.length > 0) {
                let fragment = document.createDocumentFragment();
                for (let result of results) {
                    let p = document.createElement("p");
                    p.innerHTML = `${result.domain} | <a href="${result.url}" target="_blank">${result.url}</a>`;
                    fragment.appendChild(p);
        
                }
                resultsDiv.innerHTML = "<p>Program URL:</p>";
                resultsDiv.appendChild(fragment);
        
                chrome.action.setIcon({
                    path: "icons/bug_green.png"
                });
                // resultsDiv.innerHTML = `<p>Program URL: <a href="${result}" target="_blank">${result}</a></p>`;
            } else {
                resultsDiv.innerHTML = "<p>No Program Found</p>";
                chrome.action.setIcon({
                    path: "icons/bug.png"
                });
            }
        } else {
            resultsDiv.innerHTML = "<p>Failed to search</p>";
        }
    });
});


let debounceTimer;
document.getElementById("domain").addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        document.getElementById("domainForm").dispatchEvent(new Event("submit"));
    }, 500);
});

// Populate the domain input with the current tab's domain
function populateDomainFromTab() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, async (tabs) => {
        hostname = tabs[0].url.split("/").filter(i => {
            return !i.endsWith(":") && i
        })[0]
        hostname_pieces = hostname.split(".")
        host_root = hostname_pieces.slice(hostname_pieces.length - 2, hostname_pieces.length).join("\\.") + "$"

        document.getElementById("domain").value = host_root

        document.getElementById("domainForm").dispatchEvent(new Event("submit"))
    });
}


//   // Automatically populate domain on page load
document.addEventListener("DOMContentLoaded", populateDomainFromTab);
// setInterval(populateDomainFromTab, 1000);




