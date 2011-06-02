#!/usr/bin/env node
var fs = require('fs'),
    p = require('path'),
    Orderly = require('../orderly'),
    orderly = new Orderly();

orderly.array(['./js', './css'])
    .map(function (path, success, error) {
        fs.readdir(path, function (err, files) {
            if (err) return error(err);
            success([path, files]);
        });
    })
    .map(function (path, success) {
        var files = path[1],
            path = path[0];

        // Ooo queues within queues!
	orderly.array(files)
            .map(function (file, success, error) {
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
    .map(function (concat, success) {
        var newFilename = 'concat.' + concat[0];
        strToFile(newFilename, concat[1], function () {
            success(newFilename);
        });
    })*/
    .complete(function (files) {
        console.log('Success');
        console.log(files.join("\n"));
    })
    .error(function (err) {
        console.log('Error');
        console.log(err);
    })
    .run();
