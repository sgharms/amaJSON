/* Not `const` b/c this code will be run multiple times if you export multiple
 * books
 */

var NOTE_IDENTIFYING_SELECTOR = ".kp-notebook-highlight";
var BOOK_METADATA_SELECTOR = "#kp-notebook-highlights-count";

if (typeof window.amaJsonListenerSet === "undefined") {
  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        sendResponse({ node: JSON.stringify(extractBook(), null, 2) });
      });
  window.amaJsonListenerSet = true;
}

function Book(annotations) {
  let titleNode = document.querySelector("h3");

  // The highlight count has an id. So we find it and up to step back down
  let metadataNode = document.querySelector(BOOK_METADATA_SELECTOR).parentElement;
  let [highlightCountNode, noteCountNode] = metadataNode.querySelectorAll("span");

  this.title = titleNode.innerText;
  this.author = titleNode.nextSibling.innerText;
  this.highlightCount = parseInt(highlightCountNode.innerText);
  this.noteCount = parseInt(noteCountNode.innerText);

  this.annotations = annotations;
}

Book.prototype.toJSON = function() {
  return {
    title: this.title,
    author: this.author,
    highlightCount: this.highlightCount,
    noteCount: this.noteCount,
    annotations: this.annotations.map((a) => a.toJSON())
  }
}

function Note(highlightNode) {
  let bubbleTil = (node, fn) => {
    return fn(node) ? node : bubbleTil(node.parentElement, fn);
  }
  let separatorNode = bubbleTil(highlightNode, n => Array.from(n.classList).includes("kp-notebook-row-separator"));
  let metaDataNode = separatorNode.querySelector("span");

  this.highlightText = highlightNode.querySelector("span").innerText;
  this.kindleLocation = parseInt(metaDataNode.innerText.split(":")[1]);
  this.annotationNode = highlightNode.nextElementSibling.querySelector("#note")

  if (!!this.annotationNode) {
    this.hasNote = true;
    this.annotationText = this.annotationNode.innerText;
  } else {
    this.hasNote = false;
  }
}

Note.prototype.toJSON = function() {
  return {
    "highlight":  this.highlightText,
    "location":   this.kindleLocation,
    "annotation": this.hasNote ? this.annotationText : null
  }
}

function extractBook() {
  let highlightNodeList = document.querySelectorAll(NOTE_IDENTIFYING_SELECTOR);
  let highlightNodes = Array.from(highlightNodeList);
  let annotations = highlightNodes.map(n => new Note(n));
  let book = new Book(annotations);
  let jsonRep = book.toJSON();

  alert("Copied _" + book.title + "_");
  return jsonRep;
}

