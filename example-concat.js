var orderly = new Orderly();

orderly.queue(['example/js/*.js', 'example/css/*.css'])
	.process(function (item, success) {
		findAllFiles(item, function (files) {
			success(files);
		});
	})
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
	})
	.complete(function (files) {
		console.log(files.join("\n"));
	});