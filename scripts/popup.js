document.getElementById('scan').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "scan_for_keys"});
    });
});

document.getElementById('run-in-background').addEventListener('change', function() {
    const isChecked = this.checked;
    chrome.storage.local.set({'runInBackground': isChecked});
});

document.getElementById('auto-blur').addEventListener('change', function() {
    const isChecked = this.checked;
    chrome.storage.local.set({'autoBlur': isChecked});
});

// Fetching stored values and setting the initial state of the toggles
chrome.storage.local.get(['runInBackground', 'autoBlur'], function(data) {
    document.getElementById('run-in-background').checked = data.runInBackground || false;
    document.getElementById('auto-blur').checked = data.autoBlur || false;
});

document.getElementById('toggle-blur').addEventListener('change', function() {
    const isChecked = this.checked;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: isChecked ? "blur_keys" : "unblur_keys"});
    });
});

// Fetching stored value and setting the initial state of the toggle
chrome.storage.local.get(['toggleBlur'], function(data) {
    document.getElementById('toggle-blur').checked = data.toggleBlur || false;
});


// Add this after your existing event listeners
document.getElementById('click-to-copy').addEventListener('change', function() {
    const isChecked = this.checked;
    chrome.storage.local.set({'clickToCopy': isChecked});
});

// Fetching stored value and setting the initial state of the new toggle
chrome.storage.local.get(['clickToCopy'], function(data) {
    document.getElementById('click-to-copy').checked = data.clickToCopy || false;
});
