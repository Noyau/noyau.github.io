Core.Structs = {};

Core.Structs.Gauge = function(value, min, max) {
    this.value = value;
    this.min = min;
    this.max = max;
};

Core.Structs.Gauge.prototype = {
    add: function(amount) {
        if((this.value += amount) > this.max)
            this.value = this.max;
    },
    sub: function(amount) {
        if((this.value -= amount) < this.min)
            this.value = this.min;
    },
    ratio: function() {
        return (this.value - this.min) / (this.max - this.min);
    },
};