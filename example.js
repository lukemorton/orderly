<!doctype html>
<html>
	<head>
		<title>An example</title>
		<meta charset="utf-8" />
	</head>
	<body>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script src="orderlyqueue.js"></script>
		<script>
			$(function () {
				var orderly = new Orderly();
				var q = orderly.queue(['hello', 'goodbye'])
					.process(function (str, handle) {
						console.log('OnReceive:', str);
						handle(str);
					})
					.complete(function (finalArr) {
						console.log('OnComplete:', finalArr);
					});

				var q2 = orderly.queue(['fixtures/a.php', 'fixtures/b.php'])
					.process(function (url, handle) {
						$.get(url, function (html) {
							console.log('OnReceive:', html);
							handle(html);
						});
					})
					.complete(function (data) {
						$.each(data, function (i, html) {
							$('body').append(html);
						});
						console.log('OnComplete:', $(data));
						//
					});
			});
		</script>
	</body>
</html>