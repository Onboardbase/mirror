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

    console.log(foundKeys);

    if (foundKeys.length > 0) {
      // createTailwindModal(foundKeys);
      alert(foundKeys)
    }
    
    return foundKeys;
}




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
    linkElement.href = "https://cdn.tailwindcss.com/3.3.3/tailwind.min.css";
    document.head.appendChild(linkElement);
}
  

function createTailwindModal(keys) {
  // Create modal HTML
  const modalHTML = `
  <div id="keyModal" class="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom text-left transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
  <div class="bg-white sm:rounded-lg w-96 mx-7 relative shadow-xs">
    <div class="flex justify-between items-center py-4 px-4 border-b border-gray-100">
      <div class="">
        <h2 class="text-xl md:text-xl leading-4 font-extrabold">Start here</h2>
        <p class="mt-1 text-sm leading-5 text-gray-500 font-medium max-w">give access</p>
      </div>
      <a href="/">
        <img
          class="h-8 md:h-6"
          src="https://devapp.onboardbase.com/img/new-logo-dark.03886ba5.png"
          alt="Onboardbase Logo"
        />
      </a>
    </div>
    <div class="bg-cool-gray-50 overflow-hidden font-mono border-b border-gray-100">
      <form class="" autocomplete="off">
        <div class="">
          <textarea
            rows="4"
            class="form-textarea font-mono block h-60 resize-none w-full bg-cool-gray-50 text-gray-500 transition duration-150 border-none placeholder-gray-500 rounded-none focus:border-none focus:outline-none outline-none focus:shadow-none font-medium ease-in-out text-sm break-words sm:leading-5 p-3"
            placeholder="key=value goes here..."
            autofocus="autofocus"
          >
          ${keys}
          </textarea>
        </div>
        <div class="flex items-center justify-center px-4 py-2.5 space-x-3">
          <div class="flex-shrink-0">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-md bg-black w-44 px-8 py-2 text-sm font-medium text-white focus:outline-none"
            >
              Cancel
            </button>
          </div>
          <div class="flex-shrink-0">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-md bg-black w-44 px-8 py-2 text-sm font-medium text-white focus:outline-none"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
    <div
      class="flex flex-row rot items-center justify-start origin-bottom-left py-1.5 px-3 gap-1 rounded-b-none absolute left-0 -ml-0 top-0 rounded-md bg-black"
    >
      <span class="text-so-small font-semibold text-gray-200">Secured by</span>
      <img
        class="mx-auto h-2.5 w-auto"
        src="https://devapp.onboardbase.com/img/onboardbase-2.b9b8f490.png"
        alt="Onboardbase logo"
      />
    </div>
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

