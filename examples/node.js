#!/usr/bin/env node
var fs = require('fs'),
    Orderly = require('../orderly'),
    orderly = new Orderly();

orderly.new(['/etc', '/home'])
    .map(function (path, handle, error) {
        fs.readdir(path, function (err, files) {
            if (err) {
                error(err);
                return;
            }
            handle(files.slice(0, 5));
        });
    })
    .complete(function (files, err) {
        console.log(files);
    })
    .error(function (err) {
        console.log(err);
    })
    .run();
