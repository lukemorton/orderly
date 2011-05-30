function Orderly() {
    this.queues = [];
}

Orderly.prototype.queue = function (queue) {
    var newQueue = new OrderlyQueue(queue);
    this.queues.push(newQueue);
    return newQueue;
};

function OrderlyQueue(queue) {
    this.queue = queue;
    this.options = {
        "complete" : function () {}
    };
}

function countDefinedValues(arr) {
    var count = 0;
    for (var i in arr) {
        if (arr[i] !== undefined) count++;
    }
    return count;
}

OrderlyQueue.prototype.process = function (process) {
    var queue = this.queue,
        orderIds = 0,
        finalArray = [],
        queueCount = countDefinedValues(queue),
        onComplete = this.options.complete;
    
    for (var i in queue) {
        (function () {
            var thisId = ++orderIds + 0;
            process(queue[i], function (item) {
                finalArray[thisId] = item;
				if (countDefinedValues(finalArray) === queueCount) {
					//console.log(thisId + ': completed');
					onComplete(finalArray);
				}
            });
        }());
    }
    
    return this;
};

OrderlyQueue.prototype.complete = function (callback) {
    this.options.complete = callback;
    return this;
};