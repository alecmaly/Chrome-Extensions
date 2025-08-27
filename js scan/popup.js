const searchInput = document.getElementById('searchInput');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const resultsDiv = document.getElementById('results');

function displayResults(results) {
    if (!results || results.length === 0) {
        resultsDiv.textContent = 'No matches found.';
        return;
    }
    resultsDiv.innerHTML = results.map(r => `<div><b>Path:</b> ${r.path}<br><b>Value:</b> ${r.value}</div>`).join('');
}

document.getElementById('btnNewScan').onclick = () => {
    s.new();
    searchInput.value = '';
    minInput.value = '';
    maxInput.value = '';
    resultsDiv.textContent = '';
};

document.getElementById('btnKeysIncludes').onclick = () => {
    const val = searchInput.value.trim().toLowerCase();
    displayResults(s.scanKeys_includes(val));
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