
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
        { key: 'SK_TEST', pattern: /sk_test_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SK_LIVE', pattern: /sk_live_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'BEARER', pattern: /Bearer [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_KEY_COLON', pattern: /api_key:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'AUTHORIZATION_BASIC', pattern: /Authorization: Basic [A-Za-z0-9+/]+=?(?=\s|$)/g },
        { key: 'AWS_ACCESS_KEY_ID', pattern: /AWS_ACCESS_KEY_ID=[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PK_TEST', pattern: /pk_test_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PK_LIVE', pattern: /pk_live_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_KEY_SPACE', pattern: /api_key [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'ACCESS_TOKEN_COLON', pattern: /ACCESS_TOKEN:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SECRET_TOKEN_COLON', pattern: /SECRET_TOKEN:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'BEARER_TOKEN', pattern: /BearerToken [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'TOKEN', pattern: /Token [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'JWT', pattern: /JWT [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'GOOGLE_MAPS_API_KEY', pattern: /GoogleMapsAPIKey[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'DB_PASSWORD', pattern: /db_password=[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'CLIENT_SECRET', pattern: /client_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PRIVATE_KEY', pattern: /private_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'APP_SECRET', pattern: /app_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'APP_KEY', pattern: /app_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_SECRET', pattern: /api_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'OAUTH_TOKEN', pattern: /oauth_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'ACCESS_KEY', pattern: /access_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_TOKEN', pattern: /api_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'ENCRYPTION_KEY', pattern: /encryption_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'JWT_SECRET', pattern: /jwt_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'AUTH_TOKEN', pattern: /auth_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SECRET_KEY', pattern: /secret_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PRIVATE_TOKEN', pattern: /private_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'REDIS_URL', pattern: /rediss?:\/\/(?:[A-Za-z0-9\-_]+:)?[A-Za-z0-9\-_]+@[A-Za-z0-9\-_\.]+:\d+/g },
        { key: 'POSTGRES_URL', pattern: /postgres(?:s)?:\/\/[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'WHSEC', pattern: /whsec_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SK_HYPHEN', pattern: /sk-[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'MONGODB_URL', pattern: /mongodb+srv:\/\/[A-Za-z0-9\-_]+:[A-Za-z0-9\-_]+@[A-Za-z0-9\-_\.]+/g },
        { key: 'X_API_KEY_COLON', pattern: /x-api-key:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'GENERIC_PASSWORD', pattern: /password=[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'AZURE', pattern: /azure_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'FIREBASE', pattern: /firebase[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'TWILIO', pattern: /twilio_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'HEROKU', pattern: /heroku_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SENDGRID', pattern: /sendgrid_[A-Za-z0-9\-_]+(?=\s|$)/g },
      ];
       
    
    
      const foundKeys = [];

      while (textNodes.nextNode()) {
        const node = textNodes.currentNode;
        keyPatterns.forEach(({ key, pattern }) => {
          const matches = node.nodeValue.match(pattern);
          if (matches) {
            matches.forEach(match => {
              foundKeys.push({ type: key, value: match });
            });
          }
        });
      }
        // console.log(foundKeys);
        if (foundKeys.length > 0) {
          const keysString = foundKeys.map(keyObj => `${keyObj.type}=${keyObj.value}`).join('\n');
          createTailwindModal(keysString);
        }
        
    
    
    return foundKeys;
}


  // Your content script logic
  function scanPageForKeysWithoutModal() {
    const textNodes = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      const keyPatterns = [
        { key: 'SK_TEST', pattern: /sk_test_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SK_LIVE', pattern: /sk_live_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'BEARER', pattern: /Bearer [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_KEY_COLON', pattern: /api_key:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'AUTHORIZATION_BASIC', pattern: /Authorization: Basic [A-Za-z0-9+/]+=?(?=\s|$)/g },
        { key: 'AWS_ACCESS_KEY_ID', pattern: /AWS_ACCESS_KEY_ID=[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PK_TEST', pattern: /pk_test_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PK_LIVE', pattern: /pk_live_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_KEY_SPACE', pattern: /api_key [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'ACCESS_TOKEN_COLON', pattern: /ACCESS_TOKEN:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SECRET_TOKEN_COLON', pattern: /SECRET_TOKEN:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'BEARER_TOKEN', pattern: /BearerToken [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'TOKEN', pattern: /Token [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'JWT', pattern: /JWT [A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'GOOGLE_MAPS_API_KEY', pattern: /GoogleMapsAPIKey[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'DB_PASSWORD', pattern: /db_password=[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'CLIENT_SECRET', pattern: /client_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PRIVATE_KEY', pattern: /private_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'APP_SECRET', pattern: /app_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'APP_KEY', pattern: /app_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_SECRET', pattern: /api_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'OAUTH_TOKEN', pattern: /oauth_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'ACCESS_KEY', pattern: /access_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'API_TOKEN', pattern: /api_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'ENCRYPTION_KEY', pattern: /encryption_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'JWT_SECRET', pattern: /jwt_secret[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'AUTH_TOKEN', pattern: /auth_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SECRET_KEY', pattern: /secret_key[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'PRIVATE_TOKEN', pattern: /private_token[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'REDIS_URL', pattern: /rediss?:\/\/(?:[A-Za-z0-9\-_]+:)?[A-Za-z0-9\-_]+@[A-Za-z0-9\-_\.]+:\d+/g },
        { key: 'POSTGRES_URL', pattern: /postgres(?:s)?:\/\/[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'WHSEC', pattern: /whsec_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SK_HYPHEN', pattern: /sk-[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'MONGODB_URL', pattern: /mongodb+srv:\/\/[A-Za-z0-9\-_]+:[A-Za-z0-9\-_]+@[A-Za-z0-9\-_\.]+/g },
        { key: 'X_API_KEY_COLON', pattern: /x-api-key:[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'GENERIC_PASSWORD', pattern: /password=[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'AZURE', pattern: /azure_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'FIREBASE', pattern: /firebase[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'TWILIO', pattern: /twilio_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'HEROKU', pattern: /heroku_[A-Za-z0-9\-_]+(?=\s|$)/g },
        { key: 'SENDGRID', pattern: /sendgrid_[A-Za-z0-9\-_]+(?=\s|$)/g },
      ];
       
    
    
      const foundKeys = [];

      while (textNodes.nextNode()) {
        const node = textNodes.currentNode;
        keyPatterns.forEach(({ key, pattern }) => {
          const matches = node.nodeValue.match(pattern);
          if (matches) {
            matches.forEach(match => {
              foundKeys.push({ type: key, value: match });
            });
          }
        });
      }


    if (foundKeys.length > 0) {
      blurKeys(foundKeys);
    }
  
    return foundKeys;

}

const originalNodes = new Map();
const keyStates = new Map();
let keyFoundInDOM = false; // flag to check if key is found

function blurKeys(foundKeys) {
  // console.log('Found keys:', JSON.stringify(foundKeys));

  // Injecting CSS for blurred-key and blurred-page
  const style = document.createElement('style');
  style.textContent = `
    .blurred-key {
      filter: blur(10px);
    }
    .blurred-page {
      filter: blur(10px);
    }
  `;
  document.head.appendChild(style);

  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (textNodes.nextNode()) {
    const node = textNodes.currentNode;
    // console.log("Processing text node: ", node.nodeValue); 
    let textContent = node.nodeValue;

    const replacements = [];
    foundKeys.forEach(({ value }) => {
      let index = textContent.indexOf(value);
      while (index !== -1) {
        keyFoundInDOM = true; // key found
        replacements.push({ start: index, end: index + value.length, value });
        index = textContent.indexOf(value, index + 1);
      }
    });

    // Sort replacements by index
    replacements.sort((a, b) => a.start - b.start);
    // console.log('Replacements:', JSON.stringify(replacements));

    if (replacements.length > 0) {
      let lastIndex = 0;
      let result = '';

      replacements.forEach(({ start, end, value }) => {
        result += textContent.slice(lastIndex, start) + `<span class="blurred-key">${value}</span>`;
        lastIndex = end;
      });

      result += textContent.slice(lastIndex);

      const wrapper = document.createElement('span');
      wrapper.innerHTML = result;
      node.replaceWith(wrapper);
    }
  }

  if (keyFoundInDOM) {
    document.body.classList.add("blurred-page");
  }
}


function removeBlur() {
  originalNodes.forEach((originalNode, wrapper) => {
    wrapper.replaceWith(originalNode);
  });
  originalNodes.clear();  // Clear saved nodes

  keyStates.forEach((value, key) => {
    keyStates.set(key, false);  // set all keys to unblurred
  });
}





chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // console.log('Message received:', message.action);

  // Run blurKeys irrespective of message.action, but you will have to
  // fetch the keys if message.action !== 'scan_for_keys' or use a global variable
  let foundKeys = [];
  if (message.action === "scan_for_keys") {
    foundKeys = scanPageForKeys();
    // console.log('Found Keys Length:', foundKeys.length);
  }

  if (message.action === "manually_blur_keys") {
    foundKeys = scanPageForKeysWithoutModal();
    // console.log('Blurred Keys Length:', foundKeys.length);
  }

  

});

chrome.storage.local.get(['autoBlur'], function(data) {
  // console.log("Value of autoBlur is", data.autoBlur);
  if (data.autoBlur) {
    blurObserve();
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
let observer;

const observe = () => {
  const runDocumentMutations = throttle(() => {
    scanPageForKeys();
  }, 1000);

  observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.target.id === 'keyModal') {
        return;
      }
    }
    runDocumentMutations();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
};

const blurObserve = () => {
  const runDocumentMutations = throttle(() => {
    scanPageForKeysWithoutModal();
  }, 1000);

  observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.target.id === 'keyModal') {
        return;
      }
    }
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
  if(observer){
    observer.disconnect();
  }

  let keysString = '';
  if (Array.isArray(keys)) {
    keysString = keys.map(keyObj => `${keyObj.type}: ${keyObj.value}`).join('\n');
  } else {
    keysString = keys;
  }


  // Create modal HTML
  const modalHTML = `
  <div id="keyModal" class="fixed z-9999 inset-0 overflow-y-auto flex justify-center items-center">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-middle">
  <div class="bg-white sm:rounded-lg w-96 mx-7 relative shadow-xs">
    <div class="flex justify-between items-center py-4 px-4 border-b border-gray-100">
      <div class="text-left">
        <h2 class="text-xl md:text-xl leading-4 font-extrabold">Start Here</h2>
        <p class="mt-1 text-sm leading-5 text-gray-500 font-medium">Add to Onboardbase</p>
      </div>
      <a href="/">
        <img
          class="h-8 md:h-6"
          src="https://devapp.onboardbase.com/img/new-logo-dark.03886ba5.png"
          alt="Onboardbase Logo"
        />
      </a>
    </div>
    <div class="">
      <form class="" autocomplete="off">
        <div class="border-b border-gray-100 text-left">
        <textarea
        rows="4"
        class="form-textarea text-left font-mono block h-60 resize-none w-full bg-cool-gray-50 text-gray-500 transition duration-150 border-none placeholder-gray-500 rounded-none focus:border-none focus:outline-none outline-none focus:shadow-none font-medium ease-in-out text-sm break-words sm:leading-5 p-3"
        placeholder="key=value goes here..."
        autofocus="autofocus"
      >${keysString}</textarea>
      
        </div>
        <div class="flex items-center justify-center px-4 py-2.5 space-x-3">
          <div class="flex-shrink-0">
            <button
              type="submit"
              class="inline-flex items-center justify-center cursor-pointer rounded-md bg-white border-gray-100 border text-gray-500 hover:text-gray-400 w-44 px-8 py-2 text-sm font-medium text-white focus:outline-none"
            >
              Cancel
            </button>
          </div>
          <div class="flex-shrink-0">
            <button
              type="submit"
              class="inline-flex items-center justify-center cursor-pointer rounded-md bg-black w-44 px-8 py-2 text-sm font-medium text-white focus:outline-none">
              Add
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

  // Attach an event listener to the modal background
  const modalBg = document.querySelector(".fixed.inset-0.bg-gray-900.bg-opacity-75");
  // console.log("here we go", modalBg)
  modalBg.addEventListener("click", function() {
    closeModal();
  });
  
  // Function to close modal
  function closeModal() {
    const modal = document.getElementById("keyModal");
    if (modal) {
      modal.remove();
    }
  }
}
