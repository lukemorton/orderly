#!/usr/bin/env node
var fs = require('fs'),
    orderly = new require('./orderlyqueue');

orderly.queue(['/home', '/etc'])
    .process(function (path, handle, error) {
        fs.readdir(path, function (err, files) {
            if (err) error(err);
            handle(files.slice(0, 5));
        });
    })
    .error(function (err) {
        console.log(err);
    })
    .complete(function (files) {
        console.log(files);
    });