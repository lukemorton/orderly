// Orderly array processing for your asyncronous needs in
// browser and outside such realms.
// Copyright 2011, Luke Morton
// Licensed under MIT
!function (context) {
    // Orderly contains many queues
    function Orderly() {
        this.queues = [];
    }

    // To create a new OrderlyQueue pass an array to queue
    // and optionally an object with some callbacks
    // See OrderlyQueue for more information on the callbacks
    Orderly.prototype.new = function (queue, callbacks) {
        var newQueue = new OrderlyQueue(queue, callbacks);
        this.queues.push(newQueue);
        return newQueue;
    };

    // Helper function to provide a true count of an array
    function countDefinedValues(arr) {
        var count = 0;
        for (var i in arr) {
            if (typeof arr[i] !== 'undefined') count++;
        }
        return count;
    }

    // OrderlyQueue manages a single array queue
    function OrderlyQueue(queue, callbacks) {
        callbacks = callbacks || {};
        
        this.callbacks = {
            // This callback is passed errors, in fact it is
            // used as the errorCallback from the previous
            // example!
            "error"    : callbacks.error || function () {},
            
            // When successCallback has been called on all
            // items in the array complete will be called:
            //
            // function (finalArray) {}
            "complete" : callbacks.complete || function () {}
        };
        
        this.queue = queue;
        this.queueCount = countDefinedValues(queue);
        this.processes = [];
        this.processedQueue = [];
    }

    // Have all the items in this.queue been processed into
    // this.processedQueue?
    OrderlyQueue.prototype.isProcessed = function () {
        return countDefinedValues(this.processedQueue) === this.queueCount;
    };
    
    // Are there any more processes left?
    OrderlyQueue.prototype.isComplete = function () {
        return countDefinedValues(this.processes) === 0;
    };

    // Add a process function
    // This callback handles the manipulation of
    // the array, here is an example:
    //
    // function (item, successCallback, errorCallback) {
    //     if (item = doSomething(item)) {
    //         successCallback(item);
    //     } else {
    //         errorCallback('Something didn\'t happen');
    //     }
    // }
    OrderlyQueue.prototype.map = function (process) {
        this.processes.push(process);
        return this;
    };
    
    // Run through all processes
    OrderlyQueue.prototype.run = function() {
        var process = this.processes.shift(),
            queue = this.queue,
            i,
            error = this.callbacks.error,
            complete = this.callbacks.complete;
        
        for (i in queue)
            !function (q, key, itemBefore) {
                process(itemBefore, function (itemAfter) {
                    // Append to OrderlyQueue.processedQueue
                    // in order by using key
                    q.processedQueue[key] = itemAfter;
                    
                    if (q.isProcessed()) {
                        q.queue = q.processedQueue;
                        q.processedQueue = [];
                        
                        if (q.isComplete()) {
                            // All processes complete
                            complete(q.queue);
                            return;
                        }
                        
                        // Else run the next process
                        q.run();
                    }
                }, error);
            }(this, i, queue[i]);
        
        return this; 
    };
    
    // Set the error callback
    OrderlyQueue.prototype.error = function (callback) {
        this.callbacks.error = callback;
        return this;
    };

    // Set the complete callback
    OrderlyQueue.prototype.complete = function (callback) {
        this.callbacks.complete = callback;
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