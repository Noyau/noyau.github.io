Game.UI = {};
Game.UI.PowerBar = function(x, y, width, height, background, foreground, label) {
    this.x = x;
    this.y = y;
    this.width  = width  > 0 ? width  : 0;
    this.height = height > 0 ? height : 0;
    this.background = background;
    this.foreground = foreground;
    this.label = label;
};
Game.UI.PowerBar.prototype = {
    render: function(context, power) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.background;
        context.fill();

        var x = this.x + 2;
        var y = this.y + 2;
        var w = this.width  - 4;
        var h = this.height - 4;

        context.beginPath();
        context.rect(x, y, w * power, h);
        context.fillStyle = this.foreground;
        context.fill();
        
        h -= 4;
        x = this.x + this.width  + 10;
        y = this.y + (this.height - h) * .5 + 10;

        context.beginPath();
        context.font = h + "px Tahoma";
        context.textAlign = "left";
        context.fillStyle = "#fafafa";
        context.fillText(this.label, x, y);
    },
};

Game.UI.AmmoBar = function(x, y, width, height, background, label) {
    this.x = x;
    this.y = y;
    this.width  = width  > 0 ? width  : 0;
    this.height = height > 0 ? height : 0;
    this.background = background;
    this.label = label;
};
Game.UI.AmmoBar.prototype = {
    render: function(context, ammo, time) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.background;
        context.fill();

        var x = this.x + 2;
        var y = this.y + 2;
        var w = this.width  - 4;
        var h = this.height - 4;

        var r = parseInt(Math.sin(time * .2 + 0.15) * 127 + 128);
        var g = parseInt(Math.sin(time * .3 + 0.99) * 127 + 128);
        var b = parseInt(Math.sin(time * .7 + 0.75) * 127 + 128);
        
        context.beginPath();
        context.rect(x, y, w * ammo, h);
        context.fillStyle = "rgb("+r+","+g+","+b+")";
        context.fill();

        h -= 4;
        x = this.x + this.width  + 10;
        y = this.y + (this.height - h) * .5 + 10;

        context.beginPath();
        context.font = h + "px Tahoma";
        context.textAlign = "left";
        context.fillStyle = "#fafafa";
        context.fillText(this.label, x, y);
    },
};