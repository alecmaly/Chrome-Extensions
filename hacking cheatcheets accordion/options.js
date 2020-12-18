// Saves options to chrome.storage
function save_options() {
  var hacktricksEnabled = document.getElementById('hacktricksEnabled').checked;
  var payloadAllTheThingsEnabled = document.getElementById('payloadAllTheThingsEnabled').checked;
  var notionAccordionEnabled = document.getElementById('notionAccordionEnabled').checked;
  var notionTableOfContentsEnabled = document.getElementById('notionTableOfContentsEnabled').checked;


  chrome.storage.sync.set({
    payloadAllTheThingsEnabled: payloadAllTheThingsEnabled,
    hacktricksEnabled: hacktricksEnabled,
    notionAccordionEnabled: notionAccordionEnabled,
    notionTableOfContentsEnabled: notionTableOfContentsEnabled
    
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    hacktricksEnabled: true,
    payloadAllTheThingsEnabled: true,
    notionAccordionEnabled: true,
    notionTableOfContentsEnabled: true
  }, function(items) {
    document.getElementById('hacktricksEnabled').checked = items.hacktricksEnabled;
    document.getElementById('payloadAllTheThingsEnabled').checked = items.payloadAllTheThingsEnabled;
    document.getElementById('notionAccordionEnabled').checked = items.notionAccordionEnabled;
    document.getElementById('notionTableOfContentsEnabled').checked = items.notionTableOfContentsEnabled;

    
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
