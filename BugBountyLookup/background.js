const CACHE_KEY = "programs_cache";
const CACHE_TIME_KEY = "cache_time";
const SOURCES = [
    "https://raw.githubusercontent.com/disclose/diodb/master/program-list.json",
    "https://raw.githubusercontent.com/projectdiscovery/public-bugbounty-programs/master/chaos-bugbounty-list.json",
    "https://raw.githubusercontent.com/trickest/inventory/main/targets.json"
];


// Fetch and cache data once per day
async function fetchAndCacheData() {
    const currentTime = new Date().getTime();
    const cachedTime = await chrome.storage.local.get(CACHE_TIME_KEY);

    // Check cache time and reload data if necessary
    if (!cachedTime[CACHE_TIME_KEY] || currentTime - cachedTime[CACHE_TIME_KEY] > 86400000) {
        const responses = await Promise.all(
            SOURCES.map((url) => fetch(url).then((res) => res.json()))
        );

        const combinedData = {
            programs1: responses[0],
            programs2: responses[1],
            programs3: responses[2]
        };

        // Cache data
        await chrome.storage.local.set({
            [CACHE_KEY]: combinedData
        });
        await chrome.storage.local.set({
            [CACHE_TIME_KEY]: currentTime
        });
        return combinedData;
    } else {
        // Return cached data
        const cachedData = await chrome.storage.local.get(CACHE_KEY);
        return cachedData[CACHE_KEY];
    }
}

// Search through cached data
async function searchPrograms(domain) {
    const data = await fetchAndCacheData();
    let results = [];
    let seen_domain_url = new Set();

    let regex = new RegExp(domain, "i");

    // Search across all sources
    data.programs1.forEach((program) => {
        // if (program.program_name.includes(domain)) {
        if (regex.test(program.program_name)) {
            key = `${program.program_name} - ${program.program_url}`
            if (!seen_domain_url.has(key)) {
                results.push({
                    domain: program.program_name,
                    url: program.contact_url
                });
                seen_domain_url.add(key);
            }
        }
    });

    data.programs2.programs.forEach((program) => {
        for (let p_domain of program.domains) {
            // if (p_domain.includes(domain)) {
            if (regex.test(p_domain)) {
                key = `${p_domain} - ${program.program_url}`
                if (!seen_domain_url.has(key)) {
                    results.push({
                        domain: p_domain,
                        url: program.url
                    });
                    seen_domain_url.add(key);
                }
            }
        }
    });

    data.programs3.targets.forEach((target) => {
        for (let p_domain of target.domains) {
            // if (p_domain.includes(domain)) {
            if (regex.test(p_domain)) {
                key = `${p_domain} - ${target.url}`
                if (!seen_domain_url.has(key)) {
                    results.push({
                        domain: p_domain,
                        url: target.url
                    });
                    seen_domain_url.add(key);
                }
            }
        }
    });

    return results;
}


chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "searchPrograms") {
        searchPrograms(req.domain).then((results) => {
            sendResponse({
                results: results,
                status: "success"
            });
        })

        return true; // channel will remain open until sendResponse is called
    }
});


// Function to get the active tab's domain
function setIconBasedOnActiveTab() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, async (tabs) => {
        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            return;
        }

        const url = tabs[0]?.url; // Get the URL of the active tab
        if (url) {
            const hostname = new URL(url).hostname; // Extract the domain
            hostname_pieces = hostname.split(".")
            host_root = hostname_pieces.slice(hostname_pieces.length - 2, hostname_pieces.length).join("\\.") + "$"

            const results = await searchPrograms(host_root);
            if (results.length > 0) {
                chrome.action.setIcon({
                    path: "icons/bug_green.png"
                });
            } else {
                chrome.action.setIcon({
                    path: "icons/bug.png"
                });
            }
        } else {
            console.log("No active tab URL found.");
        }
    });
}

// Run the check every 1 second
setInterval(async () => {
    setIconBasedOnActiveTab();
}, 1500);