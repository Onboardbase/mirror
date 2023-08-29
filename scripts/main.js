injectTailwindCSS();

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
        /sendgrid_[A-Za-z0-9\-_]+(?=\s|$)/g,                                    // SendGrid API key
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
  
    // if (foundKeys.length > 0) {
    //     confirm("Detected keys:\n\n" + foundKeys.join("\n") + " \n do you want to add it to your Onboardbase account?");
        
    // }

    if (foundKeys.length > 0) {
      createTailwindModal(foundKeys);
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
      
      
function injectTailwindCSS() {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://cdn.tailwindcss.com/2.2.16/tailwind.min.css";
    document.head.appendChild(linkElement);
}
  

function createTailwindModal(keys) {
  // Create modal HTML
  const modalHTML = `
    <div id="keyModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Detected keys
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    ${keys.join('<br>')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button id="addToOnboardbase" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
              Add to Onboardbase
            </button>
            <button id="modalCancel" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  function closeModal() {
    console.log("Trying to close modal...");
    const modal = document.getElementById("keyModal");
    if (modal) {
      console.log("Modal found, removing...");
      modal.remove();
    } else {
      console.log("Modal not found.");
    }
  }
  

  // Add event listeners
  const addToOnboardbaseButton = document.getElementById("addToOnboardbase");
  const modalCancelButton = document.getElementById("modalCancel");

  if (addToOnboardbaseButton) {
    addToOnboardbaseButton.addEventListener("click", function() {
      closeModal();
    });
  }
  console.log(modalCancelButton)

  if (modalCancelButton) {
    modalCancelButton.addEventListener("click", closeModal);
  }

  const modalBackground = document.querySelector('.fixed.inset-0.bg-gray-500.bg-opacity-75');

  if (modalBackground) {
    modalBackground.addEventListener('click', function(event) {
      if (event.target === modalBackground) {
        closeModal();
      }
    });
  }
}

