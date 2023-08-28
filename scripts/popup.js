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
