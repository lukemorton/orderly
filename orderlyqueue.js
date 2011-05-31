!function (context) {
    // Orderly contains many queues
    function Orderly() {
        this.queues = [];
    }

    // To create a new OrderlyQueue pass an array to queue
    // and optionally an object with some callbacks
    // See OrderlyQueue for more information on the callbacks
    Orderly.prototype.queue = function (queue, callbacks) {
        var newQueue = new OrderlyQueue(queue, callbacks);
        this.queues.push(newQueue);
        return newQueue;
    };

    function countDefinedValues(arr) {
        var count = 0;
        for (var i in arr) {
            if (typeof arr[i] !== 'undefined') count++;
        }
        return count;
    }

    function OrderlyQueue(queue, callbacks) {
        callbacks = callbacks || {};
        this.callbacks = {
            "process"  : callbacks.process || null,
            "error"    : callbacks.error || function () {},
            "complete" : callbacks.complete || null
        };
        this.queue = queue;
        this.queueCount = countDefinedValues(queue);
        this.processedQueue = [];
    }

    OrderlyQueue.prototype.isProcessed = function () {
        return countDefinedValues(this.processedQueue) === this.queueCount;
    };

    OrderlyQueue.prototype.process = function (process) {
        var queue = this.queue,
            i,
            error = this.callbacks.error;
        
        process = process || this.callbacks.process;
        if ( ! process) {
            return this;
        }
        
        for (i in queue)
            !function (q, key, itemBefore) {
                process(itemBefore, function (itemAfter) {
                    q.processedQueue[key] = itemAfter;
                    q.complete();
                }, error);
            }(this, i, queue[i]);
        
        return this;
    };
    
    OrderlyQueue.prototype.error = function (callback) {
        this.callbacks.error = callback;
        return this;
    };

    OrderlyQueue.prototype.complete = function (callback) {
        if (callback) {
            this.callbacks.complete = callback;
        } else {
            callback = this.callbacks.complete;
        }
        
        if (callback && this.isProcessed()) {
            callback(this.processedQueue);
        }
        
        return this;
    };
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Orderly;
    } else {
        var old = context.Orderly;
        Orderly.noConflict = function () {
            context.Orderly = old;
            return this;
        };
        context.Orderly = Orderly;
    }
}(this);