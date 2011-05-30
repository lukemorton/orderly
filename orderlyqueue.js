function Orderly() {
    this.queues = [];
}

Orderly.prototype.queue = function (queue) {
    var newQueue = new OrderlyQueue(queue);
    this.queues.push(newQueue);
    return newQueue;
};

function countDefinedValues(arr) {
    var count = 0;
    for (var i in arr) {
        if (arr[i] !== undefined) count++;
    }
    return count;
}

function OrderlyQueue(queue) {
    this.queue = queue;
    this.queueCount = countDefinedValues(queue);
    this.processedQueue = [];
    this.options = {
        "complete" : function () {}
    };
    this.isProcessed = false;
}

OrderlyQueue.prototype.isProcessed = function () {
    return countDefinedValues(this.processedQueue) === this.queueCount;
};

OrderlyQueue.prototype.process = function (process) {
    var queue = this.queue,
        orderIds = 0;
    
    for (var i in queue) {
        (function () {
            var thisId = ++orderIds + 0;
            process(queue[i], function (item) {
                this.processedQueue[thisId] = item;
                this.complete();
            });
        }());
    }
    
    return this;
};

OrderlyQueue.prototype.complete = function (callback) {
    if (callback) {
        this.options.complete = callback;
    }
    
    if (this.isProcessed()) {
        this.options.complete(this.processedQueue);
    }
    
    return this;
};