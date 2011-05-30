var orderly = new Orderly;
var q = orderly.newQueue(['hello', 'goodbye'])
    .complete(function (finalArr) {
        console.log('complete');
    })
    .process(function (str, handle) {
        console.log(str);
        handle(str);
    });

var q2 = orderly.newQueue(['a.html', 'b.html'])
    .complete(function (finalArr) {
        console.log(finalArr);
    })
    .process(function (url, handle) {
        $.get(url, handle);
    });