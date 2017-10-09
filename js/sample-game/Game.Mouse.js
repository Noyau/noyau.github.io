Game.Mouse = function() {
    this.observers  = [];

    var self = this;

    addEventListener("mousedown", function(e) { self.onMouseDown(new Game.Mouse.EventArgs(e)); }, false);
    addEventListener("mouseup",   function(e) { self.onMouseUp(new Game.Mouse.EventArgs(e));   }, false);
    addEventListener("mousemove", function(e) { self.onMouseMove(new Game.Mouse.EventArgs(e)); }, false);
};

Game.Mouse.EventArgs = function(e) {
    this.button  = e.button;
    this.buttons = e.buttons;
    this.x = e.x;
    this.y = e.y;
    this.moveX = e.movementX;
    this.moveY = e.movementY;
};

Game.Mouse.checkSelection = function() {
    var sel = window.getSelection();

    if(sel.rangeCount > 0)
        sel.removeAllRanges();
};

Game.Mouse.prototype = {
    onMouseDown: function(e) { if(this.observers.length > 0) { this.observers.forEach(function(o) { o.onMouseDown(e); });  }},
    onMouseUp:   function(e) { if(this.observers.length > 0) { this.observers.forEach(function(o) { o.onMouseUp(e);   });  }},
    onMouseMove: function(e) { if(this.observers.length > 0) { this.observers.forEach(function(o) { o.onMouseMove(e); if(e.buttons > 0) window.getSelection().removeAllRanges(); });  }},
};