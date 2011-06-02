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
