Game.Entity = function(x = 0, y = 0, r = 16, vx = 0, vy = 0, t = 0) {
    this.position = new Core.Math.Vector(x, y);
    this.velocity = new Core.Math.Vector(vx, vy);
    this.radius   = r;
    this.theta    = t;
    this.birth    = Date.now();
};

Game.Entity.maxLife = 360000000; 

Game.Entity.prototype = {
    rotateLeft: function(step = Core.Math.PI_36) {
        this.theta -= step;
    },
    rotateRight: function(step = Core.Math.PI_36) {
        this.theta += step;
    },
    shoot: function(power) {
        var vx = (this.radius + power) * Math.cos(this.theta);
        var vy = (this.radius + power) * Math.sin(this.theta);
        var x = this.position.x + vx;
        var y = this.position.y + vy;
        return new Game.Entity(x, y, this.radius * 0.15, vx, vy, this.theta);
    },
    render: function(context, c1 = "orange", c2 = "black") {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, Core.Math.PI2, false);
        context.fillStyle = c1;
        context.fill();
        
        var rx = this.position.x + this.radius * Math.cos(this.theta);
        var ry = this.position.y + this.radius * Math.sin(this.theta);
        
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(rx, ry);
        context.strokeStyle = c2;
        context.stroke();
    },
    onMouseDown: function(e) {
        this.dragging = this.contains2D(e);
    },
    onMouseUp:   function(e) {
        this.dragging = false;
    },
    onMouseMove: function(e) {
        if(this.dragging) {
            this.position.x = e.x;
            this.position.y = e.y;
        }
    },
    contains2D: function(point) {
        var dx = point.x - this.position.x;
        var dy = point.y - this.position.y;
        var rr = this.radius * this.radius;
        return dx * dx + dy * dy < rr;
    },
};