var orderly = new Orderly;
var q = orderly.queue(['hello', 'goodbye'])
    .complete(function (finalArr) {
        console.log('complete');
    })
    .process(function (str, handle) {
        console.log(str);
        handle(str);
    });

var q2 = orderly.queue(['a.html', 'b.html'])
    .complete(console.log)
    .process($.ge);