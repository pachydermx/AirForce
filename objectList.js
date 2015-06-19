function objectList () {
    this.items = {};
    this.counter = 0;
    
    this.add = function (object) {
        this.items[this.counter] = object;
        this.items[this.counter].index = this.counter;
        this.counter++;
        return this.counter - 1;
    };
    
    this.remove = function (index) {
        if (typeof this.items[index] !== "undefined") {
            delete this.items[index];
        }
    };
            
}