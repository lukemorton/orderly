(function (exports) {
    function Orderly() {
        this.queues = [];
    }

    Orderly.prototype.queue = function (queue, callbacks) {
        var newQueue = new OrderlyQueue(queue, callbacks);
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

    function OrderlyQueue(queue, callbacks) {
        callbacks = callbacks || {};
        this.callbacks = {
            "process" : callbacks.process || function () {},
            "complete" : callbacks.complete || function () {}
        };
        this.queue = queue;
        this.queueCount = countDefinedValues(queue);
        this.processedQueue = [];
    }

    OrderlyQueue.prototype.isProcessed = function () {
        return countDefinedValues(this.processedQueue) === this.queueCount;
    };

    OrderlyQueue.prototype.process = function (process) {
        var queue = this.queue;
            
        if (process) {
            this.callbacks.process = process;
        }
        
        for (var i in queue) {
            (function (q, key, itemBefore) {
                q.callbacks.process(itemBefore, function (itemAfter) {
                    q.processedQueue[key] = itemAfter;
                    q.complete();
                });
            }(this, i, queue[i]));
        }
        
        return this;
    };

    OrderlyQueue.prototype.complete = function (callback) {
        if (callback) {
            this.callbacks.complete = callback;
        }
        
        if (this.isProcessed()) {
            this.callbacks.complete(this.processedQueue);
        }
        
        return this;
    };
    
    exports.Orderly = Orderly;
}(this));