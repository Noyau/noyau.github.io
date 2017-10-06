function Game()
{
    this.then       = 0;
    this.now        = 0;
    
    this.frameCount = 0;
    
    this.canvas     = null;
    this.context    = null;
    
    this.player     = null;
    this.shoots     = [];
    this.corners    = [];

    this.power      = { current: 20, min: 10, max: 50, };
    this.powerBar   = null;
}

Game.current   = null;
Game.version   = "1.0";
Game.name      = "SUPER Gravity Rainbow Shooter EX ULTRA IV"
Game.maxFPS    = 60;
Game.maxShoots = 512;

Game.Keys = {
    ROT_LEFT:  [ 65, 37 ], // A, LEFT  ARROW
    ROT_RIGHT: [ 69, 39 ], // E, RIGHT ARROW
    POW_UP:    [ 90, 38 ], // Z, UP    ARROW
    POW_DOWN:  [ 83, 40 ], // S, DOWN  ARROW
    SHOOT:     [ 32 ],     // SPACE
    CLEAR:     [ 17 ],     // CONTROL
};

Game.KeysInternal = { 
    states: new Array(256),
};
Game.KeysInternal.onKeyDown = function(e) {
    Game.KeysInternal.states[e.keyCode] = true;
};
Game.KeysInternal.onKeyUp = function(e) {
    Game.KeysInternal.states[e.keyCode] = false;
};
Game.KeysInternal.registerCallbacks = function() {
    addEventListener("keydown", Game.KeysInternal.onKeyDown,  true);
    addEventListener("keyup",   Game.KeysInternal.onKeyUp,    true);
};

Game.Keys.isDown = function(keyCode) {
    var args = Array.isArray(keyCode)
        ? keyCode
        : Array.from(arguments);
    
    var argsCount = args.length;

    for(var i = 0; i < argsCount; ++i)
        if(Game.KeysInternal.states[args[i]])
            return true;
    
    return false;
};

Game.Colors = {
    frequence: 880
};

Game.Physic = {
    G: 6.67384 * 1e-11
};

