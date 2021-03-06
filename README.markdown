# Orderly

A tiny Javascript library for your browser or server to perform
ordered asynchronous array mapping.

## node.js

```
#!/usr/bin/env node
var fs = require('fs'),
    Orderly = require('../orderly'),
    orderly = new Orderly();

orderly.array(['/etc', '/home'])
    .map(function (path, success, error) {
        fs.readdir(path, function (err, files) {
            if (err) {
                error(err);
                return;
            }
            success(files.slice(0, 5));
        });
    })
    .complete(function (files) {
        console.log(files);
    })
    .error(function (err) {
        console.log(err);
    })
    .run();
```
Create a new orderly array instance with orderly.array(). With
this instance you can then call .map() any number of times to add an
additional mapping callback. Using the success or error parameters
of your callback you can asynchronously pass the new value back.

There are two additional methods you can use to add callbacks, that
is .complete() and .error(). .complete() is called upon when all
mapping callbacks have be used.

Calling .run() finally will start the mapping process.

## browser

```
// Let's do some AJAX
orderly.array(['php/a.php', 'php/b.php'])
	// Use jQuery's GET AJAX method
	.map(function (url, success) {
		$.get(url, success);
	})
	.map(function (html, success) {
		success(html);
	})
	// Even though fixtures/a.php has a timeout we
	// still receive the html in the order [a, b]
	.complete(function (arr) {
		console.log('complete', arr);
	})
	.run();
```

Using Orderly is just as easy in the browser.

# Author

Luke Morto

# License

MIT
