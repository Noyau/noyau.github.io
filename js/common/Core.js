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