Game.prototype = {
    init: function() {
        this.canvas = document.querySelector("canvas#gameCanvas");
        if (this.canvas == null)
        {
            this.canvas = document.createElement("canvas");
            this.canvas.setAttribute("id", "game");
            document.body.appendChild(this.canvas);
        }
        this.canvas.width   = window.innerWidth;
        this.canvas.height  = window.innerHeight;
        this.canvas.style.position  = "absolute";
        this.canvas.style.top       = "0px";
        this.canvas.style.left      = "0px";

        this.context = this.canvas.getContext("2d");
        
        Game.KeysInternal.registerCallbacks();
        
        var w = this.canvas.width;
        var h = this.canvas.height;
        
        this.player = new Game.Entity(w/2, h/2, 16);
        
        var _w = w * 0.25;
        var _h = h * 0.20;
        var _x = w - _w;
        var _y = h - _h;
        this.corners.push(
            new Game.Entity(_w,_h, 16),
            new Game.Entity(_x,_h,  8),
            new Game.Entity(_x,_y, 64),
            new Game.Entity(_w,_y, 32),
        );

        this.powerBar = new Game.UI.PowerBar(
            this.canvas.width * .5 - 200, this.canvas.height - 30, 400, 20, "#ecf0f1", "#27ae60");
    },
    update: function(delta) {
        if (Game.Keys.isDown(Game.Keys.ROT_LEFT))
            this.player.rotateLeft(Math.PI  * delta);
        if (Game.Keys.isDown(Game.Keys.ROT_RIGHT))
            this.player.rotateRight(Math.PI * delta);
        if (Game.Keys.isDown(Game.Keys.CLEAR))
            this.shoots.splice(0, this.shoots.length);
        if (Game.Keys.isDown(Game.Keys.POW_UP) && this.power.current < this.power.max)
            ++this.power.current;
        if (Game.Keys.isDown(Game.Keys.POW_DOWN) && this.power.current > this.power.min)
            --this.power.current;
        if (Game.Keys.isDown(Game.Keys.SHOOT) && this.shoots.length < Game.maxShoots)
            this.shoots.push(this.player.shoot(this.power.current));
        
        var now = Date.now();
        for(var i = 0; i < this.shoots.length; ++i)
        {
            if (now - this.shoots[i].birth > Game.Entity.maxLife)
            {
                this.shoots.splice(i--, 1);
                continue;
            }
            
            var F = new Core.Math.Vector();
            var avorted = false;
            for(var j = 0; j < this.corners.length && !avorted; ++j)
            {
                var r = new Core.Math.Vector(
                    this.corners[j].position.x - this.shoots[i].position.x,
                    this.corners[j].position.y - this.shoots[i].position.y
                );
                var lim = this.corners[j].radius * this.corners[j].radius;
                var ls = r.lengthSquared();
                if (ls <= lim)
                {
                    avorted = true;
                    continue;
                }
                var f = Game.Physic.G * (this.corners[j].radius * this.shoots[i].radius) / ls;
                r.normalize();
                r.scale(f);
                F.translate(r);
            }
            if (!avorted)
            {
                F.normalize();
                this.shoots[i].velocity.translate(F);
                this.shoots[i].position.translate(this.shoots[i].velocity);
            }
            else
            {
                this.shoots[i].birth -= Game.Entity.maxLife;
            }
        }
    },
    render: function() {
        var background = "rgb(31, 31, 31)";
        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = background;
        this.context.fill();
        
        this.player.render(this.context);

        GUI.strokeText(this.context, 8, 32, "Salut,", "24px Arial");
        GUI.strokeText(this.context, 8, 56, "Pour tirer c'est 'ESPACE'", "24px Arial");
        GUI.strokeText(this.context, 8, 80, "Pour tourner à gauche c'est 'A'", "24px Arial");
        GUI.strokeText(this.context, 8,104, "Pour tourner à droite c'est 'E'", "24px Arial");
        GUI.strokeText(this.context, 8,128, "Cette typo est moche hein.", "24px Arial");
        GUI.strokeText(this.context, 8,156, "Bisous <3", "24px Arial", "#faaafa");
        
        var rgbCommon = Game.Colors.frequence * this.frameCount + Math.PI * 0.33;
        for(var i = 0; i < this.shoots.length; ++i)
        {
            var r = parseInt(Math.sin(rgbCommon + i * 0.15) * 127 + 128);
            var g = parseInt(Math.sin(rgbCommon + i * 0.99) * 127 + 128);
            var b = parseInt(Math.sin(rgbCommon + i * 0.75) * 127 + 128);
            var color = "rgb("+r+","+g+","+b+")";
            this.shoots[i].render(this.context, color, color);
        }
        
        for(var i = 0; i < this.corners.length; ++i)
            this.corners[i].render(this.context, "grey", "grey");
        0
        this.powerBar.render(this.context, (this.power.current - this.power.min) / (this.power.max - this.power.min));

        ++this.frameCount;
    },
    run: function() {
        this.now = Date.now();
        var elapsed = this.now - this.then;
        //*
        if (elapsed < 1000/Game.maxFPS)
            return;
        //*/
        var delta = elapsed / 1000;
        this.then = this.now;
        
        this.update(delta);
        this.render();
    },
    start: function() {
        this.init();
        this.then = Date.now();
        var t = this;
        setInterval(function() {
            t.run();
        }, 1);
    },
};

Game.UI = {};
Game.UI.PowerBar = function(x, y, width, height, background, foreground) {
    this.x = x;
    this.y = y;
    this.width  = width  > 0 ? width  : 0;
    this.height = height > 0 ? height : 0;
    this.background = background;
    this.foreground = foreground;
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
    },
};

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
    }
};

Game.New = function(event) {
    if(Core.SafeStart(event)) {
        Game.current = new Game();
        Game.current.start();
    }
};