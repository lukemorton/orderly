(function (exports) {
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
        this.options = {
            "complete" : function () {}
        };
    }

    OrderlyQueue.prototype.isProcessed = function () {
        return countDefinedValues(this.processedQueue) === this.queueCount;
    };

    OrderlyQueue.prototype.process = function (process) {
        var q = this,
            queue = this.queue,
            orderIds = 0;
        
        for (var i in queue) {
            (function () {
                var thisId = orderIds + 0;
                process(queue[i], function (item) {
                    if ( ! q.processedQueue) q.processedQueue = [];
                    q.processedQueue[thisId] = item;
                    q.complete();
                });
                ++orderIds;
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
    
    exports.Orderly = Orderly;
}(this));