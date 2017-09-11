/* CONSTANTS */

const CONTEXT_MENU_CONFIG = {
  "title": "Export notes to JSON",
  "documentUrlPatterns": ["*://*.amazon.com/notebook"],
}

const REASONABLE_TIMEOUT_FOR_SCREEN_PARSE = 3000;

/*
 * void copyText(string jsonSerializationText)
 *
 * Adds the content of jsonSerializationText to the system clipboard
 *
 */
function copyText(text) {
  // Egregiously stolen from
  // https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension

  // Create a temporary node with the converted content as a node
  let copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;

  let body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);

  // Select the content and copy it to the clipboard
  copyFrom.select();
  document.execCommand('copy');

  // Cleanup
  body.removeChild(copyFrom);
}

/*
 *
 * Event handler for the context-click operation. The pure eventing is handled
 * in the call to `chrome.contextMenus.create` below. Given the event
 * execution, we enter this handler.
 *
 * In order to run a more "back-end" style JavaScript code payload, we need to
 * pass a message to the content scripts held in `amajson.js`. Therefore the
 * first step is to load `amajson.js`. Due to the security sandboxing we need
 * to load these contents (inject them into the page) using `executeScript`.
 *
 * This occurs asynchronously so we need to wait until the Promise
 * resolves. Upon resolution we can continue processing the event. In this
 * case, the action is to send the message to the listener defined in
 * `amajson.js`.
 *
 */

function exportToJsonClick(info, tab) {
  let processPageNodes = new Promise((resolve, reject) => {
    chrome.tabs.executeScript(tab.id, {
      "file": "amajson.js",
    }, () => resolve());
    setTimeout(() => reject(), REASONABLE_TIMEOUT_FOR_SCREEN_PARSE);
  })

  processPageNodes.then(() => {
    chrome.tabs.sendMessage(tab.id, info, function(result) {
      copyText(result.node);
    })
  })
}

// This code fires during the extension (re)load
chrome.contextMenus.create(Object.assign(CONTEXT_MENU_CONFIG, {
  "onclick": exportToJsonClick
}));
