chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var s = Array.from(document.querySelectorAll("a")).filter( (e) => e.text === request.selectionText)[0];
    var id = s.parentElement.parentElement.attributes.id.value;
    if (!s) return;
    var result = extractBook(id);
    sendResponse({ node: JSON.stringify(result) });
});


function determineBoundingIndexes(list) {
  var boundingIndexes = [];

  list.forEach( function(e, i) {
    var list = Array.from(e.classList);
    if (list.includes("yourHighlightsHeader")) {
      boundingIndexes.push(i);
    }
  })

  return boundingIndexes;
}

function Book(bookNode, annotations) {
  var stats = Array.from(bookNode.querySelector("div.yourHighlightsStats")
                         .querySelectorAll("div")).map( (e) => e.innerText )

  this.title = bookNode.querySelector(".title").innerText;
  this.author = bookNode.querySelector(".author").innerText;
  this.highlightCount = stats[0].match(/\d+/)[0];
  this.noteCount = stats[1].match(/\d+/)[0];

  this.annotations = annotations;
}

function Note(noteNode) {

  this.highlight = noteNode.querySelector("span").innerText;
  this.location = noteNode.querySelector("a").innerText.match(/\d+/)[0];
  this.annotation = noteNode.querySelector("p.editNote");;

  if (!!this.annotation) {
    this.hasNote = true;
    this.annotation = this.annotation.querySelector(".noteContent").innerText;
  } else {
    this.hasNote = false;
  }
}

Note.prototype.toJSON = function() {
  return {
    highlight: this.highlight,
    location: this.location,
    annotation: this.hasNote ? this.annotation : null
  }
}

Book.prototype.toJSON = function() {
  return {
    title: this.title,
    author: this.author,
    highlightCount: this.highlightCount,
    noteCount: this.noteCount,
    annotations: this.annotations.map( (a) => a.toJSON() )
  }
}

function matchesToFirstBook(nodeArray) {
  var matches = nodeArray
  var indexes = determineBoundingIndexes(matches);
  var firstBookContent = matches.slice(0, indexes[1]);
  var annotations = firstBookContent.slice(1).map( (n) => new Note(n) );

  return new Book(firstBookContent[0], annotations);
}

function extractBook(fromId) {
  var book;
  var allMatches = Array.from(document.querySelectorAll(".yourHighlightsHeader, .highlightRow"));

  if (typeof(fromId) !== "undefined") {
    var ids = allMatches.map( (e) => e.id )
    var startIdx = ids.indexOf(fromId);
    book = matchesToFirstBook(allMatches.slice(startIdx));
  } else {
    book = matchesToFirstBook(allMatches).toJSON();
  }

  if (book.title.length > 0) {
    alert("A JSON representation of this book's notes is in the clipboard");
    return book;
  } else {
    alert("An error occurred. Try again.");
  }
}
