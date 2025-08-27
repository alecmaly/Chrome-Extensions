document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const minInput = document.getElementById('minInput');
    const maxInput = document.getElementById('maxInput');
    const resultsDiv = document.getElementById('results');
    const contextSelect = document.getElementById('contextSelect');

    // Populate contextSelect with available frames (main + iframes)
    chrome.devtools.inspectedWindow.eval(
        'Array.from(window.frames).map(f => f.location.href)',
        function (iframes, isException) {
            if (!isException && Array.isArray(iframes)) {
                iframes.forEach(url => {
                    if (url && url !== window.location.href) {
                        const opt = document.createElement('option');
                        opt.value = url;
                        opt.textContent = 'iframe: ' + url;
                        contextSelect.appendChild(opt);
                    }
                });
            }
        }
    );

    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsDiv.textContent = 'No matches found.';
            return;
        }
        resultsDiv.innerHTML = results.map(r =>
            r.output ? `<pre>${r.output}</pre>` : `<div><b>Key:</b> ${r.path}<br><b>Value:</b> ${r.value}</div>`
        ).join('');
    }

    // Helper to run code in the selected context
    function runInContext(js, callback) {
        const context = contextSelect.value;
        const options = context === 'main' ? {} : { frameURL: context };
        chrome.devtools.inspectedWindow.eval(js, options, callback);
    }

    document.getElementById('btnNewScan').onclick = () => {
        s.new();
        searchInput.value = '';
        minInput.value = '';
        maxInput.value = '';
        resultsDiv.textContent = '';
    };

    document.getElementById('btnKeysIncludes').onclick = () => {
        // Example: run code in selected context
        runInContext('document.title', (result, isException) => {
            resultsDiv.textContent = isException ? 'Error running in context' : 'Title: ' + result;
        });
        // Replace above with your scan logic as needed
    };
    document.getElementById('btnKeysLooseEquals').onclick = () => {
        const val = searchInput.value.trim().toLowerCase();
        displayResults(s.scanKeys_loose_equals(val));
    };
    document.getElementById('btnValuesIncludes').onclick = () => {
        const val = searchInput.value.trim().toLowerCase();
        displayResults(s.scanValues_includes(val));
    };
    document.getElementById('btnValuesLooseEquals').onclick = () => {
        const val = searchInput.value.trim().toLowerCase();
        displayResults(s.scanValues_loose_equals(val));
    };
    document.getElementById('btnValuesBetween').onclick = () => {
        const min = minInput.value.trim();
        const max = maxInput.value.trim();
        if (min === '' || max === '') {
            resultsDiv.textContent = 'Please enter both min and max values.';
            return;
        }
        displayResults(s.scanValues_between(min, max));
    };
}); 