function Orderly() {
    this.queues = [];
}

Orderly.prototype.newQueue = function (queue) {
    var newQueue = new OrderlyQueue;
    this.queues.push(queue);
    return newQueue;
};

function OrderlyQueue(queue) {
    this.queue = queue;
    this.options = {
        "onComplete" : function () {}
    };
}

Orderly.prototype.onComplete = function (callback) {
    this.options.onComplete = callback;
    return this;
};

function countDefinedValues(arr) {
    var count = 0;
    
    for (var i in arr) {
        if (arr[i] !== undefined) count++;
    }

    return count;
}

Orderly.prototype.process = function (process) {
    var queue = this.queue,
        orderIds = 0,
        finalArray = [],
        queueCount = countDefinedValues(queue),
        onComplete = this.options.onComplete;

    function finished() {
        if (countDefinedValues(finalArray) === queueCount) {
            //console.log(thisId + ': completed');
            onComplete(finalArray);
        }
    }
    
    for (var i in queue) {
        (function () {
            var thisId = ++orderIds + 0;
            process(queue[i], function (item) {
                finalArray[thisId] = item;
                finished();
            });
        }());
    }
    
    return this;
};