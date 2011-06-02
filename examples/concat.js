#!/usr/bin/env node
var fs = require('fs'),
    p = require('path'),
    Orderly = require('./orderly'),
    orderly = new Orderly();

orderly.queue(['./example/js', './example/css'])
    .error(function (err) {
        console.log('Error');
        console.log(err);
    })
    .process(function (path, success, error) {
        fs.readdir(path, function (err, files) {
            if (err) return error(err);
            success([path, files]);
        });
    })
    .process(function (path, success) {
        var files = path[1],
            path = path[0];

        // Ooo queues within queues!
	orderly.queue(files)
            .process(function (file, success, error) {
                console.log(path + file);
                fs.readFile(path + file, function (err, data) { 
                    success(data);
                }); 
            })
            .complete(function (data) {
                success(data.join(''));
            })
            .run();
    })/*
    .process(function (concat, success) {
        var newFilename = 'concat.' + concat[0];
        strToFile(newFilename, concat[1], function () {
            success(newFilename);
        });
    })*/
    .complete(function (files) {
        console.log('Success');
        console.log(files.join("\n"));
    })
    .run();
