# amaJSON
A chrome extension for exporting notes on a book as JSON

## Status

Early release to get it out the door. Not entirely reliable, not entirely clean. Still very proof of concept but, hey, works on my machine :)

## Usage

### Scroll to find the book you want to export.

![Scrolling to "The Breakdown of Consciousness"](./img/1.png)

### Scroll down to the _following_ book

![Scrolling to the following book](./img/2.png)

You need all the notes for the book you want to appear on the screen. Amazon loads notes bit-by-bit. To make sure you export everything, be sure to have all the notes on screen.

### Scroll back _up_ to the book title you want

### Right Click

![Scrolling to the following book](./img/3.png)

### Choose AmaJSON export

![Scrolling to the following book](./img/3.png)

### Alert

Alerts will tell you whether the copy was successful. You might run into a bug here that tells you to do the last step again. Do so!

### Viol&agrave;

You now have a JSON representation of your book notes. I save mine to a file. If you want to see a pretty-printed version of the structure of your notes. Feed the contents of your clipboard into http://jsonprettyprint.com

## Installation

Eventually this may reach the Chrome Extensions store. For the time being, take
the `src` directory and put it somewhere on your hard disk. You might want to
rename the directory to something like `amaJSON` or `kindle_exporter`.

1. Navigate to  `chrome://extensions`
1. Click the checkbox in the top right to enable "Developer Mode."
1. Click "Load unpacked extension..."
1. Provide the path to the `src` directory.
1. Reload your Kindle notes page. You should now be able to click on a book title and export it.

## Bugs

1. When the page first loads, the export sometimes fails. We should handle this better than with a [hokey alert()](https://github.com/sgharms/amaJSON/issues/1).
1. [Annoying alerts fire multiple times](https://github.com/sgharms/amaJSON/issues/2)
1. Should distribute via Chrome store, not Github.
1. I'm unsure what happens if you have only 1 book.
