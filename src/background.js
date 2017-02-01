function copyText(text) {
  // Egregiously stolen from
  // https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}

var menuDef = {
  "title": "AmaJSON Export \"%s\:",
  "contexts": ["link"],
  "onclick": function(textInfo, tab) {
    chrome.tabs.executeScript(tab.id, {
      "file": "amajson.js",
    })

    chrome.tabs.sendMessage(tab.id, textInfo, function(result) {
      if (!result || typeof(result.node) === "undefined") {
        chrome.tabs.executeScript(tab.id, {
          code: "alert(\"Unable to process, please re-try\");"
        })
        return;
      }
      copyText(result.node);
    })
  }
};

chrome.contextMenus.create(menuDef);
