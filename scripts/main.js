
  // Your content script logic
function scanPageForKeys() {
    const textNodes = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const keyPatterns = [
        /sk_test_[A-Za-z0-9\-_]+(?=\s|$)/g,
        /sk_live_[A-Za-z0-9\-_]+(?=\s|$)/g,
        /Bearer [A-Za-z0-9\-_]+(?=\s|$)/g,
        /api_key:[A-Za-z0-9\-_]+(?=\s|$)/g,
        /Authorization: Basic [A-Za-z0-9+/]+=?(?=\s|$)/g,
        /AWS_ACCESS_KEY_ID=[A-Za-z0-9\-_]+(?=\s|$)/g,
        /pk_test_[A-Za-z0-9\-_]+(?=\s|$)/g,
        /pk_live_[A-Za-z0-9\-_]+(?=\s|$)/g,
        /api_key [A-Za-z0-9\-_]+(?=\s|$)/g,
        /ACCESS_TOKEN:[A-Za-z0-9\-_]+(?=\s|$)/g,
        /SECRET_TOKEN:[A-Za-z0-9\-_]+(?=\s|$)/g,
        /BearerToken [A-Za-z0-9\-_]+(?=\s|$)/g,
        /Token [A-Za-z0-9\-_]+(?=\s|$)/g,
        /JWT [A-Za-z0-9\-_]+(?=\s|$)/g,
        /GoogleMapsAPIKey[A-Za-z0-9\-_]+(?=\s|$)/g,
        /db_password=[A-Za-z0-9\-_]+(?=\s|$)/g,
        /client_secret[A-Za-z0-9\-_]+(?=\s|$)/g,
        /private_key[A-Za-z0-9\-_]+(?=\s|$)/g,
        /app_secret[A-Za-z0-9\-_]+(?=\s|$)/g,
        /app_key[A-Za-z0-9\-_]+(?=\s|$)/g,
        /api_secret[A-Za-z0-9\-_]+(?=\s|$)/g,
        /oauth_token[A-Za-z0-9\-_]+(?=\s|$)/g,
        /access_key[A-Za-z0-9\-_]+(?=\s|$)/g,
        /api_token[A-Za-z0-9\-_]+(?=\s|$)/g,
        /encryption_key[A-Za-z0-9\-_]+(?=\s|$)/g,
        /jwt_secret[A-Za-z0-9\-_]+(?=\s|$)/g,
        /auth_token[A-Za-z0-9\-_]+(?=\s|$)/g,
        /secret_key[A-Za-z0-9\-_]+(?=\s|$)/g,
        /private_token[A-Za-z0-9\-_]+(?=\s|$)/g,
        /rediss?:\/\/(?:[A-Za-z0-9\-_]+:)?[A-Za-z0-9\-_]+@[A-Za-z0-9\-_\.]+:\d+/g,  // Redis URLs with optional user
        /postgres(?:s)?:\/\/[A-Za-z0-9\-_]+(?=\s|$)/g,
        /whsec_[A-Za-z0-9\-_]+(?=\s|$)/g,
        /sk-[A-Za-z0-9\-_]+(?=\s|$)/g,
        /mongodb+srv:\/\/[A-Za-z0-9\-_]+:[A-Za-z0-9\-_]+@[A-Za-z0-9\-_\.]+/g,   // MongoDB connection string
        /x-api-key:[A-Za-z0-9\-_]+(?=\s|$)/g,                                   // Generic X-API-KEY header
        /password=[A-Za-z0-9\-_]+(?=\s|$)/g,                                    // Generic password
        /azure_[A-Za-z0-9\-_]+(?=\s|$)/g,                                       // Azure keys
        /firebase[A-Za-z0-9\-_]+(?=\s|$)/g,                                     // Firebase keys
        /twilio_[A-Za-z0-9\-_]+(?=\s|$)/g,                                      // Twilio API keys
        /heroku_[A-Za-z0-9\-_]+(?=\s|$)/g,                                      // Heroku API keys
        /sendgrid_[A-Za-z0-9\-_]+(?=\s|$)/g,                                    // SendGrid API keys
    ];
    
    
    
      const foundKeys = [];
    
      while (textNodes.nextNode()) {
        const node = textNodes.currentNode;
        keyPatterns.forEach(pattern => {
          const matches = node.nodeValue.match(pattern);
          if (matches) {
            foundKeys.push(...matches);
          }
        });
      }

    console.log(foundKeys)
  
    if (foundKeys.length > 0) {
        confirm("Detected keys:\n\n" + foundKeys.join("\n") + " \n do you want to add it to your Onboardbase account?");
    }
    
    return foundKeys;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "scan_for_keys") {
      scanPageForKeys();
  }
});


// This function will be used to blur the found keys.
function blurKeys(foundKeys) {
  foundKeys.forEach(key => {
      const blurSpan = `<span class="blurred-key">${key}</span>`;
      document.body.innerHTML = document.body.innerHTML.replace(key, blurSpan);
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "scan_for_keys") {
      const foundKeys = scanPageForKeys();

      // Checking the value of autoBlur from storage to decide whether to blur immediately
      chrome.storage.local.get(['autoBlur'], function(data) {
          if (data.autoBlur && foundKeys.length) {
              blurKeys(foundKeys);
          }
      });
  }
});

// If run-in-background is enabled, we will set up our MutationObserver
chrome.storage.local.get(['runInBackground'], function(data) {
  if (data.runInBackground) {
      observe();
  }
});


// Throttle function
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

  const observe = () => {
      const runDocumentMutations = throttle(() => {
          scanPageForKeys();
      }, 1000);
    
      const observer = new MutationObserver((mutationsList) => {
        if (!mutationsList.length) return;
        runDocumentMutations();
      });
    
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    };
      
      
