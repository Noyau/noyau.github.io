function Core () {}

Core.SafeStart = function(event) {
    if (event.defaultPrevented)
    {
        var err = document.querySelector("div.error.game");

        if (err == null)
        {
            err = document.createElement("div");
            err.setAttribute("class", "error game");
            document.body.appendChild(err);
        }
        
        err.innerHTML = "Game Canceled, Sorry. :(";
        
        return false;
    }
    return true;
};

Core.CheckType = function (type, arg) {
    if (typeof arg !== type)
        throw new TypeError("Param '" + arg + "' must be a " + type);
};

Core.Math = {
    PI2:   Math.PI * 2.0,
    PI_36: Math.PI / 36
};

Core.Math.Vector = function(x = 0.0, y = 0.0, z = 0.0) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Core.Math.Vector.prototype = {
    toString: function() {
        return "Vector { x: " + this.x.toString() + ", y: " + this.y.toString() + ", z: " + this.z.toString() + " }";
    },
    clone: function() {
        return new Core.Math.Vector(this.x, this.y, this.z);
    },
    lengthSquared: function() {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    },
    length: function() {
        return Math.sqrt(this.lengthSquared());
    },
    normalize: function() {
        var l = this.length();
        if (l == 0.0)
            return;
        this.x /= l;
        this.y /= l;
        this.z /= l;
    },
    normalized: function() {
        var v = this.clone();
        v.normalize();
        return v;
    },
    scale: function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    },
    scaled: function(s) {
        var v = this.clone();
        v.scale(s);
        return v;
    },
    translate: function(vt) {
        this.x += vt.x;
        this.y += vt.y;
        this.z += vt.z;
    },
    translated: function(vt) {
        var v = this.clone();
        v.translate(vt);
        return v;
    }
};