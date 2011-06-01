#!/usr/bin/env node
var fs = require('fs'),
    Orderly = require('./orderlyqueue'),
    orderly = new Orderly();

orderly.queue(['./example/js', './example/css'])
    .error(function (err) {
        console.log('Error');
        console.log(err);
    })
    .process(function (path, success, error) {
        fs.readdir(path, function (err, files) {
            if (err) {
                error(err);
                return;
            }
            success(files);
        });
    })/*
    .process(function (files, success) {
        var fileType = getFileType(files);
        concatFiles(files, function (concatStr) {
            success([fileType, concatStr]);
        });
    })
    .process(function (concat, success) {
        var newFilename = 'concat.' + concat[0];
        strToFile(newFilename, concat[1], function () {
            success(newFilename);
        });
    })*/
    .complete(function (files) {
        console.log('Success');
        console.log(files.join("\n"));
    });
