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

    function OrderlyQueue(queue, options) {
        options = options || {};
        this.queue = queue;
        this.queueCount = countDefinedValues(queue);
        this.processedQueue = [];
        this.options = {
            "complete" : options.complete || function () {}
        };
    }

    OrderlyQueue.prototype.isProcessed = function () {
        return countDefinedValues(this.processedQueue) === this.queueCount;
    };

    OrderlyQueue.prototype.process = function (process) {
        var q = this,
            queue = this.queue;
        
        for (var i in queue) {
            (function (key) {
                process(queue[key], function (item) {
                    q.processedQueue[key] = item;
                    q.complete();
                });
            }(i));
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